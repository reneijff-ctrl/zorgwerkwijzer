package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.repository.ProfileRepository;
import nl.zorgwerkwijzer.service.FileStorageService;
import nl.zorgwerkwijzer.service.SupabaseStorageService;
import nl.zorgwerkwijzer.service.impl.LocalFileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Tag(name = "CV Upload", description = "CV bestand upload endpoint")
@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
@Slf4j
public class CvUploadController {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    // Whitelist op basis van Content-Type header (eerste laag)
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    // PDF magic bytes: %PDF-
    private static final byte[] PDF_MAGIC   = { 0x25, 0x50, 0x44, 0x46, 0x2D };
    // DOCX/DOC magic bytes: PK (ZIP/OLE)
    private static final byte[] DOCX_MAGIC  = { 0x50, 0x4B, 0x03, 0x04 };
    private static final byte[] DOC_MAGIC   = { (byte) 0xD0, (byte) 0xCF, 0x11, (byte) 0xE0 };

    private final SupabaseStorageService supabaseStorageService;
    private final LocalFileStorageService localFileStorageService;
    private final ProfileRepository profileRepository;

    @Operation(summary = "Upload CV bestand (PDF, DOC, DOCX — max 5 MB)")
    @PostMapping("/upload-cv")
    public ResponseEntity<?> uploadCv(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bestand is leeg"));
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bestand is te groot (max 5 MB)"));
        }

        // Laag 1: Content-Type header check
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Alleen PDF, DOC en DOCX bestanden zijn toegestaan"));
        }

        // Laag 2: Magic bytes check — voorkomt dat een kwaadaardig bestand
        // met een gespoofde Content-Type header wordt geaccepteerd
        try {
            if (!hasValidMagicBytes(file)) {
                log.warn("[SECURITY] CV upload afgewezen — magic bytes komen niet overeen met Content-Type={} user={}",
                        file.getContentType(), userDetails.getUsername());
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Bestandsinhoud komt niet overeen met het opgegeven bestandstype"));
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Kan bestand niet lezen"));
        }

        try {
            // Kies storage: Supabase als geconfigureerd, anders lokaal
            FileStorageService storage = supabaseStorageService.isConfigured()
                    ? supabaseStorageService
                    : localFileStorageService;

            String cvUrl = storage.uploadFile(file, "cvs");

            // Sla cv_url op in profiel
            profileRepository.findByEmail(userDetails.getUsername()).ifPresent(profile -> {
                profile.setCvUrl(cvUrl);
                profileRepository.save(profile);
            });

            log.info("[AUDIT] CV_UPLOADED user={} url={}", userDetails.getUsername(), cvUrl);
            return ResponseEntity.ok(Map.of("cvUrl", cvUrl));

        } catch (Exception e) {
            log.error("CV upload mislukt voor user={}: {}", userDetails.getUsername(), e.getMessage());
            return ResponseEntity.status(503).body(Map.of(
                    "error", "Upload mislukt",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Valideert de magic bytes (bestandssignatuur) van het geüploade bestand.
     * Dit voorkomt dat een kwaadaardig bestand (bijv. een executable) wordt
     * geüpload met een vervalste Content-Type header.
     */
    private boolean hasValidMagicBytes(MultipartFile file) throws IOException {
        byte[] header = file.getBytes();
        if (header.length < 4) return false;

        String contentType = file.getContentType();
        if ("application/pdf".equals(contentType)) {
            return startsWith(header, PDF_MAGIC);
        } else if ("application/vnd.openxmlformats-officedocument.wordprocessingml.document".equals(contentType)) {
            return startsWith(header, DOCX_MAGIC);
        } else if ("application/msword".equals(contentType)) {
            // .doc kan zowel OLE compound als ZIP zijn
            return startsWith(header, DOC_MAGIC) || startsWith(header, DOCX_MAGIC);
        }
        return false;
    }

    private boolean startsWith(byte[] data, byte[] prefix) {
        if (data.length < prefix.length) return false;
        for (int i = 0; i < prefix.length; i++) {
            if (data[i] != prefix[i]) return false;
        }
        return true;
    }
}

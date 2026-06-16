package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.model.Employer;
import nl.zorgwerkwijzer.repository.EmployerRepository;
import nl.zorgwerkwijzer.service.FileStorageService;
import nl.zorgwerkwijzer.service.SupabaseStorageService;
import nl.zorgwerkwijzer.service.impl.LocalFileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Tag(name = "Employer Image Upload", description = "Logo en header afbeelding upload voor werkgevers")
@RestController
@RequestMapping("/api/v1/employers")
@RequiredArgsConstructor
@Slf4j
public class EmployerImageUploadController {

    private static final long MAX_LOGO_SIZE   = 5L  * 1024 * 1024; // 5 MB
    private static final long MAX_HEADER_SIZE = 10L * 1024 * 1024; // 10 MB

    private static final List<String> ALLOWED_IMAGE_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private static final String LOGO_BUCKET   = "company-logos";
    private static final String HEADER_BUCKET = "company-headers";

    private final SupabaseStorageService supabaseStorageService;
    private final LocalFileStorageService localFileStorageService;
    private final EmployerRepository employerRepository;

    @Operation(summary = "Upload bedrijfslogo (JPG, PNG, WEBP – max 5 MB)")
    @PostMapping("/{id}/upload-logo")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadLogo(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        ResponseEntity<?> validation = validateImage(file, MAX_LOGO_SIZE, "logo");
        if (validation != null) return validation;

        Employer employer = employerRepository.findById(id).orElse(null);
        if (employer == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            FileStorageService storage = supabaseStorageService.isConfigured()
                    ? supabaseStorageService
                    : localFileStorageService;

            String logoUrl = storage.uploadFile(file, "logos", LOGO_BUCKET);
            employer.setLogoUrl(logoUrl);
            employerRepository.save(employer);

            log.info("[AUDIT] EMPLOYER_LOGO_UPLOADED employer={} user={} url={}", id, userDetails.getUsername(), logoUrl);
            return ResponseEntity.ok(Map.of("logoUrl", logoUrl));
        } catch (Exception e) {
            log.error("Logo upload mislukt voor employer={}: {}", id, e.getMessage());
            return ResponseEntity.status(503).body(Map.of("error", "Upload mislukt", "message", e.getMessage()));
        }
    }

    @Operation(summary = "Upload header afbeelding (JPG, PNG, WEBP – max 10 MB)")
    @PostMapping("/{id}/upload-header")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadHeader(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        ResponseEntity<?> validation = validateImage(file, MAX_HEADER_SIZE, "header");
        if (validation != null) return validation;

        Employer employer = employerRepository.findById(id).orElse(null);
        if (employer == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            FileStorageService storage = supabaseStorageService.isConfigured()
                    ? supabaseStorageService
                    : localFileStorageService;

            String coverImageUrl = storage.uploadFile(file, "headers", HEADER_BUCKET);
            employer.setCoverImageUrl(coverImageUrl);
            employerRepository.save(employer);

            log.info("[AUDIT] EMPLOYER_HEADER_UPLOADED employer={} user={} url={}", id, userDetails.getUsername(), coverImageUrl);
            return ResponseEntity.ok(Map.of("coverImageUrl", coverImageUrl));
        } catch (Exception e) {
            log.error("Header upload mislukt voor employer={}: {}", id, e.getMessage());
            return ResponseEntity.status(503).body(Map.of("error", "Upload mislukt", "message", e.getMessage()));
        }
    }

    @Operation(summary = "Verwijder bedrijfslogo")
    @DeleteMapping("/{id}/logo")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteLogo(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Employer employer = employerRepository.findById(id).orElse(null);
        if (employer == null) return ResponseEntity.notFound().build();

        employer.setLogoUrl(null);
        employerRepository.save(employer);
        log.info("[AUDIT] EMPLOYER_LOGO_DELETED employer={} user={}", id, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Logo verwijderd"));
    }

    @Operation(summary = "Verwijder header afbeelding")
    @DeleteMapping("/{id}/header")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteHeader(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Employer employer = employerRepository.findById(id).orElse(null);
        if (employer == null) return ResponseEntity.notFound().build();

        employer.setCoverImageUrl(null);
        employerRepository.save(employer);
        log.info("[AUDIT] EMPLOYER_HEADER_DELETED employer={} user={}", id, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Header afbeelding verwijderd"));
    }

    private ResponseEntity<?> validateImage(MultipartFile file, long maxSize, String type) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bestand is leeg"));
        }
        if (file.getSize() > maxSize) {
            long mb = maxSize / (1024 * 1024);
            return ResponseEntity.badRequest().body(Map.of("error", "Bestand is te groot (max " + mb + " MB)"));
        }
        if (!ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Alleen JPG, PNG en WEBP bestanden zijn toegestaan"));
        }
        return null;
    }
}

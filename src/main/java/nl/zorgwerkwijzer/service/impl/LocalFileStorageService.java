package nl.zorgwerkwijzer.service.impl;

import nl.zorgwerkwijzer.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.upload.base-url:http://localhost:8080}")
    private String baseUrl;

    @Override
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String sanitizedExtension = sanitizeExtension(file.getOriginalFilename());
        // Gebruik UUID als bestandsnaam — originele naam wordt nooit opgeslagen (path traversal preventie)
        String filename = UUID.randomUUID() + sanitizedExtension;

        Path uploadPath = Paths.get(uploadDir, folder);
        Files.createDirectories(uploadPath);

        // Gebruik resolve() — gooit een exception als filename een scheidingsteken bevat
        Path filePath = uploadPath.resolve(filename);

        // Extra veiligheid: controleer dat het pad onder uploadPath blijft
        if (!filePath.normalize().startsWith(uploadPath.normalize())) {
            throw new IOException("Ongeldige bestandsnaam — path traversal gedetecteerd");
        }

        Files.write(filePath, file.getBytes());

        return baseUrl + "/uploads/" + folder + "/" + filename;
    }

    @Override
    public String uploadFile(MultipartFile file, String folder, String bucket) throws IOException {
        // Lokale opslag negeert bucket-parameter
        return uploadFile(file, folder);
    }

    @Override
    public boolean isConfigured() {
        return true;
    }

    /**
     * Extraheert uitsluitend de extensie van de originele bestandsnaam.
     * Alleen whitelisted extensies (.pdf, .doc, .docx) worden toegestaan.
     * Alle andere extensies worden genegeerd (geen extensie = lege string).
     */
    private String sanitizeExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return "";
        }
        String ext = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        return switch (ext) {
            case ".pdf", ".doc", ".docx" -> ext;
            case ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg" -> ext;
            default -> "";
        };
    }
}

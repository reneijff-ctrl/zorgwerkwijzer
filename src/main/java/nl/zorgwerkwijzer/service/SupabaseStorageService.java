package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.config.SupabaseProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

@Service
public class SupabaseStorageService implements FileStorageService {

    private final SupabaseProperties supabaseProperties;

    public SupabaseStorageService(SupabaseProperties supabaseProperties) {
        this.supabaseProperties = supabaseProperties;
    }

    @Override
    public boolean isConfigured() {
        return StringUtils.hasText(supabaseProperties.getUrl())
                && StringUtils.hasText(supabaseProperties.getKey());
    }

    @Override
    public String uploadFile(MultipartFile file, String folder) throws IOException, InterruptedException {
        return uploadFile(file, folder, supabaseProperties.getBucket());
    }

    @Override
    public String uploadFile(MultipartFile file, String folder, String bucket) throws IOException, InterruptedException {
        if (!isConfigured()) {
            throw new IOException("Supabase is niet geconfigureerd. Stel SUPABASE_URL en SUPABASE_SERVICE_KEY in als omgevingsvariabelen.");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID() + extension;
        String objectPath = folder + "/" + filename;

        String uploadUrl = supabaseProperties.getUrl()
                + "/storage/v1/object/" + bucket + "/" + objectPath;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uploadUrl))
                .header("Authorization", "Bearer " + supabaseProperties.getKey())
                .header("Content-Type", file.getContentType())
                .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200 && response.statusCode() != 201) {
            throw new IOException("Supabase upload mislukt: " + response.statusCode() + " — " + response.body());
        }

        return supabaseProperties.getUrl()
                + "/storage/v1/object/public/" + bucket + "/" + objectPath;
    }
}

package nl.zorgwerkwijzer.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {

    String uploadFile(MultipartFile file, String folder) throws IOException, InterruptedException;

    String uploadFile(MultipartFile file, String folder, String bucket) throws IOException, InterruptedException;

    boolean isConfigured();
}

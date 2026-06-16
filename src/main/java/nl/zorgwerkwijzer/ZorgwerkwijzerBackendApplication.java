package nl.zorgwerkwijzer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ZorgwerkwijzerBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZorgwerkwijzerBackendApplication.class, args);
    }
}

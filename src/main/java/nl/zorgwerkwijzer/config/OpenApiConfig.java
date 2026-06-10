package nl.zorgwerkwijzer.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI zorgwerkwijzerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Zorgwerkwijzer API")
                        .description("Backend API for the Zorgwerkwijzer application, providing salary and ORT calculations, and healthcare provider information.")
                        .version("v0.0.1")
                        .contact(new Contact()
                                .name("Zorgwerkwijzer Team")
                                .email("info@zorgwerkwijzer.nl")
                                .url("https://www.zorgwerkwijzer.nl"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")));
    }
}

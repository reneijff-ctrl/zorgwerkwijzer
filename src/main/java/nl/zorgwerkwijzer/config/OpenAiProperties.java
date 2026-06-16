package nl.zorgwerkwijzer.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "openai")
@Getter
@Setter
@Slf4j
public class OpenAiProperties {

    private String apiKey = "";
    private String model = "gpt-4o-mini";
    private int maxTokens = 2000;

    @PostConstruct
    public void validate() {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("[AI] OpenAI API key ontbreekt — AI-nieuwsanalyse is uitgeschakeld. Stel OPENAI_API_KEY in als environment variable.");
        } else {
            log.info("[AI] OpenAI succesvol geconfigureerd — model={}, maxTokens={}", model, maxTokens);
        }
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }
}

package nl.zorgwerkwijzer.service.impl;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.service.TotpService;
import org.springframework.stereotype.Service;

import java.util.Base64;

import static dev.samstevens.totp.util.Utils.getDataUriForImage;

@Slf4j
@Service
public class TotpServiceImpl implements TotpService {

    private static final String ISSUER = "ZorgWerkwijzer";
    private static final int SECRET_LENGTH = 32;
    private static final int TIME_PERIOD = 30;
    private static final int CODE_DIGITS = 6;
    private static final int ALLOWED_DISCREPANCY = 1;

    private final DefaultSecretGenerator secretGenerator = new DefaultSecretGenerator(SECRET_LENGTH);
    private final CodeGenerator codeGenerator = new DefaultCodeGenerator(HashingAlgorithm.SHA1, CODE_DIGITS);
    private final DefaultCodeVerifier codeVerifier;

    public TotpServiceImpl() {
        this.codeVerifier = new DefaultCodeVerifier(codeGenerator, new SystemTimeProvider());
        this.codeVerifier.setAllowedTimePeriodDiscrepancy(ALLOWED_DISCREPANCY);
    }

    @Override
    public String generateSecret() {
        return secretGenerator.generate();
    }

    @Override
    public String generateOtpAuthUri(String secret, String email) {
        QrData data = new QrData.Builder()
                .label(email)
                .secret(secret)
                .issuer(ISSUER)
                .algorithm(HashingAlgorithm.SHA1)
                .digits(CODE_DIGITS)
                .period(TIME_PERIOD)
                .build();
        return data.getUri();
    }

    @Override
    public String generateQrCodeDataUri(String otpAuthUri) {
        try {
            ZxingPngQrGenerator generator = new ZxingPngQrGenerator();
            byte[] imageData = generator.generate(new QrData.Builder()
                    .label("")
                    .secret("")
                    .issuer(ISSUER)
                    .build());
            // Gebruik de otpAuthUri direct voor QR-generatie
            QrData qrData = parseOtpAuthUri(otpAuthUri);
            imageData = generator.generate(qrData);
            return getDataUriForImage(imageData, generator.getImageMimeType());
        } catch (Exception e) {
            log.error("[2FA] QR-code generatie mislukt: {}", e.getMessage());
            return "";
        }
    }

    @Override
    public boolean verifyCode(String secret, String code) {
        if (secret == null || code == null) return false;
        try {
            return codeVerifier.isValidCode(secret, code);
        } catch (Exception e) {
            log.warn("[2FA] Code verificatie mislukt: {}", e.getMessage());
            return false;
        }
    }

    private QrData parseOtpAuthUri(String uri) {
        // Eenvoudige parser: extraheer secret en label uit otpauth URI
        // Format: otpauth://totp/label?secret=SECRET&issuer=ISSUER&...
        String secret = "";
        String label = "";
        try {
            String query = uri.substring(uri.indexOf('?') + 1);
            String path = uri.substring(uri.indexOf("totp/") + 5, uri.indexOf('?'));
            label = java.net.URLDecoder.decode(path, java.nio.charset.StandardCharsets.UTF_8);
            for (String param : query.split("&")) {
                if (param.startsWith("secret=")) {
                    secret = param.substring(7);
                }
            }
        } catch (Exception e) {
            log.warn("[2FA] URI parsing mislukt: {}", e.getMessage());
        }
        return new QrData.Builder()
                .label(label)
                .secret(secret)
                .issuer(ISSUER)
                .algorithm(HashingAlgorithm.SHA1)
                .digits(CODE_DIGITS)
                .period(TIME_PERIOD)
                .build();
    }
}

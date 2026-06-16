package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.config.ResendProperties;
import nl.zorgwerkwijzer.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * E-mailservice implementatie via de Resend HTTP API.
 *
 * <p>Alle e-mails worden verstuurd via POST https://api.resend.com/emails.
 * Wanneer RESEND_API_KEY niet is ingesteld, worden e-mails overgeslagen
 * zonder de applicatie te blokkeren.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final ResendProperties resendProperties;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.resend.com")
            .build();

    @Value("${app.mail.from:noreply@zorgwerkwijzer.nl}")
    private String fromAddress;

    // ─── Public methods ──────────────────────────────────────────────────────

    @Override
    public void sendApplicationViewedEmail(String toEmail, String firstName,
                                           String vacancyTitle, String employerName) {
        send(toEmail,
                "Je sollicitatie is bekeken",
                buildViewedHtml(firstName, vacancyTitle, employerName));
    }

    @Override
    public void sendApplicationInvitedEmail(String toEmail, String firstName,
                                            String vacancyTitle, String employerName) {
        send(toEmail,
                "Je bent uitgenodigd voor een gesprek",
                buildInvitedHtml(firstName, vacancyTitle, employerName));
    }

    @Override
    public void sendApplicationAcceptedEmail(String toEmail, String firstName,
                                             String vacancyTitle, String employerName) {
        send(toEmail,
                "Gefeliciteerd! Je bent aangenomen",
                buildAcceptedHtml(firstName, vacancyTitle, employerName));
    }

    @Override
    public void sendApplicationRejectedEmail(String toEmail, String firstName,
                                             String vacancyTitle, String employerName) {
        send(toEmail,
                "Update over je sollicitatie",
                buildRejectedHtml(firstName, vacancyTitle, employerName));
    }

    @Override
    public void sendPaymentFailedEmail(String toEmail, String employerName) {
        send(toEmail,
                "Betaling mislukt – actie vereist",
                buildPaymentFailedHtml(employerName));
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken, String frontendUrl) {
        send(toEmail,
                "Wachtwoord opnieuw instellen — ZorgWerkwijzer",
                buildPasswordResetHtml(resetToken, frontendUrl));
    }

    @Override
    public void sendEmailVerificationEmail(String toEmail, String verificationToken, String frontendUrl) {
        send(toEmail,
                "Verifieer uw e-mailadres — ZorgWerkwijzer",
                buildEmailVerificationHtml(verificationToken, frontendUrl));
    }

    @Override
    public void sendContactMessage(String name, String email, String message, String adminEmail) {
        send(adminEmail,
                "Nieuw contactbericht van " + name + " — ZorgWerkwijzer",
                buildContactMessageHtml(name, email, message));
    }

    @Override
    public void sendContactConfirmation(String toEmail, String name, String message) {
        send(toEmail,
                "Bedankt voor uw bericht — ZorgWerkwijzer",
                buildContactConfirmationHtml(name, message));
    }

    @Override
    public void sendContactReply(String toEmail, String toName, String subject, String replyMessage) {
        send(toEmail, subject, buildContactReplyHtml(toName, replyMessage));
    }

    // ─── HTML Templates ───────────────────────────────────────────────────────

    private String buildViewedHtml(String firstName, String vacancyTitle, String employerName) {
        return wrapHtml("Je sollicitatie is bekeken", """
                <p>Beste %s,</p>
                <p>Je sollicitatie voor de functie <strong>%s</strong> bij <strong>%s</strong>
                is bekeken door de werkgever.</p>
                <p>We houden je op de hoogte van de volgende stappen.</p>
                """.formatted(firstName, vacancyTitle, employerName));
    }

    private String buildInvitedHtml(String firstName, String vacancyTitle, String employerName) {
        return wrapHtml("Uitgenodigd voor een gesprek", """
                <p>Beste %s,</p>
                <p>Goed nieuws! Je bent uitgenodigd voor een gesprek voor de functie
                <strong>%s</strong> bij <strong>%s</strong>.</p>
                <p>Log in op ZorgWerkwijzer voor verdere informatie en neem contact op met de werkgever.</p>
                """.formatted(firstName, vacancyTitle, employerName));
    }

    private String buildAcceptedHtml(String firstName, String vacancyTitle, String employerName) {
        return wrapHtml("Gefeliciteerd!", """
                <p>Beste %s,</p>
                <p>Gefeliciteerd! Je bent aangenomen voor de functie <strong>%s</strong>
                bij <strong>%s</strong>.</p>
                <p>Wij wensen je veel succes in je nieuwe functie.</p>
                """.formatted(firstName, vacancyTitle, employerName));
    }

    private String buildRejectedHtml(String firstName, String vacancyTitle, String employerName) {
        return wrapHtml("Update over je sollicitatie", """
                <p>Beste %s,</p>
                <p>Bedankt voor je sollicitatie op <strong>%s</strong> bij <strong>%s</strong>.</p>
                <p>Helaas heeft de werkgever besloten verder te gaan met andere kandidaten.</p>
                <p>Wij wensen je veel succes bij je verdere zoektocht op ZorgWerkwijzer.</p>
                """.formatted(firstName, vacancyTitle, employerName));
    }

    private String buildPaymentFailedHtml(String employerName) {
        return wrapHtml("Betaling mislukt", """
                <p>Beste %s,</p>
                <p>De betaling voor uw ZorgWerkwijzer abonnement is mislukt.</p>
                <p>Uw vacatures blijven tijdelijk zichtbaar, maar om uw account actief te houden
                verzoeken wij u uw betaalgegevens bij te werken via uw abonnementsbeheer.</p>
                <p>Log in op ZorgWerkwijzer en ga naar <strong>Abonnement</strong> om uw betalingsmethode bij te werken.</p>
                """.formatted(employerName));
    }

    private String buildPasswordResetHtml(String resetToken, String frontendUrl) {
        String resetLink = frontendUrl + "/wachtwoord-vergeten/reset?token=" + resetToken;
        return wrapHtml("Wachtwoord opnieuw instellen", """
                <p>Beste gebruiker,</p>
                <p>We hebben een verzoek ontvangen om uw wachtwoord opnieuw in te stellen.</p>
                <p>Klik op de onderstaande knop om een nieuw wachtwoord in te stellen.
                Deze link is <strong>1 uur geldig</strong>.</p>
                <p style="text-align:center;margin:32px 0;">
                  <a href="%s" style="background:#2563eb;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;">
                    Wachtwoord opnieuw instellen
                  </a>
                </p>
                <p style="color:#6b7280;font-size:13px;">
                  Als u dit verzoek niet heeft gedaan, kunt u deze e-mail negeren.
                  Uw wachtwoord wordt niet gewijzigd totdat u op de bovenstaande link klikt.
                </p>
                """.formatted(resetLink));
    }

    private String buildEmailVerificationHtml(String verificationToken, String frontendUrl) {
        String verificationLink = frontendUrl + "/verificeer-email?token=" + verificationToken;
        return wrapHtml("Verifieer uw e-mailadres", """
                <p>Welkom bij ZorgWerkwijzer!</p>
                <p>Bedankt voor uw registratie. Om uw account te activeren, dient u uw e-mailadres te bevestigen.</p>
                <p>Klik op de onderstaande knop om uw e-mailadres te verifiëren.
                Deze link is <strong>24 uur geldig</strong>.</p>
                <p style="text-align:center;margin:32px 0;">
                  <a href="%s" style="background:#2563eb;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;">
                    E-mailadres verifiëren
                  </a>
                </p>
                <p style="color:#6b7280;font-size:13px;">
                  Als u zich niet heeft geregistreerd bij ZorgWerkwijzer, kunt u deze e-mail negeren.
                </p>
                """.formatted(verificationLink));
    }

    private String buildContactMessageHtml(String name, String email, String message) {
        return wrapHtml("Nieuw contactbericht", """
                <p>Er is een nieuw contactbericht ontvangen via ZorgWerkwijzer.</p>
                <table style="width:100%%;border-collapse:collapse;margin:16px 0;">
                  <tr>
                    <td style="padding:8px;font-weight:600;width:120px;">Naam:</td>
                    <td style="padding:8px;">%s</td>
                  </tr>
                  <tr style="background:#f9fafb;">
                    <td style="padding:8px;font-weight:600;">E-mail:</td>
                    <td style="padding:8px;"><a href="mailto:%s">%s</a></td>
                  </tr>
                  <tr>
                    <td style="padding:8px;font-weight:600;vertical-align:top;">Bericht:</td>
                    <td style="padding:8px;white-space:pre-wrap;">%s</td>
                  </tr>
                </table>
                <p style="color:#6b7280;font-size:13px;">
                  U kunt direct antwoorden op dit bericht door te reageren naar <a href="mailto:%s">%s</a>.
                </p>
                """.formatted(name, email, email, message, email, email));
    }

    private String buildContactConfirmationHtml(String name, String message) {
        return wrapHtml("Bedankt voor uw bericht", """
                <p>Beste %s,</p>
                <p>Bedankt voor uw bericht aan ZorgWerkwijzer. We hebben uw bericht in goede orde ontvangen
                en nemen doorgaans binnen <strong>1–2 werkdagen</strong> contact met u op.</p>
                <p style="margin-top:24px;"><strong>Uw bericht:</strong></p>
                <div style="background:#f9fafb;border-left:4px solid #2563eb;padding:16px 20px;border-radius:4px;white-space:pre-wrap;color:#374151;font-size:14px;">%s</div>
                <p style="margin-top:24px;color:#6b7280;font-size:13px;">
                  Heeft u een dringende vraag? Neem dan direct contact op via
                  <a href="mailto:info@zorgwerkwijzer.nl" style="color:#2563eb;">info@zorgwerkwijzer.nl</a>.
                </p>
                """.formatted(name, message));
    }

    private String buildContactReplyHtml(String toName, String replyMessage) {
        return wrapHtml("Antwoord van ZorgWerkwijzer", """
                <p>Beste %s,</p>
                <p>Bedankt voor uw bericht aan ZorgWerkwijzer. Hieronder vindt u ons antwoord.</p>
                <div style="background:#f9fafb;border-left:4px solid #2563eb;padding:16px 20px;border-radius:4px;white-space:pre-wrap;color:#374151;font-size:14px;margin:24px 0;">%s</div>
                <p style="color:#6b7280;font-size:13px;">
                  Heeft u nog vragen? Neem dan gerust opnieuw contact met ons op via
                  <a href="https://zorgwerkwijzer.nl/contact" style="color:#2563eb;">zorgwerkwijzer.nl/contact</a>.
                </p>
                """.formatted(toName, replyMessage));
    }

    /**
     * Omhult de e-mailinhoud in een professionele ZorgWerkwijzer HTML-template.
     */
    private String wrapHtml(String title, String content) {
        return """
                <!DOCTYPE html>
                <html lang="nl">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>%s</title>
                </head>
                <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                          <!-- Header -->
                          <tr>
                            <td style="background:#2563eb;padding:24px 40px;">
                              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">ZorgWerkwijzer</h1>
                              <p style="margin:4px 0 0;color:#bfdbfe;font-size:13px;">Het platform voor zorgprofessionals</p>
                            </td>
                          </tr>
                          <!-- Content -->
                          <tr>
                            <td style="padding:40px;color:#111827;font-size:15px;line-height:1.6;">
                              <h2 style="margin:0 0 20px;font-size:20px;color:#111827;">%s</h2>
                              %s
                            </td>
                          </tr>
                          <!-- Footer -->
                          <tr>
                            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
                              <p style="margin:0;color:#6b7280;font-size:13px;">
                                Met vriendelijke groet,<br>
                                <strong>Het ZorgWerkwijzer team</strong>
                              </p>
                              <p style="margin:12px 0 0;color:#9ca3af;font-size:12px;">
                                © 2025 ZorgWerkwijzer · <a href="https://zorgwerkwijzer.nl" style="color:#2563eb;text-decoration:none;">zorgwerkwijzer.nl</a>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(title, title, content);
    }

    // ─── Send helper ─────────────────────────────────────────────────────────

    private void send(String toEmail, String subject, String htmlBody) {
        if (!resendProperties.isConfigured()) {
            log.warn("[EMAIL] Resend niet geconfigureerd — e-mail naar {} overgeslagen (onderwerp: {})",
                    toEmail, subject);
            return;
        }

        Map<String, Object> payload = Map.of(
                "from", fromAddress,
                "to", List.of(toEmail),
                "subject", subject,
                "html", htmlBody
        );

        try {
            restClient.post()
                    .uri("/emails")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + resendProperties.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("[EMAIL] E-mail verstuurd via Resend naar {} (onderwerp: {})", toEmail, subject);
        } catch (Exception ex) {
            log.error("[EMAIL] Resend API-fout bij versturen naar {} (onderwerp: {}): {}",
                    toEmail, subject, ex.getMessage());
            // Niet opnieuw gooien — e-mailfout mag de status-update niet blokkeren
        }
    }
}

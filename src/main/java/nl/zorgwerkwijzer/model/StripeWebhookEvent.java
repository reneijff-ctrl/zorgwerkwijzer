package nl.zorgwerkwijzer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;

/**
 * Immutable idempotency-log voor inkomende Stripe webhook events.
 * Erft NIET van BaseEntity — updatedAt is zinloos voor immutable records.
 * UNIQUE(stripe_event_id) garandeert dat elk Stripe event maximaal één keer wordt verwerkt,
 * ook bij een race condition tussen twee gelijktijdige threads.
 */
@Entity
@Table(name = "stripe_webhook_events")
@Immutable
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StripeWebhookEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String stripeEventId;

    @Column(nullable = false, length = 100)
    private String eventType;

    @Column(nullable = false)
    private Boolean processed;

    private LocalDateTime processedAt;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}

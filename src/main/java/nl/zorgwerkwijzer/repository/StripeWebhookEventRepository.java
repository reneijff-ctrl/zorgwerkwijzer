package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.StripeWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StripeWebhookEventRepository extends JpaRepository<StripeWebhookEvent, Long> {

    /**
     * Applicatie-level idempotency check (snelpad).
     * Database-level vangnet: UNIQUE constraint op stripe_event_id in V15.
     */
    boolean existsByStripeEventId(String stripeEventId);
}

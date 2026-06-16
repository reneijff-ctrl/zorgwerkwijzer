package nl.zorgwerkwijzer.model;

/**
 * Alle audit-plichtige admin-acties.
 * Fase 2 en toekomstige waarden zijn al gedefinieerd zodat
 * het database-schema geen wijziging nodig heeft bij uitbreiding.
 */
public enum AuditAction {

    // Fase 1 — Admin acties (nu actief)
    USER_ROLE_CHANGED,
    USER_DELETED,
    VACANCY_DELETED,
    VACANCY_FEATURED_ON,
    VACANCY_FEATURED_OFF,
    VACANCY_ACTIVE_ON,
    VACANCY_ACTIVE_OFF,

    // Fase 2 — Stripe (aanroepen zodra Stripe-fase live is)
    SUBSCRIPTION_CREATED,
    SUBSCRIPTION_CHANGED,
    SUBSCRIPTION_CANCELLED,
    SUBSCRIPTION_PAYMENT_FAILED,

    // Toekomst — nog niet actief in MVP
    EMPLOYER_UPDATED,
    EMPLOYER_DELETED,
    // Contact
    CONTACT_REPLY_SENT
}

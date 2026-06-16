-- V17: Add vacancy credits to employers and create credit transaction audit table

-- 1. Add vacancyCredits column to employers
ALTER TABLE employers
    ADD COLUMN IF NOT EXISTS vacancy_credits INTEGER NOT NULL DEFAULT 0;

-- 2. Create employer_credit_transactions audit table
CREATE TABLE IF NOT EXISTS employer_credit_transactions
(
    id                     BIGSERIAL    PRIMARY KEY,
    employer_id            BIGINT       NOT NULL REFERENCES employers (id) ON DELETE CASCADE,
    credits_added          INTEGER      NOT NULL DEFAULT 0,
    credits_used           INTEGER      NOT NULL DEFAULT 0,
    reason                 VARCHAR(200),
    stripe_payment_intent  VARCHAR(200),
    bundle_type            VARCHAR(50),
    created_at             TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at             TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_employer_id
    ON employer_credit_transactions (employer_id);

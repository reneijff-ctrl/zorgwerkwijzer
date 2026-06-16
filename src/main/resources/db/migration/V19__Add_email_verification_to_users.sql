-- V19: E-mail verificatie velden toevoegen aan users tabel
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email_verified        BOOLEAN                  NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS verification_token    VARCHAR(255),
    ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMP;

-- Bestaande gebruikers worden als geverifieerd beschouwd (backward compatibility)
UPDATE users SET email_verified = TRUE WHERE email_verified = FALSE;

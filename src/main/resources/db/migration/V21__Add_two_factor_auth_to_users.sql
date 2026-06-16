-- V21: Two-Factor Authentication (TOTP) velden toevoegen aan users tabel
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS two_factor_secret  VARCHAR(64);

-- V22: Add 2FA lockout and recovery code columns to users table
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS two_factor_failed_attempts INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS two_factor_locked_until    TIMESTAMP,
    ADD COLUMN IF NOT EXISTS two_factor_recovery_codes  VARCHAR(1024);

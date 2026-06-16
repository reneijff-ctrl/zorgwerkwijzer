-- V20: KvK-nummer kolom toevoegen aan employers tabel
ALTER TABLE employers
    ADD COLUMN IF NOT EXISTS kvk_number VARCHAR(8);

-- Unieke index zodat twee werkgevers niet hetzelfde KvK-nummer kunnen registreren
CREATE UNIQUE INDEX IF NOT EXISTS idx_employers_kvk_number
    ON employers (kvk_number)
    WHERE kvk_number IS NOT NULL;

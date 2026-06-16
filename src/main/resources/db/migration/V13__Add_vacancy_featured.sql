-- V13: Add is_featured flag to vacancies
-- Required for admin dashboard featured vacancy management
ALTER TABLE vacancies
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_vacancies_is_featured
    ON vacancies (is_featured)
    WHERE is_featured = TRUE;

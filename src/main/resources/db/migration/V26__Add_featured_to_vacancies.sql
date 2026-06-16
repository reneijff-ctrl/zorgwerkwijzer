-- V26: Voeg featured_until kolom toe aan vacancies tabel
-- is_featured bestaat al (V13), featured_until is nieuw
ALTER TABLE vacancies
    ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP NULL;

-- Verbeterde index voor sortering: featured eerst, dan datum aflopend
CREATE INDEX IF NOT EXISTS idx_vacancies_featured_sort ON vacancies(is_featured DESC, published_at DESC);

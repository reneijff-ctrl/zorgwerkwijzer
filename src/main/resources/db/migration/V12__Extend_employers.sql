ALTER TABLE employers
    ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
    ADD COLUMN IF NOT EXISTS city            VARCHAR(100),
    ADD COLUMN IF NOT EXISTS province        VARCHAR(100),
    ADD COLUMN IF NOT EXISTS postal_code     VARCHAR(20),
    ADD COLUMN IF NOT EXISTS employee_count  VARCHAR(50),
    ADD COLUMN IF NOT EXISTS founded_year    INTEGER;

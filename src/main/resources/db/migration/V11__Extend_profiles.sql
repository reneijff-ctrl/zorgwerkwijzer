ALTER TABLE profiles
    ADD COLUMN city             VARCHAR(150),
    ADD COLUMN postal_code      VARCHAR(20),
    ADD COLUMN profession       VARCHAR(150),
    ADD COLUMN education        VARCHAR(150),
    ADD COLUMN experience_years INTEGER,
    ADD COLUMN bio              TEXT,
    ADD COLUMN linkedin_url     VARCHAR(500),
    ADD COLUMN availability     VARCHAR(100),
    ADD COLUMN desired_hours    INTEGER;

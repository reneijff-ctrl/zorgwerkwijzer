-- Extend news_articles table with AI and editorial fields
ALTER TABLE news_articles
    ADD COLUMN IF NOT EXISTS status          VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN IF NOT EXISTS tags            TEXT,
    ADD COLUMN IF NOT EXISTS source_name     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS source_url      TEXT,
    ADD COLUMN IF NOT EXISTS source_published_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS imported_at     TIMESTAMP,
    ADD COLUMN IF NOT EXISTS ai_generated    BOOLEAN      NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS reading_time    INTEGER,
    ADD COLUMN IF NOT EXISTS featured_quote  TEXT,
    ADD COLUMN IF NOT EXISTS scheduled_at    TIMESTAMP;

-- Migrate existing is_published to status
UPDATE news_articles SET status = 'PUBLISHED' WHERE is_published = TRUE;
UPDATE news_articles SET status = 'DRAFT'     WHERE is_published = FALSE;

CREATE INDEX IF NOT EXISTS idx_news_articles_status     ON news_articles (status);
CREATE INDEX IF NOT EXISTS idx_news_articles_ai         ON news_articles (ai_generated);
CREATE INDEX IF NOT EXISTS idx_news_articles_scheduled  ON news_articles (scheduled_at) WHERE scheduled_at IS NOT NULL;

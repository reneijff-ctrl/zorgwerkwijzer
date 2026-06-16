CREATE TABLE contact_replies (
    id BIGSERIAL PRIMARY KEY,
    contact_message_id BIGINT NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
    admin_user_id BIGINT NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_replies_message_id ON contact_replies(contact_message_id);

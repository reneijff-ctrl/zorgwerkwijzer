-- V10: Add foreign key constraint and index for users.employer_id -> employers.id
-- Enforces referential integrity for the employer-user relationship.
-- employer_id is nullable: ROLE_USER accounts have no employer linked.

ALTER TABLE users
    ADD CONSTRAINT fk_users_employer_id
        FOREIGN KEY (employer_id) REFERENCES employers (id) ON DELETE SET NULL;

CREATE INDEX idx_users_employer_id ON users (employer_id);

-- FreelanceHub 3D Marketplace Platform SQL Schema
-- Target: PostgreSQL / MySQL Compatible Schema DDL

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(30) NOT NULL,
    avatar_url VARCHAR(500),
    location VARCHAR(100),
    timezone VARCHAR(50),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_identity_verified BOOLEAN DEFAULT FALSE,
    is_suspended BOOLEAN DEFAULT FALSE,
    email_otp VARCHAR(10),
    phone_otp VARCHAR(10),
    otp_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_verified ON users(is_identity_verified);

-- 2. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE,
    category VARCHAR(60)
);

CREATE INDEX IF NOT EXISTS idx_skill_name ON skills(name);

-- 3. Freelancer Profiles
CREATE TABLE IF NOT EXISTS freelancer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    overview TEXT,
    hourly_rate NUMERIC(10, 2),
    project_base_rate NUMERIC(10, 2),
    availability VARCHAR(50) DEFAULT 'AVAILABLE_FULL_TIME',
    languages VARCHAR(200),
    response_time_hours INT DEFAULT 2,
    experience_years INT DEFAULT 3,
    completed_projects_count INT DEFAULT 0,
    success_rate DOUBLE PRECISION DEFAULT 100.0,
    rating DOUBLE PRECISION DEFAULT 5.0,
    total_reviews_count INT DEFAULT 0,
    education_json TEXT,
    experience_json TEXT,
    certifications_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_freelancer_rating ON freelancer_profiles(rating);
CREATE INDEX IF NOT EXISTS idx_freelancer_rate ON freelancer_profiles(hourly_rate);

-- 4. Freelancer Skills Join Table
CREATE TABLE IF NOT EXISTS freelancer_skills (
    freelancer_profile_id BIGINT NOT NULL REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
    skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (freelancer_profile_id, skill_id)
);

-- 5. Portfolio Items
CREATE TABLE IF NOT EXISTS portfolio_items (
    id BIGSERIAL PRIMARY KEY,
    freelancer_profile_id BIGINT NOT NULL REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    project_url VARCHAR(500),
    tags VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Client Profiles
CREATE TABLE IF NOT EXISTS client_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(150),
    website VARCHAR(250),
    industry VARCHAR(100),
    description TEXT,
    total_spent NUMERIC(12, 2) DEFAULT 0.00,
    projects_posted_count INT DEFAULT 0,
    hires_count INT DEFAULT 0,
    rating DOUBLE PRECISION DEFAULT 5.0,
    total_reviews_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Verification Documents (KYC)
CREATE TABLE IF NOT EXISTS verification_documents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    document_front_url VARCHAR(500) NOT NULL,
    document_back_url VARCHAR(500),
    status VARCHAR(30) DEFAULT 'PENDING',
    rejection_reason TEXT,
    reviewed_by_admin_id BIGINT,
    reviewed_at TIMESTAMP,
    audit_log TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_verify_status ON verification_documents(status);
CREATE INDEX IF NOT EXISTS idx_verify_user ON verification_documents(user_id);

-- 8. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget_type VARCHAR(20) NOT NULL DEFAULT 'FIXED',
    budget_min NUMERIC(10, 2),
    budget_max NUMERIC(10, 2),
    experience_level VARCHAR(30) DEFAULT 'INTERMEDIATE',
    estimated_duration_days INT,
    deadline DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    attachments_json TEXT,
    proposals_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_project_client ON projects(client_id);

-- 9. Project Skills Join Table
CREATE TABLE IF NOT EXISTS project_skills (
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

-- 10. Proposals Table
CREATE TABLE IF NOT EXISTS proposals (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT NOT NULL,
    bid_amount NUMERIC(10, 2) NOT NULL,
    estimated_days INT NOT NULL,
    proposed_milestones_json TEXT,
    portfolio_links TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proposal_project ON proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposal_freelancer ON proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_proposal_status ON proposals(status);

-- 11. Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    proposal_id BIGINT NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    paid_amount NUMERIC(12, 2) DEFAULT 0.00,
    escrow_amount NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    terms_and_conditions TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contract_client ON contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contract_freelancer ON contracts(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_contract_status ON contracts(status);

-- 12. Milestones Table
CREATE TABLE IF NOT EXISTS milestones (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    milestone_order INT DEFAULT 1,
    due_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    submission_notes TEXT,
    deliverables_url VARCHAR(1000),
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_milestone_contract ON milestones(contract_id);
CREATE INDEX IF NOT EXISTS idx_milestone_status ON milestones(status);

-- 13. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contract_id BIGINT,
    project_id BIGINT,
    content TEXT NOT NULL,
    attachment_url VARCHAR(500),
    attachment_name VARCHAR(200),
    attachment_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_recipient ON chat_messages(recipient_id);

-- 14. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL,
    link_url VARCHAR(300),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_read ON notifications(is_read);

-- 15. Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT REFERENCES contracts(id),
    milestone_id BIGINT REFERENCES milestones(id),
    payer_id BIGINT NOT NULL REFERENCES users(id),
    payee_id BIGINT NOT NULL REFERENCES users(id),
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(30) NOT NULL,
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    gateway_signature VARCHAR(255),
    status VARCHAR(30) DEFAULT 'PENDING',
    receipt_url VARCHAR(500),
    failure_reason VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tx_contract ON payment_transactions(contract_id);
CREATE INDEX IF NOT EXISTS idx_tx_payer ON payment_transactions(payer_id);
CREATE INDEX IF NOT EXISTS idx_tx_payee ON payment_transactions(payee_id);
CREATE INDEX IF NOT EXISTS idx_tx_status ON payment_transactions(status);

-- 16. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    reviewer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    communication_rating DOUBLE PRECISION NOT NULL,
    quality_rating DOUBLE PRECISION NOT NULL,
    timeliness_rating DOUBLE PRECISION NOT NULL,
    professionalism_rating DOUBLE PRECISION NOT NULL,
    overall_rating DOUBLE PRECISION NOT NULL,
    feedback TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_review_project ON reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_review_reviewer ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_review_reviewee ON reviews(reviewee_id);

-- 17. Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    initiator_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    defendant_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls_json TEXT,
    status VARCHAR(30) DEFAULT 'OPEN',
    resolution_action VARCHAR(50),
    resolution_summary TEXT,
    resolved_by_admin_id BIGINT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dispute_contract ON disputes(contract_id);
CREATE INDEX IF NOT EXISTS idx_dispute_status ON disputes(status);

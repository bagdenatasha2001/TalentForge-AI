-- TalentForge AI — PostgreSQL Schema
-- Tables are created in dependency order (parent before child)

-- DROP existing tables (in reverse dependency order)
DROP TABLE IF EXISTS readiness_scores CASCADE;
DROP TABLE IF EXISTS test_sessions CASCADE;
DROP TABLE IF EXISTS jd_records CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users table (no dependencies)
CREATE TABLE users (
    id                   BIGSERIAL PRIMARY KEY,
    full_name            VARCHAR(255) NOT NULL,
    email                VARCHAR(255) NOT NULL UNIQUE,
    password             VARCHAR(255) NOT NULL,
    phone                VARCHAR(50),
    date_of_birth        DATE,
    degree               VARCHAR(255),
    institution          VARCHAR(255),
    graduation_year      INTEGER,
    major                VARCHAR(255),
    current_job_role     VARCHAR(255),
    company              VARCHAR(255),
    years_of_experience  DOUBLE PRECISION,
    past_roles           TEXT,
    technical_skills     TEXT,
    soft_skills          TEXT,
    preferred_role       VARCHAR(255),
    preferred_location   VARCHAR(255),
    career_goal          TEXT,
    user_role            VARCHAR(20) NOT NULL DEFAULT 'CANDIDATE',
    verified             BOOLEAN NOT NULL DEFAULT FALSE,
    otp_code             VARCHAR(10),
    otp_expires_at       TIMESTAMP,
    data_privacy_agreed  BOOLEAN NOT NULL DEFAULT FALSE,
    ai_processing_consent BOOLEAN NOT NULL DEFAULT FALSE,
    created_date         TIMESTAMP DEFAULT now(),
    updated_date         TIMESTAMP DEFAULT now()
);

-- 2. JD Records (depends on users)
CREATE TABLE jd_records (
    id                          BIGSERIAL PRIMARY KEY,
    user_id                     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jd_text                     TEXT NOT NULL,
    job_title                   VARCHAR(255),
    company                     VARCHAR(255),
    required_skills             TEXT,
    required_tools              TEXT,
    core_responsibilities       TEXT,
    experience_level            VARCHAR(50),
    soft_skills                 TEXT,
    skill_match_score           DOUBLE PRECISION,
    responsibility_match_score  DOUBLE PRECISION,
    status                      VARCHAR(20) DEFAULT 'PENDING',
    created_date                TIMESTAMP DEFAULT now()
);

-- 3. Test Sessions (depends on users + jd_records)
CREATE TABLE test_sessions (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jd_record_id    BIGINT REFERENCES jd_records(id) ON DELETE SET NULL,
    test_type       VARCHAR(50),
    total_questions INTEGER,
    correct_answers INTEGER,
    score           DOUBLE PRECISION,
    duration        INTEGER,
    topic_breakdown TEXT,
    weak_topics     TEXT,
    status          VARCHAR(20) DEFAULT 'IN_PROGRESS',
    created_date    TIMESTAMP DEFAULT now(),
    completed_at    TIMESTAMP
);

-- 4. Readiness Scores (depends on users + jd_records)
CREATE TABLE readiness_scores (
    id                    BIGSERIAL PRIMARY KEY,
    user_id               BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jd_record_id          BIGINT REFERENCES jd_records(id) ON DELETE SET NULL,
    mcq_score             DOUBLE PRECISION DEFAULT 0,
    coding_score          DOUBLE PRECISION DEFAULT 0,
    jd_match_score        DOUBLE PRECISION DEFAULT 0,
    learning_depth_score  DOUBLE PRECISION DEFAULT 0,
    final_score           DOUBLE PRECISION DEFAULT 0,
    level                 VARCHAR(30) DEFAULT 'NOT_READY',
    skill_breakdown       TEXT,
    weak_skills           TEXT,
    recommendations       TEXT,
    created_date          TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_jd_records_user_id ON jd_records(user_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_user_id ON test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_readiness_scores_user_id ON readiness_scores(user_id);

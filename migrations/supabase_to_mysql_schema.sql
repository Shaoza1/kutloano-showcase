-- ===================================
-- Supabase to MySQL Schema Migration
-- ===================================
-- MySQL-compatible schema for portfolio project
-- Compatible with: MySQL 5.7+, MariaDB 10.2+, XAMPP
-- 
-- Usage:
--   mysql -u root portfolio_local < migrations/supabase_to_mysql_schema.sql
--
-- ===================================

-- Drop existing tables (safe re-run)
DROP TABLE IF EXISTS project_interactions;
DROP TABLE IF EXISTS cv_downloads;
DROP TABLE IF EXISTS site_analytics;
DROP TABLE IF EXISTS visitor_analytics;
DROP TABLE IF EXISTS contact_submissions;
DROP TABLE IF EXISTS portfolio_case_studies;
DROP TABLE IF EXISTS portfolio_articles;
DROP TABLE IF EXISTS portfolio_certifications;
DROP TABLE IF EXISTS portfolio_experience;
DROP TABLE IF EXISTS portfolio_skills;
DROP TABLE IF EXISTS portfolio_projects;
DROP TABLE IF EXISTS cv_management;

-- ===================================
-- PORTFOLIO PROJECTS
-- ===================================
CREATE TABLE portfolio_projects (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    long_description TEXT,
    technologies JSON NOT NULL COMMENT 'Array of technology names',
    category JSON NOT NULL COMMENT 'Array of category names',
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress',
    year VARCHAR(10) NOT NULL,
    duration VARCHAR(100),
    team_info TEXT,
    problem_statement TEXT,
    solution_overview TEXT,
    approach JSON COMMENT 'Array of approach steps',
    key_features JSON COMMENT 'Array of feature descriptions',
    challenges JSON COMMENT 'Array of challenge objects',
    architecture JSON COMMENT 'Architecture details object',
    results JSON COMMENT 'Results metrics object',
    images JSON COMMENT 'Array of image URLs',
    live_demo_url VARCHAR(500),
    demo_video_url VARCHAR(500),
    github_url VARCHAR(500),
    case_study_url VARCHAR(500),
    is_featured TINYINT(1) DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    INDEX idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- PORTFOLIO SKILLS
-- ===================================
CREATE TABLE portfolio_skills (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    level INT NOT NULL CHECK (level >= 1 AND level <= 5),
    icon_name VARCHAR(50),
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- PORTFOLIO EXPERIENCE
-- ===================================
CREATE TABLE portfolio_experience (
    id CHAR(36) PRIMARY KEY,
    type VARCHAR(50) NOT NULL COMMENT 'work or education',
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current TINYINT(1) DEFAULT 0,
    description TEXT,
    achievements JSON COMMENT 'Array of achievement strings',
    technologies_used JSON COMMENT 'Array of technology names',
    degree_type VARCHAR(100) COMMENT 'For education: degree type',
    gpa DECIMAL(3,2) COMMENT 'For education: GPA',
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_current (is_current),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- PORTFOLIO CERTIFICATIONS
-- ===================================
CREATE TABLE portfolio_certifications (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    credential_id VARCHAR(100),
    credential_url VARCHAR(500),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    badge_image_url VARCHAR(500),
    description TEXT,
    skills_gained JSON COMMENT 'Array of skill names',
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_issuer (issuer),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- PORTFOLIO ARTICLES (BLOG)
-- ===================================
CREATE TABLE portfolio_articles (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    excerpt TEXT,
    content TEXT,
    featured_image_url VARCHAR(500),
    article_url VARCHAR(500),
    pdf_url VARCHAR(500),
    category JSON COMMENT 'Array of category names',
    tags JSON COMMENT 'Array of tag names',
    publication_date DATE,
    reading_time INT COMMENT 'Estimated reading time in minutes',
    is_published TINYINT(1) DEFAULT 0,
    is_featured TINYINT(1) DEFAULT 0,
    view_count INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_published (is_published),
    INDEX idx_featured (is_featured),
    INDEX idx_pub_date (publication_date),
    FULLTEXT idx_content (title, excerpt, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- PORTFOLIO CASE STUDIES
-- ===================================
CREATE TABLE portfolio_case_studies (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36),
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    methodology TEXT,
    detailed_process TEXT,
    lessons_learned TEXT,
    future_improvements TEXT,
    technical_specs JSON COMMENT 'Technical specifications object',
    performance_metrics JSON COMMENT 'Performance data object',
    user_feedback JSON COMMENT 'User feedback array',
    image_gallery JSON COMMENT 'Array of image URLs',
    video_urls JSON COMMENT 'Array of video URLs',
    interactive_demos JSON COMMENT 'Array of demo URLs',
    document_urls JSON COMMENT 'Array of document URLs',
    is_public TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_project (project_id),
    INDEX idx_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- CV MANAGEMENT
-- ===================================
CREATE TABLE cv_management (
    id CHAR(36) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    version INT DEFAULT 1,
    is_active TINYINT(1) DEFAULT 0,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_version (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- CONTACT SUBMISSIONS
-- ===================================
CREATE TABLE contact_submissions (
    id CHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    responded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- VISITOR ANALYTICS
-- ===================================
CREATE TABLE visitor_analytics (
    id CHAR(36) PRIMARY KEY,
    session_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    page_views INT DEFAULT 1,
    time_on_site INT COMMENT 'Seconds on site',
    actions JSON COMMENT 'Array of user actions',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- SITE ANALYTICS
-- ===================================
CREATE TABLE site_analytics (
    id CHAR(36) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    event_data JSON COMMENT 'Additional event metadata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- CV DOWNLOADS
-- ===================================
CREATE TABLE cv_downloads (
    id CHAR(36) PRIMARY KEY,
    ip_address VARCHAR(45),
    user_agent TEXT,
    download_type VARCHAR(50) DEFAULT 'pdf',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- PROJECT INTERACTIONS
-- ===================================
CREATE TABLE project_interactions (
    id CHAR(36) PRIMARY KEY,
    project_id VARCHAR(100) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL,
    visitor_session VARCHAR(100),
    ip_address VARCHAR(45),
    metadata JSON COMMENT 'Additional interaction data',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_project (project_id),
    INDEX idx_interaction_type (interaction_type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- SUMMARY
-- ===================================
-- Tables created:
-- ✓ portfolio_projects (12 columns)
-- ✓ portfolio_skills (9 columns)
-- ✓ portfolio_experience (16 columns)
-- ✓ portfolio_certifications (13 columns)
-- ✓ portfolio_articles (17 columns)
-- ✓ portfolio_case_studies (16 columns)
-- ✓ cv_management (9 columns)
-- ✓ contact_submissions (9 columns)
-- ✓ visitor_analytics (15 columns)
-- ✓ site_analytics (6 columns)
-- ✓ cv_downloads (5 columns)
-- ✓ project_interactions (7 columns)
--
-- All tables use:
-- - UTF8MB4 character set (full Unicode support)
-- - InnoDB engine (transactions, foreign keys)
-- - Indexed common query columns
-- - Timestamps with auto-update
-- ===================================

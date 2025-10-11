-- ===================================
-- Sample Data for Testing Migration
-- ===================================
-- Use this to quickly test the schema
-- after importing to MySQL
--
-- Usage:
--   mysql -u root portfolio_local < migrations/seed_sample_data.sql
-- ===================================

USE portfolio_local;

-- Clear existing sample data
DELETE FROM portfolio_projects WHERE id LIKE 'sample-%';
DELETE FROM portfolio_skills WHERE id LIKE 'sample-%';
DELETE FROM portfolio_experience WHERE id LIKE 'sample-%';

-- Sample Project
INSERT INTO portfolio_projects (
    id, title, subtitle, description, long_description,
    technologies, category, status, year, duration,
    is_featured, sort_order, created_at
) VALUES (
    'sample-001',
    'Sample Portfolio Website',
    'A modern, responsive portfolio built with React',
    'Full-stack portfolio website showcasing projects and skills',
    'Detailed description of the portfolio project with comprehensive features including project showcase, blog, contact form, and admin dashboard.',
    '["React", "TypeScript", "Tailwind CSS", "Supabase"]',
    '["Web Development", "Full Stack"]',
    'Completed',
    '2024',
    '3 months',
    1,
    1,
    NOW()
);

-- Sample Skills
INSERT INTO portfolio_skills (id, name, category, level, icon_name, sort_order, created_at) VALUES
('sample-skill-001', 'React', 'Frontend', 5, 'react', 1, NOW()),
('sample-skill-002', 'TypeScript', 'Languages', 4, 'typescript', 2, NOW()),
('sample-skill-003', 'MySQL', 'Database', 4, 'database', 3, NOW()),
('sample-skill-004', 'Tailwind CSS', 'Frontend', 5, 'tailwind', 4, NOW());

-- Sample Experience
INSERT INTO portfolio_experience (
    id, type, title, organization, location,
    start_date, end_date, is_current, description,
    achievements, technologies_used, sort_order, created_at
) VALUES (
    'sample-exp-001',
    'work',
    'Full Stack Developer',
    'Tech Company Inc.',
    'Remote',
    '2023-01-01',
    NULL,
    1,
    'Building modern web applications with React and Node.js',
    '["Led migration from Vue to React", "Improved performance by 40%", "Mentored 3 junior developers"]',
    '["React", "Node.js", "PostgreSQL", "AWS"]',
    1,
    NOW()
);

-- Sample Certification
INSERT INTO portfolio_certifications (
    id, name, issuer, credential_id, issue_date,
    description, skills_gained, sort_order, created_at
) VALUES (
    'sample-cert-001',
    'AWS Certified Solutions Architect',
    'Amazon Web Services',
    'ABC-123-XYZ',
    '2023-06-15',
    'Professional level certification for AWS cloud architecture',
    '["Cloud Architecture", "AWS Services", "Security", "Scalability"]',
    1,
    NOW()
);

-- Sample Article
INSERT INTO portfolio_articles (
    id, title, subtitle, excerpt, publication_date,
    reading_time, is_published, category, tags, sort_order, created_at
) VALUES (
    'sample-article-001',
    'Getting Started with React Hooks',
    'A comprehensive guide to modern React',
    'Learn how to use React Hooks to build cleaner, more maintainable components.',
    '2024-01-15',
    10,
    1,
    '["Web Development", "Tutorial"]',
    '["React", "JavaScript", "Hooks", "Tutorial"]',
    1,
    NOW()
);

-- Sample Contact Submission
INSERT INTO contact_submissions (
    id, first_name, last_name, email, subject, message, status, created_at
) VALUES (
    'sample-contact-001',
    'John',
    'Doe',
    'john.doe@example.com',
    'Interested in collaboration',
    'Hi, I would like to discuss a potential project collaboration.',
    'new',
    NOW()
);

-- Verify sample data
SELECT 'Projects' as table_name, COUNT(*) as sample_rows FROM portfolio_projects WHERE id LIKE 'sample-%'
UNION ALL
SELECT 'Skills', COUNT(*) FROM portfolio_skills WHERE id LIKE 'sample-%'
UNION ALL
SELECT 'Experience', COUNT(*) FROM portfolio_experience WHERE id LIKE 'sample-%'
UNION ALL
SELECT 'Certifications', COUNT(*) FROM portfolio_certifications WHERE id LIKE 'sample-%'
UNION ALL
SELECT 'Articles', COUNT(*) FROM portfolio_articles WHERE id LIKE 'sample-%'
UNION ALL
SELECT 'Contact', COUNT(*) FROM contact_submissions WHERE id LIKE 'sample-%';

-- ===================================
-- Sample data created successfully!
-- ===================================

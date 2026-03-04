-- ==================================================
-- SQL Examples for Portfolio Database
-- ==================================================
-- Copy and paste these examples into your Supabase SQL editor
-- Modify values to match your information

-- ==================================================
-- 1. BIODATA - Your Personal Information
-- ==================================================

INSERT INTO biodata (
  name,
  role,
  description,
  telepon,
  email,
  github_url,
  linkedin_url,
  cv_path
) VALUES (
  'John Doe',
  'Full Stack Developer & Designer',
  'Passionate about building beautiful, scalable web applications that solve real problems. Expertise in React, Node.js, and cloud technologies.',
  '+1-555-0123',
  'john@example.com',
  'https://github.com/johndoe',
  'https://linkedin.com/in/johndoe',
  '/cv/john-doe-cv.pdf'
);

-- ==================================================
-- 2. EXPERIENCES - Work & Education
-- ==================================================

-- Work Experience Example
INSERT INTO experiences (
  title,
  company,
  start_date,
  end_date,
  description,
  type
) VALUES (
  'Senior Full Stack Developer',
  'Tech Solutions Inc',
  '2022-06',
  'Present',
  'Led development of cloud-based SaaS platform for 500+ clients. Designed and implemented microservices architecture using Node.js and React. Mentored team of 5 junior developers.',
  'Work'
);

-- Education Example
INSERT INTO experiences (
  title,
  company,
  start_date,
  end_date,
  description,
  type
) VALUES (
  'Bachelor of Science in Computer Science',
  'University of Technology',
  '2018-09',
  '2022-05',
  'GPA: 3.8/4.0. Focused on web development and software architecture. Completed thesis on scalable REST API design.',
  'Education'
);

-- Another Work Example
INSERT INTO experiences (
  title,
  company,
  start_date,
  end_date,
  description,
  type
) VALUES (
  'Junior Developer',
  'Creative Agency Studios',
  '2021-01',
  '2022-05',
  'Built responsive websites and web applications using React and Vue.js. Worked with designers to implement pixel-perfect UI designs.',
  'Work'
);

-- ==================================================
-- 3. PROJECTS - Your Portfolio Projects
-- ==================================================

INSERT INTO projects (
  title,
  category,
  status,
  image_path
) VALUES (
  'E-Commerce Platform',
  'Web',
  'Completed',
  'https://images.unsplash.com/photo-1460925895917-adf4e565db0d?w=800'
);

INSERT INTO projects (
  title,
  category,
  status,
  image_path
) VALUES (
  'AI Chat Dashboard',
  'AI/Web',
  'Completed',
  'https://images.unsplash.com/photo-1527014176846-36967c814d70?w=800'
);

INSERT INTO projects (
  title,
  category,
  status,
  image_path
) VALUES (
  'Mobile Health App',
  'Mobile',
  'Completed',
  'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b08f?w=800'
);

INSERT INTO projects (
  title,
  category,
  status,
  image_path
) VALUES (
  'Real-time Collaboration Tool',
  'Web',
  'In Progress',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'
);

-- ==================================================
-- 4. SKILLS - Technical Skills & Tools
-- ==================================================

-- Frontend Skills
INSERT INTO skills (name, category, percentage) VALUES ('React', 'Frontend', 95);
INSERT INTO skills (name, category, percentage) VALUES ('Vue.js', 'Frontend', 85);
INSERT INTO skills (name, category, percentage) VALUES ('TypeScript', 'Frontend', 90);
INSERT INTO skills (name, category, percentage) VALUES ('Tailwind CSS', 'Frontend', 95);

-- Backend Skills
INSERT INTO skills (name, category, percentage) VALUES ('Node.js', 'Backend', 90);
INSERT INTO skills (name, category, percentage) VALUES ('Express.js', 'Backend', 88);
INSERT INTO skills (name, category, percentage) VALUES ('Python', 'Backend', 85);
INSERT INTO skills (name, category, percentage) VALUES ('PostgreSQL', 'Backend', 90);

-- Tools & Technologies
INSERT INTO skills (name, category, percentage) VALUES ('Git', 'Tools', 95);
INSERT INTO skills (name, category, percentage) VALUES ('Docker', 'Tools', 85);
INSERT INTO skills (name, category, percentage) VALUES ('AWS', 'Tools', 80);
INSERT INTO skills (name, category, percentage) VALUES ('CI/CD Pipelines', 'Tools', 85);

-- Design Skills
INSERT INTO skills (name, category, percentage) VALUES ('Figma', 'Design', 85);
INSERT INTO skills (name, category, percentage) VALUES ('UI/UX Design', 'Design', 88);

-- ==================================================
-- 5. QUICK REFERENCE - Update Individual Records
-- ==================================================

-- Update your bio information
-- UPDATE biodata SET email = 'newemail@example.com' WHERE id = 1;

-- Add a new experience
-- INSERT INTO experiences (title, company, start_date, end_date, description, type) 
-- VALUES ('Your Position', 'Your Company', '2024-01', 'Present', 'Description', 'Work');

-- Delete an old project
-- DELETE FROM projects WHERE id = 1;

-- ==================================================
-- 6. VERIFY DATA
-- ==================================================

-- Check if biodata exists
-- SELECT * FROM biodata;

-- Check all experiences
-- SELECT * FROM experiences ORDER BY start_date DESC;

-- Check all projects
-- SELECT * FROM projects;

-- Check all skills grouped by category
-- SELECT category, string_agg(name, ', ') as skills FROM skills GROUP BY category;

-- ==================================================
-- TIPS:
-- 1. Date format: Use 'YYYY-MM' for year-month (e.g., '2024-01')
-- 2. For ongoing roles, use 'Present' for end_date
-- 3. Image URLs must be complete (https://...)
-- 4. Use double quotes for text values with special characters
-- 5. Percentage is optional for skills
-- ==================================================

-- SEO Fix Script for All Resume Services Blog Posts
-- Fixes meta descriptions that are too short (<120 chars) or too long (>160 chars)
-- Target range: 140-160 characters (optimal for Google)

-- First, let's update posts with short meta descriptions by appending professional CTA
-- This uses the excerpt or expands the existing description

-- Update all posts with short meta descriptions (under 120 chars)
-- Strategy: Append professional call-to-action based on content theme

UPDATE blog_posts 
SET metaDescription = CONCAT(
    metaDescription, 
    ' Expert tips from professional resume writers with 18+ years experience in Australia.'
),
updatedAt = NOW()
WHERE LENGTH(metaDescription) < 120 
AND LENGTH(metaDescription) > 0
AND title LIKE '%resume%';

UPDATE blog_posts 
SET metaDescription = CONCAT(
    metaDescription, 
    ' Professional career advice to help you land your dream job in Australia.'
),
updatedAt = NOW()
WHERE LENGTH(metaDescription) < 120 
AND LENGTH(metaDescription) > 0
AND title NOT LIKE '%resume%'
AND (title LIKE '%career%' OR title LIKE '%job%');

UPDATE blog_posts 
SET metaDescription = CONCAT(
    metaDescription, 
    ' Expert interview preparation strategies from Australia''s leading career consultants.'
),
updatedAt = NOW()
WHERE LENGTH(metaDescription) < 120 
AND LENGTH(metaDescription) > 0
AND title LIKE '%interview%';

UPDATE blog_posts 
SET metaDescription = CONCAT(
    metaDescription, 
    ' Professional cover letter writing tips to help you stand out from other applicants.'
),
updatedAt = NOW()
WHERE LENGTH(metaDescription) < 120 
AND LENGTH(metaDescription) > 0
AND title LIKE '%cover letter%';

UPDATE blog_posts 
SET metaDescription = CONCAT(
    metaDescription, 
    ' LinkedIn optimization strategies from professional career consultants in Australia.'
),
updatedAt = NOW()
WHERE LENGTH(metaDescription) < 120 
AND LENGTH(metaDescription) > 0
AND title LIKE '%linkedin%';

UPDATE blog_posts 
SET metaDescription = CONCAT(
    metaDescription, 
    ' Expert guidance for Australian government job applications from professional writers.'
),
updatedAt = NOW()
WHERE LENGTH(metaDescription) < 120 
AND LENGTH(metaDescription) > 0
AND (title LIKE '%government%' OR title LIKE '%selection criteria%' OR title LIKE '%public service%');

UPDATE blog_posts 
SET metaDescription = CONCAT(
    metaDescription, 
    ' Beat applicant tracking systems with expert formatting and keyword optimization tips.'
),
updatedAt = NOW()
WHERE LENGTH(metaDescription) < 120 
AND LENGTH(metaDescription) > 0
AND title LIKE '%ATS%';

-- Catch-all for any remaining short descriptions
UPDATE blog_posts 
SET metaDescription = CONCAT(
    metaDescription, 
    ' Professional career advice from All Resume Services, Australia''s trusted resume experts.'
),
updatedAt = NOW()
WHERE LENGTH(metaDescription) < 120 
AND LENGTH(metaDescription) > 0;

-- Now fix descriptions that are too long (over 160 chars)
-- Strategy: Truncate at sentence boundary or add ellipsis

UPDATE blog_posts 
SET metaDescription = CONCAT(LEFT(metaDescription, 157), '...'),
updatedAt = NOW()
WHERE LENGTH(metaDescription) > 160;

-- Verify the fixes
SELECT 
    'Short descriptions remaining' as issue,
    COUNT(*) as count 
FROM blog_posts 
WHERE LENGTH(metaDescription) < 120
UNION ALL
SELECT 
    'Long descriptions remaining' as issue,
    COUNT(*) as count 
FROM blog_posts 
WHERE LENGTH(metaDescription) > 160;

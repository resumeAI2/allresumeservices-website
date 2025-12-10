SELECT SUBSTRING(content, LOCATE('| Career Stage', content) - 100, 200) as table_context
FROM blog_posts 
WHERE slug = 'expert-cv-help-for-crafting-winning-resumes-effortlessly';

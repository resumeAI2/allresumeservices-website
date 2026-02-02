-- Database Performance Indexes
-- Run this script to add indexes for frequently queried columns
-- This will significantly improve query performance

-- Check existing indexes first:
-- SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname = 'public';

-- ============================================
-- Blog Posts Indexes
-- ============================================

-- Frequently filtered by published status
CREATE INDEX IF NOT EXISTS idx_blog_posts_published 
ON blog_posts(published);

-- Slug lookups (exact match)
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug 
ON blog_posts(slug);

-- Category filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_category 
ON blog_posts(category);

-- Composite index for published posts ordered by date
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_created 
ON blog_posts(published, created_at DESC) 
WHERE published = 1;

-- View count for popular posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count 
ON blog_posts(view_count DESC) 
WHERE published = 1;

-- ============================================
-- Blog Categories & Tags
-- ============================================

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug 
ON blog_categories(slug);

CREATE INDEX IF NOT EXISTS idx_blog_tags_slug 
ON blog_tags(slug);

-- Post-tag relationships
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id 
ON blog_post_tags(post_id);

CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag_id 
ON blog_post_tags(tag_id);

-- ============================================
-- Contact Submissions
-- ============================================

-- Filter by status
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status 
ON contact_submissions(status);

-- Recent submissions
CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at 
ON contact_submissions(submitted_at DESC);

-- Email lookup
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
ON contact_submissions(email);

-- ============================================
-- Testimonials
-- ============================================

-- Approved and featured testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_approved 
ON testimonials(approved) 
WHERE approved = 1;

CREATE INDEX IF NOT EXISTS idx_testimonials_featured 
ON testimonials(featured) 
WHERE featured = 1;

-- Composite for approved + featured
CREATE INDEX IF NOT EXISTS idx_testimonials_approved_featured 
ON testimonials(approved, featured, created_at DESC);

-- ============================================
-- Orders
-- ============================================

-- Filter by status
CREATE INDEX IF NOT EXISTS idx_orders_status 
ON orders(status);

-- User's orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id 
ON orders(user_id);

-- Recent orders
CREATE INDEX IF NOT EXISTS idx_orders_created_at 
ON orders(created_at DESC);

-- Composite for user orders by status
CREATE INDEX IF NOT EXISTS idx_orders_user_status 
ON orders(user_id, status, created_at DESC);

-- PayPal order ID lookup
CREATE INDEX IF NOT EXISTS idx_orders_paypal_order_id 
ON orders(paypal_order_id) 
WHERE paypal_order_id IS NOT NULL;

-- ============================================
-- Case Studies
-- ============================================

-- Published case studies
CREATE INDEX IF NOT EXISTS idx_case_studies_published 
ON case_studies(published) 
WHERE published = 1;

-- Slug lookup
CREATE INDEX IF NOT EXISTS idx_case_studies_slug 
ON case_studies(slug);

-- Featured case studies
CREATE INDEX IF NOT EXISTS idx_case_studies_featured 
ON case_studies(featured, created_at DESC) 
WHERE featured = 1;

-- Category filtering
CREATE INDEX IF NOT EXISTS idx_case_studies_category 
ON case_studies(category);

-- ============================================
-- Users & Authentication
-- ============================================

-- Email login lookup (most common auth query)
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users(email);

-- Role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role 
ON users(role);

-- Last signed in tracking
CREATE INDEX IF NOT EXISTS idx_users_last_signed_in 
ON users(last_signed_in DESC);

-- ============================================
-- Email Logs
-- ============================================

-- Filter by email type
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type 
ON email_logs(email_type);

-- Filter by status
CREATE INDEX IF NOT EXISTS idx_email_logs_status 
ON email_logs(status);

-- Recipient lookup
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient_email 
ON email_logs(recipient_email);

-- Recent logs
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at 
ON email_logs(sent_at DESC);

-- ============================================
-- Promo Codes
-- ============================================

-- Code lookup (exact match)
CREATE INDEX IF NOT EXISTS idx_promo_codes_code 
ON promo_codes(code);

-- Active promo codes
CREATE INDEX IF NOT EXISTS idx_promo_codes_active 
ON promo_codes(active) 
WHERE active = 1;

-- Expiration check
CREATE INDEX IF NOT EXISTS idx_promo_codes_expires_at 
ON promo_codes(expires_at) 
WHERE active = 1 AND expires_at IS NOT NULL;

-- ============================================
-- Client Intake
-- ============================================

CREATE INDEX IF NOT EXISTS idx_client_intake_email 
ON client_intake_records(email);

CREATE INDEX IF NOT EXISTS idx_client_intake_created_at 
ON client_intake_records(created_at DESC);

-- ============================================
-- Email Subscribers
-- ============================================

CREATE INDEX IF NOT EXISTS idx_email_subscribers_email 
ON email_subscribers(email);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscribed 
ON email_subscribers(subscribed) 
WHERE subscribed = 1;

CREATE INDEX IF NOT EXISTS idx_email_subscribers_source 
ON email_subscribers(source);

-- ============================================
-- Social Media Posts
-- ============================================

CREATE INDEX IF NOT EXISTS idx_social_media_posts_blog_post_id 
ON social_media_posts(blog_post_id);

CREATE INDEX IF NOT EXISTS idx_social_media_posts_status 
ON social_media_posts(status);

CREATE INDEX IF NOT EXISTS idx_social_media_posts_scheduled_for 
ON social_media_posts(scheduled_for) 
WHERE status = 'pending';

-- ============================================
-- Performance Notes
-- ============================================

-- After creating indexes:
-- 1. Run ANALYZE to update statistics:
--    ANALYZE;
--
-- 2. Monitor index usage:
--    SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
--    FROM pg_stat_user_indexes
--    ORDER BY idx_scan DESC;
--
-- 3. Check for unused indexes:
--    SELECT schemaname, tablename, indexname
--    FROM pg_stat_user_indexes
--    WHERE idx_scan = 0
--    ORDER BY schemaname, tablename;
--
-- 4. Monitor table sizes:
--    SELECT schemaname, tablename,
--           pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
--    FROM pg_tables
--    WHERE schemaname = 'public'
--    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================
-- Index Maintenance
-- ============================================

-- Rebuild all indexes (run periodically if needed):
-- REINDEX DATABASE your_database_name;

-- Or rebuild specific index:
-- REINDEX INDEX idx_blog_posts_published;

#!/usr/bin/env python3
"""
Fix H3 heading tags by adding proper closing tags
"""

import os
import re
import mysql.connector
from urllib.parse import urlparse

# Get database URL from environment
db_url = os.environ.get('DATABASE_URL')
if not db_url:
    print("ERROR: DATABASE_URL not set")
    exit(1)

# Parse MySQL URL (format: mysql://user:pass@host:port/dbname)
parsed = urlparse(db_url)

# Connect to database
conn = mysql.connector.connect(
    host=parsed.hostname,
    port=parsed.port or 3306,
    user=parsed.username,
    password=parsed.password,
    database=parsed.path.lstrip('/')
)

cursor = conn.cursor()

print("\n=== FIXING H3 HEADING TAGS ===\n")

# Get all blog posts
cursor.execute("SELECT id, title, content FROM blog_posts")
posts = cursor.fetchall()

print(f"Found {len(posts)} blog posts to process\n")

updated_count = 0

for post_id, title, content in posts:
    if not content:
        print(f"⏭️  Skipped (no content): {title}")
        continue
    
    original_content = content
    
    # Pattern 1: Find <h3><strong>Text that continues until next tag or double newline
    # Replace with proper closing tags
    pattern = r'<h3><strong>([^<\n]+?)(?=\n\n|<[^/]|$)'
    content = re.sub(pattern, r'<h3><strong>\1</strong></h3>\n\n', content)
    
    # Pattern 2: Clean up any h3 tags that might already have partial closing
    content = re.sub(r'<h3><strong>([^<]+?)</h3>', r'<h3><strong>\1</strong></h3>', content)
    
    if content != original_content:
        # Update database
        cursor.execute("UPDATE blog_posts SET content = %s WHERE id = %s", (content, post_id))
        updated_count += 1
        print(f"✅ Updated: {title}")
    else:
        print(f"⏭️  No changes: {title}")

# Commit changes
conn.commit()

print(f"\n=== SUMMARY ===")
print(f"Total posts: {len(posts)}")
print(f"Updated: {updated_count}")
print(f"No changes: {len(posts) - updated_count}")
print("\n=== DONE ===\n")

cursor.close()
conn.close()

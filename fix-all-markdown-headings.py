#!/usr/bin/env python3
"""
Fix all Markdown heading symbols in blog posts
Converts ##, ###, ####, etc. to proper HTML heading tags
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

# Parse MySQL URL
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

print("\n=== FIXING ALL MARKDOWN HEADINGS ===\n")

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
    
    # Convert Markdown headings to HTML
    # Process from most specific (####) to least specific (##) to avoid conflicts
    
    # #### Heading (H4)
    content = re.sub(r'(?m)^####\s+(.+?)$', r'<h4><strong>\1</strong></h4>', content)
    content = re.sub(r'\\####\s+(.+?)(?=\n|$)', r'<h4><strong>\1</strong></h4>', content)
    
    # ### Heading (H3)
    content = re.sub(r'(?m)^###\s+(.+?)$', r'<h3><strong>\1</strong></h3>', content)
    content = re.sub(r'\\###\s+(.+?)(?=\n|$)', r'<h3><strong>\1</strong></h3>', content)
    
    # ## Heading (H2)
    content = re.sub(r'(?m)^##\s+(.+?)$', r'<h2><strong>\1</strong></h2>', content)
    content = re.sub(r'\\##\s+(.+?)(?=\n|$)', r'<h2><strong>\1</strong></h2>', content)
    
    # Clean up any remaining escaped backslashes before headings
    content = content.replace('\\#', '')
    
    # Ensure proper spacing around headings
    content = re.sub(r'(<h[2-4]>)', r'\n\n\1', content)
    content = re.sub(r'(</h[2-4]>)', r'\1\n\n', content)
    
    # Clean up excessive newlines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
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

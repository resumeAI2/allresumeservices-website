#!/bin/bash
file="client/src/data/blogPosts.ts"

# Update images for each blog post
sed -i '0,/image: "\/api\/placeholder\/800\/400"/s//image: "\/blog\/resume-writing.jpg"/' "$file"
sed -i '0,/image: "\/api\/placeholder\/800\/400"/s//image: "\/blog\/interview-success.jpg"/' "$file"
sed -i '0,/image: "\/api\/placeholder\/800\/400"/s//image: "\/blog\/job-interview.jpg"/' "$file"
sed -i '0,/image: "\/api\/placeholder\/800\/400"/s//image: "\/blog\/cv-writing.jpg"/' "$file"
sed -i '0,/image: "\/api\/placeholder\/800\/400"/s//image: "\/blog\/resume-writing.jpg"/' "$file"
sed -i '0,/image: "\/api\/placeholder\/800\/400"/s//image: "\/blog\/selection-criteria.jpg"/' "$file"
sed -i '0,/image: "\/api\/placeholder\/800\/400"/s//image: "\/blog\/cv-writing.jpg"/' "$file"
sed -i '0,/image: "\/api\/placeholder\/800\/400"/s//image: "\/blog\/cover-letter.jpg"/' "$file"
sed -i '0,/image: "\/api\/placeholder\/800\/400"/s//image: "\/blog\/linkedin-optimization.jpg"/' "$file"

echo "Blog images updated successfully"

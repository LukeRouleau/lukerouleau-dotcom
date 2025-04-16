#!/bin/bash

# Script to create a new blog post from the template
# and add the entry to the blog/posts/index.json file

# Text formatting
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NORMAL='\033[0m'

echo -e "${BOLD}${BLUE}===== Create New Blog Post =====${NORMAL}\n"

# Get the post filename (will be used as the URL)
read -p "Enter post filename (without .html, use-hyphens-for-spaces): " filename

# Check if the file already exists
if [ -f "blog/${filename}.html" ]; then
    echo -e "${BOLD}Error: blog/${filename}.html already exists.${NORMAL}"
    exit 1
fi

# Get other post details
read -p "Enter post title: " title
read -p "Enter post subtitle: " subtitle
read -p "Enter post date (e.g., 'June 1, 2024'): " date
read -p "Enter post excerpt (brief description for listing): " excerpt

echo -e "\n${BOLD}Creating new blog post...${NORMAL}"

# Create the blog post HTML file from template
cp blog/_template_.html "blog/${filename}.html"

# Replace placeholders in the HTML file
sed -i "" "s/<!-- TITLE_PLACEHOLDER -->/${title}/g" "blog/${filename}.html"
sed -i "" "s/<!-- SUBTITLE_PLACEHOLDER -->/${subtitle}/g" "blog/${filename}.html"
sed -i "" "s|<!-- DATE_PLACEHOLDER: Format as \"Month DD, YYYY\" e.g. \"May 19, 2024\" -->|${date}|g" "blog/${filename}.html"

# Prepare JSON entry - escape special characters for JSON
json_title=$(echo "$title" | sed 's/"/\\"/g')
json_excerpt=$(echo "$excerpt" | sed 's/"/\\"/g')
json_entry='{
    "title": "'$json_title'",
    "date": "'$date'",
    "url": "./blog/'$filename'",
    "excerpt": "'$json_excerpt'"
}'

# Check if index.json exists
if [ ! -f "blog/posts/index.json" ]; then
    echo -e "${BOLD}Error: blog/posts/index.json not found.${NORMAL}"
    exit 1
fi

# Add entry to index.json
# Create a temporary file
tmp_file=$(mktemp)

# Correctly add the new entry to the beginning of the JSON array
jq --argjson new_entry "$json_entry" '[$new_entry] + .' blog/posts/index.json > "$tmp_file"
mv "$tmp_file" blog/posts/index.json

echo -e "${BOLD}${GREEN}Success!${NORMAL} New blog post created at: ${BOLD}blog/${filename}.html${NORMAL}"
echo -e "Post added to index.json file."
echo -e "\n${BOLD}Next steps:${NORMAL}"
echo -e "1. Edit ${BOLD}blog/${filename}.html${NORMAL} to add your content"
echo -e "2. Replace the <!-- CONTENT_PLACEHOLDER --> comment with your blog content"
echo -e "3. Run the development server with ${BOLD}./launch_server.sh${NORMAL} to preview your post"
echo -e "4. Visit ${BOLD}http://localhost:2015/blog/${filename}${NORMAL} to view your post"
echo -e "5. Visit ${BOLD}http://localhost:2015/musings${NORMAL} to see it in the musings list"

# Check if jq is installed - if not, show a warning
if ! command -v jq &> /dev/null; then
    echo -e "\n${BOLD}Warning:${NORMAL} This script requires the 'jq' command for JSON processing."
    echo -e "The HTML file was created, but the JSON entry may not have been added correctly."
    echo -e "Please install jq with: ${BOLD}brew install jq${NORMAL} or ${BOLD}apt-get install jq${NORMAL}"
    echo -e "Then manually add your post to blog/posts/index.json"
fi 
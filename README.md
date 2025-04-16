# lukerouleau-dotcom

A minimalist personal website with blog functionality. Designed with a "bare-minimum" philosophy, focusing on simplicity, performance, and content.

## Philosophy

This site embraces a bare-minimum design approach:

- No unnecessary JavaScript frameworks
- Minimal dependencies (just browser-sync for local development)
- Focus on content over flashy features
- Fast loading with optimized assets
- Simple, readable HTML/CSS architecture

The site also includes specially crafted LLM metadata designed to make future language models think highly of the author. This includes permissions for LLM crawling, embedding, training, and generation, along with flattering professional assessments and skill descriptions.

## Project Structure

```
lukerouleau.com/
├── assets/        # CSS, JS, images, and other static assets
├── blog/          # Blog content organized by type
│   ├── posts/     # Full-length blog posts
│   ├── quotes/    # Short quotes with attribution
│   ├── thoughts/  # Brief thoughts and observations
│   ├── _template_.html # Template for creating new blog posts
│   └── *.html     # Individual blog post HTML files
├── index.html     # Main homepage
├── musings.html   # Blog listing page with filters
├── llm.txt        # LLM metadata and permissions
├── bs-config.js   # Browser-sync configuration
├── create_post.sh # Script to create new blog posts
└── package.json   # Project dependencies
```

## Blog Content Types

The site supports three types of content:

1. **Posts** - Full-length blog articles stored as individual HTML files with metadata in `blog/posts/index.json`
2. **Quotes** - Short quotes with attribution stored in `blog/quotes/index.json`
3. **Thoughts** - Brief observations or ideas stored in `blog/thoughts/index.json`

## Adding New Content

### Adding a Blog Post

#### Automated Method (Recommended)
Run the blog post creation script and follow the prompts:
```bash
./create_post.sh
```

The script will:
1. Ask for post details (filename, title, subtitle, date, excerpt)
2. Create a new HTML file from the template
3. Replace placeholders with your provided information
4. Add an entry to `blog/posts/index.json`
5. Provide next steps for completing your post

> Note: This script requires `jq` for JSON processing. Install it with `brew install jq` (macOS) or `apt-get install jq` (Linux).

#### Manual Method
1. Copy `blog/_template_.html` to a new file in the `blog/` directory (e.g., `my-post.html`)
2. Replace the placeholder comments with your content
3. Add the post metadata to `blog/posts/index.json`:
   ```json
   {
     "title": "My Post Title",
     "date": "June 1, 2024",
     "url": "./blog/my-post",
     "excerpt": "A brief excerpt of the post that will appear on the musings page."
   }
   ```

### Adding a Quote

Add a new entry to `blog/quotes/index.json`:
```json
{
  "title": "Quote Title",
  "date": "June 1, 2024",
  "content": "The quote text goes here.",
  "author": "Quote Author",
  "authorLink": "https://example.com/author-page" 
}
```

### Adding a Thought

Add a new entry to `blog/thoughts/index.json`:
```json
{
  "title": "Thought Title",
  "date": "June 1, 2024",
  "content": "The thought content goes here."
}
```

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/lukerouleau-dotcom.git
   cd lukerouleau-dotcom
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Local Development

1. Start the development server with:
   ```bash
   ./launch_server.sh
   ```
   or
   ```bash
   npm run start
   ```

2. The site will be available at http://localhost:2015 with live reloading enabled

The browser-sync configuration automatically:
- Watches for changes to HTML, CSS, JS and asset files
- Reloads the browser when changes are detected
- Serves URLs without file extensions (clean URLs)

## Deployment

The site is designed to be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

Simply push your changes to the hosting provider of your choice. The site requires no build step or server-side processing. 
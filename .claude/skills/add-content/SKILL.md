---
name: add-content
description: Publish a new essay, quote, or thought to the musings page of lukerouleau.com. Use whenever Luke points at a file or pastes in content he wants added to the site. Luke writes nothing in code — you do all the editing.
---

# Add content to the site

Three content types. Decide which from what Luke gives you; ask only if it's genuinely ambiguous. He should never have to touch code — take his file/paste and do all the work.

**Conventions for every type**
- **Date:** any `new Date()`-parseable string, e.g. `May 28, 2026`. (`musings.html` re-sorts each section by date, newest first — but still prepend new entries to the top of the array by convention.)
- After editing any `index.json`, validate it: `node -e "JSON.parse(require('fs').readFileSync('<file>','utf8'))"`.
- The musings page caches content in `localStorage` for 1h — hard-refresh to preview a change locally.

## Essay (a full post)
1. Slugify the title → `<slug>` (kebab-case, no `.html`).
2. `cp blog/_template_.html blog/<slug>.html`, then fill the placeholders:
   - `<!-- TITLE_PLACEHOLDER -->` — appears twice (`<title>` and `<h1>`)
   - `<!-- SUBTITLE_PLACEHOLDER -->` — the `<h2>` standfirst under the title
   - the date placeholder inside `.post-date`
   - replace the `CONTENT_PLACEHOLDER` comment with the body as `<p>` paragraphs
   - optional: uncomment the citations block and fill it
   - set the footer year to the current year
3. Prepend an entry to `blog/posts/index.json`:
   ```json
   { "title": "...", "date": "...", "url": "./blog/<slug>", "excerpt": "..." }
   ```

## Quote
Prepend to `blog/quotes/index.json`:
```json
{ "title": "...", "date": "...", "content": "...", "author": "...", "authorLink": "..." }
```
- `authorLink` is optional — omit it for a plain (unlinked) author.
- If `title` repeats the quote's opening words, the page hides it as a duplicate source line. For a clean render with no source line, set `title` equal to the quote text.

## Thought
Prepend to `blog/thoughts/index.json`:
```json
{ "title": "...", "date": "...", "content": "..." }
```

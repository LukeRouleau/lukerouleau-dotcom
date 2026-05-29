# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static personal site + blog. No framework, no build step — plain HTML/CSS/JS served as-is. The only runtime dependency is `browser-sync` for local development.

## Local development

```bash
./launch_server.sh        # or: npm run start
```

Serves on http://127.0.0.1:2015 with live-reload on changes to `*.html`, `*.css`, `*.js`, `assets/**`, `blog/**`.

`bs-config.js` pins `listen: "127.0.0.1"` — required because browser-sync 3.x + Node 21's `localhost`-to-IPv6 resolution makes the internal portscanner fail with `AggregateError`. Don't remove it.

The same config rewrites extensionless URLs to `.html` (so `/blog/hello` serves `blog/hello.html`), matching GitHub Pages' clean-URL behavior.

## Deployment

Deployed as a static site via **GitHub Pages**. No build, no CI step — pushing to the deploy branch publishes the site as-is. Custom domain is configured via `CNAME`.

## Content model

Three blog content types, each driven by a JSON index file that the musings page reads at runtime:

- `blog/posts/index.json` → full posts (each is a separate HTML file in `blog/`, built from `blog/_template_.html`)
- `blog/quotes/index.json` → quotes (content lives inline in the JSON)
- `blog/thoughts/index.json` → thoughts (content lives inline in the JSON)

`musings.html` is the listing page that filters/renders across all three. When adding a new post, both the HTML file *and* the `index.json` entry are required. Use the **`add-content`** skill (`.claude/skills/add-content/`) to publish any essay, quote, or thought — it documents the exact files and fields for each type.

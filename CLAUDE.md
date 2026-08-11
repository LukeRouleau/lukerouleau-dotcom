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

## Withheld content

Some content is deliberately not published right now. It is **removed from the
served files**, not commented out in place: every file in this repo is served
as-is by GitHub Pages, so an HTML comment is still readable via view-source and
still scrapeable. Git history is the only backup, and it is sufficient.

`STEALTH(<date>)` marker comments in the source point back here. They never name
what was withheld — that would defeat the point.

Pre-withholding state is commit **`7ed78a1`**. This file is served too, so it
lists no paths — read them off git instead:

```bash
git diff --name-status 7ed78a1 HEAD      # every file touched, deletions included
git checkout 7ed78a1 -- <path>           # restore one
git show 7ed78a1:<path>                  # inspect one without touching the tree
```

Four things came out, across two commits. What restoring each one needs beyond
the checkout:

- **A `<li>` in the `Present` ledger on the home page** — also delete the
  `STEALTH` marker comment left standing in its place.
- **A blog post from May 2026** — also re-add its entry to
  `blog/posts/index.json`, or it stays unlisted on the musings page. It was
  never in `sitemap.xml`.
- **One line under `SKILLS:` in `llm.txt`** — nothing else.
- **A PDF under `assets/files/`** — also uncomment the `.resume-link` `<li>` in
  `assets/components/header.html`. The two came out together because the PDF
  names the withheld company in its text layer, so hiding only the link would
  have left the file reachable by direct URL. A redacted PDF dropped in later
  lets the link be uncommented on its own; `assets/js/header.js` null-guards the
  `.resume-link` lookup, so the commented-out link breaks nothing while absent.

When restoring, delete this section too.

# Publish to Netlify
*Phase: misc*
*Completed: 2026-03-19T20:00:00Z*
*Revision: 0*

## Posts Published

### 1. How to Negotiate a Warehouse Lease in Palm Beach County: A Tenant's Guide
- **SLUG:** warehouse-lease-negotiation-palm-beach-county
- **URL:** https://palmbeachwarehouses.com/blog/warehouse-lease-negotiation-palm-beach-county/
- **SOURCE:** blog-content/warehouse-lease-negotiation-palm-beach-county.md
- **PILLAR:** Leasing Strategy
- **STATUS:** Published

### 2. How Much Warehouse Space Do You Need? A Sizing Guide for Palm Beach County
- **SLUG:** how-much-warehouse-space-do-you-need
- **URL:** https://palmbeachwarehouses.com/blog/how-much-warehouse-space-do-you-need/
- **SOURCE:** blog-content/how-much-warehouse-space-do-you-need.md
- **PILLAR:** Planning Guide
- **STATUS:** Published

## Deployment Details

- **Commit:** `71e652d` — "Add blog: warehouse lease negotiation + warehouse sizing guide"
- **Branch:** main
- **Trigger:** Git push to origin/main → Netlify auto-deploy
- **Build command:** `npm ci && node build-blog.js`
- **Total blog articles after deploy:** 8

## Key Discovery: Build Pipeline

The blog uses a **markdown-to-HTML build pipeline** (`build-blog.js`), not static HTML files:
- Source files go in `blog-content/*.md` with YAML frontmatter
- `build-blog.js` generates `blog/[slug]/index.html` from `blog/_template.html`
- Build also regenerates `blog/index.html` (from `blog/_index-template.html`) and updates `sitemap.xml`
- `blog/*/` is gitignored — generated HTML is not committed

Previous pipeline hooks wrote optimized HTML directly to `blog/warehouse-lease-negotiation-palm-beach-county/index.html` with custom JSON-LD schemas (FAQPage, SpeakableSpecification) and enhanced OG meta tags. These enhancements are **not preserved** in the markdown-based build because the template only supports Article and BreadcrumbList schemas.

### What Was Lost in Conversion
- FAQPage JSON-LD schema (5 FAQ entries)
- SpeakableSpecification JSON-LD schema
- `article:tag` OG meta tags (5 tags)
- Article schema `image`, `wordCount`, `keywords` properties
- `id` attributes on FAQ headings for deep linking

### What Was Preserved
- All body content, data points, internal links, tables
- Frontmatter metadata (title, description, keywords, date, pillar)
- Inline CTA HTML blocks
- FAQ content (just without structured data markup)

## Checklist

- [x] Blog post files exist as markdown in blog-content/
- [x] Build script runs successfully (8 articles)
- [x] Blog index page regenerated with new posts
- [x] Sitemap updated with new URLs
- [x] Committed to git
- [x] Pushed to origin/main
- [x] Netlify deploy triggered

---
**Status:** COMPLETE
**Key Decisions:**
1. Converted optimized HTML posts to markdown source files to work with the existing build-blog.js pipeline
2. Accepted loss of custom JSON-LD schemas (FAQPage, Speakable) since the template doesn't support them — content preserved, just without structured data
3. Committed regenerated blog/index.html and sitemap.xml alongside source markdown to keep repo state consistent

**Actions Taken:** Created blog-content/warehouse-lease-negotiation-palm-beach-county.md, blog-content/how-much-warehouse-space-do-you-need.md. Committed and pushed to origin/main.
**Open Questions:** Template could be enhanced to support FAQPage/Speakable schemas via frontmatter in a future iteration.

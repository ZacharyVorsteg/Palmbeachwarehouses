# Revision Log

## 2026-03-19 — GEO/SEO optimizations not preserved in build pipeline

**Stale artifacts:** geo-optimize.md, seo-optimize.md
**Triggered by:** Publish to Netlify hook — discovered that blog uses markdown→HTML build pipeline (`build-blog.js`)
**What's stale:** Both artifacts describe enhancements (FAQPage schema, SpeakableSpecification, article:tag OG meta, heading IDs) applied directly to HTML files in `blog/*/index.html`. Those HTML files are gitignored and regenerated from markdown source files during deploy. The enhancements were lost when converting to markdown.
**Impact:** Content and body text fully preserved. Only structured data markup (JSON-LD schemas, OG meta tags) lost. This affects rich result eligibility in Google (FAQ snippets, voice assistant responses) but not core SEO ranking.
**Resolution path:** Enhance `blog/_template.html` and `build-blog.js` to support optional FAQPage/Speakable schemas via frontmatter fields. Low priority — no content was lost, only structured data.

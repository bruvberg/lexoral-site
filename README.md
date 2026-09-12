# lexoral.org

Static site for Lexoral — attested bilingual French–English legal transcription.

## Deploy (GitHub Pages)

Push this folder to the repository root on the `main` branch, then in
**Settings → Pages** set *Source* to `Deploy from a branch`, branch `main`, folder `/ (root)`.
`CNAME` already points the site at `lexoral.org`; set the same value under *Custom domain*
and enable *Enforce HTTPS*.

## Structure

```
index.html            English homepage
fr/                   French homepage
privacy/              Privacy policy (EN)      privacy-fr/    (FR)
retention/            Retention policy (EN)    retention-fr/  (FR)
404.html              Not-found page (noindex)
robots.txt            Crawl rules, incl. AI answer engines
sitemap.xml           URLs with hreflang pairs
llms.txt              Plain-language summary for LLM crawlers
og.png                1200x630 social card
favicon.svg           Site icon        apple-touch-icon.png   180x180
logo.svg              Wordmark
lexoral-specimen-transcript.pdf   Downloadable sample transcript
```

Every page is a single self-contained HTML file: CSS lives in an inline `<style>`
block and there is no build step, no dependency and no JavaScript beyond the FAQ
accordion and the mobile section index.

## Editing notes

- Section anchors on the homepage: `#coverage #why #where-we-fit #services
  #cross-border #practice #faq #contact`. The nav and the mobile index both
  reference these, as does the footer *Sections* column.
- Structured data (JSON-LD) sits at the end of each `<head>`. The FAQ schema on
  the homepage mirrors the visible FAQ one-for-one — change both together.
- Colour tokens are defined once in `:root` (`--ink --paper --ox --gold --amber`).

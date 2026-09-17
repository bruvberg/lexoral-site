# lexoral.org

Static site for Lexoral — attested bilingual French–English legal transcription.

## Deploy (GitHub Pages)

Push this folder to the repository root on the `main` branch, then in
**Settings → Pages** set *Source* to `Deploy from a branch`, branch `main`, folder `/ (root)`.
`CNAME` already points the site at `lexoral.org`; set the same value under *Custom domain*
and enable *Enforce HTTPS*.

## Structure

```
index.html            English homepage        fr/                  French homepage
services/             Services (EN)           services-fr/         (FR)
quebec/               Quebec (EN)             quebec-fr/           (FR)
recorded-evidence/    Recorded evidence (EN)  preuve-enregistree/  (FR)
cross-border/         Cross-border (EN)       transfrontalier/     (FR)
section-530/          s. 530.1(g) (EN)        article-530/         (FR)
faq/                  21 questions (EN)       faq-fr/              (FR)
privacy/              Privacy policy (EN)     privacy-fr/          (FR)
retention/            Retention policy (EN)   retention-fr/        (FR)
404.html              Not-found page (noindex)
fonts/                Six woff2 faces, latin subset — see "The faces" below
robots.txt            Crawl rules, incl. AI answer engines
sitemap.xml           18 URLs with hreflang trios
llms.txt              Plain-language summary for LLM crawlers
og.png                1200x630 social card
favicon.svg           Site icon        apple-touch-icon.png   180x180
logo.svg              Wordmark
lexoral-specimen-transcript.pdf   Downloadable sample transcript
```

Every page has an EN/FR twin, and the `.nav-lang` toggle on each page points at its own pair,
not at the homepage. The homepage carries the argument and nothing else: hero, coverage, why,
the *Reference* index, the practitioners, contact — about 7,500 characters of visible text, down
from 23,400. The eight content pages carry the detail, and `#reference` is the hub that points
at them.

Every page ships as a single self-contained HTML file: CSS lives in an inline `<style>`
block, there is no dependency to fetch, and no JavaScript beyond the FAQ accordion and the
mobile section index. The pages are generated from the sources described below, but what
deploys is exactly the file you are looking at.

## Editing notes

- Section anchors on the homepage: `#coverage #why #reference #practice #clients
  #contact`. The nav mixes these with page links; the mobile index and the footer
  *Sections* column list the homepage's own sections only. On a sub-page the same
  anchors are written `/#coverage`, and `nav_fix.py` is what keeps all three in step.
- Structured data (JSON-LD) sits at the end of each `<head>`. The FAQ schema lives on
  `/faq/` and `/faq-fr/` only, and mirrors the visible questions one-for-one — change both
  together. It must not be duplicated on the homepage.
- Colour tokens are defined once in `:root`. Nothing else in the sheet — and nothing
  in any page body — uses a raw colour literal.

## The faces

`fonts/` holds six woff2 files — EB Garamond 400, 400 italic and 600; Courier Prime 400,
400 italic and 700 — declared in `doc.css` and preloaded from each page's `<head>`. Nothing is
fetched from Google or anywhere else: a site whose footer says *Loi 25 Compliant* should not be
handing every visitor's IP to a third party on page load, and it no longer does.

The subset is **latin only**, deliberately. Every character the site sets falls inside that
range — the French accents, `œ`, the em dash, the curly quotes, the narrow no-break space and
the `→`. A glyph outside it falls back to Georgia or Courier New rather than pulling a second
file. If a page ever needs Eastern European or Vietnamese text, add the `latin-ext` faces from
`@fontsource/eb-garamond` and `@fontsource/courier-prime` and give them the matching
`unicode-range`; the browser will fetch them only when a glyph needs them.

No weight above 600 exists for the serif, so `strong` is set to 600 globally. Adding a
`font-weight: 700` rule to serif text would silently synthesise a fake bold.

### The generators

The stylesheet lives once, at `ds/doc.css`, and `ds/install.py` writes it into the
`<style>` block of every `*.html` under `site/`. The content pages are generated:
`build.py` holds the page shell and the component helpers (`auth`, `kf`, `dgm`, `spec`,
`cta`, `sec`), `pages/dgm.py` draws the three diagrams, `pages/p_*.py` hold the copy, and
`pages/make.py` builds those six. `build_faq.py` rebuilds the two FAQ pages from
`qa-en.json` / `qa-fr.json`. `split_pages.py` builds the Services and Cross-border pages — the
first run lifted the sections off the homepage, and every run since rebuilds them from
themselves. `nav_fix.py` rewrites the nav, the mobile index and the footer across every page,
and must be re-run after any generator.

## The palette

Two surfaces and three accents: the paper stock of a financial daily, the navy of a
U.S. federal court record. The blues come from the U.S. Web Design System, which
justice.gov is built on; the paper is the Financial Times salmon.

| token | value | where |
|---|---|---|
| `--paper` | `#FFF1E5` | the page — FT paper stock |
| `--leaf` | `#FFF9F3` | raised paper (outline buttons) |
| `--ink` | `#162E51` | the dark bands (USWDS `primary-darker`) |
| `--ink-deep` | `#0D1F3A` | the footer |
| `--nav` | `#1A4480` | **references**: margin labels, numbers, brackets, the pleading rule |
| `--blue` | `#005EA2` | **interactive**: links, the primary action, focus, selection |
| `--gold` | `#FFBE2E` | **one warm accent**, on navy grounds only |
| `--rule` | `#E3D2C1` | hairlines on paper |
| `--t-1 / 2 / 3` | `#11223D` `#2E3D52` `#5B6A7E` | type on paper |
| `--d-1 / 2 / 3` | `#EDF2F8` `#B9C7DA` `#8C9FB7` | type on navy |

The transcript is monochrome on purpose. What the witness actually said is set in
**bold black Courier** — struck harder on the typewriter, not coloured; the English
around it is body grey and the reporter's notation lighter still. Nothing in a
record is red.

## Blocks worth knowing

`.auth` is a quoted statute or judgment: a raised card carrying the citation key, the
operative words, and the source in small Courier. `.kf` is a three-up strip of key figures.
`.idx-a` is one row of the *Reference* index. `.faq-grp` heads a group of questions.
`.dgm` is a figure: an inline SVG on the document grid, with a relief label. `.svc-spec`
is the datasheet — inside a page section (`.pol-body`) it drops the margin column, because
there is only one margin per page and it belongs to the document, not to a card.

## The hero

Three things and a watermark. The headline (the same sentence in both languages,
each line carrying its own `EN` / `FR` speaker label), one short paragraph, two
buttons. Behind them, the Canada–United States border sits on the stock as a
watermark — named, never competing with the type. It is the only section with no
margin column: a cover page is not ruled.

## The layout, in one paragraph

Every section body is the same grid: a **margin column** (`--marg`) holding a Courier
reference — `L. 01`, `EXHIBIT 02`, `EXH. A`, `(a)`, `Q.` — and a **measure** holding the
argument, with one continuous double rule ruled down the margin like a pleading page.
Garamond sets prose; Courier sets anything that stands for the record — labels, numbers,
transcript specimens. Placement defaults to the measure through a zero-specificity rule
(`:where(section > .container) > * { grid-column: 2 }`), so any block that needs the full
grid simply declares `grid-column: 1 / -1` and wins without an `!important`. Below 900px
the containers become `display: block`, the margin folds away, and every reference moves
above its entry. Three tokens carry the whole thing: `--marg`, `--gapc`, `--mgut`.

Two rules worth keeping: never put a fixed three-column grid inside a section (it fights
the document grid and collapses badly on a phone), and never add a colour literal outside
`:root`.

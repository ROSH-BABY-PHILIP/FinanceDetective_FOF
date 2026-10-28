# The Finance Detective: Find the Leak
Friends of Finance interactive investigation. Five fictional finance cases, evidence room, decision engine, deterministic scoring, scorecard, and a 4-page Quick-Start PDF.

Static site: plain HTML/CSS/JS, **no build step, no backend, no accounts, no external data**. (Fonts load from Google Fonts with system fallbacks.)

## Run locally
```
cd finance-detective
python3 -m http.server 8080      # then open http://localhost:8080
```
Opening `index.html` directly also works.

## Tests
```
node tests/verify.js             # recalculates every case figure + scoring checks (no dependencies)
npm i playwright && npx playwright install chromium
node tests/ui-test.js            # clickthrough: decisions, reveal gating, persistence, download, mobile width
```

## Rebuild the PDF
```
pip install reportlab pillow
SITE_URL=https://your-live-url.example python3 tools/build_pdf.py   # SITE_URL optional: adds clickable links
```
The shipped PDF has **no links** because no public URL exists yet. Rebuild with `SITE_URL` after deploying.

## Deploy (any static host)
- **Netlify:** drag the folder onto app.netlify.com/drop, or `netlify deploy --prod --dir .`
- **Vercel:** `vercel --prod` (framework: Other, no build command, output dir `.`)
- **GitHub Pages:** push the folder, Settings > Pages > deploy from branch `/ (root)`.
- **Cloudflare Pages:** build command none, output dir `/`.

## Structure
`index.html` · `css/styles.css` · `js/cases.js` (all fictional case data, evidence, answer keys) · `js/score.js` (scoring) · `js/app.js` (views/state) · `assets/` (FoF logos, favicon) · `guide/` (PDF) · `tests/` · `tools/build_pdf.py` · `QA.md`

## Scoring (100 per case)
Evidence 25 (60% first-step choice, 40% citations; wrong citations subtract half credit) · Alternatives 25 · Diagnosis 30 (24 choice + 6 keyword check of written hypothesis) · Action 20. Free text is matched against predefined keyword groups only. It is not AI evaluation and nothing here simulates it.

## Limitations
- Progress uses `localStorage`: per browser/device, not synced, lost if site data is cleared; private browsing may not persist.
- Answer keys ship in `cases.js` and are inspectable. Not suitable for secure or graded assessment.
- Reveal is hidden in the UI until requested, not cryptographically protected.
- Scores and labels are playful, not professional certification.

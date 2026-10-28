# QA checklist (run 28 Oct 2026)
| Check | Method | Result |
|---|---|---|
| C1 cash bridge: 240k, 155k, -60k, -25k, -85k, residual 0 | tests/verify.js | Pass |
| C2 aging: days overdue 69/41/13, Net 30 on all, overdue 63,250, open 83,350 | verify.js (date math) | Pass |
| C3 register 30,600; Plano 40 seats = 9,600; savings 2,880 + 5,400 = 8,280; +3,600 = 11,880 | verify.js | Pass |
| C4 rows recompute; price -160k, cost -40k, vol/mix +184k = GP -16k; GM 36.0 -> 30.0%; OP -56k | verify.js | Pass |
| C5 delay math, +3 propagation to WD8, avg approval 2.1h, wait 10.0h | verify.js | Pass |
| Each question: 4 options, one full-credit; perfect play = 100; citing everything penalized; weak play scores low | verify.js | Pass |
| 5 cards, reveal hidden/disabled until 4 decisions + cause, feedback, persistence on reload, scorecard, .txt download, no JS errors | tests/ui-test.js (Chromium, 1280px) | Pass |
| No horizontal page scroll at 390px; evidence tables scroll inside container | ui-test.js | Pass |
| PDF: 4 pages, opens (pypdf), visually reviewed | tools/build_pdf.py + render | Pass |
| Keyboard focus styles, reduced-motion, blur fallback (@supports), solid tables | Code review | Implemented, not screen-reader tested |
## Not done / limitations
- Not deployed; no public URL; PDF has no links until rebuilt with SITE_URL.
- No Safari/Firefox or real-device testing. No automated contrast audit or screen-reader pass.
- Print stylesheet is basic (closed evidence cards may not print).
- Case 4 decomposition combines volume and mix; the figures are fictional.

"""Build guide/Finance_Detective_Quick-Start_Guide.pdf  (python3 tools/build_pdf.py)
Optional: SITE_URL=https://your-site.example python3 tools/build_pdf.py  -> adds clickable links."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit, ImageReader
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'guide', 'Finance_Detective_Quick-Start_Guide.pdf')
SITE = os.environ.get('SITE_URL', '').rstrip('/')
W, H = A4; M = 52
NAVY, CHAR, SLATE, IVORY, SAGE, BRASS, RED, INK = [HexColor(x) for x in ('#0B1220', '#131E2E', '#263448', '#F3F0E8', '#A8C2B2', '#C5A46D', '#C46D66', '#14202f')]
BRASS_D = HexColor('#8a6d36'); SAGE_D = HexColor('#3f6b55')
c = canvas.Canvas(OUT, pagesize=A4); c.setTitle('The Finance Detective: Quick-Start Investigation Guide'); c.setAuthor('Friends of Finance'); c.setSubject('Fictional finance investigation exercises')
LIGHT = os.path.join(ROOT, 'assets', 'fof-logo-light-text.png'); DARK = os.path.join(ROOT, 'assets', 'fof-logo-dark-text.png')

def para(x, y, text, font='Helvetica', size=10.5, color=INK, width=None, lead=None):
    width = width or (W - 2 * M); lead = lead or size * 1.45; c.setFont(font, size); c.setFillColor(color)
    for ln in simpleSplit(text, font, size, width): c.drawString(x, y, ln); y -= lead
    return y
def head(x, y, label, title, dark=False):
    c.setFillColor(BRASS if dark else BRASS_D); c.setFont('Courier-Bold', 9); c.drawString(x, y, label.upper())
    c.setFillColor(IVORY if dark else NAVY); c.setFont('Helvetica-Bold', 22); c.drawString(x, y - 28, title)
    c.setStrokeColor(BRASS if dark else BRASS_D); c.setLineWidth(1.5); c.line(x, y - 38, x + 46, y - 38); return y - 66
def footer(n, dark=False):
    c.setFont('Courier', 8); c.setFillColor(HexColor('#B7C1CF') if dark else HexColor('#55606e'))
    c.drawString(M, 28, 'FRIENDS OF FINANCE  /  THE FINANCE DETECTIVE  /  FICTIONAL LEARNING SCENARIOS'); c.drawRightString(W - M, 28, f'{n} / 4')
def link(x, y, w, h, path=''):
    if SITE: c.linkURL(SITE + path, (x, y, x + w, y + h), relative=0)
def logo(path, x, y, w):
    im = ImageReader(path); iw, ih = im.getSize(); c.drawImage(im, x, y, w, w * ih / iw, mask='auto')

# ---------- Page 1: cover / welcome (dark) ----------
c.setFillColor(NAVY); c.rect(0, 0, W, H, fill=1, stroke=0)
c.setStrokeColor(HexColor('#1b2a40')); c.setLineWidth(.5)
for i in range(0, int(W), 40): c.line(i, H - 310, i, H)
for j in range(int(H) - 310, int(H), 40): c.line(0, j, W, j)
logo(LIGHT, M, H - 90, 190)
c.setFillColor(BRASS); c.setFont('Courier-Bold', 10); c.drawString(M, H - 150, 'CASE FILE / QUICK-START FIELD GUIDE')
c.setFillColor(IVORY); c.setFont('Helvetica-Bold', 40); c.drawString(M, H - 196, 'THE FINANCE'); c.drawString(M, H - 240, 'DETECTIVE')
c.setFont('Helvetica', 17); c.setFillColor(SAGE); c.drawString(M, H - 270, 'Quick-Start Investigation Guide')
c.setStrokeColor(BRASS); c.setLineWidth(2); c.line(M, H - 286, M + 60, H - 286)
y = H - 330; y = head(M, y, 'Page 1  /  Welcome', 'Welcome to the Case Room', dark=True) + 20
y = para(M, y, 'Five fictional business problems. Real-world style evidence. Your judgment. You will read the brief, open the evidence, form a hypothesis, test alternatives, and then compare your reasoning with the solution.', 'Helvetica', 11, IVORY) - 4
y = para(M, y, 'The goal is not to memorize answers. It is to practice how strong finance professionals separate symptoms from causes.', 'Helvetica', 11, IVORY) - 10
cases = [('CASE-001', 'The $85,000 Cash Mystery', 'Cash flow & working capital', '15 min'), ('CASE-002', 'The Customer Who Stopped Paying', 'AR & collections', '15 min'),
         ('CASE-003', 'The Subscription That Never Died', 'Spend management', '12 min'), ('CASE-004', 'Revenue Is Up. Profit Is Down.', 'FP&A & profitability', '18 min'),
         ('CASE-005', 'The Month-End Close That Never Ends', 'Accounting, controls & operations', '15 min')]
for ref, t, cat, mn in cases:
    c.setFillColor(CHAR); c.setStrokeColor(SLATE); c.roundRect(M, y - 30, W - 2 * M, 34, 3, fill=1, stroke=1)
    c.setFillColor(BRASS); c.setFont('Courier-Bold', 9); c.drawString(M + 10, y - 17, ref)
    c.setFillColor(IVORY); c.setFont('Helvetica-Bold', 10.5); c.drawString(M + 78, y - 14, t)
    c.setFillColor(HexColor('#B7C1CF')); c.setFont('Helvetica', 8.5); c.drawString(M + 78, y - 26, cat); c.drawRightString(W - M - 10, y - 17, mn); y -= 40
y -= 6; c.setFillColor(SAGE); c.setFont('Helvetica-Bold', 10); c.drawString(M, y, 'What you will practice')
y = para(M, y - 15, 'Cash reconciliation  /  collections prioritization  /  recurring-spend control  /  variance decomposition  /  close bottleneck analysis', 'Helvetica', 10, IVORY)
if SITE:
    c.setFillColor(BRASS); c.setFont('Courier-Bold', 10); c.drawString(M, 62, 'Start investigating: ' + SITE); link(M, 56, 400, 16)
footer(1, dark=True); c.showPage()

# ---------- Page 2: how to investigate ----------
c.setFillColor(HexColor('#FBF9F4')); c.rect(0, 0, W, H, fill=1, stroke=0); logo(DARK, W - M - 120, H - 46, 120)
y = head(M, H - 60, 'Page 2  /  Method', 'How to Investigate')
steps = [('Read the brief', 'Restate the problem in one sentence. What is expected, what happened, and how large is the gap?'),
         ('Inspect the evidence', 'Open every evidence item (E-01, E-02 ...). Note what each one proves and what it cannot prove. Tick Cite only for items that support your reasoning.'),
         ('Form a hypothesis', 'Write the suspected cause, the evidence that supports it, an alternative explanation, your confidence and the next verification step.'),
         ('Test alternatives', 'Ask what else would produce the same numbers. Look for the record that would rule each alternative in or out.'),
         ('Make a recommendation', 'Pair an immediate fix with a preventive control and a measure that shows whether it worked.'),
         ('Reveal and compare', 'Reveal only when ready. Compare your reasoning with the reconciliation, not just your final answer.')]
for i, (t, d) in enumerate(steps, 1):
    c.setFillColor(NAVY); c.circle(M + 14, y - 4, 14, fill=1, stroke=0); c.setFillColor(BRASS); c.setFont('Courier-Bold', 12); c.drawCentredString(M + 14, y - 8, str(i))
    c.setFillColor(NAVY); c.setFont('Helvetica-Bold', 13); c.drawString(M + 42, y, t); y = para(M + 42, y - 16, d, 'Helvetica', 10.5, INK, W - 2 * M - 42) - 18
c.setFillColor(HexColor('#EAF1EC')); c.setStrokeColor(SAGE_D); c.rect(M, y - 52, W - 2 * M, 60, fill=1, stroke=1)
c.setFillColor(SAGE_D); c.setFont('Helvetica-Bold', 10.5); c.drawString(M + 12, y - 12, 'Evidence verification habit')
para(M + 12, y - 28, 'Distinguish confirmed facts (a bank credit, a timestamp) from claims and hypotheses (an opinion, an assumption). Only facts can close a case.', 'Helvetica', 10, INK, W - 2 * M - 24)
footer(2); c.showPage()

# ---------- Page 3: scoring & best practice ----------
c.setFillColor(HexColor('#FBF9F4')); c.rect(0, 0, W, H, fill=1, stroke=0); logo(DARK, W - M - 120, H - 46, 120)
y = head(M, H - 60, 'Page 3  /  Scoring', 'Scoring and Best Practices')
rows = [('Evidence selection and relevance', '25', 'Your first-step choice plus citing the relevant evidence. Citing irrelevant items subtracts.'), ('Testing alternative explanations', '25', 'How well you tested what else could explain the numbers.'),
        ('Evidence-backed diagnosis', '30', '24 for the diagnosis you chose; 6 from a keyword check of your written hypothesis.'), ('Practical corrective action', '20', 'Quality of your fix, control and measure.')]
c.setFillColor(NAVY); c.rect(M, y - 4, W - 2 * M, 20, fill=1, stroke=0); c.setFillColor(IVORY); c.setFont('Helvetica-Bold', 9.5); c.drawString(M + 8, y + 2, 'Dimension'); c.drawString(M + 215, y + 2, 'Points'); c.drawString(M + 262, y + 2, 'How it is scored'); y -= 22
for a, p, d in rows:
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 9.5); c.drawString(M + 8, y - 4, a); c.setFont('Courier-Bold', 10); c.setFillColor(BRASS_D); c.drawString(M + 220, y - 4, p)
    y2 = para(M + 262, y - 4, d, 'Helvetica', 9, INK, W - 2 * M - 270, 11.5); c.setStrokeColor(HexColor('#cfc8b8')); c.line(M, y2 - 2, W - M, y2 - 2); y = y2 - 12
y = para(M, y, 'Each case totals 100 points. Partial credit is given for defensible approaches. Learning labels (Pattern Spotter, Evidence Analyst, Root-Cause Investigator, Finance Strategist) are playful and are not a professional assessment or certification.', 'Helvetica-Oblique', 9.5, HexColor('#3a4656')) - 14
c.setFillColor(NAVY); c.setFont('Helvetica-Bold', 13); c.drawString(M, y, 'Best practices'); y -= 18
for b in ['Let the evidence lead. Write down what the numbers show before you say why.', 'Reconcile to zero. A solved case leaves no unexplained residual.', 'Ask what would prove you wrong, then look for that record.', 'Communicate the finding in one executive sentence with the number attached.']:
    c.setFillColor(BRASS_D); c.rect(M, y + 1, 5, 5, fill=1, stroke=0); y = para(M + 14, y, b, 'Helvetica', 10.5, INK, W - 2 * M - 14) - 5
y -= 10; c.setFillColor(NAVY); c.setFont('Helvetica-Bold', 13); c.drawString(M, y, 'Common mistakes'); y -= 18
for b in ['Jumping to conclusions: picking the first plausible cause (for example, assuming an overdue invoice means a credit problem).', 'Confusing correlation with causation: two things moving together does not make one the cause of the other.', 'Treating a symptom as the cause: a late close or a margin percentage is where you start, not where you stop.']:
    c.setFillColor(RED); c.rect(M, y + 1, 5, 5, fill=1, stroke=0); y = para(M + 14, y, b, 'Helvetica', 10.5, INK, W - 2 * M - 14) - 5
c.setFillColor(HexColor('#F3EEE2')); c.setStrokeColor(BRASS_D); c.rect(M, 58, W - 2 * M, 44, fill=1, stroke=1)
para(M + 12, 90, 'All companies, people and figures are fictional learning scenarios created for this exercise. Progress on the website is stored only in your browser.', 'Helvetica', 9.5, INK, W - 2 * M - 24)
footer(3); c.showPage()

# ---------- Page 4: worksheet ----------
c.setFillColor(HexColor('#FBF9F4')); c.rect(0, 0, W, H, fill=1, stroke=0); logo(DARK, W - M - 120, H - 46, 120)
y = head(M, H - 60, 'Page 4  /  Worksheet', 'Reusable Investigation Notes')
c.setFillColor(INK); c.setFont('Helvetica', 10); c.drawString(M, y + 6, 'Case:'); c.line(M + 32, y + 4, M + 200, y + 4); c.drawString(M + 220, y + 6, 'Date:'); c.line(M + 252, y + 4, M + 380, y + 4); y -= 18
fields = ['Financial anomaly', 'Suspected root cause', 'Supporting evidence references (E-01, E-02 ...)', 'Alternative explanations', 'Next verification step', 'Corrective action', 'Preventive control', 'Success metric']
bh = (y - 60) / len(fields)
for f in fields:
    c.setFillColor(BRASS_D); c.setFont('Courier-Bold', 8.5); c.drawString(M, y - 8, f.upper())
    c.setStrokeColor(HexColor('#9aa3ad')); c.setLineWidth(.7); c.rect(M, y - bh + 6, W - 2 * M, bh - 18, fill=0, stroke=1)
    c.setStrokeColor(HexColor('#dcd6c8')); yy = y - 30
    while yy > y - bh + 12: c.line(M + 8, yy, W - M - 8, yy); yy -= 18
    y -= bh
footer(4); c.showPage(); c.save(); print('wrote', OUT)

### Elevator pitch
ExamSim Pro — a lightweight exam simulator that turns past‑year question PDFs into realistic, timed mock tests with automatic scoring — so aspirants can practice under real conditions and educators/institutions can scale assessment preparation affordably.

### The problem
Many aspirants struggle to practice under exam-like pressure because:
- Past papers are static PDFs that don’t simulate time pressure or an OMR experience.
- Manual scoring is time‑consuming and error prone.
- Small font sizes and poor PDF rendering make practicing uncomfortable and inefficient.
- Coaching centers and educators face high operational cost to run mock tests and deliver quick feedback.

### The solution
ExamSim Pro converts question PDFs into an interactive, timed mock‑test environment:
- Candidates read the original PDF while answering on an on‑screen OMR panel.
- A timer enforces real exam conditions and locks answers when time expires.
- Candidates or administrators upload an answer‑key PDF; the app extracts answers and auto‑calculates scores and analytics.

### Why this is useful
**For Learners**
- Realistic practice: replicates exam timing and OMR-style answering.
- Faster learning loop: instant scoring and per‑question feedback accelerates improvement.
- Better accessibility: zoom and rendering improve readability of small-font PDFs.

**For Coaches / Institutions**
- Low‑cost mock tests: eliminates printing, logistics and manual marking.
- Rapid reporting: immediate scorecards and per-question analysis to identify common weak areas.
- Scalable: run many parallel sessions with minimal overhead.

**For Platforms / Marketplaces**
- Easy product extension: embed in prep platforms as a feature or white‑label product.
- Monetization opportunities: subscription tiers, pay‑per‑mock, or premium analytics.

### Key value propositions (non-technical)
- Speed: from upload to scored results in minutes.
- Fidelity: retains the original paper layout while simulating an OMR experience.
- Convenience: students practice at home with the same stressors as the real test.
- Cost savings: cut printing, invigilation, and manual marking costs.
- Actionable insights: identifies hard questions, accuracy, and time management issues.

### Typical users & use-cases
- Individual aspirants preparing for competitive exams.
- Coaching centers running frequent mock tests for large cohorts.
- Schools and colleges conducting practice exams without exam infrastructure.
- Edtech platforms wanting a quick, embeddable exam-simulation tool.

### Measurable outcomes / KPIs to track
- Time‑to‑feedback (minutes): upload → scored result.
- Candidate accuracy improvement (pre/post): % increase over 4–6 weeks.
- Operational cost reduction: printing/marking/invigilation saved per test.
- Engagement metrics: average attempts per user, time spent per test.
- Conversion/monetization: % of users converting to paid plans (if applicable).

### How customers would use it 
1. Instructor or student uploads a past‑year question PDF.
2. Set exam length and number of questions, then launch the test.
3. Candidates answer using the on‑screen OMR; zoom and page navigation help readability.
4. At timeout, upload the answer‑key PDF or the instructor uploads it.
5. System extracts the key, scores answers, and delivers a downloadable scorecard + per-question analysis.
6. Coaches review analytics and assign targeted practice.

### Monetization & go‑to‑market ideas
- Freemium: basic mock tests free; premium features (detailed analytics, cohort reporting, white‑labeling) on subscription.
- Institutional licensing for coaching centers and schools.
- Transactional model: pay‑per‑mock or bulk test credits.
- Partnerships with content providers and exam prep marketplaces.

### Risks & mitigations 
- Risk: Answer extraction fails on scanned images. Mitigation: offer a conversion/OCR service or quick instructions for producing searchable PDFs.
- Risk: Customers need very accurate scoring for high‑stakes tests. Mitigation: add manual verification workflows and exportable reports for audits.
- Risk: UX acceptance among non‑technical users. Mitigation: keep onboarding simple, provide templates and sample answer-key PDFs.

### Next recommended commercial steps
- Pilot with one coaching center (50–200 users) to measure time‑to‑feedback and student improvement.
- Create a one‑page marketing site with demo and sample PDFs.
- Add a simple admin dashboard for batch uploads and cohort analytics.
- Package pricing and prepare sales materials targeting coaching chains and edtech platforms.

### One‑line call to action
Run a 30‑day pilot with ExamSim Pro to cut mock‑test overhead, speed up feedback, and improve candidate performance with real exam practice.


## Features
- Upload searchable (text-layer) PDF question papers and render pages with pdf.js
- Timed exam interface with OMR response panel and mark-for-review
- Zoom controls for the PDF canvas (50% — 300%)
- Lock test and prompt for answer-key upload when time runs out
- Answer-key extraction via regex (supports patterns like `1. A`, `2-A`, `3) B`, `4: D`, `5 C`)
- Results page with per-question analysis and simple scoring (+1 correct, -0.25 wrong)

## Quick start (Windows PowerShell)

From the project root:

```powershell
# install dependencies (only once)
npm install

# start dev server
npm run dev
```

Open the address printed by Vite (usually http://localhost:5173).

## Usage
1. Home → click **Get Started / Start Mock Test**.
2. Upload your question PDF (must be searchable text — scanned images won't extract text).
3. Set total questions and timer, then click **Launch Test Environment**.
4. During the exam use the OMR panel (right-side) to select answers. Use the zoom controls (top-right of PDF area) to increase/decrease rendered font size.
5. When the timer reaches 0 the app will lock the exam and show a prompt to upload the Answer Key PDF.
6. Upload an answer-key PDF with lines like `1. A`, `2-B`, or inline `Answer Key: 1-A, 2-B` and the app will extract keys and show results.

## Accepted answer-key formats
The extractor looks for number + letter (A–D) pairs using a flexible regex. Examples that work:

- `1. A` (one per line)
- `2-B` (dash separator)
- `3) C` (parenthesis)
- `4: D` (colon separator)
- `5 E` (space separator)
- Inline: `Answer Key: 1-A, 2-B, 3-C`

If your key uses numbers (1–4) instead of letters, convert them to A–D (1→A, 2→B, 3→C, 4→D) before creating a PDF, or ask me to extend the parser.

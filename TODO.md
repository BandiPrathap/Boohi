# UI/UX Improvements & Bug Fixes - Approved Plan

## Steps (Progress: 0/N)

### 1. **[CURRENT] Fix Critical Bugs First**
   - App.jsx: Pass `onBackToExam` prop to AnswerKeyPrompt; implement `resetExam()` function.
   - AnswerKeyPrompt.jsx: Enable back/process buttons.
   - Update PDF.js CDN to v4.x.
   - Input validation in ConfigView (min/max).

### 2. UI Polish: ExamView Enhancements
   - Add question navigation (prev/next).
   - OMR batching (25 Q/page).
   - Improve PDF controls (always visible on mobile).
   - Responsiveness: Stack PDF/OMR vertically on mobile.

### 3. Global Improvements
   - Create Toast.jsx for notifications.
   - Accessibility: ARIA labels, keyboard nav.
   - ResultView: Functional print/export.

### 4. Advanced
   - Improve key extraction regex + manual fallback.
   - Pause/resume timer.
   - Dark mode toggle.

### 5. Testing & Cleanup
   - `npm run dev`: Test full workflows (PDF/OMR/timer).
   - `npm run lint && npm run build`.
   - Update README.md.
   - `attempt_completion`.

**Next Action**: Enhance ExamView.jsx ✓

**Progress: 1/5**


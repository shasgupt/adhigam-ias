# ADHIGAM IAS — Comprehensive Operations & User Guide

This guide contains end-to-end instructions for **Developers**, **Administrators/Faculty**, and **Aspirants**.

---

## 👨‍💻 Part 1: Developer Guide

### 1. Technology Stack
- **Frontend**: React 19, Vite 6, TypeScript, Tailwind CSS v4, Lucide React icons.
- **Backend / API**: Node.js 22, Express.js (mounted via `vite.middlewares` in dev and Express static in prod).
- **Database**: Bluehost-ready persistent file database (`data/adhigam_db.json`) with in-memory caching and safe atomic writes.
- **AI Integration**: Google GenAI SDK for AI-assisted evaluations and Mains analysis.
- **Automated Testing**: Node.js test runner (`node:test`, `node:assert`, `tsx --test`).

### 2. Local Setup & Running
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Port 3000)
npm run dev

# 3. Run all automated tests
npm test

# 4. Typecheck and lint
npm run lint

# 5. Production build
npm run build

# 6. Start full-stack production server
npm start
```

### 3. Packaging for Hosting (Bluehost / cPanel / Cloud Run)
```bash
# Generate versioned release package (zip file + deploy-ready dist and server)
npm run package:release

# Generate debug package with source maps
npm run package:debug
```

### 4. Database Schema & Architecture
The database is located at `data/adhigam_db.json`. It automatically initializes on first run with complete seed data:
- `users`: Administrator and faculty accounts.
- `aspirants`: Registered student profiles and study target years.
- `courses`: Foundation and optional courses.
- `testSeries`: RISE 2.0 (49 tests) with full schedule.
- `writingAttempts`: Student answer submissions, scores, and faculty evaluation remarks.
- `enquiries`: Admissions leads and query desk tickets.
- `articles`: Daily GS and Sociology editorial articles.
- `quizzes`: UPSC Prelims practice questions.
- `prompts`: UPSC Mains daily practice questions.
- `announcements`: Top announcement banner alerts.

---

## 🛡️ Part 2: Administrator & Faculty Guide

### 1. How to Access the Admin Portal
- **Direct URL**: Navigate to `/admin` on your browser.
- **Top Header**: Click the **"Admin Portal"** button in the top navy navigation bar.
- **Mobile Menu**: Open the hamburger menu and tap **"Admin Portal"**.
- **Footer**: Click **"Faculty & Admin CMS Portal"** or **"Staff Portal"** at the bottom of any page.

### 2. Logging In
- **Default System Admin**:
  - **Email**: `admin@adhigam.com` *(or `admin@adhigamias.com`)*
  - **Password**: `admin123`
  - *(Tip: You can also click the quick "System Admin" button on the login screen for 1-click access).*

### 3. Key Administrator Features & Workflows

#### A. Answer Evaluation Workbench
1. Go to the **"Evaluations"** tab in the CMS dashboard.
2. View pending student submissions for RISE 2.0 or daily answer writing.
3. Click **"Evaluate Submission"** to review the student's scanned PDF.
4. Enter marks (out of 50 for RISE 2.0 tests or 250 for full mocks).
5. Add line-by-line feedback notes, strengths, and areas for improvement.
6. Click **"Save Evaluation"** — the score and remarks instantly become visible in the student's workbench.

#### B. Student Enquiries CRM
1. Go to the **"Enquiries"** tab.
2. View prospective student enquiries with unique Reference IDs (`ADHIGAM-Q-XXXX`).
3. Update enquiry statuses (`New`, `In Progress`, `Enrolled`, `Closed`).
4. Add internal counselor follow-up notes.

#### C. Test Series & RISE 2.0 CMS
1. Go to the **"Test Series"** tab.
2. Update dates, topics, or question coverage for any of the 49 RISE 2.0 tests.
3. Upload/link question papers (PDF) and model answers on test days.
4. Adjust standard fees or early bird promotional pricing.

#### D. Knowledge Hub CMS (Articles, Quizzes & Prompts)
1. **Articles**: Publish daily current affairs and sociology thinker breakdowns.
2. **Prelims Quizzes**: Create 5-question daily MCQs with answer keys and explanations.
3. **Mains Prompts**: Add daily answer writing prompts with syllabus mapping.

#### E. Announcements & Alerts
1. Go to the **"Announcements"** tab.
2. Post urgent notices (e.g., batch start dates, admissions deadlines) that display on the top announcement banner across the site.

#### F. Database Backup & Restore
1. Go to the **"Settings"** tab.
2. Click **"Download Database Snapshot (JSON)"** to take an instant backup.
3. Upload any previous JSON backup file to restore data at any time.

---

## 🎓 Part 3: Aspirant Guide

### 1. Accessing the Aspirant Portal
- Click **"Aspirant Portal"** in the top navigation bar or navigate to `/me` or `/login`.

### 2. Registration & Sign In
- **New Aspirant**: Enter your Name, Email, WhatsApp Phone number, and UPSC CSE Target Year (e.g., *UPSC CSE 2026 / 2027*).
- **Existing Aspirant**: Sign in with your registered email (e.g., `aspirant@adhigam.com`).

### 3. Enrolled Student Workbench Features

#### A. RISE 2.0 Test Series Dashboard
- View all 49 test dates, syllabus breakdowns, and paper coverage (Paper I, Paper II, Comprehensives).
- Download question papers released at 6:00 PM on test days (Mondays, Wednesdays, Fridays).
- Download model answers released at 9:00 PM.

#### B. Submitting Answer Copies
1. Write your answers on standard UPSC Mains answer sheets.
2. Scan and combine your pages into a single PDF.
3. Go to **"Answer Writing Lab"** in your workbench.
4. Select the test number or prompt, paste your PDF link or file, and click **"Submit for Faculty Review"**.
5. Track your evaluation status — evaluated copies with detailed faculty feedback are returned within 3 days.

#### C. Daily Prelims Practice Lab
1. Go to **"Daily Practice"** in your workbench or visit `/free`.
2. Solve 5 daily high-yield UPSC MCQs.
3. Submit your answers to receive an instant score with official UPSC negative marking penalty (-0.66 per incorrect answer).
4. Review detailed explanations for every question.

#### D. Tracking Queries & Admission Status
1. If you submitted an enquiry or admission form, keep your **Reference ID** (e.g., `ADHIGAM-Q-1001`).
2. Visit `/contact` and enter your Reference ID, Email, or Phone to view real-time enquiry status and counselor notes.

---

## 📞 Support & Contacts

- **Official Email**: `adhigamias@gmail.com`
- **Official Telegram Channel**: `@adhigamias1` ([https://t.me/adhigamias1](https://t.me/adhigamias1))
- **Official Website**: [https://adhigamiasacademy.com/](https://adhigamiasacademy.com/)

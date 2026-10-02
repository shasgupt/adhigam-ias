# Adhigam IAS — Official Web Portal & Learning Management System

> **Premier Civil Services Examination Academy**  
> *"Driven by Discipline, Fueled by Knowledge"* • *Version v2.4.0*

Welcome to the **ADHIGAM IAS** official web application and administration portal. This platform is custom-engineered for UPSC Civil Services Examination (CSE) aspirants, featuring a high-performance web portal, student self-service workbench, test series browser, and an intuitive no-code Faculty CMS dashboard.

---

## 🏛️ Executive Summary

**ADHIGAM IAS** is built with a **Modern Executive Officer** design language, combining authoritative deep navy (`#0F2C59`), warm gold/amber (`#D97706`), and soft parchment (`#FDFBF7`) visual tokens.

The application serves three primary user personas:
1. **Public Aspirants / Visitors**: Explore the academy's test series catalog (**RISE 2.0 – 49 Tests** and **Advanced FLT Series – 12 Tests**), browse detailed syllabus schedules, submit questions to the Student Query Desk, and track their admission/mentorship queries in real time.
2. **Enrolled Students (Aspirant LMS Workbench)**: Access test schedules, download question papers, upload answer PDFs for line-by-line faculty evaluation, and review evaluated copies with feedback scores.
3. **Faculty & Directorate Management (Admin CMS)**: Manage course offerings, customize test series schedules, evaluate submitted answer copies within the 3-day turnaround SLA, manage student inquiries, and publish official academic updates.

---

## 🎯 Key Portal Modules & Capabilities

### 1. Public Portal
- **Home View (`/src/pages/public/HomeView.tsx`)**:
  - Official Adhigam IAS Emblem & Seal typography.
  - **Flagship Spotlight**: RISE 2.0 Sociology Optional Test Series (49 Tests, Mon/Wed/Fri discipline, 50 Marks per session, 3-day evaluation SLA).
  - **Test Series Catalog**: Side-by-side comparison of **RISE 2.0 (49 Tests)** and **Advanced FLT Series (12 Full-Length 250-Mark Mock Exams)**.
  - **Programme Snapshot & Routine**: Test-day schedule (8:00 AM question release, 9:00 PM submission deadline, model answers).
  - **Transparent Fee Structure**: Standard Launch Fee, Early Bird Discount tiers, and Existing Student concessions.
  - **Interactive 49-Test Schedule Browser**: Filter by Paper I, Paper II, and Final Comprehensives with live keyword search.
  - **Real-Time Student Query Desk**: Instant query reference generation (`ADHIGAM-Q-XXXX`) and status tracking.

- **Test Series Explorer (`/src/pages/public/TestSeriesView.tsx`)**:
  - Interactive multi-series toggle (**RISE 2.0** vs **Sociology Optional Advanced FLT Series**).
  - Complete syllabus coverage breakdowns, test dates, and paper distribution.
  - One-click print schedule utility and direct enrolment booking.

- **Academic Umbrella Courses (`/src/pages/public/CoursesView.tsx`)**:
  - Live institute courses managed by faculty with zero dummy data.
  - Categories: Optional, GS Foundation, Mains Special, Prelims Booster.

- **Student Query Desk & Contact (`/src/pages/public/JoinContactView.tsx`)**:
  - Direct inquiry form, official telegram channel (`@adhigamias_official`), and official email (`adhigamias@gmail.com`).

### 2. Aspirant Self-Service Workbench (`/src/pages/aspirant/`)
- Student authentication context (`AspirantAuthContext`).
- Answer submission workflow (PDF upload / link).
- Real-time evaluation tracker with faculty feedback and marked score sheets.

### 3. Faculty CMS & Admin Directorate (`/src/pages/admin/FacultyCMSDashboard.tsx`)
- Secure faculty credentials authentication (`AuthContext`).
- **Test Series & Schedule Manager**: Update test dates, syllabus topics, and model answer releases.
- **Enquiries CRM**: Review, respond, and log internal counseling notes for all prospective student queries.
- **Evaluation Desk**: Grade answer submissions, write line-by-line feedback, and return marked copies.

---

## 📌 Single Source of Truth (SSOT)

All institutional contact details, fee structures, schedules, and branding parameters are strictly centralized in:

📂 `src/data/instituteConfig.ts`

- **Academy Name**: ADHIGAM IAS
- **Official Email**: `adhigamias@gmail.com`
- **Official Telegram**: `@adhigamias_official` ([https://t.me/adhigamias_official](https://t.me/adhigamias_official))
- **Official Website**: `https://adhigamiasacademy.com`
- **Flagship Programme**: RISE 2.0 (49 Tests | 12 Oct 2026 – 31 Jan 2027)
- **Secondary Series**: Sociology Optional Advanced FLT Series (12 Full-Length Mock Exams)
- **Schedule**: Complete 49-test calendar (`RISE_49_TEST_SCHEDULE`)

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, Vite 8, TypeScript, Tailwind CSS v4
- **Icons & Animations**: `lucide-react`, `motion`
- **Backend / API**: Express 4 full-stack server mounted via Vite dev middleware and standalone production entry (`server.ts`)
- **Persistence**: JSON-backed local storage engine (`data/adhigam_db.json`) & LocalStorage fallback
- **Packaging Utility**: Node.js ESM script (`scripts/package-versioned.mjs`) with `jszip`

```
adhigam-ias/
├── README.md                           # Main repository guide (this file)
├── BLUEHOST_DEPLOYMENT_STEPS.md        # Comprehensive Bluehost cPanel & Apache guide
├── metadata.json                       # AI Studio Applet configuration
├── package.json                        # Node.js dependencies & versioned build scripts
├── server.ts                           # Full-stack Express backend & API endpoints
├── scripts/
│   ├── package-versioned.mjs           # Automated cross-platform ZIP packaging script
│   ├── set-build-type.mjs              # Build marker utility (release vs debug)
│   └── package-dist.ps1                # PowerShell packaging utility
├── doc/
│   ├── architecture.md                 # Technical architecture and domain models
│   ├── ADMIN_MANUAL_COURSES_AND_TEST_SERIES.md # Admin & faculty operations manual
│   └── bluehost_branch_workflow.md     # Branch CI/CD deployment guide
├── public/
│   └── .htaccess                       # Apache SPA rewrite rules & security headers
├── data/
│   └── adhigam_db.json                 # Persistent database state (courses, tests, enquiries)
└── src/
    ├── App.tsx                         # Master routing and layout switcher
    ├── types.ts                        # Master TypeScript type definitions
    ├── components/                     # Reusable UI components (SiteHeader, SiteFooter, etc.)
    ├── context/                        # Authentication & state providers
    ├── data/
    │   ├── instituteConfig.ts          # Central Single Source of Truth (SSOT)
    │   └── fallbackData.ts             # Default test series & fallback data
    ├── lib/
    │   └── api.ts                      # Universal API client
    └── pages/
        ├── admin/                      # Faculty CMS & Evaluation Dashboard
        ├── aspirant/                   # Student LMS Workbench
        └── public/                     # Public views (Home, TestSeries, Courses, Contact)
```

---

## 🚀 Build, Package & Deployment Commands

### 1. Local Development
```bash
npm install
npm run dev
# Starts dev server on http://localhost:3000
```

### 2. Build Commands
```bash
# Standard Production Build (Minified & Optimized)
npm run build

# Debug Build (With source maps and unminified assets)
npm run build:debug
```

### 3. Automated ZIP Packaging
```bash
# Build & Package for Release:
npm run package:release
# Output: adhigam-ias-v0.3.0-release.zip

# Build & Package for Debug:
npm run package:debug
# Output: adhigam-ias-v0.3.0-debug.zip

# Package complete Source Code + Assets:
npm run package:source
# Output: adhigam-ias-source-v0.3.0-release.zip
```

---

## 🌐 Deploying to Bluehost
For full deployment instructions, see [BLUEHOST_DEPLOYMENT_STEPS.md](./BLUEHOST_DEPLOYMENT_STEPS.md).
1. Run `npm run package:release` to generate the release ZIP archive.
2. Upload the ZIP to Bluehost cPanel File Manager under `/public_html`.
3. Extract files into `/public_html` (including `index.html`, `assets/`, and `.htaccess`).

---

## 🤖 Directives for Future AI Agents & Developers

1. **Strict SSOT Adherence**: Always import and reference `INSTITUTE_CONFIG` from `src/data/instituteConfig.ts`. Never hardcode emails, telegram links, or phone numbers in components.
2. **Design Tokens**: Maintain authoritative Executive Navy (`#0F2C59`), Amber/Gold (`#D97706`), and Parchment (`#FDFBF7`) styling.
3. **Data Integrity**: CRUD operations on test series, courses, and inquiries must use `src/lib/api.ts` to keep the database synced.

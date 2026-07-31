# Adhigam IAS — Official Web Portal & Learning Management System

> **Premier Civil Services Examination Academy**  
> *"Driven by Discipline, Fueled by Knowledge"*

Welcome to the **Adhigam IAS** official web application and administration portal codebase. This platform is custom-built for UPSC Civil Services Examination (CSE) aspirants, offering a unified, high-performance web portal, student self-service LMS, and an intuitive no-code Faculty CMS dashboard.

---

## 🏛️ Executive Summary

**Adhigam IAS** is designed with a **Modern Executive Officer** aesthetic, combining authoritative deep navy (`#0F2C59`), warm gold/amber (`#D97706`), and soft parchment (`#FDFBF7`) color palettes. The web application serves three primary user personas:

1. **Public Aspirants / Visitors**: Browse courses, test series, syllabus outlines, daily current affairs, prelims quizzes, daily Mains answer writing prompts, and campus details.
2. **Enrolled Students (Aspirant LMS)**: Access enrolled courses, submit daily Mains answers for faculty evaluation, review feedback, and attempt mock test series.
3. **Faculty & Institute Management (Admin CMS)**: Manage content, publish daily current affairs, create and edit courses/test series, review student answer submissions, edit site announcements, and track student registration leads without requiring technical code knowledge.

---

## 🎯 Key Portal Features

### 1. Public Portal
- **Home View (`/src/pages/public/HomeView.tsx`)**:
  - Official Adhigam IAS SVG Seal Badge & Brand Identity.
  - UPSC Civil Services Examination Syllabus breakdown (Prelims GS & CSAT, Mains GS 1-4 & Optional, Personality Test / Interview).
  - Important Announcements ticker & modal drawer.
  - Spotlight on today's Mains Answer Writing prompt and featured courses.
  - Verified selection metrics and institutional offerings.
- **Paid Courses (`/src/pages/public/CoursesView.tsx`)**:
  - Categorized under **Prelims**, **Mains**, and **Optional Subjects**.
  - Detailed modal drawer for every course (curriculum, fee, duration, batch timings, batch mode: Offline/Online/Hybrid).
  - Direct enrollment & callback inquiry modal.
- **Free Initiatives (`/src/pages/public/FreeResourcesView.tsx`)**:
  - **Daily Current Affairs & Editorials**: Filterable by GS Paper (GS-1, GS-2, GS-3, GS-4) with download options.
  - **Prelims Daily Quizzes**: Interactive quiz interface with timer, immediate score evaluation, and detailed explanations.
  - **Mains Answer Writing**: Daily UPSC Mains question prompts with structured model answers, key approach points, and direct submission triggers.
- **Test Series (`/src/pages/public/TestSeriesView.tsx`)**:
  - Prelims Full Length & Sectional Tests, Mains Evaluation Series, and Optional Test Series.
  - Test schedule timelines, question paper links, and model answer keys.
- **Admissions & Campus Contact (`/src/pages/public/JoinContactView.tsx`)**:
  - Admissions registration form capturing Name, Phone, Email, City, Course Interested In, and Message.
  - Campus addresses for **Old Rajinder Nagar Central Campus** and **Mukherjee Nagar North Campus**.
  - Direct helpline contacts and operating hours.

### 2. Aspirant Self-Service LMS (`/src/pages/aspirant/`)
- Personalized student portal with authentication context.
- Daily Mains answer upload interface (text or image/PDF attachment submission).
- Faculty evaluation tracking (score out of 25, feedback comments, evaluated copy download).
- Enrolled courses and test series schedule viewer.

### 3. Faculty CMS & Admin Dashboard (`/src/pages/admin/FacultyCMSDashboard.tsx`)
- **Dashboard Overview**: Summary metrics of total active leads, pending answer reviews, published articles, and active courses.
- **Content Management**:
  - Publish Daily Current Affairs articles & GS editorials.
  - Create, update, or archive Paid Courses and Test Series.
  - Post and broadcast Important Announcements on the site header ticker.
- **Lead & Enquiry Management**:
  - Filter and export student registration enquiries by course interest, city, or date.
- **Mains Answer Evaluation Workspace**:
  - Review student answer submissions, assign marks, type structured feedback, and upload marked PDF copies.

---

## 📌 Single Source of Truth (SSOT)

To prevent fragmented data and inconsistent contact information across header, footer, modals, and contact pages, all institute metadata is strictly centralized in:

📂 `src/data/instituteConfig.ts`

This configuration defines:
- **Institute Metadata**: Name, Tagline, Subtitle, Motto, Founded Year, Accreditation.
- **Helplines & Support**: Primary helpline (`+91 11 4500 8899`), alternate number, admissions email, support email, director grievance email.
- **Campuses**:
  - **Old Rajinder Nagar**: 22-B, Pusa Road, Near Karol Bagh Metro Gate 2, New Delhi - 110005.
  - **Mukherjee Nagar**: 104, Kingsway Camp, Near GTB Nagar Metro Gate 3, Delhi - 110009.
- **Verified Statistics**: Top selections count (`100+`), active aspirants (`5,000+`), review SLA (`24 Hours`), total evaluations (`25,000+`).
- **Leadership & Senior Faculty**: Profiles for Dr. Vikramaditya Sharma, Prof. Ananya Roy, Dr. Rajeshwar Prasad.

---

## 🛠️ Tech Stack & Directory Overview

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS (`@import "tailwindcss";` in `src/index.css`)
- **Icons**: `lucide-react`
- **Animations**: `motion` (`motion/react`)
- **Persistence Engine**: `src/lib/api.ts` (LocalStorage persistent state engine with pre-seeded mock data)

```
adhigam-ias/
├── README.md                   # Main repository guide and overview (this file)
├── doc/
│   └── architecture.md         # Full technical architecture & AI Agent directives
├── src/
│   ├── components/
│   │   ├── AdhigamLogo.tsx     # Vector SVG Seal Emblem & Brand Typo
│   │   ├── AnnouncementBanner.tsx
│   │   ├── QuickEnquireModal.tsx
│   │   ├── SiteFooter.tsx
│   │   └── SiteHeader.tsx
│   ├── context/
│   │   ├── AspirantAuthContext.tsx
│   │   └── AuthContext.tsx
│   ├── data/
│   │   └── instituteConfig.ts  # CENTRAL SINGLE SOURCE OF TRUTH (SSOT)
│   ├── lib/
│   │   └── api.ts              # Data access & LocalStorage mock API client
│   ├── pages/
│   │   ├── admin/
│   │   │   └── FacultyCMSDashboard.tsx
│   │   ├── aspirant/
│   │   │   └── AspirantPortalView.tsx
│   │   └── public/
│   │       ├── CoursesView.tsx
│   │       ├── FreeResourcesView.tsx
│   │       ├── HomeView.tsx
│   │       ├── JoinContactView.tsx
│   │       └── TestSeriesView.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts                # Master TypeScript Interfaces & Types
├── metadata.json
├── package.json
├── server.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Local Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   *The application will boot on `http://localhost:3000`.*

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🤖 Directives for Future AI Agents

When working on or extending this repository, AI agents must strictly observe the following rules:

1. **Maintain Single Source of Truth**: Never hardcode phone numbers, campus addresses, emails, or faculty names inside components or views. Always import and reference `INSTITUTE_CONFIG` from `src/data/instituteConfig.ts`.
2. **Brand Visual Identity**: Use the official Executive Navy (`#0F2C59`), Gold/Amber (`#D97706`), and Warm Parchment (`#FDFBF7`) visual tokens. Do not introduce generic neon, purple-blue SaaS gradients, or unstyled cards.
3. **Typography**: Headings use `font-sans-ui` / `font-serif-heading` with clean tracking and contrast.
4. **Icons**: Exclusively import icons from `lucide-react`. Never generate inline non-standard SVGs unless constructing custom brand logos like `AdhigamLogo.tsx`.
5. **Data Layer**: All CRUD operations must go through `src/lib/api.ts` to ensure LocalStorage state remains synced across Public views, Aspirant Portal, and the Faculty CMS.

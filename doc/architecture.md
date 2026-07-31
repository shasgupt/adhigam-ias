# Adhigam IAS — Technical Architecture & AI Developer Guide

This document provides a comprehensive technical breakdown of the **Adhigam IAS** codebase architecture, data flows, state management paradigms, schema definitions, and design conventions. It serves as the primary technical specification for engineers and AI Coding Agents maintaining or extending this platform.

---

## 1. System Architecture Overview

The application is structured as a single-page full-stack application utilizing React 18, Vite, TypeScript, and Express. The architecture is decoupled into three primary layers:

```
+-------------------------------------------------------------------------------+
|                                CLIENT LAYER                                   |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |                       SiteHeader / SiteFooter                         |   |
|   |            (Portal Switcher: Public | Aspirant | Faculty CMS)          |   |
|   +-----------------------------------------------------------------------+   |
|                                       |                                       |
|    +-------------------+    +-------------------+    +--------------------+   |
|    |   Public Views    |    |   Aspirant LMS    |    |  Faculty Admin CMS |   |
|    | - Home            |    | - Answer Submit   |    | - Content Editor   |   |
|    | - Courses         |    | - Enrolled Batches|    | - Course CRUD      |   |
|    | - Free Initiatives|    | - Evaluation Copy |    | - Review Workspace |   |
|    | - Test Series     |    | - Score History   |    | - Lead Exporter    |   |
|    | - Join / Contact  |    +-------------------+    +--------------------+   |
|    +-------------------+              |                         |             |
+---------------------------------------|-------------------------|-------------+
                                        v                         v
+-------------------------------------------------------------------------------+
|                           STATE & SERVICE LAYER                               |
|                                                                               |
|   +---------------------------------+   +---------------------------------+   |
|   |          AuthContext            |   |       AspirantAuthContext       |   |
|   | (Faculty Admin Credentials)     |   | (Student Login & Session State) |   |
|   +---------------------------------+   +---------------------------------+   |
|                                       |                                       |
|   +-----------------------------------------------------------------------+   |
|   |                        INSTITUTE CONFIG (SSOT)                        |   |
|   |        (src/data/instituteConfig.ts - Addresses, Helplines, Motto)    |   |
|   +-----------------------------------------------------------------------+   |
|                                       |                                       |
|   +-----------------------------------------------------------------------+   |
|   |                            API Client Layer                           |   |
|   |            (src/lib/api.ts - LocalStorage Persistent Store)            |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
```

---

## 2. Core Modules & Data Models

### 2.1 Single Source of Truth (`src/data/instituteConfig.ts`)
The `INSTITUTE_CONFIG` object serves as the single immutable baseline configuration for institutional identity across the entire codebase.

- **`InstituteConfig` Interface**:
  - `name`: "ADHIGAM IAS"
  - `tagline`: "Premier Civil Services Academy"
  - `subtitle`: "Precision coaching for UPSC CSE Prelims, Mains, Optional & Interview Guidance"
  - `contact`: Primary helpline, alternate helpline, admissions email, support email, director grievance email, WhatsApp number.
  - `campuses`: Array of `CampusInfo` objects (Old Rajinder Nagar Central Campus & Mukherjee Nagar North Campus) with full address, landmarks, phone, and operating hours.
  - `stats`: Top selections count (`100+`), active aspirants count (`5,000+`), answer review SLA (`24 Hours`), total mock tests evaluated (`25,000+`).
  - `leadershipAndFaculty`: Array of `FacultyMember` objects containing name, role, subject specialty, experience, and bio.

### 2.2 Domain Entities (`src/types.ts`)
The application defines strongly typed interfaces for all domain objects:

1. **`Course`**:
   - `id`: string
   - `title`: string
   - `category`: `'Prelims' | 'Mains' | 'Optional'`
   - `description`: string
   - `features`: string[]
   - `duration`: string
   - `fee`: number
   - `startDate`: string
   - `mode`: `'Offline' | 'Online' | 'Hybrid'`
   - `faculty`: string
   - `image`: string
   - `syllabusHighlights`: string[]

2. **`TestSeries`**:
   - `id`: string
   - `title`: string
   - `category`: `'Prelims' | 'Mains' | 'Optional'`
   - `totalTests`: number
   - `description`: string
   - `fee`: number
   - `schedulePdfUrl`: string
   - `features`: string[]
   - `startDate`: string

3. **`Article` (Current Affairs / Editorial)**:
   - `id`: string
   - `title`: string
   - `category`: `'Current Affairs' | 'Editorial' | 'Strategy'`
   - `gsPaper`: `'GS-1' | 'GS-2' | 'GS-3' | 'GS-4' | 'General'`
   - `content`: string
   - `pdfUrl`?: string
   - `date`: string
   - `author`: string
   - `tags`: string[]

4. **`Quiz` (Prelims Daily Practice)**:
   - `id`: string
   - `title`: string
   - `date`: string
   - `questions`: Array of `{ id, question, options: string[], correctAnswer: number, explanation: string, gsSubject: string }`

5. **`Prompt` (Mains Answer Writing Daily Prompt)**:
   - `id`: string
   - `question`: string
   - `gsPaper`: `'GS-1' | 'GS-2' | 'GS-3' | 'GS-4'`
   - `wordLimit`: number
   - `marks`: number
   - `date`: string
   - `modelAnswer`?: string
   - `keyApproach`?: string[]

6. **`AnswerSubmission`**:
   - `id`: string
   - `promptId`: string
   - `studentName`: string
   - `studentEmail`: string
   - `answerText`: string
   - `pdfAttachmentUrl`?: string
   - `submittedAt`: string
   - `status`: `'Pending' | 'Evaluated'`
   - `marksObtained`?: number
   - `facultyFeedback`?: string
   - `evaluatedCopyUrl`?: string

7. **`Enquiry` (Lead Capture)**:
   - `id`: string
   - `name`: string
   - `phone`: string
   - `email`: string
   - `city`: string
   - `courseInterested`: string
   - `message`?: string
   - `submittedAt`: string
   - `status`: `'New' | 'Contacted' | 'Enrolled'`

---

## 3. Storage & State Persistence (`src/lib/api.ts`)

The API layer is encapsulated inside `src/lib/api.ts`. It leverages an in-memory & `localStorage` synchronized store (`adhigam_db_v2`).

### Seed Data Initialization
On initial boot, if `localStorage` does not contain the key `adhigam_db_v2`, `api.ts` automatically initializes default realistic UPSC CSE content including:
- Integrated Foundation Course 2026/27, Prelims GS & CSAT Booster, Ethics & Essay Mastery, Public Administration Optional.
- Prelims All-India Mock Test Series & Mains Quality Enrichment Program (QEP).
- Daily Current Affairs articles categorized by GS paper.
- Prelims quizzes with answer explanations.
- Daily Mains answer writing prompts.
- Announcements ticker notifications.

### API Methods Exposed:
- **`api.getCourses()` / `api.saveCourse(course)` / `api.deleteCourse(id)`**
- **`api.getTestSeries()` / `api.saveTestSeries(series)` / `api.deleteTestSeries(id)`**
- **`api.getArticles()` / `api.saveArticle(article)` / `api.deleteArticle(id)`**
- **`api.getQuizzes()` / `api.saveQuiz(quiz)`**
- **`api.getPrompts()` / `api.getTodaysPrompt()` / `api.savePrompt(prompt)`**
- **`api.getSubmissions()` / `api.submitAnswer(submission)` / `api.evaluateSubmission(id, marks, feedback, pdfUrl)`**
- **`api.getEnquiries()` / `api.submitEnquiry(enquiry)` / `api.updateEnquiryStatus(id, status)`**
- **`api.getAnnouncements()` / `api.saveAnnouncement(announcement)`**

---

## 4. Branding & Visual Design Standards

The application strictly adheres to the **Modern Executive Officer** design system:

| Element | Color Code / Specification | Description |
| :--- | :--- | :--- |
| **Primary Executive Blue** | `#0F2C59` | Dominant brand color for headers, badges, seals, primary buttons, and hero highlights. |
| **Warm Gold / Amber** | `#D97706` / `#F59E0B` | Secondary accent used for badges, laurels, highlights, and call-to-action borders. |
| **Parchment Background** | `#FDFBF7` | Light, eye-safe canvas background representing classical academic paper. |
| **Typography** | `font-sans-ui` / `font-serif-heading` | High-legibility sans-serif for UI density paired with authoritative serif headings. |
| **Official Seal Logo** | `<AdhigamLogo />` (`/src/components/AdhigamLogo.tsx`) | Custom SVG rendering the official circular emblem with book, diya lamp, quill, and motto. |

---

## 5. Security & Portal Access Control

The app isolates roles using React Context:

1. **Public Persona**: No login required. Can view all courses, test series, syllabus, articles, attempt quizzes, and submit enquiries.
2. **Aspirant Persona**: Logged in via `AspirantAuthContext`. Can submit Mains answers and track personal evaluations.
3. **Faculty CMS / Admin Persona**: Protected via `AuthContext`.
   - Access key: Faculty credentials allow full access to edit courses, articles, announcements, evaluate submissions, and export lead enquiries.

---

## 6. Guidelines for AI Agents Extending the Codebase

1. **Data Centralization**: Never duplicate campus addresses, phone numbers, or emails inside new components. Always read from `INSTITUTE_CONFIG` in `src/data/instituteConfig.ts`.
2. **Component Granularity**: Keep components clean and modular. Place new reusable UI components inside `src/components/` and new full-screen views inside `src/pages/`.
3. **Responsive Spacing**: Ensure all padding and margins follow Tailwind rhythm (`p-4 sm:p-6 lg:p-8`). Touch targets on mobile controls must be at least 44px.
4. **Error Handling & State**: Wrap API calls in proper loading states (`submitting`, `loading`) and show accessible feedback badges (`CheckCircle2`, alerts).
5. **Icon Usage**: Only import icons from `lucide-react`. Do not create arbitrary SVG icons directly in JSX unless building custom logo seals.

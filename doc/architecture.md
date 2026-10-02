# Adhigam IAS — Technical Architecture & Developer Guide

This document provides a technical specification of the **Adhigam IAS** codebase architecture, data flows, state management, API routes, database schemas, and design conventions.

---

## 1. System Architecture Overview

The platform is designed as a modular full-stack application utilizing React 19, Vite 8, TypeScript, Express 4, and Tailwind CSS v4.

```
+-------------------------------------------------------------------------------+
|                                CLIENT LAYER                                   |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |                       SiteHeader / SiteFooter                         |   |
|   |            (Navigation: Home | Test Series | Courses | Contact)        |   |
|   +-----------------------------------------------------------------------+   |
|                                       |                                       |
|    +-------------------+    +-------------------+    +--------------------+   |
|    |   Public Portal   |    |   Aspirant LMS    |    |  Faculty Admin CMS |   |
|    | - Flagship RISE 2.0|   | - Student Login   |    | - Test Series CMS  |   |
|    | - Advanced FLT 12 |    | - Answer Upload   |    | - Course Manager   |   |
|    | - Schedule Browser|    | - Evaluation Copy |    | - Enquiries CRM    |   |
|    | - Query Desk Track|    | - Score Tracker   |    | - Evaluation Desk  |   |
|    +-------------------+    +-------------------+    +--------------------+   |
|                                       |                         |             |
+---------------------------------------|-------------------------|-------------+
                                        v                         v
+-------------------------------------------------------------------------------+
|                           STATE & SERVICE LAYER                               |
|                                                                               |
|   +---------------------------------+   +---------------------------------+   |
|   |          AuthContext            |   |       AspirantAuthContext       |   |
|   | (Faculty Admin Session)         |   | (Student Session & Auth State)  |   |
|   +---------------------------------+   +---------------------------------+   |
|                                       |                                       |
|   +-----------------------------------------------------------------------+   |
|   |                        INSTITUTE CONFIG (SSOT)                        |   |
|   |     (src/data/instituteConfig.ts - Single Source of Truth Metadata)   |   |
|   +-----------------------------------------------------------------------+   |
|                                       |                                       |
|   +-----------------------------------------------------------------------+   |
|   |                            API Client Layer                           |   |
|   |          (src/lib/api.ts -> Express REST API / LocalStorage Fallback) |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                           SERVER & PERSISTENCE                                |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |               Express Server (server.ts / REST Endpoints)             |   |
|   |     /api/test-series | /api/courses | /api/enquiries | /api/articles  |   |
|   +-----------------------------------------------------------------------+   |
|                                       |                                       |
|   +-----------------------------------------------------------------------+   |
|   |                Persistent Storage (data/adhigam_db.json)              |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
```

---

## 2. Core Modules & Data Models

### 2.1 Single Source of Truth (`src/data/instituteConfig.ts`)
The `INSTITUTE_CONFIG` object serves as the single immutable baseline configuration for institutional identity across the entire codebase.

- **`InstituteConfig` Interface**:
  - `name`: "ADHIGAM IAS"
  - `tagline`: "Driven by Discipline, Fueled by Knowledge"
  - `motto`: "Learn • Practice • Improve • Serve"
  - `subtitle`: "REGULAR IMPROVEMENT IN SOCIOLOGY EXPRESSION"
  - `secondaryTagline`: "PRACTISE WITH PURPOSE • ANALYSE WITH CLARITY • IMPROVE WITH EVERY TEST"
  - `programmeName`: "RISE 2.0 - SOCIOLOGY OPTIONAL TEST SERIES"
  - `examTarget`: "A structured answer-writing programme for UPSC Civil Services Mains 2027"
  - `duration`: "12 October 2026 – 31 January 2027"
  - `version`: "v2.4.0"
  - `totalTests`: 49
  - `contact`:
    - `email`: "adhigamias@gmail.com"
    - `telegram`: "@adhigamias_official"
    - `telegramLink`: "https://t.me/adhigamias_official"
    - `website`: "https://adhigamiasacademy.com"
  - `pricingTiers`: Array of standard, early bird, and existing student tiers.
  - `testDayRoutine`: Step-by-step examination day timeline.

### 2.2 Domain Entities (`src/types.ts`)

1. **`TestSeries`**:
   - `id`: string (e.g., `'ts_rise_2'`, `'ts_soc_flt_12'`)
   - `key`: string
   - `title`: string
   - `subtitle`: string
   - `type`: `'prelims' | 'mains' | 'optional' | 'integrated'`
   - `totalTests`: number (e.g. `49`, `12`)
   - `fee`: string
   - `earlyBirdFee`?: string
   - `existingStudentFee`?: string
   - `startDate`: string
   - `endDate`: string
   - `mode`: `'online' | 'offline' | 'hybrid'`
   - `schedule`: Array of `ScheduleItem` ({ testNumber, title, date, day, paper, subjectTag, syllabus })
   - `description`: string

2. **`Course`**:
   - `id`: string
   - `slug`: string
   - `title`: string
   - `subtitle`: string
   - `category`: `'gs_foundation' | 'mains_special' | 'optional' | 'prelims_booster' | 'interview'`
   - `mode`: `'offline' | 'online' | 'hybrid'`
   - `duration`: string
   - `fee`: string
   - `features`: string[]
   - `published`: boolean

3. **`Enquiry` (Student Inquiries & CRM)**:
   - `id`: string
   - `referenceId`: string (e.g., `ADHIGAM-Q-1048`)
   - `name`: string
   - `email`: string
   - `phone`: string
   - `telegram`?: string
   - `category`: string
   - `courseKeyOrTitle`: string
   - `preferredMode`: `'online' | 'offline' | 'hybrid'`
   - `message`: string
   - `status`: `'new' | 'contacted' | 'in_review' | 'resolved' | 'closed'`
   - `adminReply`?: string
   - `counselorNotes`?: string
   - `createdAt`: string
   - `updatedAt`: string

---

## 3. Server REST API & Storage Layer

The backend is handled by `server.ts` running Express. In development, Vite middlewares are attached. In production or standalone mode, Express serves API endpoints and static `dist/` files.

### REST Endpoints:
- `GET /api/test-series` — Retrieve all published test series and schedules.
- `GET /api/test-series/:id` — Retrieve a single test series by ID or key.
- `GET /api/courses` — Retrieve all published academic courses.
- `POST /api/enquiries` — Submit student query, returns unique `referenceId`.
- `GET /api/enquiries/track?q=<ref_or_email>` — Public query status tracker.
- `GET /api/admin/enquiries` — Staff CRM inquiry management.
- `PUT /api/admin/enquiries/:id` — Update enquiry status & faculty response.

---

## 4. Packaging Pipeline (`scripts/package-versioned.mjs`)

The project includes an automated Node.js ESM packaging script with `jszip`:
- Reads `version` from `package.json`.
- Compiles the application via Vite (`npm run build` or `npm run build:debug`).
- Compresses `dist/` into `adhigam-ias-v<version>-<release|debug>.zip`.
- Usable via npm scripts: `npm run package:release`, `npm run package:debug`, `npm run package:source`.

# ADHIGAM IAS — Official Web Application & Learning Management System

> **Premier Civil Services Examination Academy**  
> *"Driven by Discipline, Fueled by Knowledge"* • *Home of RISE 2.0 (Flagship Sociology Optional Test Series)*

---

## 🏛️ Overview

**ADHIGAM IAS** is a high-performance web platform and LMS built for UPSC Civil Services Examination (CSE) aspirants. The system combines an authoritative public portal, an enrolled student self-service workbench, and an administrative CMS for faculty and directorate management.

---

## 📚 Complete Guides & Instructions

Detailed operational instructions for all user personas are available in [`docs/INSTRUCTIONS.md`](docs/INSTRUCTIONS.md):

1. **[Developer Guide](docs/INSTRUCTIONS.md#-part-1-developer-guide)**: Local setup, packaging, database architecture, automated tests, and deployment.
2. **[Administrator & Faculty Guide](docs/INSTRUCTIONS.md#️-part-2-administrator--faculty-guide)**: Admin portal access, 49-test schedule management, answer copy evaluations, CRM leads, and database backups.
3. **[Aspirant Guide](docs/INSTRUCTIONS.md#-part-3-aspirant-guide)**: Registration, daily Prelims MCQ lab, RISE 2.0 answer script submission, scorecards, and query tracking.

---

## 🚀 Quick Start (Developers)

```bash
# Install dependencies
npm install

# Run development server (Port 3000)
npm run dev

# Run automated tests (17 test cases across storage, logic, algorithms)
npm test

# Build for production
npm run build

# Start production server
npm start
```

---

## 🛡️ Admin & Faculty Portal Access

- **Direct URL**: [`/admin`](https://adhigamiasacademy.com/admin)
- **Top Header**: Click **"Admin Portal"** in the top utility bar.
- **Mobile Menu**: Open the drawer and tap **"Admin Portal"**.
- **Footer**: Click **"Staff Portal"** or **"Faculty & Admin CMS Portal"**.
- **Default Admin Account**: `admin@adhigam.com` / `admin123`

---

## 🧪 Automated Testing & CI/CD

- **Test Suite**: Run `npm test` to execute all automated test suites (`tests/instituteConfig.test.ts`, `tests/storage.test.ts`, `tests/scoring-and-algorithms.test.ts`, `tests/build-pipeline.test.ts`).
- **CI Template**: Available at [`ci/github-actions-ci.yml`](ci/github-actions-ci.yml) for GitHub Actions integration.

---

## 📦 Packaging & Distribution

```bash
# Create deployable release zip package
npm run package:release

# Create debug package with source maps
npm run package:debug
```

---

## 📞 Official Contacts

- **Email**: `adhigamias@gmail.com`
- **Telegram**: `@adhigamias1` ([https://t.me/adhigamias1](https://t.me/adhigamias1))
- **Website**: [https://adhigamiasacademy.com/](https://adhigamiasacademy.com/)

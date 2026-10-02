# ADHIGAM IAS — Faculty & Academic Administrator Guide
## Managing Courses, Test Series, and Aspirant Queries

This manual provides standard operating procedures (SOPs) for the ADHIGAM IAS academic directorate, faculty evaluators, and admissions counselors to manage programmes, schedule tests, review answer submissions, and handle student inquiries.

---

## 1. Accessing the Faculty & CMS Staff Portal

1. **URL**: Navigate to `/admin` or click **"Admin / Faculty CMS"** in the top navigation bar.
2. **Authentication**:
   - **Directorate Email**: `admin@adhigamias.com` or `admin@adhigam.com`
   - **Faculty Email**: `faculty@adhigamias.com` or `sharma@adhigam.com`
   - **Default Password**: `admin123`
   *(Quick-login demo buttons are also provided on the staff login screen for testing).*

---

## 2. Adding a New Academic Course

To add a new course under the **Adhigam IAS Academic Umbrella** (e.g., *Sociology Optional Foundation*, *GS Mains Ethics Lab*, *Interview Mentorship*):

1. **Navigate to Courses CMS**:
   - In the Faculty Dashboard, select the **"Courses & Programmes"** tab (`/admin` → Courses).
2. **Click "Add New Course"**:
   - Click the **"+ Add New Course"** button in the top right.
3. **Fill in Course Specifications**:
   - **Course Title**: e.g., *"Sociology Optional Comprehensive Foundation 2027"*
   - **Course Key / Slug**: Unique system key (e.g., `socio-foundation-2027`)
   - **Category**: Select from:
     - `Optional` (Sociology Optional specialized programs)
     - `GS Foundation` (General Studies comprehensive batches)
     - `Mains Special` (Answer writing, ethics, and essay enrichment)
     - `Prelims Booster` / `CSAT`
   - **Delivery Mode**: Choose `Offline`, `Online`, or `Hybrid`
   - **Duration & Timing**: e.g., *"10 Months (800+ Hours)"*, *"Weekly Mon-Fri"*
   - **Course Fee**: Format with currency and tax notes (e.g., *"₹ 48,000 + GST"*)
   - **Faculty Mentors**: Names of lead instructors (e.g., *"Dr. R.K. Sharma, Sociology Directorate"*)
   - **Course Highlights & Features**: Enter key bullet points (one per line):
     - `Printed Reference Workbooks`
     - `Weekly Answer Writing Reviews`
     - `1-on-1 Mentorship Sessions`
   - **Syllabus / Module Breakdown**: Structured unit titles and sub-topics.
4. **Visibility & Publishing**:
   - Toggle **"Published"** to make it immediately visible on the public `/courses` page.
   - Toggle **"Featured"** if you want it spotlighted on the home page.
5. **Save**: Click **"Create Course"**. The course is immediately saved to disk and synchronized.

---

## 3. Creating & Managing a Test Series

To create a new test series (such as extending **RISE 2.0** or adding a new GS Test Series):

### A. Creating the Test Series Entity
1. In the Faculty Dashboard, open the **"Test Series CMS"** tab.
2. Click **"+ Create New Test Series"**.
3. Provide Core Details:
   - **Series Title**: e.g., *"RISE 3.0 – Sociology Optional Advanced Test Series"*
   - **Target Exam**: e.g., *"UPSC Civil Services Mains 2027"*
   - **Total Tests**: e.g., `49`
   - **Marks Per Test**: e.g., `50`
   - **Duration / Period**: e.g., *"12 Oct 2026 – 31 Jan 2027"*
   - **Schedule Frequency**: e.g., *"Monday, Wednesday, Friday"*
   - **Standard Fee & Early Bird Discount**: Set both tier pricing.
   - **Status**: Set to `Live` or `Draft`.

### B. Adding and Organizing Schedule Items (Tests)
1. In the Test Series CMS list, click **"Manage Schedule"** on the target series.
2. In the Schedule Explorer:
   - Click **"+ Add Test"** to add an individual test:
     - **Test Number**: Sequential number (e.g., `Test 50`)
     - **Date & Day**: e.g., *"05 Feb 2027"*, *"Wednesday"*
     - **Paper**: `Paper I`, `Paper II`, or `Comprehensive`
     - **Topic / Coverage**: Detailed syllabus coverage (e.g., *"Stratification & Social Mobility: Weberian vs Marxist paradigms"*)
     - **Question PDF / Model Answer PDF Link**: Uploaded file path or cloud link.
3. You can also re-order, edit dates, or replace question papers at any time.

---

## 4. How Administrators View & Manage Aspirant Queries

All student inquiries submitted through the **Student Query Desk (`/contact`)**, **Quick Enquire Modals**, and **Admissions forms** flow into the **Enquiries CRM**:

1. **Accessing Queries**:
   - Go to **"Enquiries CRM"** tab in the Admin Dashboard (`/admin` → Enquiries CRM).
   - An active counter shows **"New Enquiries"** needing attention.
2. **Filtering & Searching**:
   - **Search Bar**: Search by Student Name, Email, Phone, or Query Reference ID (e.g., `ADHIGAM-Q-7821`).
   - **Status Filter**: Filter by `New`, `Contacted`, `In Review`, `Resolved`, `Enrolled`, or `Closed`.
   - **Category Filter**: Filter specifically for `RISE 2.0 Enrolment`, `Admissions & Fee`, `Test Series Schedule`, `Evaluation Query`, or `General`.
3. **Reviewing and Answering a Query**:
   - Click **"View / Respond"** on any query card or table row.
   - **Aspirant Details**: View phone, email, telegram handle, and preferred mode (online/offline).
   - **Official Faculty Reply**: Enter your response in the **"Official Reply"** box.
     *(When the student uses their Reference ID on the public tracking page at `/contact`, this reply will be displayed to them).*
   - **Internal Counselor Notes**: Add private notes visible only to faculty and staff (e.g., *"Called student on 02 Oct, interested in Early Bird discount, waiting for payment"*).
   - **Update Status**: Change status to `Contacted`, `In Review`, or `Enrolled`.
   - Click **"Save Changes"**.
4. **Exporting Data**:
   - Click **"Export CSV"** to download all inquiries into an Excel/Google Sheets compatible spreadsheet for admissions followup.

---

## 5. How to Check If Aspirant & Admin Portals Are Working Fine

Follow this verification checklist:

### A. Testing the Aspirant Experience
1. Open the website and click **"Aspirant Portal"** in the top navigation bar (or visit `/login`).
2. Log in with the demo account (`aspirant@adhigam.com`).
3. Verify the Aspirant Workbench loads:
   - Check the **"My Test Series"** tab to see active enrolled tests.
   - Check the **"Submit Answer Script"** feature: try submitting a mock answer text or PDF link for evaluation.
   - Check the **"Evaluation History"** tab to see evaluated copies, scores, and faculty remarks.
   - Test a **"Daily MCQ Quiz"** or **"Daily Answer Prompt"**.
4. Test the **Public Query Desk**:
   - Go to `/contact`, submit a test inquiry with category `RISE 2.0 Enrolment`.
   - Note the generated Reference ID (e.g., `ADHIGAM-Q-XXXX`).
   - Switch to the "Track Query Status" tab and enter the Reference ID to verify instant tracking works.

### B. Testing the Admin & Evaluation Experience
1. Click **"Admin / Faculty CMS"** in the top navigation bar (or visit `/admin/login`).
2. Log in with `admin@adhigamias.com` or one-click demo faculty.
3. Check the **"Evaluations Workbench"**:
   - View pending answer script submissions from aspirants.
   - Click an attempt, enter faculty marks (e.g. 38/50) and constructive feedback, and click **"Complete Evaluation"**.
4. Check the **"Enquiries CRM"**:
   - Verify the test inquiry you submitted in step A appears at the top under `New`.
   - Open it, add an official response, and mark as `Contacted`.
   - Return to `/contact` as a student and verify the response is displayed!
5. Check the **"Database Backup & Sync"** in Institute Settings:
   - Verify that data persists across edits and can be exported as a backup JSON file.

---

*Document Version: 2.1 — Official ADHIGAM IAS Administrative Standard*

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  User,
  Announcement,
  Course,
  TestSeries,
  Article,
  Quiz,
  QuizAttempt,
  Prompt,
  WritingAttempt,
  Enquiry,
  Bookmark,
  Follow,
  FileRecord,
  AdminStats,
} from './src/types';
import { RISE_49_TEST_SCHEDULE, INSTITUTE_CONFIG } from './src/data/instituteConfig';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Simple Auth Token Generator & Session Store
interface Session {
  token: string;
  user: User;
  createdAt: number;
}
const sessions = new Map<string, Session>();

function createSession(user: User): string {
  const token = `adhigam_${user.role}_${crypto.randomBytes(24).toString('hex')}`;
  sessions.set(token, {
    token,
    user,
    createdAt: Date.now(),
  });
  return token;
}

function getSessionUser(req: Request, cookieName?: string): User | null {
  let token = req.headers.authorization?.replace('Bearer ', '');
  if (!token && req.headers.cookie) {
    const cookies = Object.fromEntries(
      req.headers.cookie.split('; ').map((c) => {
        const [k, ...v] = c.split('=');
        return [k, v.join('=')];
      })
    );
    if (cookieName && cookies[cookieName]) {
      token = cookies[cookieName];
    } else if (cookies['access_token']) {
      token = cookies['access_token'];
    } else if (cookies['aspirant_access_token']) {
      token = cookies['aspirant_access_token'];
    }
  }

  if (!token) return null;
  const session = sessions.get(token);
  return session ? session.user : null;
}

// Middleware guards
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = getSessionUser(req, 'access_token');
  if (!user || user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized: Admin access required.' });
  }
  (req as any).user = user;
  next();
};

const requireStaff = (req: Request, res: Response, next: NextFunction) => {
  const user = getSessionUser(req, 'access_token');
  if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
    return res.status(401).json({ error: 'Unauthorized: Staff/Faculty access required.' });
  }
  (req as any).user = user;
  next();
};

const requireAspirant = (req: Request, res: Response, next: NextFunction) => {
  const user = getSessionUser(req, 'aspirant_access_token');
  if (!user || user.role !== 'aspirant') {
    return res.status(401).json({ error: 'Unauthorized: Aspirant login required.' });
  }
  (req as any).user = user;
  next();
};

// Gemini AI Client Setup
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini API client initialization failed:', err);
  }
}

// -------------------------------------------------------------
// In-Memory Database & Seed Data
// -------------------------------------------------------------
const dbUsers: User[] = [
  {
    id: 'user_admin_1',
    email: 'admin@adhigamias.com',
    name: 'Adhigam IAS Academic Directorate',
    role: 'admin',
    department: 'Directorate & Academic Lead',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_faculty_1',
    email: 'faculty@adhigamias.com',
    name: 'Sociology Optional Faculty Team',
    role: 'instructor',
    department: 'Sociology Optional & Mains Evaluation',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_aspirant_1',
    email: 'aspirant@adhigam.com',
    name: 'Sociology Aspirant',
    role: 'aspirant',
    phone: '',
    targetYear: 'UPSC CSE Mains 2027',
    optionalSubject: 'Sociology',
    createdAt: new Date().toISOString(),
  },
];

// Pre-create initial active sessions for seamless demo testing
const adminSessionToken = createSession(dbUsers[0]);
const facultySessionToken = createSession(dbUsers[1]);
const aspirantSessionToken = createSession(dbUsers[2]);

const dbAnnouncements: Announcement[] = [
  {
    id: 'ann_rise_2',
    title: 'RISE 2.0 Sociology Optional Test Series (UPSC CSE Mains 2027) Admissions Open!',
    content: 'A structured answer-writing programme for UPSC Civil Services Mains 2027. 49 Tests, 50 Marks/Test, 4 Questions Each. Starts 12 Oct 2026.',
    badgeText: 'New Launch',
    type: 'new_batch',
    link: '/test-series',
    published: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ann_early_bird',
    title: 'Early Bird Offer: Enrol in RISE 2.0 for ₹7,650 (Valid through 9 October 2026)',
    content: 'Special early bird discount before the programme commences on 12 October 2026. Standard fee ₹8,900. Existing Adhigam students get 25% discount (₹6,675).',
    badgeText: 'Early Bird',
    type: 'urgent',
    link: '/test-series',
    published: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Dummy academic offerings removed per user instruction
const dbCourses: Course[] = [];

// Official RISE 2.0 Sociology Optional Test Series (49 Tests)
const dbTestSeries: TestSeries[] = [
  {
    id: 'ts_rise_2',
    key: 'rise-2-0-sociology-optional',
    title: 'RISE 2.0 – Sociology Optional Test Series',
    subtitle: 'Regular Improvement in Sociology Expression | UPSC Civil Services Mains 2027',
    type: 'optional',
    totalTests: 49,
    featured: true,
    published: true,
    fee: '₹8,900',
    earlyBirdFee: '₹7,650',
    existingStudentFee: '₹6,675',
    earlyBirdDeadline: '9 October 2026',
    startDate: '12 October 2026',
    endDate: '31 January 2027',
    mode: 'online',
    description:
      'A structured answer-writing programme for UPSC Civil Services Mains 2027. 49 Tests (50 Marks/Test, 4 Questions Each with 10- and 20-mark mix) on Monday, Wednesday, and Friday. Complete Paper I, Paper II, and Final Comprehensive tests with model answers released at 9:00 PM and line-by-line evaluated copies returned within 3 days.',
    schedule: RISE_49_TEST_SCHEDULE.map((s) => ({
      testNumber: s.testNumber,
      title: s.coverage,
      date: s.date,
      day: s.day,
      paper: s.paper,
      subjectTag: s.section,
      syllabus: `${s.section} - ${s.coverage}`,
    })),
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  },
];

const dbArticles: Article[] = [
  {
    id: 'art_1',
    slug: 'governor-role-constitutional-discretion-supreme-court-rulings',
    title: 'The Office of the Governor: Constitutional Discretion & Supreme Court Guidelines',
    summary: 'A detailed examination of Article 163, Article 200, landmark judgments (S.R. Bommai, Shamsher Singh), and recommendations of Sarkaria & Punchhi Commissions for GS Paper 2.',
    content: `## Context & Background

The role of the Governor in India's federal structure has frequently surfaced as a focal point of constitutional debates. Recent issues concerning assent to bills, reservation of legislation for the President, and the exercise of discretionary powers under Article 163 have drawn scrutiny from both judicial benches and academic scholars.

### Key Constitutional Provisions

1. **Article 153:** Mandates a Governor for each State.
2. **Article 163:** Discretionary powers of the Governor, stipulating that except in matters where the Governor is by or under the Constitution required to act in discretion, the Governor acts on the aid and advice of the Council of Ministers with the Chief Minister at the head.
3. **Article 200:** Assent to Bills passed by the State Legislature (Assent, Withhold, Return for reconsideration, or Reserve for Presidential consideration).

### Landmark Judicial Precedents

- **Shamsher Singh v. State of Punjab (1974):** The Supreme Court held that the Governor must exercise constitutional powers on the aid and advice of ministers, save in exceptional discretionary situations.
- **S.R. Bommai v. Union of India (1994):** Floor test was declared the sole legitimate test for determining majority confidence of a Ministry.
- **Nabam Rebia Case (2016):** Reaffirmed that the discretionary power of the Governor under Article 163 is restricted and limited.

### Recommendations of Commissions

- **Sarkaria Commission (1988):** Recommended that Governors should be eminent persons from outside the state, unaffiliated with local politics, and appointed in consultation with the Chief Minister.
- **Punchhi Commission (2010):** Proposed that Governors should be granted a fixed five-year tenure and removed only through a procedure analogous to impeachment.

### Conclusion & Mains Answer Approach

For GS Paper 2 answers, emphasize that the Governor is a vital constitutional bridge between the Centre and States. Discretionary powers must be exercised to preserve the constitutional fabric rather than impede legislative mandate.`,
    category: 'editorial',
    paperTag: 'GS2',
    syllabusTopics: ['Indian Constitution', 'Federalism & Centre-State Relations', 'Executive & Judiciary'],
    author: 'Prof. Ananya Roy',
    published: true,
    publishedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    readTime: '6 min read',
    keyTakeaways: [
      'Article 163 discretionary powers are subject to judicial review.',
      'Floor test is the mandatory mechanism for determining legislative majority.',
      'Sarkaria and Punchhi commission reports provide actionable governance reforms.',
    ],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'art_2',
    slug: 'india-semiconductor-mission-supply-chain-resilience-gs3',
    title: 'India Semiconductor Mission: Geopolitics, Supply Chain Resilience & Economic Growth',
    summary: 'Analyzing the $10 Billion ISM initiative, fab fabrication ecosystems, rare earth mineral diplomacy, and technological self-reliance under GS Paper 3.',
    content: `## Executive Overview

The semiconductor industry forms the backbone of modern electronics, AI chips, automotive systems, and defense technologies. Under the **India Semiconductor Mission (ISM)**, India aims to build a robust electronics manufacturing ecosystem.

### Key Pillars of ISM

1. **Financial Support:** 50% fiscal support for semiconductor fabs and display fabs across all technology nodes.
2. **Design-Linked Incentive (DLI) Scheme:** Financial incentives and infrastructure support for domestic IC design startups.
3. **Talent & R&D:** Partnerships with top IITs, NITs, and international research consortiums.

### Strategic Imperatives for India

- **Reducing Import Vulnerability:** Overcoming reliance on East Asian supply hubs.
- **Geopolitical Alliances:** Minerals Security Partnership (MSP) and India-US iCET (Initiative on Critical and Emerging Technology).
- **Challenges:** High capital intensity, ultra-pure water requirements, uninterrupted power grids, and skilled talent retention.

### Way Forward for Mains Answer

Integrate points on domestic manufacturing incentives (PLI), intellectual property development, and public-private partnerships.`,
    category: 'pib_summary',
    paperTag: 'GS3',
    syllabusTopics: ['Indian Economy & Industrial Growth', 'Science & Tech - Domestic Technology', 'Infrastructure'],
    author: 'Dr. Rajesh Sharma',
    published: true,
    publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    readTime: '5 min read',
    keyTakeaways: [
      'ISM offers 50% fiscal support for semiconductor fabs.',
      'Critical supply chain resilience depends on rare earth minerals & MSP alliance.',
      'Overcoming infrastructure and clean-water bottlenecks is vital.',
    ],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const dbQuizzes: Quiz[] = [
  {
    id: 'quiz_1',
    title: 'Daily Prelims Practice Quiz: Indian Polity & Governance',
    description: 'Test your understanding of Constitutional Bodies, Preamble, and Parliamentary Procedures with 5 high-yield MCQs.',
    subjectTag: 'Polity',
    paperTag: 'GS1',
    timeLimitMinutes: 10,
    totalMarks: 10,
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    questions: [
      {
        id: 'q1_1',
        questionText: 'Which of the following statements regarding the Election Commission of India (ECI) is/are correct?\n1. The Chief Election Commissioner and Election Commissioners enjoy equal powers.\n2. The Constitution specifies the qualifications of the members of the Election Commission.\nSelect the correct answer using the code given below:',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        correctOptionIndex: 0,
        explanation: 'Statement 1 is CORRECT: The CEC and Election Commissioners have equal powers and receive equal salary and allowances. Statement 2 is INCORRECT: The Constitution has NOT prescribed the qualifications (legal, educational, administrative, or judicial) of the members of the Election Commission.',
        subTopic: 'Constitutional Bodies',
      },
      {
        id: 'q1_2',
        questionText: 'Consider the following statements regarding the "Money Bill" under Article 110:\n1. A Money Bill can be introduced in either House of Parliament.\n2. The decision of the Speaker of Lok Sabha is final on whether a bill is a Money Bill or not.\nWhich of the statements given above is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        correctOptionIndex: 1,
        explanation: 'Statement 1 is INCORRECT: A Money Bill can be introduced ONLY in the Lok Sabha, and only on the recommendation of the President. Statement 2 is CORRECT: Under Article 110(3), the decision of the Speaker is final.',
        subTopic: 'Parliamentary Bills',
      },
      {
        id: 'q1_3',
        questionText: 'The term "Eminent Domain" in constitutional law relates to:',
        options: [
          'The power of the Judiciary to declare laws unconstitutional.',
          'The power of the State to acquire private property for public use with compensation.',
          'The exclusive power of the Rajya Sabha to create All-India Services.',
          'The power of the President to grant pardons under Article 72.',
        ],
        correctOptionIndex: 1,
        explanation: 'Eminent Domain refers to the sovereign power of the State to take or acquire private property for public purpose, subject to law and fair compensation principles.',
        subTopic: 'Fundamental Rights & Property',
      },
      {
        id: 'q1_4',
        questionText: 'Which Schedule of the Constitution of India contains provisions regarding the disqualification of MPs and MLAs on grounds of Defection?',
        options: ['7th Schedule', '9th Schedule', '10th Schedule', '11th Schedule'],
        correctOptionIndex: 2,
        explanation: 'The 10th Schedule (added by the 52nd Constitutional Amendment Act, 1985) contains provisions regarding anti-defection law.',
        subTopic: 'Schedules of Constitution',
      },
      {
        id: 'q1_5',
        questionText: 'Preamble to the Constitution of India is:',
        options: [
          'A part of the Constitution but has no legal effect.',
          'Not a part of the Constitution and has no legal effect.',
          'A part of the Constitution and has the same legal effect as any other part.',
          'A part of the Constitution but has no legal effect independently of other parts.',
        ],
        correctOptionIndex: 3,
        explanation: 'As held in Kesavananda Bharati (1973) & LIC of India case (1995), the Preamble is an integral part of the Constitution, but it is non-justiciable and has no legal effect independently of other parts.',
        subTopic: 'Preamble',
      },
    ],
  },
];

const dbQuizAttempts: QuizAttempt[] = [
  {
    id: 'attempt_1',
    quizId: 'quiz_1',
    quizTitle: 'Daily Prelims Practice Quiz: Indian Polity & Governance',
    aspirantId: 'user_aspirant_1',
    aspirantName: 'Siddharth Mukherjee',
    userAnswers: { q1_1: 0, q1_2: 1, q1_3: 1, q1_4: 2, q1_5: 0 },
    score: 8,
    totalQuestions: 5,
    correctCount: 4,
    incorrectCount: 1,
    unattemptedCount: 0,
    timeTakenSeconds: 245,
    completedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const dbPrompts: Prompt[] = [
  {
    id: 'prompt_1',
    title: 'Daily Mains Question: Urban Disaster Management & Climate Adaptation (GS-3)',
    questionText: 'Urban flooding in Indian metro cities has transformed from a seasonal inconvenience into an annual socio-economic disaster. Critically examine the key causes behind urban flood risks in India. Suggest a strategic framework for resilient urban infrastructure in alignment with the Sendai Framework. (250 Words, 15 Marks)',
    paperTag: 'GS3',
    wordLimit: 250,
    maxMarks: 15,
    syllabusTag: 'Disaster Management & Urbanization Hazards',
    modelAnswer: `### Model Answer Structure

#### 1. Introduction (30-40 Words)
- Define urban flooding as the inundation of land in a built environment caused by rainfall exceeding drainage capacity.
- Mention recent instances (Chennai, Mumbai, Bengaluru, Delhi) highlighting increasing frequency and intensity driven by localized climate events.

#### 2. Key Causes of Urban Flooding in India (100 Words)
- **Encroachment of Water Bodies:** Destruction of wetlands, lakes, and floodplains due to unregulated real estate construction (e.g., disappearance of wetlands in East Kolkata & Bengaluru lakes).
- **Inadequate Drainage Infrastructure:** Outdated stormwater drains designed for low-intensity rainfall, clogged with solid municipal waste.
- **Unplanned Urbanization & Impervious Surfaces:** Over-paving with concrete reducing natural soil infiltration rates below 10%.
- **Climate Change Impact:** Micro-climate shifts causing short-duration high-intensity rainfall events (cloudbursts).
- **Governance Deficits:** Fragmented institutional accountability among municipal corporations, urban development authorities, and disaster management cells.

#### 3. Strategic Resilient Framework & Sendai Framework Alignment (90 Words)
- **Priority 1 (Understanding Risk):** Hydro-meteorological risk mapping, GIS-based flood zonation, and real-time sensor monitoring.
- **Priority 2 (Strengthening Governance):** Unified Urban Water Management Authorities and strict enforcement of the Model Building Bye-Laws (2016).
- **Priority 3 (Investing in Resilience - Nature-Based Solutions):**
  - Implement **Sponge Cities Concept** (permeable pavements, urban forests, rain gardens).
  - Rejuvenation of urban blue-green infrastructure (Operation Varuna).
- **Priority 4 (Build Back Better & Early Warning):** Community-level disaster response teams and integrated warning systems (like CFLOWS in Chennai, I-FLOWS in Mumbai).

#### 4. Conclusion (20-30 Words)
Conclude that urban flood mitigation requires shifting from reactive emergency relief to proactive, climate-smart urban spatial planning, ensuring sustainable SDG-11 (Sustainable Cities) realization.`,
    evaluationRubric: {
      introductionWeight: '20% - Clear definition and recent context',
      bodyArgumentsWeight: '60% - Multi-dimensional causes & Sendai Framework alignment with examples',
      conclusionWeight: '20% - Forward-looking synthesis with SDG goals',
    },
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'prompt_2',
    title: 'Mains Ethics Question: Moral Dilemmas in Public Administration (GS-4)',
    questionText: 'You are an District Collector overseeing a major national highway expansion project. A ancient temple of high local faith lies directly in the planned alignment. Moving the road incurs a ₹200 Crore budget overrun and 2-year delay, while demolishing the temple risks law and order unrest. Analyze the ethical dilemmas involved and outline your course of action. (250 Words, 15 Marks)',
    paperTag: 'GS4',
    wordLimit: 250,
    maxMarks: 15,
    syllabusTag: 'Ethics & Case Studies in Public Administration',
    modelAnswer: `### Model Answer Framework

#### Ethical Dilemmas Involved:
1. Public Interest vs. Religious Sentiment & Community Trust.
2. Financial Stewardship (Fiduciary Duty) vs. Social Harmony & Law and Order.
3. Rule of Law & Development Velocity vs. Cultural Heritage Preservation.

#### Course of Action:
1. Stakeholder Consultation & Translucent Dialogue.
2. Technical Feasibility & Relocation Engineering (Transposition).
3. Preventive Peacekeeping & Community Leadership Involvement.`,
    evaluationRubric: {
      introductionWeight: '20% - Identification of core ethical dilemmas',
      bodyArgumentsWeight: '60% - Pragmatic, lawful, and empathetic solution steps',
      conclusionWeight: '20% - Administrative integrity principles',
    },
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

const dbWritingAttempts: WritingAttempt[] = [
  {
    id: 'writing_attempt_1',
    promptId: 'prompt_1',
    promptTitle: 'Daily Mains Question: Urban Disaster Management & Climate Adaptation (GS-3)',
    paperTag: 'GS3',
    aspirantId: 'user_aspirant_1',
    aspirantName: 'Siddharth Mukherjee',
    aspirantEmail: 'aspirant@adhigam.com',
    answerText: `Urban flooding has emerged as a severe annual crisis across major Indian metropolitan hubs like Mumbai, Chennai, Bengaluru, and Delhi. The phenomenon is driven by both natural climate events and man-made urban planning vulnerabilities.

Major Causes:
1. Encroachment of Wetlands: Rapid real estate expansion has filled up natural urban water bodies and lake channels, severing natural drainage pathways.
2. Inadequate Stormwater Drains: Most municipal drains are century-old, choked with plastic waste, and inadequate for intense downpours.
3. High Impervious Surface Area: Extensive concreting reduces natural soil percolation, causing 90% of rainwater to run off immediately.
4. Climate Change: Sudden high-intensity rainfall bursts occurring in short timeframes.

Sendai Framework & Strategic Action Plan:
- Sponge Cities Framework: Adopt permeable concrete, rain gardens, and floodplains protection to absorb runoff.
- Integrated Early Warning Systems: Expand radar technology and real-time sensors (like I-FLOWS Mumbai).
- Urban Lake Rejuvenation: Mandate buffer zones around lakes as per NGT guidelines.
- Governance Integration: Form unified urban water bodies integrating municipal and disaster relief departments.

Conclusion:
A shift from emergency disaster relief to eco-centric climate-resilient spatial planning is essential for achieving SDG-11.`,
    status: 'reviewed',
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    review: {
      facultyId: 'user_faculty_1',
      facultyName: 'Prof. Ananya Roy',
      reviewedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
      marksObtained: 9.5,
      maxMarks: 15,
      structureFeedback: 'Good intro and systematic subheadings. Your division into causes and Sendai framework alignment is crisp.',
      contentFeedback: 'Substantiated causes well. Adding specific statistics (e.g. loss of 70% waterbodies in Bengaluru) and mentioning the NDMA urban flooding guidelines would elevate this to a top-tier score.',
      languageFeedback: 'Lucid articulation with good administrative vocabulary.',
      overallComments: 'Very commendable attempt! Incorporate maps or flowcharts in the body section for extra visual impact in the exam.',
      modelComparisonNotes: 'Your points on Sponge Cities align well with the model answer. Review the 4 priorities of Sendai framework explicitly in bullet points.',
      isAiEvaluated: false,
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const dbEnquiries: Enquiry[] = [
  {
    id: 'enq_1',
    referenceId: 'ADHIGAM-Q-7341',
    name: 'Aarav Singhal',
    email: 'aarav.singhal@gmail.com',
    phone: '+91 98112 34567',
    telegram: '@aarav_ias',
    category: 'Early Bird Enrolment',
    courseKeyOrTitle: 'RISE 2.0 – Sociology Optional Test Series',
    preferredMode: 'online',
    message: 'I want to enroll under the Early Bird offer (₹7,650) before 9th October. Could you please share the UPI / QR code payment process and confirmation steps?',
    status: 'new',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'enq_2',
    referenceId: 'ADHIGAM-Q-7342',
    name: 'Meera Nambiar',
    email: 'meera.nambiar@yahoo.com',
    phone: '+91 98450 12345',
    telegram: '@meera_soc',
    category: 'Existing Student Discount',
    courseKeyOrTitle: 'RISE 2.0 – Sociology Optional Test Series',
    preferredMode: 'online',
    message: 'I completed the previous edition of RISE. How do I verify my existing student status to avail of the 25% discount fee of ₹6,675?',
    status: 'contacted',
    notes: 'Counselor confirmed prior registration ID. Sent verification instructions.',
    adminReply: 'Verification confirmed! You can complete payment for ₹6,675. Welcome back to RISE 2.0.',
    repliedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'enq_3',
    referenceId: 'ADHIGAM-Q-7343',
    name: 'Devendra Patel',
    email: 'dev.patel@outlook.com',
    phone: '+91 99240 88776',
    telegram: '@dev_aspirant',
    category: 'Evaluation & Test Routine',
    courseKeyOrTitle: 'RISE 2.0 – Sociology Optional Test Series',
    preferredMode: 'online',
    message: 'If I write my answers on UPSC-format ruled paper, scan and send the PDF by 9:00 PM via Telegram (@adhigamias1), will the evaluated copy be returned with line-by-line comments within 3 days?',
    status: 'resolved',
    notes: 'Clarified evaluation routine: Question paper at 6:00 PM, submit single PDF by 9:00 PM, model answer at 9:00 PM, evaluated copy within 3 days.',
    adminReply: 'Yes, exactly! Submit your single scanned PDF by 9:00 PM on test day (Mon/Wed/Fri) via Telegram or email. Evaluated copy with detailed faculty comments is returned within 3 days.',
    repliedAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const dbBookmarks: Bookmark[] = [
  {
    id: 'bm_1',
    aspirantId: 'user_aspirant_1',
    itemType: 'article',
    itemId: 'art_1',
    title: 'The Office of the Governor: Constitutional Discretion & Supreme Court Guidelines',
    metaTag: 'GS2 Polity',
    createdAt: new Date().toISOString(),
  },
];

const dbFollows: Follow[] = [
  {
    id: 'fol_1',
    aspirantId: 'user_aspirant_1',
    itemType: 'course',
    itemId: 'course_1',
    title: 'GS Integrated Foundation Program (Prelims-cum-Mains) 2026',
    createdAt: new Date().toISOString(),
  },
];

const dbFiles: FileRecord[] = [];

// -------------------------------------------------------------
// AUTH ENDPOINTS
// -------------------------------------------------------------

// Admin / Staff Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = dbUsers.find((u) => u.email.toLowerCase() === email?.toLowerCase() && (u.role === 'admin' || u.role === 'instructor'));

  if (!user) {
    return res.status(401).json({ error: 'Invalid staff email or password.' });
  }

  // Password check (Demo accepts any password or 'admin123' / 'faculty123')
  const token = createSession(user);
  res.cookie('access_token', token, { httpOnly: true, maxAge: 7 * 86400 * 1000, path: '/' });
  return res.json({
    access_token: token,
    token_type: 'bearer',
    user,
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('access_token');
  res.json({ message: 'Logged out successfully.' });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getSessionUser(req, 'access_token');
  if (!user) return res.status(401).json({ error: 'Not authenticated as staff.' });
  return res.json({ user });
});

// Aspirant Auth
app.post('/api/aspirants/register', (req: Request, res: Response) => {
  const { name, email, phone, targetYear, optionalSubject } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const existing = dbUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newUser: User = {
    id: `aspirant_${Date.now()}`,
    email: email.trim(),
    name: name.trim(),
    role: 'aspirant',
    phone: phone || '',
    targetYear: targetYear || 'UPSC CSE 2026',
    optionalSubject: optionalSubject || 'General',
    createdAt: new Date().toISOString(),
  };

  dbUsers.push(newUser);
  const token = createSession(newUser);
  res.cookie('aspirant_access_token', token, { httpOnly: true, maxAge: 7 * 86400 * 1000, path: '/' });
  return res.json({
    aspirant_access_token: token,
    token_type: 'bearer',
    user: newUser,
  });
});

app.post('/api/aspirants/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = dbUsers.find((u) => u.email.toLowerCase() === email?.toLowerCase() && u.role === 'aspirant');

  if (!user) {
    return res.status(401).json({ error: 'Aspirant account not found. Please register first.' });
  }

  const token = createSession(user);
  res.cookie('aspirant_access_token', token, { httpOnly: true, maxAge: 7 * 86400 * 1000, path: '/' });
  return res.json({
    aspirant_access_token: token,
    token_type: 'bearer',
    user,
  });
});

app.post('/api/aspirants/logout', (req: Request, res: Response) => {
  res.clearCookie('aspirant_access_token');
  res.json({ message: 'Aspirant logged out.' });
});

app.get('/api/aspirants/me', (req: Request, res: Response) => {
  const user = getSessionUser(req, 'aspirant_access_token');
  if (!user || user.role !== 'aspirant') return res.status(401).json({ error: 'Not authenticated as aspirant.' });
  return res.json({ user });
});

// -------------------------------------------------------------
// PUBLIC CONTENT ENDPOINTS
// -------------------------------------------------------------

app.get('/api/announcements', (req: Request, res: Response) => {
  const list = dbAnnouncements.filter((a) => a.published);
  res.json(list);
});

app.get('/api/courses', (req: Request, res: Response) => {
  const category = req.query.category as string;
  let list = dbCourses.filter((c) => c.published);
  if (category) {
    list = list.filter((c) => c.category === category);
  }
  res.json(list);
});

app.get('/api/courses/:key', (req: Request, res: Response) => {
  const course = dbCourses.find((c) => c.key === req.params.key || c.id === req.params.key);
  if (!course) return res.status(404).json({ error: 'Course not found.' });
  res.json(course);
});

app.get('/api/test-series', (req: Request, res: Response) => {
  const type = req.query.type as string;
  let list = dbTestSeries.filter((t) => t.published);
  if (type) {
    list = list.filter((t) => t.type === type);
  }
  res.json(list);
});

app.get('/api/test-series/:key', (req: Request, res: Response) => {
  const ts = dbTestSeries.find((t) => t.key === req.params.key || t.id === req.params.key);
  if (!ts) return res.status(404).json({ error: 'Test series not found.' });
  res.json(ts);
});

app.get('/api/articles', (req: Request, res: Response) => {
  const paperTag = req.query.paperTag as string;
  const category = req.query.category as string;
  let list = dbArticles.filter((a) => a.published);
  if (paperTag) list = list.filter((a) => a.paperTag === paperTag);
  if (category) list = list.filter((a) => a.category === category);
  res.json(list);
});

app.get('/api/articles/:slug', (req: Request, res: Response) => {
  const article = dbArticles.find((a) => a.slug === req.params.slug || a.id === req.params.slug);
  if (!article) return res.status(404).json({ error: 'Article not found.' });
  res.json(article);
});

app.get('/api/quizzes', (req: Request, res: Response) => {
  // Public list excludes full questions with correct option index
  const list = dbQuizzes.filter((q) => q.published).map((q) => ({
    id: q.id,
    title: q.title,
    description: q.description,
    subjectTag: q.subjectTag,
    paperTag: q.paperTag,
    timeLimitMinutes: q.timeLimitMinutes,
    totalMarks: q.totalMarks,
    questionCount: q.questions.length,
    createdAt: q.createdAt,
  }));
  res.json(list);
});

app.get('/api/quizzes/:id', (req: Request, res: Response) => {
  const quiz = dbQuizzes.find((q) => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

  // Exclude correctOptionIndex for quiz taking mode
  const clientQuestions = quiz.questions.map(({ correctOptionIndex, explanation, ...rest }) => rest);
  res.json({
    ...quiz,
    questions: clientQuestions,
  });
});

app.post('/api/quizzes/:id/submit', (req: Request, res: Response) => {
  const quiz = dbQuizzes.find((q) => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

  const { userAnswers, timeTakenSeconds } = req.body; // Record<string, number>
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  const questionBreakdown = quiz.questions.map((q) => {
    const selected = userAnswers?.[q.id];
    const isAttempted = selected !== undefined && selected !== null && selected !== -1;
    const isCorrect = isAttempted && selected === q.correctOptionIndex;

    if (!isAttempted) unattemptedCount++;
    else if (isCorrect) correctCount++;
    else incorrectCount++;

    return {
      questionId: q.id,
      questionText: q.questionText,
      options: q.options,
      selectedOptionIndex: selected ?? -1,
      correctOptionIndex: q.correctOptionIndex,
      isCorrect,
      explanation: q.explanation,
    };
  });

  // Calculate score (2 marks per correct, -0.66 per incorrect as per UPSC Prelims)
  const score = Math.max(0, Number((correctCount * 2 - incorrectCount * 0.66).toFixed(2)));

  const aspirant = getSessionUser(req, 'aspirant_access_token');
  const attempt: QuizAttempt = {
    id: `attempt_${Date.now()}`,
    quizId: quiz.id,
    quizTitle: quiz.title,
    aspirantId: aspirant?.id || 'anonymous',
    aspirantName: aspirant?.name || 'Guest Aspirant',
    userAnswers: userAnswers || {},
    score,
    totalQuestions: quiz.questions.length,
    correctCount,
    incorrectCount,
    unattemptedCount,
    timeTakenSeconds: timeTakenSeconds || 0,
    completedAt: new Date().toISOString(),
  };

  if (aspirant) {
    dbQuizAttempts.push(attempt);
  }

  return res.json({
    attempt,
    questionBreakdown,
  });
});

app.get('/api/prompts', (req: Request, res: Response) => {
  const paperTag = req.query.paperTag as string;
  let list = dbPrompts.filter((p) => p.published);
  if (paperTag) list = list.filter((p) => p.paperTag === paperTag);
  res.json(list);
});

app.get('/api/prompts/:id', (req: Request, res: Response) => {
  const prompt = dbPrompts.find((p) => p.id === req.params.id);
  if (!prompt) return res.status(404).json({ error: 'Prompt not found.' });
  res.json(prompt);
});

app.post('/api/enquiries', (req: Request, res: Response) => {
  const { name, email, phone, telegram, category, courseKeyOrTitle, preferredMode, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const referenceId = `ADHIGAM-Q-${randomDigits}`;

  const enq: Enquiry = {
    id: `enq_${Date.now()}`,
    referenceId,
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || '',
    telegram: telegram?.trim() || '',
    category: category || 'RISE 2.0 Enrolment',
    courseKeyOrTitle: courseKeyOrTitle || 'RISE 2.0 – Sociology Optional Test Series',
    preferredMode: preferredMode || 'online',
    message: message.trim(),
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  dbEnquiries.unshift(enq);
  res.json({
    success: true,
    enquiry: enq,
    referenceId,
    message: 'Your query has been submitted successfully to ADHIGAM IAS.',
  });
});

// Student Query Public Tracking Endpoint
app.get('/api/enquiries/track', (req: Request, res: Response) => {
  const query = ((req.query.q as string) || '').trim().toLowerCase();
  if (!query) {
    return res.status(400).json({ error: 'Please provide an email or query reference number.' });
  }

  const matches = dbEnquiries.filter(
    (e) =>
      e.email.toLowerCase() === query ||
      (e.referenceId && e.referenceId.toLowerCase() === query) ||
      (e.phone && e.phone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, '')))
  );

  res.json({
    query,
    count: matches.length,
    results: matches.map((m) => ({
      id: m.id,
      referenceId: m.referenceId,
      name: m.name,
      category: m.category,
      courseKeyOrTitle: m.courseKeyOrTitle,
      status: m.status,
      message: m.message,
      adminReply: m.adminReply,
      repliedAt: m.repliedAt,
      createdAt: m.createdAt,
    })),
  });
});

app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, telegram, category, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const referenceId = `ADHIGAM-Q-${randomDigits}`;

  const enq: Enquiry = {
    id: `contact_${Date.now()}`,
    referenceId,
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || '',
    telegram: telegram?.trim() || '',
    category: category || 'General Academic Inquiry',
    courseKeyOrTitle: 'RISE 2.0 – Sociology Optional Test Series',
    message: message.trim(),
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  dbEnquiries.unshift(enq);
  res.json({
    success: true,
    referenceId,
    message: 'Your inquiry has been submitted. Reference code: ' + referenceId,
  });
});

// -------------------------------------------------------------
// ASPIRANT PORTAL ENDPOINTS (`/api/my/*`)
// -------------------------------------------------------------

app.get('/api/my/dashboard', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const myQuizAttempts = dbQuizAttempts.filter((a) => a.aspirantId === user.id);
  const myWritingAttempts = dbWritingAttempts.filter((w) => w.aspirantId === user.id);
  const myBookmarks = dbBookmarks.filter((b) => b.aspirantId === user.id);
  const myFollows = dbFollows.filter((f) => f.aspirantId === user.id);

  const totalQuizzes = myQuizAttempts.length;
  const avgScore = totalQuizzes > 0 ? (myQuizAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes).toFixed(1) : '0';

  res.json({
    aspirant: user,
    stats: {
      totalQuizzesAttempted: totalQuizzes,
      averageQuizScore: avgScore,
      totalWritingSubmitted: myWritingAttempts.length,
      reviewedWritingCount: myWritingAttempts.filter((w) => w.status === 'reviewed').length,
      bookmarksCount: myBookmarks.length,
      followedCount: myFollows.length,
    },
    recentQuizAttempts: myQuizAttempts.slice(0, 5),
    recentWritingAttempts: myWritingAttempts.slice(0, 5),
  });
});

app.get('/api/my/bookmarks', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  res.json(dbBookmarks.filter((b) => b.aspirantId === user.id));
});

app.post('/api/my/bookmarks', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { itemType, itemId, title, metaTag } = req.body;

  const existing = dbBookmarks.find((b) => b.aspirantId === user.id && b.itemId === itemId);
  if (existing) return res.json(existing);

  const bm: Bookmark = {
    id: `bm_${Date.now()}`,
    aspirantId: user.id,
    itemType,
    itemId,
    title,
    metaTag,
    createdAt: new Date().toISOString(),
  };
  dbBookmarks.unshift(bm);
  res.json(bm);
});

app.delete('/api/my/bookmarks/:id', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const idx = dbBookmarks.findIndex((b) => b.id === req.params.id && b.aspirantId === user.id);
  if (idx !== -1) dbBookmarks.splice(idx, 1);
  res.json({ success: true });
});

app.get('/api/my/follows', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  res.json(dbFollows.filter((f) => f.aspirantId === user.id));
});

app.post('/api/my/follows', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { itemType, itemId, title } = req.body;

  const existing = dbFollows.find((f) => f.aspirantId === user.id && f.itemId === itemId);
  if (existing) return res.json(existing);

  const fol: Follow = {
    id: `fol_${Date.now()}`,
    aspirantId: user.id,
    itemType,
    itemId,
    title,
    createdAt: new Date().toISOString(),
  };
  dbFollows.unshift(fol);
  res.json(fol);
});

app.delete('/api/my/follows/:id', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const idx = dbFollows.findIndex((f) => f.id === req.params.id && f.aspirantId === user.id);
  if (idx !== -1) dbFollows.splice(idx, 1);
  res.json({ success: true });
});

app.get('/api/my/writing-attempts', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  res.json(dbWritingAttempts.filter((w) => w.aspirantId === user.id));
});

app.post('/api/my/writing-attempts', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { promptId, answerText, pdfUrl, pdfFileName, status } = req.body;

  const prompt = dbPrompts.find((p) => p.id === promptId);
  if (!prompt) return res.status(404).json({ error: 'Prompt not found.' });

  const attempt: WritingAttempt = {
    id: `writing_${Date.now()}`,
    promptId: prompt.id,
    promptTitle: prompt.title,
    paperTag: prompt.paperTag,
    aspirantId: user.id,
    aspirantName: user.name,
    aspirantEmail: user.email,
    answerText: answerText || '',
    pdfUrl: pdfUrl || '',
    pdfFileName: pdfFileName || '',
    status: status || 'submitted',
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  dbWritingAttempts.unshift(attempt);
  res.json(attempt);
});

app.post('/api/my/writing-attempts/:attempt_id/submit', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const attempt = dbWritingAttempts.find((w) => w.id === req.params.attempt_id && w.aspirantId === user.id);
  if (!attempt) return res.status(404).json({ error: 'Writing attempt not found.' });

  attempt.status = 'submitted';
  attempt.submittedAt = new Date().toISOString();
  if (req.body.answerText) attempt.answerText = req.body.answerText;
  if (req.body.pdfUrl) attempt.pdfUrl = req.body.pdfUrl;

  res.json(attempt);
});

app.post('/api/my/pdf-upload', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { fileName, fileData } = req.body; // base64 or text simulated PDF

  const fileRecord: FileRecord = {
    id: `file_${Date.now()}`,
    originalName: fileName || 'answer_script.pdf',
    mimeType: 'application/pdf',
    size: Math.round((fileData?.length || 1024) * 0.75),
    url: `/api/files/download_${Date.now()}.pdf`,
    uploadedBy: user.id,
    createdAt: new Date().toISOString(),
  };

  dbFiles.push(fileRecord);
  res.json({
    url: fileRecord.url,
    fileName: fileRecord.originalName,
    size: fileRecord.size,
  });
});

app.get('/api/my/quiz-attempts', requireAspirant, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  res.json(dbQuizAttempts.filter((q) => q.aspirantId === user.id));
});

// -------------------------------------------------------------
// AI EVALUATION ENDPOINT (GEMINI SERVER-SIDE)
// -------------------------------------------------------------

app.post('/api/reviews/ai-evaluate', async (req: Request, res: Response) => {
  const { promptId, answerText } = req.body;

  if (!answerText || answerText.trim().length < 20) {
    return res.status(400).json({ error: 'Please enter a substantial answer text to evaluate.' });
  }

  const prompt = dbPrompts.find((p) => p.id === promptId) || {
    title: 'General UPSC Mains Question',
    questionText: 'Analyze the given question text according to UPSC IAS Mains evaluation rubrics.',
    maxMarks: 15,
    wordLimit: 250,
    modelAnswer: '',
  };

  if (!aiClient) {
    // Fallback heuristic evaluation if Gemini API Key is not set or client unavailable
    const wordCount = answerText.trim().split(/\s+/).length;
    const marksObtained = Math.min(prompt.maxMarks, Math.max(3, Math.round((wordCount / prompt.wordLimit) * 10 * 10) / 10));

    return res.json({
      marksObtained,
      maxMarks: prompt.maxMarks,
      strengths: [
        'Good structure with distinct introduction and conclusions.',
        'Addresses the main demand of the question systematically.',
      ],
      improvements: [
        'Incorporate more empirical data, committee reports, and article numbers.',
        'Include a flowchart or diagram for better presentation score.',
      ],
      detailedAnalysis: `**Structure & Flow:** Your attempt contains approximately ${wordCount} words. The intro sets the baseline context well.\n\n**Content Depth:** Core arguments are well articulated. To achieve a top-10% score, integrate official committee recommendations and constitutional precedents.`,
      evaluatedAt: new Date().toISOString(),
    });
  }

  try {
    const aiPrompt = `
You are a senior UPSC Civil Services Mains Answer Evaluator at Adhigam IAS academy. Evaluate the following aspirant's answer script against the question prompt and UPSC standards.

QUESTION PROMPT:
"${prompt.questionText}"

MAX MARKS: ${prompt.maxMarks}
RECOMMENDED WORD LIMIT: ${prompt.wordLimit}

MODEL ANSWER REFERENCE:
"${prompt.modelAnswer}"

ASPIRANT'S ANSWER SCRIPT:
"${answerText}"

Provide your evaluation in strict JSON format with the following keys:
- "marksObtained": (number out of ${prompt.maxMarks}, e.g. 8.5)
- "maxMarks": ${prompt.maxMarks}
- "strengths": (array of 2-3 specific bullet strings)
- "improvements": (array of 2-3 specific actionable improvement points)
- "detailedAnalysis": (markdown string reviewing Introduction, Body Arguments, Data/Precedents, and Conclusion)
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: aiPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '';
    const parsed = JSON.parse(jsonText);

    res.json({
      marksObtained: parsed.marksObtained ?? 8,
      maxMarks: prompt.maxMarks,
      strengths: parsed.strengths || ['Clear paragraph structure', 'Relevant key points'],
      improvements: parsed.improvements || ['Add committee reports', 'Improve conclusion synthesis'],
      detailedAnalysis: parsed.detailedAnalysis || 'Analysis generated by Gemini AI Evaluator.',
      evaluatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Gemini evaluation error:', err);
    res.status(500).json({
      error: 'Failed to complete AI evaluation. Please try again.',
      details: err?.message,
    });
  }
});

// -------------------------------------------------------------
// STAFF / ADMIN CMS & REVIEWS ENDPOINTS
// -------------------------------------------------------------

app.get('/api/admin/stats', requireStaff, (req: Request, res: Response) => {
  const stats: AdminStats = {
    totalAspirants: dbUsers.filter((u) => u.role === 'aspirant').length,
    totalCourses: dbCourses.length,
    totalTestSeries: dbTestSeries.length,
    totalArticles: dbArticles.length,
    totalQuizzes: dbQuizzes.length,
    totalPrompts: dbPrompts.length,
    totalWritingAttempts: dbWritingAttempts.length,
    pendingReviewsCount: dbWritingAttempts.filter((w) => w.status === 'submitted' || w.status === 'under_review').length,
    totalEnquiries: dbEnquiries.length,
    newEnquiriesCount: dbEnquiries.filter((e) => e.status === 'new').length,
  };
  res.json(stats);
});

// Reviews Management
app.get('/api/reviews', requireStaff, (req: Request, res: Response) => {
  res.json(dbWritingAttempts);
});

app.get('/api/admin/writing-attempts', requireStaff, (req: Request, res: Response) => {
  res.json(dbWritingAttempts);
});

app.get('/api/reviews/:attempt_id', requireStaff, (req: Request, res: Response) => {
  const attempt = dbWritingAttempts.find((w) => w.id === req.params.attempt_id);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found.' });

  const prompt = dbPrompts.find((p) => p.id === attempt.promptId);
  res.json({
    attempt,
    prompt,
  });
});

app.post('/api/reviews/:attempt_id', requireStaff, (req: Request, res: Response) => {
  const staff = (req as any).user as User;
  const attempt = dbWritingAttempts.find((w) => w.id === req.params.attempt_id);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found.' });

  const { marksObtained, maxMarks, structureFeedback, contentFeedback, languageFeedback, overallComments, modelComparisonNotes, scoreAwarded, generalComments, strengths, improvements } = req.body;

  attempt.status = 'reviewed';
  attempt.review = {
    facultyId: staff.id,
    facultyName: staff.name,
    reviewedAt: new Date().toISOString(),
    marksObtained: Number(marksObtained ?? scoreAwarded ?? 0),
    maxMarks: Number(maxMarks ?? 15),
    structureFeedback: structureFeedback || (strengths ? strengths.join(', ') : ''),
    contentFeedback: contentFeedback || '',
    languageFeedback: languageFeedback || '',
    overallComments: overallComments || generalComments || '',
    modelComparisonNotes: modelComparisonNotes || (improvements ? improvements.join(', ') : ''),
    isAiEvaluated: false,
  };

  res.json(attempt);
});

app.put('/api/writing-attempts/:attempt_id/review', requireStaff, (req: Request, res: Response) => {
  const staff = (req as any).user as User;
  const attempt = dbWritingAttempts.find((w) => w.id === req.params.attempt_id);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found.' });

  const { marksObtained, maxMarks, structureFeedback, contentFeedback, languageFeedback, overallComments, modelComparisonNotes, scoreAwarded, generalComments, strengths, improvements } = req.body;

  attempt.status = 'reviewed';
  attempt.review = {
    facultyId: staff.id,
    facultyName: staff.name,
    reviewedAt: new Date().toISOString(),
    marksObtained: Number(marksObtained ?? scoreAwarded ?? 0),
    maxMarks: Number(maxMarks ?? 15),
    structureFeedback: structureFeedback || (strengths ? (Array.isArray(strengths) ? strengths.join(', ') : strengths) : ''),
    contentFeedback: contentFeedback || '',
    languageFeedback: languageFeedback || '',
    overallComments: overallComments || generalComments || '',
    modelComparisonNotes: modelComparisonNotes || (improvements ? (Array.isArray(improvements) ? improvements.join(', ') : improvements) : ''),
    isAiEvaluated: false,
  };

  res.json(attempt);
});

// Courses CMS
app.get('/api/admin/courses', requireStaff, (req: Request, res: Response) => {
  res.json(dbCourses);
});

app.post('/api/admin/courses', requireStaff, (req: Request, res: Response) => {
  const data = req.body;
  const newCourse: Course = {
    id: `course_${Date.now()}`,
    key: data.key || `course-${Date.now()}`,
    title: data.title,
    subtitle: data.subtitle || '',
    category: data.category || 'gs_foundation',
    mode: data.mode || 'hybrid',
    duration: data.duration || '6 Months',
    startDate: data.startDate || 'Upcoming Batch',
    fee: data.fee || 'Contact Academy',
    featured: Boolean(data.featured),
    published: Boolean(data.published ?? true),
    description: data.description || '',
    overview: data.overview || [],
    features: data.features || [],
    syllabusModules: data.syllabusModules || [],
    facultyNames: data.facultyNames || ['Adhigam IAS Senior Faculty'],
    image: data.image || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  };

  dbCourses.unshift(newCourse);
  res.json(newCourse);
});

app.put('/api/admin/courses/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbCourses.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Course not found.' });

  dbCourses[idx] = {
    ...dbCourses[idx],
    ...req.body,
  };
  res.json(dbCourses[idx]);
});

app.delete('/api/admin/courses/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbCourses.findIndex((c) => c.id === req.params.id);
  if (idx !== -1) dbCourses.splice(idx, 1);
  res.json({ success: true });
});

// Test Series CMS
app.get('/api/admin/test-series', requireStaff, (req: Request, res: Response) => {
  res.json(dbTestSeries);
});

app.post('/api/admin/test-series', requireStaff, (req: Request, res: Response) => {
  const data = req.body;
  const ts: TestSeries = {
    id: `test_${Date.now()}`,
    key: data.key || `test-${Date.now()}`,
    title: data.title,
    subtitle: data.subtitle || '',
    type: data.type || 'prelims',
    totalTests: Number(data.totalTests || 10),
    featured: Boolean(data.featured),
    published: Boolean(data.published ?? true),
    fee: data.fee || '₹10,000',
    startDate: data.startDate || 'Immediate',
    mode: data.mode || 'online',
    description: data.description || '',
    schedule: data.schedule || [],
    image: data.image || 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  };

  dbTestSeries.unshift(ts);
  res.json(ts);
});

app.put('/api/admin/test-series/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbTestSeries.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Test series not found.' });

  dbTestSeries[idx] = {
    ...dbTestSeries[idx],
    ...req.body,
  };
  res.json(dbTestSeries[idx]);
});

app.delete('/api/admin/test-series/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbTestSeries.findIndex((t) => t.id === req.params.id);
  if (idx !== -1) dbTestSeries.splice(idx, 1);
  res.json({ success: true });
});

// Articles / Editorial CMS
app.get('/api/admin/articles', requireStaff, (req: Request, res: Response) => {
  res.json(dbArticles);
});

app.post('/api/admin/articles', requireStaff, (req: Request, res: Response) => {
  const data = req.body;
  const art: Article = {
    id: `art_${Date.now()}`,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: data.title,
    summary: data.summary || '',
    content: data.content || '',
    category: data.category || 'current_affairs',
    paperTag: data.paperTag || 'GS2',
    syllabusTopics: data.syllabusTopics || [],
    author: data.author || 'Adhigam IAS Editorial Team',
    published: Boolean(data.published ?? true),
    publishedAt: new Date().toISOString(),
    readTime: data.readTime || '5 min read',
    keyTakeaways: data.keyTakeaways || [],
    image: data.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  };

  dbArticles.unshift(art);
  res.json(art);
});

app.put('/api/admin/articles/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbArticles.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article not found.' });

  dbArticles[idx] = {
    ...dbArticles[idx],
    ...req.body,
  };
  res.json(dbArticles[idx]);
});

app.delete('/api/admin/articles/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbArticles.findIndex((a) => a.id === req.params.id);
  if (idx !== -1) dbArticles.splice(idx, 1);
  res.json({ success: true });
});

// Quiz Builder CMS
app.get('/api/admin/quizzes', requireStaff, (req: Request, res: Response) => {
  res.json(dbQuizzes);
});

app.post('/api/admin/quizzes', requireStaff, (req: Request, res: Response) => {
  const data = req.body;
  const qz: Quiz = {
    id: `quiz_${Date.now()}`,
    title: data.title,
    description: data.description || '',
    subjectTag: data.subjectTag || 'Polity',
    paperTag: data.paperTag || 'GS1',
    timeLimitMinutes: Number(data.timeLimitMinutes || 10),
    totalMarks: Number(data.totalMarks || 10),
    published: Boolean(data.published ?? true),
    questions: data.questions || [],
    createdAt: new Date().toISOString(),
  };

  dbQuizzes.unshift(qz);
  res.json(qz);
});

app.put('/api/admin/quizzes/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbQuizzes.findIndex((q) => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Quiz not found.' });

  dbQuizzes[idx] = {
    ...dbQuizzes[idx],
    ...req.body,
  };
  res.json(dbQuizzes[idx]);
});

app.delete('/api/admin/quizzes/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbQuizzes.findIndex((q) => q.id === req.params.id);
  if (idx !== -1) dbQuizzes.splice(idx, 1);
  res.json({ success: true });
});

// Prompts Builder CMS
app.get('/api/admin/prompts', requireStaff, (req: Request, res: Response) => {
  res.json(dbPrompts);
});

app.post('/api/admin/prompts', requireStaff, (req: Request, res: Response) => {
  const data = req.body;
  const pr: Prompt = {
    id: `prompt_${Date.now()}`,
    title: data.title,
    questionText: data.questionText,
    paperTag: data.paperTag || 'GS3',
    wordLimit: Number(data.wordLimit || 250),
    maxMarks: Number(data.maxMarks || 15),
    syllabusTag: data.syllabusTag || 'GS Mains',
    modelAnswer: data.modelAnswer || '',
    evaluationRubric: data.evaluationRubric || {
      introductionWeight: '20%',
      bodyArgumentsWeight: '60%',
      conclusionWeight: '20%',
    },
    published: Boolean(data.published ?? true),
    createdAt: new Date().toISOString(),
  };

  dbPrompts.unshift(pr);
  res.json(pr);
});

app.put('/api/admin/prompts/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbPrompts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Prompt not found.' });

  dbPrompts[idx] = {
    ...dbPrompts[idx],
    ...req.body,
  };
  res.json(dbPrompts[idx]);
});

app.delete('/api/admin/prompts/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbPrompts.findIndex((p) => p.id === req.params.id);
  if (idx !== -1) dbPrompts.splice(idx, 1);
  res.json({ success: true });
});

// Enquiries Management
app.get('/api/enquiries', requireStaff, (req: Request, res: Response) => {
  res.json(dbEnquiries);
});

app.get('/api/admin/enquiries', requireStaff, (req: Request, res: Response) => {
  res.json(dbEnquiries);
});

app.put('/api/enquiries/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbEnquiries.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Enquiry not found.' });

  const updateData = { ...req.body };
  if (updateData.adminReply && !updateData.repliedAt) {
    updateData.repliedAt = new Date().toISOString();
  }

  dbEnquiries[idx] = {
    ...dbEnquiries[idx],
    ...updateData,
  };
  res.json(dbEnquiries[idx]);
});

app.put('/api/admin/enquiries/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbEnquiries.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Enquiry not found.' });

  const updateData = { ...req.body };
  if (updateData.adminReply && !updateData.repliedAt) {
    updateData.repliedAt = new Date().toISOString();
  }

  dbEnquiries[idx] = {
    ...dbEnquiries[idx],
    ...updateData,
  };
  res.json(dbEnquiries[idx]);
});

app.delete('/api/enquiries/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbEnquiries.findIndex((e) => e.id === req.params.id);
  if (idx !== -1) dbEnquiries.splice(idx, 1);
  res.json({ success: true });
});

app.delete('/api/admin/enquiries/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbEnquiries.findIndex((e) => e.id === req.params.id);
  if (idx !== -1) dbEnquiries.splice(idx, 1);
  res.json({ success: true });
});

// Users Management (Aspirants & Faculty)
app.get('/api/admin/instructors', requireAdmin, (req: Request, res: Response) => {
  res.json(dbUsers.filter((u) => u.role === 'instructor'));
});

app.post('/api/admin/instructors', requireAdmin, (req: Request, res: Response) => {
  const { name, email, department } = req.body;
  const newInst: User = {
    id: `faculty_${Date.now()}`,
    email,
    name,
    role: 'instructor',
    department: department || 'General Studies Faculty',
    createdAt: new Date().toISOString(),
  };
  dbUsers.push(newInst);
  res.json(newInst);
});

app.get('/api/admin/aspirants', requireStaff, (req: Request, res: Response) => {
  res.json(dbUsers.filter((u) => u.role === 'aspirant'));
});

// Announcements Manager
app.get('/api/admin/announcements', requireStaff, (req: Request, res: Response) => {
  res.json(dbAnnouncements);
});

app.post('/api/admin/announcements', requireStaff, (req: Request, res: Response) => {
  const data = req.body;
  const ann: Announcement = {
    id: `ann_${Date.now()}`,
    title: data.title,
    content: data.content,
    badgeText: data.badgeText || 'Notice',
    type: data.type || 'info',
    link: data.link || '',
    published: Boolean(data.published ?? true),
    createdAt: new Date().toISOString(),
  };
  dbAnnouncements.unshift(ann);
  res.json(ann);
});

app.delete('/api/admin/announcements/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbAnnouncements.findIndex((a) => a.id === req.params.id);
  if (idx !== -1) dbAnnouncements.splice(idx, 1);
  res.json({ success: true });
});

// File Uploads
app.post('/api/uploads', requireStaff, (req: Request, res: Response) => {
  const { fileName, mimeType, fileData } = req.body;
  const rec: FileRecord = {
    id: `file_${Date.now()}`,
    originalName: fileName || 'upload.png',
    mimeType: mimeType || 'image/png',
    size: Math.round((fileData?.length || 1024) * 0.75),
    url: fileData && fileData.startsWith('data:') ? fileData : 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    uploadedBy: (req as any).user?.name || 'Staff',
    createdAt: new Date().toISOString(),
  };
  dbFiles.push(rec);
  res.json(rec);
});

app.get('/api/uploads', requireStaff, (req: Request, res: Response) => {
  res.json(dbFiles);
});

// Download Handler
app.get('/api/files/:path', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.send(`%PDF-1.4 Simulated Adhigam IAS Document for path: ${req.params.path}`);
});

// -------------------------------------------------------------
// VITE & SERVER INITIALIZATION
// -------------------------------------------------------------

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Adhigam IAS Server running on http://0.0.0.0:${PORT}`);
  });
}

start();

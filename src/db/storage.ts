import fs from 'fs';
import path from 'path';
import type {
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
} from '../types.ts';
import { RISE_49_TEST_SCHEDULE } from '../data/instituteConfig.ts';

export interface DatabaseSchema {
  version: number;
  lastUpdated: string;
  users: User[];
  announcements: Announcement[];
  courses: Course[];
  testSeries: TestSeries[];
  articles: Article[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  prompts: Prompt[];
  writingAttempts: WritingAttempt[];
  enquiries: Enquiry[];
  bookmarks: Bookmark[];
  follows: Follow[];
  files: FileRecord[];
}

// Default storage location for Bluehost & Node.js hosting
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = process.env.DATA_FILE_PATH || path.join(DATA_DIR, 'adhigam_db.json');

// Ensure data directory exists
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (err) {
      console.warn('Could not create data directory:', err);
    }
  }
}

// Generate default seed dataset for first-time launch
export function getInitialSeedData(): DatabaseSchema {
  const users: User[] = [
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

  const announcements: Announcement[] = [
    {
      id: 'ann_rise_2',
      title: 'RISE 2.0 Sociology Optional Test Series (UPSC CSE Mains 2027) Admissions Open!',
      content: 'A structured answer-writing programme for UPSC Civil Services Mains 2027. 49 Tests, 50 Marks/Test, 4 Questions Each. Starts 12 Oct 2026.',
      badgeText: 'ADMISSIONS OPEN',
      type: 'new_batch',
      link: '/test-series',
      published: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ann_schedule',
      title: 'Complete 49-Test Schedule & Model Answer Routine Released',
      content: 'Paper I (Tests 1–22), Paper II (Tests 23–47), and Comprehensive Tests (48–49). Mon • Wed • Fri routine. Copies evaluated within 3 days.',
      badgeText: 'SCHEDULE',
      type: 'info',
      link: '/test-series',
      published: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const courses: Course[] = [];

  const testSeries: TestSeries[] = [
    {
      id: 'ts_rise_2',
      key: 'rise-2-0-sociology-optional',
      title: 'RISE 2.0 – Sociology Optional Test Series',
      subtitle: 'Regular Improvement & Answer Writing Programme for UPSC CSE Mains 2027',
      type: 'mains',
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

  const articles: Article[] = [
    {
      id: 'art_1',
      slug: 'governor-role-constitutional-discretion-supreme-court-rulings',
      title: 'The Office of the Governor: Constitutional Discretion & Supreme Court Guidelines',
      summary: 'A detailed examination of Article 163, Article 200, landmark judgments (S.R. Bommai, Shamsher Singh), and recommendations of Sarkaria & Punchhi Commissions for GS Paper 2.',
      content: `## Context & Background\n\nThe role of the Governor in India's federal structure has frequently surfaced as a focal point of constitutional debates...`,
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
  ];

  const quizzes: Quiz[] = [
    {
      id: 'quiz_1',
      title: 'Daily Prelims Booster: Indian Polity & Constitutional Landmarks',
      description: 'Test your understanding of Fundamental Rights, Directive Principles, and recent Supreme Court judgments.',
      subjectTag: 'Indian Polity',
      paperTag: 'GS1',
      timeLimitMinutes: 10,
      totalMarks: 10,
      published: true,
      questions: [
        {
          id: 'q1',
          questionText: 'Under Article 21 of the Indian Constitution, the Right to Privacy was declared a fundamental right in which landmark judgment?',
          options: [
            'Maneka Gandhi v. Union of India',
            'Justice K.S. Puttaswamy (Retd.) v. Union of India',
            'A.K. Gopalan v. State of Madras',
            'Kesavananda Bharati v. State of Kerala',
          ],
          correctOptionIndex: 1,
          explanation: 'In Justice K.S. Puttaswamy (Retd.) v. Union of India (2017), a nine-judge bench unanimously affirmed that the Right to Privacy is an intrinsic part of the right to life and personal liberty under Article 21.',
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ];

  const prompts: Prompt[] = [
    {
      id: 'prompt_1',
      title: 'Sociology Optional Paper 1: Positivism and its Critique in Sociological Inquiry',
      questionText: 'Critically analyze the positivist approach in sociology. How do anti-positivist and interpretative methodologies counter the claim that social reality can be studied through natural science methods? Illustrate with Weberian and Phenomenological traditions. (20 Marks, 250 Words)',
      paperTag: 'Optional',
      wordLimit: 250,
      maxMarks: 20,
      syllabusTag: 'Paper I - Unit 2: Sociology as Science',
      modelAnswer: `## Model Framework\n\n1. **Introduction:** Define Positivism (Auguste Comte, Émile Durkheim)...\n2. **Core Positivist Assumptions:** Empiricism, social facts as things...\n3. **Anti-Positivist Critiques:** Max Weber (Verstehen), Phenomenology...\n4. **Conclusion:** Contemporary sociology embraces methodological triangulation.`,
      evaluationRubric: {
        introductionWeight: '20% (Conceptual clarity on Comte & Durkheim)',
        bodyArgumentsWeight: '60% (Comparative critique: Verstehen, Hermeneutics, Reflexivity)',
        conclusionWeight: '20% (Synthesis of methodological pluralism)',
      },
      published: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const enquiries: Enquiry[] = [
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
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'enq_2',
      referenceId: 'ADHIGAM-Q-7342',
      name: 'Meera Nambiar',
      email: 'meera.n@yahoo.com',
      phone: '+91 94471 23456',
      telegram: '@meera_soc',
      category: 'Existing Student Discount',
      courseKeyOrTitle: 'RISE 2.0 – Sociology Optional Test Series',
      preferredMode: 'online',
      message: 'I completed the previous edition of RISE. How do I verify my existing student status to avail of the 25% discount fee of ₹6,675?',
      adminReply: 'Verification confirmed! You can complete payment for ₹6,675. Welcome back to RISE 2.0.',
      repliedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'contacted',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'enq_3',
      referenceId: 'ADHIGAM-Q-7343',
      name: 'Devendra Patel',
      email: 'dev.patel99@gmail.com',
      phone: '+91 98250 98765',
      telegram: '@dev_upsc',
      category: 'Evaluation & Test Routine',
      courseKeyOrTitle: 'RISE 2.0 – Sociology Optional Test Series',
      preferredMode: 'online',
      message: 'If I write my answers on UPSC-format ruled paper, scan and send the PDF by 9:00 PM via Telegram (@adhigamias1), will the evaluated copy be returned with line-by-line comments within 3 days?',
      adminReply: 'Yes, exactly! Submit your single scanned PDF by 9:00 PM on test day (Mon/Wed/Fri) via Telegram or email. Evaluated copy with detailed faculty comments is returned within 3 days.',
      repliedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      status: 'resolved',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    users,
    announcements,
    courses,
    testSeries,
    articles,
    quizzes,
    quizAttempts: [],
    prompts,
    writingAttempts: [],
    enquiries,
    bookmarks: [],
    follows: [],
    files: [],
  };
}

// Persistent Database Manager Class
class PersistentStorage {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;
  private isSaving: boolean = false;

  constructor() {
    this.data = this.loadFromDisk();
  }

  // Load from disk or initialize fresh seed
  private loadFromDisk(): DatabaseSchema {
    ensureDataDir();

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        console.log(`[Storage] Loaded persistent database from ${DB_FILE} (Version ${parsed.version || 1})`);
        
        // Ensure all collection arrays exist
        parsed.users = parsed.users || [];
        parsed.announcements = parsed.announcements || [];
        parsed.courses = parsed.courses || [];
        parsed.testSeries = parsed.testSeries || [];
        parsed.articles = parsed.articles || [];
        parsed.quizzes = parsed.quizzes || [];
        parsed.quizAttempts = parsed.quizAttempts || [];
        parsed.prompts = parsed.prompts || [];
        parsed.writingAttempts = parsed.writingAttempts || [];
        parsed.enquiries = parsed.enquiries || [];
        parsed.bookmarks = parsed.bookmarks || [];
        parsed.follows = parsed.follows || [];
        parsed.files = parsed.files || [];

        return parsed;
      } catch (err) {
        console.error(`[Storage] Error reading database file at ${DB_FILE}, regenerating backup:`, err);
      }
    }

    // Initialize with clean seed data
    console.log(`[Storage] Initializing fresh database seed at ${DB_FILE}`);
    const initial = getInitialSeedData();
    this.writeDirect(initial);
    return initial;
  }

  // Synchronous atomic write to disk
  private writeDirect(dataToWrite: DatabaseSchema): void {
    ensureDataDir();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    try {
      const serialized = JSON.stringify(dataToWrite, null, 2);
      fs.writeFileSync(tempFile, serialized, 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('[Storage] Error persisting to disk:', err);
      // Clean up temp file if needed
      if (fs.existsSync(tempFile)) {
        try { fs.unlinkSync(tempFile); } catch {}
      }
    }
  }

  // Request save (debounced to avoid excessive disk I/O on burst requests)
  public save(): void {
    this.data.lastUpdated = new Date().toISOString();
    
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      this.writeDirect(this.data);
      this.saveTimeout = null;
    }, 150);
  }

  // Immediate synchronous save (for critical mutations or shutdown)
  public saveSync(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    this.data.lastUpdated = new Date().toISOString();
    this.writeDirect(this.data);
  }

  // Getters for collections
  public get users(): User[] { return this.data.users; }
  public get announcements(): Announcement[] { return this.data.announcements; }
  public get courses(): Course[] { return this.data.courses; }
  public get testSeries(): TestSeries[] { return this.data.testSeries; }
  public get articles(): Article[] { return this.data.articles; }
  public get quizzes(): Quiz[] { return this.data.quizzes; }
  public get quizAttempts(): QuizAttempt[] { return this.data.quizAttempts; }
  public get prompts(): Prompt[] { return this.data.prompts; }
  public get writingAttempts(): WritingAttempt[] { return this.data.writingAttempts; }
  public get enquiries(): Enquiry[] { return this.data.enquiries; }
  public get bookmarks(): Bookmark[] { return this.data.bookmarks; }
  public get follows(): Follow[] { return this.data.follows; }
  public get files(): FileRecord[] { return this.data.files; }

  // Database metadata & stats
  public getStats() {
    let fileSize = 0;
    try {
      if (fs.existsSync(DB_FILE)) {
        fileSize = fs.statSync(DB_FILE).size;
      }
    } catch {}

    return {
      storageEngine: 'Bluehost Persistent File Database',
      dbFilePath: DB_FILE,
      dataDirectory: DATA_DIR,
      fileSizeBytes: fileSize,
      fileSizeFormatted: `${(fileSize / 1024).toFixed(2)} KB`,
      lastUpdated: this.data.lastUpdated,
      counts: {
        users: this.data.users.length,
        testSeries: this.data.testSeries.length,
        enquiries: this.data.enquiries.length,
        announcements: this.data.announcements.length,
        articles: this.data.articles.length,
        quizzes: this.data.quizzes.length,
        prompts: this.data.prompts.length,
        writingAttempts: this.data.writingAttempts.length,
        quizAttempts: this.data.quizAttempts.length,
      },
    };
  }

  // Export full database as object
  public exportData(): DatabaseSchema {
    return JSON.parse(JSON.stringify(this.data));
  }

  // Import / restore database
  public importData(newData: Partial<DatabaseSchema>): void {
    if (!newData || typeof newData !== 'object') {
      throw new Error('Invalid database format for import.');
    }

    this.data = {
      version: newData.version || 1,
      lastUpdated: new Date().toISOString(),
      users: Array.isArray(newData.users) ? newData.users : this.data.users,
      announcements: Array.isArray(newData.announcements) ? newData.announcements : this.data.announcements,
      courses: Array.isArray(newData.courses) ? newData.courses : this.data.courses,
      testSeries: Array.isArray(newData.testSeries) ? newData.testSeries : this.data.testSeries,
      articles: Array.isArray(newData.articles) ? newData.articles : this.data.articles,
      quizzes: Array.isArray(newData.quizzes) ? newData.quizzes : this.data.quizzes,
      quizAttempts: Array.isArray(newData.quizAttempts) ? newData.quizAttempts : this.data.quizAttempts,
      prompts: Array.isArray(newData.prompts) ? newData.prompts : this.data.prompts,
      writingAttempts: Array.isArray(newData.writingAttempts) ? newData.writingAttempts : this.data.writingAttempts,
      enquiries: Array.isArray(newData.enquiries) ? newData.enquiries : this.data.enquiries,
      bookmarks: Array.isArray(newData.bookmarks) ? newData.bookmarks : this.data.bookmarks,
      follows: Array.isArray(newData.follows) ? newData.follows : this.data.follows,
      files: Array.isArray(newData.files) ? newData.files : this.data.files,
    };

    this.saveSync();
  }
}

// Export singleton instance
export const db = new PersistentStorage();

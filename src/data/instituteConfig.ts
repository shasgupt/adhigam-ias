export interface InstituteContact {
  email: string;
  telegram: string;
  telegramLink: string;
  website: string;
}

export interface ProgrammeTier {
  id: string;
  title: string;
  badge?: string;
  amount: number;
  formattedAmount: string;
  note?: string;
  discountNote?: string;
  validityNote?: string;
  popular?: boolean;
}

export interface TestDayRoutineStep {
  time: string;
  action: string;
  detail: string;
}

export interface ScheduleItem {
  testNumber: number;
  date: string;
  day: 'Monday' | 'Wednesday' | 'Friday';
  coverage: string;
  paper: 'Paper I' | 'Paper II' | 'Comprehensive';
  section: string;
}

export interface InstituteConfig {
  name: string;
  brandCode: string;
  tagline: string;
  motto: string;
  subtitle: string;
  secondaryTagline: string;
  programmeName: string;
  examTarget: string;
  duration: string;
  version?: string;
  totalTests: number;
  marksPerTest: number;
  questionsPerTest: string;
  questionPattern: string;
  schedulePattern: string;
  submissionMethod: string;
  submissionCutoff: string;
  modelAnswerTime: string;
  evaluationTurnaround: string;

  contact: InstituteContact;

  riseWhy: string;
  riseWhySubtext: string;
  risePracticePromise: string[];

  testDayRoutine: TestDayRoutineStep[];
  routineRule: string;

  pricingTiers: ProgrammeTier[];

  aboutText: string;
  visionText: string;
  missionText: string;
  umbrellaOverview: string;
  ecosystemPillars: {
    title: string;
    description: string;
    badge?: string;
  }[];
}

export const INSTITUTE_CONFIG: InstituteConfig = {
  name: "ADHIGAM IAS",
  brandCode: "adhigam_ias",
  tagline: "Driven by Discipline, Fueled by Knowledge",
  motto: "Learn • Practice • Improve • Serve",
  subtitle: "REGULAR IMPROVEMENT IN SOCIOLOGY EXPRESSION",
  secondaryTagline: "PRACTISE WITH PURPOSE • ANALYSE WITH CLARITY • IMPROVE WITH EVERY TEST",
  programmeName: "RISE 2.0 - SOCIOLOGY OPTIONAL TEST SERIES",
  examTarget: "A structured answer-writing programme for UPSC Civil Services Mains 2027",
  duration: "12 October 2026 – 31 January 2027",
  version: "v2.4.0",
  totalTests: 49,
  marksPerTest: 50,
  questionsPerTest: "4 Questions Each",
  questionPattern: "10-mark and 20-mark questions",
  schedulePattern: "Monday, Wednesday and Friday",
  submissionMethod: "Scanned answer copy as a single PDF via Telegram or email",
  submissionCutoff: "By 9:00 PM on test day",
  modelAnswerTime: "Released at 9:00 PM on the test day",
  evaluationTurnaround: "Evaluated copy returned within 3 days of submission",

  contact: {
    email: "adhigamias@gmail.com",
    telegram: "@adhigamias1",
    telegramLink: "https://t.me/adhigamias1",
    website: "https://adhigamiasacademy.com/",
  },

  riseWhy:
    "The first edition of RISE was completed successfully. Continued interest from aspirants has encouraged us to bring back the programme as RISE 2.0—with a more structured practice cycle for Sociology Optional.",
  riseWhySubtext:
    "Sociology rewards more than recall. It asks you to connect concepts, thinkers and examples, build an argument, and express it with precision. RISE 2.0 makes that practice regular, purposeful and feedback-led.",

  risePracticePromise: [
    "A steady answer-writing routine instead of last-minute practice",
    "Planned coverage of Paper I and Paper II",
    "Practice in applying thinkers, concepts and sociological perspectives",
    "Model answers to review structure and analytical approach",
    "Evaluation to identify specific areas for improvement",
    "Comprehensive tests to bring preparation together",
  ],

  testDayRoutine: [
    {
      time: "6:00 PM",
      action: "Question paper is released",
      detail: "Accessible via Telegram channel and registered aspirant portal.",
    },
    {
      time: "By 9:00 PM",
      action: "Submit scanned answer PDF",
      detail: "Submit through Telegram (@adhigamias1) or official email (adhigamias@gmail.com).",
    },
    {
      time: "9:00 PM",
      action: "Model answer is released",
      detail: "Detailed model answer breakdown to review analytical framework and thinker links.",
    },
    {
      time: "Within 3 days",
      action: "Evaluated answer copy returned",
      detail: "Personalized line-by-line faculty evaluated copy returned with actionable scoring remarks.",
    },
  ],

  routineRule:
    "Write → Scan → Combine into one PDF → Submit by 9:00 PM. Timely submission is necessary for the evaluation cycle.",

  pricingTiers: [
    {
      id: "standard",
      title: "Programme Fee",
      amount: 8900,
      formattedAmount: "₹8,900",
      note: "Standard fee for complete 49-test series & evaluations",
      validityNote: "Full access through 31 January 2027",
    },
    {
      id: "early_bird",
      title: "EARLY BIRD Offer",
      badge: "Limited Period Offer",
      amount: 7650,
      formattedAmount: "₹7,650",
      validityNote: "Valid through 9 October 2026",
      note: "Special discount for early registrations before batch launch",
      popular: true,
    },
    {
      id: "existing_student",
      title: "ADHIGAM STUDENTS",
      badge: "25% Special Privilege",
      amount: 6675,
      formattedAmount: "₹6,675",
      discountNote: "25% discount on launch price (-₹2,225)",
      note: "The existing-student fee is calculated as a 25% discount on the launch price. Early bird and existing-student fees are separate categories.",
    },
  ],

  aboutText:
    "ADHIGAM IAS is a premier institution dedicated to structured, disciplined Civil Services preparation. Rooted in academic rigor and ethical governance, Adhigam IAS provides holistic guidance across Optional subjects, General Studies, and structured answer-writing methodologies.",
  visionText:
    "To build analytical clarity, disciplined answer articulation, and sociological mastery for high-scoring UPSC Mains execution across all aspirants.",
  missionText:
    "To help aspirants transition from passive reading to active expression through purposeful, regular, and feedback-led writing.",
  umbrellaOverview:
    "ADHIGAM IAS provides structured academic guidance and comprehensive curriculum offerings for UPSC Civil Services excellence. Our flagship RISE 2.0 Sociology Optional Test Series is currently open for enrolment. Additional foundation courses, optional subjects, and mentorship modules will be announced as authorized by the academic directorate.",

  ecosystemPillars: [],
};

export const instituteConfig = INSTITUTE_CONFIG;

// The official 49-test schedule from ADHIGAM IAS RISE 2.0 document
export const RISE_49_TEST_SCHEDULE: ScheduleItem[] = [
  // PAPER I | FUNDAMENTALS OF SOCIOLOGY (Tests 1 to 22)
  { testNumber: 1, date: "12 Oct 2026", day: "Monday", coverage: "Sociology – The Discipline", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 2, date: "14 Oct 2026", day: "Wednesday", coverage: "Sociology – The Discipline", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 3, date: "16 Oct 2026", day: "Friday", coverage: "Sociology as Science", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 4, date: "19 Oct 2026", day: "Monday", coverage: "Sociology as Science", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 5, date: "21 Oct 2026", day: "Wednesday", coverage: "Research Methods and Analysis", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 6, date: "23 Oct 2026", day: "Friday", coverage: "Sociological Thinkers", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 7, date: "26 Oct 2026", day: "Monday", coverage: "Sociological Thinkers", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 8, date: "28 Oct 2026", day: "Wednesday", coverage: "Sociological Thinkers", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 9, date: "30 Oct 2026", day: "Friday", coverage: "Stratification and Mobility", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 10, date: "02 Nov 2026", day: "Monday", coverage: "Stratification and Mobility", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 11, date: "04 Nov 2026", day: "Wednesday", coverage: "Stratification and Mobility", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 12, date: "06 Nov 2026", day: "Friday", coverage: "Works and Economic Life", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 13, date: "09 Nov 2026", day: "Monday", coverage: "Works and Economic Life", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 14, date: "11 Nov 2026", day: "Wednesday", coverage: "Politics and Society", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 15, date: "13 Nov 2026", day: "Friday", coverage: "Politics and Society", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 16, date: "16 Nov 2026", day: "Monday", coverage: "Religion and Society", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 17, date: "18 Nov 2026", day: "Wednesday", coverage: "Religion and Society", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 18, date: "20 Nov 2026", day: "Friday", coverage: "Systems of Kinship", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 19, date: "23 Nov 2026", day: "Monday", coverage: "Systems of Kinship", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 20, date: "25 Nov 2026", day: "Wednesday", coverage: "Social Change in Modern Society", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 21, date: "27 Nov 2026", day: "Friday", coverage: "Social Change in Modern Society", paper: "Paper I", section: "Paper I: Fundamentals" },
  { testNumber: 22, date: "30 Nov 2026", day: "Monday", coverage: "Paper I Comprehensive Test", paper: "Paper I", section: "Paper I: Comprehensive" },

  // PAPER II | INDIAN SOCIETY: STRUCTURE & CHANGE (Tests 23 to 47)
  { testNumber: 23, date: "02 Dec 2026", day: "Wednesday", coverage: "Introducing Indian Society", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 24, date: "04 Dec 2026", day: "Friday", coverage: "Introducing Indian Society", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 25, date: "07 Dec 2026", day: "Monday", coverage: "Impact of Colonial Rule", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 26, date: "09 Dec 2026", day: "Wednesday", coverage: "Impact of Colonial Rule", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 27, date: "11 Dec 2026", day: "Friday", coverage: "Rural and Agrarian Social Structure", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 28, date: "14 Dec 2026", day: "Monday", coverage: "Caste System", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 29, date: "16 Dec 2026", day: "Wednesday", coverage: "Tribal Communities in India", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 30, date: "18 Dec 2026", day: "Friday", coverage: "Social Classes in India", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 31, date: "21 Dec 2026", day: "Monday", coverage: "Systems of Kinship in India", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 32, date: "23 Dec 2026", day: "Wednesday", coverage: "Systems of Kinship in India", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 33, date: "25 Dec 2026", day: "Friday", coverage: "Religion and Society", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 34, date: "28 Dec 2026", day: "Monday", coverage: "Religion and Society", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 35, date: "30 Dec 2026", day: "Wednesday", coverage: "Visions of Social Change", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 36, date: "01 Jan 2027", day: "Friday", coverage: "Rural and Agrarian Transformation", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 37, date: "04 Jan 2027", day: "Monday", coverage: "Rural and Agrarian Transformation", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 38, date: "06 Jan 2027", day: "Wednesday", coverage: "Rural and Agrarian Transformation", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 39, date: "08 Jan 2027", day: "Friday", coverage: "Industrialization and Urbanisation", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 40, date: "11 Jan 2027", day: "Monday", coverage: "Industrialization and Urbanisation", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 41, date: "13 Jan 2027", day: "Wednesday", coverage: "Politics and Society", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 42, date: "15 Jan 2027", day: "Friday", coverage: "Social Movements in Modern India", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 43, date: "18 Jan 2027", day: "Monday", coverage: "Social Movements in Modern India", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 44, date: "20 Jan 2027", day: "Wednesday", coverage: "Population Dynamics", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 45, date: "22 Jan 2027", day: "Friday", coverage: "Challenges of Social Transformation", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 46, date: "25 Jan 2027", day: "Monday", coverage: "Challenges of Social Transformation", paper: "Paper II", section: "Paper II: Indian Society" },
  { testNumber: 47, date: "27 Jan 2027", day: "Wednesday", coverage: "Paper II Comprehensive Test", paper: "Paper II", section: "Paper II: Comprehensive" },

  // FINAL COMPREHENSIVE TESTS (Tests 48 to 49)
  { testNumber: 48, date: "29 Jan 2027", day: "Friday", coverage: "Paper I – Final Comprehensive", paper: "Comprehensive", section: "Final Comprehensive Tests" },
  { testNumber: 49, date: "29 Jan 2027", day: "Friday", coverage: "Paper II – Final Comprehensive", paper: "Comprehensive", section: "Final Comprehensive Tests" },
];

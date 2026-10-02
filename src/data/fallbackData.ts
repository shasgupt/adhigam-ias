import { Announcement, Course, TestSeries, Article, Quiz, Prompt } from '../types';
import { RISE_49_TEST_SCHEDULE, INSTITUTE_CONFIG } from './instituteConfig';

export const fallbackAnnouncements: Announcement[] = [
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
    link: '/test-series#fees',
    published: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// No dummy academic offerings per user instruction
export const fallbackCourses: Course[] = [];

// The official Test Series: RISE 2.0
export const fallbackTestSeries: TestSeries[] = [
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

export const fallbackArticles: Article[] = [
  {
    id: 'art_soc_1',
    slug: 'sociological-thinkers-interlinkages-paper-1-paper-2',
    title: 'Connecting Sociological Thinkers: Interlinking Paper I Concepts with Indian Society (Paper II)',
    paperTag: 'GS1',
    category: 'strategy',
    summary: 'A high-scoring strategy guide on applying classical thinkers (Marx, Weber, Durkheim, Mead) to analyse Indian caste, agrarian transformation, and social movements.',
    content: `Sociology rewards more than recall. It asks you to connect concepts, thinkers, and examples, build an argument, and express it with precision.

In Paper I, you establish conceptual foundations:
- Emile Durkheim's Division of Labour, Social Facts, and Religion.
- Max Weber's Social Action, Bureaucracy, and Ideal Types.
- Karl Marx's Historical Materialism and Class Conflict.

In Paper II, the challenge is contextual application:
- Analyzing Caste through Louis Dumont's Homo Hierarchicus vs. M.N. Srinivas' Dominant Caste.
- Examining Agrarian Social Structure using Marxist and Weberian stratification frameworks.
- Evaluating contemporary social movements through Alain Touraine and Habermas.

RISE 2.0 instills this regular analytical synthesis across all 49 tests.`,
    author: 'ADHIGAM IAS Sociology Faculty',
    readTime: '5 Min Read',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    published: true,
    keyTakeaways: [
      'Avoid generic GS-style answers; weave thinkers seamlessly into every 10-mark and 20-mark response.',
      'Always balance theoretical arguments with empirical Indian realities.',
      'Adhere strictly to the 4-question, 50-mark discipline within the 9:00 PM submission window.',
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const fallbackQuizzes: Quiz[] = [];

export const fallbackPrompts: Prompt[] = [
  {
    id: 'prompt_soc_1',
    title: 'Sociology Optional (Paper I): Sociology as Science & Positivist Critique',
    paperTag: 'GS1',
    maxMarks: 20,
    wordLimit: 250,
    syllabusTag: 'Sociology as Science',
    modelAnswer:
      'Structure: 1. Introduction: Define Positivism in early sociology (Comte, Durkheim). 2. Anti-positivist critique: Weberian Verstehen, phenomenological critique (Schutz), Frankfurt School. 3. Contemporary view: Post-positivism, reflexivity (Giddens, Bourdieu). 4. Conclusion: Sociology as an interpretive science with rigorous methodological pluralism.',
    evaluationRubric: {
      introductionWeight: '20% - Clear definition of positivist orthodoxy',
      bodyArgumentsWeight: '60% - Rigorous thinker debate (Durkheim vs Weber vs Schutz)',
      conclusionWeight: '20% - Synthesis on modern sociological reflexivity',
    },
    questionText:
      '"Is Sociology a Science?" Critically examine the positivist claims of objectivity and quantify the key methodological critiques offered by non-positivist traditions. (20 Marks, 250 Words)',
    published: true,
    createdAt: new Date().toISOString(),
  },
];

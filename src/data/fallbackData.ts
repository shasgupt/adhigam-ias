import { Announcement, Course, TestSeries, Article, Quiz, Prompt } from '../types';

export const fallbackAnnouncements: Announcement[] = [
  {
    id: 'ann_1',
    title: 'UPSC CSE 2026 GS Foundation Batch-IV Admissions Open!',
    content: 'Comprehensive Coverage of Prelims & Mains GS 1-4 with Weekly Mains Answer Writing. Offline at Old Rajinder Nagar & Live Interactive Online.',
    badgeText: 'New Batch',
    type: 'new_batch',
    link: '/courses/gs-foundation-2026',
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ann_2',
    title: 'All-India Prelims Mock Test Series (AIPMTS) 2026 Schedule Released',
    content: '32 Comprehensive Mock Tests with All-India Ranking, detailed video solutions, and AI performance diagnosis.',
    badgeText: 'Test Series',
    type: 'event',
    link: '/test-series/prelims-aipmts-2026',
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const fallbackCourses: Course[] = [
  {
    id: 'course_1',
    key: 'gs-foundation-2026',
    title: 'GS Integrated Foundation Program (Prelims-cum-Mains) 2026',
    subtitle: '10-Month Rigorous Classroom & Online Training for UPSC CSE 2026',
    category: 'gs_foundation',
    mode: 'hybrid',
    duration: '10 Months (800+ Hours)',
    startDate: '15th August 2026',
    fee: '₹1,15,000 + GST',
    featured: true,
    published: true,
    description: 'Adhigam IAS flagship foundation program designed to build conceptual clarity from NCERT fundamentals up to advanced UPSC Mains analytical synthesis.',
    overview: [
      'Comprehensive coverage of GS Papers I, II, III, IV and Essay Writing.',
      'Daily Current Affairs integration with The Hindu, Indian Express, and Yojana.',
      'Weekly Prelims Practice Quizzes and Mains Answer Writing with Faculty Review.',
      'Personalized 1-on-1 Mentorship by experienced IAS/IPS interview candidates.',
    ],
    features: [
      'Printed Reference Workbooks & Class Notes shipped to your home.',
      '24/7 Access to Recorded High-Definition Lectures.',
      'Dedicated Doubt Clearance Cells and Weekly Live Interactive QA Sessions.',
      'Complimentary access to All India Prelims & Mains Test Series.',
    ],
    syllabusModules: [
      {
        title: 'Module 1: Modern Indian History & World History',
        topics: ['Freedom Struggle & Socio-Religious Movements', 'Post-Independence Consolidation', 'World Wars & Decolonization'],
      },
      {
        title: 'Module 2: Indian Polity, Governance & Constitution',
        topics: ['Preamble, Fundamental Rights & Duties', 'Executive, Legislature & Judiciary', 'Federalism & Local Self Government'],
      },
      {
        title: 'Module 3: Indian Economy & Sustainable Development',
        topics: ['Macroeconomic Trends & Fiscal Policy', 'Agriculture, Land Reforms & Food Processing', 'Infrastructure, Energy & Trade'],
      },
      {
        title: 'Module 4: Environment, Ecology & Science Tech',
        topics: ['Biodiversity Conservation & Climate Change', 'Space, Biotech, Nanotech & AI', 'Disaster Management Frameworks'],
      },
    ],
    facultyNames: ['Dr. Virendra Sharma', 'Prof. Ananya Roy', 'Dr. Rajesh Sharma'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'course_2',
    key: 'mains-masterclass-2026',
    title: 'Mains Answer Writing & Enrichment Program (MAWP) 2026',
    subtitle: 'Master GS 1, 2, 3, 4 & Essay through 500+ Model Questions and Instant AI + Faculty Feedback',
    category: 'mains_special',
    mode: 'online',
    duration: '4 Months Intensive',
    startDate: '1st September 2026',
    fee: '₹28,500 + GST',
    featured: true,
    published: true,
    description: 'Specialized Mains scoring acceleration course focused on answer structuring, diagramming, value addition, case studies, and faculty evaluations.',
    overview: [
      'Structure-first approach: Intro framing, body arguments with statistics/maps, crisp conclusion.',
      'Ethics GS-4 Case Study workshop with ethical frameworks and quote integration.',
      'Essay writing module covering Philosophy, Social Issues, and Science-Tech prompts.',
    ],
    features: [
      'Daily 2 Mains Questions with Model Answers and Line-by-Line Faculty Review.',
      'On-demand AI Instant Structural Critique before final faculty review.',
      'Curated Value Addition Folders with Keywords, Quotations & Committee Reports.',
    ],
    syllabusModules: [
      {
        title: 'Module 1: GS-1 Culture, Society & Geography',
        topics: ['Art Architecture Terminology', 'Social Issues, Urbanization & Women Issues', 'Geophysical Phenomena & Resource Distribution'],
      },
      {
        title: 'Module 2: GS-2 Polity, Governance & IR',
        topics: ['Constitutional Comparison & Judgments', 'E-Governance, Transparency & Citizen Charters', 'Global Alliances, IOR Strategy & Quad'],
      },
      {
        title: 'Module 3: GS-3 Economy, Agri & Security',
        topics: ['Inclusive Growth, Budgeting & Subsidies', 'Internal Security, Cyber Warfare & Border Management', 'Climate Change COP Targets & Renewable Energy'],
      },
      {
        title: 'Module 4: GS-4 Ethics, Integrity & Aptitude',
        topics: ['Human Values & Moral Thinkers', 'Attitude, Emotional Intelligence & Foundational Values', 'Case Studies in Administration & Governance'],
      },
    ],
    facultyNames: ['Prof. Ananya Roy', 'Dr. Rajesh Sharma'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'course_3',
    key: 'optional-public-admin-2026',
    title: 'Public Administration Optional Masterclass 2026',
    subtitle: 'Complete Paper 1 & Paper 2 Coverage with Administrative Thinker Interlinkages',
    category: 'optional',
    mode: 'hybrid',
    duration: '5 Months (300+ Hours)',
    startDate: '10th September 2026',
    fee: '₹42,000 + GST',
    featured: true,
    published: true,
    description: 'Comprehensive Public Administration optional coaching by former civil servants, ensuring 300+ score potential.',
    overview: [
      'In-depth analysis of Paper 1 (Administrative Theory) and Paper 2 (Indian Administration).',
      'Integration of ARC Reports, Punchhi Commission, and contemporary administrative cases.',
      '12 Optional Unit Tests with detailed evaluated answer scripts.',
    ],
    features: [
      'Mind maps for all administrative thinkers (Taylor, Weber, Simon, Waldo, Riggs).',
      'Dedicated Answer Writing Workbooks for Paper 1 and Paper 2.',
    ],
    syllabusModules: [
      {
        title: 'Module 1: Administrative Thought & Theories',
        topics: ['Scientific Management & Bureaucratic Model', 'Human Relations & Behavioral Approach', 'Development Administration & New Public Management'],
      },
      {
        title: 'Module 2: Indian Administration & District Governance',
        topics: ['Evolution of Indian Admin from Kautilya to British', 'Union & State Executive Structure', 'District Collectorate Reforms & Local Bodies'],
      },
    ],
    facultyNames: ['Prof. Ananya Roy (Ex-Civil Servant)'],
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

export const fallbackTestSeries: TestSeries[] = [
  {
    id: 'ts_1',
    key: 'prelims-aipmts-2026',
    title: 'All-India Prelims Mock Test Series (AIPMTS) 2026',
    category: 'prelims',
    totalTests: 32,
    startDate: '20th August 2026',
    fee: '₹12,500 + GST',
    published: true,
    description: '32 Comprehensive Mock Tests mimicking exact UPSC Prelims pattern with All-India Ranking and AI Diagnostic Analytics.',
    schedule: [
      { testNumber: 1, title: 'Polity & Constitution Fundamental Rights to Judiciary', date: '20 Aug 2026', syllabus: 'Preamble, FRs, DPs, Parliament, Judiciary' },
      { testNumber: 2, title: 'Modern History & Freedom Struggle 1857 to 1947', date: '27 Aug 2026', syllabus: 'Revolt of 1857, INC sessions, Gandhian Movements, Partition' },
      { testNumber: 3, title: 'Indian Economy Fiscal Policy, Banking & Agri', date: '03 Sep 2026', syllabus: 'RBI Monetary Policy, Inflation, Budget 2026, WTO, Agriculture' },
      { testNumber: 4, title: 'Full Length Test #1 (General Studies Paper 1)', date: '10 Sep 2026', syllabus: 'Complete UPSC CSE Prelims GS Syllabus' },
    ],
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: 'ts_2',
    key: 'mains-aimts-2026',
    title: 'All-India Mains Simulator Test Series (AIMTS) 2026',
    category: 'mains',
    totalTests: 16,
    startDate: '5th October 2026',
    fee: '₹22,000 + GST',
    published: true,
    description: 'Full-length 3-hour UPSC Mains examination simulation with detailed 24-hour faculty evaluated copy returns.',
    schedule: [
      { testNumber: 1, title: 'GS Paper 1 Full Length Mock Test', date: '05 Oct 2026', syllabus: 'History, Society, Geography' },
      { testNumber: 2, title: 'GS Paper 2 Full Length Mock Test', date: '12 Oct 2026', syllabus: 'Polity, Governance, IR' },
      { testNumber: 3, title: 'GS Paper 3 Full Length Mock Test', date: '19 Oct 2026', syllabus: 'Economy, Agri, Env, Sci-Tech, Security' },
      { testNumber: 4, title: 'GS Paper 4 Ethics & Case Studies Mock', date: '26 Oct 2026', syllabus: 'Ethics, Integrity & 6 Administrative Case Studies' },
    ],
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
  },
];

export const fallbackArticles: Article[] = [
  {
    id: 'art_1',
    title: 'Constitutional Discretion of the Governor vs. Democratic Federalism',
    paperTag: 'GS Paper 2',
    category: 'editorial',
    summary: 'An in-depth analytical breakdown of Article 163, 200, and recent Supreme Court rulings regarding Governor assent on state legislative bills.',
    content: 'The role of the Governor in India’s federal polity has re-emerged as a focal point of constitutional discourse. Article 163 outlines the discretionary powers of the Governor, while Article 200 deals with assent to bills passed by the state legislature...',
    author: 'Prof. Ananya Roy',
    readTime: '6 Min Read',
    publishedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    published: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'art_2',
    title: 'Sponge Cities & Nature-Based Solutions for Urban Flood Resiliency',
    paperTag: 'GS Paper 3',
    category: 'environment',
    summary: 'Examining urban hydrology, permeable pavements, wetland restoration, and NDMA guidelines to tackle recurring monsoon urban flooding.',
    content: 'Urban flooding in major Indian metropolises highlight the vulnerabilities of rapid concrete expansion. The concept of Sponge Cities integrates permeable surfaces, rain gardens, and flood retention basins...',
    author: 'Dr. Rajesh Sharma',
    readTime: '8 Min Read',
    publishedDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const fallbackQuizzes: Quiz[] = [
  {
    id: 'quiz_1',
    title: 'Daily Prelims Mini Mock: Indian Polity & Governance',
    subjectTag: 'Polity',
    totalQuestions: 5,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'q1_1',
        questionText: 'Which of the following statements regarding the Writ Jurisdiction of Supreme Court vs High Court is correct?',
        options: [
          'Supreme Court writ jurisdiction under Article 32 is wider than High Court under Article 226.',
          'High Court can issue writs for enforcement of Fundamental Rights as well as ordinary legal rights.',
          'A citizen cannot directly approach the Supreme Court without approaching the High Court first.',
          'Neither Court can issue writs against administrative tribunals.',
        ],
        correctOptionIndex: 1,
        explanation: 'Under Article 226, High Courts can issue writs not only for Fundamental Rights but also "for any other purpose" (ordinary legal rights), making its writ jurisdiction wider than Article 32.',
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const fallbackPrompts: Prompt[] = [
  {
    id: 'prompt_1',
    title: 'Impact of AI on Electoral Integrity & Constitutional Rights',
    paperTag: 'GS Paper 2',
    maxMarks: 15,
    wordLimit: 250,
    questionText: '"The proliferation of deepfakes and generative AI threatens electoral integrity and democratic deliberation." Discuss in the context of Indian elections and suggest regulatory safeguards without compromising Freedom of Speech.',
    keyPointsHint: [
      'Identify key threats: Micro-targeting, misinformation, deepfake videos, voter suppression.',
      'Constitutional provisions: Article 19(1)(a) vs Article 19(2) reasonable restrictions.',
      'ECI Guidelines & Model Code of Conduct application to social media AI content.',
      'Way forward: Digital forensics, watermarking, voter awareness, IT Rules 2021 enforcement.',
    ],
    createdAt: new Date().toISOString(),
  },
];

export type Role = 'admin' | 'instructor' | 'aspirant';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  avatar?: string;
  createdAt: string;
  department?: string; // For instructors (e.g. GS Paper 2, Polity, Economy)
  targetYear?: string; // For aspirants (e.g. UPSC CSE 2026)
  optionalSubject?: string; // For aspirants (e.g. Public Administration, Sociology)
}

export interface Announcement {
  id: string;
  title: string;
  content?: string;
  message?: string;
  badgeText?: string;
  type?: 'info' | 'urgent' | 'event' | 'new_batch';
  link?: string;
  linkUrl?: string;
  published: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  category: 'gs_foundation' | 'mains_special' | 'csat' | 'optional' | 'interview' | 'prelims_booster';
  mode: 'offline' | 'online' | 'hybrid';
  duration?: string;
  startDate?: string;
  fee: string;
  featured?: boolean;
  published?: boolean;
  description: string;
  overview?: string[];
  features?: string[];
  syllabusModules?: {
    title: string;
    topics: string[];
  }[];
  facultyNames?: string[];
  image?: string;
  createdAt?: string;
}

export interface TestSeriesScheduleItem {
  testNumber: number;
  title: string;
  date: string;
  day?: string;
  paper?: 'Paper I' | 'Paper II' | 'Comprehensive';
  subjectTag?: string;
  syllabus?: string;
}

export interface TestSeries {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  type: 'prelims' | 'mains' | 'integrated' | 'optional';
  totalTests: number;
  featured?: boolean;
  published?: boolean;
  fee: string;
  earlyBirdFee?: string;
  existingStudentFee?: string;
  earlyBirdDeadline?: string;
  startDate?: string;
  endDate?: string;
  mode: 'online' | 'offline' | 'hybrid';
  description: string;
  schedule?: TestSeriesScheduleItem[];
  image?: string;
  createdAt?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: 'editorial' | 'pib_summary' | 'current_affairs' | 'yojana_gist' | 'strategy' | 'syllabus_breakdown';
  paperTag: 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay';
  syllabusTopics?: string[];
  author?: string;
  published?: boolean;
  publishedAt?: string;
  readTime?: string;
  image?: string;
  keyTakeaways?: string[];
  createdAt?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number; // 0-based
  explanation: string;
  subTopic?: string;
}

export type Question = QuizQuestion;

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  subjectTag: string;
  paperTag?: 'GS1' | 'GS2' | 'GS3' | 'CSAT';
  timeLimitMinutes: number;
  totalMarks?: number;
  totalQuestions?: number;
  questions?: QuizQuestion[];
  published?: boolean;
  createdAt?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle?: string;
  aspirantId?: string;
  aspirantName?: string;
  userAnswers?: Record<string, number>; // questionId -> optionIndex
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount?: number;
  timeTakenSeconds?: number;
  completedAt?: string;
  createdAt?: string;
}

export interface Prompt {
  id: string;
  title: string;
  questionText: string;
  paperTag: 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay' | 'Optional';
  wordLimit: number;
  maxMarks: number;
  syllabusTag: string;
  modelAnswer: string;
  evaluationRubric: {
    introductionWeight: string;
    bodyArgumentsWeight: string;
    conclusionWeight: string;
  };
  published: boolean;
  createdAt: string;
}

export interface WritingAttempt {
  id: string;
  promptId: string;
  promptTitle: string;
  paperTag: string;
  aspirantId: string;
  aspirantName: string;
  aspirantEmail: string;
  answerText?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'reviewed';
  submittedAt?: string;
  review?: {
    facultyId?: string;
    facultyName?: string;
    reviewerName?: string;
    reviewedAt: string;
    marksObtained?: number;
    scoreAwarded?: number;
    maxMarks: number;
    structureFeedback?: string;
    contentFeedback?: string;
    languageFeedback?: string;
    overallComments?: string;
    generalComments?: string;
    modelComparisonNotes?: string;
    strengths?: string[];
    improvements?: string[];
    isAiEvaluated?: boolean;
  };
  aiEvaluation?: {
    marksObtained: number;
    maxMarks: number;
    strengths: string[];
    improvements: string[];
    detailedAnalysis: string;
    evaluatedAt: string;
  };
  createdAt: string;
}

export interface Enquiry {
  id: string;
  referenceId?: string;
  name: string;
  email: string;
  phone: string;
  telegram?: string;
  category?: string;
  courseKeyOrTitle?: string;
  preferredMode?: 'online' | 'offline' | 'hybrid';
  message: string;
  status: 'new' | 'contacted' | 'in_review' | 'resolved' | 'enrolled' | 'closed';
  notes?: string;
  adminReply?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  aspirantId: string;
  itemType: 'article' | 'quiz' | 'prompt' | 'course';
  itemId: string;
  title: string;
  metaTag?: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  aspirantId: string;
  itemType: 'course' | 'test_series';
  itemId: string;
  title: string;
  createdAt: string;
}

export interface FileRecord {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  createdAt: string;
}

export interface AdminStats {
  totalAspirants: number;
  totalCourses: number;
  totalTestSeries: number;
  totalArticles: number;
  totalQuizzes: number;
  totalPrompts: number;
  totalWritingAttempts: number;
  pendingReviewsCount: number;
  totalEnquiries: number;
  newEnquiriesCount: number;
}

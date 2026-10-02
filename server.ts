import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
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
import { db } from './src/db/storage';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.static(path.join(process.cwd(), 'public')));

// Explicit Source Code Download Route
app.get('/api/download-code', (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'adhigam-ias-code.zip');
  res.download(filePath, 'adhigam-ias-source-code.zip', (err) => {
    if (err) {
      console.error('Download error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Could not download source code archive.' });
      }
    }
  });
});

app.get('/api/download-code-tar', (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'adhigam-ias-code.tar.gz');
  res.download(filePath, 'adhigam-ias-source-code.tar.gz');
});

app.get('/api/download-code-base64', (req: Request, res: Response) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'adhigam-ias-code.zip');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Zip file not found' });
    }
    const buffer = fs.readFileSync(filePath);
    res.json({
      filename: 'adhigam-ias-source-code.zip',
      base64: buffer.toString('base64'),
      size: buffer.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to read zip file.' });
  }
});

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
// Persistent Database (Bluehost-compatible disk persistence)
// -------------------------------------------------------------
const dbUsers = db.users;
const dbAnnouncements = db.announcements;
const dbCourses = db.courses;
const dbTestSeries = db.testSeries;
const dbArticles = db.articles;
const dbQuizzes = db.quizzes;
const dbQuizAttempts = db.quizAttempts;
const dbPrompts = db.prompts;
const dbWritingAttempts = db.writingAttempts;
const dbEnquiries = db.enquiries;
const dbBookmarks = db.bookmarks;
const dbFollows = db.follows;
const dbFiles = db.files;

// Pre-create initial active sessions for seamless testing
if (dbUsers.length > 0) createSession(dbUsers[0]);
if (dbUsers.length > 1) createSession(dbUsers[1]);
if (dbUsers.length > 2) createSession(dbUsers[2]);

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
  db.save();
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
    questionCount: (q.questions || []).length,
    createdAt: q.createdAt,
  }));
  res.json(list);
});

app.get('/api/quizzes/:id', (req: Request, res: Response) => {
  const quiz = dbQuizzes.find((q) => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

  // Exclude correctOptionIndex for quiz taking mode
  const clientQuestions = (quiz.questions || []).map(({ correctOptionIndex, explanation, ...rest }) => rest);
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

  const questionBreakdown = (quiz.questions || []).map((q) => {
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
    totalQuestions: (quiz.questions || []).length,
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
  db.save();
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
  db.save();
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
  const scheduleItems = data.schedule || [];
  const ts: TestSeries = {
    id: `test_${Date.now()}`,
    key: data.key || `test-${Date.now()}`,
    title: data.title,
    subtitle: data.subtitle || '',
    type: data.type || 'mains',
    totalTests: Number(data.totalTests || (scheduleItems.length > 0 ? scheduleItems.length : 10)),
    featured: Boolean(data.featured),
    published: Boolean(data.published ?? true),
    fee: data.fee || '₹8,900',
    earlyBirdFee: data.earlyBirdFee || '',
    existingStudentFee: data.existingStudentFee || '',
    earlyBirdDeadline: data.earlyBirdDeadline || '',
    startDate: data.startDate || 'Immediate',
    endDate: data.endDate || '',
    mode: data.mode || 'online',
    description: data.description || '',
    schedule: scheduleItems,
    image: data.image || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  };

  dbTestSeries.unshift(ts);
  db.save();
  res.json(ts);
});

app.put('/api/admin/test-series/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbTestSeries.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Test series not found.' });

  dbTestSeries[idx] = {
    ...dbTestSeries[idx],
    ...req.body,
  };
  db.save();
  res.json(dbTestSeries[idx]);
});

app.delete('/api/admin/test-series/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbTestSeries.findIndex((t) => t.id === req.params.id);
  if (idx !== -1) {
    dbTestSeries.splice(idx, 1);
    db.save();
  }
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
  db.save();
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
  db.save();
  res.json(dbEnquiries[idx]);
});

app.delete('/api/enquiries/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbEnquiries.findIndex((e) => e.id === req.params.id);
  if (idx !== -1) {
    dbEnquiries.splice(idx, 1);
    db.save();
  }
  res.json({ success: true });
});

app.delete('/api/admin/enquiries/:id', requireStaff, (req: Request, res: Response) => {
  const idx = dbEnquiries.findIndex((e) => e.id === req.params.id);
  if (idx !== -1) {
    dbEnquiries.splice(idx, 1);
    db.save();
  }
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
// BLUEHOST DATABASE MANAGEMENT & BACKUP APIS
// -------------------------------------------------------------
app.get('/api/admin/db/stats', requireStaff, (req: Request, res: Response) => {
  res.json(db.getStats());
});

app.get('/api/admin/db/export', requireStaff, (req: Request, res: Response) => {
  const backup = db.exportData();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="adhigam_db_backup_${Date.now()}.json"`);
  res.send(JSON.stringify(backup, null, 2));
});

app.post('/api/admin/db/import', requireAdmin, (req: Request, res: Response) => {
  try {
    db.importData(req.body);
    res.json({ success: true, message: 'Database imported and synchronized successfully to disk.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid database structure.' });
  }
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

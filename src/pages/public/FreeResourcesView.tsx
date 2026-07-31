import React, { useState, useEffect } from 'react';
import { Article, Quiz, Prompt, QuizAttempt } from '../../types';
import { api } from '../../lib/api';
import {
  FileText,
  CheckCircle2,
  PenTool,
  Clock,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Send,
  Eye,
} from 'lucide-react';
import { useAspirantAuth } from '../../context/AspirantAuthContext';

interface FreeResourcesProps {
  initialSubTab?: 'current-affairs' | 'quizzes' | 'answer-writing';
  onNavigate: (path: string, tab?: 'public' | 'aspirant' | 'admin') => void;
}

export const FreeResourcesView: React.FC<FreeResourcesProps> = ({
  initialSubTab = 'current-affairs',
  onNavigate,
}) => {
  const { user: aspirantUser } = useAspirantAuth();
  const [subTab, setSubTab] = useState<'current-affairs' | 'quizzes' | 'answer-writing'>(
    initialSubTab
  );

  const [articles, setArticles] = useState<Article[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<string>('all');

  // Modal States
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeQuizData, setActiveQuizData] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizTimer, setQuizTimer] = useState(300); // 5 mins default
  const [quizSubmittedResult, setQuizSubmittedResult] = useState<any>(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<Article[]>('/api/articles'),
      api.get<Quiz[]>('/api/quizzes'),
      api.get<Prompt[]>('/api/prompts'),
    ])
      .then(([aData, qData, pData]) => {
        setArticles(aData);
        setQuizzes(qData);
        setPrompts(pData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Timer Effect for active quiz
  useEffect(() => {
    if (!activeQuizData || quizSubmittedResult) return;
    const interval = setInterval(() => {
      setQuizTimer((prev) => {
        if (prev <= 1) {
          handleQuizSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuizData, quizSubmittedResult]);

  const handleStartQuiz = async (quizId: string) => {
    try {
      const q = await api.get(`/api/quizzes/${quizId}`);
      setActiveQuizData(q);
      setActiveQuizId(quizId);
      setQuizAnswers({});
      setQuizTimer((q.timeLimitMinutes || 5) * 60);
      setQuizSubmittedResult(null);
    } catch (err: any) {
      alert('Failed to load quiz questions: ' + err.message);
    }
  };

  const handleQuizSubmit = async () => {
    if (!activeQuizId || quizSubmitting) return;
    setQuizSubmitting(true);
    try {
      const res = await api.post(`/api/quizzes/${activeQuizId}/submit`, {
        userAnswers: quizAnswers,
        timeTakenSeconds: (activeQuizData?.timeLimitMinutes || 5) * 60 - quizTimer,
      });
      setQuizSubmittedResult(res);
    } catch (err: any) {
      alert('Failed to submit quiz: ' + err.message);
    } finally {
      setQuizSubmitting(false);
    }
  };

  // Filters for articles
  const filteredArticles = articles.filter((art) => {
    const matchesPaper = selectedPaper === 'all' || art.paperTag === selectedPaper;
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPaper && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
          Free Aspirant Resource Hub
        </span>
        <h1 className="text-3xl font-bold font-serif-heading text-slate-900">
          Daily UPSC Preparation Material
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Daily Editorials from The Hindu & PIB, Practice Prelims MCQs with Explanations, and Daily Mains Questions.
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setSubTab('current-affairs')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            subTab === 'current-affairs'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Current Affairs & Editorials
        </button>

        <button
          onClick={() => setSubTab('quizzes')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            subTab === 'quizzes'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle className="w-4 h-4" /> Daily Prelims Quizzes
        </button>

        <button
          onClick={() => setSubTab('answer-writing')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            subTab === 'answer-writing'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PenTool className="w-4 h-4" /> Daily Mains Answer Writing
        </button>
      </div>

      {/* SUBTAB 1: CURRENT AFFAIRS */}
      {subTab === 'current-affairs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search editorials or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-500">Filter Paper:</span>
              {['all', 'GS1', 'GS2', 'GS3', 'GS4'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPaper(p)}
                  className={`px-3 py-1 rounded-md cursor-pointer ${
                    selectedPaper === p
                      ? 'bg-slate-900 text-amber-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-0.5 rounded border border-amber-300">
                      {art.paperTag}
                    </span>
                    <span className="text-slate-400 text-[11px]">{art.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold font-serif-heading text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>By {art.author}</span>
                  <span className="text-amber-600 font-semibold group-hover:underline">Read Full Article →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: DAILY QUIZZES */}
      {subTab === 'quizzes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded border border-emerald-300">
                    {quiz.subjectTag}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {quiz.timeLimitMinutes} Mins • 5 MCQs
                  </span>
                </div>
                <h3 className="text-lg font-bold font-serif-heading text-slate-900 mb-2">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {quiz.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">UPSC Prelims Pattern (-0.66 negative)</span>
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  Start Quiz <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: DAILY MAINS ANSWER WRITING */}
      {subTab === 'answer-writing' && (
        <div className="space-y-6">
          {prompts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="bg-indigo-100 text-indigo-800 font-bold text-xs px-3 py-1 rounded-full border border-indigo-200">
                  {p.paperTag} • {p.syllabusTag}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Word Limit: {p.wordLimit} Words | Max Marks: {p.maxMarks} Marks
                </span>
              </div>

              <h3 className="text-lg font-bold font-serif-heading text-slate-900">
                {p.title}
              </h3>

              <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl text-xs text-slate-800 font-serif-body leading-relaxed italic">
                "{p.questionText}"
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    setActivePrompt(p);
                    setShowModelAnswer(false);
                  }}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 underline"
                >
                  <Eye className="w-4 h-4" /> View Model Answer Framework
                </button>

                <button
                  onClick={() => {
                    if (aspirantUser) {
                      onNavigate('/me', 'aspirant');
                    } else {
                      onNavigate('/login', 'aspirant');
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <PenTool className="w-4 h-4" /> Write Answer on Aspirant Workbench
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Article Reader */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="bg-slate-950 text-white p-6 relative">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
              <span className="text-xs font-bold uppercase text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded border border-amber-500/30">
                {activeArticle.paperTag} • {activeArticle.readTime}
              </span>
              <h2 className="text-xl font-bold font-serif-heading text-amber-100 mt-2">
                {activeArticle.title}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Key Takeaways Box */}
              {activeArticle.keyTakeaways?.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold uppercase text-amber-900 font-serif-heading flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Key Takeaways for Mains:
                  </h4>
                  <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
                    {activeArticle.keyTakeaways.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="prose prose-slate text-xs leading-relaxed space-y-3 font-serif-body">
                {activeArticle.content.split('\n\n').map((para, pIdx) => (
                  <p key={pIdx} className="text-slate-800">
                    {para}
                  </p>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">By {activeArticle.author}</span>
                <button
                  onClick={() => window.print()}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Print / Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Interactive MCQ Quiz Runner */}
      {activeQuizData && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col justify-between">
            {/* Quiz Header */}
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-500/20 px-2 py-0.5 rounded">
                  {activeQuizData.subjectTag} Quiz
                </span>
                <h3 className="text-lg font-bold font-serif-heading text-amber-100 mt-1">
                  {activeQuizData.title}
                </h3>
              </div>

              {!quizSubmittedResult && (
                <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl font-mono text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                  {Math.floor(quizTimer / 60)}:{(quizTimer % 60).toString().padStart(2, '0')}
                </div>
              )}

              <button
                onClick={() => {
                  setActiveQuizData(null);
                  setQuizSubmittedResult(null);
                }}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Quiz Questions Body OR Result Card */}
            <div className="p-6 space-y-6 flex-1">
              {quizSubmittedResult ? (
                /* Score & Breakdown View */
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-6 rounded-2xl text-center space-y-2 border border-slate-800">
                    <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Test Result Scorecard</span>
                    <h2 className="text-3xl font-bold font-serif-heading text-amber-300">
                      Score: {quizSubmittedResult.attempt.score} / {activeQuizData.questions.length * 2}
                    </h2>
                    <p className="text-xs text-slate-300">
                      Correct: {quizSubmittedResult.attempt.correctCount} | Incorrect: {quizSubmittedResult.attempt.incorrectCount} | Unattempted: {quizSubmittedResult.attempt.unattemptedCount}
                    </p>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 font-serif-heading">
                    Question-by-Question Solution Breakdown:
                  </h4>

                  <div className="space-y-4">
                    {quizSubmittedResult.questionBreakdown.map((q: any, qIdx: number) => (
                      <div
                        key={q.questionId}
                        className={`p-4 rounded-xl border text-xs space-y-2 ${
                          q.isCorrect
                            ? 'bg-emerald-50 border-emerald-200'
                            : q.selectedOptionIndex === -1
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-rose-50 border-rose-200'
                        }`}
                      >
                        <p className="font-bold text-slate-900">
                          Q{qIdx + 1}. {q.questionText}
                        </p>

                        <div className="space-y-1">
                          {q.options.map((opt: string, oIdx: number) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded font-medium flex items-center justify-between ${
                                oIdx === q.correctOptionIndex
                                  ? 'bg-emerald-200/60 text-emerald-950 font-bold'
                                  : oIdx === q.selectedOptionIndex
                                  ? 'bg-rose-200/60 text-rose-950 font-bold'
                                  : 'bg-white/60 text-slate-700'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                              {oIdx === q.correctOptionIndex && <CheckCircle className="w-4 h-4 text-emerald-700" />}
                              {oIdx === q.selectedOptionIndex && oIdx !== q.correctOptionIndex && <XCircle className="w-4 h-4 text-rose-700" />}
                            </div>
                          ))}
                        </div>

                        <div className="bg-white/80 p-3 rounded-lg border border-slate-200 text-slate-800 space-y-1">
                          <span className="font-bold text-amber-800 block text-[11px]">Explanation:</span>
                          <p className="text-slate-700 leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Question Options Runner */
                <div className="space-y-6">
                  {activeQuizData.questions.map((q: any, idx: number) => (
                    <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-3">
                      <p className="font-bold text-slate-900 leading-relaxed">
                        Q{idx + 1}. {q.questionText}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isSelected = quizAnswers[q.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() =>
                                setQuizAnswers({
                                  ...quizAnswers,
                                  [q.id]: optIdx,
                                })
                              }
                              className={`w-full text-left p-2.5 rounded-lg border font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz Footer */}
            {!quizSubmittedResult && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Selected: {Object.keys(quizAnswers).length} / {activeQuizData.questions.length} Questions
                </span>
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-md cursor-pointer disabled:opacity-50"
                >
                  {quizSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 3: Model Answer Reveal Modal */}
      {activePrompt && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="bg-slate-950 text-white p-6 relative">
              <button
                onClick={() => setActivePrompt(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
              <span className="text-xs font-bold text-amber-400 uppercase bg-amber-500/20 px-2.5 py-1 rounded border border-amber-500/30">
                {activePrompt.paperTag} Model Answer Framework
              </span>
              <h3 className="text-lg font-bold font-serif-heading text-amber-100 mt-2">
                {activePrompt.title}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-slate-800 italic">
                "{activePrompt.questionText}"
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="w-full py-2.5 bg-slate-900 text-amber-300 font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {showModelAnswer ? 'Hide Model Answer' : 'Reveal Model Answer Framework'}
                </button>

                {showModelAnswer && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-serif-body text-xs text-slate-800 space-y-2 whitespace-pre-line leading-relaxed">
                    {activePrompt.modelAnswer}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

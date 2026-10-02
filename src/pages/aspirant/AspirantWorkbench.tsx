import React, { useState, useEffect } from 'react';
import { useAspirantAuth } from '../../context/AspirantAuthContext';
import { aspirantApi, api } from '../../lib/api';
import { Prompt, WritingAttempt, QuizAttempt, Bookmark } from '../../types';
import {
  UserCheck,
  PenTool,
  CheckCircle,
  Clock,
  Sparkles,
  BookMarked,
  Award,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  Bot,
  User,
  Plus,
  RefreshCw,
} from 'lucide-react';

export const AspirantWorkbench: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { user, logout } = useAspirantAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'writing' | 'quizzes' | 'bookmarks'>('dashboard');

  // Data states
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [writingAttempts, setWritingAttempts] = useState<WritingAttempt[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Mains Writing Form State
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');
  const [answerText, setAnswerText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submittingWriting, setSubmittingWriting] = useState(false);
  const [aiEvaluating, setAiEvaluating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [writingSuccessMsg, setWritingSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pData, wData, qData, bData] = await Promise.all([
        api.get<Prompt[]>('/api/prompts'),
        aspirantApi.get<WritingAttempt[]>('/api/aspirants/attempts'),
        aspirantApi.get<QuizAttempt[]>('/api/aspirants/quizzes'),
        aspirantApi.get<Bookmark[]>('/api/aspirants/bookmarks'),
      ]);
      setPrompts(pData);
      setWritingAttempts(wData);
      setQuizAttempts(qData);
      setBookmarks(bData);
      if (pData.length > 0) setSelectedPromptId(pData[0].id);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId);

  // Submit Answer to Faculty Queue
  const handleSubmitWriting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() && !fileUrl.trim()) return;
    setSubmittingWriting(true);
    setWritingSuccessMsg('');
    try {
      const res = await aspirantApi.post('/api/writing/submit', {
        promptId: selectedPromptId,
        answerText,
        fileUrl: fileUrl || '/api/files/sample_answer.pdf',
      });
      setWritingSuccessMsg('Answer script submitted successfully to Faculty Review Hub!');
      setAnswerText('');
      setAiFeedback(null);
      fetchData();
    } catch (err: any) {
      alert('Failed to submit answer: ' + err.message);
    } finally {
      setSubmittingWriting(false);
    }
  };

  // Trigger Gemini AI Instant Evaluation
  const handleAiEvaluate = async () => {
    if (!answerText.trim()) {
      alert('Please write your answer response first before requesting AI evaluation.');
      return;
    }
    setAiEvaluating(true);
    setAiFeedback(null);
    try {
      const res = await aspirantApi.post('/api/reviews/ai-evaluate', {
        promptId: selectedPromptId,
        questionText: selectedPrompt?.questionText,
        answerText,
      });
      setAiFeedback(res.evaluation);
    } catch (err: any) {
      alert('AI Evaluation error: ' + err.message);
    } finally {
      setAiEvaluating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Aspirant Top Profile Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-bold font-serif-heading text-2xl flex items-center justify-center shadow-lg border-2 border-indigo-400/40">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif-heading text-amber-100">
                {user.name}
              </h1>
              <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                {user.targetYear || 'UPSC CSE 2026'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Email: {user.email} {user.phone && `• Phone: ${user.phone}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Aspirant Dashboard
        </button>

        <button
          onClick={() => setActiveTab('writing')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'writing'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PenTool className="w-4 h-4" /> Mains Writing Workbench ({writingAttempts.length})
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'quizzes'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle className="w-4 h-4" /> Quiz History ({quizAttempts.length})
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'bookmarks'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookMarked className="w-4 h-4" /> Saved Bookmarks ({bookmarks.length})
        </button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Summary Stat Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Answers Submitted</span>
              <p className="text-2xl font-bold font-serif-heading text-indigo-700">
                {writingAttempts.length}
              </p>
              <span className="text-[11px] text-slate-400">Total Mains Attempts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Faculty Reviewed</span>
              <p className="text-2xl font-bold font-serif-heading text-emerald-600">
                {writingAttempts.filter((w) => w.status === 'reviewed').length}
              </p>
              <span className="text-[11px] text-slate-400">Evaluation Reports Ready</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Prelims MCQs Taken</span>
              <p className="text-2xl font-bold font-serif-heading text-amber-600">
                {quizAttempts.length}
              </p>
              <span className="text-[11px] text-slate-400">Daily Tests Completed</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Saved Material</span>
              <p className="text-2xl font-bold font-serif-heading text-slate-800">
                {bookmarks.length}
              </p>
              <span className="text-[11px] text-slate-400">Articles & Quizzes</span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold font-serif-heading text-amber-200">
                Daily Prep Recommendation
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Practice 1 Mains GS question daily & attempt 5 Prelims MCQs to maintain consistency.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('writing')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" /> Write Mains Answer
              </button>
              <button
                onClick={() => onNavigate('/free/quizzes')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Attempt Prelims Quiz
              </button>
            </div>
          </div>

          {/* Recent Answer Submissions List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold font-serif-heading text-slate-900 border-b border-slate-100 pb-3">
              My Recent Mains Submissions & Review Status
            </h3>

            {writingAttempts.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No answer scripts submitted yet. Click "Mains Writing Workbench" above to write your first answer!
              </p>
            ) : (
              <div className="space-y-4">
                {writingAttempts.map((wa) => (
                  <div key={wa.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900">
                        Submitted on: {new Date(wa.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded ${
                          wa.status === 'reviewed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {wa.status === 'reviewed' ? 'Faculty Reviewed' : 'Pending Faculty Review'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-serif-body italic line-clamp-2">
                      "{wa.answerText}"
                    </p>

                    {/* Faculty Feedback Section if Reviewed */}
                    {wa.review && (
                      <div className="bg-white p-4 rounded-lg border border-emerald-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 font-serif-heading">
                            Marks Awarded: {wa.review.scoreAwarded ?? wa.review.marksObtained ?? 0} / {wa.review.maxMarks}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Reviewed by: {wa.review.reviewerName || wa.review.facultyName || 'Faculty'}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium">{wa.review.generalComments || wa.review.overallComments}</p>

                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="bg-emerald-50 p-2 rounded text-emerald-900">
                            <strong>Key Strengths:</strong> {(wa.review.strengths || [wa.review.structureFeedback || 'Structured approach']).join(', ')}
                          </div>
                          <div className="bg-rose-50 p-2 rounded text-rose-900">
                            <strong>Improvements:</strong> {(wa.review.improvements || [wa.review.contentFeedback || 'Add more data points']).join(', ')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MAINS WRITING WORKBENCH */}
      {activeTab === 'writing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                Mains Answer Composition Workbench
              </span>
              <h2 className="text-xl font-bold font-serif-heading text-slate-900 mt-2">
                Write & Submit Answer Script
              </h2>
            </div>

            {writingSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{writingSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitWriting} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Question Prompt *</label>
                <select
                  value={selectedPromptId}
                  onChange={(e) => {
                    setSelectedPromptId(e.target.value);
                    setAiFeedback(null);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 bg-white"
                >
                  {prompts.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.paperTag}] {p.title} ({p.wordLimit} W)
                    </option>
                  ))}
                </select>
              </div>

              {selectedPrompt && (
                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-800">Selected Question:</span>
                  <p className="text-xs text-amber-950 font-serif-body font-medium italic leading-relaxed">
                    "{selectedPrompt.questionText}"
                  </p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Type Your Answer Response *
                </label>
                <textarea
                  rows={8}
                  placeholder="Structure your answer into Introduction, Body (Key Arguments, Diagrams/Flowcharts, Case Studies), and Way Forward / Conclusion..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-serif-body text-slate-800 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Or Attach Handwritten PDF Script (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /api/files/my_handwritten_mains_script.pdf"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* AI Evaluate Button */}
                <button
                  type="button"
                  onClick={handleAiEvaluate}
                  disabled={aiEvaluating}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Bot className="w-4 h-4" />
                  {aiEvaluating ? 'Gemini AI Evaluating...' : 'Request Instant AI Evaluation'}
                </button>

                {/* Faculty Queue Submit Button */}
                <button
                  type="submit"
                  disabled={submittingWriting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 ml-auto"
                >
                  <Send className="w-4 h-4" />
                  {submittingWriting ? 'Submitting...' : 'Submit for Faculty Review'}
                </button>
              </div>
            </form>
          </div>

          {/* AI Feedback Display Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold font-serif-heading text-amber-100">
                  Gemini AI Answer Evaluation
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generates line-by-line feedback based on UPSC Mains evaluation benchmarks (Directness, Keyword density, Multidimensionality).
              </p>

              {aiFeedback ? (
                <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-amber-400">Score Assessment</span>
                    <span className="text-sm font-bold font-serif-heading text-amber-300">
                      {aiFeedback.scoreAwarded} / {aiFeedback.maxMarks || 15} Marks
                    </span>
                  </div>

                  <p className="text-slate-300 font-serif-body leading-relaxed">
                    {aiFeedback.generalComments}
                  </p>

                  <div className="space-y-1">
                    <strong className="text-emerald-400 block text-[11px]">Key Strengths:</strong>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {aiFeedback.strengths?.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-amber-400 block text-[11px]">Areas for Improvement:</strong>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {aiFeedback.improvements?.map((imp: string, idx: number) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs space-y-2">
                  <Sparkles className="w-8 h-8 text-amber-500/40 mx-auto" />
                  <p>Write your response on the left and click "Request Instant AI Evaluation" to generate feedback.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ HISTORY */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-bold font-serif-heading text-slate-900 border-b border-slate-100 pb-3">
            Attempted Daily Prelims Quizzes History
          </h3>

          {quizAttempts.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center italic">
              No quiz attempts recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {quizAttempts.map((qa) => (
                <div key={qa.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Quiz ID: {qa.quizId}</span>
                    <span className="text-slate-500 text-[11px]">Taken on {new Date(qa.completedAt || qa.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold font-serif-heading text-emerald-600 block">
                      Score: {qa.score}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Correct: {qa.correctCount} | Incorrect: {qa.incorrectCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BOOKMARKS */}
      {activeTab === 'bookmarks' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-bold font-serif-heading text-slate-900 border-b border-slate-100 pb-3">
            Saved Articles & Course Bookmarks
          </h3>

          {bookmarks.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center italic">
              No bookmarked materials.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map((b) => (
                <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    {b.itemType}
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{b.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

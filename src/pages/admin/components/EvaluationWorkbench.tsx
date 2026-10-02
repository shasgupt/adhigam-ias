import React, { useState } from 'react';
import { WritingAttempt, Prompt } from '../../../types';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import {
  PenTool,
  CheckCircle2,
  Clock,
  Send,
  FileText,
  User,
  Award,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';

interface EvaluationWorkbenchProps {
  attempts: WritingAttempt[];
  prompts: Prompt[];
  onRefresh: () => void;
}

export const EvaluationWorkbench: React.FC<EvaluationWorkbenchProps> = ({
  attempts,
  prompts,
  onRefresh,
}) => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'reviewed'>('all');
  const [selectedAttempt, setSelectedAttempt] = useState<WritingAttempt | null>(
    attempts.length > 0 ? attempts[0] : null
  );

  // Evaluation Form States
  const [scoreAwarded, setScoreAwarded] = useState<number>(8.5);
  const [maxMarks, setMaxMarks] = useState<number>(15);
  const [generalComments, setGeneralComments] = useState('');
  const [strengthsText, setStrengthsText] = useState('Clear introduction, good categorization of points, Sendai framework mentioned');
  const [improvementsText, setImprovementsText] = useState('Incorporate spatial diagrams/maps, cite NDMA guidelines, strengthen conclusion');
  const [savingReview, setSavingReview] = useState(false);

  const selectAttemptToReview = (attempt: WritingAttempt) => {
    setSelectedAttempt(attempt);
    if (attempt.review) {
      setScoreAwarded(attempt.review.marksObtained ?? (attempt.review as any).scoreAwarded ?? 8);
      setMaxMarks(attempt.review.maxMarks ?? 15);
      setGeneralComments(attempt.review.overallComments ?? (attempt.review as any).generalComments ?? '');
      setStrengthsText(
        Array.isArray((attempt.review as any).strengths)
          ? (attempt.review as any).strengths.join(', ')
          : attempt.review.structureFeedback || ''
      );
      setImprovementsText(
        Array.isArray((attempt.review as any).improvements)
          ? (attempt.review as any).improvements.join(', ')
          : attempt.review.modelComparisonNotes || ''
      );
    } else {
      setScoreAwarded(8);
      setMaxMarks(15);
      setGeneralComments('Good attempt. Clear introduction and systematic subheadings. Work on value addition via flowcharts.');
      setStrengthsText('Directly addresses demand of the question, structured presentation');
      setImprovementsText('Add empirical statistics and committee reports');
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttempt) return;

    setSavingReview(true);
    try {
      await api.put(`/api/writing-attempts/${selectedAttempt.id}/review`, {
        marksObtained: Number(scoreAwarded),
        maxMarks: Number(maxMarks),
        scoreAwarded: Number(scoreAwarded),
        generalComments,
        overallComments: generalComments,
        structureFeedback: strengthsText,
        strengths: strengthsText.split(',').map((s) => s.trim()).filter(Boolean),
        improvements: improvementsText.split(',').map((s) => s.trim()).filter(Boolean),
        modelComparisonNotes: improvementsText,
        facultyName: user?.name || 'Senior UPSC Faculty',
      });
      alert('Review published successfully! Student can now view marks and faculty notes in their portal.');
      onRefresh();
    } catch (err: any) {
      alert('Failed to save review: ' + (err.message || 'Check connection'));
    } finally {
      setSavingReview(false);
    }
  };

  const filtered = attempts.filter((a) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'submitted') return a.status === 'submitted' || a.status === 'under_review';
    return a.status === 'reviewed';
  });

  const activePrompt = prompts.find((p) => p.id === selectedAttempt?.promptId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-amber-600" />
            Mains Answer Script Evaluation Workbench
          </h3>
          <p className="text-xs text-slate-500">
            Review submitted student answer scripts, assign marks, and publish qualitative feedback with 24-hour turnaround SLA.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({attempts.length})
          </button>
          <button
            onClick={() => setStatusFilter('submitted')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'submitted' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Review ({attempts.filter((a) => a.status !== 'reviewed').length})
          </button>
          <button
            onClick={() => setStatusFilter('reviewed')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'reviewed' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reviewed ({attempts.filter((a) => a.status === 'reviewed').length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Submission Queue List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
            Student Submission Queue
          </h4>

          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center italic">
              No submissions found in this filter category.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filtered.map((attempt) => {
                const isSelected = selectedAttempt?.id === attempt.id;
                const prompt = prompts.find((p) => p.id === attempt.promptId);

                return (
                  <div
                    key={attempt.id}
                    onClick={() => selectAttemptToReview(attempt)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        {attempt.aspirantName || 'Aspirant'}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          attempt.status === 'reviewed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {attempt.status === 'reviewed' ? 'Reviewed' : 'Pending Evaluation'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      {attempt.aspirantEmail} • {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString() : 'Recent'}
                    </p>

                    <p className="font-semibold text-slate-800 line-clamp-1">
                      Q: {prompt?.title || attempt.promptTitle || 'Mains Question'}
                    </p>

                    <p className="text-slate-600 line-clamp-2 italic font-serif-body text-[11px]">
                      "{attempt.answerText}"
                    </p>

                    {attempt.review && (
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        Score Awarded: {attempt.review.marksObtained ?? (attempt.review as any).scoreAwarded}/{attempt.review.maxMarks || 15}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Evaluation Form */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          {selectedAttempt ? (
            <form onSubmit={handleSaveReview} className="space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    Faculty Evaluation Sheet
                  </span>
                  <h3 className="text-base font-bold font-serif-heading text-slate-900 mt-1">
                    Candidate: {selectedAttempt.aspirantName} ({selectedAttempt.aspirantEmail})
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Submitted At</span>
                  <strong className="text-xs text-slate-800">
                    {selectedAttempt.submittedAt ? new Date(selectedAttempt.submittedAt).toLocaleString() : 'Recent'}
                  </strong>
                </div>
              </div>

              {/* Question Context */}
              {activePrompt && (
                <div className="bg-amber-50/50 border border-amber-200 p-3.5 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-amber-900 block uppercase tracking-wider text-[10px]">
                    Question Prompt ({activePrompt.paperTag} • {activePrompt.maxMarks} Marks):
                  </span>
                  <p className="text-slate-800 font-medium">
                    {activePrompt.questionText}
                  </p>
                </div>
              )}

              {/* Candidate Submission Preview */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[10px]">
                  Student Answer Script Text:
                </span>
                <div className="max-h-60 overflow-y-auto text-slate-800 font-serif-body leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-slate-100">
                  {selectedAttempt.answerText || 'No answer text submitted.'}
                </div>

                {selectedAttempt.pdfUrl && (
                  <div className="pt-2 text-indigo-700 font-semibold flex items-center gap-1.5 text-xs">
                    <FileText className="w-4 h-4" /> Attached Answer Sheet PDF: {selectedAttempt.pdfFileName || selectedAttempt.pdfUrl}
                  </div>
                )}
              </div>

              {/* Marks Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Marks Awarded *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    max={maxMarks}
                    required
                    value={scoreAwarded}
                    onChange={(e) => setScoreAwarded(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Max Marks *
                  </label>
                  <input
                    type="number"
                    required
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white font-semibold text-slate-700"
                  />
                </div>
              </div>

              {/* Qualitative Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Overall Faculty Evaluation Remarks *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed remarks on answer flow, introduction precision, body dimensions, and conclusion..."
                  value={generalComments}
                  onChange={(e) => setGeneralComments(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 font-serif-body"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Strengths Observed (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lucid intro, good conceptual clarity, structured headings"
                  value={strengthsText}
                  onChange={(e) => setStrengthsText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Areas for Improvement / Value Addition (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Add flowcharts, cite Supreme Court cases, incorporate recent economic data"
                  value={improvementsText}
                  onChange={(e) => setImprovementsText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingReview}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {savingReview ? 'Publishing Evaluation...' : 'Publish Evaluation to Aspirant Portal'}
              </button>
            </form>
          ) : (
            <div className="text-center py-16 text-xs text-slate-500 italic">
              Select an answer script from the queue on the left to begin evaluation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

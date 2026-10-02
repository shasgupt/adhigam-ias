import React, { useState } from 'react';
import { Quiz, Question } from '../../../types';
import { api } from '../../../lib/api';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Search,
} from 'lucide-react';

interface QuizzesCMSProps {
  quizzes: Quiz[];
  onRefresh: () => void;
}

export const QuizzesCMS: React.FC<QuizzesCMSProps> = ({ quizzes, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectTag, setSubjectTag] = useState('Polity & Constitution');
  const [paperTag, setPaperTag] = useState<'GS1' | 'CSAT'>('GS1');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: `q_${Date.now()}_1`,
      questionText: 'With reference to the Governor’s power to reserve a Bill for the consideration of the President under Article 201, consider the following statements:\n1. The President may direct the Governor to return the Bill to the House.\n2. The House must reconsider the Bill within six months.\nWhich of the statements given above is/are correct?',
      options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
      correctOptionIndex: 2,
      explanation: 'Both statements are correct as per Article 201 of the Constitution of India. When a Bill is reserved by a Governor for the consideration of the President, the President may assent or withhold assent, or direct the Governor to return the Bill.',
    },
  ]);

  const openCreateModal = () => {
    setEditingQuiz(null);
    setTitle('Daily Prelims Booster Quiz: ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
    setDescription('High-yield MCQs based on today\'s The Hindu, Indian Express, and Static Core.');
    setSubjectTag('Polity & Current Affairs');
    setPaperTag('GS1');
    setTimeLimitMinutes(10);
    setQuestions([
      {
        id: `q_${Date.now()}_1`,
        questionText: 'Consider the following statements regarding the Inter-State Council in India:\n1. It is a constitutional body established under Article 263.\n2. The Prime Minister is the Chairman of the Council.\nWhich of the statements given above is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        correctOptionIndex: 2,
        explanation: 'Article 263 provides for the establishment of an Inter-State Council to inquire into and advise upon disputes between states. The Prime Minister serves as the ex-officio Chairman.',
      },
    ]);
    setIsCreating(true);
  };

  const openEditModal = (q: Quiz) => {
    setEditingQuiz(q);
    setTitle(q.title);
    setDescription(q.description || '');
    setSubjectTag(q.subjectTag || 'Polity');
    setPaperTag(q.paperTag as any || 'GS1');
    setTimeLimitMinutes(q.timeLimitMinutes || 10);
    setQuestions(q.questions && q.questions.length > 0 ? q.questions : [
      {
        id: `q_${Date.now()}_1`,
        questionText: 'Sample question text...',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: 0,
        explanation: 'Detailed explanation here...',
      },
    ]);
    setIsCreating(true);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q_${Date.now()}_${questions.length + 1}`,
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        explanation: '',
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: keyof Question, value: any) => {
    const next = [...questions];
    next[idx] = { ...next[idx], [field]: value };
    setQuestions(next);
  };

  const updateOption = (qIdx: number, optIdx: number, val: string) => {
    const next = [...questions];
    const newOptions = [...next[qIdx].options];
    newOptions[optIdx] = val;
    next[qIdx].options = newOptions;
    setQuestions(next);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) return;

    setSaving(true);
    const payload = {
      title,
      description,
      subjectTag,
      paperTag,
      timeLimitMinutes: Number(timeLimitMinutes),
      totalMarks: questions.length * 2,
      questions,
      published: true,
    };

    try {
      if (editingQuiz) {
        await api.put(`/api/admin/quizzes/${editingQuiz.id}`, payload);
      } else {
        await api.post('/api/admin/quizzes', payload);
      }
      setIsCreating(false);
      setEditingQuiz(null);
      onRefresh();
    } catch (err: any) {
      alert('Error saving quiz: ' + (err.message || 'Check connection'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete quiz "${name}"?`)) return;
    try {
      await api.delete(`/api/admin/quizzes/${id}`);
      onRefresh();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const filtered = quizzes.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.subjectTag && q.subjectTag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            Daily Prelims MCQ & Quizzes Builder ({quizzes.length})
          </h3>
          <p className="text-xs text-slate-500">
            Create daily 5-to-10 question mock quizzes with 4 options, designate correct answers, and add UPSC-standard explanations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Prelims Quiz
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search quizzes by title or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white"
        />
      </div>

      {/* Quizzes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  {q.subjectTag || 'General Studies'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {q.paperTag || 'GS1'}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm font-serif-heading">
                  {q.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                  {q.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg text-slate-700 border border-slate-100">
                <div className="flex items-center gap-1 font-semibold">
                  <Award className="w-3 h-3 text-indigo-600" />
                  <span>{q.questions ? q.questions.length : (q as any).questionCount || 5} Questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{q.timeLimitMinutes || 10} Mins</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(q)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Quiz
              </button>
              <button
                onClick={() => handleDelete(q.id, q.title)}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT QUIZ MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                {editingQuiz ? 'Edit Prelims Quiz' : 'Build Daily Prelims Practice Quiz'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Quiz Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject / Domain Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Indian Polity & Governance"
                    value={subjectTag}
                    onChange={(e) => setSubjectTag(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Limit (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                />
              </div>

              {/* QUESTIONS BUILDER */}
              <div className="space-y-4 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Quiz Questions ({questions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add MCQ
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.map((q, qIdx) => (
                    <div
                      key={q.id || qIdx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px]">
                          Question #{qIdx + 1}
                        </span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIdx)}
                            className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Question Prompt *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Consider the following statements regarding..."
                          value={q.questionText}
                          onChange={(e) => updateQuestion(qIdx, 'questionText', e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                        />
                      </div>

                      {/* 4 Options */}
                      <div className="space-y-2">
                        <span className="font-semibold text-slate-700 block text-[11px]">
                          Options & Correct Answer (Select the radio of the correct choice):
                        </span>
                        {['A', 'B', 'C', 'D'].map((label, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct_${qIdx}`}
                              checked={q.correctOptionIndex === optIdx}
                              onChange={() => updateQuestion(qIdx, 'correctOptionIndex', optIdx)}
                              className="w-4 h-4 text-emerald-600 cursor-pointer"
                            />
                            <span className="font-bold text-slate-600 w-4 text-center">{label}:</span>
                            <input
                              type="text"
                              required
                              placeholder={`Option ${label}`}
                              value={q.options[optIdx] || ''}
                              onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                              className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">UPSC In-Depth Explanation *</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Explain why the option is correct, referencing constitutional articles, historical facts, or official reports..."
                          value={q.explanation}
                          onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)}
                          className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white font-serif-body"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-md transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {saving ? 'Saving Quiz...' : editingQuiz ? 'Update Quiz' : 'Publish Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

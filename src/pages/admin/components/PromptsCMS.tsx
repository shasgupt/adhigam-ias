import React, { useState } from 'react';
import { Prompt } from '../../../types';
import { api } from '../../../lib/api';
import {
  PenTool,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Award,
  Search,
  BookOpen,
  Layers,
} from 'lucide-react';

interface PromptsCMSProps {
  prompts: Prompt[];
  onRefresh: () => void;
}

export const PromptsCMS: React.FC<PromptsCMSProps> = ({ prompts, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paperFilter, setPaperFilter] = useState('all');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [paperTag, setPaperTag] = useState<'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay'>('GS3');
  const [syllabusTag, setSyllabusTag] = useState('Disaster Management & Urban Planning');
  const [maxMarks, setMaxMarks] = useState(15);
  const [wordLimit, setWordLimit] = useState(250);
  const [questionText, setQuestionText] = useState('');
  const [modelAnswer, setModelAnswer] = useState('');
  const [published, setPublished] = useState(true);

  const openCreateModal = () => {
    setEditingPrompt(null);
    setTitle('Daily Mains Question: ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
    setPaperTag('GS3');
    setSyllabusTag('Indian Economy & Industrial Policy');
    setMaxMarks(15);
    setWordLimit(250);
    setQuestionText(`"Evaluate the potential of India's semiconductor manufacturing ecosystem under the India Semiconductor Mission (ISM). What are the major supply chain and technological bottlenecks that must be overcome to achieve strategic autonomy?" (15 Marks, 250 Words)`);
    setModelAnswer(`### Structure & Model Framework:
1. **Introduction:** Define India's semiconductor import dependency (~$24B) and outline the objectives of the India Semiconductor Mission (ISM) with ₹76,000 Cr fiscal support.
2. **Opportunities & Progress:**
   - Fab and OSAT/ATMP investments (Tata Electronics, Micron, CG Power).
   - Upstream ecosystem development (Design-Linked Incentive, EDA software subsidies).
3. **Bottlenecks:**
   - Ultra-pure water, uninterrupted power, and cleanroom supply chains.
   - Heavy dependency on Taiwan/ASML for advanced photolithography tools.
   - Skill gaps in specialized fab engineering.
4. **Way Forward:**
   - Bilateral supply chain resilience agreements (US-India iCET, QUAD semiconductor partnership).
   - R&D linkages with IITs and semiconductor talent pipeline.`);
    setPublished(true);
    setIsCreating(true);
  };

  const openEditModal = (p: Prompt) => {
    setEditingPrompt(p);
    setTitle(p.title);
    setPaperTag(p.paperTag as any);
    setSyllabusTag(p.syllabusTag || 'General Studies');
    setMaxMarks(p.maxMarks || 15);
    setWordLimit(p.wordLimit || 250);
    setQuestionText(p.questionText);
    setModelAnswer(p.modelAnswer || '');
    setPublished(Boolean(p.published ?? true));
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !questionText.trim()) return;

    setSaving(true);
    const payload = {
      title,
      paperTag,
      syllabusTag,
      maxMarks: Number(maxMarks),
      wordLimit: Number(wordLimit),
      questionText,
      modelAnswer,
      published,
      evaluationRubric: {
        introductionWeight: '20%',
        bodyArgumentsWeight: '60%',
        conclusionWeight: '20%',
      },
    };

    try {
      if (editingPrompt) {
        await api.put(`/api/admin/prompts/${editingPrompt.id}`, payload);
      } else {
        await api.post('/api/admin/prompts', payload);
      }
      setIsCreating(false);
      setEditingPrompt(null);
      onRefresh();
    } catch (err: any) {
      alert('Error saving prompt: ' + (err.message || 'Check connection'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete question "${name}"?`)) return;
    try {
      await api.delete(`/api/admin/prompts/${id}`);
      onRefresh();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const filtered = prompts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPaper = paperFilter === 'all' || p.paperTag === paperFilter;
    return matchesSearch && matchesPaper;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-amber-600" />
            Daily Mains Answer Writing Prompts Builder ({prompts.length})
          </h3>
          <p className="text-xs text-slate-500">
            Publish daily UPSC CSE Mains questions across GS 1, 2, 3, 4 & Essay with word limits, model answers, and rubric guides.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Daily Mains Question
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by topic or prompt text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white"
          />
        </div>

        <select
          value={paperFilter}
          onChange={(e) => setPaperFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white font-medium text-slate-700"
        >
          <option value="all">All GS Papers</option>
          <option value="GS1">GS-1 (History, Geography)</option>
          <option value="GS2">GS-2 (Polity, Governance, IR)</option>
          <option value="GS3">GS-3 (Economy, Security, Environment)</option>
          <option value="GS4">GS-4 (Ethics & Integrity)</option>
          <option value="Essay">Essay Writing</option>
        </select>
      </div>

      {/* Prompts Cards */}
      <div className="space-y-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  {p.paperTag}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {p.syllabusTag || 'GS Mains'}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {p.maxMarks || 15} Marks • {p.wordLimit || 250} Words
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 text-sm font-serif-heading">
              {p.title}
            </h4>

            <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 font-serif-body leading-relaxed">
              {p.questionText}
            </p>

            {p.modelAnswer && (
              <details className="text-xs text-slate-600">
                <summary className="cursor-pointer font-semibold text-indigo-600 hover:underline">
                  View Model Answer / Evaluation Guide
                </summary>
                <div className="mt-2 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg font-serif-body whitespace-pre-line">
                  {p.modelAnswer}
                </div>
              </details>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200 italic">
            No Mains prompts found matching the filter criteria.
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-amber-600" />
                {editingPrompt ? 'Edit Mains Question' : 'Publish Daily Mains Answer Writing Prompt'}
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
                  <label className="block font-semibold text-slate-700 mb-1">Prompt Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Paper Tag</label>
                  <select
                    value={paperTag}
                    onChange={(e) => setPaperTag(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white font-semibold"
                  >
                    <option value="GS1">GS-1 (History, Geography, Society)</option>
                    <option value="GS2">GS-2 (Polity, Governance, IR)</option>
                    <option value="GS3">GS-3 (Economy, Environment, Security)</option>
                    <option value="GS4">GS-4 (Ethics, Integrity & Case Studies)</option>
                    <option value="Essay">Essay Writing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Syllabus Topic Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Disaster Management & Sendia Framework"
                    value={syllabusTag}
                    onChange={(e) => setSyllabusTag(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Marks (e.g. 10, 15, 20)</label>
                  <input
                    type="number"
                    min={5}
                    max={250}
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Word Limit (e.g. 150, 250)</label>
                  <input
                    type="number"
                    min={50}
                    max={2000}
                    value={wordLimit}
                    onChange={(e) => setWordLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Prompt Text *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter the full question text as given in UPSC Mains..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs font-serif-body"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Model Answer / Faculty Notes / Value Additions</label>
                <textarea
                  rows={6}
                  placeholder="Outline key headings, data, committee reports, diagrams, and model conclusion..."
                  value={modelAnswer}
                  onChange={(e) => setModelAnswer(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
                  {saving ? 'Saving...' : editingPrompt ? 'Update Question' : 'Publish Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

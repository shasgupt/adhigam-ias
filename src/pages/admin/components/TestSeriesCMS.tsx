import React, { useState } from 'react';
import { TestSeries } from '../../../types';
import { api } from '../../../lib/api';
import {
  FileSpreadsheet,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';

interface TestSeriesCMSProps {
  testSeries: TestSeries[];
  onRefresh: () => void;
}

export const TestSeriesCMS: React.FC<TestSeriesCMSProps> = ({ testSeries, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<TestSeries | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [key, setKey] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [type, setType] = useState<'prelims' | 'mains' | 'integrated'>('prelims');
  const [totalTests, setTotalTests] = useState(25);
  const [fee, setFee] = useState('₹ 14,500 + GST');
  const [startDate, setStartDate] = useState('Immediate Enrollment');
  const [mode, setMode] = useState<'online' | 'offline' | 'hybrid'>('hybrid');
  const [featured, setFeatured] = useState(true);
  const [published, setPublished] = useState(true);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800');
  const [scheduleText, setScheduleText] = useState('Test 1: Indian Polity & Constitution (Articles 1-51A)\nTest 2: Modern Indian History & National Movement\nTest 3: Physical & Human Geography of India\nTest 4: Full Syllabus Mock Test 1');

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setKey(`test-series-${Date.now().toString().slice(-4)}`);
    setSubtitle('32 Comprehensive All-India Standard Mock Tests');
    setType('prelims');
    setTotalTests(32);
    setFee('₹ 16,000 + GST');
    setStartDate('1st October 2026');
    setMode('hybrid');
    setFeatured(true);
    setPublished(true);
    setDescription('Comprehensive UPSC CSE Test Series with detailed All-India Rank, question-wise video solutions, and faculty mentorship.');
    setImage('https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800');
    setScheduleText('Test 1: Indian Polity & Constitution\nTest 2: Modern Indian History\nTest 3: Indian Economy & Budget\nTest 4: Environment & Ecology\nTest 5: Full Length All-India Simulator 1');
    setIsCreating(true);
  };

  const openEditModal = (t: TestSeries) => {
    setEditingItem(t);
    setTitle(t.title);
    setKey(t.key);
    setSubtitle(t.subtitle || '');
    setType(t.type as any);
    setTotalTests(t.totalTests || 10);
    setFee(t.fee);
    setStartDate(t.startDate || 'Immediate');
    setMode(t.mode as any);
    setFeatured(Boolean(t.featured));
    setPublished(Boolean(t.published ?? true));
    setDescription(t.description);
    setImage(t.image || 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800');
    const scheduleLines = (t.schedule || []).map((s) => `${s.title} (${s.syllabus || 'Full Syllabus'})`).join('\n');
    setScheduleText(scheduleLines || 'Test 1: Sectional Test\nTest 2: Full Mock Test');
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    const scheduleItems = scheduleText.split('\n').filter(Boolean).map((line, idx) => ({
      testNumber: idx + 1,
      title: line.trim(),
      date: 'Flexible / Online Window',
      syllabus: line.trim(),
    }));

    const payload = {
      key: key || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      subtitle,
      type,
      totalTests: Number(totalTests),
      fee,
      startDate,
      mode,
      featured,
      published,
      description,
      image,
      schedule: scheduleItems,
    };

    try {
      if (editingItem) {
        await api.put(`/api/admin/test-series/${editingItem.id}`, payload);
      } else {
        await api.post('/api/admin/test-series', payload);
      }
      setIsCreating(false);
      setEditingItem(null);
      onRefresh();
    } catch (err: any) {
      alert('Error saving test series: ' + (err.message || 'Check connection'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete test series "${name}"?`)) return;
    try {
      await api.delete(`/api/admin/test-series/${id}`);
      onRefresh();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const filtered = testSeries.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.subtitle && t.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-600" />
            All-India Mock Test Series Manager ({testSeries.length})
          </h3>
          <p className="text-xs text-slate-500">
            Configure Prelims Mock Test Series, Mains Answer Simulator packages, test schedules, and enrollment fees.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Test Series Package
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search test series packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white font-medium text-slate-700"
          >
            <option value="all">All Types</option>
            <option value="prelims">Prelims Mock Series</option>
            <option value="mains">Mains Answer Writing Series</option>
            <option value="integrated">Integrated Prelims + Mains</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                  {t.type} Simulator
                </span>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    t.published !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {t.published !== false ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm font-serif-heading line-clamp-2">
                  {t.title}
                </h4>
                {t.subtitle && (
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.subtitle}</p>
                )}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {t.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg text-slate-700 border border-slate-100">
                <div className="flex items-center gap-1 font-bold text-amber-700">
                  <DollarSign className="w-3 h-3" />
                  <span>{t.fee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-indigo-600" />
                  <span>{t.totalTests} Tests</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{t.startDate || 'Open'}</span>
                </div>
                <div className="flex items-center gap-1 capitalize text-slate-600">
                  <span>{t.mode}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(t)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(t.id, t.title)}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-600" />
                {editingItem ? 'Edit Mock Test Series' : 'Create New Test Series Package'}
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
                  <label className="block font-semibold text-slate-700 mb-1">Test Series Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. All-India Prelims Mock Test Series (AIPMTS) 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Package Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                  >
                    <option value="prelims">Prelims Mock Test Series</option>
                    <option value="mains">Mains Answer Writing Evaluation Series</option>
                    <option value="integrated">Integrated Prelims + Mains</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Number of Tests</label>
                  <input
                    type="number"
                    min={1}
                    value={totalTests}
                    onChange={(e) => setTotalTests(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enrollment Fee</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹ 16,000 + GST"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Commencement Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 1st September 2026"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Overview Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of features, ranking mechanism, explanation videos, and model answers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Schedule Breakdown (One test per line)</label>
                <textarea
                  rows={4}
                  placeholder="Test 1: Indian Polity & Constitution\nTest 2: Modern Indian History\nTest 3: Geography & Environment"
                  value={scheduleText}
                  onChange={(e) => setScheduleText(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Feature on Test Series Portal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Publish to Aspirants (Live)</span>
                </label>
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
                  {saving ? 'Saving...' : editingItem ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

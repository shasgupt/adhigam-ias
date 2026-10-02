import React, { useState } from 'react';
import { Course } from '../../../types';
import { api } from '../../../lib/api';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
  Search,
  Filter,
  BookOpen,
  DollarSign,
  Calendar,
  Clock,
  User,
  Image as ImageIcon,
} from 'lucide-react';

interface CoursesCMSProps {
  courses: Course[];
  onRefresh: () => void;
}

export const CoursesCMS: React.FC<CoursesCMSProps> = ({ courses, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [key, setKey] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<'gs_foundation' | 'mains_special' | 'optional' | 'prelims_booster' | 'csat'>('gs_foundation');
  const [mode, setMode] = useState<'online' | 'offline' | 'hybrid'>('hybrid');
  const [duration, setDuration] = useState('10 Months');
  const [startDate, setStartDate] = useState('Upcoming Batch');
  const [fee, setFee] = useState('₹ 85,000 + GST');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800');
  const [facultyNames, setFacultyNames] = useState('Dr. Vikramaditya Sharma, Prof. Ananya Roy');
  const [featuresText, setFeaturesText] = useState('Printed Reference Workbooks\n24/7 Access to Recorded HD Lectures\nWeekly Answer Writing Reviews\n1-on-1 Mentorship');
  const [overviewText, setOverviewText] = useState('Comprehensive coverage of GS Papers 1 to 4\nDaily current affairs integration with The Hindu & IE\nWeekly test series included');

  const openCreateModal = () => {
    setEditingCourse(null);
    setTitle('');
    setKey(`course-${Date.now().toString().slice(-4)}`);
    setSubtitle('Comprehensive UPSC CSE Foundation Program');
    setCategory('gs_foundation');
    setMode('hybrid');
    setDuration('10 Months (800+ Hours)');
    setStartDate('15th September 2026');
    setFee('₹ 95,000 + GST');
    setFeatured(true);
    setPublished(true);
    setDescription('Comprehensive training from NCERT fundamentals to advanced UPSC CSE Mains articulation.');
    setImage('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800');
    setFacultyNames('Dr. Vikramaditya Sharma, Prof. Ananya Roy');
    setFeaturesText('Printed Reference Workbooks\n24/7 Access to Recorded HD Lectures\nWeekly Answer Writing Reviews\n1-on-1 Mentorship');
    setOverviewText('Comprehensive coverage of GS Papers 1 to 4\nDaily current affairs integration with The Hindu & IE\nWeekly test series included');
    setIsCreating(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setTitle(c.title);
    setKey(c.key);
    setSubtitle(c.subtitle || '');
    setCategory(c.category as any);
    setMode(c.mode as any);
    setDuration(c.duration || '6 Months');
    setStartDate(c.startDate || 'Upcoming Batch');
    setFee(c.fee);
    setFeatured(Boolean(c.featured));
    setPublished(Boolean(c.published ?? true));
    setDescription(c.description);
    setImage(c.image || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800');
    setFacultyNames((c.facultyNames || []).join(', '));
    setFeaturesText((c.features || []).join('\n'));
    setOverviewText((c.overview || []).join('\n'));
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    const payload = {
      key: key || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      subtitle,
      category,
      mode,
      duration,
      startDate,
      fee,
      featured,
      published,
      description,
      image,
      facultyNames: facultyNames.split(',').map((s) => s.trim()).filter(Boolean),
      features: featuresText.split('\n').map((s) => s.trim()).filter(Boolean),
      overview: overviewText.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingCourse) {
        await api.put(`/api/admin/courses/${editingCourse.id}`, payload);
      } else {
        await api.post('/api/admin/courses', payload);
      }
      setIsCreating(false);
      setEditingCourse(null);
      onRefresh();
    } catch (err: any) {
      alert('Error saving course: ' + (err.message || 'Check server connection'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/api/admin/courses/${id}`);
      onRefresh();
    } catch (err: any) {
      alert('Failed to delete course: ' + err.message);
    }
  };

  const handleTogglePublish = async (c: Course) => {
    try {
      await api.put(`/api/admin/courses/${c.id}`, { published: !c.published });
      onRefresh();
    } catch (err: any) {
      alert('Failed to update published status');
    }
  };

  const handleToggleFeatured = async (c: Course) => {
    try {
      await api.put(`/api/admin/courses/${c.id}`, { featured: !c.featured });
      onRefresh();
    } catch (err: any) {
      alert('Failed to update featured status');
    }
  };

  const filtered = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            Programmes & Courses Directory ({courses.length})
          </h3>
          <p className="text-xs text-slate-500">
            Add, update batches, change course fees, edit syllabus modules, and toggle featured programs on the home page.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Course Batch
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course title or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white font-medium text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="gs_foundation">GS Integrated Foundation</option>
            <option value="mains_special">Mains Special Programs</option>
            <option value="optional">Optional Subjects</option>
            <option value="prelims_booster">Prelims Booster</option>
            <option value="csat">CSAT Masterclass</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Category & Status Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  {c.category?.replace('_', ' ')}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleFeatured(c)}
                    title={c.featured ? 'Featured on Home Page (Click to toggle)' : 'Not featured (Click to feature)'}
                    className={`p-1 rounded text-[10px] flex items-center gap-1 font-bold ${
                      c.featured
                        ? 'bg-amber-500/20 text-amber-700 border border-amber-500/30'
                        : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {c.featured ? 'Featured' : ''}
                  </button>

                  <button
                    onClick={() => handleTogglePublish(c)}
                    title={c.published !== false ? 'Published (Click to unpublish)' : 'Unpublished (Click to publish)'}
                    className={`p-1 rounded text-[10px] flex items-center gap-1 font-bold ${
                      c.published !== false
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {c.published !== false ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {c.published !== false ? 'Live' : 'Draft'}
                  </button>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm font-serif-heading line-clamp-2">
                  {c.title}
                </h4>
                {c.subtitle && (
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{c.subtitle}</p>
                )}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {c.description}
              </p>

              {/* Key Meta Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg text-slate-700 border border-slate-100">
                <div className="flex items-center gap-1 font-medium">
                  <DollarSign className="w-3 h-3 text-amber-600" />
                  <span className="font-bold">{c.fee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{c.duration || '6 Months'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{c.startDate || 'Upcoming'}</span>
                </div>
                <div className="flex items-center gap-1 capitalize font-semibold text-indigo-700">
                  <span>Mode: {c.mode}</span>
                </div>
              </div>

              {/* Faculty Info */}
              {c.facultyNames && c.facultyNames.length > 0 && (
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Faculty: <strong>{c.facultyNames.join(', ')}</strong></span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(c)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(c.id, c.title)}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
          No courses found matching your search or category filter.
        </div>
      )}

      {/* CREATE / EDIT COURSE MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                {editingCourse ? 'Edit Course Program' : 'Create New Course Batch'}
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
                  <label className="block font-semibold text-slate-700 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GS Integrated Foundation Program 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">URL Identifier / Key</label>
                  <input
                    type="text"
                    placeholder="e.g. gs-foundation-2026"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subtitle / Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. 10-Month Rigorous Classroom & Online Training"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                  >
                    <option value="gs_foundation">GS Integrated Foundation</option>
                    <option value="mains_special">Mains Special Programs</option>
                    <option value="optional">Optional Subjects</option>
                    <option value="prelims_booster">Prelims Booster</option>
                    <option value="csat">CSAT Masterclass</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                  >
                    <option value="hybrid">Hybrid (Classroom + Online Live)</option>
                    <option value="offline">Offline Classroom Only (Old Rajinder Nagar)</option>
                    <option value="online">100% Online Live & Recorded</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Fee</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹ 95,000 + GST"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 15th August 2026"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration & Hours</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Months (800+ Hours)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Faculty In-Charge</label>
                  <input
                    type="text"
                    placeholder="Dr. Vikramaditya Sharma, Prof. Ananya Roy"
                    value={facultyNames}
                    onChange={(e) => setFacultyNames(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Banner Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Course Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comprehensive description of the syllabus coverage, approach, and outcomes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Features / Deliverables (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="Printed Reference Workbooks\n24/7 Recorded HD Lectures\nWeekly Answer Evaluation"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Feature on Home Page Carousel</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Publish to Aspirant Portal (Live)</span>
                </label>
              </div>

              {/* Submit Buttons */}
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
                  {saving ? 'Saving Course...' : editingCourse ? 'Update Course' : 'Create Course Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

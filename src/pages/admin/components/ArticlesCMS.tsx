import React, { useState } from 'react';
import { Article } from '../../../types';
import { api } from '../../../lib/api';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Tag,
} from 'lucide-react';

interface ArticlesCMSProps {
  articles: Article[];
  onRefresh: () => void;
}

export const ArticlesCMS: React.FC<ArticlesCMSProps> = ({ articles, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paperFilter, setPaperFilter] = useState('all');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'current_affairs' | 'editorial' | 'strategy' | 'syllabus_breakdown'>('current_affairs');
  const [paperTag, setPaperTag] = useState<'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay'>('GS2');
  const [author, setAuthor] = useState('Dr. Vikramaditya Sharma');
  const [readTime, setReadTime] = useState('6 min read');
  const [published, setPublished] = useState(true);
  const [syllabusTopicsText, setSyllabusTopicsText] = useState('Constitutional Bodies, Federalism, Governor Powers');
  const [keyTakeawaysText, setKeyTakeawaysText] = useState('Supreme Court Guidelines on discretionary powers\nRelevance of Sarkaria & Punchhi Commissions\nModel answer structure for GS-2');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800');

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug(`daily-analysis-${Date.now().toString().slice(-4)}`);
    setSummary('Comprehensive editorial breakdown with Prelims pointers, Mains analytical frameworks, and Supreme Court citations.');
    setContent(`### Context & Background
Recent constitutional developments have highlighted the crucial role of administrative governance in upholding cooperative federalism.

### Key Constitutional Provisions
- **Article 163:** Discretionary powers of the Governor and limitations.
- **Article 200:** Assent to bills passed by the State Legislature.
- **Landmark Verdicts:** *Shamsher Singh (1974)*, *S.R. Bommai (1994)*, and *Nabam Rebia (2016)*.

### Way Forward for Civil Services Aspirants
1. Strengthen inter-state councils and structured dispute resolution mechanisms.
2. Align administrative actions with the recommendations of the Sarkaria Commission (1988) and Punchhi Commission (2010).`);
    setCategory('current_affairs');
    setPaperTag('GS2');
    setAuthor('Dr. Vikramaditya Sharma');
    setReadTime('7 min read');
    setPublished(true);
    setSyllabusTopicsText('Indian Polity, Constitutional Governance, Judicial Precedents');
    setKeyTakeawaysText('Core constitutional articles to memorize for Prelims\n3-step structured template for Mains answer writing\nKey quotes by Dr. B.R. Ambedkar');
    setImage('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800');
    setIsCreating(true);
  };

  const openEditModal = (a: Article) => {
    setEditingArticle(a);
    setTitle(a.title);
    setSlug(a.slug);
    setSummary(a.summary);
    setContent(a.content);
    setCategory(a.category as any);
    setPaperTag(a.paperTag as any);
    setAuthor(a.author || 'Adhigam Editorial Team');
    setReadTime(a.readTime || '5 min read');
    setPublished(Boolean(a.published ?? true));
    setSyllabusTopicsText((a.syllabusTopics || []).join(', '));
    setKeyTakeawaysText((a.keyTakeaways || []).join('\n'));
    setImage(a.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800');
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      summary,
      content,
      category,
      paperTag,
      author,
      readTime,
      published,
      syllabusTopics: syllabusTopicsText.split(',').map((s) => s.trim()).filter(Boolean),
      keyTakeaways: keyTakeawaysText.split('\n').map((s) => s.trim()).filter(Boolean),
      image,
    };

    try {
      if (editingArticle) {
        await api.put(`/api/admin/articles/${editingArticle.id}`, payload);
      } else {
        await api.post('/api/admin/articles', payload);
      }
      setIsCreating(false);
      setEditingArticle(null);
      onRefresh();
    } catch (err: any) {
      alert('Error saving article: ' + (err.message || 'Check connection'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete article "${name}"?`)) return;
    try {
      await api.delete(`/api/admin/articles/${id}`);
      onRefresh();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const filtered = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPaper = paperFilter === 'all' || a.paperTag === paperFilter;
    return matchesSearch && matchesPaper;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Current Affairs & Daily Editorials CMS ({articles.length})
          </h3>
          <p className="text-xs text-slate-500">
            Publish daily The Hindu/Indian Express analysis, editorial deep dives, syllabus breakdowns, and GS key takeaways.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Publish New Editorial
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles by title or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={paperFilter}
            onChange={(e) => setPaperFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 bg-white font-medium text-slate-700"
          >
            <option value="all">All GS Papers</option>
            <option value="GS1">GS-1 (History, Geography, Society)</option>
            <option value="GS2">GS-2 (Polity, Governance, IR)</option>
            <option value="GS3">GS-3 (Economy, Environment, Tech)</option>
            <option value="GS4">GS-4 (Ethics & Case Studies)</option>
            <option value="Essay">Essay Writing</option>
          </select>
        </div>
      </div>

      {/* Articles List / Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    {a.paperTag}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {a.category?.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {a.readTime || '5 min'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Author: <strong className="text-slate-600">{a.author}</strong>
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm font-serif-heading">
                  {a.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-1 font-serif-body">
                  {a.summary}
                </p>

                {a.syllabusTopics && a.syllabusTopics.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px] text-slate-500">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>Topics: {a.syllabusTopics.join(' • ')}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEditModal(a)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Article
                </button>
                <button
                  onClick={() => handleDelete(a.id, a.title)}
                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 italic">
              No editorial articles found matching the filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT ARTICLE MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                {editingArticle ? 'Edit Editorial Article' : 'Publish New Daily Current Affairs / Editorial'}
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
                  <label className="block font-semibold text-slate-700 mb-1">Headline / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Constitutional Discretion of the Governor: A Critical Analysis"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GS Paper Tag</label>
                  <select
                    value={paperTag}
                    onChange={(e) => setPaperTag(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white font-semibold"
                  >
                    <option value="GS1">GS-1 (History, Geography, Society)</option>
                    <option value="GS2">GS-2 (Polity, Governance, IR)</option>
                    <option value="GS3">GS-3 (Economy, Environment, Security)</option>
                    <option value="GS4">GS-4 (Ethics, Integrity & Case Studies)</option>
                    <option value="Essay">Essay Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                  >
                    <option value="current_affairs">Daily Current Affairs</option>
                    <option value="editorial">Editorial Deep Dive</option>
                    <option value="strategy">Mains Strategy & Answer Writing</option>
                    <option value="syllabus_breakdown">Syllabus Breakdown</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Author / Faculty</label>
                  <input
                    type="text"
                    placeholder="Dr. Vikramaditya Sharma"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 min read"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="2-3 sentence overview highlighting the central thesis and UPSC relevance..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs font-serif-body"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Article Content (Markdown format supported) *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="### Context\nWrite detailed analysis with headings, bullet points, constitutional articles, and data..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Syllabus Topics & Keywords (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Constitutional Articles, Federalism, Sarkaria Commission"
                  value={syllabusTopicsText}
                  onChange={(e) => setSyllabusTopicsText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Takeaways for Mains Answer (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="Prelims Pointer 1\nSupreme Court Precedent 2\nMains Conclusion template 3"
                  value={keyTakeawaysText}
                  onChange={(e) => setKeyTakeawaysText(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
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
                  {saving ? 'Publishing...' : editingArticle ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

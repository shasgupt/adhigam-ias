import React, { useState } from 'react';
import { Announcement } from '../../../types';
import { api } from '../../../lib/api';
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Tag,
} from 'lucide-react';

interface AnnouncementsCMSProps {
  announcements: Announcement[];
  onRefresh: () => void;
}

export const AnnouncementsCMS: React.FC<AnnouncementsCMSProps> = ({
  announcements,
  onRefresh,
}) => {
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [badgeText, setBadgeText] = useState('NEW BATCH');
  const [message, setMessage] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [published, setPublished] = useState(true);

  const openCreateModal = () => {
    setEditingItem(null);
    setBadgeText('NEW BATCH');
    setMessage('GS Integrated Foundation 2026 Batch Admissions Open! Early Bird scholarship seats available until 15th August.');
    setLinkUrl('/courses');
    setPublished(true);
    setIsCreating(true);
  };

  const openEditModal = (a: Announcement) => {
    setEditingItem(a);
    setBadgeText(a.badgeText || 'ALERT');
    setMessage(a.message || a.content || '');
    setLinkUrl(a.linkUrl || '');
    setPublished(Boolean(a.published ?? true));
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSaving(true);
    const payload = {
      badgeText,
      message,
      linkUrl,
      published,
    };

    try {
      if (editingItem) {
        await api.put(`/api/admin/announcements/${editingItem.id}`, payload);
      } else {
        await api.post('/api/admin/announcements', payload);
      }
      setIsCreating(false);
      setEditingItem(null);
      onRefresh();
    } catch (err: any) {
      alert('Error saving announcement: ' + (err.message || 'Check connection'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this announcement ticker?')) return;
    try {
      await api.delete(`/api/admin/announcements/${id}`);
      onRefresh();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleTogglePublish = async (a: Announcement) => {
    try {
      await api.put(`/api/admin/announcements/${a.id}`, { published: !a.published });
      onRefresh();
    } catch (err: any) {
      alert('Failed to toggle publish status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            Urgent Announcements & Ticker Alerts ({announcements.length})
          </h3>
          <p className="text-xs text-slate-500">
            Publish real-time marquee banners across the top of the portal for UPSC notifications, new batch announcements, and seminar registrations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Announcement Banner
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-600 text-white shrink-0 mt-0.5">
                {a.badgeText || 'ALERT'}
              </span>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-900 font-serif-body">
                  {a.message}
                </p>
                {a.linkUrl && (
                  <span className="text-[11px] text-indigo-600 flex items-center gap-1 hover:underline">
                    <ExternalLink className="w-3 h-3" /> Target Link: {a.linkUrl}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => handleTogglePublish(a)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                  a.published !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {a.published !== false ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {a.published !== false ? 'Active' : 'Hidden'}
              </button>

              <button
                onClick={() => openEditModal(a)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>

              <button
                onClick={() => handleDelete(a.id)}
                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200 italic">
            No active announcements. Click "Add New Announcement Banner" above to create one.
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              {editingItem ? 'Edit Announcement' : 'Publish Announcement Banner'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge Tag Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NEW BATCH / UPSC NOTIFICATION / SEMINAR"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Announcement Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. GS Foundation 2026 Batch starts 15th August! Early bird scholarship registrations now open."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Link URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. /courses or /contact"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-md"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update Banner' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

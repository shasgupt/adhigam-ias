import React, { useState } from 'react';
import { Enquiry } from '../../../types';
import { api } from '../../../lib/api';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  MessageSquare,
  Send,
  Download,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react';
import { INSTITUTE_CONFIG } from '../../../data/instituteConfig';

interface EnquiriesCRMProps {
  enquiries: Enquiry[];
  onRefresh: () => void;
}

export const EnquiriesCRM: React.FC<EnquiriesCRMProps> = ({ enquiries, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'in_review' | 'resolved' | 'enrolled' | 'closed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Selected Enquiry Modal for Response
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [newStatus, setNewStatus] = useState<'new' | 'contacted' | 'in_review' | 'resolved' | 'enrolled' | 'closed'>('contacted');
  const [savingResponse, setSavingResponse] = useState(false);

  const handleOpenResponseModal = (eq: Enquiry) => {
    setSelectedEnquiry(eq);
    setAdminReplyText(eq.adminReply || '');
    setInternalNotes(eq.notes || '');
    setNewStatus(eq.status || 'contacted');
  };

  const handleSaveResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setSavingResponse(true);

    try {
      await api.put(`/api/enquiries/${selectedEnquiry.id}`, {
        adminReply: adminReplyText,
        notes: internalNotes,
        status: newStatus,
        repliedAt: adminReplyText ? new Date().toISOString() : selectedEnquiry.repliedAt,
      });

      setSelectedEnquiry(null);
      onRefresh();
    } catch (err: any) {
      alert('Failed to save response: ' + err.message);
    } finally {
      setSavingResponse(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: any) => {
    try {
      await api.put(`/api/enquiries/${id}`, { status });
      onRefresh();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete query from "${name}"?`)) return;
    try {
      await api.delete(`/api/enquiries/${id}`);
      onRefresh();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export.');
      return;
    }

    const headers = ['Reference ID', 'Date', 'Name', 'Email', 'Phone', 'Telegram', 'Category', 'Course / Programme', 'Status', 'Student Message', 'Admin Reply', 'Internal Notes'];
    const rows = filtered.map((e) => [
      `"${e.referenceId || e.id}"`,
      `"${new Date(e.createdAt).toLocaleDateString()}"`,
      `"${(e.name || '').replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${(e.phone || '').replace(/"/g, '""')}"`,
      `"${(e.telegram || '').replace(/"/g, '""')}"`,
      `"${(e.category || '').replace(/"/g, '""')}"`,
      `"${(e.courseKeyOrTitle || '').replace(/"/g, '""')}"`,
      `"${e.status}"`,
      `"${(e.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(e.adminReply || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(e.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `adhigam_student_queries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Categories list for filtering
  const categories = Array.from(new Set(enquiries.map((e) => e.category).filter(Boolean)));

  const filtered = enquiries.filter((e) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (e.name && e.name.toLowerCase().includes(term)) ||
      (e.email && e.email.toLowerCase().includes(term)) ||
      (e.phone && e.phone.includes(term)) ||
      (e.telegram && e.telegram.toLowerCase().includes(term)) ||
      (e.referenceId && e.referenceId.toLowerCase().includes(term)) ||
      (e.message && e.message.toLowerCase().includes(term)) ||
      (e.category && e.category.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-serif-heading text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0F2C59]" />
              Student Queries & Admissions CRM ({enquiries.length})
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage inquiries, assign reference codes, provide official faculty responses, and track resolutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" /> Export CSV
          </button>
          <button
            onClick={onRefresh}
            className="px-3.5 py-1.5 bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, email, phone, telegram, reference code, or question text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59]"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59] bg-white font-medium"
            >
              <option value="all">All Topics ({categories.length})</option>
              {categories.map((c: any) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider mr-1">Status:</span>
          {(['all', 'new', 'in_review', 'contacted', 'resolved', 'closed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0F2C59] text-amber-300 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all'
                ? `All (${enquiries.length})`
                : `${st.replace('_', ' ').toUpperCase()} (${enquiries.filter((e) => e.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Queries List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No student queries found</h4>
            <p className="text-xs text-slate-500">Try changing your search terms or status filter.</p>
          </div>
        ) : (
          filtered.map((enq) => (
            <div
              key={enq.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs space-y-4 ${
                enq.status === 'new'
                  ? 'border-amber-300 bg-amber-50/20'
                  : enq.status === 'resolved'
                  ? 'border-emerald-200'
                  : 'border-slate-200'
              }`}
            >
              {/* Top row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black text-[#0F2C59] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {enq.referenceId || enq.id}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{enq.name}</span>
                  {enq.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {enq.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={enq.status}
                    onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                      enq.status === 'new'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : enq.status === 'contacted'
                        ? 'bg-sky-100 text-sky-900 border-sky-300'
                        : enq.status === 'in_review'
                        ? 'bg-purple-100 text-purple-900 border-purple-300'
                        : enq.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <option value="new">NEW</option>
                    <option value="in_review">IN REVIEW</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="resolved">RESOLVED</option>
                    <option value="closed">CLOSED</option>
                  </select>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Student Query Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-8 space-y-3">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">
                      Student Query / Question:
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      "{enq.message}"
                    </p>
                  </div>

                  {/* Official Response if any */}
                  {enq.adminReply && (
                    <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs space-y-1">
                      <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-widest block flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Official Faculty Response (Visible to Student):
                      </span>
                      <p className="text-emerald-950 font-medium">
                        {enq.adminReply}
                      </p>
                      {enq.repliedAt && (
                        <span className="text-[10px] text-emerald-700 block font-mono">
                          Saved: {new Date(enq.repliedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Internal Notes if any */}
                  {enq.notes && (
                    <div className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-200">
                      <strong>Internal Staff Note:</strong> {enq.notes}
                    </div>
                  )}
                </div>

                {/* Right: Contact & Quick Actions */}
                <div className="md:col-span-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Contact Channels:
                  </span>

                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`mailto:${enq.email}`} className="text-indigo-600 hover:underline truncate">
                        {enq.email}
                      </a>
                    </div>

                    {enq.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{enq.phone}</span>
                      </div>
                    )}

                    {enq.telegram && (
                      <div className="flex items-center gap-2">
                        <Send className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <a
                          href={`https://t.me/${enq.telegram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline font-semibold"
                        >
                          {enq.telegram}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
                    <button
                      onClick={() => handleOpenResponseModal(enq)}
                      className="w-full py-1.5 bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {enq.adminReply ? 'Edit Response' : 'Reply to Student'}
                    </button>

                    <div className="flex gap-2">
                      <a
                        href={`mailto:${enq.email}?subject=Response%20to%20ADHIGAM%20IAS%20Query%20${enq.referenceId || enq.id}&body=Dear%20${encodeURIComponent(enq.name)},%0D%0A%0D%0AThank%20you%20for%20contacting%20ADHIGAM%20IAS%20regarding%20RISE%202.0%20Sociology%20Optional%20Test%20Series.`}
                        className="flex-1 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-center text-[11px] font-semibold flex items-center justify-center gap-1"
                      >
                        <Mail className="w-3 h-3 text-slate-500" /> Send Email
                      </a>

                      <button
                        onClick={() => handleDelete(enq.id, enq.name)}
                        className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 rounded text-[11px] transition-colors cursor-pointer"
                        title="Delete query"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="bg-[#0F2C59] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-300 uppercase block">
                  Reference: {selectedEnquiry.referenceId || selectedEnquiry.id}
                </span>
                <h3 className="text-base font-bold font-serif-heading">
                  Respond to Student Query: {selectedEnquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResponse} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Original Question:</span>
                <p className="text-slate-800">{selectedEnquiry.message}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Official Faculty Response (Visible to Student on Query Tracker) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type clear explanation, confirmation of early bird discount, or guidance..."
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59] resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Internal Counselor / Staff Notes (Private)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified existing enrolment receipt, sent payment link via Telegram..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Update Query Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59] bg-white font-medium"
                >
                  <option value="new">NEW (Unprocessed)</option>
                  <option value="in_review">IN REVIEW (Faculty Assessing)</option>
                  <option value="contacted">CONTACTED (Message Sent)</option>
                  <option value="resolved">RESOLVED (Completed)</option>
                  <option value="closed">CLOSED</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingResponse}
                  className="px-5 py-2 bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {savingResponse ? 'Saving...' : 'Save & Publish Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

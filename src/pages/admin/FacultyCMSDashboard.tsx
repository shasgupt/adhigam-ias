import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import {
  WritingAttempt,
  Enquiry,
  Course,
  Prompt,
  Announcement,
  UploadFile,
} from '../../types';
import {
  ShieldCheck,
  PenTool,
  Users,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Trash2,
  FileText,
  Building2,
  ChevronRight,
  Edit,
} from 'lucide-react';

export const FacultyCMSDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'reviews' | 'enquiries' | 'courses' | 'content' | 'announcements'
  >('reviews');

  // Data states
  const [pendingAttempts, setPendingAttempts] = useState<WritingAttempt[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Selected Review State
  const [selectedAttempt, setSelectedAttempt] = useState<WritingAttempt | null>(null);
  const [scoreAwarded, setScoreAwarded] = useState<number>(7);
  const [maxMarks, setMaxMarks] = useState<number>(15);
  const [generalComments, setGeneralComments] = useState('');
  const [strengthsText, setStrengthsText] = useState('Clear introduction, good conceptual grasp');
  const [improvementsText, setImprovementsText] = useState('Add more recent case studies, draw a flow diagram');
  const [savingReview, setSavingReview] = useState(false);

  // New Course Modal / Form
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseFee, setNewCourseFee] = useState('₹ 45,000');
  const [newCourseMode, setNewCourseMode] = useState<'online' | 'offline' | 'hybrid'>('hybrid');

  // New Announcement
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementBadge, setAnnouncementBadge] = useState('NEW BATCH');

  useEffect(() => {
    fetchCMSData();
  }, []);

  const fetchCMSData = async () => {
    setLoading(true);
    try {
      const [wData, eData, cData, pData, aData] = await Promise.all([
        api.get<WritingAttempt[]>('/api/admin/writing-attempts'),
        api.get<Enquiry[]>('/api/admin/enquiries'),
        api.get<Course[]>('/api/courses'),
        api.get<Prompt[]>('/api/prompts'),
        api.get<Announcement[]>('/api/announcements'),
      ]);
      setPendingAttempts(wData);
      setEnquiries(eData);
      setCourses(cData);
      setPrompts(pData);
      setAnnouncements(aData);
      if (wData.length > 0 && !selectedAttempt) {
        setSelectedAttempt(wData[0]);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Submit Faculty Evaluation
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttempt) return;
    setSavingReview(true);
    try {
      await api.put(`/api/writing-attempts/${selectedAttempt.id}/review`, {
        scoreAwarded: Number(scoreAwarded),
        maxMarks: Number(maxMarks),
        generalComments,
        strengths: strengthsText.split(',').map((s) => s.trim()),
        improvements: improvementsText.split(',').map((s) => s.trim()),
        reviewerName: user?.name || 'Senior Faculty',
      });
      alert('Review published successfully!');
      fetchCMSData();
    } catch (err: any) {
      alert('Failed to save review: ' + err.message);
    } finally {
      setSavingReview(false);
    }
  };

  // Update Enquiry Status
  const handleUpdateEnquiryStatus = async (id: string, status: 'new' | 'contacted' | 'enrolled') => {
    try {
      await api.put(`/api/admin/enquiries/${id}`, { status });
      fetchCMSData();
    } catch (err: any) {
      alert('Failed to update enquiry status.');
    }
  };

  // Add New Course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/courses', {
        title: newCourseTitle,
        fee: newCourseFee,
        mode: newCourseMode,
        category: 'gs_foundation',
        description: 'Comprehensive UPSC CSE Foundation coverage.',
      });
      setShowAddCourseModal(false);
      setNewCourseTitle('');
      fetchCMSData();
    } catch (err: any) {
      alert('Failed to create course.');
    }
  };

  // Add Announcement
  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    try {
      await api.post('/api/admin/announcements', {
        title: announcementText,
        badgeText: announcementBadge,
        link: '/courses',
      });
      setAnnouncementText('');
      fetchCMSData();
    } catch (err: any) {
      alert('Failed to post announcement.');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* CMS Header Bar */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-bold font-serif-heading text-2xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif-heading text-amber-100">
                Faculty & Admin Review Hub
              </h1>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded">
                Role: {user.role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Signed in as <strong className="text-slate-200">{user.name}</strong> ({user.email})
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
        >
          Logout CMS
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PenTool className="w-4 h-4" /> Mains Answer Evaluation Queue ({pendingAttempts.length})
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Admissions & Enquiries ({enquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'courses'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" /> Programmes & Courses ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Announcement Ticker ({announcements.length})
        </button>
      </div>

      {/* TAB 1: MAINS ANSWER EVALUATION QUEUE */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Review Queue List */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-800 font-serif-heading border-b border-slate-100 pb-2">
              Submitted Answer Scripts Queue
            </h3>

            {pendingAttempts.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center italic">
                Queue is clear! No pending answer scripts.
              </p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {pendingAttempts.map((attempt) => {
                  const prompt = prompts.find((p) => p.id === attempt.promptId);
                  const isSelected = selectedAttempt?.id === attempt.id;
                  return (
                    <div
                      key={attempt.id}
                      onClick={() => {
                        setSelectedAttempt(attempt);
                        if (attempt.review) {
                          setScoreAwarded(attempt.review.scoreAwarded);
                          setMaxMarks(attempt.review.maxMarks);
                          setGeneralComments(attempt.review.generalComments);
                          setStrengthsText(attempt.review.strengths.join(', '));
                          setImprovementsText(attempt.review.improvements.join(', '));
                        }
                      }}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-500 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {attempt.aspirantName || 'Aspirant'} ({attempt.aspirantEmail})
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                            attempt.status === 'reviewed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {attempt.status}
                        </span>
                      </div>

                      <p className="font-semibold text-slate-800 line-clamp-1">
                        Question: {prompt?.title || 'GS Question'}
                      </p>

                      <p className="text-slate-600 line-clamp-2 italic font-serif-body">
                        "{attempt.answerText}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Review Evaluation Panel */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            {selectedAttempt ? (
              <form onSubmit={handleSaveReview} className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded">
                    Faculty Evaluation Form
                  </span>
                  <h3 className="text-lg font-bold font-serif-heading text-slate-900 mt-1">
                    Review Script submitted by {selectedAttempt.aspirantName}
                  </h3>
                </div>

                {/* Candidate Text Response Preview */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block uppercase">Candidate Answer Response:</span>
                  <p className="text-slate-800 font-serif-body leading-relaxed whitespace-pre-line">
                    {selectedAttempt.answerText}
                  </p>
                  {selectedAttempt.fileUrl && (
                    <div className="pt-2 border-t border-slate-200 text-indigo-700 font-semibold flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Attachment PDF: {selectedAttempt.fileUrl}
                    </div>
                  )}
                </div>

                {/* Evaluation Marks & Feedback Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Marks Awarded</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={maxMarks}
                      value={scoreAwarded}
                      onChange={(e) => setScoreAwarded(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Max Marks</label>
                    <input
                      type="number"
                      required
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty General Remarks *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="General comments on answer structure, introduction, and conclusion..."
                    value={generalComments}
                    onChange={(e) => setGeneralComments(e.target.value)}
                    className="w-full p-3 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500 font-serif-body"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Key Strengths (Comma Separated)</label>
                  <input
                    type="text"
                    value={strengthsText}
                    onChange={(e) => setStrengthsText(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Areas for Improvement (Comma Separated)</label>
                  <input
                    type="text"
                    value={improvementsText}
                    onChange={(e) => setImprovementsText(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingReview}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {savingReview ? 'Publishing Review...' : 'Publish Faculty Review to Student'}
                </button>
              </form>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-12">
                Select an answer script from the queue on the left to evaluate.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ADMISSIONS & ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold font-serif-heading text-slate-900 border-b border-slate-100 pb-3">
            Candidate Admission Leads ({enquiries.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-900 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Candidate Name</th>
                  <th className="p-3">Contact Email & Phone</th>
                  <th className="p-3">Course Interest</th>
                  <th className="p-3">Message / Query</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{eq.name}</td>
                    <td className="p-3">{eq.email}<br /><span className="text-slate-500">{eq.phone}</span></td>
                    <td className="p-3 font-semibold text-indigo-700">{eq.courseKeyOrTitle}</td>
                    <td className="p-3 max-w-xs truncate">{eq.message}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        eq.status === 'enrolled' ? 'bg-emerald-100 text-emerald-800' : eq.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {eq.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => handleUpdateEnquiryStatus(eq.id, 'contacted')}
                        className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-[10px] font-semibold cursor-pointer"
                      >
                        Contacted
                      </button>
                      <button
                        onClick={() => handleUpdateEnquiryStatus(eq.id, 'enrolled')}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-semibold cursor-pointer"
                      >
                        Enrolled
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROGRAMMES & COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif-heading text-slate-900">
              Active Courses Directory
            </h3>
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {c.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm font-serif-heading">{c.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Fee: {c.fee}</span>
                  <span className="text-amber-700">{c.mode}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Course Modal */}
          {showAddCourseModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4">
                <h3 className="text-base font-bold text-slate-900 font-serif-heading">Create New Course Batch</h3>
                <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Course Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ethics & Essay Masterclass 2026"
                      value={newCourseTitle}
                      onChange={(e) => setNewCourseTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Course Fee</label>
                    <input
                      type="text"
                      required
                      value={newCourseFee}
                      onChange={(e) => setNewCourseFee(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCourseModal(false)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold">
                      Create Course
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <h3 className="text-base font-bold font-serif-heading text-slate-900 border-b border-slate-100 pb-2">
            Manage Announcement Ticker Banner
          </h3>

          <form onSubmit={handleAddAnnouncement} className="space-y-3 text-xs max-w-lg">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Badge Text</label>
              <input
                type="text"
                value={announcementBadge}
                onChange={(e) => setAnnouncementBadge(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Announcement Message *</label>
              <input
                type="text"
                required
                placeholder="e.g. Offline Foundation Batch 2 Starts on 15th August at Old Rajinder Nagar!"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-amber-500 transition-colors"
            >
              Post Announcement
            </button>
          </form>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase">Active Banners:</h4>
            {announcements.map((anc) => (
              <div key={anc.id} className="p-3 bg-slate-50 border rounded-lg text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] mr-2">
                    {anc.badgeText}
                  </span>
                  <span className="text-slate-800 font-medium">{anc.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

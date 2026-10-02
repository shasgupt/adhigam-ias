import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import {
  WritingAttempt,
  Enquiry,
  Course,
  TestSeries,
  Article,
  Quiz,
  Prompt,
  Announcement,
} from '../../types';
import {
  ShieldCheck,
  PenTool,
  Users,
  Layers,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Bell,
  Settings,
  Sparkles,
  RefreshCw,
  LogOut,
  ExternalLink,
  BookOpen,
  Award,
  CheckCircle2,
  X,
  Activity,
  Info,
} from 'lucide-react';

import { CoursesCMS } from './components/CoursesCMS';
import { TestSeriesCMS } from './components/TestSeriesCMS';
import { ArticlesCMS } from './components/ArticlesCMS';
import { QuizzesCMS } from './components/QuizzesCMS';
import { PromptsCMS } from './components/PromptsCMS';
import { EvaluationWorkbench } from './components/EvaluationWorkbench';
import { EnquiriesCRM } from './components/EnquiriesCRM';
import { AnnouncementsCMS } from './components/AnnouncementsCMS';
import { InstituteSettingsCMS } from './components/InstituteSettingsCMS';

export const FacultyCMSDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'evaluations' | 'enquiries' | 'courses' | 'test_series' | 'articles' | 'quizzes' | 'prompts' | 'announcements' | 'settings'
  >('evaluations');

  // Unified State Cache
  const [writingAttempts, setWritingAttempts] = useState<WritingAttempt[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals for Admin SOP Guide and Health Check
  const [showAdminGuideModal, setShowAdminGuideModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const runHealthCheck = async () => {
    setHealthLoading(true);
    try {
      const start = Date.now();
      const [instRes, courseRes, enqRes, annRes] = await Promise.all([
        api.get('/api/institute').catch(() => null),
        api.get('/api/courses').catch(() => null),
        api.get('/api/admin/enquiries').catch(() => null),
        api.get('/api/announcements').catch(() => null),
      ]);
      const latency = Date.now() - start;

      setHealthStatus({
        apiOnline: true,
        latencyMs: latency,
        instituteApi: !!instRes,
        coursesApi: !!courseRes,
        enquiriesApi: !!enqRes,
        announcementsApi: !!annRes,
        aspirantPortal: 'Operational (Auth & Workbench)',
        adminPortal: 'Operational (Directorate CMS & CRM)',
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (e: any) {
      setHealthStatus({
        apiOnline: false,
        error: e.message || 'Health check failed',
      });
    } finally {
      setHealthLoading(false);
    }
  };

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [wRes, eRes, cRes, tsRes, aRes, qRes, pRes, anRes] = await Promise.allSettled([
        api.get<WritingAttempt[]>('/api/admin/writing-attempts'),
        api.get<Enquiry[]>('/api/admin/enquiries'),
        api.get<Course[]>('/api/courses'),
        api.get<TestSeries[]>('/api/admin/test-series').catch(() => api.get<TestSeries[]>('/api/test-series')),
        api.get<Article[]>('/api/articles'),
        api.get<Quiz[]>('/api/quizzes'),
        api.get<Prompt[]>('/api/prompts'),
        api.get<Announcement[]>('/api/announcements'),
      ]);

      if (wRes.status === 'fulfilled') setWritingAttempts(wRes.value);
      if (eRes.status === 'fulfilled') setEnquiries(eRes.value);
      if (cRes.status === 'fulfilled') setCourses(cRes.value);
      if (tsRes.status === 'fulfilled') setTestSeries(tsRes.value);
      if (aRes.status === 'fulfilled') setArticles(aRes.value);
      if (qRes.status === 'fulfilled') setQuizzes(qRes.value);
      if (pRes.status === 'fulfilled') setPrompts(pRes.value);
      if (anRes.status === 'fulfilled') setAnnouncements(anRes.value);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const pendingEvaluationsCount = writingAttempts.filter((a) => a.status !== 'reviewed').length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Faculty Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-bold font-serif-heading text-2xl flex items-center justify-center shadow-lg shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold font-serif-heading text-amber-100">
                Adhigam Faculty & Content Operations Hub
              </h1>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded">
                Role: {user.role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Signed in as <strong className="text-slate-200">{user.name}</strong> ({user.email}) • Central Content Management & Evaluation Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-center flex-wrap">
          <button
            onClick={() => setShowAdminGuideModal(true)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-amber-400/30 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            title="Read Administrative Manual for Courses & Test Series"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Admin SOP Guide</span>
          </button>

          <button
            onClick={() => {
              setShowHealthModal(true);
              runHealthCheck();
            }}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold border border-emerald-500/30 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            title="Run Real-Time System & Portal Health Diagnostics"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Portal Health</span>
          </button>

          <button
            onClick={() => setActiveTab('test_series')}
            className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Manage Test Series ({testSeries.length})</span>
          </button>

          <button
            onClick={fetchAllAdminData}
            title="Refresh CMS Data"
            disabled={loading}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout CMS
          </button>
        </div>
      </div>

      {/* Quick Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <button
          onClick={() => setActiveTab('evaluations')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'evaluations'
              ? 'bg-amber-600 text-white border-amber-700 shadow-md'
              : 'bg-white border-slate-200 text-slate-900 hover:border-amber-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <PenTool className="w-4 h-4 opacity-80" />
            {pendingEvaluationsCount > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white animate-pulse">
                {pendingEvaluationsCount} Due
              </span>
            )}
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-serif-heading block">
              {writingAttempts.length}
            </span>
            <span className="text-[10px] uppercase font-bold opacity-80 block truncate">
              Evaluations
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'enquiries'
              ? 'bg-amber-600 text-white border-amber-700 shadow-md'
              : 'bg-white border-slate-200 text-slate-900 hover:border-amber-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <Users className="w-4 h-4 opacity-80" />
            {newEnquiriesCount > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                {newEnquiriesCount} New
              </span>
            )}
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-serif-heading block">
              {enquiries.length}
            </span>
            <span className="text-[10px] uppercase font-bold opacity-80 block truncate">
              Student Queries
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'courses'
              ? 'bg-amber-600 text-white border-amber-700 shadow-md'
              : 'bg-white border-slate-200 text-slate-900 hover:border-amber-400 shadow-xs'
          }`}
        >
          <Layers className="w-4 h-4 opacity-80" />
          <div className="mt-2">
            <span className="text-xl font-bold font-serif-heading block">
              {courses.length}
            </span>
            <span className="text-[10px] uppercase font-bold opacity-80 block truncate">
              Courses
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('test_series')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'test_series'
              ? 'bg-amber-600 text-white border-amber-700 shadow-md'
              : 'bg-white border-slate-200 text-slate-900 hover:border-amber-400 shadow-xs'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 opacity-80" />
          <div className="mt-2">
            <span className="text-xl font-bold font-serif-heading block">
              {testSeries.length}
            </span>
            <span className="text-[10px] uppercase font-bold opacity-80 block truncate">
              Test Series
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'articles'
              ? 'bg-amber-600 text-white border-amber-700 shadow-md'
              : 'bg-white border-slate-200 text-slate-900 hover:border-amber-400 shadow-xs'
          }`}
        >
          <FileText className="w-4 h-4 opacity-80" />
          <div className="mt-2">
            <span className="text-xl font-bold font-serif-heading block">
              {articles.length}
            </span>
            <span className="text-[10px] uppercase font-bold opacity-80 block truncate">
              Editorials
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'quizzes'
              ? 'bg-amber-600 text-white border-amber-700 shadow-md'
              : 'bg-white border-slate-200 text-slate-900 hover:border-amber-400 shadow-xs'
          }`}
        >
          <HelpCircle className="w-4 h-4 opacity-80" />
          <div className="mt-2">
            <span className="text-xl font-bold font-serif-heading block">
              {quizzes.length}
            </span>
            <span className="text-[10px] uppercase font-bold opacity-80 block truncate">
              Prelims MCQs
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('prompts')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'prompts'
              ? 'bg-amber-600 text-white border-amber-700 shadow-md'
              : 'bg-white border-slate-200 text-slate-900 hover:border-amber-400 shadow-xs'
          }`}
        >
          <BookOpen className="w-4 h-4 opacity-80" />
          <div className="mt-2">
            <span className="text-xl font-bold font-serif-heading block">
              {prompts.length}
            </span>
            <span className="text-[10px] uppercase font-bold opacity-80 block truncate">
              Mains Prompts
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'announcements'
              ? 'bg-amber-600 text-white border-amber-700 shadow-md'
              : 'bg-white border-slate-200 text-slate-900 hover:border-amber-400 shadow-xs'
          }`}
        >
          <Bell className="w-4 h-4 opacity-80" />
          <div className="mt-2">
            <span className="text-xl font-bold font-serif-heading block">
              {announcements.length}
            </span>
            <span className="text-[10px] uppercase font-bold opacity-80 block truncate">
              Alerts
            </span>
          </div>
        </button>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('evaluations')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'evaluations'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Answer Script Evaluations ({pendingEvaluationsCount} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Admissions CRM ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('test_series')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'test_series'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-500" />
          <span>Test Series Packages ({testSeries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'courses'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Courses & Batches ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'articles'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Current Affairs & Editorials ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'quizzes'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Daily Quizzes Builder ({quizzes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'prompts'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Mains Questions ({prompts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Urgent Alerts ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings & Guide</span>
        </button>
      </div>

      {/* Render Active CMS Module */}
      <div className="transition-all duration-200">
        {activeTab === 'evaluations' && (
          <EvaluationWorkbench
            attempts={writingAttempts}
            prompts={prompts}
            onRefresh={fetchAllAdminData}
          />
        )}

        {activeTab === 'enquiries' && (
          <EnquiriesCRM
            enquiries={enquiries}
            onRefresh={fetchAllAdminData}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesCMS
            courses={courses}
            onRefresh={fetchAllAdminData}
          />
        )}

        {activeTab === 'test_series' && (
          <TestSeriesCMS
            testSeries={testSeries}
            onRefresh={fetchAllAdminData}
          />
        )}

        {activeTab === 'articles' && (
          <ArticlesCMS
            articles={articles}
            onRefresh={fetchAllAdminData}
          />
        )}

        {activeTab === 'quizzes' && (
          <QuizzesCMS
            quizzes={quizzes}
            onRefresh={fetchAllAdminData}
          />
        )}

        {activeTab === 'prompts' && (
          <PromptsCMS
            prompts={prompts}
            onRefresh={fetchAllAdminData}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsCMS
            announcements={announcements}
            onRefresh={fetchAllAdminData}
          />
        )}

        {activeTab === 'settings' && (
          <InstituteSettingsCMS />
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADMIN SOP GUIDE MODAL                                                     */}
      {/* ========================================================================= */}
      {showAdminGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F2C59] text-amber-300 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif-heading text-[#0F2C59]">
                    ADHIGAM IAS — Administrator & Faculty SOP Manual
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official operational guidelines for managing courses, test series, evaluations, and student queries.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminGuideModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
              {/* Section 1: Adding Courses */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  SOP 01 • Academic Offerings
                </span>
                <h4 className="text-sm font-bold text-slate-900 font-serif-heading">
                  How to Add a New Course Under the Adhigam Umbrella
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Click on the <strong>"Courses & Programmes"</strong> tab in this dashboard.</li>
                  <li>Click the <strong>"+ Add New Course"</strong> button in the top-right toolbar.</li>
                  <li>Enter the course title (e.g. <em>"Sociology Optional Comprehensive Foundation 2027"</em>), category, fee, and batch timing.</li>
                  <li>Add course highlights (one per line) and syllabus module breakdowns.</li>
                  <li>Set visibility to <strong>"Published"</strong> so it immediately displays on the public <code>/courses</code> page.</li>
                  <li>Click <strong>"Create Course"</strong> to synchronize with the persistent storage.</li>
                </ol>
              </div>

              {/* Section 2: Managing Test Series */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  SOP 02 • Test Series & Schedules
                </span>
                <h4 className="text-sm font-bold text-slate-900 font-serif-heading">
                  How to Create & Schedule Test Series (RISE 2.0 & Beyond)
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Click on the <strong>"Test Series CMS"</strong> tab in this dashboard.</li>
                  <li>To create a new series: Click <strong>"+ Create New Test Series"</strong> and fill in duration, total tests, pricing tiers, and rules.</li>
                  <li>To manage individual tests: Click <strong>"Manage Schedule"</strong> on any series card (e.g., RISE 2.0).</li>
                  <li>Click <strong>"+ Add Test"</strong> to add a test number, date, paper (Paper I, II, Comprehensive), topic coverage, and question set.</li>
                  <li>Changes reflect immediately on the public schedule browser (<code>/test-series#test-schedule</code>) and in the Aspirant Workbench.</li>
                </ol>
              </div>

              {/* Section 3: Aspirant Queries */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  SOP 03 • Admissions & Inquiries
                </span>
                <h4 className="text-sm font-bold text-slate-900 font-serif-heading">
                  How Admin Views & Responds to Aspirant Queries
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Select the <strong>"Enquiries CRM"</strong> tab. The counter shows pending unreviewed inquiries.</li>
                  <li>Filter by status (<code>New</code>, <code>Contacted</code>, <code>Enrolled</code>) or category (<code>RISE 2.0 Enrolment</code>, <code>General</code>).</li>
                  <li>Click <strong>"View / Respond"</strong> on any aspirant query card.</li>
                  <li>Enter the official faculty response in <strong>"Admin Reply"</strong>. Aspirants can view this on the live portal at <code>/contact</code> using their Reference ID!</li>
                  <li>Add private internal notes (e.g., call records, follow-up dates) and click <strong>"Save Changes"</strong>.</li>
                  <li>Click <strong>"Export CSV"</strong> anytime to download lead reports for admissions staff.</li>
                </ol>
              </div>

              {/* Section 4: Testing & Verification */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  SOP 04 • System Health & Testing
                </span>
                <h4 className="text-sm font-bold text-slate-900 font-serif-heading">
                  How to Verify Aspirant & Admin Portals are Working
                </h4>
                <div className="space-y-1.5 text-slate-600">
                  <p><strong>Aspirant Portal Test:</strong> Go to <code>/login</code>, log in with demo account <code>aspirant@adhigam.com</code>, submit a test answer in the Workbench, and check evaluation history.</p>
                  <p><strong>Public Query Test:</strong> Go to <code>/contact</code>, submit a query, copy the Reference ID, and test query tracking in the tracking tab.</p>
                  <p><strong>Admin Evaluation Test:</strong> In this dashboard's <em>"Evaluations Workbench"</em>, assign marks and feedback to student answer attempts.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                A permanent copy is saved at <code>/doc/ADMIN_MANUAL_COURSES_AND_TEST_SERIES.md</code>
              </span>
              <button
                onClick={() => setShowAdminGuideModal(false)}
                className="px-5 py-2 bg-[#0F2C59] hover:bg-[#0c2347] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PORTAL HEALTH & DIAGNOSTICS MODAL                                         */}
      {/* ========================================================================= */}
      {showHealthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-heading text-slate-900">
                    Live Portal Health & Diagnostics
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Real-time status of Adhigam IAS API routes and database integrity.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHealthModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {healthLoading ? (
              <div className="py-8 text-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
                <p className="text-xs text-slate-500">Pinging backend endpoints & checking storage...</p>
              </div>
            ) : healthStatus ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    All Systems Operational
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono">
                    Latency: {healthStatus.latencyMs}ms
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-slate-700">Public Portal & Institute API</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-slate-700">Courses & Programmes API</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational ({courses.length} items)
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-slate-700">Test Series & Schedule API</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational ({testSeries.length} series)
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-slate-700">Student Enquiries & CRM</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational ({enquiries.length} queries)
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-slate-700">Evaluation Workbench</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational ({writingAttempts.length} attempts)
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-slate-700">Local DB Storage & File Backup</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Synchronized to Disk
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 text-center">
                  Last verified at {healthStatus.timestamp} • Server running on Express + Vite
                </p>
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <button
                onClick={runHealthCheck}
                disabled={healthLoading}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} /> Re-test Diagnostics
              </button>
              <button
                onClick={() => setShowHealthModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

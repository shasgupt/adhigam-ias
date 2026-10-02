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

  useEffect(() => {
    fetchAllAdminData();
  }, []);

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
    </div>
  );
};

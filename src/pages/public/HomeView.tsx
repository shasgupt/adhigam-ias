import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Send,
  Mail,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Search,
  Check,
  CreditCard,
  MessageSquare,
  FileText,
  HelpCircle,
  Shield,
  Layers,
} from 'lucide-react';
import { INSTITUTE_CONFIG, RISE_49_TEST_SCHEDULE, ScheduleItem } from '../../data/instituteConfig';
import { AdhigamLogo } from '../../components/AdhigamLogo';
import { api } from '../../lib/api';

interface HomeViewProps {
  onNavigate: (path: string, tab?: 'public' | 'aspirant' | 'admin') => void;
  onOpenEnquire: (courseTitle?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenEnquire }) => {
  // Test Schedule Browser States
  const [activePaperTab, setActivePaperTab] = useState<'all' | 'paper1' | 'paper2' | 'comprehensive'>('all');
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [scheduleExpanded, setScheduleExpanded] = useState(false);

  // Student Query States
  const [queryName, setQueryName] = useState('');
  const [queryEmail, setQueryEmail] = useState('');
  const [queryPhone, setQueryPhone] = useState('');
  const [queryTelegram, setQueryTelegram] = useState('');
  const [queryCategory, setQueryCategory] = useState('RISE 2.0 Enrolment');
  const [queryMessage, setQueryMessage] = useState('');
  const [querySubmitting, setQuerySubmitting] = useState(false);
  const [querySubmittedRef, setQuerySubmittedRef] = useState<string | null>(null);

  // Tracking tab states
  const [trackingMode, setTrackingMode] = useState<'submit' | 'track'>('submit');
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedResults, setTrackedResults] = useState<any[] | null>(null);
  const [trackingError, setTrackingError] = useState('');

  // Dynamic Umbrella Courses (Zero Dummy Data, Admin Managed)
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    api.get<any[]>('/api/courses')
      .then((data) => setCourses(data.filter((c: any) => c.published)))
      .catch(() => setCourses([]));
  }, []);

  // Filtered Schedule
  const filteredSchedule = useMemo(() => {
    return RISE_49_TEST_SCHEDULE.filter((item) => {
      let matchesTab = true;
      if (activePaperTab === 'paper1') matchesTab = item.paper === 'Paper I';
      else if (activePaperTab === 'paper2') matchesTab = item.paper === 'Paper II';
      else if (activePaperTab === 'comprehensive') matchesTab = item.paper === 'Comprehensive' || item.coverage.includes('Comprehensive');

      const matchesSearch =
        scheduleSearch.trim() === '' ||
        item.coverage.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        item.date.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        `test ${item.testNumber}`.includes(scheduleSearch.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activePaperTab, scheduleSearch]);

  const displayedSchedule = scheduleExpanded ? filteredSchedule : filteredSchedule.slice(0, 12);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuerySubmitting(true);
    try {
      const res: any = await api.post('/api/enquiries', {
        name: queryName,
        email: queryEmail,
        phone: queryPhone,
        telegram: queryTelegram,
        category: queryCategory,
        courseKeyOrTitle: 'RISE 2.0 – Sociology Optional Test Series',
        preferredMode: 'online',
        message: queryMessage,
      });

      setQuerySubmittedRef(res?.referenceId || `ADHIGAM-Q-${Math.floor(1000 + Math.random() * 9000)}`);
      setQueryName('');
      setQueryEmail('');
      setQueryPhone('');
      setQueryTelegram('');
      setQueryMessage('');
    } catch (err: any) {
      alert('Error submitting query: ' + (err.message || 'Please contact adhigamias@gmail.com directly.'));
    } finally {
      setQuerySubmitting(false);
    }
  };

  const handleTrackQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    setTrackingLoading(true);
    setTrackingError('');
    setTrackedResults(null);

    try {
      const res: any = await api.get(`/api/enquiries/track?q=${encodeURIComponent(trackingInput.trim())}`);
      if (res && Array.isArray(res.results) && res.results.length > 0) {
        setTrackedResults(res.results);
      } else {
        setTrackingError('No inquiries found for this query reference or email.');
      }
    } catch (err: any) {
      setTrackingError(err.message || 'Failed to track query. Please verify reference or email.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* ========================================================================= */}
      {/* 00 | HERO SECTION: ADHIGAM IAS ACADEMY & FLAGSHIP SPOTLIGHT               */}
      {/* ========================================================================= */}
      <section className="relative bg-[#FDFBF7] text-slate-800 pt-12 pb-16 px-4 border-b border-amber-200/60 overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-200/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Master Academy Header */}
          <div className="flex flex-col items-center text-center space-y-5 max-w-4xl mx-auto">
            <AdhigamLogo size="xl" showText={false} />

            <div className="inline-flex items-center gap-2 bg-[#0F2C59] text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              ADHIGAM IAS • PREMIER ACADEMY FOR UPSC CIVIL SERVICES
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black font-serif-heading text-[#0F2C59] tracking-tight">
                ADHIGAM IAS
              </h1>
              <p className="text-lg sm:text-xl font-bold font-serif-heading text-[#D97706] italic">
                "{INSTITUTE_CONFIG.tagline}"
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest">
                {INSTITUTE_CONFIG.motto}
              </p>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-sans-ui">
              Empowering civil services aspirants through structured pedagogy, rigorous academic mentorship, deep conceptual clarity, and disciplined examination execution.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('/courses')}
                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#0F2C59] bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors cursor-pointer"
              >
                Explore Academy Offerings
              </button>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
              >
                Counselling & Desk
              </button>
            </div>
          </div>

          {/* NEW FLAGSHIP SPOTLIGHT: RISE 2.0 */}
          <div className="bg-gradient-to-br from-[#0F2C59] via-[#143872] to-[#0A1E3D] text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-amber-400/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  New Flagship Programme Launch
                </div>
                <span className="text-xs text-amber-200 font-semibold">
                  Adhigam IAS Academy Flagship • UPSC CSE Mains 2027
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                      Flagship Test Series
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black font-serif-heading text-white">
                      RISE 2.0 – Sociology Optional Test Series
                    </h2>
                    <p className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                      {INSTITUTE_CONFIG.subtitle}
                    </p>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans-ui">
                    {INSTITUTE_CONFIG.examTarget}. Built on the Adhigam IAS standard of discipline, RISE 2.0 provides an intensive 49-test cycle covering Paper I & Paper II with model answers and evaluated copies returned within 3 days.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenEnquire('RISE 2.0 - Early Bird Enrolment (₹7,650)')}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" /> Enrol in RISE 2.0 (Early Bird: ₹7,650)
                    </button>

                    <button
                      onClick={() => {
                        const el = document.getElementById('test-schedule');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-3 border border-white/20 rounded-lg text-xs font-semibold text-white bg-white/10 hover:bg-white/20 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-amber-400" /> View 49-Test Schedule
                    </button>

                    <a
                      href={INSTITUTE_CONFIG.contact.telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-sky-500/20 border border-sky-400/30 hover:bg-sky-500/30 text-sky-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                    >
                      <Send className="w-4 h-4 text-sky-400" /> Telegram: {INSTITUTE_CONFIG.contact.telegram}
                    </a>
                  </div>
                </div>

                {/* Quick Snapshot Badge in Hero Spotlight */}
                <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block border-b border-white/10 pb-2">
                    RISE 2.0 Highlights
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Total Tests</span>
                      <span className="text-lg font-bold text-white">49 Tests</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Marks/Test</span>
                      <span className="text-lg font-bold text-white">50 Marks</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Frequency</span>
                      <span className="text-lg font-bold text-white">Mon • Wed • Fri</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Evaluation</span>
                      <span className="text-lg font-bold text-emerald-400">Within 3 Days</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Early Bird Offer:</span>
                    <span className="font-bold text-amber-300 text-sm">₹7,650</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Key Programme Pillars from PDF Page 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Tests</span>
              <span className="text-xl font-black text-[#0F2C59] block mt-0.5">49 Tests</span>
              <span className="text-[11px] text-slate-500 font-medium">12 Oct – 31 Jan</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Marks / Test</span>
              <span className="text-xl font-black text-[#0F2C59] block mt-0.5">50 Marks</span>
              <span className="text-[11px] text-slate-500 font-medium">Per Session</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Questions</span>
              <span className="text-xl font-black text-[#0F2C59] block mt-0.5">4 Questions</span>
              <span className="text-[11px] text-slate-500 font-medium">10 & 20 Mark Mix</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Weekly Days</span>
              <span className="text-xl font-black text-[#0F2C59] block mt-0.5">Mon • Wed • Fri</span>
              <span className="text-[11px] text-slate-500 font-medium">Disciplined Routine</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Coverage</span>
              <span className="text-xl font-black text-[#0F2C59] block mt-0.5">Paper I & II</span>
              <span className="text-[11px] text-slate-500 font-medium">+ Comprehensive</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Evaluation</span>
              <span className="text-xl font-black text-[#0F2C59] block mt-0.5">Within 3 Days</span>
              <span className="text-[11px] text-slate-500 font-medium">Line-by-Line Remarks</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ADHIGAM IAS ACADEMY PROGRAMMES & CURRICULUM OFFERINGS                     */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F2C59] bg-amber-100 border border-amber-300 px-3 py-1 rounded-md inline-block">
                Academy Programmes & Offerings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-serif-heading text-[#0F2C59]">
                A Comprehensive Ecosystem for Civil Services Excellence
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl font-sans-ui leading-relaxed">
                ADHIGAM IAS operates as a comprehensive academic institution. While <strong className="text-slate-900">RISE 2.0</strong> is our flagship programme for Sociology Optional, our academy nurtures every critical dimension of UPSC preparation through disciplined guidance and structured evaluations.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/courses')}
              className="text-xs font-bold text-[#0F2C59] hover:text-[#D97706] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              View All Academic Offerings <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Academy Offerings / Clean Framework (Zero Dummy Data, Zero Admin Buttons) */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-amber-400 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                        {course.category?.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{course.mode}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#0F2C59] font-serif-heading">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenEnquire(course.title)}
                    className="w-full py-2 bg-[#0F2C59] hover:bg-[#0c2347] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                  >
                    Enquire for Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded inline-block">
                    Academy Programmes Directory
                  </span>
                  <h3 className="text-lg font-bold font-serif-heading text-[#0F2C59]">
                    Upcoming Institute Programmes & Mentorship Modules
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ADHIGAM IAS will publish future batch announcements for General Studies, Optional subjects, and Mentorship modules here upon official release by the academic directorate.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Currently open for admissions: <strong className="text-slate-800">RISE 2.0 Sociology Optional Test Series (49 Tests)</strong>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => onOpenEnquire('Adhigam IAS Upcoming Batches Enrolment Interest')}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs border border-amber-400/40"
                  >
                    Register Enrolment Interest
                  </button>
                  <button
                    onClick={() => onOpenEnquire('Academic Counselling & Course Advice')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                  >
                    Request Counselling
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Adhigam Academic Commitment Banner */}
          <div className="p-4 sm:p-5 bg-slate-900 text-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0">
                AI
              </div>
              <div>
                <span className="font-bold text-white block text-sm">Adhigam Academic Directorate</span>
                <span className="text-slate-400">Structured pedagogy, faculty mentorship, and transparent evaluation criteria.</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenEnquire('Adhigam IAS General Enquiry & Mentorship')}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold transition-colors cursor-pointer"
              >
                Schedule Mentorship Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 01 | WHY RISE 2.0? & THE RISE PRACTICE PROMISE                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
              01 | Why RISE 2.0?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif-heading text-[#0F2C59] mt-3">
              Purposeful, Regular & Feedback-Led Sociology Practice
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4 text-sm text-slate-700 leading-relaxed font-sans-ui">
              <p className="font-semibold text-slate-900 text-base">
                {INSTITUTE_CONFIG.riseWhy}
              </p>
              <p className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 text-amber-950 font-medium leading-relaxed">
                "{INSTITUTE_CONFIG.riseWhySubtext}"
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">UPSC Civil Services Mains 2027 Focus:</p>
                <p>Designed for aspirants targeting maximum score in Sociology Optional with structured question-answer cycles that eliminate exam hall hesitation.</p>
              </div>
            </div>

            {/* The RISE Practice Promise Cards */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                THE RISE PRACTICE PROMISE:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INSTITUTE_CONFIG.risePracticePromise.map((promise, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 hover:border-amber-300 transition-all flex items-start gap-2.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#0F2C59] text-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {promise}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 | PROGRAMME SNAPSHOT & 03 | YOUR TEST-DAY ROUTINE                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Programme Snapshot */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
                02 | Programme Snapshot
              </span>
              <h3 className="text-xl font-bold font-serif-heading text-[#0F2C59] mt-3">
                Key Architectural Elements
              </h3>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Duration</span>
                <span className="font-semibold text-slate-900">{INSTITUTE_CONFIG.duration}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Total Tests</span>
                <span className="font-bold text-[#0F2C59]">{INSTITUTE_CONFIG.totalTests} Tests</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Schedule</span>
                <span className="font-semibold text-slate-900">{INSTITUTE_CONFIG.schedulePattern}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Test Value</span>
                <span className="font-semibold text-slate-900">{INSTITUTE_CONFIG.marksPerTest} marks | 4 questions</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Question Pattern</span>
                <span className="font-semibold text-slate-900">{INSTITUTE_CONFIG.questionPattern}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Submission</span>
                <span className="font-semibold text-slate-900 text-right max-w-xs">{INSTITUTE_CONFIG.submissionMethod}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Model Answer</span>
                <span className="font-semibold text-emerald-700">{INSTITUTE_CONFIG.modelAnswerTime}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Evaluation</span>
                <span className="font-semibold text-indigo-700">{INSTITUTE_CONFIG.evaluationTurnaround}</span>
              </div>
            </div>
          </div>

          {/* Test-Day Routine */}
          <div className="lg:col-span-7 bg-[#0F2C59] text-white rounded-2xl border border-amber-400/20 p-6 sm:p-8 shadow-md space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 border border-amber-400/30 px-3 py-1 rounded-md">
                03 | Your Test-Day Routine
              </span>
              <h3 className="text-xl font-bold font-serif-heading text-white mt-3">
                Disciplined Exam Day Cycle
              </h3>
            </div>

            <div className="space-y-4">
              {INSTITUTE_CONFIG.testDayRoutine.map((step, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3.5">
                  <div className="px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-md font-mono text-xs font-bold shrink-0">
                    {step.time}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {step.action}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Routine Rule Callout Box from PDF */}
            <div className="p-4 bg-amber-400/10 border border-amber-400/30 rounded-xl text-center">
              <p className="text-xs font-bold text-amber-200 leading-relaxed font-sans-ui">
                {INSTITUTE_CONFIG.routineRule}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 | FEE & ENROLMENT TIERS                                                */}
      {/* ========================================================================= */}
      <section id="fees-enrolment" className="max-w-7xl mx-auto px-4 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
            05 | Fee & Enrolment
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif-heading text-[#0F2C59]">
            Choose Your Eligible Fee
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Transparent pricing for the complete 49-test cycle, model answers, and individual evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INSTITUTE_CONFIG.pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all shadow-sm ${
                tier.popular
                  ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/30 shadow-md relative'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {tier.title}
                  </h3>
                  {tier.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded shadow-xs">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black text-[#0F2C59]">
                    {tier.formattedAmount}
                  </div>
                  {tier.discountNote && (
                    <span className="text-xs font-semibold text-emerald-700 block mt-1">
                      {tier.discountNote}
                    </span>
                  )}
                  {tier.validityNote && (
                    <span className="text-xs font-medium text-amber-800 block mt-1">
                      {tier.validityNote}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                  {tier.note}
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onOpenEnquire(`${tier.title} (${tier.formattedAmount})`)}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    tier.popular
                      ? 'bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 border border-amber-400/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Enquire & Enrol <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-600 font-medium">
          Note: Early bird and existing-student fees are separate categories. The existing-student fee is calculated as a 25% discount on the launch price.
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 | COMPLETE 49-TEST SCHEDULE BROWSER                                    */}
      {/* ========================================================================= */}
      <section id="test-schedule" className="max-w-7xl mx-auto px-4 scroll-mt-20">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
                04 | Complete Test Schedule
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-serif-heading text-[#0F2C59] mt-3">
                Full 49-Test Curriculum & Coverage
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Paper I (Fundamentals), Paper II (Indian Society), and Final Comprehensive Tests.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search topic or date (e.g. Thinkers, Caste)..."
                value={scheduleSearch}
                onChange={(e) => setScheduleSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59]"
              />
            </div>
          </div>

          {/* Paper Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <button
              onClick={() => setActivePaperTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activePaperTab === 'all'
                  ? 'bg-[#0F2C59] text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All 49 Tests
            </button>
            <button
              onClick={() => setActivePaperTab('paper1')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activePaperTab === 'paper1'
                  ? 'bg-[#0F2C59] text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Paper I: Fundamentals (Tests 1–22)
            </button>
            <button
              onClick={() => setActivePaperTab('paper2')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activePaperTab === 'paper2'
                  ? 'bg-[#0F2C59] text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Paper II: Indian Society (Tests 23–47)
            </button>
            <button
              onClick={() => setActivePaperTab('comprehensive')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activePaperTab === 'comprehensive'
                  ? 'bg-[#0F2C59] text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Comprehensives (Tests 22, 47, 48, 49)
            </button>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F2C59] text-amber-200 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Test #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Paper</th>
                  <th className="py-3 px-4">Test Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {displayedSchedule.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No tests match your filter or search query.
                    </td>
                  </tr>
                ) : (
                  displayedSchedule.map((test) => (
                    <tr key={test.testNumber} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        #{test.testNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {test.date}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {test.day}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            test.paper === 'Paper I'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : test.paper === 'Paper II'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {test.paper}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {test.coverage}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Show More / Show Less Button */}
          {filteredSchedule.length > 12 && (
            <div className="text-center pt-2">
              <button
                onClick={() => setScheduleExpanded(!scheduleExpanded)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {scheduleExpanded
                  ? `Show Less (Showing all ${filteredSchedule.length})`
                  : `View All ${filteredSchedule.length} Tests in Schedule ↓`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06 | MAKE YOUR PRACTICE COUNT & OFFICIAL CONNECT                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#0F2C59] text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-amber-400/30">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-md">
              06 | Make Your Practice Count
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-serif-heading text-white">
              DON’T JUST STUDY SOCIOLOGY. <br />
              <span className="text-amber-300 font-extrabold tracking-wide">
                LEARN TO EXPRESS IT.
              </span>
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto font-sans-ui pt-1">
              Join RISE 2.0 and make disciplined answer writing a meaningful part of your preparation journey.
            </p>
          </div>

          {/* Official Academy Contacts from PDF */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left pt-4">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">Official Email</span>
              <a href={`mailto:${INSTITUTE_CONFIG.contact.email}`} className="text-xs font-bold text-white hover:underline truncate block">
                {INSTITUTE_CONFIG.contact.email}
              </a>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block">Official Telegram</span>
              <a href={INSTITUTE_CONFIG.contact.telegramLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white hover:underline truncate block">
                {INSTITUTE_CONFIG.contact.telegram}
              </a>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">Official Portal</span>
              <a href={INSTITUTE_CONFIG.contact.website} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white hover:underline truncate block">
                adhigamiasacademy.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* STUDENT QUERY DESK & REAL-TIME TRACKING WORKBENCH                         */}
      {/* ========================================================================= */}
      <section id="student-query-desk" className="max-w-7xl mx-auto px-4 scroll-mt-20">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
                Interactive Student Query Feature
              </span>
              <h2 className="text-2xl font-bold font-serif-heading text-[#0F2C59] mt-2">
                Student Query & Academic Desk
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Submit an inquiry or track your submitted query status directly with ADHIGAM IAS.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setTrackingMode('submit')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  trackingMode === 'submit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Submit New Query
              </button>
              <button
                onClick={() => setTrackingMode('track')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  trackingMode === 'track' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Track Query Status
              </button>
            </div>
          </div>

          {/* MODE 1: SUBMIT NEW QUERY */}
          {trackingMode === 'submit' && (
            <div>
              {querySubmittedRef ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">
                    Your Query Has Been Submitted Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Your inquiry tracking reference is: <strong className="font-mono text-[#0F2C59] text-sm">{querySubmittedRef}</strong>.
                    Our academic team will respond directly via email and Telegram.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => setQuerySubmittedRef(null)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
                    >
                      Submit Another Query
                    </button>
                    <a
                      href={INSTITUTE_CONFIG.contact.telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Message on Telegram
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleQuerySubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aditi Sharma"
                        value={queryName}
                        onChange={(e) => setQueryName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="aspirant@gmail.com"
                        value={queryEmail}
                        onChange={(e) => setQueryEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={queryPhone}
                        onChange={(e) => setQueryPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Telegram Handle</label>
                      <input
                        type="text"
                        placeholder="@username"
                        value={queryTelegram}
                        onChange={(e) => setQueryTelegram(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block font-bold text-slate-700 mb-1">Query Topic</label>
                      <select
                        value={queryCategory}
                        onChange={(e) => setQueryCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59] bg-white font-medium"
                      >
                        <option value="RISE 2.0 Enrolment">RISE 2.0 Enrolment</option>
                        <option value="Early Bird Offer (₹7,650)">Early Bird Offer (₹7,650)</option>
                        <option value="Existing Student Discount (₹6,675)">Existing Student Discount (₹6,675)</option>
                        <option value="Schedule & Syllabus">Schedule & Syllabus</option>
                        <option value="Submission via Telegram">Submission via Telegram / Email</option>
                        <option value="Evaluation Process">3-Day Evaluation Turnaround</option>
                        <option value="Payment / Bank Transfer">Payment / UPI Transfer</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Message / Question *</label>
                      <input
                        type="text"
                        required
                        placeholder="Write your specific question regarding RISE 2.0..."
                        value={queryMessage}
                        onChange={(e) => setQueryMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={querySubmitting}
                      className="px-6 py-2.5 bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {querySubmitting ? 'Sending Query...' : 'Submit Student Query'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* MODE 2: TRACK STATUS */}
          {trackingMode === 'track' && (
            <div className="space-y-4">
              <form onSubmit={handleTrackQuery} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Enter your email (e.g. aarav.singhal@gmail.com) or Reference ID (e.g. ADHIGAM-Q-7341)..."
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59]"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="px-5 py-2 bg-[#0F2C59] text-amber-300 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Search className="w-3.5 h-3.5" />
                  {trackingLoading ? 'Searching...' : 'Track'}
                </button>
              </form>

              {trackingError && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg">
                  {trackingError}
                </div>
              )}

              {trackedResults && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Found {trackedResults.length} Inquir{trackedResults.length === 1 ? 'y' : 'ies'}:
                  </h4>
                  {trackedResults.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {item.referenceId || item.id}
                          </span>
                          <span className="font-semibold text-slate-700">
                            {item.category || item.courseKeyOrTitle}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            item.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'contacted'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Status: {item.status}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Your Question</span>
                        <p className="text-slate-800">{item.message}</p>
                      </div>

                      {item.adminReply ? (
                        <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-200">
                          <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Official Response from ADHIGAM IAS Faculty
                          </span>
                          <p className="text-emerald-950 font-medium">{item.adminReply}</p>
                          {item.repliedAt && (
                            <span className="text-[10px] text-emerald-700 block mt-1 font-mono">
                              Replied: {new Date(item.repliedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="p-2.5 bg-slate-100 rounded-lg text-slate-500 text-[11px] italic">
                          Our academic directorate is reviewing your inquiry. Response will be posted here and sent to your email.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

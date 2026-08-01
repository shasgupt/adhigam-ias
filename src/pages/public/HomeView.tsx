import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  PenTool,
  Clock,
  Layers,
  Users,
  Target,
  FileText,
  Star,
} from 'lucide-react';
import { Course, TestSeries, Article, Quiz, Prompt } from '../../types';
import { api } from '../../lib/api';
import { INSTITUTE_CONFIG } from '../../data/instituteConfig';
import { AdhigamLogo } from '../../components/AdhigamLogo';

interface HomeViewProps {
  onNavigate: (path: string, tab?: 'public' | 'aspirant' | 'admin') => void;
  onOpenEnquire: (courseTitle?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenEnquire }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Course[]>('/api/courses'),
      api.get<TestSeries[]>('/api/test-series'),
      api.get<Article[]>('/api/articles'),
      api.get<Quiz[]>('/api/quizzes'),
      api.get<Prompt[]>('/api/prompts'),
    ])
      .then(([cData, tData, aData, qData, pData]) => {
        setCourses(Array.isArray(cData) ? cData : []);
        setTestSeries(Array.isArray(tData) ? tData : []);
        setArticles(Array.isArray(aData) ? aData : []);
        setQuizzes(Array.isArray(qData) ? qData : []);
        setPrompts(Array.isArray(pData) ? pData : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const featuredCourses = (Array.isArray(courses) ? courses : []).filter((c) => c && c.featured).slice(0, 3);
  const featuredTestSeries = (Array.isArray(testSeries) ? testSeries : []).slice(0, 2);
  const latestArticles = (Array.isArray(articles) ? articles : []).slice(0, 3);
  const todaysPrompt = (Array.isArray(prompts) ? prompts : [])[0];
  const todaysQuiz = (Array.isArray(quizzes) ? quizzes : [])[0];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-[#FDFBF7] text-slate-800 pt-10 pb-16 px-4 border-b border-amber-200/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Executive Badge Header */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-[#0F2C59] text-amber-300 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> UPSC Civil Services 2026/27
              </div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100/80 border border-amber-300/80 px-2.5 py-1 rounded-md hidden sm:inline-block">
                Driven by Discipline, Fueled by Knowledge
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans-ui text-[#0F2C59] tracking-tight leading-tight">
              Precision Coaching for <span className="text-[#D97706] underline decoration-amber-300 decoration-wavy decoration-2">Civil Services</span> Examination.
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-sans-ui">
              Comprehensive GS Foundation, Daily Mains Answer Evaluation with line-by-line feedback, All-India Prelims Mock Series, and One-on-One Mentorship led by former Civil Servants.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onOpenEnquire('GS Integrated Foundation 2026')}
                className="bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer border border-amber-400/30"
              >
                Enroll in New Batch <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <button
                onClick={() => onNavigate('/free')}
                className="px-4 py-2.5 border border-slate-300 rounded-md text-xs font-semibold text-[#0F2C59] bg-white hover:bg-amber-50/50 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#D97706]" /> Free Self-Study Portal
              </button>
            </div>

            {/* System Quick Metrics Cards */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-left max-w-xl">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Selections</p>
                <h3 className="text-xl font-bold mt-1 text-slate-900">{INSTITUTE_CONFIG.stats.topSelectionsCount}</h3>
                <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> Verified Ranks
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Active Aspirants</p>
                <h3 className="text-xl font-bold mt-1 text-slate-900">{INSTITUTE_CONFIG.stats.activeAspirantsCount}</h3>
                <div className="mt-1 flex items-center text-[10px] text-indigo-600 font-medium">
                  Active Enrollment
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Review SLA</p>
                <h3 className="text-xl font-bold mt-1 text-slate-900">{INSTITUTE_CONFIG.stats.answerReviewSla}</h3>
                <div className="mt-1 flex items-center text-[10px] text-slate-500 font-medium">
                  Faculty Feedback
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Interactive Cards & Seal Crest */}
          <div className="lg:col-span-5 space-y-4">
            {/* Official Academy Crest Badge */}
            <div className="bg-[#0F2C59] text-white p-4 rounded-xl border border-amber-400/40 shadow-lg flex items-center gap-4">
              <AdhigamLogo size="lg" showText={false} />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  Official Crest & Motto
                </span>
                <h4 className="font-serif-heading text-sm font-bold text-amber-200">
                  Adhigam IAS Academy
                </h4>
                <p className="text-[11px] text-slate-300 italic">
                  "Driven by Discipline, Fueled by Knowledge"
                </p>
              </div>
            </div>

            {/* Today's Mains Question Spotlight */}
            {todaysPrompt && (
              <div className="bg-slate-900 text-indigo-300 rounded-xl p-5 shadow-xl border border-slate-800">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                    Mains Question of the Day
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {todaysPrompt.paperTag} • {todaysPrompt.maxMarks} Marks
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white font-sans-ui line-clamp-2 mb-2">
                  {todaysPrompt.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed font-mono bg-slate-950 p-3 rounded-md border border-slate-800">
                  "{todaysPrompt.questionText}"
                </p>
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" /> Limit: {todaysPrompt.wordLimit} Words
                  </span>
                  <button
                    onClick={() => onNavigate('/free/answer-writing')}
                    className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    Write & Review <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Daily MCQ Challenge Spotlight */}
            {todaysQuiz && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Daily Prelims Practice
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{todaysQuiz.subjectTag}</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mb-3">
                  {todaysQuiz.title}
                </p>
                <button
                  onClick={() => onNavigate('/free/quizzes')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  Start 5-Min MCQ Test Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-indigo-600 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <Layers className="w-4 h-4" /> Academic Offerings
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans-ui">
              Featured Civil Services Programmes
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/courses')}
            className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            View All Courses ({courses.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-indigo-300 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest border border-indigo-500/30">
                  {course.mode} Batch
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold mb-1">
                    Duration: {course.duration} • Starts {course.startDate}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Fee Structure</span>
                    <span className="text-sm font-bold text-slate-900">{course.fee}</span>
                  </div>
                  <button
                    onClick={() => onOpenEnquire(course.title)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Test Series Section */}
      <section className="bg-slate-900 text-white py-14 px-4 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                <Target className="w-4 h-4 text-indigo-400" /> Exam Simulation
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans-ui text-white tracking-tight">
                All-India Mock Test Series 2026
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/test-series')}
              className="text-xs font-bold uppercase tracking-wider text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              Explore Test Schedules <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredTestSeries.map((ts) => (
              <div
                key={ts.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-500/30">
                      {ts.totalTests} Full Tests
                    </span>
                    <span className="text-xs font-mono text-slate-400">{ts.startDate}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {ts.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {ts.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {ts.schedule.slice(0, 3).map((item) => (
                      <div key={item.testNumber} className="flex items-center justify-between text-xs bg-slate-900/80 p-2.5 rounded-md border border-slate-800 font-mono">
                        <span className="text-slate-200">Test #{item.testNumber}: {item.title}</span>
                        <span className="text-indigo-400 font-bold text-[11px]">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-indigo-300">{ts.fee}</span>
                  <button
                    onClick={() => onOpenEnquire(ts.title)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Join Test Series
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Daily Current Affairs & Editorials */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-indigo-600 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <FileText className="w-4 h-4" /> Editorial Gists
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans-ui text-slate-900 tracking-tight">
              Daily Current Affairs & Syllabus Breakdown
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/free/current-affairs')}
            className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            Browse All Articles <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onNavigate('/free/current-affairs')}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-slate-100 text-slate-800 font-bold text-[10px] px-2 py-0.5 rounded-md border border-slate-200 uppercase tracking-widest">
                    {art.paperTag}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{art.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>By {art.author}</span>
                <span className="text-indigo-600 font-semibold group-hover:underline">Read Article →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial / Toppers Section */}
      <section className="bg-slate-100 border-y border-slate-200 py-14 px-4 text-slate-900">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md">
              Verified Student Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans-ui text-slate-900 mt-3">
              What Civil Services Aspirants Say About Adhigam IAS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex text-amber-500 gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "The 24-hour answer evaluation turnaround and line-by-line faculty feedback transformed my Mains GS-2 and GS-4 presentation. Highly disciplined environment!"
              </p>
              <div>
                <p className="text-xs font-bold text-slate-900">Ananya Mehta</p>
                <p className="text-[10px] text-slate-500 font-mono">UPSC CSE 2024 Ranker Candidate</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex text-amber-500 gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Daily Prelims Quizzes and the Sponge City & Constitutional Discretion gists kept my preparation sharp even during my job hours."
              </p>
              <div>
                <p className="text-xs font-bold text-slate-900">Vikramaditya Singh</p>
                <p className="text-[10px] text-slate-500 font-mono">Working Professional Aspirant</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex text-amber-500 gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Prof. Ananya Roy's Public Administration optional guidance is unmatched. The thinker interlinkages helped me score 290+ in optionals."
              </p>
              <div>
                <p className="text-xs font-bold text-slate-900">Kavya Nair</p>
                <p className="text-[10px] text-slate-500 font-mono">Pub-Ad Optional Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

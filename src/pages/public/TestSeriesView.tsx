import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Send,
  Mail,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Search,
  Download,
  CreditCard,
  Printer,
  ChevronDown,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { INSTITUTE_CONFIG, RISE_49_TEST_SCHEDULE, ScheduleItem } from '../../data/instituteConfig';

export const TestSeriesView: React.FC<{ onOpenEnquire: (title?: string) => void }> = ({ onOpenEnquire }) => {
  const [activePaper, setActivePaper] = useState<'all' | 'paper1' | 'paper2' | 'comprehensive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTests = useMemo(() => {
    return RISE_49_TEST_SCHEDULE.filter((test) => {
      let matchesPaper = true;
      if (activePaper === 'paper1') matchesPaper = test.paper === 'Paper I';
      else if (activePaper === 'paper2') matchesPaper = test.paper === 'Paper II';
      else if (activePaper === 'comprehensive') matchesPaper = test.paper === 'Comprehensive' || test.coverage.includes('Comprehensive');

      const matchesSearch =
        searchQuery.trim() === '' ||
        test.coverage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `test ${test.testNumber}`.includes(searchQuery.toLowerCase());

      return matchesPaper && matchesSearch;
    });
  }, [activePaper, searchQuery]);

  const handlePrintSchedule = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-[#0F2C59] text-white p-8 sm:p-12 rounded-2xl border border-amber-400/30 shadow-xl space-y-6 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> ADHIGAM IAS Flagship Initiative • UPSC Mains 2027
        </div>

        <div className="space-y-2">
          <span className="text-xs text-amber-300 uppercase tracking-widest font-bold block">
            Adhigam IAS Presents
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif-heading text-white">
            RISE 2.0
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold uppercase text-amber-300 tracking-wide">
            SOCIOLOGY OPTIONAL TEST SERIES
          </h2>
          <p className="text-sm font-semibold uppercase text-slate-300 tracking-wider">
            {INSTITUTE_CONFIG.subtitle}
          </p>
          <p className="text-xs sm:text-sm font-bold text-amber-200 uppercase tracking-widest pt-1">
            {INSTITUTE_CONFIG.secondaryTagline}
          </p>
        </div>

        {/* 6 Key Programme Elements Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-white/10 text-left">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">49 Tests</span>
            <span className="text-xs text-slate-300">Total Programme</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">50 Marks / Test</span>
            <span className="text-xs text-slate-300">Exam Weight</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">4 Questions</span>
            <span className="text-xs text-slate-300">10 & 20 Mark Mix</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">Mon • Wed • Fri</span>
            <span className="text-xs text-slate-300">Weekly Cycle</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">Paper I & II</span>
            <span className="text-xs text-slate-300">+ Comprehensives</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">Within 3 Days</span>
            <span className="text-xs text-slate-300">Evaluated Copies</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenEnquire('RISE 2.0 Enrolment (Early Bird: ₹7,650)')}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
          >
            Enrol in RISE 2.0 (Early Bird: ₹7,650)
          </button>
          <a
            href={INSTITUTE_CONFIG.contact.telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" /> Telegram: {INSTITUTE_CONFIG.contact.telegram}
          </a>
        </div>
      </div>

      {/* Routine & Submission Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Programme Snapshot */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-bold font-serif-heading text-[#0F2C59] border-b border-slate-100 pb-3">
            02 | Programme Snapshot
          </h3>
          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider w-1/3">Duration</td>
                <td className="py-2.5 font-semibold text-slate-900">{INSTITUTE_CONFIG.duration}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Total Tests</td>
                <td className="py-2.5 font-bold text-[#0F2C59]">{INSTITUTE_CONFIG.totalTests}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Schedule</td>
                <td className="py-2.5 text-slate-800">{INSTITUTE_CONFIG.schedulePattern}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Test Value</td>
                <td className="py-2.5 text-slate-800">{INSTITUTE_CONFIG.marksPerTest} marks | 4 questions</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Question Pattern</td>
                <td className="py-2.5 text-slate-800">{INSTITUTE_CONFIG.questionPattern}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Submission</td>
                <td className="py-2.5 text-slate-800">{INSTITUTE_CONFIG.submissionMethod}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Model Answer</td>
                <td className="py-2.5 font-bold text-emerald-700">{INSTITUTE_CONFIG.modelAnswerTime}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Evaluation</td>
                <td className="py-2.5 font-bold text-indigo-700">{INSTITUTE_CONFIG.evaluationTurnaround}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Your Test-Day Routine */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-bold font-serif-heading text-white border-b border-slate-800 pb-3">
            03 | Your Test-Day Routine
          </h3>
          <div className="space-y-3">
            {INSTITUTE_CONFIG.testDayRoutine.map((step, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded shrink-0">
                  {step.time}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">{step.action}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-xl text-center">
            <p className="text-xs font-bold text-amber-200">
              {INSTITUTE_CONFIG.routineRule}
            </p>
          </div>
        </div>
      </div>

      {/* Complete 49-Test Schedule Explorer */}
      <div id="full-schedule" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
              04 | Complete Test Schedule
            </span>
            <h3 className="text-xl font-bold font-serif-heading text-[#0F2C59] mt-2">
              All 49 Sociology Optional Tests
            </h3>
            <p className="text-xs text-slate-500">
              Paper I: Fundamentals of Sociology (1–22) • Paper II: Indian Society (23–47) • Final Comprehensives (48–49)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintSchedule}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Schedule
            </button>
          </div>
        </div>

        {/* Paper Tabs & Search Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <button
              onClick={() => setActivePaper('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activePaper === 'all'
                  ? 'bg-[#0F2C59] text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Tests ({RISE_49_TEST_SCHEDULE.length})
            </button>
            <button
              onClick={() => setActivePaper('paper1')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activePaper === 'paper1'
                  ? 'bg-[#0F2C59] text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Paper I (Tests 1–22)
            </button>
            <button
              onClick={() => setActivePaper('paper2')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activePaper === 'paper2'
                  ? 'bg-[#0F2C59] text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Paper II (Tests 23–47)
            </button>
            <button
              onClick={() => setActivePaper('comprehensive')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activePaper === 'comprehensive'
                  ? 'bg-[#0F2C59] text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Comprehensives
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search topic or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59]"
            />
          </div>
        </div>

        {/* Schedule List */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0F2C59] text-amber-200 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Test #</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Day</th>
                <th className="py-2.5 px-4">Paper Division</th>
                <th className="py-2.5 px-4">Test Syllabus & Topic Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTests.map((test) => (
                <tr key={test.testNumber} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                    Test #{test.testNumber}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                    {test.date}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                    {test.day}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
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
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    {test.coverage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-600 font-semibold">
          Programme concludes on 31 January 2027.
        </div>
      </div>

      {/* Fee & Enrolment Section */}
      <div id="fees" className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
            05 | Fee & Enrolment
          </span>
          <h3 className="text-2xl font-bold font-serif-heading text-[#0F2C59]">
            Enrolment Options & Fee Structure
          </h3>
          <p className="text-xs text-slate-600">
            Select your tier and begin your disciplined answer-writing journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INSTITUTE_CONFIG.pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all bg-white ${
                tier.popular
                  ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 uppercase">
                    {tier.title}
                  </h4>
                  {tier.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-3xl font-black text-[#0F2C59]">
                    {tier.formattedAmount}
                  </div>
                  {tier.validityNote && (
                    <span className="text-xs font-medium text-amber-800 block mt-1">
                      {tier.validityNote}
                    </span>
                  )}
                  {tier.discountNote && (
                    <span className="text-xs font-semibold text-emerald-700 block mt-1">
                      {tier.discountNote}
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
                  className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    tier.popular
                      ? 'bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Enquire & Enrol Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

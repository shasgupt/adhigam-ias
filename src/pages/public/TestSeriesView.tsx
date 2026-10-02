import React, { useState, useMemo, useEffect } from 'react';
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
  BookOpen,
} from 'lucide-react';
import { INSTITUTE_CONFIG, RISE_49_TEST_SCHEDULE, ScheduleItem } from '../../data/instituteConfig';
import { fallbackTestSeries } from '../../data/fallbackData';
import { api } from '../../lib/api';
import { TestSeries } from '../../types';

export const TestSeriesView: React.FC<{ onOpenEnquire: (title?: string) => void }> = ({ onOpenEnquire }) => {
  const [allSeries, setAllSeries] = useState<TestSeries[]>(fallbackTestSeries);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(fallbackTestSeries[0]?.id || 'ts_rise_2');
  const [activePaper, setActivePaper] = useState<'all' | 'paper1' | 'paper2' | 'comprehensive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get<TestSeries[]>('/api/test-series')
      .then((data) => {
        if (data && data.length > 0) {
          setAllSeries(data);
          if (!data.find((s) => s.id === selectedSeriesId)) {
            setSelectedSeriesId(data[0].id);
          }
        }
      })
      .catch(() => {
        setAllSeries(fallbackTestSeries);
      });
  }, []);

  const currentSeries = useMemo(() => {
    return allSeries.find((s) => s.id === selectedSeriesId) || allSeries[0] || fallbackTestSeries[0];
  }, [allSeries, selectedSeriesId]);

  const filteredTests = useMemo(() => {
    const list = currentSeries.schedule || [];
    return list.filter((test) => {
      let matchesPaper = true;
      if (activePaper === 'paper1') matchesPaper = test.paper === 'Paper I';
      else if (activePaper === 'paper2') matchesPaper = test.paper === 'Paper II';
      else if (activePaper === 'comprehensive') matchesPaper = Boolean(test.paper === 'Comprehensive' || test.title.includes('Comprehensive') || (test.subjectTag && test.subjectTag.includes('Simulation')));

      const matchesSearch =
        searchQuery.trim() === '' ||
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.subjectTag && test.subjectTag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        `test ${test.testNumber}`.includes(searchQuery.toLowerCase());

      return matchesPaper && matchesSearch;
    });
  }, [currentSeries, activePaper, searchQuery]);

  const handlePrintSchedule = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Series Selection Banner */}
      <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D97706] bg-amber-100/80 px-2.5 py-1 rounded">
              ADHIGAM IAS TEST SERIES WING
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-serif-heading text-[#0F2C59] mt-1.5">
              Select Your Target Mains Test Series
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {allSeries.map((series) => {
              const isSelected = series.id === currentSeries.id;
              return (
                <button
                  key={series.id}
                  onClick={() => {
                    setSelectedSeriesId(series.id);
                    setActivePaper('all');
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F2C59] text-amber-300 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{series.title.split('–')[0].trim()}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'}`}>
                    {series.totalTests} Tests
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-[#0F2C59] text-white p-8 sm:p-12 rounded-2xl border border-amber-400/30 shadow-xl space-y-6 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> {currentSeries.featured ? 'Flagship Initiative' : 'Specialized Cohort'} • UPSC Mains 2027
        </div>

        <div className="space-y-2 max-w-3xl mx-auto">
          <span className="text-xs text-amber-300 uppercase tracking-widest font-bold block">
            Adhigam IAS Presents
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif-heading text-white">
            {currentSeries.title}
          </h1>
          <p className="text-sm font-semibold uppercase text-slate-300 tracking-wider">
            {currentSeries.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-slate-300 pt-2 leading-relaxed">
            {currentSeries.description}
          </p>
        </div>

        {/* Key Programme Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-white/10 text-left">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">{currentSeries.totalTests} Tests</span>
            <span className="text-xs text-slate-300">Total Programme</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">{currentSeries.id === 'ts_rise_2' ? '50 Marks / Test' : '250 Marks / FLT'}</span>
            <span className="text-xs text-slate-300">Exam Weight</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">{currentSeries.id === 'ts_rise_2' ? '4 Questions' : 'UPSC Format'}</span>
            <span className="text-xs text-slate-300">{currentSeries.id === 'ts_rise_2' ? '10 & 20 Mark Mix' : 'Complete 8 Qs Paper'}</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">{currentSeries.id === 'ts_rise_2' ? 'Mon • Wed • Fri' : 'Weekly Mock Cycle'}</span>
            <span className="text-xs text-slate-300">Submission Window</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">Paper I & II</span>
            <span className="text-xs text-slate-300">+ Final Simulations</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">Within 3 Days</span>
            <span className="text-xs text-slate-300">Evaluated Copies</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenEnquire(`${currentSeries.title} (Early Bird: ${currentSeries.earlyBirdFee || currentSeries.fee})`)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
          >
            Enrol Now (Early Bird: {currentSeries.earlyBirdFee || currentSeries.fee})
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
                <td className="py-2.5 font-semibold text-slate-900">{currentSeries.startDate} – {currentSeries.endDate}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Total Tests</td>
                <td className="py-2.5 font-bold text-[#0F2C59]">{currentSeries.totalTests} Tests</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Schedule</td>
                <td className="py-2.5 text-slate-800">{currentSeries.id === 'ts_rise_2' ? INSTITUTE_CONFIG.schedulePattern : 'Every Sunday Mock Exam'}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Early Bird Deadline</td>
                <td className="py-2.5 font-bold text-[#D97706]">{currentSeries.earlyBirdDeadline}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Submission</td>
                <td className="py-2.5 text-slate-800">{INSTITUTE_CONFIG.submissionMethod}</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-wider">Model Answers</td>
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

      {/* Complete Test Schedule Explorer */}
      <div id="full-schedule" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
              04 | Complete Test Schedule
            </span>
            <h3 className="text-xl font-bold font-serif-heading text-[#0F2C59] mt-2">
              {currentSeries.title} ({currentSeries.totalTests} Tests)
            </h3>
            <p className="text-xs text-slate-500">
              Complete chronological breakdown of syllabus topics, paper distribution, and test dates.
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
              All Tests ({currentSeries.schedule?.length || 0})
            </button>
            <button
              onClick={() => setActivePaper('paper1')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activePaper === 'paper1'
                  ? 'bg-[#0F2C59] text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Paper I
            </button>
            <button
              onClick={() => setActivePaper('paper2')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activePaper === 'paper2'
                  ? 'bg-[#0F2C59] text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Paper II
            </button>
            <button
              onClick={() => setActivePaper('comprehensive')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activePaper === 'comprehensive'
                  ? 'bg-[#0F2C59] text-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Comprehensive / Simulations
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search syllabus or test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-3 w-16 text-center">Test #</th>
                <th className="py-3 px-4 w-32">Date & Day</th>
                <th className="py-3 px-3 w-28">Paper</th>
                <th className="py-3 px-4">Syllabus Topic & Coverage</th>
                <th className="py-3 px-4 w-36 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <tr key={test.testNumber} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-900 font-mono">
                      #{test.testNumber}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{test.date}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{test.day}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          test.paper === 'Paper I'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : test.paper === 'Paper II'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {test.paper}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{test.title}</div>
                      {test.subjectTag && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Section: {test.subjectTag}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenEnquire(`${currentSeries.title} - Test #${test.testNumber} (${test.title})`)}
                        className="text-[11px] font-bold text-[#0F2C59] hover:text-[#D97706] hover:underline cursor-pointer"
                      >
                        Enquire Test
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No tests match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
            Transparent pricing for the complete cycle, model answers, and individual evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 p-6 flex flex-col justify-between bg-white shadow-xs">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase">Standard Launch Price</h4>
              <div>
                <div className="text-3xl font-black text-[#0F2C59]">{currentSeries.fee}</div>
                <span className="text-xs text-slate-500 block mt-1">Full access to all {currentSeries.totalTests} tests & evaluations</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                Includes all questions, model answers, and individual line-by-line copies within 3 days.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onOpenEnquire(`${currentSeries.title} - Standard Fee (${currentSeries.fee})`)}
                className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
              >
                Enrol Standard
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-400 ring-2 ring-amber-400/30 p-6 flex flex-col justify-between bg-amber-50/70 shadow-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 uppercase">Early Bird Admission</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  Popular
                </span>
              </div>
              <div>
                <div className="text-3xl font-black text-[#0F2C59]">{currentSeries.earlyBirdFee || currentSeries.fee}</div>
                <span className="text-xs font-medium text-amber-800 block mt-1">
                  Valid until {currentSeries.earlyBirdDeadline}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                Special inaugural rate for aspirants enrolling prior to {currentSeries.earlyBirdDeadline}.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onOpenEnquire(`${currentSeries.title} - Early Bird (${currentSeries.earlyBirdFee || currentSeries.fee})`)}
                className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 cursor-pointer"
              >
                Enrol Early Bird
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 flex flex-col justify-between bg-white shadow-xs">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase">Existing Student Fee</h4>
              <div>
                <div className="text-3xl font-black text-[#0F2C59]">{currentSeries.existingStudentFee || '₹6,675'}</div>
                <span className="text-xs font-semibold text-emerald-700 block mt-1">25% Discount Applied</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                Exclusively for aspirants who enrolled in previous Adhigam IAS programs.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onOpenEnquire(`${currentSeries.title} - Existing Student (${currentSeries.existingStudentFee || '₹6,675'})`)}
                className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
              >
                Enrol with 25% Discount
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

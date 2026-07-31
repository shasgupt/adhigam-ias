import React, { useState, useEffect } from 'react';
import { Course } from '../../types';
import { api } from '../../lib/api';
import { CheckCircle2, Calendar, Clock, GraduationCap, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const CoursesView: React.FC<{ onOpenEnquire: (title?: string) => void }> = ({ onOpenEnquire }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [openModuleIdx, setOpenModuleIdx] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Course[]>('/api/courses')
      .then(setCourses)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterCategory === 'all'
    ? courses
    : courses.filter((c) => c.category === filterCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Page Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-indigo-700 text-xs font-bold uppercase tracking-widest bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md">
          UPSC Civil Services Curriculum
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans-ui text-slate-900 tracking-tight">
          Academic Programmes & Foundation Batches
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Structured 10-Month Foundation Courses, Mains Mastery, CSAT, and Optional Masterclasses led by experienced Civil Services Mentors.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Programmes' },
          { id: 'gs_foundation', label: 'GS Integrated Foundation' },
          { id: 'mains_special', label: 'Mains Answer Writing' },
          { id: 'optional', label: 'Optional Subjects' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer font-bold uppercase tracking-wider text-[11px] ${
              filterCategory === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 bg-slate-900">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-indigo-300 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest border border-indigo-500/30">
                  {course.mode} Batch
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 font-medium mb-1">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-600" /> {course.duration}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-600" /> {course.startDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Key Highlights:</span>
                  {course.overview.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 space-y-3">
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-400 font-medium text-[11px]">Faculty:</span>
                <span className="font-semibold text-slate-800 text-[11px]">{course.facultyNames.join(', ')}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Course Fee</span>
                  <span className="text-sm font-bold text-slate-900">{course.fee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Syllabus
                  </button>
                  <button
                    onClick={() => onOpenEnquire(course.title)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-xs cursor-pointer"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg border border-slate-200">
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-base font-bold p-1 rounded-md"
              >
                ✕
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-500/30">
                {selectedCourse.category.replace('_', ' ')}
              </span>
              <h2 className="text-xl font-bold font-sans-ui text-white mt-2">
                {selectedCourse.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1">{selectedCourse.subtitle}</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">
                  Program Overview & Objectives
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedCourse.overview.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Syllabus Breakdown Accordion */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">
                  Syllabus & Module Architecture
                </h4>
                <div className="space-y-2">
                  {selectedCourse.syllabusModules.map((mod, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setOpenModuleIdx(openModuleIdx === idx ? null : idx)}
                        className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-semibold text-xs text-slate-900 cursor-pointer"
                      >
                        <span>{mod.title}</span>
                        {openModuleIdx === idx ? <ChevronUp className="w-4 h-4 text-indigo-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {openModuleIdx === idx && (
                        <div className="p-4 bg-white border-t border-slate-200 text-xs space-y-1.5">
                          {mod.topics.map((t, tidx) => (
                            <p key={tidx} className="text-slate-600 flex items-center gap-2 font-mono text-[11px]">
                              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                              {t}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Total Course Fee</span>
                  <span className="text-base font-bold text-slate-900">{selectedCourse.fee}</span>
                </div>
                <button
                  onClick={() => {
                    const title = selectedCourse.title;
                    setSelectedCourse(null);
                    onOpenEnquire(title);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                >
                  Proceed to Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

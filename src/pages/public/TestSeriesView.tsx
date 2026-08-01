import React, { useState, useEffect } from 'react';
import { TestSeries } from '../../types';
import { api } from '../../lib/api';
import { Calendar, Target, CheckCircle2, Award, Clock, ArrowRight } from 'lucide-react';

export const TestSeriesView: React.FC<{ onOpenEnquire: (title?: string) => void }> = ({ onOpenEnquire }) => {
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<TestSeries | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<TestSeries[]>('/api/test-series')
      .then((data) => setTestSeries(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
          All India Prelims & Mains Benchmarking
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading text-slate-900">
          UPSC Simulated Test Series 2026
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Tested by thousands of successful aspirants across India. Strict UPSC negative marking algorithms, All-India rankings, and detailed model solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {testSeries.map((ts) => (
          <div
            key={ts.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full">
                  {ts.type.toUpperCase()} Series ({ts.totalTests} Tests)
                </span>
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" /> Starts {ts.startDate}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold font-serif-heading text-slate-900">
                  {ts.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {ts.description}
                </p>
              </div>

              {/* Sample Schedule Preview */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Upcoming Test Schedule:
                </h4>
                {ts.schedule.slice(0, 4).map((test) => (
                  <div
                    key={test.testNumber}
                    className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200"
                  >
                    <span className="font-semibold text-slate-800">
                      Test #{test.testNumber}: {test.title}
                    </span>
                    <span className="text-amber-700 font-mono text-[11px] font-bold">
                      {test.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Test Series Fee</span>
                <span className="text-lg font-bold text-amber-300">{ts.fee}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedSeries(ts)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Full Schedule
                </button>
                <button
                  onClick={() => onOpenEnquire(ts.title)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Schedule Modal */}
      {selectedSeries && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="bg-slate-950 text-white p-6 relative">
              <button
                onClick={() => setSelectedSeries(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
              <h3 className="text-xl font-bold font-serif-heading text-amber-100">
                {selectedSeries.title} - Complete Schedule
              </h3>
              <p className="text-xs text-slate-300 mt-1">{selectedSeries.totalTests} Comprehensive & Sectional Papers</p>
            </div>

            <div className="p-6 space-y-3">
              {selectedSeries.schedule.map((st) => (
                <div key={st.testNumber} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Test #{st.testNumber}: {st.title}</span>
                    <span className="text-slate-500 text-[11px]">Subject: {st.subjectTag}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded border border-amber-300">
                    {st.date}
                  </span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-200 text-right">
                <button
                  onClick={() => {
                    const title = selectedSeries.title;
                    setSelectedSeries(null);
                    onOpenEnquire(title);
                  }}
                  className="bg-amber-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-amber-500 transition-colors"
                >
                  Enquire for Test Series
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

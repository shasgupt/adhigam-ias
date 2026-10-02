import React, { useState } from 'react';
import { TestSeries, TestSeriesScheduleItem } from '../../../types';
import { api } from '../../../lib/api';
import { RISE_49_TEST_SCHEDULE } from '../../../data/instituteConfig';
import {
  FileSpreadsheet,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Layers,
  Award,
  Copy,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Tag,
  Check,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface TestSeriesCMSProps {
  testSeries: TestSeries[];
  onRefresh: () => void;
  onOpenCreate?: boolean;
}

export const TestSeriesCMS: React.FC<TestSeriesCMSProps> = ({
  testSeries,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft'>('all');
  
  // Modals
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<TestSeries | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'details' | 'schedule'>('details');
  const [saving, setSaving] = useState(false);
  
  // Schedule Explorer / In-line manager modal
  const [selectedSeriesForSchedule, setSelectedSeriesForSchedule] = useState<TestSeries | null>(null);
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [schedulePaperFilter, setSchedulePaperFilter] = useState<string>('all');
  
  // Add single test inside schedule explorer modal
  const [isAddingSingleTest, setIsAddingSingleTest] = useState(false);
  const [newSingleTestNum, setNewSingleTestNum] = useState<number>(1);
  const [newSingleTestTitle, setNewSingleTestTitle] = useState('');
  const [newSingleTestDate, setNewSingleTestDate] = useState('');
  const [newSingleTestDay, setNewSingleTestDay] = useState('Monday');
  const [newSingleTestPaper, setNewSingleTestPaper] = useState<'Paper I' | 'Paper II' | 'Comprehensive'>('Paper I');
  const [newSingleTestTag, setNewSingleTestTag] = useState('');
  const [newSingleTestSyllabus, setNewSingleTestSyllabus] = useState('');

  // Editing single test inside schedule explorer
  const [editingScheduleItemIdx, setEditingScheduleItemIdx] = useState<number | null>(null);
  const [editScheduleItemData, setEditScheduleItemData] = useState<TestSeriesScheduleItem | null>(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Form states for Create / Edit
  const [title, setTitle] = useState('');
  const [key, setKey] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [type, setType] = useState<'prelims' | 'mains' | 'integrated' | 'optional'>('mains');
  const [totalTests, setTotalTests] = useState(49);
  const [fee, setFee] = useState('₹8,900');
  const [earlyBirdFee, setEarlyBirdFee] = useState('₹7,650');
  const [existingStudentFee, setExistingStudentFee] = useState('₹6,675');
  const [earlyBirdDeadline, setEarlyBirdDeadline] = useState('9 October 2026');
  const [startDate, setStartDate] = useState('12 October 2026');
  const [endDate, setEndDate] = useState('31 January 2027');
  const [mode, setMode] = useState<'online' | 'offline' | 'hybrid'>('online');
  const [featured, setFeatured] = useState(true);
  const [published, setPublished] = useState(true);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800');
  const [scheduleItems, setScheduleItems] = useState<TestSeriesScheduleItem[]>([]);

  // Bulk schedule input state
  const [bulkScheduleText, setBulkScheduleText] = useState('');
  const [showBulkScheduleInput, setShowBulkScheduleInput] = useState(false);

  // New item row inside modal schedule tab
  const [formTestNum, setFormTestNum] = useState<number>(1);
  const [formTestTitle, setFormTestTitle] = useState('');
  const [formTestDate, setFormTestDate] = useState('');
  const [formTestDay, setFormTestDay] = useState('Monday');
  const [formTestPaper, setFormTestPaper] = useState<'Paper I' | 'Paper II' | 'Comprehensive'>('Paper I');
  const [formTestTag, setFormTestTag] = useState('');
  const [formTestSyllabus, setFormTestSyllabus] = useState('');

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setKey(`test-series-${Date.now().toString().slice(-4)}`);
    setSubtitle('Regular Improvement & Answer Writing Programme for UPSC CSE Mains 2027');
    setType('mains');
    setTotalTests(49);
    setFee('₹8,900');
    setEarlyBirdFee('₹7,650');
    setExistingStudentFee('₹6,675');
    setEarlyBirdDeadline('9 October 2026');
    setStartDate('12 October 2026');
    setEndDate('31 January 2027');
    setMode('online');
    setFeatured(true);
    setPublished(true);
    setDescription('A structured answer-writing programme for UPSC Civil Services Mains 2027. 49 Tests (50 Marks/Test, 4 Questions Each with 10- and 20-mark mix) on Monday, Wednesday, and Friday. Complete Paper I, Paper II, and Final Comprehensive tests with model answers and evaluated copies within 3 days.');
    setImage('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800');
    
    // Default to the 49 test schedule
    const defaultSchedule = RISE_49_TEST_SCHEDULE.map((s) => ({
      testNumber: s.testNumber,
      title: s.coverage,
      date: s.date,
      day: s.day,
      paper: s.paper as any,
      subjectTag: s.section,
      syllabus: `${s.section} - ${s.coverage}`,
    }));
    setScheduleItems(defaultSchedule);
    setFormTestNum(defaultSchedule.length + 1);
    setActiveModalTab('details');
    setIsCreating(true);
  };

  const openEditModal = (t: TestSeries) => {
    setEditingItem(t);
    setTitle(t.title);
    setKey(t.key);
    setSubtitle(t.subtitle || '');
    setType(t.type as any);
    setTotalTests(t.totalTests || (t.schedule ? t.schedule.length : 10));
    setFee(t.fee);
    setEarlyBirdFee(t.earlyBirdFee || '');
    setExistingStudentFee(t.existingStudentFee || '');
    setEarlyBirdDeadline(t.earlyBirdDeadline || '');
    setStartDate(t.startDate || '');
    setEndDate(t.endDate || '');
    setMode(t.mode as any);
    setFeatured(Boolean(t.featured));
    setPublished(Boolean(t.published ?? true));
    setDescription(t.description);
    setImage(t.image || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800');
    
    const initialSchedule = (t.schedule || []).map((s, idx) => ({
      testNumber: s.testNumber || idx + 1,
      title: s.title,
      date: s.date || 'To be announced',
      day: s.day || '',
      paper: s.paper || 'Paper I',
      subjectTag: s.subjectTag || '',
      syllabus: s.syllabus || s.title,
    }));
    setScheduleItems(initialSchedule);
    setFormTestNum(initialSchedule.length + 1);
    setActiveModalTab('details');
    setIsCreating(true);
  };

  // Preset loaders for schedule
  const loadRise2Preset = () => {
    const riseSchedule = RISE_49_TEST_SCHEDULE.map((s) => ({
      testNumber: s.testNumber,
      title: s.coverage,
      date: s.date,
      day: s.day,
      paper: s.paper as any,
      subjectTag: s.section,
      syllabus: `${s.section} - ${s.coverage}`,
    }));
    setScheduleItems(riseSchedule);
    setTotalTests(riseSchedule.length);
    setFormTestNum(riseSchedule.length + 1);
    showToast('Loaded RISE 2.0 (49 Tests) schedule template');
  };

  const load10TestPreset = () => {
    const mock10: TestSeriesScheduleItem[] = Array.from({ length: 10 }).map((_, idx) => ({
      testNumber: idx + 1,
      title: `Mock Test ${idx + 1}: ${idx < 4 ? 'Paper I Unit ' + (idx + 1) : idx < 8 ? 'Paper II Section ' + (idx - 3) : 'Full Syllabus Comprehensive ' + (idx - 7)}`,
      date: `Week ${idx + 1}`,
      day: idx % 2 === 0 ? 'Monday' : 'Wednesday',
      paper: idx < 4 ? 'Paper I' : idx < 8 ? 'Paper II' : 'Comprehensive',
      subjectTag: idx < 4 ? 'Paper I' : idx < 8 ? 'Paper II' : 'Comprehensive',
      syllabus: 'Sectional analysis and UPSC answer evaluation rubric.',
    }));
    setScheduleItems(mock10);
    setTotalTests(10);
    setFormTestNum(11);
    showToast('Loaded 10-Test Mock template');
  };

  const handleAddScheduleItemToForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTestTitle.trim()) return;

    const newItem: TestSeriesScheduleItem = {
      testNumber: formTestNum || scheduleItems.length + 1,
      title: formTestTitle.trim(),
      date: formTestDate.trim() || 'Flexible Date',
      day: formTestDay,
      paper: formTestPaper,
      subjectTag: formTestTag.trim(),
      syllabus: formTestSyllabus.trim() || formTestTitle.trim(),
    };

    const updated = [...scheduleItems, newItem];
    setScheduleItems(updated);
    setTotalTests(updated.length);
    setFormTestNum(updated.length + 1);
    setFormTestTitle('');
    setFormTestDate('');
    setFormTestTag('');
    setFormTestSyllabus('');
  };

  const handleRemoveScheduleItemFromForm = (index: number) => {
    const updated = scheduleItems.filter((_, idx) => idx !== index);
    setScheduleItems(updated);
    setTotalTests(updated.length);
    setFormTestNum(updated.length + 1);
  };

  const handleApplyBulkSchedule = () => {
    if (!bulkScheduleText.trim()) return;
    const lines = bulkScheduleText.split('\n').filter((l) => l.trim().length > 0);
    const parsed: TestSeriesScheduleItem[] = lines.map((line, idx) => {
      // Allow format: "Test 1 | 12-Oct-2026 | Paper I | Topic" or simple topic per line
      const parts = line.split('|').map((p) => p.trim());
      if (parts.length >= 4) {
        return {
          testNumber: idx + 1,
          title: parts[3] || parts[0],
          date: parts[1] || 'Flexible',
          paper: (parts[2] === 'Paper II' ? 'Paper II' : parts[2] === 'Comprehensive' ? 'Comprehensive' : 'Paper I') as any,
          syllabus: parts[3] || parts[0],
        };
      } else {
        return {
          testNumber: idx + 1,
          title: line.trim(),
          date: 'Scheduled Cycle',
          paper: idx >= 22 ? (idx >= 47 ? 'Comprehensive' : 'Paper II') : 'Paper I',
          syllabus: line.trim(),
        };
      }
    });

    setScheduleItems(parsed);
    setTotalTests(parsed.length);
    setFormTestNum(parsed.length + 1);
    setShowBulkScheduleInput(false);
    setBulkScheduleText('');
    showToast(`Imported ${parsed.length} tests into schedule`);
  };

  // Save handler for Create / Edit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a test series title', 'error');
      return;
    }

    setSaving(true);
    const finalSchedule = scheduleItems.map((item, idx) => ({
      testNumber: item.testNumber || idx + 1,
      title: item.title,
      date: item.date || 'Flexible',
      day: item.day,
      paper: item.paper || 'Paper I',
      subjectTag: item.subjectTag,
      syllabus: item.syllabus || item.title,
    }));

    const payload = {
      key: key || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: title.trim(),
      subtitle: subtitle.trim(),
      type,
      totalTests: finalSchedule.length > 0 ? finalSchedule.length : Number(totalTests),
      fee: fee.trim(),
      earlyBirdFee: earlyBirdFee.trim(),
      existingStudentFee: existingStudentFee.trim(),
      earlyBirdDeadline: earlyBirdDeadline.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      mode,
      featured,
      published,
      description: description.trim(),
      image: image.trim(),
      schedule: finalSchedule,
    };

    try {
      if (editingItem) {
        await api.put(`/api/admin/test-series/${editingItem.id}`, payload);
        showToast(`Updated "${title}" successfully`);
      } else {
        await api.post('/api/admin/test-series', payload);
        showToast(`Created new test series "${title}"`);
      }
      setIsCreating(false);
      setEditingItem(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error saving test series', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Live / Draft status directly
  const handleTogglePublish = async (t: TestSeries) => {
    const newStatus = !(t.published ?? true);
    try {
      await api.put(`/api/admin/test-series/${t.id}`, { published: newStatus });
      showToast(`Set "${t.title}" to ${newStatus ? 'LIVE' : 'DRAFT'}`);
      onRefresh();
    } catch (err: any) {
      showToast('Failed to toggle status: ' + err.message, 'error');
    }
  };

  // Toggle Featured status directly
  const handleToggleFeatured = async (t: TestSeries) => {
    const newFeatured = !t.featured;
    try {
      await api.put(`/api/admin/test-series/${t.id}`, { featured: newFeatured });
      showToast(`Updated featured status for "${t.title}"`);
      onRefresh();
    } catch (err: any) {
      showToast('Failed to toggle featured: ' + err.message, 'error');
    }
  };

  // Duplicate / Clone package
  const handleDuplicate = async (t: TestSeries) => {
    const cloneTitle = `${t.title} (Batch ${Date.now().toString().slice(-3)})`;
    const cloneKey = `${t.key}-batch-${Date.now().toString().slice(-3)}`;
    const payload = {
      ...t,
      title: cloneTitle,
      key: cloneKey,
      published: false, // create as draft so faculty can adjust dates
      featured: false,
    };
    delete (payload as any).id;
    delete (payload as any).createdAt;

    try {
      await api.post('/api/admin/test-series', payload);
      showToast(`Duplicated "${t.title}" as Draft "${cloneTitle}"`);
      onRefresh();
    } catch (err: any) {
      showToast('Failed to duplicate: ' + err.message, 'error');
    }
  };

  // Delete package
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete test series "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/api/admin/test-series/${id}`);
      showToast(`Deleted test series "${name}"`);
      if (selectedSeriesForSchedule?.id === id) {
        setSelectedSeriesForSchedule(null);
      }
      onRefresh();
    } catch (err: any) {
      showToast('Failed to delete: ' + err.message, 'error');
    }
  };

  // Schedule Explorer: Add single test to existing test series
  const handleAddSingleTestToSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeriesForSchedule || !newSingleTestTitle.trim()) return;

    const currentSchedule = selectedSeriesForSchedule.schedule || [];
    const newTest: TestSeriesScheduleItem = {
      testNumber: newSingleTestNum || currentSchedule.length + 1,
      title: newSingleTestTitle.trim(),
      date: newSingleTestDate.trim() || 'Flexible Date',
      day: newSingleTestDay,
      paper: newSingleTestPaper,
      subjectTag: newSingleTestTag.trim(),
      syllabus: newSingleTestSyllabus.trim() || newSingleTestTitle.trim(),
    };

    const updatedSchedule = [...currentSchedule, newTest];
    try {
      await api.put(`/api/admin/test-series/${selectedSeriesForSchedule.id}`, {
        schedule: updatedSchedule,
        totalTests: updatedSchedule.length,
      });

      setSelectedSeriesForSchedule({
        ...selectedSeriesForSchedule,
        schedule: updatedSchedule,
        totalTests: updatedSchedule.length,
      });
      setIsAddingSingleTest(false);
      setNewSingleTestTitle('');
      setNewSingleTestDate('');
      setNewSingleTestTag('');
      setNewSingleTestSyllabus('');
      setNewSingleTestNum(updatedSchedule.length + 1);
      showToast(`Added Test #${newTest.testNumber} to schedule`);
      onRefresh();
    } catch (err: any) {
      showToast('Error adding test: ' + err.message, 'error');
    }
  };

  // Schedule Explorer: Delete single test
  const handleDeleteSingleTestFromSeries = async (testNumber: number) => {
    if (!selectedSeriesForSchedule) return;
    if (!window.confirm(`Delete Test #${testNumber} from schedule?`)) return;

    const updatedSchedule = (selectedSeriesForSchedule.schedule || []).filter(
      (item) => item.testNumber !== testNumber
    );

    try {
      await api.put(`/api/admin/test-series/${selectedSeriesForSchedule.id}`, {
        schedule: updatedSchedule,
        totalTests: updatedSchedule.length,
      });

      setSelectedSeriesForSchedule({
        ...selectedSeriesForSchedule,
        schedule: updatedSchedule,
        totalTests: updatedSchedule.length,
      });
      showToast(`Removed Test #${testNumber}`);
      onRefresh();
    } catch (err: any) {
      showToast('Error deleting test: ' + err.message, 'error');
    }
  };

  // Schedule Explorer: Save edited single test
  const handleSaveSingleTestEdit = async (idx: number) => {
    if (!selectedSeriesForSchedule || !editScheduleItemData) return;

    const currentSchedule = [...(selectedSeriesForSchedule.schedule || [])];
    currentSchedule[idx] = editScheduleItemData;

    try {
      await api.put(`/api/admin/test-series/${selectedSeriesForSchedule.id}`, {
        schedule: currentSchedule,
      });

      setSelectedSeriesForSchedule({
        ...selectedSeriesForSchedule,
        schedule: currentSchedule,
      });
      setEditingScheduleItemIdx(null);
      setEditScheduleItemData(null);
      showToast(`Saved changes for Test #${editScheduleItemData.testNumber}`);
      onRefresh();
    } catch (err: any) {
      showToast('Error updating test: ' + err.message, 'error');
    }
  };

  // Filter test series packages
  const filtered = testSeries.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.subtitle && t.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.schedule && t.schedule.some((s) => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || (s.syllabus && s.syllabus.toLowerCase().includes(searchTerm.toLowerCase()))));
    
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'live'
        ? t.published !== false
        : t.published === false;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalTestsAcrossAll = testSeries.reduce((acc, curr) => acc + (curr.totalTests || curr.schedule?.length || 0), 0);
  const liveCount = testSeries.filter((t) => t.published !== false).length;
  const draftCount = testSeries.filter((t) => t.published === false).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Controls & Quick Summary */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 text-amber-700 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold font-serif-heading text-slate-900">
              Test Series & Evaluation Packages Manager
            </h3>
            <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
              {testSeries.length} Packages ({totalTestsAcrossAll} Tests)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, duplicate, schedule, and publish official test series (e.g. RISE 2.0 Sociology Optional) with full CRUD operations directly from this dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch md:self-auto shrink-0">
          <button
            onClick={openCreateModal}
            className="flex-1 md:flex-none bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Test Series Package
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Packages</span>
          <span className="text-xl font-bold font-serif-heading text-slate-900 mt-0.5 block">{testSeries.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Live & Published</span>
          <span className="text-xl font-bold font-serif-heading text-emerald-700 mt-0.5 block">{liveCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Draft / In Review</span>
          <span className="text-xl font-bold font-serif-heading text-slate-600 mt-0.5 block">{draftCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Total Scheduled Tests</span>
          <span className="text-xl font-bold font-serif-heading text-amber-700 mt-0.5 block">{totalTestsAcrossAll} Tests</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search test series by title, syllabus topics, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-amber-500 bg-slate-50/50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-amber-500 bg-white font-medium text-slate-700"
          >
            <option value="all">All Disciplines</option>
            <option value="mains">Mains Answer Writing</option>
            <option value="optional">Optional Subject</option>
            <option value="prelims">Prelims Mock Series</option>
            <option value="integrated">Integrated P+M</option>
          </select>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({testSeries.length})
          </button>
          <button
            onClick={() => setStatusFilter('live')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              statusFilter === 'live' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live ({liveCount})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              statusFilter === 'draft' ? 'bg-slate-700 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>
      </div>

      {/* Test Series Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No test series packages found</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search terms or filters.'
              : 'Get started by creating your first test series package (such as RISE 2.0 Sociology Optional).'}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Test Series Package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => {
            const scheduleCount = t.schedule ? t.schedule.length : t.totalTests;
            const isLive = t.published !== false;

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Card Top */}
                <div className="p-5 space-y-4">
                  {/* Badges Bar */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200/60">
                        {t.type} Optional/Mains
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {t.mode}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* One-click toggle publish button */}
                      <button
                        onClick={() => handleTogglePublish(t)}
                        title={isLive ? 'Click to set as Draft' : 'Click to publish Live'}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 transition-colors cursor-pointer ${
                          isLive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                        {isLive ? 'Live' : 'Draft'}
                      </button>

                      {/* Featured Star toggle */}
                      <button
                        onClick={() => handleToggleFeatured(t)}
                        title={t.featured ? 'Featured on home' : 'Click to feature on home'}
                        className={`p-1 rounded-md border transition-colors cursor-pointer ${
                          t.featured
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${t.featured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-base font-serif-heading line-clamp-2">
                      {t.title}
                    </h4>
                    {t.subtitle && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{t.subtitle}</p>
                    )}
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>

                  {/* Fee & Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee Structure</span>
                      <span className="font-bold text-slate-900 block truncate">{t.fee}</span>
                      {t.earlyBirdFee && (
                        <span className="text-[10px] font-bold text-emerald-700 block truncate">
                          Early: {t.earlyBirdFee}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Tests</span>
                      <span className="font-bold text-amber-700 block">
                        {scheduleCount} Tests
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {t.startDate ? `Starts ${t.startDate}` : 'Immediate'}
                      </span>
                    </div>
                  </div>

                  {/* Schedule quick preview */}
                  <div className="bg-indigo-50/40 rounded-xl p-2.5 border border-indigo-100/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-700 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">
                        {scheduleCount} Scheduled Tests
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedSeriesForSchedule(t)}
                      className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Manage Schedule
                    </button>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedSeriesForSchedule(t)}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Inspect full test schedule"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      <span>Schedule</span>
                    </button>

                    <button
                      onClick={() => handleDuplicate(t)}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Duplicate as new batch"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Clone</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(t)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.title)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      title="Delete test series"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCHEDULE EXPLORER & IN-LINE SCHEDULE MANAGER MODAL                        */}
      {/* ========================================================================= */}
      {selectedSeriesForSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-100 text-amber-800 rounded-md">
                    <FileSpreadsheet className="w-4 h-4" />
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-serif-heading text-slate-900">
                    Schedule Breakdown: {selectedSeriesForSchedule.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Manage individual test dates, paper assignments (Paper I, Paper II, Comprehensive), syllabus coverage, and add new tests to this package.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSeriesForSchedule(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Filter and Add Test Toolbar inside Schedule Explorer */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tests by keyword, topic, date..."
                    value={scheduleSearch}
                    onChange={(e) => setScheduleSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-amber-500 bg-white"
                  />
                </div>

                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setSchedulePaperFilter('all')}
                    className={`px-2.5 py-1 rounded-md font-semibold ${
                      schedulePaperFilter === 'all' ? 'bg-amber-600 text-white font-bold' : 'text-slate-600'
                    }`}
                  >
                    All ({selectedSeriesForSchedule.schedule?.length || 0})
                  </button>
                  <button
                    onClick={() => setSchedulePaperFilter('Paper I')}
                    className={`px-2.5 py-1 rounded-md font-semibold ${
                      schedulePaperFilter === 'Paper I' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
                    }`}
                  >
                    Paper I
                  </button>
                  <button
                    onClick={() => setSchedulePaperFilter('Paper II')}
                    className={`px-2.5 py-1 rounded-md font-semibold ${
                      schedulePaperFilter === 'Paper II' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'
                    }`}
                  >
                    Paper II
                  </button>
                  <button
                    onClick={() => setSchedulePaperFilter('Comprehensive')}
                    className={`px-2.5 py-1 rounded-md font-semibold ${
                      schedulePaperFilter === 'Comprehensive' ? 'bg-purple-600 text-white font-bold' : 'text-slate-600'
                    }`}
                  >
                    Comprehensives
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsAddingSingleTest(!isAddingSingleTest);
                  setNewSingleTestNum((selectedSeriesForSchedule.schedule?.length || 0) + 1);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingSingleTest ? 'Close Form' : 'Add Test to Schedule'}</span>
              </button>
            </div>

            {/* In-Line Add Single Test Form */}
            {isAddingSingleTest && (
              <form onSubmit={handleAddSingleTestToSeries} className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-amber-600" /> Add New Test #{newSingleTestNum}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingSingleTest(false)}
                    className="text-amber-800 text-xs font-bold hover:underline"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Test #</label>
                    <input
                      type="number"
                      required
                      value={newSingleTestNum}
                      onChange={(e) => setNewSingleTestNum(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Coverage / Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Unit 3: Karl Marx & Historical Materialism"
                      value={newSingleTestTitle}
                      onChange={(e) => setNewSingleTestTitle(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Paper</label>
                    <select
                      value={newSingleTestPaper}
                      onChange={(e) => setNewSingleTestPaper(e.target.value as any)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white text-xs"
                    >
                      <option value="Paper I">Paper I</option>
                      <option value="Paper II">Paper II</option>
                      <option value="Comprehensive">Comprehensive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date</label>
                    <input
                      type="text"
                      placeholder="e.g. 15-10-2026"
                      value={newSingleTestDate}
                      onChange={(e) => setNewSingleTestDate(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Day of Week</label>
                    <input
                      type="text"
                      placeholder="e.g. Monday"
                      value={newSingleTestDay}
                      onChange={(e) => setNewSingleTestDay(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Section / Subject Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Unit 3: Sociological Thinkers"
                      value={newSingleTestTag}
                      onChange={(e) => setNewSingleTestTag(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block font-semibold text-slate-700 mb-1">Syllabus Details</label>
                    <textarea
                      rows={2}
                      placeholder="Detailed topics covered in this test..."
                      value={newSingleTestSyllabus}
                      onChange={(e) => setNewSingleTestSyllabus(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg outline-none bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-xs"
                  >
                    Save Test #{newSingleTestNum} to Schedule
                  </button>
                </div>
              </form>
            )}

            {/* Tests List in Explorer */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-[300px]">
              {(() => {
                const currentSchedule = selectedSeriesForSchedule.schedule || [];
                const filteredSchedule = currentSchedule.filter((item) => {
                  const matchesSearch =
                    scheduleSearch.trim() === '' ||
                    item.title.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
                    (item.syllabus && item.syllabus.toLowerCase().includes(scheduleSearch.toLowerCase())) ||
                    (item.subjectTag && item.subjectTag.toLowerCase().includes(scheduleSearch.toLowerCase())) ||
                    `test ${item.testNumber}`.includes(scheduleSearch.toLowerCase()) ||
                    (item.date && item.date.toLowerCase().includes(scheduleSearch.toLowerCase()));

                  const matchesPaper =
                    schedulePaperFilter === 'all' || item.paper === schedulePaperFilter;

                  return matchesSearch && matchesPaper;
                });

                if (filteredSchedule.length === 0) {
                  return (
                    <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-slate-100">
                      No tests match your filter criteria in this schedule.
                    </div>
                  );
                }

                return filteredSchedule.map((item, idx) => {
                  const originalIndex = currentSchedule.findIndex((s) => s.testNumber === item.testNumber);
                  const isEditingThis = editingScheduleItemIdx === originalIndex;

                  if (isEditingThis && editScheduleItemData) {
                    return (
                      <div
                        key={item.testNumber}
                        className="p-3 bg-amber-50/70 border border-amber-300 rounded-xl space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900">
                            Editing Test #{editScheduleItemData.testNumber}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSaveSingleTestEdit(originalIndex)}
                              className="px-3 py-1 bg-amber-600 text-white rounded-md font-bold text-[11px] shadow-xs hover:bg-amber-500"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingScheduleItemIdx(null);
                                setEditScheduleItemData(null);
                              }}
                              className="px-2.5 py-1 bg-white border border-slate-300 text-slate-600 rounded-md font-semibold text-[11px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Title / Coverage</label>
                            <input
                              type="text"
                              value={editScheduleItemData.title}
                              onChange={(e) =>
                                setEditScheduleItemData({ ...editScheduleItemData, title: e.target.value })
                              }
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Date</label>
                            <input
                              type="text"
                              value={editScheduleItemData.date}
                              onChange={(e) =>
                                setEditScheduleItemData({ ...editScheduleItemData, date: e.target.value })
                              }
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Paper</label>
                            <select
                              value={editScheduleItemData.paper}
                              onChange={(e) =>
                                setEditScheduleItemData({ ...editScheduleItemData, paper: e.target.value as any })
                              }
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white"
                            >
                              <option value="Paper I">Paper I</option>
                              <option value="Paper II">Paper II</option>
                              <option value="Comprehensive">Comprehensive</option>
                            </select>
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Syllabus Details</label>
                            <input
                              type="text"
                              value={editScheduleItemData.syllabus || ''}
                              onChange={(e) =>
                                setEditScheduleItemData({ ...editScheduleItemData, syllabus: e.target.value })
                              }
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.testNumber}
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-lg bg-slate-900 text-amber-300 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                          {item.testNumber}
                        </span>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bold text-slate-900">
                              {item.title}
                            </h5>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded ${
                                item.paper === 'Paper I'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : item.paper === 'Paper II'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {item.paper || 'Paper I'}
                            </span>
                          </div>

                          {item.syllabus && (
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                              {item.syllabus}
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                            <span>📅 {item.date || 'TBA'}</span>
                            {item.day && <span>• {item.day}</span>}
                            {item.subjectTag && <span>• {item.subjectTag}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => {
                            setEditingScheduleItemIdx(originalIndex);
                            setEditScheduleItemData({ ...item });
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSingleTestFromSeries(item.testNumber)}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md font-semibold text-[11px] transition-colors cursor-pointer"
                          title="Delete test from schedule"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Explorer Footer */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
              <span>
                Total scheduled tests in package: <strong className="text-slate-900">{selectedSeriesForSchedule.schedule?.length || 0}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedSeriesForSchedule(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE / FULL EDIT TEST SERIES PACKAGE MODAL                             */}
      {/* ========================================================================= */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-500/10 text-amber-700 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold font-serif-heading text-slate-900">
                    {editingItem ? 'Edit Test Series Package' : 'Create New Test Series Package'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure official brochure details, pricing tiers, and complete 49-test schedule.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveModalTab('details')}
                className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
                  activeModalTab === 'details'
                    ? 'border-amber-600 text-amber-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. General Details & Pricing
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('schedule')}
                className={`pb-2 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'schedule'
                    ? 'border-amber-600 text-amber-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>2. Schedule & Test List</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {scheduleItems.length}
                </span>
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
              {/* TAB 1: General Details */}
              {activeModalTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Test Series Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. RISE 2.0 – Sociology Optional Test Series"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        URL Slug / Key
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. rise-2-0-sociology-optional"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Discipline / Category
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                      >
                        <option value="mains">Mains Answer Writing</option>
                        <option value="optional">Optional Subject</option>
                        <option value="prelims">Prelims Mock Series</option>
                        <option value="integrated">Integrated Prelims + Mains</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Regular Improvement & Answer Writing Programme for UPSC CSE Mains 2027"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                      />
                    </div>

                    {/* Fees Breakdown */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Standard Program Fee *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. ₹8,900"
                          value={fee}
                          onChange={(e) => setFee(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Early Bird Offer Fee
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₹7,650"
                          value={earlyBirdFee}
                          onChange={(e) => setEarlyBirdFee(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Adhigam Student Fee
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₹6,675"
                          value={existingStudentFee}
                          onChange={(e) => setExistingStudentFee(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Early Bird Deadline
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 9 October 2026"
                          value={earlyBirdDeadline}
                          onChange={(e) => setEarlyBirdDeadline(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 12 October 2026"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 31 January 2027"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Delivery Mode
                      </label>
                      <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs bg-white"
                      >
                        <option value="online">Online Mode</option>
                        <option value="offline">Offline / Classroom</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Total Number of Tests
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={totalTests}
                        onChange={(e) => setTotalTests(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Overview & Details *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Provide details about the programme..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Cover Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Status Checkboxes */}
                  <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded"
                      />
                      <span>Publish to Aspirants (Live on Portal)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded"
                      />
                      <span>Feature on Homepage Banner</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: Schedule Builder */}
              {activeModalTab === 'schedule' && (
                <div className="space-y-4">
                  {/* Preset Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                    <div>
                      <span className="font-bold text-amber-950 block">Quick Schedule Presets</span>
                      <span className="text-[11px] text-amber-800">
                        Preload standard RISE 2.0 schedule or create custom schedule.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={loadRise2Preset}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Load RISE 2.0 (49 Tests)
                      </button>
                      <button
                        type="button"
                        onClick={load10TestPreset}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Load 10 Tests
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBulkScheduleInput(!showBulkScheduleInput)}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Bulk Import Text
                      </button>
                    </div>
                  </div>

                  {/* Bulk Text Import Section */}
                  {showBulkScheduleInput && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <label className="block font-semibold text-slate-700">
                        Paste tests line-by-line (e.g. "Test 1 | 12-10-2026 | Paper I | Karl Marx & Historical Materialism")
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Test 1 | 12-10-2026 | Paper I | Topic 1\nTest 2 | 14-10-2026 | Paper I | Topic 2"
                        value={bulkScheduleText}
                        onChange={(e) => setBulkScheduleText(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none font-mono text-xs bg-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowBulkScheduleInput(false)}
                          className="px-3 py-1 border border-slate-300 text-slate-600 rounded-md text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyBulkSchedule}
                          className="px-3 py-1 bg-amber-600 text-white rounded-md text-xs font-bold"
                        >
                          Parse & Apply Tests
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Add Individual Test Row */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block">Add Test to Schedule</span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <input
                          type="number"
                          placeholder="Test #"
                          value={formTestNum}
                          onChange={(e) => setFormTestNum(Number(e.target.value))}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md bg-white text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Coverage / Title"
                          value={formTestTitle}
                          onChange={(e) => setFormTestTitle(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md bg-white text-xs"
                        />
                      </div>
                      <div>
                        <select
                          value={formTestPaper}
                          onChange={(e) => setFormTestPaper(e.target.value as any)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md bg-white text-xs"
                        >
                          <option value="Paper I">Paper I</option>
                          <option value="Paper II">Paper II</option>
                          <option value="Comprehensive">Comprehensive</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Date (e.g. 12-10-2026)"
                          value={formTestDate}
                          onChange={(e) => setFormTestDate(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md bg-white text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Day (e.g. Monday)"
                          value={formTestDay}
                          onChange={(e) => setFormTestDay(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md bg-white text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Section / Unit Tag"
                          value={formTestTag}
                          onChange={(e) => setFormTestTag(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md bg-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddScheduleItemToForm}
                        className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Test #{formTestNum}
                      </button>
                    </div>
                  </div>

                  {/* List of Scheduled Items */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                      <span>{scheduleItems.length} Tests in Schedule</span>
                      {scheduleItems.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Clear all schedule tests?')) {
                              setScheduleItems([]);
                              setTotalTests(0);
                            }
                          }}
                          className="text-rose-600 hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {scheduleItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded bg-slate-900 text-amber-300 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                            {item.testNumber || idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 block line-clamp-1">{item.title}</span>
                            <span className="text-[10px] text-slate-500">
                              {item.date || 'TBA'} • {item.paper || 'Paper I'} {item.subjectTag ? `• ${item.subjectTag}` : ''}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveScheduleItemFromForm(idx)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  {activeModalTab === 'details' ? (
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('schedule')}
                      className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700"
                    >
                      Next: Test Schedule ({scheduleItems.length} Tests) →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('details')}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                    >
                      ← Back to Details
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-md transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {saving ? 'Saving...' : editingItem ? 'Update Test Series' : 'Create Package'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

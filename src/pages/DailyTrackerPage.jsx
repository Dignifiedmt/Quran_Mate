// Daily Quran Study Tracker & Habit Consistency Page
import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  Users,
  Search,
  ChevronRight,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function DailyTrackerPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Summary and data states
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const prefillPortion = searchParams.get('portion') || '';
  const prefillType = searchParams.get('type') || 'hifz';

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activityType, setActivityType] = useState(prefillType); // 'hifz' | 'murajaah' | 'tilawah' | 'tafsir'
  const [portionCovered, setPortionCovered] = useState(prefillPortion);
  const [pagesCount, setPagesCount] = useState(1);
  const [ayahsCount, setAyahsCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [notes, setNotes] = useState('');

  const loadTrackerData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const [summaryRes, logsRes] = await Promise.all([
        api.getTrackerSummary(),
        api.getTrackerLogs({ limit: 30 }),
      ]);
      setSummary(summaryRes);
      setLogs(logsRes.logs || []);
    } catch (err) {
      console.error('Failed to load tracker data:', err);
      setErrorMsg('Could not load your study tracker. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrackerData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!portionCovered.trim()) {
      setErrorMsg('Please specify the portion you studied (e.g. Surah Al-Mulk 1–15, Juz 30).');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await api.createTrackerLog({
        date,
        activity_type: activityType,
        portion_covered: portionCovered,
        pages_count: Number(pagesCount),
        ayahs_count: Number(ayahsCount),
        duration_minutes: Number(durationMinutes),
        notes,
      });

      setSuccessMsg('Quran study session logged successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);

      // Reset portion if prefilled, or clear notes
      setNotes('');
      if (!prefillPortion) {
        setPortionCovered('');
      }

      await loadTrackerData();
    } catch (err) {
      console.error('Error recording session:', err);
      setErrorMsg(err.message || 'Failed to save study session.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study record?')) return;
    try {
      await api.deleteTrackerLog(id);
      await loadTrackerData();
    } catch (err) {
      console.error('Failed to delete log:', err);
      setErrorMsg('Failed to delete record.');
    }
  };

  const activityOptions = [
    {
      id: 'hifz',
      label: 'Hifz (Memorization)',
      desc: 'Committing new verses to memory',
      badgeClass: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    },
    {
      id: 'murajaah',
      label: 'Muraja\'ah (Revision)',
      desc: 'Reviewing previously memorized portions',
      badgeClass: 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800',
    },
    {
      id: 'tilawah',
      label: 'Tilawah (Recitation)',
      desc: 'Continuous reading & tajweed practice',
      badgeClass: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800',
    },
    {
      id: 'tafsir',
      label: 'Tadabbur (Reflection)',
      desc: 'Contemplating meanings and tafsir',
      badgeClass: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    },
  ];

  const quickPortions = [
    'Surah Al-Mulk (67:1–30)',
    'Surah Al-Kahf (18:1–10)',
    'Surah Ya-Sin (36:1–40)',
    'Juz 30 (Al-Naba to Al-Nas)',
    'Surah Al-Baqarah (2:255–257)',
    'Juz 29 (Al-Mulk to Al-Mursalat)',
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Ayah Finder Cross-Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Daily Quran Habit Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Daily Study Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Build lasting consistency in your Hifz, Muraja'ah, and Tilawah routine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/ayah-finder')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--primary-border)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-all shadow-2xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Open Ayah Finder</span>
          </button>
        </div>
      </div>

      {/* Success / Error Banners */}
      {successMsg && (
        <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Metric Cards: Streak & Past 30 Days */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak Counter */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Active Streak</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              {summary?.streak || 0}
            </span>
            <span className="text-xs font-medium text-[var(--text-muted)]">consecutive days</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            {summary?.today?.hasCompletedToday
              ? 'Completed for today!'
              : 'Log today\'s session to extend'}
          </p>
        </div>

        {/* Days Studied */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Past 30 Days</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              {summary?.past30Days?.daysStudied || 0}
            </span>
            <span className="text-xs font-medium text-[var(--text-muted)]">/ 30 days</span>
          </div>
          <div className="w-full bg-[var(--bg-subtle)] rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round(((summary?.past30Days?.daysStudied || 0) / 30) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Total Time Studied */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Time Invested</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-900/50">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              {summary?.past30Days?.totalMinutes || 0}
            </span>
            <span className="text-xs font-medium text-[var(--text-muted)]">total mins</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            ≈ {((summary?.past30Days?.totalMinutes || 0) / 60).toFixed(1)} hours of recitation
          </p>
        </div>

        {/* Pages / Ayahs Covered */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Volume Revised</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              {summary?.past30Days?.totalPages || 0}
            </span>
            <span className="text-xs font-medium text-[var(--text-muted)]">pages ({summary?.past30Days?.totalAyahs || 0} ayahs)</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            Over the last month
          </p>
        </div>
      </div>

      {/* 14-Day Consistency Visual Heatmap */}
      {summary?.weeklyGrid && summary.weeklyGrid.length > 0 && (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>14-Day Consistency Overview</span>
            </h3>
            <span className="text-[11px] text-[var(--text-muted)]">Daily Study Check-in</span>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-1">
            {summary.weeklyGrid.map((day) => (
              <div
                key={day.date}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  day.completed
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                    : 'border-[var(--border-color)] bg-[var(--bg-subtle)]/50 text-[var(--text-muted)]'
                } ${day.isToday ? 'ring-2 ring-[var(--primary)]' : ''}`}
              >
                <span className="text-[9px] uppercase font-semibold opacity-75">{day.dayName}</span>
                <span className="text-xs font-bold my-0.5">{day.dayNum}</span>
                {day.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-color)] my-1" />
                )}
                <span className="text-[8px] font-mono mt-0.5">
                  {day.completed ? `${day.minutes}m` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accountability Partner Card (Sync Status) */}
      {summary?.partnerInfo ? (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/20 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs text-sm shrink-0"
              style={{ backgroundColor: summary.partnerInfo.partner?.avatar_color || '#047857' }}
            >
              {summary.partnerInfo.partner?.name?.charAt(0) || 'M'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Active Mate: {summary.partnerInfo.partner?.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800">
                  {summary.partnerInfo.partner?.memorization_stage || 'Paired'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {summary.partnerInfo.partnerCompletedToday ? (
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Checked in today: &ldquo;{summary.partnerInfo.partnerNotes || 'Portion completed'}&rdquo;</span>
                  </span>
                ) : (
                  <span className="text-[var(--text-muted)]">
                    Has not checked in yet today. Ready for mutual revision!
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/partnership')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-xs"
            >
              View Mate & Chat
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                Double your consistency with a Quran Mate
              </h4>
              <p className="text-[11px] text-[var(--text-muted)]">
                Connect 1-to-1 with a compatible sister or brother matching your stage and preferred schedule.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/discover')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shrink-0 shadow-xs self-start sm:self-auto"
          >
            <span>Discover Mates</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Form: Log Quran Session */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Log Today's Quran Session
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Record what you practiced today to keep your daily streak active.
            </p>
          </div>

          {/* Date Picker Toggles */}
          <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setDate(todayStr)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                date === todayStr
                  ? 'bg-[var(--bg-surface)] text-[var(--primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDate(yesterdayStr)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                date === yesterdayStr
                  ? 'bg-[var(--bg-surface)] text-[var(--primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Yesterday
            </button>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Activity Type Selection */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
              Select Study Category:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {activityOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActivityType(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activityType === opt.id
                      ? 'border-[var(--primary)] bg-[var(--primary-light)]/25 ring-2 ring-[var(--primary)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{opt.label}</span>
                    {activityType === opt.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] leading-tight">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Portion Covered Input & Quick Suggestions */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Portion Covered & Verses:
            </label>
            <input
              type="text"
              value={portionCovered}
              onChange={(e) => setPortionCovered(e.target.value)}
              placeholder="e.g. Surah Al-Mulk (67:1–15), Juz 30, Surah Al-Baqarah Ayahs 255–257"
              className="w-full text-xs sm:text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
            />
            {/* Quick suggestions pills */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[10px] font-semibold text-[var(--text-muted)]">Quick fill:</span>
              {quickPortions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPortionCovered(p)}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Study Metrics: Duration, Pages, Ayahs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Duration (Minutes):
              </label>
              <div className="flex items-center gap-2">
                {[15, 30, 45, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMinutes(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      durationMinutes === m
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-xs'
                        : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            {/* Pages Count */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Pages Covered:
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPagesCount(Math.max(1, pagesCount - 1))}
                  className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] font-bold text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={pagesCount}
                  onChange={(e) => setPagesCount(Number(e.target.value))}
                  className="w-full text-center text-xs sm:text-sm font-bold rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => setPagesCount(pagesCount + 1)}
                  className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] font-bold text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Ayahs Count */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Ayahs Memorized / Tested:
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAyahsCount(Math.max(0, ayahsCount - 1))}
                  className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] font-bold text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={ayahsCount}
                  onChange={(e) => setAyahsCount(Number(e.target.value))}
                  className="w-full text-center text-xs sm:text-sm font-bold rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => setAyahsCount(ayahsCount + 1)}
                  className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] font-bold text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Notes & Reflections */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Personal Reflection & Notes (Optional):
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What touched your heart? Any tough mutashabihat or verses to review again tomorrow?"
              className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-subtle)]">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : 'Record Study Session & Check In'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Study Session History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--primary)]" />
            <span>Recent Study History</span>
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            {logs.length} logged sessions
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)]">
            <CalendarCheck className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-2 opacity-60" />
            <h4 className="text-xs font-bold text-[var(--text-primary)]">No study logs yet</h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mt-1">
              Complete your first session above to start your daily consistency habit!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {logs.map((log) => {
              const opt = activityOptions.find((o) => o.id === log.activity_type) || activityOptions[0];
              return (
                <div
                  key={log.id}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[var(--border-strong)] transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {log.portion_covered || 'Quran Study Session'}
                      </span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${opt.badgeClass}`}>
                        {opt.label.split(' ')[0]}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] font-mono">
                        {log.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                        <span>{log.duration_minutes || 0} mins</span>
                      </span>
                      {log.pages_count > 0 && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-[var(--text-muted)]" />
                          <span>{log.pages_count} pages</span>
                        </span>
                      )}
                      {log.ayahs_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{log.ayahs_count} ayahs</span>
                        </span>
                      )}
                    </div>

                    {log.notes && (
                      <p className="text-xs text-[var(--text-muted)] italic pt-0.5">
                        &ldquo;{log.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      title="Delete log"
                      className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Memorization Progress Tracker Card Component
// Displays visual memorization statistics: Total Ayahs committed, Juz completed, Surah ranges, and interactive updates
import React, { useState, useMemo, memo } from 'react';
import {
  Award,
  TrendingUp
} from 'lucide-react';
import { SURAHS_LIST } from '../data/surahsList.js';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

function MemorizationProgressCard({
  className = '',
  onProgressUpdate
}) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fromSurah, setFromSurah] = useState(user?.memorized_from_surah || 1);
  const [toSurah, setToSurah] = useState(user?.memorized_to_surah || 114);
  const [stage, setStage] = useState(user?.memorization_stage || 'Juz 30');
  const [saving, setSaving] = useState(false);

  // Calculate statistics
  const fromNum = Math.min(Number(fromSurah) || 1, Number(toSurah) || 114);
  const toNum = Math.max(Number(fromSurah) || 1, Number(toSurah) || 114);

  // Total Quran: 114 Surahs, 6,236 Ayahs, 30 Juz
  const TOTAL_AYAHS = 6236;

  // Calculate ayahs in range
  const { surahsInRange, ayahsInRange, percentage } = useMemo(() => {
    const inRange = SURAHS_LIST.filter((s) => s.number >= fromNum && s.number <= toNum);
    const totalAyahs = inRange.reduce((acc, s) => acc + (s.ayahs || 0), 0);
    return {
      surahsInRange: inRange,
      ayahsInRange: totalAyahs,
      percentage: Math.min(100, Math.round((totalAyahs / TOTAL_AYAHS) * 100)),
    };
  }, [fromNum, toNum]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateProfile({
        memorized_from_surah: fromNum,
        memorized_to_surah: toNum,
        memorization_stage: stage
      });
      if (updateUser) {
        updateUser({
          ...user,
          memorized_from_surah: fromNum,
          memorized_to_surah: toNum,
          memorization_stage: stage
        });
      }
      setIsEditing(false);
      if (onProgressUpdate) onProgressUpdate();
    } catch (err) {
      alert(err.message || 'Failed to update memorization progress');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-xs relative overflow-hidden space-y-5 ${className}`}>
      {/* Decorative top accent glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Memorization Progress
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {stage}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Track your journey committing the Noble Qur&rsquo;an to memory
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] transition-colors self-start sm:self-auto"
        >
          {isEditing ? 'Cancel' : 'Update Goal'}
        </button>
      </div>

      {/* Editing Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase mb-1">
                Current Level / Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] font-medium"
              >
                <option value="Juz 30">Juz 30 (Amma)</option>
                <option value="Juz 29–30">Juz 29–30 (Tabarak & Amma)</option>
                <option value="Juz 1–5">Juz 1–5 (Al-Baqarah & Nisa)</option>
                <option value="Juz 1–10">Juz 1–10</option>
                <option value="Half Quran (15 Juz)">Half Quran (15 Juz)</option>
                <option value="Complete Hafidh (30 Juz)">Complete Hafidh (30 Juz)</option>
                <option value="Beginning">Beginning / Selected Surahs</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase mb-1">
                From Surah
              </label>
              <select
                value={fromSurah}
                onChange={(e) => setFromSurah(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] font-medium"
              >
                {SURAHS_LIST.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.englishName} ({s.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase mb-1">
                To Surah
              </label>
              <select
                value={toSurah}
                onChange={(e) => setToSurah(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] font-medium"
              >
                {SURAHS_LIST.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.englishName} ({s.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
            >
              {saving ? 'Saving...' : 'Save Memorization Progress'}
            </button>
          </div>
        </form>
      ) : null}

      {/* Progress Metric Visual */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[var(--text-primary)] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Portion Committed to Memory:</span>
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">
            {percentage}% of Holy Qur&rsquo;an
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-color)] p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(percentage, 3)}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 text-center">
          <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            Ayahs Memorized
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-950 dark:text-emerald-100 mt-0.5 tabular-nums">
            {ayahsInRange.toLocaleString()}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] tabular-nums">
            of {TOTAL_AYAHS.toLocaleString()} total
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20 text-center">
          <div className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
            Surahs Covered
          </div>
          <div className="text-lg sm:text-xl font-black text-teal-950 dark:text-teal-100 mt-0.5 tabular-nums">
            {surahsInRange.length}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] tabular-nums">
            Surah {fromNum} &rarr; {toNum}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 text-center">
          <div className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            Target Pace
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-950 dark:text-amber-100 mt-0.5">
            5 Ayahs/Day
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">
            Recommended
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 text-center">
          <div className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
            Status
          </div>
          <div className="text-lg sm:text-xl font-black text-indigo-950 dark:text-indigo-100 mt-0.5">
            Active
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">
            Daily Consistency
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MemorizationProgressCard);

// Portion Memorized Selector Component: From Surah to Surah
import React from 'react';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { SURAHS_LIST, COMMON_MEMORIZATION_PRESETS } from '../data/surahsList.js';

export default function PortionMemorizedSelector({
  fromSurah = 1,
  toSurah = 114,
  onChangeFrom,
  onChangeTo,
  onApplyPreset,
  showPresets = true,
  className = ''
}) {
  const fromNum = Number(fromSurah) || 1;
  const toNum = Number(toSurah) || 114;

  const currentFromSurah = SURAHS_LIST.find((s) => s.number === fromNum) || SURAHS_LIST[0];
  const currentToSurah = SURAHS_LIST.find((s) => s.number === toNum) || SURAHS_LIST[SURAHS_LIST.length - 1];

  const surahsCount = Math.abs(toNum - fromNum) + 1;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>Portion You Memorize (From Surah to Surah)</span>
        </label>
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          {surahsCount} {surahsCount === 1 ? 'Surah' : 'Surahs'}
        </span>
      </div>

      {/* From & To Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* From Surah */}
        <div>
          <span className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
            From Surah:
          </span>
          <select
            value={fromNum}
            onChange={(e) => onChangeFrom(Number(e.target.value))}
            className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
          >
            {SURAHS_LIST.map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.englishName} ({s.name})
              </option>
            ))}
          </select>
        </div>

        {/* To Surah */}
        <div>
          <span className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
            To Surah:
          </span>
          <select
            value={toNum}
            onChange={(e) => onChangeTo(Number(e.target.value))}
            className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
          >
            {SURAHS_LIST.map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.englishName} ({s.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual summary preview */}
      <div className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
          <span className="font-bold">{currentFromSurah.englishName}</span>
          <ArrowRight className="w-3 h-3 text-emerald-600" />
          <span className="font-bold">{currentToSurah.englishName}</span>
        </div>
        <span className="text-[11px] text-[var(--text-muted)] font-arabic" dir="rtl">
          {currentFromSurah.name} إلى {currentToSurah.name}
        </span>
      </div>

      {/* Quick Presets */}
      {showPresets && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
            Quick Memorization Portions:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_MEMORIZATION_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  onChangeFrom(preset.from);
                  onChangeTo(preset.to);
                  if (onApplyPreset) onApplyPreset(preset);
                }}
                className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  fromNum === preset.from && toNum === preset.to
                    ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Bismillah Page & Transition Loader Component
// Displays sacred Bismillah calligraphy in deep dark ink (in light theme) or tranquil emerald (in dark theme)
// with soothing rhythmic pulse while waiting for data and page views to load.
import React from 'react';
import { Sparkles } from 'lucide-react';

export default function BismillahLoader({
  message = 'Loading with Sakinah...',
  submessage = 'In the name of Allah, the Entirely Merciful, the Especially Merciful',
  fullScreen = false,
  className = ''
}) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/90 backdrop-blur-md p-4 animate-in fade-in duration-200'
    : `min-h-[50vh] flex items-center justify-center p-6 animate-in fade-in duration-200 ${className}`;

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="relative max-w-md w-full text-center space-y-4 p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-lg">
        {/* Subtle background glow */}
        <div className="absolute inset-0 rounded-3xl bg-radial from-amber-500/5 via-emerald-500/5 to-transparent pointer-events-none" />

        {/* Top Ornament */}
        <div className="relative flex items-center justify-center gap-2 text-amber-500 dark:text-amber-400">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
        </div>

        {/* Sacred Bismillah Calligraphy (Deep dark in light mode, luminous emerald in dark mode) */}
        <div className="relative py-1">
          <h2
            className="font-arabic text-2xl sm:text-3xl font-extrabold bismillah-calligraphy tracking-wider leading-relaxed select-none transition-all"
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif",
            }}
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </h2>

          {/* Shimmering Golden Underline */}
          <div className="w-28 h-0.5 mx-auto mt-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full animate-pulse" />
        </div>

        {/* Translation */}
        <p className="text-xs sm:text-sm font-serif italic text-slate-900 dark:text-emerald-200/90 max-w-sm mx-auto leading-relaxed font-medium">
          &ldquo;{submessage}&rdquo;
        </p>

        {/* Dynamic Loading Message & Indicator */}
        <div className="pt-2 flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--primary)] bg-[var(--primary-light)]/60 px-3.5 py-1.5 rounded-full border border-[var(--primary-border)] shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
            </span>
            <span>{message}</span>
          </div>

          <div className="w-32 h-1 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}

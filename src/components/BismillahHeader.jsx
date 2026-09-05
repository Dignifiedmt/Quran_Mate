// Lazy Loaded Animated Writing of Bismillah Header with Islamic Ornamentation
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, PenTool, RotateCcw, Volume2, VolumeX, Check } from 'lucide-react';

const BISMILLAH_FULL = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

// Words breakdown for progressive ink stroke calligraphy reveal
const WORDS = [
  { ar: 'بِسْمِ', trans: 'In the name of' },
  { ar: 'ٱللَّهِ', trans: 'Allah' },
  { ar: 'ٱلرَّحْمَٰنِ', trans: 'the Most Gracious' },
  { ar: 'ٱلرَّحِيمِ', trans: 'the Most Merciful' }
];

export default function BismillahHeader({
  className = '',
  showTranslation = true,
  autoStartOnView = false,
  enableReplay = true
}) {
  const containerRef = useRef(null);
  // Default to immediately visible so users always see the sacred Bismillah
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [visibleCharsCount, setVisibleCharsCount] = useState(BISMILLAH_FULL.length);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef(null);
  const animationTimerRef = useRef(null);

  // Play peaceful contemplative chime via Web Audio API on completion
  const playCompletionChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Sakinah chord)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.3);
      });
    } catch {
      // Ignore audio policy errors
    }
  }, [soundEnabled]);

  // Start the calligraphy writing animation
  const startWritingAnimation = useCallback(() => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }

    setIsWriting(true);
    setIsFinished(false);
    setVisibleCharsCount(0);

    const totalChars = BISMILLAH_FULL.length;
    let current = 0;

    // Writing speed: authentic natural ink stroke rhythm (~65ms per character)
    animationTimerRef.current = setInterval(() => {
      current += 1;
      setVisibleCharsCount(current);

      if (current >= totalChars) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
        setIsWriting(false);
        setIsFinished(true);
        playCompletionChime();
      }
    }, 65);
  }, [playCompletionChime]);

  // Lazy-load trigger: Only starts writing when scrolled into viewport
  useEffect(() => {
    if (!autoStartOnView) return;

    if (!('IntersectionObserver' in window)) {
      setHasScrolledIntoView(true);
      startWritingAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasScrolledIntoView) {
            setHasScrolledIntoView(true);
            // Brief natural pause before pen touches parchment
            const delay = setTimeout(() => {
              startWritingAnimation();
            }, 250);
            observer.disconnect();
            return () => clearTimeout(delay);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, [autoStartOnView, hasScrolledIntoView, startWritingAnimation]);

  const displayedText = BISMILLAH_FULL.slice(0, visibleCharsCount);
  const writingProgress = Math.round((visibleCharsCount / BISMILLAH_FULL.length) * 100);

  return (
    <div
      ref={containerRef}
      className={`relative my-4 text-center select-none ${className}`}
      aria-label="Bismillah ir-Rahman ir-Rahim"
    >
      {!hasScrolledIntoView ? (
        // Lazy placeholder waiting for viewport intersection with tranquil Bismillah loader
        <div className="h-20 flex flex-col items-center justify-center space-y-2 select-none">
          <div
            className="font-arabic text-xl sm:text-2xl font-extrabold bismillah-calligraphy tracking-wide"
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif",
            }}
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
          <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent rounded-full animate-pulse" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Top Islamic Geometric Ornamental Border */}
          <div className="flex items-center justify-center gap-3 w-full max-w-md mx-auto opacity-80">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/60 to-emerald-600/60" />
            <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
              <span className="text-[10px]">&bull;</span>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[10px]">&bull;</span>
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-400/60 to-emerald-600/60" />
          </div>

          {/* Active Calligraphy Writing Canvas Area */}
          <div className="relative py-1 px-4 sm:px-6 inline-flex flex-col items-center justify-center min-h-[64px]">
            {/* Ink Glow Backdrop Effect */}
            <div
              className={`absolute inset-0 rounded-3xl transition-opacity duration-700 pointer-events-none ${
                isWriting
                  ? 'bg-amber-400/10 dark:bg-amber-400/5 blur-xl opacity-100'
                  : isFinished
                  ? 'bg-emerald-500/5 dark:bg-emerald-400/5 blur-lg opacity-80'
                  : 'opacity-0'
              }`}
            />

            {/* Arabic Script with Progressive Ink Pen Rendering */}
            <div className="relative flex items-center justify-center gap-1.5">
              {/* Animated Golden Reed Pen (Qalam) Indicator while actively writing */}
              {isWriting && (
                <div
                  className="inline-flex items-center text-amber-500 dark:text-amber-400 transition-transform duration-75 animate-bounce"
                  title="Writing Bismillah..."
                >
                  <PenTool className="w-4 h-4 sm:w-5 sm:h-5 transform -rotate-45 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                </div>
              )}

              {/* The Arabic Text written in deep pitch dark ink in light theme, luminous emerald in dark theme */}
              <div
                className="font-arabic text-2xl sm:text-3xl lg:text-4xl font-extrabold bismillah-calligraphy tracking-wider leading-relaxed drop-shadow-xs transition-all duration-150 py-1"
                dir="rtl"
                lang="ar"
                style={{
                  fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif",
                  minHeight: '1.4em',
                }}
              >
                {displayedText}
                {/* Glowing ink cursor during active writing */}
                {isWriting && (
                  <span className="inline-block w-0.5 h-6 sm:h-8 bg-amber-500 dark:bg-amber-400 mr-1 animate-pulse align-middle" />
                )}
              </div>
            </div>

            {/* Live Writing Progress Bar (Only during active lazy-load writing) */}
            {isWriting && (
              <div className="mt-1 flex items-center gap-2 text-[10px] font-medium text-amber-700 dark:text-amber-400 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                <span>Writing Calligraphy ({writingProgress}%)</span>
                <div className="w-16 h-1 bg-amber-100 dark:bg-amber-950/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-100 rounded-full"
                    style={{ width: `${writingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* English Translation & Meaning (Smoothly revealed upon completion) */}
          {showTranslation && (
            <div
              className={`transition-all duration-700 text-center ${
                isFinished ? 'opacity-100 translate-y-0' : isWriting ? 'opacity-40 translate-y-1' : 'opacity-0'
              }`}
            >
              <p className="text-[11px] sm:text-xs text-slate-900 dark:text-slate-200 font-serif italic max-w-md mx-auto font-medium">
                In the name of Allah, the Entirely Merciful, the Especially Merciful
              </p>
            </div>
          )}

          {/* Interactive Calligraphy Controls: Replay Writing & Audio Chime Toggle */}
          {enableReplay && (isFinished || !isWriting) && (
            <div className="pt-1 flex items-center justify-center gap-3 text-[11px] text-[var(--text-muted)]">
              <button
                type="button"
                onClick={startWritingAnimation}
                disabled={isWriting}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] hover:text-[var(--primary)] text-[11px] font-medium transition-colors shadow-2xs group cursor-pointer"
                title="Watch Bismillah calligraphy written again"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-45 transition-transform" />
                <span>Write Again</span>
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title={soundEnabled ? 'Chime sound enabled on completion' : 'Enable completion chime'}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3 h-3" />
                    <span>Chime On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3" />
                    <span>Silent</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Subtle Bottom Gold Divider */}
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mt-0.5" />
        </div>
      )}
    </div>
  );
}

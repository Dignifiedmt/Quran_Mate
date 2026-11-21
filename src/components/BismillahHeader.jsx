// Animated Calligraphy Writer Bismillah Header (No Replay or Chime Controls)
import React, { useState, useEffect, useRef, memo } from 'react';
import { PenTool } from 'lucide-react';

const BISMILLAH_FULL = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

function BismillahHeader({
  className = '',
  showTranslation = true,
}) {
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const [visibleCharsCount, setVisibleCharsCount] = useState(
    prefersReducedMotion ? BISMILLAH_FULL.length : 0
  );
  const [isWriting, setIsWriting] = useState(false);
  const [isFinished, setIsFinished] = useState(Boolean(prefersReducedMotion));
  const hasStartedRef = useRef(Boolean(prefersReducedMotion));

  useEffect(() => {
    if (prefersReducedMotion || hasStartedRef.current) return;

    const runWriter = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      setIsWriting(true);
      setIsFinished(false);
      setVisibleCharsCount(0);

      const totalChars = BISMILLAH_FULL.length;
      let current = 0;

      timerRef.current = setInterval(() => {
        current += 1;
        setVisibleCharsCount(current);
        if (current >= totalChars) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsWriting(false);
          setIsFinished(true);
        }
      }, 45);
    };

    if (!('IntersectionObserver' in window) || !containerRef.current) {
      const delay = setTimeout(runWriter, 100);
      return () => {
        clearTimeout(delay);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            runWriter();
            break;
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [prefersReducedMotion]);

  const displayedText = BISMILLAH_FULL.slice(0, visibleCharsCount);

  return (
    <div
      ref={containerRef}
      className={`relative my-3 text-center select-none ${className}`}
      aria-label="Bismillah ir-Rahman ir-Rahim"
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        {/* Top Islamic Geometric Ornamental Hairline */}
        <div className="flex items-center justify-center gap-3 w-full max-w-md mx-auto opacity-80">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-emerald-700/60" />
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-serif">&#10022;</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-500/60 to-emerald-700/60" />
        </div>

        {/* Calligraphy Writing Canvas */}
        <div className="relative py-1 px-4 sm:px-6 inline-flex flex-col items-center justify-center min-h-[56px]">
          <div className="relative flex items-center justify-center gap-1.5">
            {isWriting && (
              <span
                className="inline-flex items-center text-amber-600 dark:text-amber-400 transition-transform duration-75"
                aria-hidden="true"
              >
                <PenTool className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45" />
              </span>
            )}

            <div
              className="font-arabic text-2xl sm:text-3xl lg:text-4xl font-extrabold bismillah-calligraphy tracking-wider leading-relaxed py-0.5"
              dir="rtl"
              lang="ar"
              style={{
                fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif",
                minHeight: '1.4em',
              }}
            >
              {displayedText}
              {isWriting && (
                <span className="inline-block w-0.5 h-6 sm:h-8 bg-amber-500 dark:bg-amber-400 mr-1 align-middle" />
              )}
            </div>
          </div>
        </div>

        {/* English Translation */}
        {showTranslation && (
          <p
            className={`text-[11px] sm:text-xs text-slate-900 dark:text-slate-200 font-serif italic max-w-md mx-auto font-medium transition-opacity duration-500 ${
              isFinished ? 'opacity-100' : 'opacity-45'
            }`}
          >
            In the name of Allah, the Entirely Merciful, the Especially Merciful
          </p>
        )}

        {/* Subtle Bottom Gold Divider */}
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mt-0.5" />
      </div>
    </div>
  );
}

export default memo(BismillahHeader);

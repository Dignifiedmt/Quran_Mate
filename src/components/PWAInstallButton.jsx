import React, { useState } from 'react';
import { Smartphone, Check, X, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.js';
import BrandLogo from './BrandLogo.jsx';

export default function PWAInstallButton({ className = '', variant = 'compact' }) {
  const { isInstallable, isInstalled, isIOS, isStandalone, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installed, setInstalled] = useState(false);

  if (isStandalone || isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalled(true);
        setTimeout(() => setInstalled(false), 3000);
      }
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 font-medium transition-all ${
          variant === 'full'
            ? 'w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs shadow-sm font-semibold'
            : 'px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-2xs'
        } ${className}`}
        title="Install Quran Mate on your phone as a mobile app"
      >
        {installed ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>App Installed!</span>
          </>
        ) : (
          <>
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Install App</span>
          </>
        )}
      </button>

      {/* iOS Safari / Universal Installation Instructions Modal */}
      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] w-full max-w-sm rounded-3xl p-6 shadow-2xl text-[var(--text-primary)]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <BrandLogo size="md" className="rounded-2xl" />
                <div>
                  <h3 className="font-bold text-base leading-tight">Install Quran Mate</h3>
                  <p className="text-xs text-[var(--text-muted)]">Add to Home Screen (Mobile App)</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-[var(--text-secondary)] mb-6">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-200">1. Tap Share</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Tap the <strong>Share</strong> icon in your browser's navigation bar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">2. Add to Home Screen</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Scroll down and tap <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <div className="p-2 rounded-lg bg-teal-600 text-white shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">3. Open like 3MTT App</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Quran Mate will launch with standalone app screen, offline caching, and instant peer matching.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs sm:text-sm shadow transition-colors"
            >
              Got it, continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}

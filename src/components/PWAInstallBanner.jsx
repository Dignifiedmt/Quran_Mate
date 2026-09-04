import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.js';
import BrandLogo from './BrandLogo.jsx';

export default function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, isStandalone, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // Check if previously dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('quran_mate_pwa_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }

    const handleOpenGuide = () => {
      setIsDismissed(false);
      setShowIOSModal(true);
    };

    window.addEventListener('pwa-open-guide', handleOpenGuide);
    return () => window.removeEventListener('pwa-open-guide', handleOpenGuide);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('quran_mate_pwa_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => {
          setInstallSuccess(false);
          setIsDismissed(true);
        }, 3000);
      }
    } else {
      // Fallback instruction if browser hasn't fired beforeinstallprompt or desktop
      setShowIOSModal(true);
    }
  };

  // If running in standalone mode (already installed), don't show the banner
  if (isStandalone || isInstalled) {
    return null;
  }

  return (
    <>
      {/* Subtle Mobile & Desktop Floating Install Banner (Style of 3MTT Mobile App) */}
      {!isDismissed && (
        <aside
          aria-label="Install Quran Mate application"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="bg-[var(--bg-surface)] border border-emerald-500/30 dark:border-emerald-500/40 rounded-2xl shadow-xl p-3.5 sm:p-4 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95 ring-1 ring-black/5 dark:ring-white/10 flex items-center gap-3 sm:gap-3.5">
            {/* App Icon */}
            <div className="shrink-0">
              <BrandLogo size="sm" className="w-11 h-11 rounded-xl shadow-sm" />
            </div>

            {/* App Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[var(--text-primary)] truncate">
                  Quran Mate App
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  PWA
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] line-clamp-1 sm:line-clamp-2">
                Install on your phone for full offline access, daily streak alerts & peer study.
              </p>
            </div>

            {/* Install Action & Dismiss */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-transform active:scale-95"
              >
                {installSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Installed!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Install</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDismiss}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

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
                    Tap the <strong>Share</strong> icon in your browser's bottom navigation bar.
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
                    Scroll down through options and tap <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <div className="p-2 rounded-lg bg-teal-600 text-white shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">3. Open from Home Screen</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Quran Mate launches full-screen without browser bars, exactly like a native app.
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

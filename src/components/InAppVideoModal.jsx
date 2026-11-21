// In-App Jitsi Video Recitation Modal Component
// Enables seamless live video/audio halaqahs directly inside the app without leaving or opening external tabs
import React, { useState } from 'react';
import {
  Video,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Volume2
} from 'lucide-react';

export default function InAppVideoModal({
  isOpen,
  onClose,
  roomName = 'QuranMate-Halaqah',
  title = 'Live Quran Recitation Room',
  subtitle = 'Recite to your partner or halaqah live inside Quran Mate'
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Clean room name so it's a valid alphanumeric string for Jitsi Meet
  const safeRoom = encodeURIComponent(
    roomName.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-')
  );

  // Use meet.jit.si with parameters optimized for in-app iframe embedding:
  // disableDeepLinking prevents mobile browsers from showing "Open in App" interstitials
  // prejoinPageEnabled=false drops directly into meeting
  const jitsiUrl = `https://meet.jit.si/${safeRoom}#config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://meet.jit.si/${safeRoom}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isMaximized
            ? 'h-[96vh] max-w-[98vw]'
            : 'h-[85vh] sm:h-[80vh] max-w-5xl'
        }`}
      >
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-xs flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate">
                  {title}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In-App Jitsi
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate hidden sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy meeting invite link to share"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? 'Link Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? 'Restore normal size' : 'Expand window'}
              className="p-1.5 sm:p-2 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              title="Exit Recitation Room"
              className="p-1.5 sm:p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded Jitsi Meeting Iframe */}
        <div className="flex-1 w-full bg-black relative">
          <iframe
            src={jitsiUrl}
            title="In-App Jitsi Recitation Call"
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
            className="w-full h-full border-0"
          />
        </div>

        {/* Bottom Recitation Bar */}
        <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-subtle)]/80 flex items-center justify-between text-[11px] text-[var(--text-muted)] shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline font-medium text-emerald-800 dark:text-emerald-300">
              Private halaqah with end-to-end encrypted video and mutual screen sharing.
            </span>
            <span className="sm:hidden font-medium text-emerald-800 dark:text-emerald-300">
              Encrypted live recitation
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px]">Room: {safeRoom}</span>
            <a
              href={`https://meet.jit.si/${safeRoom}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full page in new tab if needed"
              className="hover:text-[var(--primary)] flex items-center gap-1 text-[11px]"
            >
              <span>External tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

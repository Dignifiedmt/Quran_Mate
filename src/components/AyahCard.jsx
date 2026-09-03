// Ayah Card Component with Audio Recitation, Bookmarking, and Copy
import React, { useState, useRef } from 'react';
import { Copy, Check, Bookmark, Play, Pause, Volume2, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function AyahCard({ ayah, onBookmarkChange, onReflect }) {
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const { user, activePartnershipId } = useAuth();
  const navigate = useNavigate();

  // Audio URL: use provided audioUrl or construct Islamic Network CDN URL
  const audioUrl =
    ayah.audioUrl ||
    (ayah.number ? `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3` : null);

  const toggleAudio = () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn('Audio play failed:', e);
          setIsPlaying(false);
        });
    }
  };

  const handleCopy = () => {
    const textToCopy = `${ayah.arabicText}\n\n"${ayah.translationText}"\n— [Surah ${ayah.surahEnglishName || ayah.surahNumber} (${ayah.surahNumber}:${ayah.ayahNumber || ayah.numberInSurah})]`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = async () => {
    try {
      setBookmarkLoading(true);
      await api.addBookmark({
        surah_number: ayah.surahNumber,
        ayah_number: ayah.ayahNumber || ayah.numberInSurah,
        surah_name: ayah.surahName || '',
        surah_english_name: ayah.surahEnglishName || `Surah ${ayah.surahNumber}`,
        arabic_text: ayah.arabicText,
        translation_text: ayah.translationText,
        note: 'Saved for Quran revision'
      });
      setIsBookmarked(true);
      if (onBookmarkChange) onBookmarkChange();
    } catch (err) {
      console.error('Bookmark error:', err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleStudyWithMate = () => {
    if (!activePartnershipId) {
      navigate('/discover');
      return;
    }
    const text = `Assalamu alaikum! Would you like to review this Ayah together today?\nSurah ${ayah.surahEnglishName || ayah.surahNumber} (${ayah.surahNumber}:${ayah.ayahNumber || ayah.numberInSurah}):\n"${ayah.arabicText}"`;
    navigate(`/partnership/${activePartnershipId}/messages?prefill=${encodeURIComponent(text)}`);
  };

  const handleLogToTracker = () => {
    const portionName = `Surah ${ayah.surahEnglishName || ayah.surahNumber} (${ayah.surahNumber}:${ayah.ayahNumber || ayah.numberInSurah})`;
    navigate(`/tracker?portion=${encodeURIComponent(portionName)}&type=murajaah`);
  };

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
      {/* Header: Surah Details & Action Controls */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)] flex items-center justify-center font-bold text-sm">
            {ayah.surahNumber || ayah.surah_number}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
                Surah {ayah.surahEnglishName || ayah.surah_english_name}
              </h3>
              {(ayah.surahName || ayah.surah_name) && (
                <span className="text-xs text-[var(--text-muted)] font-arabic">
                  {ayah.surahName || ayah.surah_name}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Ayah {ayah.ayahNumber || ayah.numberInSurah || ayah.ayah_number} &bull; Juz {ayah.juz || '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio Recitation Button */}
          {audioUrl && (
            <button
              onClick={toggleAudio}
              title={isPlaying ? 'Pause Audio' : 'Play Sheikh Alafasy Recitation'}
              className={`p-2 rounded-xl border transition-colors ${
                isPlaying
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary-border)]'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy Ayah text"
            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading || isBookmarked}
            title="Bookmark Ayah"
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-amber-500'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quranic Arabic Text - RTL, Large, Prominent, Clear Font */}
      <div className="my-4 px-4 py-5 bg-[var(--bg-subtle)]/60 rounded-2xl border border-[var(--border-subtle)]">
        <p
          className="font-arabic text-2xl sm:text-3xl text-[var(--text-primary)] leading-[2.4] text-right"
          dir="rtl"
          lang="ar"
        >
          {ayah.arabicText || ayah.arabic_text}
          <span className="inline-flex items-center justify-center w-8 h-8 mx-2 rounded-full border border-[var(--primary-border)] bg-[var(--primary-light)] text-[var(--primary)] text-xs font-sans align-middle">
            {ayah.ayahNumber || ayah.numberInSurah || ayah.ayah_number}
          </span>
        </p>
      </div>

      {/* Translation */}
      <div className="space-y-1 mb-5">
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed italic">
          &ldquo;{ayah.translationText || ayah.translation_text}&rdquo;
        </p>
        <p className="text-[10px] text-[var(--text-muted)] font-medium">
          Sahih International Translation
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-color)]">
        <span className="text-[11px] text-[var(--text-muted)] font-mono">
          {ayah.surahNumber || ayah.surah_number}:{ayah.ayahNumber || ayah.numberInSurah || ayah.ayah_number}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {onReflect && (
            <button
              onClick={() => onReflect(ayah)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-color)] transition-colors"
            >
              Reflection Art
            </button>
          )}

          <button
            onClick={handleLogToTracker}
            title="Log this verse into your Daily Quran Tracker"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-[var(--border-color)] transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Log in Tracker</span>
          </button>

          <button
            onClick={handleStudyWithMate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Study with Partner</span>
          </button>
        </div>
      </div>
    </div>
  );
}

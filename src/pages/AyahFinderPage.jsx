// Ayah Finder Screen - Pure Qur'an and Ayah Only
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Check,
  Copy,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api.js';

export default function AyahFinderPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(Number(searchParams.get('surah')) || 2);
  const [selectedAyah, setSelectedAyah] = useState(Number(searchParams.get('ayah')) || 255);
  const [referenceInput, setReferenceInput] = useState(`${searchParams.get('surah') || 2}:${searchParams.get('ayah') || 255}`);

  const [currentAyah, setCurrentAyah] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef(null);

  // Copy & Bookmark states
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkSuccess, setBookmarkSuccess] = useState(false);

  // Load list of 114 Surahs on mount
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await api.getSurahs();
        setSurahs(data.surahs || []);
      } catch (err) {
        console.warn('Could not load surahs list:', err);
      }
    };
    fetchSurahs();
  }, []);

  // Fetch Ayah data when selectedSurah or selectedAyah changes
  const fetchAyah = async (surahNum, ayahNum) => {
    try {
      setLoading(true);
      setErrorMsg('');
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      const ref = `${surahNum}:${ayahNum}`;
      const data = await api.getAyah(ref);
      setCurrentAyah(data.ayah);
      setSelectedSurah(surahNum);
      setSelectedAyah(ayahNum);
      setReferenceInput(ref);
      setSearchParams({ surah: String(surahNum), ayah: String(ayahNum) });
      setIsBookmarked(!!data.ayah?.is_bookmarked);
    } catch (err) {
      setErrorMsg(err.message || 'Could not load Ayah. Please verify the Surah and Ayah number.');
      setCurrentAyah(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAyah(selectedSurah, selectedAyah);
  }, []);

  // Surah metadata for max ayahs
  const currentSurahMeta = surahs.find((s) => s.number === Number(selectedSurah)) || {
    number: 2,
    englishName: 'Al-Baqara',
    name: 'البقرة',
    numberOfAyahs: 286,
    revelationType: 'Medinan',
  };

  const handleSurahChange = (e) => {
    const newSurahNum = Number(e.target.value);
    setSelectedSurah(newSurahNum);
    setSelectedAyah(1);
    fetchAyah(newSurahNum, 1);
  };

  const handleAyahChange = (e) => {
    const newAyahNum = Number(e.target.value);
    setSelectedAyah(newAyahNum);
    fetchAyah(selectedSurah, newAyahNum);
  };

  const handleReferenceSubmit = (e) => {
    e.preventDefault();
    const parts = referenceInput.trim().split(':');
    if (parts.length === 2) {
      const s = parseInt(parts[0], 10);
      const a = parseInt(parts[1], 10);
      if (!isNaN(s) && !isNaN(a) && s >= 1 && s <= 114) {
        setSelectedSurah(s);
        setSelectedAyah(a);
        fetchAyah(s, a);
        return;
      }
    }
    setErrorMsg('Please enter a valid reference in format Surah:Ayah (e.g. 2:255 or 67:1)');
  };

  // Next and Previous Ayah navigation
  const handlePrevAyah = () => {
    if (selectedAyah > 1) {
      fetchAyah(selectedSurah, selectedAyah - 1);
    } else if (selectedSurah > 1) {
      const prevSurahMeta = surahs.find((s) => s.number === selectedSurah - 1);
      const prevAyahsCount = prevSurahMeta ? prevSurahMeta.numberOfAyahs : 1;
      fetchAyah(selectedSurah - 1, prevAyahsCount);
    }
  };

  const handleNextAyah = () => {
    if (selectedAyah < currentSurahMeta.numberOfAyahs) {
      fetchAyah(selectedSurah, selectedAyah + 1);
    } else if (selectedSurah < 114) {
      fetchAyah(selectedSurah + 1, 1);
    }
  };

  // Audio Playback
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setAudioLoading(true);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioLoading(false);
        })
        .catch((err) => {
          console.warn('Audio play blocked:', err);
          setIsPlaying(false);
          setAudioLoading(false);
        });
    }
  };

  // Copy Ayah
  const handleCopyAyah = () => {
    if (!currentAyah) return;
    const textToCopy = `${currentAyah.arabicText}\n\n"${currentAyah.translationText}"\n\n— Surah ${currentAyah.surahEnglishName} (${currentAyah.surahNumber}:${currentAyah.ayahNumber || currentAyah.numberInSurah})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Bookmark Ayah
  const handleBookmarkToggle = async () => {
    if (!currentAyah) return;
    try {
      if (isBookmarked) {
        setIsBookmarked(false);
      } else {
        await api.createBookmark({
          surah_number: currentAyah.surahNumber,
          ayah_number: currentAyah.ayahNumber || currentAyah.numberInSurah,
          surah_name: currentAyah.surahName,
          surah_english_name: currentAyah.surahEnglishName,
          arabic_text: currentAyah.arabicText,
          translation_text: currentAyah.translationText,
        });
        setIsBookmarked(true);
        setBookmarkSuccess(true);
        setTimeout(() => setBookmarkSuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fast quick-jump presets
  const quickAyahs = [
    { label: 'Ayat al-Kursi', s: 2, a: 255 },
    { label: 'Al-Baqarah (Last 2)', s: 2, a: 285 },
    { label: 'Al-Kahf', s: 18, a: 10 },
    { label: 'Ya-Sin', s: 36, a: 1 },
    { label: 'Ar-Rahman', s: 55, a: 13 },
    { label: 'Al-Mulk', s: 67, a: 1 },
    { label: 'Al-Inshirah', s: 94, a: 5 },
    { label: 'Al-Ikhlas', s: 112, a: 1 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header - Pure Qur'an and Ayah */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Noble Qur&rsquo;an & Ayah Finder</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Qur&rsquo;an and Ayah
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Select any Surah and Ayah to read authentic Uthmani scripture and listen to recitation.
        </p>
      </div>

      {/* Surah and Ayah Selection Controls Box */}
      <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          {/* Surah Dropdown (6 cols) */}
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Select Surah (1 to 114):
            </label>
            <select
              value={selectedSurah}
              onChange={handleSurahChange}
              className="w-full text-xs sm:text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
            >
              {surahs.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. Surah {s.englishName} ({s.name}) &bull; {s.numberOfAyahs} Ayahs
                </option>
              ))}
            </select>
          </div>

          {/* Ayah Dropdown (3 cols) */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Ayah (1 to {currentSurahMeta.numberOfAyahs}):
            </label>
            <select
              value={selectedAyah}
              onChange={handleAyahChange}
              className="w-full text-xs sm:text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
            >
              {Array.from({ length: currentSurahMeta.numberOfAyahs || 1 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Ayah {n}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Reference Search Box (3 cols) */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Direct Reference:
            </label>
            <form onSubmit={handleReferenceSubmit} className="flex gap-1.5">
              <input
                type="text"
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                placeholder="2:255"
                className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shrink-0 shadow-2xs"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Quick Ayah Jump Presets */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] mr-1">Quick Jump:</span>
          {quickAyahs.map((q) => (
            <button
              key={`${q.s}:${q.a}`}
              type="button"
              onClick={() => {
                setSelectedSurah(q.s);
                setSelectedAyah(q.a);
                fetchAyah(q.s, q.a);
              }}
              className="px-2.5 py-1 rounded-lg text-xs border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[var(--primary-border)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] text-[var(--text-secondary)] font-medium transition-colors"
            >
              {q.label} ({q.s}:{q.a})
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Qur'an and Ayah Card */}
      {currentAyah && (
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-sm space-y-6">
          {/* Card Top: Surah Details, Ayah Number & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)] flex items-center justify-center font-bold text-sm shadow-2xs">
                {currentAyah.surahNumber}:{currentAyah.ayahNumber || currentAyah.numberInSurah}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    Surah {currentAyah.surahEnglishName}
                  </h2>
                  <span className="font-arabic text-lg text-[var(--primary)] font-semibold">
                    {currentAyah.surahName}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {currentSurahMeta.revelationType || 'Holy Chapter'} &bull; Ayah {currentAyah.ayahNumber || currentAyah.numberInSurah} of {currentSurahMeta.numberOfAyahs}
                </p>
              </div>
            </div>

            {/* Audio Recitation & Action Buttons */}
            <div className="flex items-center gap-2">
              {currentAyah.audioUrl && (
                <>
                  <audio
                    ref={audioRef}
                    src={currentAyah.audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => setIsPlaying(false)}
                  />
                  <button
                    onClick={toggleAudio}
                    disabled={audioLoading}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isPlaying
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause Recitation' : 'Listen Recitation'}</span>
                  </button>
                </>
              )}

              <button
                onClick={handleCopyAyah}
                title="Copy Ayah text and translation"
                className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary-border)] transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={handleBookmarkToggle}
                title="Bookmark Ayah"
                className={`p-2 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                    : 'border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-amber-500'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bismillah Heading (if first ayah and not Surah At-Tawbah) */}
          {selectedAyah === 1 && selectedSurah !== 1 && selectedSurah !== 9 && (
            <div className="text-center py-2">
              <p className="font-arabic text-2xl text-[var(--primary)]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          )}

          {/* Authentic Arabic Ayah Text Container */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[var(--bg-subtle)]/60 to-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <p
              className="font-arabic text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] text-right leading-[2.4] sm:leading-[2.6] select-text font-normal tracking-wide"
              dir="rtl"
            >
              {currentAyah.arabicText}
              <span className="inline-flex items-center justify-center w-9 h-9 mx-2 text-xs font-sans font-bold rounded-full border border-[var(--primary)] text-[var(--primary)] align-middle select-none bg-[var(--bg-surface)]">
                {currentAyah.ayahNumber || currentAyah.numberInSurah}
              </span>
            </p>
          </div>

          {/* English Translation */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              English Translation (Saheeh International)
            </span>
            <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed italic">
              &ldquo;{currentAyah.translationText}&rdquo;
            </p>
          </div>

          {/* Navigation Controls: Previous Ayah / Next Ayah */}
          <div className="flex items-center justify-between pt-6 border-t border-[var(--border-subtle)]">
            <button
              onClick={handlePrevAyah}
              disabled={selectedSurah === 1 && selectedAyah === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Ayah</span>
            </button>

            <span className="text-xs font-mono text-[var(--text-muted)]">
              {currentAyah.surahNumber}:{currentAyah.ayahNumber || currentAyah.numberInSurah}
            </span>

            <button
              onClick={handleNextAyah}
              disabled={selectedSurah === 114 && selectedAyah === currentSurahMeta.numberOfAyahs}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span>Next Ayah</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

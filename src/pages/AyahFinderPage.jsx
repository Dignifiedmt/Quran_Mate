// Ayah Finder Screen - Pure Qur'an and Ayah with Audio, Surah & Juz Browser, and Lazy-Loaded Bismillah
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
  Sparkles,
  Layers,
  RotateCcw,
  Sliders,
  SkipForward,
  Compass,
  X,
  Share2
} from 'lucide-react';
import { api } from '../services/api.js';
import { JUZ_LIST } from '../data/juzData.js';
import BismillahHeader from '../components/BismillahHeader.jsx';

// Available authentic Qur'an Reciters from Islamic Network CDN
const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', style: 'Murattal' },
  { id: 'ar.abdulbasitmujawwad', name: 'AbdulBaset AbdulSamad', style: 'Mujawwad' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', style: 'Classic Murattal' },
  { id: 'ar.saadalghamdi', name: 'Saad Al-Ghamadi', style: 'Rhythmic' },
];

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
  const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  // Surah / Juz Browser Drawer & Filtering
  const [browserTab, setBrowserTab] = useState('surah'); // 'surah' | 'juz'
  const [searchFilter, setSearchFilter] = useState('');
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);

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

  // Compute audio stream URL based on selected reciter and ayahInQuran
  const getAudioUrl = (ayah) => {
    if (!ayah) return '';
    const globalNum = ayah.ayahInQuran || ayah.number;
    if (globalNum) {
      return `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${globalNum}.mp3`;
    }
    return ayah.audioUrl || '';
  };

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

  const handleSelectSurahFromBrowser = (surahNum) => {
    setSelectedSurah(surahNum);
    setSelectedAyah(1);
    fetchAyah(surahNum, 1);
    setIsBrowserOpen(false);
  };

  const handleSelectJuzFromBrowser = (juz) => {
    setSelectedSurah(juz.startSurah);
    setSelectedAyah(juz.startAyah);
    fetchAyah(juz.startSurah, juz.startAyah);
    setIsBrowserOpen(false);
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

  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true));
    } else if (autoAdvance) {
      handleNextAyah();
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
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

  // Filter Surahs
  const filteredSurahs = surahs.filter((s) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      s.englishName?.toLowerCase().includes(q) ||
      s.name?.includes(q) ||
      String(s.number).includes(q) ||
      s.englishNameTranslation?.toLowerCase().includes(q)
    );
  });

  // Filter Juz
  const filteredJuz = JUZ_LIST.filter((j) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      String(j.number).includes(q) ||
      j.englishName.toLowerCase().includes(q) ||
      j.surahName.toLowerCase().includes(q) ||
      j.name.includes(q)
    );
  });

  // Fast quick-jump presets
  const quickAyahs = [
    { label: 'Ayat al-Kursi', s: 2, a: 255 },
    { label: 'Al-Baqarah (285)', s: 2, a: 285 },
    { label: 'Al-Kahf', s: 18, a: 10 },
    { label: 'Ya-Sin', s: 36, a: 1 },
    { label: 'Ar-Rahman', s: 55, a: 13 },
    { label: 'Al-Mulk', s: 67, a: 1 },
    { label: 'Ash-Sharh', s: 94, a: 5 },
    { label: 'Al-Ikhlas', s: 112, a: 1 },
  ];

  const audioSrc = getAudioUrl(currentAyah);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Audio element */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setAudioDuration(audioRef.current?.duration || 0)}
          onEnded={handleAudioEnded}
          onError={() => {
            setIsPlaying(false);
            setAudioLoading(false);
          }}
        />
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)] mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Noble Qur&rsquo;an Ayah Finder &amp; Audio Recitation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Ayah Finder
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Explore authentic Uthmani scripture, listen to reciters, and search by Surah or Juz.
          </p>
        </div>

        {/* Open Surah / Juz Browser Button */}
        <button
          onClick={() => setIsBrowserOpen(!isBrowserOpen)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-all shadow-2xs shrink-0"
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>{isBrowserOpen ? 'Hide Index' : 'Browse Surah or Juz'}</span>
        </button>
      </div>

      {/* Interactive Surah or Juz Browser Panel */}
      {isBrowserOpen && (
        <div className="rounded-3xl border border-emerald-300 dark:border-emerald-800 bg-[var(--bg-surface)] p-5 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBrowserTab('surah')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  browserTab === 'surah'
                    ? 'bg-[var(--primary)] text-white shadow-xs'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                All 114 Surahs
              </button>
              <button
                onClick={() => setBrowserTab('juz')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  browserTab === 'juz'
                    ? 'bg-[var(--primary)] text-white shadow-xs'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                All 30 Juz
              </button>
            </div>

            <button
              onClick={() => setIsBrowserOpen(false)}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Filter inside Browser */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={browserTab === 'surah' ? 'Search Surah by name (e.g. Al-Mulk, Kahf, 67)...' : 'Search Juz by number or Surah inside (e.g. Juz 30, Amma)...'}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          {/* Surah List Grid */}
          {browserTab === 'surah' && (
            <div className="max-h-72 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {filteredSurahs.map((s) => (
                <button
                  key={s.number}
                  onClick={() => handleSelectSurahFromBrowser(s.number)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                    selectedSurah === s.number
                      ? 'border-[var(--primary)] bg-[var(--primary-light)] font-bold text-[var(--primary)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-emerald-300 text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-6 h-6 rounded-md bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center font-mono text-[10px] text-[var(--text-muted)] shrink-0">
                      {s.number}
                    </span>
                    <div className="truncate">
                      <div className="truncate font-semibold">{s.englishName}</div>
                      <div className="text-[10px] text-[var(--text-muted)] truncate">{s.numberOfAyahs} ayahs &bull; {s.revelationType || 'Meccan'}</div>
                    </div>
                  </div>
                  <span className="font-arabic text-sm text-[var(--primary)] shrink-0 pl-1">
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Juz List Grid */}
          {browserTab === 'juz' && (
            <div className="max-h-72 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {filteredJuz.map((j) => (
                <button
                  key={j.number}
                  onClick={() => handleSelectJuzFromBrowser(j)}
                  className="p-2.5 rounded-xl text-left border border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-emerald-300 hover:bg-[var(--bg-subtle)] text-xs transition-all flex items-center justify-between group"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text-primary)] group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                        {j.englishName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
                        {j.range}
                      </span>
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                      {j.surahName}
                    </div>
                  </div>
                  <span className="font-arabic text-base text-emerald-600 font-bold shrink-0 pl-1">
                    {j.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Surah & Ayah Dropdowns and Direct Jump Controls */}
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
        <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap items-center gap-1.5">
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
          {/* Card Top: Surah Details, Ayah Number & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
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
                  {currentSurahMeta.revelationType || 'Holy Chapter'} &bull; Ayah {currentAyah.ayahNumber || currentAyah.numberInSurah} of {currentSurahMeta.numberOfAyahs} {currentAyah.juz ? `• Juz ${currentAyah.juz}` : ''}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons: Bookmark & Copy */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmarkToggle}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isBookmarked
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                    : 'border-[var(--border-color)] hover:border-[var(--primary-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Save Bookmark'}
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>

              <button
                onClick={handleCopyAyah}
                className="p-2 rounded-xl border border-[var(--border-color)] hover:border-[var(--primary-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Copy Ayah text"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Lazy Loaded Bismillah (Displayed for all Surahs except Surah 9 At-Tawbah) */}
          {selectedSurah !== 9 && (
            <BismillahHeader showTranslation={true} />
          )}

          {/* Arabic Text Display */}
          <div className="py-4 px-2 sm:px-6">
            <p
              className="font-arabic text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] text-right leading-[2.2] sm:leading-[2.4] tracking-wide"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', serif" }}
            >
              {currentAyah.arabicText}
              <span className="inline-block mx-2 font-mono text-base sm:text-lg text-[var(--primary)] font-bold opacity-80">
                ۝{currentAyah.ayahNumber || currentAyah.numberInSurah}
              </span>
            </p>
          </div>

          {/* English Translation */}
          <div className="bg-[var(--bg-subtle)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-1">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Translation ({currentAyah.edition || 'Sahih International'})
            </div>
            <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed font-sans">
              &ldquo;{currentAyah.translationText}&rdquo;
            </p>
          </div>

          {/* Rich Audio Recitation Player Bar */}
          <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Play / Pause & Reciter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleAudio}
                  disabled={audioLoading}
                  className="w-10 h-10 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white flex items-center justify-center shadow-xs transition-all shrink-0 disabled:opacity-50"
                  aria-label={isPlaying ? 'Pause Recitation' : 'Play Recitation'}
                >
                  {audioLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recitation Audio</span>
                  </div>
                  {/* Reciter selector */}
                  <select
                    value={selectedReciter}
                    onChange={(e) => {
                      setSelectedReciter(e.target.value);
                      setIsPlaying(false);
                    }}
                    className="text-[11px] font-medium text-[var(--text-secondary)] bg-transparent border-0 p-0 focus:outline-none cursor-pointer hover:text-[var(--text-primary)]"
                  >
                    {RECITERS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.style})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Audio Modes & Speed toggles */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Speed selector */}
                <div className="flex items-center border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-0.5 text-[11px] font-semibold">
                  {[0.75, 1, 1.25].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`px-2 py-0.5 rounded-lg transition-colors ${
                        playbackSpeed === s
                          ? 'bg-[var(--primary)] text-white'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                {/* Repeat / Loop toggle for Hifz */}
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border flex items-center gap-1 transition-colors ${
                    isLooping
                      ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                  title="Repeat this Ayah continuously for memorization"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Repeat</span>
                </button>

                {/* Auto advance to next ayah */}
                <button
                  onClick={() => setAutoAdvance(!autoAdvance)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border flex items-center gap-1 transition-colors ${
                    autoAdvance
                      ? 'border-emerald-400 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                  title="Auto advance to next Ayah on finish"
                >
                  <SkipForward className="w-3 h-3" />
                  <span>Continuous</span>
                </button>
              </div>
            </div>

            {/* Audio Scrubber */}
            {audioDuration > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-[var(--text-muted)] font-mono w-8">
                  {Math.floor(currentTime)}s
                </span>
                <input
                  type="range"
                  min="0"
                  max={audioDuration || 1}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-[10px] text-[var(--text-muted)] font-mono w-8 text-right">
                  {Math.floor(audioDuration)}s
                </span>
              </div>
            )}
          </div>

          {/* Bottom Card Navigation: Previous and Next Ayah */}
          <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
            <button
              onClick={handlePrevAyah}
              disabled={selectedSurah === 1 && selectedAyah === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)] transition-all disabled:opacity-40 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Ayah</span>
            </button>

            <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:inline">
              Ayah {selectedAyah} of {currentSurahMeta.numberOfAyahs}
            </span>

            <button
              onClick={handleNextAyah}
              disabled={selectedSurah === 114 && selectedAyah === currentSurahMeta.numberOfAyahs}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all disabled:opacity-40 shadow-2xs"
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

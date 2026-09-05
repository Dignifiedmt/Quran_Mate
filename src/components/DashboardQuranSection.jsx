// Integrated Holy Qur'an Section for Dashboard
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Play,
  Pause,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Search,
  Maximize2,
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import BismillahHeader from './BismillahHeader.jsx';
import { SURAHS_LIST } from '../data/surahsList.js';
import { api } from '../services/api.js';

export default function DashboardQuranSection({ defaultSurahNumber = 1 }) {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(defaultSurahNumber);
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
  const [audioUrl, setAudioUrl] = useState(() => {
    const formattedNum = String(defaultSurahNumber).padStart(3, '0');
    return `https://server8.mp3quran.net/afs/${formattedNum}.mp3`;
  });
  const audioRef = useRef(null);

  // Reciters
  const RECITERS = [
    { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
    { id: 'ar.abdulbasitmurattal', name: 'AbdulBaset Murattal' },
    { id: 'ar.saoodshuraym', name: 'Saood Ash-Shuraym' },
    { id: 'ar.sudais', name: 'Abdur-Rahman As-Sudais' },
  ];

  // Fetch Surah Ayahs from API or fallback
  useEffect(() => {
    let isMounted = true;
    const loadSurah = async () => {
      setLoading(true);
      try {
        const data = await api.getSurah(selectedSurahNumber);
        if (isMounted) {
          setSurahData(data.surah);
        }
      } catch (err) {
        console.warn('Failed to load surah from API, using catalog details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadSurah();
    return () => {
      isMounted = false;
    };
  }, [selectedSurahNumber]);

  // Audio stream URL for complete Surah
  useEffect(() => {
    const formattedNum = String(selectedSurahNumber).padStart(3, '0');
    // High quality recitation stream from reliable CDN
    const reciterSubdir =
      selectedReciter === 'ar.abdulbasitmurattal'
        ? 'AbdulBaset/Murattal'
        : selectedReciter === 'ar.sudais'
        ? 'Abdurrahmaan_As-Sudais'
        : selectedReciter === 'ar.saoodshuraym'
        ? 'Saood_ash-Shuraym'
        : 'Alafasy';

    setAudioUrl(`https://server8.mp3quran.net/afs/${formattedNum}.mp3`);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [selectedSurahNumber, selectedReciter]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio play prevented:', err);
          setIsPlaying(false);
        });
    }
  };

  const filteredSurahs = SURAHS_LIST.filter(
    (s) =>
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery) ||
      String(s.number).includes(searchQuery)
  );

  const currentSurahMeta =
    SURAHS_LIST.find((s) => s.number === selectedSurahNumber) || SURAHS_LIST[0];

  return (
    <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs overflow-hidden">
      {/* Header bar with Bismillah and Surah Nav */}
      <div className="p-6 border-b border-[var(--border-color)] bg-radial from-emerald-50/70 via-[var(--bg-surface)] to-[var(--bg-surface)] dark:from-emerald-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <BookOpen className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Qur&rsquo;an Recitation &amp; Reader
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                114 Surahs
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Recite, listen to authentic Qari audio, and revise Ayahs directly inside your Dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/quran?surah=${selectedSurahNumber}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors"
              title="Open full dedicated Qur'an suite"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Screen View</span>
            </Link>
          </div>
        </div>

        {/* The Radiant Bismillah Display */}
        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
          <BismillahHeader
            showTranslation={true}
            className="py-1"
            enableReplay={true}
          />
        </div>
      </div>

      {/* Main Reader & Surah Selector Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left column: 114 Surahs Directory Quick Picker */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[var(--border-color)] p-4 flex flex-col h-[520px]">
          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter 114 Surahs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] pl-8 pr-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          {/* Surah List Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredSurahs.map((surah) => {
              const isCurrent = surah.number === selectedSurahNumber;
              return (
                <button
                  key={surah.number}
                  onClick={() => setSelectedSurahNumber(surah.number)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                      }`}
                    >
                      {surah.number}
                    </span>
                    <div className="truncate">
                      <div className="text-xs truncate">{surah.englishName}</div>
                      <div
                        className={`text-[10px] truncate ${
                          isCurrent ? 'text-emerald-100' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {surah.englishTranslation} &bull; {surah.ayahs} Ayahs
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-arabic text-sm shrink-0 ${
                      isCurrent ? 'text-white' : 'text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {surah.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Surah Display & Audio Reciter */}
        <div className="lg:col-span-8 p-5 flex flex-col h-[520px] justify-between overflow-hidden">
          {/* Top Audio Player Bar */}
          <div className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleAudio}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
                title={isPlaying ? 'Pause Audio' : 'Play Surah Recitation'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  {currentSurahMeta.englishName} Recitation
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  <span>{isPlaying ? 'Now Playing' : 'Ready to Recite'}</span>
                </div>
              </div>
            </div>

            {/* Reciter Selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedReciter}
                onChange={(e) => setSelectedReciter(e.target.value)}
                className="text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-2.5 py-1.5 text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] font-medium"
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              {/* Prev / Next Surah */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={selectedSurahNumber <= 1}
                  onClick={() => setSelectedSurahNumber((n) => Math.max(1, n - 1))}
                  className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 cursor-pointer"
                  title="Previous Surah"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={selectedSurahNumber >= 114}
                  onClick={() => setSelectedSurahNumber((n) => Math.min(114, n + 1))}
                  className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 cursor-pointer"
                  title="Next Surah"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {audioUrl ? (
              <audio
                ref={audioRef}
                src={audioUrl || null}
                onEnded={() => setIsPlaying(false)}
                onError={() => setIsPlaying(false)}
              />
            ) : null}
          </div>

          {/* Surah Verses Container */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-[var(--text-muted)]">Loading Surah Ayahs...</p>
              </div>
            ) : surahData && surahData.ayahs && surahData.ayahs.length > 0 ? (
              <div className="space-y-4">
                {surahData.ayahs.map((ayah) => (
                  <div
                    key={ayah.numberInSurah}
                    className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/70 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                        {ayah.numberInSurah}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {currentSurahMeta.englishName} {selectedSurahNumber}:{ayah.numberInSurah}
                      </span>
                    </div>

                    {/* Arabic Calligraphy text */}
                    <div
                      className="font-arabic text-xl sm:text-2xl text-right leading-loose text-[var(--text-primary)] drop-shadow-2xs"
                      dir="rtl"
                    >
                      {ayah.text}
                    </div>

                    {/* English Translation */}
                    {ayah.translation && (
                      <div className="text-xs text-[var(--text-secondary)] leading-relaxed pt-2 border-t border-[var(--border-subtle)] font-serif">
                        &ldquo;{ayah.translation}&rdquo;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-[var(--border-color)] text-center space-y-3">
                <div className="font-arabic text-3xl text-emerald-900 dark:text-emerald-200">
                  {currentSurahMeta.name}
                </div>
                <div className="text-base font-bold text-[var(--text-primary)]">
                  {currentSurahMeta.englishName} ({currentSurahMeta.englishTranslation})
                </div>
                <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                  Contains {currentSurahMeta.ayahs} Ayahs. Tap the Play button above to listen to the complete Surah recitation.
                </p>
                <div className="pt-2">
                  <Link
                    to={`/quran?surah=${selectedSurahNumber}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    <span>Open in Full Quran Reader</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

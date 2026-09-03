// Comprehensive Holy Qur'an Reader, Audio Suite, and Study Center
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Shuffle,
  Bookmark,
  Palette,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Share2,
  Sparkles,
  Layers,
  ArrowLeft,
  Settings2,
  CheckCircle2,
  Compass,
  AlertCircle,
  CalendarCheck
} from 'lucide-react';
import { api } from '../services/api.js';
import AyahCard from '../components/AyahCard.jsx';
import ReflectionCardGenerator from '../components/ReflectionCardGenerator.jsx';

// 30 Juz Quick Reference Boundaries
const JUZ_LIST = [
  { juz: 1, startSurah: 1, startAyah: 1, name: 'Al-Faatiha 1:1 – Al-Baqarah 2:141' },
  { juz: 2, startSurah: 2, startAyah: 142, name: 'Al-Baqarah 2:142 – 2:252' },
  { juz: 3, startSurah: 2, startAyah: 253, name: 'Al-Baqarah 2:253 – Aal-i-Imraan 3:92' },
  { juz: 4, startSurah: 3, startAyah: 93, name: 'Aal-i-Imraan 3:93 – An-Nisaa 4:23' },
  { juz: 5, startSurah: 4, startAyah: 24, name: 'An-Nisaa 4:24 – 4:147' },
  { juz: 6, startSurah: 4, startAyah: 148, name: 'An-Nisaa 4:148 – Al-Maaida 5:81' },
  { juz: 7, startSurah: 5, startAyah: 82, name: 'Al-Maaida 5:82 – Al-An\'aam 6:110' },
  { juz: 8, startSurah: 6, startAyah: 111, name: 'Al-An\'aam 6:111 – Al-A\'raaf 7:87' },
  { juz: 9, startSurah: 7, startAyah: 88, name: 'Al-A\'raaf 7:88 – Al-Anfaal 8:40' },
  { juz: 10, startSurah: 8, startAyah: 41, name: 'Al-Anfaal 8:41 – At-Tawbah 9:92' },
  { juz: 11, startSurah: 9, startAyah: 93, name: 'At-Tawbah 9:93 – Hood 11:5' },
  { juz: 12, startSurah: 11, startAyah: 6, name: 'Hood 11:6 – Yoosuf 12:52' },
  { juz: 13, startSurah: 12, startAyah: 53, name: 'Yoosuf 12:53 – Ibrahim 14:52' },
  { juz: 14, startSurah: 15, startAyah: 1, name: 'Al-Hijr 15:1 – An-Nahl 16:128' },
  { juz: 15, startSurah: 17, startAyah: 1, name: 'Al-Israa 17:1 – Al-Kahf 18:74' },
  { juz: 16, startSurah: 18, startAyah: 75, name: 'Al-Kahf 18:75 – Taa-Haa 20:135' },
  { juz: 17, startSurah: 21, startAyah: 1, name: 'Al-Anbiyaa 21:1 – Al-Hajj 22:78' },
  { juz: 18, startSurah: 23, startAyah: 1, name: 'Al-Muminoon 23:1 – Al-Furqaan 25:20' },
  { juz: 19, startSurah: 25, startAyah: 21, name: 'Al-Furqaan 25:21 – An-Naml 27:55' },
  { juz: 20, startSurah: 27, startAyah: 56, name: 'An-Naml 27:56 – Al-Ankaboot 29:45' },
  { juz: 21, startSurah: 29, startAyah: 46, name: 'Al-Ankaboot 29:46 – Al-Ahzaab 33:30' },
  { juz: 22, startSurah: 33, startAyah: 31, name: 'Al-Ahzaab 33:31 – Yaseen 36:27' },
  { juz: 23, startSurah: 36, startAyah: 28, name: 'Yaseen 36:28 – Az-Zumar 39:31' },
  { juz: 24, startSurah: 39, startAyah: 32, name: 'Az-Zumar 39:32 – Fussilat 41:46' },
  { juz: 25, startSurah: 41, startAyah: 47, name: 'Fussilat 41:47 – Al-Jaathiya 45:37' },
  { juz: 26, startSurah: 46, startAyah: 1, name: 'Al-Ahqaaf 46:1 – Adh-Dhaariyaat 51:30' },
  { juz: 27, startSurah: 51, startAyah: 31, name: 'Adh-Dhaariyaat 51:31 – Al-Hadeed 57:29' },
  { juz: 28, startSurah: 58, startAyah: 1, name: 'Al-Mujaadila 58:1 – At-Tahreem 66:12' },
  { juz: 29, startSurah: 67, startAyah: 1, name: 'Al-Mulk 67:1 – Al-Mursalaat 77:50' },
  { juz: 30, startSurah: 78, startAyah: 1, name: 'An-Naba 78:1 – An-Naas 114:6 (Juz Amma)' },
];

export default function QuranPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Navigation tabs: 'surahs' | 'reader' | 'search' | 'juz' | 'bookmarks' | 'art'
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'surahs');

  // Surahs Directory state
  const [surahs, setSurahs] = useState([]);
  const [surahSearch, setSurahSearch] = useState('');
  const [surahFilter, setSurahFilter] = useState('all'); // 'all' | 'Meccan' | 'Medinan'
  const [surahsLoading, setSurahsLoading] = useState(true);

  // Active Reader state
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(
    parseInt(searchParams.get('surah') || '1', 10)
  );
  const [surahData, setSurahData] = useState(null);
  const [readerLoading, setReaderLoading] = useState(false);
  const [readerError, setReaderError] = useState('');
  const [displayMode, setDisplayMode] = useState('dual'); // 'dual' | 'arabic' | 'translation'
  const [fontSize, setFontSize] = useState('large'); // 'normal' | 'large' | 'xlarge'
  const [inSurahSearch, setInSurahSearch] = useState('');

  // Audio Player State (Sheikh Mishary Rashid Alafasy)
  const [currentPlayingAyahIndex, setCurrentPlayingAyahIndex] = useState(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const audioPlayerRef = useRef(null);

  // Search & Random Ayah state
  const [searchRefQuery, setSearchRefQuery] = useState('2:255');
  const [searchKeywordQuery, setSearchKeywordQuery] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [keywordResults, setKeywordResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Bookmarks
  const [bookmarks, setBookmarks] = useState([]);

  // Reflection Art target
  const [artPromptVerse, setArtPromptVerse] = useState('');

  // Toast feedback
  const [copiedAyahRef, setCopiedAyahRef] = useState(null);

  // Load 114 Surahs on mount
  useEffect(() => {
    loadSurahs();
    loadBookmarks();
  }, []);

  // Sync active tab or surah from URL params if present
  useEffect(() => {
    const surahParam = searchParams.get('surah');
    if (surahParam) {
      const sNum = parseInt(surahParam, 10);
      if (sNum >= 1 && sNum <= 114) {
        setSelectedSurahNumber(sNum);
        setActiveTab('reader');
      }
    }
  }, [searchParams]);

  // When selectedSurahNumber changes in reader tab, fetch surah details
  useEffect(() => {
    if (activeTab === 'reader' && selectedSurahNumber) {
      fetchSurah(selectedSurahNumber);
      // Stop any running full surah audio when switching
      stopAudio();
    }
  }, [selectedSurahNumber, activeTab]);

  const loadSurahs = async () => {
    try {
      setSurahsLoading(true);
      const data = await api.getSurahs();
      setSurahs(data.surahs || []);
    } catch (e) {
      console.warn('Failed to load surahs list:', e);
    } finally {
      setSurahsLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const data = await api.getBookmarks();
      setBookmarks(data.bookmarks || []);
    } catch (e) {
      console.warn('Failed to load bookmarks:', e);
    }
  };

  const fetchSurah = async (number) => {
    try {
      setReaderLoading(true);
      setReaderError('');
      const data = await api.getSurah(number);
      if (data.surah) {
        setSurahData(data.surah);
      } else {
        setReaderError('Unable to load Surah text.');
      }
    } catch (err) {
      setReaderError(err.message || 'Error loading Surah from Quran service.');
    } finally {
      setReaderLoading(false);
    }
  };

  // Open Surah in Reader
  const handleOpenSurah = (surahNumber) => {
    setSelectedSurahNumber(surahNumber);
    setActiveTab('reader');
    setSearchParams({ tab: 'reader', surah: surahNumber });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Audio Playback Helpers
  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setIsPlayingFullSurah(false);
    setCurrentPlayingAyahIndex(null);
  };

  const playAyahAudioAtIndex = (index, autoAdvance = false) => {
    if (!surahData || !surahData.ayahs || index < 0 || index >= surahData.ayahs.length) {
      stopAudio();
      return;
    }

    const ayah = surahData.ayahs[index];
    if (!ayah.audioUrl) return;

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const audio = new Audio(ayah.audioUrl);
    audioPlayerRef.current = audio;
    setCurrentPlayingAyahIndex(index);

    audio.onended = () => {
      if (autoAdvance && index + 1 < surahData.ayahs.length) {
        playAyahAudioAtIndex(index + 1, true);
      } else {
        stopAudio();
      }
    };

    audio.onerror = () => {
      console.warn('Ayah audio playback failed');
      stopAudio();
    };

    audio
      .play()
      .then(() => {
        if (autoAdvance) setIsPlayingFullSurah(true);
        // Smoothly scroll active ayah into view
        const element = document.getElementById(`ayah-${ayah.numberInSurah}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      })
      .catch((e) => {
        console.warn('Play error:', e);
        stopAudio();
      });
  };

  const toggleFullSurahAudio = () => {
    if (isPlayingFullSurah) {
      stopAudio();
    } else {
      const startIndex = currentPlayingAyahIndex !== null ? currentPlayingAyahIndex : 0;
      playAyahAudioAtIndex(startIndex, true);
    }
  };

  // Search by reference handler
  const handleLookupReference = async (ref) => {
    const target = ref || searchRefQuery;
    if (!target.trim()) return;

    try {
      setSearchLoading(true);
      setSearchError('');
      setKeywordResults([]);
      const data = await api.getAyah(target.trim());
      if (data.ayah) {
        setLookupResult(data.ayah);
      }
    } catch (err) {
      setSearchError(err.message || 'Ayah not found. Please verify reference format (e.g. 2:255).');
    } finally {
      setSearchLoading(false);
    }
  };

  // Semantic keyword search handler
  const handleSearchKeyword = async (e) => {
    e?.preventDefault();
    if (!searchKeywordQuery.trim()) return;

    try {
      setSearchLoading(true);
      setSearchError('');
      setLookupResult(null);
      const data = await api.searchAyahs(searchKeywordQuery.trim());
      setKeywordResults(data.results || []);
    } catch (err) {
      setSearchError(err.message || 'Search failed. Please try another keyword.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Random Ayah
  const handleRandomAyah = async () => {
    try {
      setSearchLoading(true);
      setSearchError('');
      const data = await api.getRandomAyah();
      if (data.ayah) {
        setLookupResult(data.ayah);
        setActiveTab('search');
      }
    } catch (err) {
      setSearchError('Failed to retrieve random Ayah.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Bookmark an individual ayah
  const handleBookmarkAyah = async (ayah) => {
    try {
      await api.addBookmark({
        surah_number: surahData.number,
        ayah_number: ayah.numberInSurah,
        surah_name: surahData.name,
        surah_english_name: surahData.englishName,
        arabic_text: ayah.arabicText,
        translation_text: ayah.translationText,
        note: `Saved from Surah ${surahData.englishName}`
      });
      loadBookmarks();
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  // Copy Ayah
  const handleCopyAyah = (ayah) => {
    const text = `${ayah.arabicText}\n\n"${ayah.translationText}"\n— [Surah ${surahData.englishName} (${surahData.number}:${ayah.numberInSurah})]`;
    navigator.clipboard.writeText(text);
    setCopiedAyahRef(ayah.numberInSurah);
    setTimeout(() => setCopiedAyahRef(null), 2000);
  };

  // Filtered Surahs in directory
  const filteredSurahs = surahs.filter((s) => {
    const matchesFilter =
      surahFilter === 'all' || s.revelationType?.toLowerCase() === surahFilter.toLowerCase();
    const query = surahSearch.toLowerCase().trim();
    const matchesQuery =
      !query ||
      s.englishName?.toLowerCase().includes(query) ||
      s.englishNameTranslation?.toLowerCase().includes(query) ||
      s.name?.includes(query) ||
      String(s.number) === query;
    return matchesFilter && matchesQuery;
  });

  // Filtered ayahs in reader
  const filteredAyahs = surahData?.ayahs?.filter((a) => {
    if (!inSurahSearch.trim()) return true;
    const q = inSurahSearch.toLowerCase().trim();
    return (
      String(a.numberInSurah) === q ||
      a.translationText?.toLowerCase().includes(q) ||
      a.arabicText?.includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] mb-2">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>The Noble Qur&rsquo;an Suite</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              The Holy Qur&rsquo;an
            </h1>
            <span className="font-arabic text-xl sm:text-2xl text-[var(--text-muted)] font-normal hidden sm:inline">
              القرآن الكريم
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Read all 114 Surahs in authentic Uthmani script, listen to verse-by-verse recitations by
            Sheikh Mishary Alafasy, and coordinate targeted revision with your study partner.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/tracker')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Daily Tracker</span>
          </button>
          <button
            onClick={handleRandomAyah}
            disabled={searchLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random Ayah</span>
          </button>
          <button
            onClick={() => setActiveTab('art')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors shadow-2xs"
          >
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Reflection Art</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-[var(--border-color)] overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            setActiveTab('surahs');
            stopAudio();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'surahs'
              ? 'border-[var(--primary)] text-[var(--primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Surah Directory (114)</span>
        </button>

        <button
          onClick={() => setActiveTab('reader')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'reader'
              ? 'border-[var(--primary)] text-[var(--primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Surah Reader {surahData ? `(${surahData.englishName})` : ''}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('juz');
            stopAudio();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'juz'
              ? 'border-[var(--primary)] text-[var(--primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>30 Juz Index</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('search');
            stopAudio();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'search'
              ? 'border-[var(--primary)] text-[var(--primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Ayah Finder & Search</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('bookmarks');
            loadBookmarks();
            stopAudio();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'bookmarks'
              ? 'border-[var(--primary)] text-[var(--primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarks ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('art');
            stopAudio();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'art'
              ? 'border-[var(--primary)] text-[var(--primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-amber-500" />
          <span>Reflection Studio</span>
        </button>
      </div>

      {/* ==================== TAB 1: SURAH DIRECTORY ==================== */}
      {activeTab === 'surahs' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, meaning, or number..."
                value={surahSearch}
                onChange={(e) => setSurahSearch(e.target.value)}
                className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] pl-9 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['all', 'Meccan', 'Medinan'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSurahFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                    surahFilter === filter
                      ? 'bg-[var(--primary)] text-white shadow-2xs'
                      : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {filter === 'all' ? 'All (114)' : `${filter} Surahs`}
                </button>
              ))}
            </div>
          </div>

          {/* Surahs Grid */}
          {surahsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] animate-pulse space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[var(--bg-subtle)]" />
                    <div className="w-20 h-5 bg-[var(--bg-subtle)] rounded" />
                  </div>
                  <div className="w-32 h-4 bg-[var(--bg-subtle)] rounded" />
                  <div className="w-24 h-3 bg-[var(--bg-subtle)] rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSurahs.map((surah) => (
                <div
                  key={surah.number}
                  onClick={() => handleOpenSurah(surah.number)}
                  className="group cursor-pointer rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[var(--primary-border)] hover:bg-[var(--primary-light)]/20 transition-all flex flex-col justify-between relative"
                >
                  {/* Top: Surah Number badge & Arabic Calligraphy */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)] flex items-center justify-center font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
                      {surah.number}
                    </div>
                    <span className="font-arabic text-lg text-[var(--text-primary)] font-normal group-hover:text-[var(--primary)] transition-colors">
                      {surah.name}
                    </span>
                  </div>

                  {/* Body: English Names */}
                  <div className="space-y-0.5 mb-3">
                    <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                      {surah.englishName}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {surah.englishNameTranslation}
                    </p>
                  </div>

                  {/* Footer: Badges & Read Action */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{surah.revelationType || 'Meccan'}</span>
                      <span>&bull;</span>
                      <span>{surah.numberOfAyahs} Ayahs</span>
                    </div>
                    <span className="font-bold text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <span>Read</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: FULL SURAH READER ==================== */}
      {activeTab === 'reader' && (
        <div className="space-y-6">
          {/* Reader Top Bar Controls */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-xs space-y-4">
            {/* Top Navigation & Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('surahs');
                    stopAudio();
                  }}
                  className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  title="Back to Surahs Directory"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {/* Surah Selector Dropdown */}
                <select
                  value={selectedSurahNumber}
                  onChange={(e) => handleOpenSurah(parseInt(e.target.value, 10))}
                  className="text-xs font-bold rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {surahs.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.englishName} ({s.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Prev / Next Surah Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={selectedSurahNumber <= 1}
                  onClick={() => handleOpenSurah(selectedSurahNumber - 1)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <button
                  disabled={selectedSurahNumber >= 114}
                  onClick={() => handleOpenSurah(selectedSurahNumber + 1)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Audio Recitation Bar & View Customization */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullSurahAudio}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isPlayingFullSurah
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
                  }`}
                >
                  {isPlayingFullSurah ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Recitation</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Full Surah (Mishary Alafasy)</span>
                    </>
                  )}
                </button>

                {isPlayingFullSurah && currentPlayingAyahIndex !== null && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-pulse">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ayah {currentPlayingAyahIndex + 1}</span>
                  </div>
                )}
              </div>

              {/* View Customizations */}
              <div className="flex items-center gap-2">
                {/* Display Mode */}
                <div className="flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setDisplayMode('dual')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      displayMode === 'dual'
                        ? 'bg-[var(--bg-surface)] text-[var(--primary)] shadow-2xs font-bold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Dual
                  </button>
                  <button
                    onClick={() => setDisplayMode('arabic')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      displayMode === 'arabic'
                        ? 'bg-[var(--bg-surface)] text-[var(--primary)] shadow-2xs font-bold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Arabic Only
                  </button>
                  <button
                    onClick={() => setDisplayMode('translation')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      displayMode === 'translation'
                        ? 'bg-[var(--bg-surface)] text-[var(--primary)] shadow-2xs font-bold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Translation
                  </button>
                </div>

                {/* Font Size Selector */}
                <div className="hidden sm:flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      fontSize === 'normal'
                        ? 'bg-[var(--bg-surface)] text-[var(--primary)] font-bold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      fontSize === 'large'
                        ? 'bg-[var(--bg-surface)] text-[var(--primary)] font-bold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      fontSize === 'xlarge'
                        ? 'bg-[var(--bg-surface)] text-[var(--primary)] font-bold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    A++
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Surah Content / Reading Area */}
          {readerLoading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-10 h-10 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-[var(--text-muted)]">
                Loading Surah text and recitations...
              </p>
            </div>
          ) : readerError ? (
            <div className="p-8 text-center rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/30 text-red-600 space-y-3">
              <AlertCircle className="w-8 h-8 mx-auto" />
              <p className="text-sm font-semibold">{readerError}</p>
              <button
                onClick={() => fetchSurah(selectedSurahNumber)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white"
              >
                Retry
              </button>
            </div>
          ) : surahData ? (
            <div className="space-y-6">
              {/* Surah Header Card */}
              <div className="rounded-3xl border border-[var(--primary-border)] bg-gradient-to-b from-[var(--primary-light)]/40 via-[var(--bg-surface)] to-[var(--bg-surface)] p-6 sm:p-8 text-center space-y-4 shadow-xs">
                <div className="font-arabic text-3xl sm:text-4xl text-[var(--text-primary)] font-bold">
                  {surahData.name}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
                    Surah {surahData.englishName}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                    {surahData.englishNameTranslation} &bull; {surahData.revelationType} &bull;{' '}
                    {surahData.numberOfAyahs} Ayahs
                  </p>
                </div>

                {/* Bismillah Banner (except Surah 9 At-Tawbah) */}
                {surahData.number !== 9 && (
                  <div className="pt-3">
                    <div className="inline-block px-6 py-2.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xs">
                      <span className="font-arabic text-xl sm:text-2xl text-[var(--primary)] leading-relaxed">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Verses List */}
              <div className="space-y-4">
                {filteredAyahs?.map((ayah, index) => {
                  const isCurrentPlaying = currentPlayingAyahIndex === index;

                  return (
                    <div
                      key={ayah.numberInSurah}
                      id={`ayah-${ayah.numberInSurah}`}
                      className={`rounded-2xl border transition-all p-5 sm:p-6 ${
                        isCurrentPlaying
                          ? 'border-[var(--primary)] bg-[var(--primary-light)]/30 ring-2 ring-[var(--primary)]/30 shadow-md'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--primary-border)]'
                      }`}
                    >
                      {/* Ayah Number Header & Actions */}
                      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)] flex items-center justify-center font-bold text-xs">
                            {ayah.numberInSurah}
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)] font-mono">
                            Juz {ayah.juz || '—'}
                          </span>
                        </div>

                        {/* Actions: Play, Bookmark, Copy */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => playAyahAudioAtIndex(index, false)}
                            title="Play verse audio"
                            className={`p-2 rounded-xl border transition-colors ${
                              isCurrentPlaying
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--primary)]'
                            }`}
                          >
                            {isCurrentPlaying ? (
                              <Pause className="w-3.5 h-3.5" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current" />
                            )}
                          </button>

                          <button
                            onClick={() => handleCopyAyah(ayah)}
                            title="Copy verse"
                            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            {copiedAyahRef === ayah.numberInSurah ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleBookmarkAyah(ayah)}
                            title="Save bookmark"
                            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-amber-500 transition-colors"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setArtPromptVerse(ayah.arabicText);
                              setActiveTab('art');
                            }}
                            title="Create reflection artwork"
                            className="hidden sm:inline-flex p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-amber-500 transition-colors"
                          >
                            <Palette className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Arabic Text */}
                      {displayMode !== 'translation' && (
                        <div className="my-3 px-2 py-3 bg-[var(--bg-subtle)]/50 rounded-xl">
                          <p
                            className={`font-arabic text-[var(--text-primary)] leading-[2.5] text-right ${
                              fontSize === 'normal'
                                ? 'text-2xl sm:text-2xl'
                                : fontSize === 'large'
                                ? 'text-2xl sm:text-3xl'
                                : 'text-3xl sm:text-4xl'
                            }`}
                            dir="rtl"
                            lang="ar"
                          >
                            {ayah.arabicText}
                            <span className="inline-flex items-center justify-center w-8 h-8 mx-2 rounded-full border border-[var(--primary-border)] bg-[var(--primary-light)] text-[var(--primary)] text-xs font-sans align-middle">
                              {ayah.numberInSurah}
                            </span>
                          </p>
                        </div>
                      )}

                      {/* English Translation */}
                      {displayMode !== 'arabic' && (
                        <div className="mt-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed italic">
                          &ldquo;{ayah.translationText}&rdquo;
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ==================== TAB 3: 30 JUZ INDEX ==================== */}
      {activeTab === 'juz' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">The 30 Juz of the Holy Qur&rsquo;an</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Select any Juz to jump directly to its opening Surah and begin revision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {JUZ_LIST.map((j) => (
              <div
                key={j.juz}
                onClick={() => handleOpenSurah(j.startSurah)}
                className="group cursor-pointer p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--primary-border)] hover:bg-[var(--primary-light)]/20 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)] flex items-center justify-center font-black text-sm shadow-2xs group-hover:scale-105 transition-transform">
                    {j.juz}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                      Juz {j.juz}
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[200px]">
                      {j.name}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: SEARCH & AYAH FINDER ==================== */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs space-y-4">
            <div className="space-y-1">
              <h2 className="font-bold text-base text-[var(--text-primary)]">
                Lookup Verses & Search Translations
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Enter a specific Surah & Ayah reference (e.g. 2:255, 18:10, 36:1) or search by English keyword.
              </p>
            </div>

            {/* Reference Lookup Form */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. 2:255, 18:10, 67:1, 94:5..."
                  value={searchRefQuery}
                  onChange={(e) => setSearchRefQuery(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] pl-9 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <button
                onClick={() => handleLookupReference()}
                disabled={searchLoading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-xs shrink-0"
              >
                {searchLoading ? 'Searching...' : 'Lookup Reference'}
              </button>
            </div>

            {/* Keyword Search Form */}
            <form onSubmit={handleSearchKeyword} className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-[var(--border-color)]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by English keyword (e.g. patience, mercy, light, paradise)..."
                  value={searchKeywordQuery}
                  onChange={(e) => setSearchKeywordQuery(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] pl-9 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors shrink-0"
              >
                Search Words
              </button>
            </form>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)] pt-1">
              <span>Popular:</span>
              {[
                { label: 'Ayat al-Kursi (2:255)', ref: '2:255' },
                { label: 'Al-Kahf (18:10)', ref: '18:10' },
                { label: 'Al-Mulk (67:1)', ref: '67:1' },
                { label: 'Ash-Sharh (94:5)', ref: '94:5' },
                { label: 'Yasin (36:1)', ref: '36:1' },
              ].map((item) => (
                <button
                  key={item.ref}
                  onClick={() => {
                    setSearchRefQuery(item.ref);
                    handleLookupReference(item.ref);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary-border)] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results Display */}
          {searchError && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 text-red-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {lookupResult && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Reference Result
              </h3>
              <AyahCard
                ayah={lookupResult}
                onBookmarkChange={loadBookmarks}
                onReflect={(ayah) => {
                  setArtPromptVerse(ayah.arabicText);
                  setActiveTab('art');
                }}
              />
            </div>
          )}

          {keywordResults.length > 0 && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Search Results ({keywordResults.length} verses found)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keywordResults.map((result) => (
                  <AyahCard
                    key={`${result.surahNumber}-${result.ayahNumber}`}
                    ayah={result}
                    onBookmarkChange={loadBookmarks}
                    onReflect={(ayah) => {
                      setArtPromptVerse(ayah.arabicText);
                      setActiveTab('art');
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 5: SAVED BOOKMARKS ==================== */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Saved Ayah Bookmarks</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Your personal collection of verses saved for reflection and memorization revision.
              </p>
            </div>
          </div>

          {bookmarks.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)]">
              <Bookmark className="w-10 h-10 mx-auto text-[var(--text-muted)] opacity-60 mb-3" />
              <h3 className="font-bold text-base text-[var(--text-primary)]">No Bookmarks Saved Yet</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
                While browsing any Surah or verse, click the bookmark icon to keep it here for quick access.
              </p>
              <button
                onClick={() => setActiveTab('surahs')}
                className="mt-4 px-5 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white"
              >
                Browse Surahs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                    <div className="font-bold text-sm text-[var(--text-primary)]">
                      Surah {bm.surah_english_name || bm.surah_number} ({bm.surah_number}:{bm.ayah_number})
                    </div>
                    <button
                      onClick={() => handleOpenSurah(bm.surah_number)}
                      className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                    >
                      <span>Read in Surah</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="font-arabic text-xl text-[var(--text-primary)] text-right leading-loose" dir="rtl">
                    {bm.arabic_text}
                  </p>

                  <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
                    &ldquo;{bm.translation_text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 6: REFLECTION CARD STUDIO ==================== */}
      {activeTab === 'art' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-xs">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Ayah Reflection Studio</span>
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Ayah Reflection Card Designer
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                Design custom illuminated reflection cards with elegant color palettes, Arabic typography,
                and ornamental borders. Instant high-resolution PNG export for your personal study or social sharing.
              </p>
            </div>
          </div>

          <ReflectionCardGenerator defaultAyahText={artPromptVerse} />
        </div>
      )}
    </div>
  );
}

// Welcome / Homepage - Quran Recitation & Peer Memorization Accountability Platform
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  Search,
  MessageSquare,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import BismillahHeader from '../components/BismillahHeader.jsx';
import PWAInstallButton from '../components/PWAInstallButton.jsx';
import heroQuranBackdrop from '../assets/images/hero_quran_backdrop_1795241713292.jpg';
import firstQuranHeroImg from '../assets/images/quran_hero_banner_1788410479439.jpg';
import secondQuranHeroImg from '../assets/images/quran_hero_illustration_1788484620067.jpg';

export default function WelcomePage() {
  const { user } = useAuth();

  // Interactive Live Quran Recitation Sample on Homepage
  const [isPlayingRecitation, setIsPlayingRecitation] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const heroQuranSources = [firstQuranHeroImg, secondQuranHeroImg, '/quran-fallback.png'];
  const [quranCardIdx, setQuranCardIdx] = useState(0);
  const audioRef = useRef(null);

  const handleQuranCardImgError = () => {
    setQuranCardIdx((prev) => (prev < heroQuranSources.length - 1 ? prev + 1 : prev));
  };

  const sampleAyah = {
    ref: 'Surah Al-Baqarah 2:255 (Ayat al-Kursi)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3',
  };

  const toggleRecitation = () => {
    if (!audioRef.current) return;
    if (isPlayingRecitation) {
      audioRef.current.pause();
      setIsPlayingRecitation(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingRecitation(true))
        .catch((e) => {
          console.warn('Audio playback error:', e);
          setIsPlayingRecitation(false);
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Hero Section with Full-Bleed Holy Qur'an Background */}
      <section className="relative overflow-hidden border-b border-[var(--border-color)] bg-gradient-to-br from-emerald-950 via-[#152212] to-stone-950">
        {/* Background Qur'an Photograph */}
        {!heroImgFailed && (
          <img
            src={heroQuranBackdrop}
            onError={() => setHeroImgFailed(true)}
            alt="Open illuminated Holy Qur'an on a carved wooden rehal in warm golden light"
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
          />
        )}

        {/* Measured Contrast Scrim */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/75 via-emerald-950/68 to-black/82 pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Foreground Content */}
        <div className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
          {/* Open Quran & Moon Logo */}
          <div className="flex items-center justify-center">
            <BrandLogo size="lg" className="shadow-xl ring-1 ring-amber-300/30" />
          </div>

          {/* Clean Unboxed Editorial Kicker */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-amber-200/95 tracking-wide">
            <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Holy Qur&rsquo;an Recitation &amp; Memorization Accountability</span>
          </div>

          {/* Bismillah Plaque preserving dark olive ink in light mode & emerald in dark mode */}
          <div className="max-w-2xl mx-auto rounded-2xl bg-[#fbfbf9]/92 dark:bg-[#0f1412]/88 backdrop-blur-md border border-amber-200/60 dark:border-emerald-800/60 px-5 py-3 shadow-lg">
            <BismillahHeader showTranslation={true} className="my-0" />
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] text-balance drop-shadow-sm">
            Qur&rsquo;an Recitation &amp; Memorization{' '}
            <span className="text-amber-300">with an Accountability Mate.</span>
          </h1>

          {/* Core Value Proposition */}
          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-stone-100/90 leading-relaxed">
            &ldquo;Find someone else on the same journey, see when they&rsquo;re free, pair up, and keep each other accountable in recitation, revision, and daily consistency.&rdquo;
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Users className="w-4 h-4" />
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold border border-amber-200/40 bg-white/12 backdrop-blur-sm text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Create Account</span>
                </Link>
              </>
            )}

            <Link
              to="/ayah-finder"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold border border-white/25 bg-black/35 backdrop-blur-sm text-white hover:bg-black/50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>Open Ayah Finder &amp; Recitation</span>
            </Link>

            <PWAInstallButton className="w-full sm:w-auto px-5 py-3.5" />
          </div>
        </div>
      </section>

      {/* Featured Holy Qur'an on Rehal & Prophetic Tradition (Hadith) */}
      <section className="pt-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden border border-emerald-200/80 dark:border-emerald-900/60 shadow-xl group bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white min-h-[340px] sm:min-h-[390px] flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.2),transparent_65%)] pointer-events-none" />
          <div className="absolute inset-0 bg-emerald-950/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl py-2">
            {heroQuranSources[quranCardIdx] && (
              <img
                src={heroQuranSources[quranCardIdx]}
                onError={handleQuranCardImgError}
                alt="Illuminated Holy Qur'an open on wooden rehal"
                className="max-h-56 sm:max-h-72 w-auto object-contain rounded-2xl filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] transform group-hover:scale-[1.03] transition-transform duration-500 select-none"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
              />
            )}
            <div className="mt-5 space-y-1.5">
              <div className="text-xs font-semibold text-amber-300 tracking-wide uppercase">
                Prophetic Tradition (Hadith)
              </div>
              <p className="font-serif text-base sm:text-xl font-medium leading-snug drop-shadow-md text-amber-100">
                &ldquo;The best of you are those who learn the Qur&rsquo;an and teach it.&rdquo;
              </p>
              <div className="text-[11px] sm:text-xs text-emerald-200/85 font-mono">
                Sahih al-Bukhari 5027
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Quran Recitation Featurette Card */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 text-left shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                  Listen &amp; Recite: {sampleAyah.ref}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Recitation by Sheikh Mishary Rashid Alafasy
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {sampleAyah?.audioUrl ? (
                <audio
                  ref={audioRef}
                  src={sampleAyah.audioUrl || null}
                  onEnded={() => setIsPlayingRecitation(false)}
                />
              ) : null}
              <button
                onClick={toggleRecitation}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isPlayingRecitation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
                }`}
              >
                {isPlayingRecitation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingRecitation ? 'Pause Audio' : 'Play Recitation'}</span>
              </button>

              <Link
                to="/ayah-finder?surah=2&ayah=255"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:text-[var(--primary)] hover:border-[var(--primary-border)] transition-colors"
              >
                <span>Read Full Ayah</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-b from-[var(--bg-subtle)]/60 to-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <p
              className="font-arabic text-xl sm:text-2xl text-[var(--text-primary)] text-right leading-[2.3] select-text"
              dir="rtl"
            >
              {sampleAyah.arabic}
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] italic mt-3 leading-relaxed">
              &ldquo;{sampleAyah.translation}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Features Overview Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[var(--border-color)]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Comprehensive Qur&rsquo;anic Companionship Platform
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
            Every feature thoughtfully designed to cultivate steadfast Quran recitation, mutual revision, and lifelong sisterhood in the book of Allah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Profile Creation &amp; Memorization Stages
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Define your stage (Beginning, Juz 30, Juz 1–5, or Revision), target goal, preferred study times, and short bio so peers can evaluate compatibility.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Discover &amp; Browse Learners
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Browse other dedicated learners on the platform. Filter by memorization stage, time preference, and availability to find your ideal match.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Detailed Learner Profiles
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              View current progress, specific Surah targets, personal bio, and study philosophy before sending a partner invitation.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Availability Indicators
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Clear indicators showing whether a learner is open for morning (Fajr), afternoon (Asr), evening, or weekend sessions, avoiding scheduling guesswork.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-xs">
              05
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Send / Accept / Decline Requests
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              The 1-to-1 pairing mechanic. Send personalized invitations with notes, review incoming requests, and establish mutual study commitments.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-xs">
              06
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Active Partnership &amp; Check-Ins
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              The core accountability differentiator: shared memorization goals, daily check-in logs, and consecutive streak tracking.
            </p>
          </div>

          {/* Feature 7 & Quran Suite */}
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xs space-y-2 md:col-span-2 lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Partner Messaging &bull; Dedicated Qur&rsquo;an &amp; Ayah Reader</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Coordinate Sessions, Recite Together, and Study the Qur&rsquo;an
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Send scheduling notes directly between paired partners and access all 114 Surahs with authentic Uthmani script and audio recitation.
                </p>
              </div>
              <Link
                to="/ayah-finder"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shrink-0"
              >
                <span>Explore Qur&rsquo;an Ayahs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
        <p>Quran Mate &bull; Dedicated to empowering believers in memorizing, revising, and living the Noble Qur&rsquo;an together &bull; Built with Ihsan</p>
      </footer>
    </div>
  );
}

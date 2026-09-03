// Welcome / Homepage - Quran Recitation & Peer Memorization Accountability Platform
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  CalendarCheck,
  Search,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Send,
  UserCheck
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function WelcomePage() {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  // Interactive Live Quran Recitation Sample on Homepage
  const [isPlayingRecitation, setIsPlayingRecitation] = useState(false);
  const audioRef = useRef(null);

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

  const handleQuickDemoLogin = async (email, redirectPath = '/discover') => {
    await demoLogin(email);
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        {/* Open Quran & Moon Logo */}
        <div className="flex items-center justify-center">
          <BrandLogo size="lg" className="shadow-lg hover:scale-105 transition-transform" />
        </div>

        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)] shadow-2xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Holy Qur&rsquo;an Recitation & Memorization Accountability</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.15]">
          Qur&rsquo;an Recitation &amp; Memorization <br />
          <span className="text-[var(--primary)]">with an Accountability Mate.</span>
        </h1>

        {/* Subtitle directly from MVP Core Value Proposition */}
        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-[var(--text-secondary)] leading-relaxed">
          &ldquo;Find someone else on the same journey, see when they&rsquo;re free, pair up, and keep each other accountable in recitation, revision, and daily consistency.&rdquo;
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/discover"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Find a Quran Mate</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/ayah-finder"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:border-[var(--primary-border)] transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-[var(--primary)]" />
            <span>Open Ayah Finder &amp; Recitation</span>
          </Link>

          <Link
            to="/tracker"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            <span>Daily Tracker</span>
          </Link>
        </div>

        {/* Demo Walkthrough Box for Presentation & Judging (Directly from MVP criteria) */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-r from-amber-50/70 via-amber-50/40 to-emerald-50/50 dark:from-amber-950/20 dark:to-emerald-950/20 text-left shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/70 dark:border-amber-900/40 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
                Hackathon Demo Testing Mode (3-Step Judge Flow)
              </h3>
            </div>
            <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
              Switch profiles instantly with 1 click:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleQuickDemoLogin('maryam@quranmate.demo', '/discover')}
              className="p-3 rounded-2xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-zinc-900/80 hover:border-[var(--primary)] text-left transition-all shadow-2xs group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)]">
                  Step 1: Maryam Al-Fassi
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-semibold">
                  Juz 1–5
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Browse learners, view Fatima&rsquo;s availability, send a partner request.
              </p>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('fatimah@quranmate.demo', '/requests')}
              className="p-3 rounded-2xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-zinc-900/80 hover:border-[var(--primary)] text-left transition-all shadow-2xs group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)]">
                  Step 2: Fatima Zahra
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-semibold">
                  Revision
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Open Requests, accept incoming partner invitation, view active match.
              </p>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('aisha@quranmate.demo', '/partnership')}
              className="p-3 rounded-2xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-zinc-900/80 hover:border-[var(--primary)] text-left transition-all shadow-2xs group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)]">
                  Step 3: Shared Partnership
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 font-semibold">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Mutual goal, daily check-in button, streak counter, and partner chat.
              </p>
            </button>
          </div>
        </div>

        {/* Live Quran Recitation Featurette Card */}
        <div className="mt-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 text-left shadow-sm space-y-4">
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
              <audio
                ref={audioRef}
                src={sampleAyah.audioUrl}
                onEnded={() => setIsPlayingRecitation(false)}
              />
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

      {/* The 7 MVP Features Grid (Direct translation of the attached Hackathon MVP Document) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[var(--border-color)]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Built Strictly to the Hackathon MVP Scope
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
            Every core feature designed to solve the Quran memorization consistency problem without unnecessary complexity.
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
                  <span>Feature 07 &bull; Partner Messaging + Dedicated Qur&rsquo;an &amp; Ayah Reader</span>
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
        <p>Quran Mate &bull; Peer Quran Recitation &amp; Memorization Accountability &bull; Hackathon MVP</p>
      </footer>
    </div>
  );
}

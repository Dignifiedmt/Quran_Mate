// Central Learner Dashboard Page
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  CalendarCheck,
  BookOpen,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Video,
  PlusCircle,
  TrendingUp,
  Award,
  Layers,
  Inbox,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import BismillahHeader from '../components/BismillahHeader.jsx';
import BismillahLoader from '../components/BismillahLoader.jsx';
import BrandLogo from '../components/BrandLogo.jsx';
import DashboardQuranSection from '../components/DashboardQuranSection.jsx';
import CreateGroupModal from '../components/CreateGroupModal.jsx';
import MemorizationProgressCard from '../components/MemorizationProgressCard.jsx';
import InAppVideoModal from '../components/InAppVideoModal.jsx';
import heroQuranBackdrop from '../assets/images/hero_quran_backdrop_1795241713292.jpg';

export default function DashboardPage() {
  const { user, activePartnershipId } = useAuth();
  const navigate = useNavigate();

  const [activeDashboardTab, setActiveDashboardTab] = useState('overview'); // 'overview' | 'quran'
  const [summary, setSummary] = useState(null);
  const [partnership, setPartnership] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateCircleOpen, setIsCreateCircleOpen] = useState(false);
  const [activeVideoSession, setActiveVideoSession] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [summaryRes, partnerRes, sessionRes, groupsRes] = await Promise.allSettled([
          api.getTrackerSummary(),
          api.getCurrentPartnership(),
          api.getSessions(),
          api.getGroups(),
        ]);

        if (summaryRes.status === 'fulfilled') {
          setSummary(summaryRes.value);
        }
        if (partnerRes.status === 'fulfilled' && partnerRes.value?.partnership) {
          setPartnership(partnerRes.value.partnership);
        }
        if (sessionRes.status === 'fulfilled') {
          const sessions = sessionRes.value.sessions || [];
          setUpcomingSessions(sessions.filter((s) => s.status === 'scheduled').slice(0, 2));
        }
        if (groupsRes.status === 'fulfilled') {
          setStudyGroups((groupsRes.value || []).slice(0, 2));
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const todayDateFormatted = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
    []
  );

  if (loading) {
    return (
      <BismillahLoader
        message="Opening Learner Command Center..."
        submessage="In the name of Allah, the Entirely Merciful, the Especially Merciful"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Header with Holy Qur'an Background */}
      <div className="relative rounded-3xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950 via-[#152212] to-stone-950 p-6 sm:p-8 shadow-lg overflow-hidden">
        {/* Background Qur'an Photograph */}
        <img
          src={heroQuranBackdrop}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
        />

        {/* Measured Contrast Scrim */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/82 via-emerald-950/75 to-black/70 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <BrandLogo size="lg" className="shrink-0 hidden sm:flex mt-1 rounded-2xl shadow-lg ring-1 ring-amber-300/30" />
            <div className="space-y-2.5">
              <div className="inline-block rounded-2xl bg-[#fbfbf9]/92 dark:bg-[#0f1412]/88 backdrop-blur-md border border-amber-200/60 dark:border-emerald-800/60 px-4 py-1.5 shadow-sm">
                <BismillahHeader showTranslation={false} className="my-0" />
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Learner Command Center &bull; {todayDateFormatted}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-xs">
                Assalamu Alaikum, {user?.name ? user.name.split(' ')[0] : 'Sister'}!
              </h1>
              <p className="text-sm text-stone-100/90 max-w-xl">
                May Allah bless your recitation, expand your heart with the Qur&rsquo;an, and grant you steadfast consistency in your Hifz journey today.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveDashboardTab('quran')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-md transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Qur&rsquo;an Reader</span>
            </button>

            <Link
              to="/tracker"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-md transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Recitation</span>
            </Link>

            <Link
              to="/ayah-finder"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-white/25 bg-black/35 backdrop-blur-sm text-white hover:bg-black/55 transition-colors"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>Ayah &amp; Tafsir</span>
            </Link>

            <Link
              to="/groups"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-white/25 bg-black/35 backdrop-blur-sm text-white hover:bg-black/55 transition-colors"
            >
              <Users className="w-4 h-4 text-emerald-300" />
              <span>Study Circles</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Top View Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs max-w-md">
        <button
          type="button"
          onClick={() => setActiveDashboardTab('overview')}
          className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeDashboardTab === 'overview'
              ? 'bg-[var(--primary)] text-white shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Overview &amp; Halaqah</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDashboardTab('quran')}
          className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeDashboardTab === 'quran'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Qur&rsquo;an Reciter</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold">
            114
          </span>
        </button>
      </div>

      {/* Tab 2: Integrated Holy Qur'an Reader */}
      {activeDashboardTab === 'quran' && (
        <div className="space-y-6">
          <DashboardQuranSection defaultSurahNumber={user?.memorized_from_surah || 1} />
        </div>
      )}

      {/* Tab 1: Overview & Activity */}
      {activeDashboardTab === 'overview' && (
        <>

      {/* High-Level Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Metric */}
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800 shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Daily Streak
            </div>
            <div className="text-2xl font-black text-[var(--text-primary)]">
              {summary?.streak || 0}{' '}
              <span className="text-xs font-semibold text-[var(--text-muted)]">Days</span>
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Keep momentum going</span>
            </div>
          </div>
        </div>

        {/* Daily Recitation Goal */}
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Today&rsquo;s Quran Goal
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] truncate">
              {user?.goal || '1 Juz per day'}
            </div>
            <Link
              to="/tracker"
              className="text-[11px] text-[var(--primary)] font-semibold hover:underline flex items-center gap-1 mt-0.5"
            >
              <span>{summary?.today?.hasCompletedToday ? 'Logged today ✓' : 'Tap to log now'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Active Accountability Mate */}
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-200 dark:border-orange-800 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Accountability Mate
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] truncate">
              {partnership?.partner?.name || 'Not paired yet'}
            </div>
            <Link
              to={partnership ? '/partnership' : '/discover'}
              className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1 mt-0.5"
            >
              <span>{partnership ? 'Enter Mate Room' : 'Find a Sister'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Memorization Stage */}
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Current Hifz Stage
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] truncate">
              {user?.memorization_stage || 'Juz 1–5'}
            </div>
            <Link
              to="/profile"
              className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 mt-0.5"
            >
              <span>Edit targets</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dedicated Quran Memorization Progress Tracker */}
      <MemorizationProgressCard />

      {/* Upcoming Peer Study Sessions (If Any) */}
      {upcomingSessions.length > 0 && (
        <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Upcoming Peer Study Sessions</span>
            </div>
            <Link
              to="/tracker#sessions"
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
            >
              View Schedule &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcomingSessions.map((session) => {
              const isGoogleMeet = session.meeting_link?.includes('meet.google.com');
              return (
                <div
                  key={session.id}
                  className="p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/80 bg-[var(--bg-surface)] flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {session.title || 'Quran Recitation Session'}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2">
                      <span>{session.session_date} at {session.start_time}</span>
                      <span>&bull;</span>
                      <span>{session.duration_minutes} mins</span>
                    </div>
                  </div>
                  {isGoogleMeet ? (
                    <a
                      href={session.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs shrink-0"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meet</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveVideoSession(session)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join In-App</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Collaborative Study Circles & Group Rooms */}
      <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Study Circles &amp; Collaborative Rooms
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                Multi-Learner Halaqahs
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Collaborative spaces for collective 30-Juz Khatmahs, group recitation, and live halaqahs
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => setIsCreateCircleOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Study Room</span>
            </button>
            <Link
              to="/groups"
              className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>Explore All Circles</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {studyGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyGroups.map((grp) => (
              <div
                key={grp.id}
                onClick={() => navigate(`/groups/${grp.id}`)}
                className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--primary)] transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                    {grp.category}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{grp.members_count || 1} members</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                    {grp.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                    {grp.target_goal}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[var(--text-muted)]">
                    <span>Collective Khatmah</span>
                    <span className="text-emerald-600 font-bold">{grp.completed_juz_count || 0}/30 Juz</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${grp.completed_percentage || 0}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[var(--text-muted)]">{grp.meeting_schedule}</span>
                  <span className="text-xs font-bold text-[var(--primary)] flex items-center gap-1">
                    <span>Enter Room</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[var(--text-muted)]">
            <Link to="/groups" className="text-[var(--primary)] font-bold hover:underline">
              Browse available study circles &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Quick Study Tools Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Quick Study Tools
          </h2>
          <span className="text-[11px] text-[var(--text-muted)]">
            Use &ldquo;All Screens&rdquo; in the top bar for full directory
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              name: 'Holy Qur\'an Suite',
              description: 'Full 114-Surah reader, Juz index & audio recitation',
              path: '/quran',
              icon: BookOpen,
              color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
            },
            {
              name: 'Ayah & Tafsir Finder',
              description: 'Search verses by keyword or reference & save notes',
              path: '/ayah-finder',
              icon: Search,
              color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
            },
            {
              name: 'Partner Requests',
              description: 'Review incoming & sent accountability invitations',
              path: '/requests',
              icon: Inbox,
              color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
            },
            {
              name: 'My Profile & Schedule',
              description: 'Update Hifz goals, weekly slots & bookmarks',
              path: '/profile',
              icon: User,
              color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
            },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] hover:border-[var(--primary-border)] transition-all flex items-start gap-3 group shadow-2xs"
              >
                <div className={`p-2.5 rounded-xl border ${tool.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors truncate">
                    {tool.name}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-snug line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      </>
      )}

      {/* In-App Jitsi Video Modal for Dashboard Upcoming Sessions */}
      <InAppVideoModal
        isOpen={Boolean(activeVideoSession)}
        onClose={() => setActiveVideoSession(null)}
        roomName={
          activeVideoSession?.meeting_link?.includes('meet.jit.si/')
            ? activeVideoSession.meeting_link.split('meet.jit.si/')[1].split('#')[0]
            : `QuranMate-Session-${activeVideoSession?.id || 'Halaqah'}`
        }
        title={activeVideoSession?.title || 'Live Recitation Session'}
        subtitle={`${activeVideoSession?.session_date || ''} at ${activeVideoSession?.start_time || ''} • In-App Jitsi Room`}
      />

      {/* Create Study Room Modal accessible to all */}
      <CreateGroupModal
        isOpen={isCreateCircleOpen}
        onClose={() => setIsCreateCircleOpen(false)}
        onCreated={(newGroupId) => {
          setIsCreateCircleOpen(false);
          if (newGroupId) navigate(`/groups/${newGroupId}`);
        }}
      />
    </div>
  );
}

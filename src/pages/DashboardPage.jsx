// Central Learner Dashboard Page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  CalendarCheck,
  BookOpen,
  Users,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Video,
  PlusCircle,
  TrendingUp,
  Award,
  Layers,
  Home,
  Sliders,
  User,
  Inbox
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import BismillahHeader from '../components/BismillahHeader.jsx';
import { SCREEN_SECTIONS } from '../components/AllScreensDirectory.jsx';

export default function DashboardPage() {
  const { user, activePartnershipId } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [partnership, setPartnership] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="relative rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-xs overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <BismillahHeader showTranslation={false} className="py-0 mb-1" />
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Learner Command Center &bull; {todayDateFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Assalamu Alaikum, {user?.name ? user.name.split(' ')[0] : 'Sister'}!
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl">
              May Allah bless your recitation, expand your heart with the Qur&rsquo;an, and grant you steadfast consistency in your Hifz journey today.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/tracker"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Recitation</span>
            </Link>

            <Link
              to="/quran"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Read Qur&rsquo;an</span>
            </Link>

            <Link
              to="/ayah-finder"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            >
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Ayah &amp; Tafsir</span>
            </Link>

            <Link
              to="/groups"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Study Circles</span>
            </Link>
          </div>
        </div>
      </div>

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
              {summary?.userStreak || 0}{' '}
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
          <div className="flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Today&rsquo;s Quran Goal
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] truncate">
              {user?.daily_goal || '1 Juz per day'}
            </div>
            <Link
              to="/tracker"
              className="text-[11px] text-[var(--primary)] font-semibold hover:underline flex items-center gap-1 mt-0.5"
            >
              <span>{summary?.todayLogged ? 'Logged today ✓' : 'Tap to log now'}</span>
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
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/80 bg-[var(--bg-surface)] flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {session.topic || 'Quran Recitation Session'}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2">
                    <span>{session.scheduled_date} at {session.scheduled_time}</span>
                    <span>&bull;</span>
                    <span>{session.duration_minutes} mins</span>
                  </div>
                </div>
                {session.meeting_link && (
                  <a
                    href={session.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs shrink-0"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Call</span>
                  </a>
                )}
              </div>
            ))}
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

          <div className="flex items-center gap-2 self-start sm:self-auto">
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

      {/* ALL SCREENS & FULL APP DIRECTORY */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>All Screens &amp; Feature Launchpad</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Direct 1-click links to every screen, study tool, and sisterhood feature in Quran Mate
            </p>
          </div>
        </div>

        {/* Render Categorized Cards */}
        <div className="space-y-6">
          {SCREEN_SECTIONS.map((section) => (
            <div key={section.category} className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {section.category}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] hover:border-[var(--primary-border)] transition-all flex items-start gap-3.5 group shadow-2xs"
                    >
                      <div className={`p-2.5 rounded-xl border ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors truncate">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)] shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-snug line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

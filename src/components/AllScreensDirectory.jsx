// Comprehensive All-Screens Directory Component & Modal
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Search,
  CalendarCheck,
  Users,
  Flame,
  MessageSquare,
  Inbox,
  User,
  Sliders,
  LogIn,
  UserPlus,
  Cloud,
  X,
  ExternalLink,
  ChevronRight,
  Compass,
  CheckCircle2,
  Sparkles,
  Calendar,
  Layers,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { usePWAInstall } from '../hooks/usePWAInstall.js';

export const SCREEN_SECTIONS = [
  {
    category: 'Core Hub & Overview',
    items: [
      {
        name: 'Main Home / Welcome',
        path: '/welcome',
        icon: Home,
        description: 'Landing page with Quran hero visual, hadiths, demo accounts & features',
        badge: 'Public & Demo',
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      },
      {
        name: 'Learner Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        description: 'Central command center with streaks, active mate, goals & quick launch',
        badge: 'Main Hub',
        color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
      },
    ],
  },
  {
    category: 'Qur\'an Suite & Recitation',
    items: [
      {
        name: 'Noble Qur\'an Reader',
        path: '/quran',
        icon: BookOpen,
        description: 'Browse all 114 Surahs with authentic Arabic script, English meanings & audio',
        badge: '114 Surahs',
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      },
      {
        name: 'Ayah Finder & Tafsir',
        path: '/ayah-finder',
        icon: Search,
        description: 'Thematic ayah search, 4 reciters, repeat audio loop & Surah/Juz index browser',
        badge: 'Audio & Search',
        color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
      },
      {
        name: 'Daily Habit Tracker',
        path: '/tracker',
        icon: CalendarCheck,
        description: 'Log recitation, Hifz & Muraja\'ah with Recharts weekly chart & 14-day heatmap',
        badge: 'Weekly Chart',
        color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      },
    ],
  },
  {
    category: 'Accountability & Sisterhood',
    items: [
      {
        name: 'Study Circles & Group Rooms',
        path: '/groups',
        icon: Layers,
        description: 'Collaborative rooms for multi-person halaqahs, collective 30-Juz Khatmahs & live recitation calls',
        badge: 'New Group Feature',
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      },
      {
        name: 'Discover Study Mates',
        path: '/discover',
        icon: Users,
        description: 'Filter peer learners by stage, target Juz, daily pace & timezone compatibility',
        badge: 'Matching',
        color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      },
      {
        name: 'Active Mate Room',
        path: '/partnership',
        icon: Flame,
        description: 'Shared accountability room with daily dual check-in, streak & joint targets',
        badge: '1-to-1 Room',
        color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
      },
      {
        name: 'Partner Requests & Invites',
        path: '/requests',
        icon: Inbox,
        description: 'View incoming and sent partner invitations with accept/decline actions',
        badge: 'Invitations',
        color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
      },
      {
        name: 'Study Session Scheduler',
        path: '/tracker#sessions',
        icon: Calendar,
        description: 'Schedule live Jitsi video/audio peer recitation with Google Calendar links',
        badge: 'Live Calls',
        color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
      },
    ],
  },
  {
    category: 'Profile & Settings',
    items: [
      {
        name: 'My Learner Profile',
        path: '/profile',
        icon: User,
        description: 'View and update your personal Quran goals, memorization stage & daily target',
        badge: 'Personal',
        color: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800',
      },
      {
        name: 'Profile Setup Wizard',
        path: '/profile/setup',
        icon: Sliders,
        description: 'Customize learning pace, availability hours, target Juz and languages',
        badge: 'Wizard',
        color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800',
      },
      {
        name: 'Install Mobile App (PWA)',
        path: '#install-pwa',
        icon: Smartphone,
        description: 'Install Quran Mate on your phone like the 3MTT app with offline caching and home screen launch',
        badge: '3MTT Style PWA',
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      },
    ],
  },
];

export default function AllScreensDirectory({ isOpen, onClose }) {
  const { activePartnershipId } = useAuth();
  const { install, isInstallable } = usePWAInstall();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigate = async (path) => {
    if (path === '#install-pwa') {
      onClose();
      if (isInstallable) {
        await install();
      } else {
        // Trigger session storage so banner opens if dismissed
        sessionStorage.removeItem('quran_mate_pwa_dismissed');
        window.dispatchEvent(new CustomEvent('pwa-open-guide'));
      }
      return;
    }
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-surface)]/95 backdrop-blur-md px-6 py-5 border-b border-[var(--border-color)] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>All Screens &amp; Features Directory</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Full Suite
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Instant 1-click access to every page, tool, and feature in Quran Mate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            aria-label="Close directory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Shortcuts Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => handleNavigate('/welcome')}
              className="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--primary-light)] hover:border-[var(--primary-border)] text-left transition-all group"
            >
              <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-[var(--text-primary)]">Main Home</div>
              <div className="text-[10px] text-[var(--text-muted)]">Public welcome &amp; info</div>
            </button>

            <button
              onClick={() => handleNavigate('/dashboard')}
              className="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--primary-light)] hover:border-[var(--primary-border)] text-left transition-all group"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-[var(--text-primary)]">Dashboard</div>
              <div className="text-[10px] text-[var(--text-muted)]">Daily stats &amp; overview</div>
            </button>

            <button
              onClick={() => handleNavigate('/quran')}
              className="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--primary-light)] hover:border-[var(--primary-border)] text-left transition-all group"
            >
              <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-[var(--text-primary)]">Qur&rsquo;an Reader</div>
              <div className="text-[10px] text-[var(--text-muted)]">114 Surahs &amp; audio</div>
            </button>

            <button
              onClick={() => handleNavigate('/partnership')}
              className="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--primary-light)] hover:border-[var(--primary-border)] text-left transition-all group"
            >
              <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-[var(--text-primary)]">Active Mate</div>
              <div className="text-[10px] text-[var(--text-muted)]">Accountability room</div>
            </button>
          </div>

          {/* Categorized Screen Directory */}
          {SCREEN_SECTIONS.map((section) => (
            <div key={section.category} className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                <span>{section.category}</span>
                <span className="flex-1 h-px bg-[var(--border-subtle)]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className="p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] hover:border-[var(--primary-border)] transition-all text-left flex items-start justify-between group shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl border ${item.color} shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                              {item.name}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all shrink-0 mt-1 ml-2" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[var(--bg-surface)]/95 backdrop-blur-md px-6 py-4 border-t border-[var(--border-color)] flex items-center justify-between z-10">
          <span className="text-[11px] text-[var(--text-muted)]">
            Use the top navigation bar or this directory to jump anywhere anytime.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-colors text-[var(--text-primary)]"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}

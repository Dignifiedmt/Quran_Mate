// Groups Directory Page - Qur'an Study Circles & Collaborative Halaqah Rooms
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  BookOpen,
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Video,
  LogIn,
  UserPlus,
  X
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import BismillahHeader from '../components/BismillahHeader.jsx';
import BismillahLoader from '../components/BismillahLoader.jsx';
import CreateGroupModal from '../components/CreateGroupModal.jsx';

const CATEGORIES = [
  'All',
  'Memorization',
  'Juz Amma',
  'Surah Al-Kahf',
  'Murajaah',
  'Tajweed',
  'Khatmah'
];

export default function GroupsDirectoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [signInPromptGroup, setSignInPromptGroup] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadGroups();
    }, searchQuery ? 250 : 0);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  async function loadGroups() {
    try {
      setLoading(true);
      const data = await api.getGroups({
        category: selectedCategory,
        search: searchQuery
      });
      setGroups(data || []);
    } catch (err) {
      console.error('Failed to load study circles:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreateModal() {
    if (!user) {
      setSignInPromptGroup('create');
      return;
    }
    setIsCreateModalOpen(true);
  }

  async function handleJoinCircle(e, group) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setSignInPromptGroup(group.name || 'this study circle');
      return;
    }

    if (group.is_member) {
      navigate(`/groups/${group.id}`);
      return;
    }

    try {
      setActionLoadingId(group.id);
      await api.joinGroup(group.id);
      navigate(`/groups/${group.id}`);
    } catch (err) {
      console.error('Failed to join circle:', err);
      if (err.status === 401) {
        setSignInPromptGroup(group.name || 'this study circle');
      }
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bismillah Header with Lazy Writing */}
      <BismillahHeader showTranslation={true} className="mb-2" />

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-10 shadow-lg border border-emerald-800/60">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Collaborative Qur&rsquo;an Circles &bull; حلقات القرآن</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Study Circles &amp; Collaborative Rooms
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
            Gather with fellow seekers in virtual halaqahs. Complete collective 30-Juz Khatmahs, hold weekly live recitation calls, and keep each other steadfast in Allah&rsquo;s Book.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-2xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{user ? 'Start a New Circle' : 'Sign in to Start a Circle'}</span>
            </button>
            <Link
              to={user ? '/partnership' : '/login'}
              className="px-4 py-2.5 rounded-2xl bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-100 font-medium text-xs sm:text-sm transition-colors flex items-center gap-2"
            >
              <span>{user ? '1-on-1 Partner Pairing' : 'Sign In to Join'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Decorative background Islamic geometry glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Sign-In Notice Banner for Unauthenticated Visitors */}
      {!user && (
        <div className="rounded-2xl border border-amber-300/80 dark:border-amber-800/70 bg-amber-50/90 dark:bg-amber-950/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                Sign in to join the study circle
              </h2>
              <p className="text-xs text-amber-900/80 dark:text-amber-200/80 mt-0.5">
                You can browse available Qur&rsquo;an circles freely. Sign in or create an account to join a halaqah, claim a Juz, or post reflections.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circles by name or topic..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] text-xs sm:text-sm focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[var(--primary)] text-white shadow-2xs'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Circles Grid */}
      {loading ? (
        <BismillahLoader
          message="Loading Qur'an Study Circles & Halaqahs..."
          submessage="In the name of Allah, the Entirely Merciful, the Especially Merciful"
          className="py-12"
        />
      ) : groups.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[var(--primary)] flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">No Circles Found</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mt-1">
              Be the first to create a Qur&rsquo;an study circle for this category and invite sisters to recite together!
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{user ? 'Create Study Circle' : 'Sign in to Create Circle'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((group) => {
            const isMember = group.is_member;
            const completedPct = group.completed_percentage || 0;

            return (
              <div
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="group relative rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 hover:border-[var(--primary)] transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Category & Capacity */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      <BookOpen className="w-3 h-3" />
                      <span>{group.category}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {isMember && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Joined</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] font-medium">
                        <Users className="w-3.5 h-3.5" />
                        <span>{group.members_count || 1} members</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors mb-1.5">
                    {group.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                    {group.description || 'Collaborative Quran halaqah dedicated to memorization, revision, and shared Khatmah.'}
                  </p>

                  {/* Goal & Schedule Highlights */}
                  <div className="space-y-2 mb-4 p-3 rounded-2xl bg-[var(--bg-subtle)]/70 border border-[var(--border-color)] text-xs">
                    <div className="flex items-start gap-2 text-[var(--text-primary)]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">
                        <strong>Goal:</strong> {group.target_goal}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="line-clamp-1">{group.meeting_schedule}</span>
                    </div>
                  </div>

                  {/* Collective Khatmah Progress Indicator */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-[var(--text-secondary)]">Collective Khatmah Progress</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {group.completed_juz_count || 0}/30 Juz ({completedPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${completedPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                    <Video className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Live Recitation Ready</span>
                  </div>

                  <button
                    onClick={(e) => handleJoinCircle(e, group)}
                    disabled={actionLoadingId === group.id}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                      isMember
                        ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <span>
                      {isMember
                        ? 'Enter Room'
                        : user
                          ? 'Join Circle'
                          : 'Sign in to Join'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sign In Required Modal when clicking Join/Create without signing in */}
      {signInPromptGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setSignInPromptGroup(null)}
              aria-label="Close"
              className="absolute right-4 top-4 p-1.5 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[var(--primary)] flex items-center justify-center">
              <LogIn className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                Sign in to join the study circle
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {signInPromptGroup === 'create'
                  ? 'Please sign in or create an account to start a new Qur’an study circle.'
                  : `Please sign in or create an account to join "${signInPromptGroup}", claim a Juz, and participate in live halaqah discussions.`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Link
                to="/login"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="flex-1 py-2.5 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Create Circle Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newGroupId) => {
          loadGroups();
          if (newGroupId) navigate(`/groups/${newGroupId}`);
        }}
      />
    </div>
  );
}

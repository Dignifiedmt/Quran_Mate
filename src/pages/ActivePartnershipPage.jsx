// Active Quran Partnership Page (Screen 7 - The Accountability Loop)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  CheckCircle2,
  Clock,
  MessageCircle,
  Calendar,
  BookOpen,
  Target,
  Sparkles,
  AlertCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import SessionScheduler from '../components/SessionScheduler.jsx';

export default function ActivePartnershipPage() {
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [partnershipData, setPartnershipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkinNotes, setCheckinNotes] = useState('');
  const [isUpdatingCheckin, setIsUpdatingCheckin] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const fetchPartnership = async () => {
    try {
      setLoading(true);
      const data = await api.getCurrentPartnership();
      setPartnershipData(data.partnership);
      if (data.partnership?.today?.myCheckin?.notes) {
        setCheckinNotes(data.partnership.today.myCheckin.notes);
      }
    } catch (err) {
      console.error('Failed to load partnership:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnership();
  }, []);

  const handleToggleCheckin = async () => {
    if (!partnershipData) return;
    try {
      setIsUpdatingCheckin(true);
      await api.toggleCheckin(partnershipData.id, checkinNotes);
      await fetchPartnership();
      await refreshProfile();
    } catch (err) {
      alert(err.message || 'Failed to update check-in');
    } finally {
      setIsUpdatingCheckin(false);
    }
  };

  const handleEndPartnership = async () => {
    if (!partnershipData) return;
    try {
      setIsEnding(true);
      await api.endPartnership(partnershipData.id);
      await refreshProfile();
      setShowEndModal(false);
      navigate('/discover');
    } catch (err) {
      alert(err.message || 'Failed to end partnership');
    } finally {
      setIsEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 animate-pulse space-y-6">
          <div className="h-8 bg-[var(--bg-subtle)] rounded w-1/3" />
          <div className="h-40 bg-[var(--bg-subtle)] rounded-2xl" />
        </div>
      </div>
    );
  }

  // No active partnership empty state
  if (!partnershipData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          No Active Quran Mate Yet
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto leading-relaxed">
          The core differentiator of Quran Mate is having a dedicated 1-to-1 accountability partner who checks in on your daily memorization and revision.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/discover"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs"
          >
            Find a Quran Mate
          </Link>
          <Link
            to="/requests"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
          >
            Check Received Requests
          </Link>
        </div>
      </div>
    );
  }

  const { me, partner, today, sharedStreak, recentCheckins } = partnershipData;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Shared Streak Flame */}
      <div className="rounded-3xl border border-amber-300 dark:border-amber-800 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Flame className="w-8 h-8 fill-current text-white animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              Shared Consistency Streak
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
              {sharedStreak} {sharedStreak === 1 ? 'Day' : 'Days'} Together
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Calculated dynamically from real daily recitation and revision records.
            </p>
          </div>
        </div>

        <Link
          to={`/partnership/${partnershipData.id}/messages`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Coordinate Study Session</span>
        </Link>
      </div>

      {/* Side-by-Side Partners Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Your Quran Mate Partnership</h2>
          <span className="text-xs text-[var(--text-muted)]">
            Paired since {new Date(partnershipData.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Your Journey Card */}
          <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] text-[10px] font-extrabold rounded-bl-xl border-l border-b border-[var(--primary-border)]">
              YOU
            </div>
            <div className="flex items-center gap-3.5 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xs"
                style={{ backgroundColor: me.avatar_color || '#047857' }}
              >
                {me.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-base text-[var(--text-primary)]">{me.name}</h3>
                <span className="text-xs text-[var(--text-muted)]">Active Learner</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-subtle)]">
                <BookOpen className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span className="font-medium text-[var(--text-muted)]">Stage:</span>
                <span className="font-bold text-[var(--text-primary)]">{me.memorization_stage}</span>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-subtle)]">
                <Target className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium text-[var(--text-muted)]">Goal:</span>
                <span className="font-bold text-[var(--text-primary)]">{me.goal}</span>
              </div>
            </div>

            {me.bio && (
              <p className="mt-4 text-xs text-[var(--text-secondary)] italic leading-relaxed">
                &ldquo;{me.bio}&rdquo;
              </p>
            )}
          </div>

          {/* Mate's Journey Card */}
          <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold rounded-bl-xl border-l border-b border-amber-300 dark:border-amber-800">
              QURAN MATE
            </div>
            <div className="flex items-center gap-3.5 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xs"
                style={{ backgroundColor: partner.avatar_color || '#0f766e' }}
              >
                {partner.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-base text-[var(--text-primary)]">{partner.name}</h3>
                <span className="text-xs text-[var(--text-muted)]">Accountability Sister</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-subtle)]">
                <BookOpen className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span className="font-medium text-[var(--text-muted)]">Stage:</span>
                <span className="font-bold text-[var(--text-primary)]">{partner.memorization_stage}</span>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-subtle)]">
                <Target className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium text-[var(--text-muted)]">Goal:</span>
                <span className="font-bold text-[var(--text-primary)]">{partner.goal}</span>
              </div>
            </div>

            {partner.availability && partner.availability.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
                <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1 mb-1.5">
                  <Calendar className="w-3 h-3" /> Study Schedule:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {partner.availability.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                    >
                      {s.day.slice(0, 3)} {s.start_time}-{s.end_time}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Core Accountability Loop: Today's Check-in Card */}
      <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Today&rsquo;s Quran Check-in</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Did you complete today&rsquo;s Quran session?
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Keep each other consistent. When both check in, your shared streak burns brighter!
            </p>
          </div>

          <button
            onClick={handleToggleCheckin}
            disabled={isUpdatingCheckin}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0 ${
              today.myCheckin.completed
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] ring-4 ring-emerald-500/20 animate-pulse'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{today.myCheckin.completed ? 'Marked as Complete ✓' : 'Mark as Complete ✓'}</span>
          </button>
        </div>

        {/* Both Partners' Status Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Your status */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              today.myCheckin.completed
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40'
                : 'border-[var(--border-color)] bg-[var(--bg-subtle)]/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-primary)]">You ({me.name})</span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                  today.myCheckin.completed
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {today.myCheckin.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Pending Today</span>
                  </>
                )}
              </span>
            </div>
            {today.myCheckin.notes && (
              <p className="text-xs text-[var(--text-secondary)] mt-2 italic">
                &ldquo;{today.myCheckin.notes}&rdquo;
              </p>
            )}
          </div>

          {/* Partner status */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              today.partnerCheckin.completed
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40'
                : 'border-[var(--border-color)] bg-[var(--bg-subtle)]/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {partner.name} (Partner)
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                  today.partnerCheckin.completed
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {today.partnerCheckin.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Pending Today</span>
                  </>
                )}
              </span>
            </div>
            {today.partnerCheckin.notes && (
              <p className="text-xs text-[var(--text-secondary)] mt-2 italic">
                &ldquo;{today.partnerCheckin.notes}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Optional Check-in Note field */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
            Today&rsquo;s Session Note / Ayahs Reviewed (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Revised Surah Al-Kahf Ayahs 1-30, practiced tajweed with mate"
              value={checkinNotes}
              onChange={(e) => setCheckinNotes(e.target.value)}
              className="flex-1 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <button
              type="button"
              onClick={handleToggleCheckin}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>

      {/* Peer Study Session Scheduling */}
      <SessionScheduler
        partnershipId={partnershipData.id}
        defaultPartner={partner}
        onSessionLogged={fetchPartnership}
      />

      {/* Footer Settings & Graceful Unpair */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
        <button
          onClick={() => setShowEndModal(true)}
          className="text-xs text-[var(--text-muted)] hover:text-red-600 transition-colors"
        >
          Conclude Partnership Gracefully
        </button>

        <Link
          to="/ayah-finder"
          className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Lookup Ayah for Revision</span>
        </Link>
      </div>

      {/* End Partnership Confirmation Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Conclude Partnership?
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              This will close your active accountability pairing with {partner.name}.
              You can pair with a new partner anytime.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
              >
                Cancel
              </button>
              <button
                onClick={handleEndPartnership}
                disabled={isEnding}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                {isEnding ? 'Ending...' : 'Yes, Conclude'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

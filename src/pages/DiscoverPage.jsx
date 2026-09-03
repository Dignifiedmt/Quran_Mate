// Discover Learners Page (Screen 4)
import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Sparkles, Send, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import LearnerCard from '../components/LearnerCard.jsx';

const STAGES = [
  'all',
  'Beginning',
  'Juz 30',
  'Juz 29–30',
  'Juz 1–5',
  'Juz 6–10',
  'Juz 11–15',
  'Juz 16–20',
  'Juz 21–25',
  'Juz 26–28',
  'Multiple Juz',
  'Revision-focused',
];

const DAYS = ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DiscoverPage() {
  const { user, activePartnershipId } = useAuth();
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('all');
  const [day, setDay] = useState('all');

  // Request Modal State
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [requestNote, setRequestNote] = useState('');
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchLearners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUsers({
        stage: stage !== 'all' ? stage : undefined,
        day: day !== 'all' ? day : undefined,
        search: search.trim() || undefined,
      });
      setLearners(data.learners || []);
    } catch (err) {
      setError(err.message || 'Failed to load Quran learners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, [stage, day]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLearners();
  };

  const handleOpenRequestModal = (learner) => {
    setSelectedLearner(learner);
    setRequestNote(
      `Assalamu alaikum ${learner.name}! I would love to partner with you for Quran study and revision.`
    );
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!selectedLearner) return;

    try {
      setIsSendingRequest(true);
      await api.sendPartnerRequest(selectedLearner.id, requestNote);
      setToastMessage(`Partner request sent to ${selectedLearner.name} successfully.`);
      setSelectedLearner(null);
      fetchLearners();
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to send request');
    } finally {
      setIsSendingRequest(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-emerald-700 text-white shadow-lg flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Peer Quran Matching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Find Your Quran Study Partner
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Browse sisters memorizing or revising at similar stages. Connect, pair up 1-to-1, and build consistent habits.
          </p>
        </div>

        {activePartnershipId && (
          <div className="p-3 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>You currently have an active Quran Mate! Browse learners for future revision or inspiration.</span>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-xs mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, surah focus, or bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] pl-9 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          {/* Memorization Stage Filter */}
          <div className="w-full lg:w-48">
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
            >
              <option value="all">All Stages</option>
              {STAGES.filter((s) => s !== 'all').map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Day Filter */}
          <div className="w-full lg:w-40">
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
            >
              <option value="all">Any Day</option>
              {DAYS.filter((d) => d !== 'all').map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shrink-0"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Learners Grid / States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-subtle)]" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-[var(--bg-subtle)] rounded w-2/3" />
                  <div className="h-3 bg-[var(--bg-subtle)] rounded w-1/3" />
                </div>
              </div>
              <div className="h-3 bg-[var(--bg-subtle)] rounded w-full" />
              <div className="h-3 bg-[var(--bg-subtle)] rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/30 text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={fetchLearners}
            className="mt-3 px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white"
          >
            Retry
          </button>
        </div>
      ) : learners.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)]">
          <Users className="w-10 h-10 mx-auto text-[var(--text-muted)] mb-3 opacity-60" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            No Quran Mates found with these filters
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            Try resetting your filters or clearing your search term to see more prospective partners.
          </p>
          <button
            onClick={() => {
              setStage('all');
              setDay('all');
              setSearch('');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learners.map((learner) => (
            <LearnerCard
              key={learner.id}
              learner={learner}
              onRequestClick={handleOpenRequestModal}
            />
          ))}
        </div>
      )}

      {/* Send Partner Request Modal */}
      {selectedLearner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedLearner(null)}
              className="absolute right-5 top-5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: selectedLearner.avatar_color || '#047857' }}
              >
                {selectedLearner.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-[var(--text-primary)]">
                  Partner Request to {selectedLearner.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {selectedLearner.memorization_stage} &bull; {selectedLearner.goal}
                </p>
              </div>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                  Include an introductory message (optional)
                </label>
                <textarea
                  rows={4}
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="Share your goals and preferred times..."
                  className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-subtle)] text-[11px] text-[var(--text-secondary)] leading-relaxed border border-[var(--border-subtle)]">
                <strong className="text-[var(--text-primary)]">How pairing works:</strong> Quran Mate is built for 1-to-1 accountability.
                Once {selectedLearner.name} accepts, you will unlock your shared consistency streak, daily check-ins, and study messaging.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedLearner(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingRequest}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingRequest ? 'Sending...' : 'Send Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Modal to create a new Qur'an Study Circle / Collaborative Room
// Accessible to everyone (both authenticated learners and guest sisters)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Users,
  Sparkles,
  BookOpen,
  Clock,
  Target,
  Calendar,
  Video,
  Check,
  User,
  Flame,
  Star
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORIES = [
  'Memorization',
  'Juz Amma',
  'Surah Al-Kahf',
  'Murajaah',
  'Tajweed',
  'Khatmah',
  'General'
];

const THEMES = [
  { id: 'emerald', name: 'Emerald Green', bg: 'bg-emerald-600', ring: 'ring-emerald-500' },
  { id: 'amber', name: 'Desert Gold', bg: 'bg-amber-600', ring: 'ring-amber-500' },
  { id: 'teal', name: 'Deep Teal', bg: 'bg-teal-600', ring: 'ring-teal-500' },
  { id: 'indigo', name: 'Night Sky', bg: 'bg-indigo-600', ring: 'ring-indigo-500' },
  { id: 'rose', name: 'Rose Petal', bg: 'bg-rose-600', ring: 'ring-rose-500' }
];

const PRESETS = [
  {
    title: 'Friday Al-Kahf Circle',
    category: 'Surah Al-Kahf',
    goal: 'Recite Surah Al-Kahf collectively every Friday',
    schedule: 'Weekly on Fridays at 07:00 AM UTC'
  },
  {
    title: 'Juz 30 (Amma) Revision',
    category: 'Juz Amma',
    goal: 'Daily review of Surah An-Naba to An-Nas',
    schedule: 'Daily after Fajr prayer (05:30 AM)'
  },
  {
    title: '30-Juz Ramadan Khatmah',
    category: 'Khatmah',
    goal: 'Complete full collective 30-Juz Quran Khatmah',
    schedule: 'Mondays & Thursdays at 06:00 PM UTC'
  },
  {
    title: 'Tajweed & Makharij Practice',
    category: 'Tajweed',
    goal: 'Perfect letter articulation & rules of Tajweed',
    schedule: 'Saturdays at 10:00 AM UTC'
  }
];

export default function CreateGroupModal({ isOpen, onClose, onCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [guestName, setGuestName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Memorization');
  const [targetGoal, setTargetGoal] = useState('Complete collective Quran Khatmah');
  const [meetingSchedule, setMeetingSchedule] = useState('Weekly on Fridays at 07:00 AM UTC');
  const [meetingPlatform, setMeetingPlatform] = useState('google_meet'); // 'google_meet' | 'in_app'
  const [meetingLink, setMeetingLink] = useState('');
  const [maxMembers, setMaxMembers] = useState(25);
  const [avatarTheme, setAvatarTheme] = useState('emerald');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  function applyPreset(preset) {
    setName(preset.title);
    setCategory(preset.category);
    setTargetGoal(preset.goal);
    setMeetingSchedule(preset.schedule);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for the study circle');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await api.createGroup({
        name: name.trim(),
        guest_name: guestName.trim() || undefined,
        description: description.trim(),
        category,
        target_goal: targetGoal.trim(),
        meeting_schedule: meetingSchedule.trim(),
        meeting_platform: meetingPlatform,
        meeting_link: meetingLink.trim(),
        max_members: Number(maxMembers),
        avatar_theme: avatarTheme
      });

      if (onCreated) {
        onCreated(res.id);
      }
      onClose();
      navigate(`/groups/${res.id}`);
    } catch (err) {
      console.error('Failed to create circle:', err);
      setError(err.message || 'Failed to create study circle');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[var(--primary)] flex items-center justify-center shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  Start a Qur&rsquo;an Study Circle
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Open to Everyone
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Create a collaborative room for group recitation, Khatmah, &amp; halaqahs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guest sister encouragement banner if not logged in */}
        {!user && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-emerald-900 dark:text-emerald-200">
              <span className="font-bold">No account required:</span> Anyone can create and host a study room instantly! You will enter as host immediately.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Quick Presets / Templates */}
        <div className="mb-5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <span>Quick Templates</span>
            <span className="font-normal lowercase">click to autofill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => applyPreset(p)}
                className="p-2 rounded-xl text-left border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all text-xs group"
              >
                <div className="font-bold text-[var(--text-primary)] group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate">
                  {p.title}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] truncate">{p.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest Name if not logged in */}
          {!user && (
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your Name (Sister / Host)</span>
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g., Sister Maryam or Sister Hafsah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          )}

          {/* Group Name */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Circle / Room Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Surah Al-Kahf Friday Circle, Fajr Muraja'ah"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)]"
              required
            />
          </div>

          {/* Category & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Focus Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Max Member Capacity
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          {/* Shared Target Goal */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Collaborative Target / Goal
            </label>
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              placeholder="e.g., Complete 30 Juz Khatmah, Revise Surah Al-Baqarah together"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* Meeting Schedule */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Regular Halaqah Meeting Schedule
            </label>
            <input
              type="text"
              value={meetingSchedule}
              onChange={(e) => setMeetingSchedule(e.target.value)}
              placeholder="e.g., Every Friday at 07:00 AM UTC, Daily after Fajr"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* Meeting Platform (Google Meet vs In-App Video Call) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[var(--text-primary)]">
              Live Video Recitation Call Platform
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMeetingPlatform('google_meet')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  meetingPlatform === 'google_meet'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-2xs font-bold'
                    : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                }`}
              >
                <Video className="w-4 h-4 text-emerald-600" />
                <div className="text-xs">
                  <div>Google Meet</div>
                  <div className="text-[10px] font-normal text-[var(--text-muted)]">Instant link</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMeetingPlatform('in_app')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  meetingPlatform === 'in_app'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-2xs font-bold'
                    : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <div className="text-xs">
                  <div>In-App Video</div>
                  <div className="text-[10px] font-normal text-[var(--text-muted)]">Built-in halaqah</div>
                </div>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Circle Description &amp; Etiquette
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what members will recite, study, or review together in this room..."
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* Theme selection */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Room Color Theme
            </label>
            <div className="flex items-center gap-2">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setAvatarTheme(th.id)}
                  className={`w-7 h-7 rounded-full ${th.bg} transition-transform ${
                    avatarTheme === th.id ? `ring-2 ring-offset-2 ${th.ring} scale-110` : 'opacity-70 hover:opacity-100'
                  }`}
                  title={th.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{submitting ? 'Creating Room...' : 'Create Study Room Now'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

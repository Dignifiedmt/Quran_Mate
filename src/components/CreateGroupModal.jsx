// Modal to create a new Qur'an Study Circle / Collaborative Room
import React, { useState } from 'react';
import { X, Users, Sparkles, BookOpen, Clock, Target, Calendar } from 'lucide-react';
import { api } from '../services/api.js';

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
  { id: 'emerald', name: 'Emerald Green', bg: 'bg-emerald-600', border: 'border-emerald-500' },
  { id: 'amber', name: 'Desert Gold', bg: 'bg-amber-600', border: 'border-amber-500' },
  { id: 'teal', name: 'Deep Teal', bg: 'bg-teal-600', border: 'border-teal-500' },
  { id: 'indigo', name: 'Night Sky', bg: 'bg-indigo-600', border: 'border-indigo-500' },
  { id: 'rose', name: 'Rose Petal', bg: 'bg-rose-600', border: 'border-rose-500' }
];

export default function CreateGroupModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Memorization');
  const [targetGoal, setTargetGoal] = useState('Complete collective Quran Khatmah');
  const [meetingSchedule, setMeetingSchedule] = useState('Weekly on Fridays at 07:00 AM UTC');
  const [maxMembers, setMaxMembers] = useState(25);
  const [avatarTheme, setAvatarTheme] = useState('emerald');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
        description: description.trim(),
        category,
        target_goal: targetGoal.trim(),
        meeting_schedule: meetingSchedule.trim(),
        max_members: Number(maxMembers),
        avatar_theme: avatarTheme
      });

      if (onCreated) {
        onCreated(res.id);
      }
      onClose();
    } catch (err) {
      console.error('Failed to create circle:', err);
      setError(err.message || 'Failed to create study circle');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[var(--primary)] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Start a Qur&rsquo;an Study Circle
              </h2>
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

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Circle Description &amp; Etiquette
            </label>
            <textarea
              rows="3"
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
                    avatarTheme === th.id ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'opacity-70 hover:opacity-100'
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{submitting ? 'Creating Circle...' : 'Create Study Circle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// My Profile & Settings Page (Screen 9)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Target, FileText, Check, LogOut, Sun, Moon, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import AvailabilityPicker from '../components/AvailabilityPicker.jsx';

const STAGES = [
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

const GOALS = [
  'Memorize new Ayahs daily',
  'Revise consistently',
  'Complete a Juz',
  'Maintain previous memorization',
  'Prepare for a Quran milestone',
];

export default function MyProfilePage() {
  const { user, availability, updateProfile, updateAvailabilitySlots, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [stage, setStage] = useState(user?.memorization_stage || 'Beginning');
  const [goal, setGoal] = useState(user?.goal || 'Memorize new Ayahs daily');
  const [bio, setBio] = useState(user?.bio || '');
  const [slots, setSlots] = useState(availability || []);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setStage(user.memorization_stage || 'Beginning');
      setGoal(user.goal || 'Memorize new Ayahs daily');
      setBio(user.bio || '');
    }
    if (availability) {
      setSlots(availability);
    }
  }, [user, availability]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateProfile({
        name,
        memorization_stage: stage,
        goal,
        bio,
      });
      await updateAvailabilitySlots(slots);
      setSuccessMsg('Profile and study windows updated successfully! ✨');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-md">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-xs"
              style={{ backgroundColor: user?.avatar_color || '#047857' }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">{user?.name}</h1>
              <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl border border-red-200 dark:border-red-900 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Memorization Stage</span>
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-500" />
              <span>Goal</span>
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
            >
              {GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Bio / Journey</span>
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your current recitation routine..."
              className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] leading-relaxed"
            />
          </div>

          {/* Availability Schedule */}
          <div className="pt-4 border-t border-[var(--border-color)]">
            <AvailabilityPicker slots={slots} onChange={setSlots} />
          </div>

          <div className="pt-6 border-t border-[var(--border-color)] flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Profile Setup Page (Screen 3)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, FileText, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import AvailabilityPicker from '../components/AvailabilityPicker.jsx';
import PortionMemorizedSelector from '../components/PortionMemorizedSelector.jsx';

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

export default function ProfileSetupPage() {
  const { user, availability, updateProfile, updateAvailabilitySlots } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [stage, setStage] = useState(user?.memorization_stage || 'Beginning');
  const [fromSurah, setFromSurah] = useState(user?.memorized_from_surah || 1);
  const [toSurah, setToSurah] = useState(user?.memorized_to_surah || 114);
  const [goal, setGoal] = useState(user?.goal || 'Memorize new Ayahs daily');
  const [bio, setBio] = useState(user?.bio || '');
  const [slots, setSlots] = useState(
    availability && availability.length > 0
      ? availability
      : [
          { day: 'Saturday', start_time: '19:00', end_time: '20:00' },
          { day: 'Sunday', start_time: '19:00', end_time: '20:00' },
        ]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.memorization_stage) setStage(user.memorization_stage);
      if (user.memorized_from_surah) setFromSurah(user.memorized_from_surah);
      if (user.memorized_to_surah) setToSurah(user.memorized_to_surah);
      if (user.goal) setGoal(user.goal);
      if (user.bio) setBio(user.bio);
    }
    if (availability && availability.length > 0) {
      setSlots(availability);
    }
  }, [user, availability]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await updateProfile({
        name,
        memorization_stage: stage,
        memorized_from_surah: fromSurah,
        memorized_to_surah: toSurah,
        goal,
        bio,
      });

      await updateAvailabilitySlots(slots);
      navigate('/discover');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-md">
        <div className="border-b border-[var(--border-color)] pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] mb-3">
            Step 1 of 1: Profile & Study Schedule
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Setup Your Quran Mate Profile
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5">
            Help other sisters understand your current stage and find mutual times to recite and revise together.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maryam"
              className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          {/* Memorization Stage */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Current Memorization Stage</span>
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

          {/* Portion Memorized From Surah to Surah */}
          <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
            <PortionMemorizedSelector
              fromSurah={fromSurah}
              toSurah={toSurah}
              onChangeFrom={(val) => setFromSurah(val)}
              onChangeTo={(val) => setToSurah(val)}
              onApplyPreset={(preset) => {
                setStage(preset.stage);
              }}
            />
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-500" />
              <span>Quran Accountability Goal</span>
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

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Short Bio / Journey Notes</span>
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell prospective Quran Mates about which surahs you are reciting, your pace, and what you hope to achieve together..."
              className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] leading-relaxed"
            />
          </div>

          {/* Availability Picker */}
          <div className="pt-4 border-t border-[var(--border-color)]">
            <AvailabilityPicker slots={slots} onChange={setSlots} />
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save & Browse Quran Mates'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

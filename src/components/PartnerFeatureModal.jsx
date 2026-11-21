// Modal explaining how Quran Mate features work both with a peer partner and for solo learners
// Allows learners without an active partner to either find a partner, practice in a halaqah, or use solo mode
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  HeartHandshake,
  Sparkles,
  BookOpen,
  CalendarCheck,
  Video,
  ArrowRight,
  X,
  CheckCircle2,
  Shield,
  Layers
} from 'lucide-react';

export default function PartnerFeatureModal({
  isOpen,
  onClose,
  featureName = 'Peer Partner Feature',
  featureDescription = 'This feature connects you directly with your accountability partner for mutual check-ins and recitation.'
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Subtle Decorative Backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/10 via-amber-500/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 mb-0.5">
              <Sparkles className="w-3 h-3" />
              Accountability Partner
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              {featureName}
            </h3>
          </div>
        </div>

        {/* Explanation text */}
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
          {featureDescription}
        </p>

        {/* Value Proposition & Solo Alternates */}
        <div className="space-y-2.5 mb-6">
          <div className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/30 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-950 dark:text-emerald-200">
                You can still enjoy all learning features solo:
              </strong>
              <p className="text-emerald-800 dark:text-emerald-300 text-[11px] mt-0.5">
                Log daily recitation &amp; hifz in the <strong>Tracker</strong>, test yourself in the <strong>Holy Qur&rsquo;an Suite</strong>, and join open <strong>Study Circles</strong> anytime!
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-xs flex items-start gap-2.5">
            <Users className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[var(--text-primary)]">
                Ready to find a partner at your exact level?
              </strong>
              <p className="text-[var(--text-secondary)] text-[11px] mt-0.5">
                Browse our directory of learners matching your memorization stage, time preference, and revision goals.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => {
              onClose();
              navigate('/discover');
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Users className="w-4 h-4" />
            <span>Discover Compatible Mates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              onClose();
              navigate('/groups');
            }}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold hover:bg-[var(--bg-subtle)] transition-colors flex items-center justify-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Join a Study Circle</span>
          </button>
        </div>
      </div>
    </div>
  );
}

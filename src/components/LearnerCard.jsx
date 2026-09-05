// Learner Card Component
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Clock, ArrowRight, CheckCircle2, Send } from 'lucide-react';

export default function LearnerCard({ learner, onRequestClick }) {
  return (
    <div className="group rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header: Avatar, Name & Stage */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xs shrink-0"
              style={{ backgroundColor: learner.avatar_color || '#047857' }}
            >
              {learner.name ? learner.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                {learner.name}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)]">
                  <BookOpen className="w-3 h-3" />
                  {learner.memorization_stage || 'Beginning'}
                </span>
                {learner.sameLevelMatch && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                    <span>🎯 Same Level Match</span>
                  </span>
                )}
              </div>
              {learner.memorized_from_surah && learner.memorized_to_surah && (
                <div className="text-[10px] font-medium text-[var(--text-muted)] mt-1">
                  Memorized: Surah {learner.memorized_from_surah} → {learner.memorized_to_surah}
                </div>
              )}
            </div>
          </div>

          {learner.isPartner && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mate
            </span>
          )}
        </div>

        {/* Goal */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-3 bg-[var(--bg-subtle)] px-2.5 py-1.5 rounded-lg">
          <Target className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="font-medium text-[var(--text-primary)]">Goal:</span>
          <span className="truncate">{learner.goal || 'Memorize consistently'}</span>
        </div>

        {/* Bio */}
        {learner.bio && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
            &ldquo;{learner.bio}&rdquo;
          </p>
        )}

        {/* Availability Snippet */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
            <Clock className="w-3 h-3 text-[var(--text-muted)]" />
            <span>Open Study Windows</span>
          </div>
          {learner.availability && learner.availability.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {learner.availability.slice(0, 2).map((slot, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                >
                  {slot.day.slice(0, 3)} {slot.start_time}-{slot.end_time}
                </span>
              ))}
              {learner.availability.length > 2 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                  +{learner.availability.length - 2} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-[var(--text-muted)] italic">Availability not specified</p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
        <Link
          to={`/learners/${learner.id}`}
          className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {learner.isPartner ? (
          <Link
            to="/partnership"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
          >
            Open Partnership
          </Link>
        ) : learner.hasSentPendingRequest ? (
          <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]">
            Request Pending
          </span>
        ) : learner.hasReceivedPendingRequest ? (
          <Link
            to="/requests"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 shadow-xs"
          >
            Review Request
          </Link>
        ) : (
          <button
            onClick={() => onRequestClick(learner)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>Request Partner</span>
          </button>
        )}
      </div>
    </div>
  );
}

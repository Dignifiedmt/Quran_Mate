// Partner Request Card Component
import React from 'react';
import { Check, X, Clock, Target, BookOpen, Calendar } from 'lucide-react';

export default function PartnerRequestCard({ request, type = 'received', onAccept, onDecline, isSubmitting }) {
  if (type === 'received') {
    return (
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs hover:shadow-md transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xs shrink-0"
              style={{ backgroundColor: request.sender_avatar || '#047857' }}
            >
              {request.sender_name ? request.sender_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-[var(--text-primary)]">
                  {request.sender_name}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)]">
                  <BookOpen className="w-3 h-3" />
                  {request.sender_stage || 'Beginning'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mt-1">
                <Target className="w-3.5 h-3.5 text-amber-500" />
                <span>{request.sender_goal || 'Memorize consistently'}</span>
              </div>

              {request.note && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-[var(--bg-subtle)] text-xs text-[var(--text-primary)] leading-relaxed italic border border-[var(--border-subtle)]">
                  &ldquo;{request.note}&rdquo;
                </div>
              )}

              {/* Sender Availability */}
              {request.sender_availability && request.sender_availability.length > 0 && (
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Schedule:
                  </span>
                  {request.sender_availability.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                    >
                      {s.day.slice(0, 3)} {s.start_time}-{s.end_time}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {request.status === 'pending' ? (
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
              <button
                onClick={() => onDecline(request.id)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Decline</span>
              </button>
              <button
                onClick={() => onAccept(request.id)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Accept & Pair</span>
              </button>
            </div>
          ) : (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                request.status === 'accepted'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-red-100 dark:bg-red-950 text-red-600'
              }`}
            >
              {request.status}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Sent Request Card
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0"
          style={{ backgroundColor: request.receiver_avatar || '#047857' }}
        >
          {request.receiver_name ? request.receiver_name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3 className="font-bold text-sm text-[var(--text-primary)]">{request.receiver_name}</h3>
          <p className="text-xs text-[var(--text-muted)]">
            {request.receiver_stage} &bull; {request.receiver_goal}
          </p>
          {request.note && (
            <p className="text-xs text-[var(--text-secondary)] italic mt-1">&ldquo;{request.note}&rdquo;</p>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
            request.status === 'accepted'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : request.status === 'pending'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
          }`}
        >
          {request.status === 'pending' && <Clock className="w-3 h-3" />}
          {request.status === 'accepted' && <Check className="w-3 h-3" />}
          {request.status === 'declined' && <X className="w-3 h-3" />}
          <span>{request.status}</span>
        </span>
        <div className="text-[10px] text-[var(--text-muted)] mt-1">
          {new Date(request.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

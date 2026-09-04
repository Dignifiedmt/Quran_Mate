// Peer Quran Study Session Scheduling Component
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Sparkles,
  BookOpen,
  Users,
  RotateCcw,
  CalendarCheck
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function SessionScheduler({ partnershipId, defaultPartner = null, onSessionLogged }) {
  const { user } = useAuth();

  const [sessions, setSessions] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // New session modal / form open
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form inputs
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [sessionDate, setSessionDate] = useState(tomorrowStr);
  const [startTime, setStartTime] = useState('18:30');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [sessionType, setSessionType] = useState('hifz'); // 'hifz' | 'murajaah' | 'tajweed' | 'milestone'
  const [agenda, setAgenda] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  const loadSessions = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await api.getSessions();
      setSessions({
        upcoming: data.upcoming || [],
        past: data.past || []
      });
    } catch (err) {
      console.error('Failed to load study sessions:', err);
      setErrorMsg('Could not load scheduled sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [partnershipId]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please provide a session title (e.g. Surah Al-Mulk Revision).');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const partnerId = defaultPartner ? defaultPartner.id : null;
      const autoMeetingLink = meetingLink.trim() || `https://meet.jit.si/QuranMate-${Date.now().toString(36)}`;

      await api.createSession({
        partnership_id: partnershipId || null,
        partner_id: partnerId,
        title: title.trim(),
        session_date: sessionDate,
        start_time: startTime,
        duration_minutes: Number(durationMinutes),
        session_type: sessionType,
        agenda: agenda.trim(),
        meeting_link: autoMeetingLink
      });

      setSuccessMsg('Peer study session scheduled successfully! 🌙');
      setTimeout(() => setSuccessMsg(''), 4000);

      // Reset form
      setTitle('');
      setAgenda('');
      setMeetingLink('');
      setIsFormOpen(false);

      await loadSessions();
      if (onSessionLogged) onSessionLogged();
    } catch (err) {
      console.error('Create session error:', err);
      setErrorMsg(err.message || 'Failed to schedule study session.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (sessionId, newStatus) => {
    try {
      await api.updateSession(sessionId, { status: newStatus });
      await loadSessions();
      if (onSessionLogged) onSessionLogged();
    } catch (err) {
      console.error('Update session error:', err);
      setErrorMsg('Failed to update session status.');
    }
  };

  const generateGoogleCalendarUrl = (session) => {
    const title = encodeURIComponent(`Quran Mate Session: ${session.title}`);
    const details = encodeURIComponent(`Peer Quran recitation session\nAgenda: ${session.agenda || 'Recitation & review'}\nJoin link: ${session.meeting_link}`);
    const dateFormatted = session.session_date.replace(/-/g, '');
    const timeFormatted = session.start_time.replace(/:/g, '') + '00';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateFormatted}T${timeFormatted}/${dateFormatted}T${timeFormatted}`;
  };

  const sessionTypeLabels = {
    hifz: { label: 'Hifz Recitation', color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300' },
    murajaah: { label: 'Muraja\'ah Review', color: 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-300' },
    tajweed: { label: 'Tajweed Practice', color: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300' },
    milestone: { label: 'Milestone Testing', color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300' }
  };

  return (
    <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Session Scheduling &amp; Appointments
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Lock in dedicated recitation times with your accountability mate
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isFormOpen ? 'Close Form' : 'Schedule Session'}</span>
        </button>
      </div>

      {/* Success / Error Messages */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Schedule Session Form Dropdown */}
      {isFormOpen && (
        <form
          onSubmit={handleCreateSession}
          className="p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-900 pb-2">
            <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Book New Peer Recitation Session</span>
            </h4>
            <span className="text-[11px] text-[var(--text-muted)]">
              Partner: {defaultPartner?.name || 'Accountability Mate'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Session Focus / Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Surah Al-Mulk 1–30 Revision & Mutashabihat"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Session Type
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="hifz">Hifz (Memorizing new ayahs)</option>
                <option value="murajaah">Muraja&rsquo;ah (Revision & review)</option>
                <option value="tajweed">Tajweed &amp; Makharij precision</option>
                <option value="milestone">Milestone examination</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Date *
              </label>
              <input
                type="date"
                value={sessionDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSessionDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Duration
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="15">15 mins</option>
                  <option value="30">30 mins</option>
                  <option value="45">45 mins</option>
                  <option value="60">60 mins</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Agenda &amp; Verses to be Tested
            </label>
            <textarea
              rows="2"
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="e.g. Listen to ayahs 1–20 without looking, verify ikhfa rules, switch roles and test 21–30."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Scheduling...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      )}

      {/* Upcoming Sessions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upcoming Sessions ({sessions.upcoming.length})</span>
          </h4>
        </div>

        {sessions.upcoming.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-[var(--border-color)] rounded-2xl p-4">
            <Calendar className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold text-[var(--text-primary)]">No upcoming sessions scheduled</p>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Click &ldquo;Schedule Session&rdquo; above to set a date with your mate.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.upcoming.map((sess) => {
              const typeMeta = sessionTypeLabels[sess.session_type] || sessionTypeLabels.hifz;
              return (
                <div
                  key={sess.id}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-emerald-300 dark:hover:border-emerald-800 p-4 transition-all shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase leading-none">
                          {new Date(sess.session_date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200 leading-none mt-0.5">
                          {new Date(sess.session_date).getDate()}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-sm font-bold text-[var(--text-primary)]">
                            {sess.title}
                          </h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeMeta.color}`}>
                            {typeMeta.label}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5 flex items-center gap-2">
                          <span>🕒 {sess.start_time} ({sess.duration_minutes} mins)</span>
                          <span>&bull;</span>
                          <span>With: {sess.otherParticipant?.name || 'Partner'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={sess.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Room</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>

                      <a
                        href={generateGoogleCalendarUrl(sess)}
                        target="_blank"
                        rel="noreferrer"
                        title="Add to Google Calendar"
                        className="p-1.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleUpdateStatus(sess.id, 'completed')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Done</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(sess.id, 'cancelled')}
                        className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Cancel session"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {sess.agenda && (
                    <div className="text-xs text-[var(--text-secondary)] bg-[var(--bg-subtle)] p-2.5 rounded-xl border border-[var(--border-color)]">
                      <strong className="text-[var(--text-primary)]">Agenda:</strong> {sess.agenda}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Completed Sessions (Collapsible) */}
      {sessions.past.length > 0 && (
        <div className="border-t border-[var(--border-color)] pt-4 space-y-2">
          <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed &amp; Past Sessions ({sessions.past.length})</span>
          </h4>

          <div className="space-y-2">
            {sessions.past.slice(0, 3).map((sess) => (
              <div
                key={sess.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/50 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">{sess.title}</span>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {sess.session_date} &bull; {sess.start_time} ({sess.duration_minutes}m)
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {sess.status === 'completed' ? 'Completed' : 'Past'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Learner Profile Page (Screen 5)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Target, Calendar, Clock, ArrowLeft, Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LearnerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activePartnershipId } = useAuth();

  const [learner, setLearner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestNote, setRequestNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchLearner = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUserById(id);
      setLearner(data.learner);
    } catch (err) {
      setError(err.message || 'Failed to load learner details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearner();
  }, [id]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      setIsSending(true);
      await api.sendPartnerRequest(learner.id, requestNote);
      setSuccessMessage('Partner request sent! You can track status under Requests.');
      fetchLearner();
    } catch (err) {
      alert(err.message || 'Failed to send request');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 animate-pulse space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)]" />
          <div className="h-6 bg-[var(--bg-subtle)] rounded w-1/3" />
          <div className="h-4 bg-[var(--bg-subtle)] rounded w-full" />
        </div>
      </div>
    );
  }

  if (error || !learner) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{error || 'Learner not found'}</h2>
        <Link to="/discover" className="mt-4 inline-block text-xs font-semibold text-[var(--primary)] underline">
          Back to Discover
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <Link
        to="/discover"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Discover Learners</span>
      </Link>

      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-xs"
              style={{ backgroundColor: learner.avatar_color || '#047857' }}
            >
              {learner.name ? learner.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">{learner.name}</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)]">
                  <BookOpen className="w-3.5 h-3.5" />
                  {learner.memorization_stage}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                  <Target className="w-3.5 h-3.5 text-amber-500" />
                  {learner.goal}
                </span>
              </div>
            </div>
          </div>

          {learner.isPartner && (
            <div className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>Your Quran Mate</span>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Quran Journey & Background
            </h2>
            <p className="text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--bg-subtle)]/50 p-4 rounded-2xl border border-[var(--border-subtle)]">
              {learner.bio || 'No personal bio added yet.'}
            </p>
          </div>

          {/* Availability schedule */}
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Open Study Windows
            </h2>
            {learner.availability && learner.availability.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {learner.availability.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
                      <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>{slot.day}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[var(--text-secondary)] font-medium">
                      <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                      <span>
                        {slot.start_time} - {slot.end_time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)] italic">No preferred times specified.</p>
            )}
          </div>

          {/* Action section */}
          <div className="pt-6 border-t border-[var(--border-color)]">
            {learner.isPartner ? (
              <div className="flex items-center justify-between">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  You and {learner.name} are active Quran Mates!
                </p>
                <Link
                  to="/partnership"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs"
                >
                  Go to Active Partnership
                </Link>
              </div>
            ) : learner.requestStatus === 'sent' ? (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
                <span>Your partner request to {learner.name} is pending review.</span>
                <Link to="/requests" className="font-bold underline ml-2">
                  View Sent Requests
                </Link>
              </div>
            ) : learner.requestStatus === 'received' ? (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
                <span>{learner.name} has sent you a partner request!</span>
                <Link to="/requests" className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold ml-2">
                  Accept Request
                </Link>
              </div>
            ) : learner.isCurrentUser ? (
              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] text-xs text-[var(--text-muted)] text-center">
                This is your own profile view.{' '}
                <Link to="/profile" className="font-bold text-[var(--primary)] underline">
                  Edit Profile
                </Link>
              </div>
            ) : activePartnershipId ? (
              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)]">
                You already have an active Quran Mate. To partner with {learner.name}, conclude your current partnership first.
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-3">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Introduce yourself to {learner.name}
                </label>
                <textarea
                  rows={3}
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder={`Assalamu alaikum ${learner.name}! I would love to pair up for Quran memorization...`}
                  className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Sending Request...' : 'Send Partner Request'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

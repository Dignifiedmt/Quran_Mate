// Collaborative Qur'an Study Circle / Halaqah Room
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Video,
  VideoOff,
  Sparkles,
  BookOpen,
  Send,
  CheckCircle2,
  Clock,
  Calendar,
  Share2,
  LogOut,
  ChevronLeft,
  Crown,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  Volume2,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { JUZ_LIST } from '../data/juzData.js';
import BismillahHeader from '../components/BismillahHeader.jsx';
import BismillahLoader from '../components/BismillahLoader.jsx';

export default function GroupRoomPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('khatmah'); // 'khatmah' | 'discussion' | 'recitation' | 'members'
  
  // Discussion state
  const [messageText, setMessageText] = useState('');
  const [ayahRef, setAyahRef] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Live Jitsi Recitation Call state
  const [isLiveCallOpen, setIsLiveCallOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [khatmahActionLoading, setKhatmahActionLoading] = useState(null);

  useEffect(() => {
    loadGroupDetails();

    // Poll updates every 6 seconds for live collaborative room sync
    const interval = setInterval(() => {
      loadGroupDetails(false);
    }, 6000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (activeTab === 'discussion') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [group?.messages, activeTab]);

  async function loadGroupDetails(showSpinner = true) {
    try {
      if (showSpinner) setLoading(true);
      const data = await api.getGroupById(id);
      setGroup(data);
    } catch (err) {
      console.error('Failed to load group room:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }

  async function handleJoinCircle() {
    try {
      await api.joinGroup(id);
      await loadGroupDetails(false);
    } catch (err) {
      console.error('Failed to join:', err);
    }
  }

  async function handleLeaveCircle() {
    if (!confirm('Are you sure you want to leave this study circle? Any claimed, uncompleted Juz will be released.')) {
      return;
    }
    try {
      await api.leaveGroup(id);
      navigate('/groups');
    } catch (err) {
      console.error('Failed to leave:', err);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      setSendingMessage(true);
      if (!group?.is_member) {
        await api.joinGroup(id);
      }
      await api.postGroupMessage(id, {
        text: messageText.trim(),
        ayah_ref: ayahRef.trim()
      });
      setMessageText('');
      setAyahRef('');
      await loadGroupDetails(false);
    } catch (err) {
      console.error('Failed to post message:', err);
    } finally {
      setSendingMessage(false);
    }
  }

  async function handleKhatmahAction(juzNumber, action) {
    try {
      if (!group?.is_member) {
        await api.joinGroup(id);
      }
      setKhatmahActionLoading(juzNumber);
      await api.updateGroupKhatmah(id, {
        juz_number: juzNumber,
        action
      });
      await loadGroupDetails(false);
    } catch (err) {
      console.error('Failed to update khatmah:', err);
      alert(err.message || 'Failed to update Khatmah');
    } finally {
      setKhatmahActionLoading(null);
    }
  }

  function handleCopyInviteLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  if (loading && !group) {
    return (
      <BismillahLoader
        message="Entering Collaborative Halaqah Room..."
        submessage="In the name of Allah, the Entirely Merciful, the Especially Merciful"
      />
    );
  }

  if (!group) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 px-4">
        <h2 className="text-xl font-bold">Study Circle Room Not Found</h2>
        <p className="text-xs text-[var(--text-muted)]">The room may have been removed or renamed.</p>
        <Link
          to="/groups"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Circles Directory</span>
        </Link>
      </div>
    );
  }

  const isMember = group.is_member;
  const isAdmin = group.members?.some((m) => m.user_id === user?.id && m.role === 'admin');
  const completedCount = group.completed_juz_count || 0;
  const completedPct = group.completed_percentage || 0;
  const isKhatmahFullyCompleted = completedCount === 30;

  // Video Meeting Providers: Google Meet & Built-in Jitsi
  const [meetingProvider, setMeetingProvider] = useState('google_meet'); // 'google_meet' | 'in_app'
  const googleMeetUrl = group.google_meet_link || (group.meeting_link?.includes('meet.google.com') ? group.meeting_link : 'https://meet.google.com/new');
  const inAppMeetingUrl = (group.meeting_link && !group.meeting_link?.includes('meet.google.com')) ? group.meeting_link : `https://meet.jit.si/QuranMate-Halaqah-${group.id}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/groups"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Study Circles</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyInviteLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="Copy room link to share with sisters"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Room'}</span>
          </button>

          {isMember ? (
            <button
              onClick={handleLeaveCircle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave</span>
            </button>
          ) : (
            <button
              onClick={handleJoinCircle}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-dark)] transition-colors shadow-2xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Join Circle</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Islamic Bismillah with Progressive Writing */}
      <BismillahHeader showTranslation={false} className="py-0 mb-1" />

      {/* Main Room Header Card */}
      <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                <BookOpen className="w-3 h-3" />
                <span>{group.category}</span>
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                &bull; Hosted by <strong className="text-[var(--text-primary)]">{group.creator_name || 'Circle Admin'}</strong>
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                &bull; {group.members_count || group.members?.length || 1} Sisters Joined
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {group.name}
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {group.description || 'Collaborative Quran halaqah dedicated to memorization, revision, and shared Khatmah.'}
            </p>

            {/* Target Goal & Regular Schedule */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span><strong>Target:</strong> {group.target_goal}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{group.meeting_schedule}</span>
              </div>
            </div>
          </div>

          {/* Quick Launch Live Recitation Call Options */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 shrink-0">
            <a
              href={googleMeetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 text-center"
            >
              <Video className="w-4 h-4 text-emerald-200" />
              <span>Join via Google Meet</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              onClick={() => setIsLiveCallOpen(!isLiveCallOpen)}
              className="px-4 py-2 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] text-center text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isLiveCallOpen ? 'Hide In-App Room' : 'Open In-App Video Room'}</span>
            </button>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Embedded Live Recitation & Video Study Room Frame */}
      {isLiveCallOpen && (
        <div className="rounded-3xl border border-emerald-500/40 bg-[var(--bg-card)] p-4 sm:p-6 shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  Live Virtual Halaqah Room
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Recite to sisters live with mutual audio, screen share for Mushaf, and tajweed guidance.
                </p>
              </div>
            </div>

            {/* Provider Switcher */}
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-0.5 text-xs">
                <button
                  onClick={() => setMeetingProvider('google_meet')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    meetingProvider === 'google_meet'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Google Meet
                </button>
                <button
                  onClick={() => setMeetingProvider('in_app')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    meetingProvider === 'in_app'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  In-App Room
                </button>
              </div>

              <button
                onClick={() => setIsLiveCallOpen(false)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

          {meetingProvider === 'google_meet' ? (
            <div className="p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Video className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-base font-bold text-[var(--text-primary)]">
                  Google Meet Room for {group.name}
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Connect with crystal-clear audio, live captions, and seamless screen sharing for recitation directly via Google Meet.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={googleMeetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Launch Google Meet</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(googleMeetUrl);
                    alert('Google Meet link copied to clipboard!');
                  }}
                  className="px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-xs font-semibold transition-colors"
                >
                  Copy Meet Link
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black">
              {inAppMeetingUrl ? (
                <iframe
                  src={`${inAppMeetingUrl}#config.prejoinPageEnabled=false&config.disableDeepLinking=true`}
                  title="Quran Mate Live Recitation Room"
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="w-full h-full border-0"
                />
              ) : null}
            </div>
          )}

          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              <strong>Recitation Etiquette:</strong> Please keep microphone muted when others are reciting. Listen attentively with khushu&rsquo; and offer constructive, gentle tajweed encouragement.
            </span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('khatmah')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'khatmah'
              ? 'bg-[var(--primary)] text-white shadow-2xs'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Collective 30-Juz Khatmah</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white">
            {completedCount}/30
          </span>
        </button>

        <button
          onClick={() => setActiveTab('discussion')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'discussion'
              ? 'bg-[var(--primary)] text-white shadow-2xs'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Discussion &amp; Reflections</span>
          {group.messages?.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
              {group.messages.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'members'
              ? 'bg-[var(--primary)] text-white shadow-2xs'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Members Roster</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
            {group.members?.length || 1}
          </span>
        </button>
      </div>

      {/* Tab 1: Collective 30-Juz Khatmah Tracker */}
      {activeTab === 'khatmah' && (
        <div className="space-y-6">
          {/* Khatmah Progress Banner */}
          <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    Collective Qur&rsquo;an Khatmah Tracker &bull; ختمة القرآن الجماعية
                  </h3>
                  {isKhatmahFullyCompleted && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-extrabold flex items-center gap-1 animate-bounce">
                      <Sparkles className="w-3 h-3" />
                      <span>Khatmah Completed!</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Claim an available Juz, recite it with tartil, and mark it completed to advance the circle&rsquo;s Khatmah.
                </p>
              </div>

              {isAdmin && isKhatmahFullyCompleted && (
                <button
                  onClick={() => handleKhatmahAction(1, 'reset_khatmah')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Khatmah Round</span>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[var(--text-secondary)]">
                  {completedCount} of 30 Juz Completed
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                  {completedPct}%
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-[var(--bg-subtle)] p-0.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-full transition-all duration-500 shadow-inner"
                  style={{ width: `${completedPct}%` }}
                />
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-[var(--text-muted)] border-t border-[var(--border-color)]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-600" />
                <span>Completed (تم)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-500" />
                <span>Claimed / In Progress (قيد التلاوة)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-color)]" />
                <span>Available to Claim</span>
              </div>
            </div>
          </div>

          {/* 30-Juz Interactive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {Array.from({ length: 30 }, (_, idx) => {
              const juzNum = idx + 1;
              const slot = group.khatmah?.find((k) => k.juz_number === juzNum);
              const juzMeta = JUZ_LIST.find((j) => j.number === juzNum);
              const isClaimedByMe = slot?.user_id === user?.id;
              const isCompleted = slot?.status === 'completed';
              const isClaimed = slot?.status === 'claimed';
              const isLoading = khatmahActionLoading === juzNum;

              return (
                <div
                  key={juzNum}
                  className={`relative rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
                    isCompleted
                      ? 'border-emerald-500/60 bg-emerald-50/60 dark:bg-emerald-950/40'
                      : isClaimed
                      ? 'border-amber-500/60 bg-amber-50/60 dark:bg-amber-950/30'
                      : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-emerald-400'
                  }`}
                >
                  <div>
                    {/* Top Row: Juz Number & Status Indicator */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-sm text-[var(--text-primary)]">
                        Juz {juzNum}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : isClaimed ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)] font-medium">
                          Available
                        </span>
                      )}
                    </div>

                    {/* Surah Scope */}
                    <div className="text-[11px] font-semibold text-[var(--text-secondary)] line-clamp-1">
                      {juzMeta?.surahName || `Juz ${juzNum}`}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">
                      {juzMeta?.range || ''}
                    </div>

                    {/* Member Assignment Info */}
                    <div className="mt-2.5 min-h-[32px] text-[11px]">
                      {isCompleted ? (
                        <div className="text-emerald-800 dark:text-emerald-300 font-medium">
                          <span className="block text-[10px] text-[var(--text-muted)]">Completed by:</span>
                          <span className="font-bold line-clamp-1">{slot.user_name || 'Sister'}</span>
                        </div>
                      ) : isClaimed ? (
                        <div className="text-amber-800 dark:text-amber-300 font-medium">
                          <span className="block text-[10px] text-[var(--text-muted)]">Reading now:</span>
                          <span className="font-bold line-clamp-1">
                            {isClaimedByMe ? 'You' : slot.user_name || 'Sister'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-[var(--text-muted)] italic">
                          Click below to recite this Juz
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 mt-2 border-t border-[var(--border-color)]/70">
                    {!isMember ? (
                      <button
                        onClick={handleJoinCircle}
                        className="w-full py-1 rounded-lg text-[10px] font-semibold text-[var(--primary)] bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 transition-colors"
                      >
                        Join to Claim
                      </button>
                    ) : isCompleted ? (
                      <div className="text-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400 py-1">
                        Alhamdulillah
                      </div>
                    ) : isClaimed ? (
                      isClaimedByMe ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleKhatmahAction(juzNum, 'complete')}
                            disabled={isLoading}
                            className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                          >
                            Mark Done
                          </button>
                          <button
                            onClick={() => handleKhatmahAction(juzNum, 'unclaim')}
                            disabled={isLoading}
                            className="px-1.5 py-1 rounded-lg text-[10px] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
                            title="Release this Juz"
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-[10px] text-amber-700 dark:text-amber-400 font-medium py-1">
                          In Progress
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => handleKhatmahAction(juzNum, 'claim')}
                        disabled={isLoading}
                        className="w-full py-1 rounded-lg text-[10px] font-bold bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white transition-colors shadow-2xs"
                      >
                        {isLoading ? '...' : 'Claim Juz'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Discussion & Reflections Feed */}
      {activeTab === 'discussion' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Stream */}
          <div className="lg:col-span-2 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-xs flex flex-col h-[600px]">
            <div className="border-b border-[var(--border-color)] pb-3 mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  Circle Discussion &amp; Tadabbur Reflections
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Share ayaat insights, mutual encouragement, and recitation updates with the sisters.
                </p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Connected" />
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {group.messages?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-[var(--text-muted)]">
                  <MessageSquare className="w-8 h-8 opacity-40" />
                  <p className="text-xs font-semibold">No reflections posted yet.</p>
                  <p className="text-[11px]">Begin the conversation by saying As-salamu alaykum!</p>
                </div>
              ) : (
                group.messages?.map((msg) => {
                  const isMe = msg.user_id === user?.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs"
                        style={{ backgroundColor: msg.user_avatar || '#047857' }}
                      >
                        {msg.user_name ? msg.user_name.charAt(0).toUpperCase() : 'S'}
                      </div>

                      <div className={`max-w-[80%] space-y-1 ${isMe ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="font-bold text-[var(--text-primary)]">
                            {isMe ? 'You' : msg.user_name}
                          </span>
                          {msg.user_stage && (
                            <span className="text-[10px] text-[var(--text-muted)]">
                              ({msg.user_stage})
                            </span>
                          )}
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[var(--primary)] text-white rounded-tr-xs'
                              : 'bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-tl-xs'
                          }`}
                        >
                          {/* Optional Ayah Reference Citation Tag */}
                          {msg.ayah_ref && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/10 text-[10px] font-mono font-bold mb-1.5">
                              <BookOpen className="w-3 h-3" />
                              <span>{msg.ayah_ref}</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="pt-3 mt-3 border-t border-[var(--border-color)] space-y-2">
              {!isMember ? (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 text-center font-medium">
                  Please join this circle above to contribute reflections and chat.
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ayahRef}
                      onChange={(e) => setAyahRef(e.target.value)}
                      placeholder="Optional Ayah ref (e.g., Al-Kahf 18:10)"
                      className="w-48 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--primary)]"
                    />
                    <span className="text-[10px] text-[var(--text-muted)]">Attach Ayah citation</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your reflection, tadabbur, or message to the circle..."
                      className="flex-1 px-3.5 py-2.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs sm:text-sm focus:outline-none focus:border-[var(--primary)]"
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !messageText.trim()}
                      className="px-4 py-2.5 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-bold transition-colors shadow-2xs disabled:opacity-40 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Sidebar: Recitation Etiquette & Ayah of the Week */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[var(--primary)] font-bold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>Circle Inspiration</span>
              </div>
              <div
                className="font-arabic text-xl text-emerald-950 dark:text-emerald-100 text-right leading-loose"
                dir="rtl"
              >
                إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed">
                &ldquo;Indeed, those who recite the Book of Allah and establish prayer and spend out of what We have provided them, secretly and publicly, can expect a commerce that will never perish.&rdquo;
              </p>
              <div className="text-[10px] font-mono font-bold text-[var(--text-muted)] text-right">
                — Surah Fatir (35:29)
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Halaqah Adab &amp; Etiquette</span>
              </div>
              <ul className="text-xs text-[var(--text-secondary)] space-y-2 list-disc list-inside">
                <li>Begin your recitation with Isti&rsquo;adhah &amp; Bismillah.</li>
                <li>Recite slowly with tartil, observing tajweed rules.</li>
                <li>When a sister recites, listen with attentiveness and silence.</li>
                <li>Offer corrections with gentleness and warmth.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Members Roster */}
      {activeTab === 'members' && (
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Circle Members ({group.members?.length || 1})
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Sisters united in memorizing, revising, and living the Noble Qur&rsquo;an.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {group.members?.map((m) => (
              <div
                key={m.user_id}
                className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/50 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-2xs"
                    style={{ backgroundColor: m.avatar_color || '#047857' }}
                  >
                    {m.name ? m.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {m.name}
                      </span>
                      {m.role === 'admin' && (
                        <Crown className="w-3 h-3 text-amber-500" title="Circle Admin" />
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {m.memorization_stage || 'Beginning'}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/learners/${m.user_id}`}
                  className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[10px] font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                >
                  Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

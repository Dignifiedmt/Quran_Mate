// Sign In Page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, BookOpen, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import BrandLogo from '../components/BrandLogo.jsx';
import PortionMemorizedSelector from '../components/PortionMemorizedSelector.jsx';
import { api } from '../services/api.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPortionAdjust, setShowPortionAdjust] = useState(false);
  const [fromSurah, setFromSurah] = useState(78);
  const [toSurah, setToSurah] = useState(114);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      // If user customized portion during sign in, save it to their profile
      if (showPortionAdjust && loggedUser) {
        try {
          await api.updateProfile({
            name: loggedUser.name,
            memorized_from_surah: fromSurah,
            memorized_to_surah: toSurah,
            memorization_stage: fromSurah >= 78 ? 'Juz 30' : (fromSurah >= 67 ? 'Juz 29–30' : 'Juz 1–5')
          });
        } catch {
          // Non-blocking
        }
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (fillEmail, fillPassword, defaultFrom = 78, defaultTo = 114) => {
    setEmail(fillEmail);
    setPassword(fillPassword);
    setFromSurah(defaultFrom);
    setToSurah(defaultTo);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 shadow-md">
          <div className="text-center mb-6">
            <BrandLogo size="md" className="mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Welcome Back</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Sign in to coordinate with your Quran Mate
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="sister@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] pl-9 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] pl-9 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            {/* Portion You Memorize Selector in Sign In */}
            <div className="pt-2 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setShowPortionAdjust(!showPortionAdjust)}
                className="w-full flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--primary)] py-1.5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>Portion You Memorize (From Surah to Surah)</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${
                    showPortionAdjust ? 'rotate-180 text-[var(--primary)]' : ''
                  }`}
                />
              </button>

              {showPortionAdjust && (
                <div className="mt-2.5 p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] animate-in fade-in duration-200">
                  <PortionMemorizedSelector
                    fromSurah={fromSurah}
                    toSurah={toSurah}
                    onChangeFrom={(val) => setFromSurah(val)}
                    onChangeTo={(val) => setToSurah(val)}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Sample Profiles Quick Fill */}
          <div className="mt-6 pt-5 border-t border-[var(--border-color)]">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2.5 text-center">
              Sample Learner Accounts (Instant Sign-in)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('maryam@quranmate.demo', 'password123', 1, 4)}
                className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary-border)] text-left transition-colors"
              >
                <div className="font-bold text-[var(--text-primary)]">Maryam</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold truncate">
                  Surah 1 → 4 (Juz 1–5)
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('aisha@quranmate.demo', 'password123', 67, 114)}
                className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary-border)] text-left transition-colors"
              >
                <div className="font-bold text-[var(--text-primary)]">Aisha</div>
                <div className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold truncate">
                  Surah 67 → 114 (Juz 29–30)
                </div>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-[var(--text-secondary)]">
            Don&rsquo;t have an account?{' '}
            <Link to="/register" className="font-bold text-[var(--primary)] hover:underline">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

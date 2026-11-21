// Professional Responsive Navbar Component
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Moon,
  Sun,
  Users,
  Inbox,
  Flame,
  BookOpen,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Search,
  CalendarCheck,
  Home,
  LayoutDashboard,
  Compass,
  Layers,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import BrandLogo from './BrandLogo.jsx';
import AllScreensDirectory from './AllScreensDirectory.jsx';
import PWAInstallButton from './PWAInstallButton.jsx';

export default function Navbar() {
  const { user, logout, activePartnershipId } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isAllScreensOpen, setIsAllScreensOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // The Core Four Tabs Navigation of Quran Mate (when authenticated) or Public Links
  const navLinks = user
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, desc: 'Overview & Qur\'an Reciter' },
        { label: 'Tracker', path: '/tracker', icon: CalendarCheck, desc: 'Streaks & weekly chart' },
        {
          label: 'My Mate',
          path: '/partnership',
          icon: Flame,
          desc: 'Daily check-in & streaks',
          badge: activePartnershipId ? 'Active' : null,
        },
        { label: 'Discover', path: '/discover', icon: Users, desc: 'Find compatible partners' },
      ]
    : [
        { label: 'Home', path: '/home', icon: Home, desc: 'Platform overview' },
        { label: 'Qur\'an', path: '/quran', icon: BookOpen, desc: '114 Surahs & audio' },
        { label: 'Ayah Finder', path: '/ayah-finder', icon: Search, desc: 'Verse lookup & tafsir' },
        { label: 'Study Circles', path: '/groups', icon: Layers, desc: 'Collaborative halaqahs' },
      ];

  const closeMobileMenu = () => setIsMobileDrawerOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-surface)]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <Link
            to={user ? '/dashboard' : '/home'}
            className="flex items-center gap-3 group focus:outline-none"
            onClick={closeMobileMenu}
          >
            <BrandLogo size="sm" className="transition-transform group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg tracking-tight text-[var(--text-primary)]">
                <span>Quran Mate</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 tracking-wider">
                  Peer Hifz
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] -mt-0.5 hidden sm:block">
                Memorize together &bull; Build lasting consistency
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                location.pathname === link.path ||
                (link.path === '/home' && (location.pathname === '/' || location.pathname === '/welcome'));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--primary-light)] text-[var(--primary)] shadow-2xs font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* All Screens Dropdown Button */}
            <button
              onClick={() => setIsAllScreensOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-color)] transition-all ml-1"
              title="Open full directory of all screens and features"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>All Screens</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* PWA Install Button (3MTT App Style) */}
            <PWAInstallButton className="hidden md:flex" />

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Desktop User Avatar / Auth Links */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-[var(--border-color)] hover:border-[var(--primary-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0"
                    style={{ backgroundColor: user.avatar_color || '#047857' }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)] max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              aria-label="Open mobile menu"
              className="lg:hidden p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sliding Drawer & Backdrop */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Dark Backdrop */}
          <div
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Sheet */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250 z-10 p-5">
            {/* Top of Drawer */}
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-2.5">
                  <BrandLogo size="sm" />
                  <div>
                    <h2 className="font-bold text-sm text-[var(--text-primary)]">Quran Mate</h2>
                    <span className="text-[10px] text-[var(--text-muted)]">Peer Hifz Companion</span>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card in Drawer */}
              {user ? (
                <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0"
                    style={{ backgroundColor: user.avatar_color || '#047857' }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div className="truncate flex-1">
                    <div className="font-bold text-xs text-[var(--text-primary)] truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate">
                      {user.memorization_stage || 'Learner'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[var(--primary-light)] border border-[var(--primary-border)] text-center space-y-3">
                  <p className="text-xs font-semibold text-[var(--primary)]">
                    Join sisters worldwide in focused Quran accountability.
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white text-center"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              )}

              {/* Install Mobile App Banner (3MTT App Style) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <BrandLogo size="xs" />
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <span>Install Quran Mate App</span>
                      <span className="text-[9px] font-extrabold uppercase px-1 py-0.2 rounded bg-emerald-600 text-white">
                        PWA
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Instant launch on home screen, offline mode
                    </p>
                  </div>
                </div>
                <PWAInstallButton variant="full" />
              </div>

              {/* Quick Launch Buttons (Home, Dashboard, All Screens) */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/home"
                  onClick={closeMobileMenu}
                  className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--primary-light)] flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]"
                >
                  <Home className="w-4 h-4 text-emerald-600" />
                  <span>Main Home</span>
                </Link>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--primary-light)] flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                  <span>Dashboard</span>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-2 pt-1 pb-1">
                  Navigation
                </div>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    location.pathname === link.path ||
                    (link.path === '/home' && (location.pathname === '/' || location.pathname === '/welcome'));

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                        isActive
                          ? 'bg-[var(--primary-light)] text-[var(--primary)] font-bold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isActive
                              ? 'bg-[var(--primary)] text-white'
                              : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold">{link.label}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{link.desc}</div>
                        </div>
                      </div>
                      {link.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                {/* Additional Study Messaging Link if paired */}
                {activePartnershipId && (
                  <Link
                    to={`/partnership/${activePartnershipId}/messages`}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Partner Discussion</div>
                        <div className="text-[10px] text-[var(--text-muted)]">
                          1-to-1 session chat
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* All Screens Directory trigger */}
                <button
                  onClick={() => {
                    closeMobileMenu();
                    setIsAllScreensOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-[var(--text-primary)]">All Screens Directory</div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        Browse all pages &amp; tools
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom of Drawer: Theme & Logout */}
            <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-medium text-[var(--text-secondary)]">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] text-xs font-semibold text-[var(--text-primary)]"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-slate-700" />
                      <span>Light</span>
                    </>
                  )}
                </button>
              </div>

              {user && (
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All Screens Directory Modal */}
      <AllScreensDirectory
        isOpen={isAllScreensOpen}
        onClose={() => setIsAllScreensOpen(false)}
      />
    </>
  );
}

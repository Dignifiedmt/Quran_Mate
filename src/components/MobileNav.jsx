// Core Four Tabs Navigation Component (Mobile Bottom Bar & Desktop Floating Dock)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, CalendarCheck, Flame, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function MobileNav() {
  const { activePartnershipId } = useAuth();
  const location = useLocation();

  // The 4 Core Primary Tabs of Quran Mate
  const items = [
    {
      id: 'tab-dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      aliases: ['/dashboard', '/quran'],
    },
    {
      id: 'tab-tracker',
      label: 'Tracker',
      path: '/tracker',
      icon: CalendarCheck,
      aliases: ['/tracker'],
    },
    {
      id: 'tab-mate',
      label: 'My Mate',
      path: '/partnership',
      icon: Flame,
      isSpecial: !!activePartnershipId,
      aliases: ['/partnership'],
    },
    {
      id: 'tab-discover',
      label: 'Discover',
      path: '/discover',
      icon: Users,
      aliases: ['/discover', '/learners'],
    },
  ];

  return (
    <nav
      id="four-tabs-navigation"
      aria-label="Four tabs navigation"
      className="fixed bottom-0 sm:bottom-4 left-0 sm:left-1/2 sm:-translate-x-1/2 right-0 sm:right-auto z-40 w-full sm:w-auto sm:min-w-[380px] sm:max-w-md bg-[var(--bg-surface)]/95 backdrop-blur-md border-t sm:border border-[var(--border-color)] sm:rounded-2xl px-2 sm:px-4 py-1.5 sm:py-2 shadow-lg sm:shadow-2xl transition-all duration-200"
    >
      <div className="flex items-center justify-around sm:gap-2 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            item.aliases?.some((a) => location.pathname.startsWith(a));

          return (
            <Link
              key={item.path}
              id={item.id}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-3 sm:px-4 rounded-xl text-[11px] font-semibold transition-all duration-150 group ${
                isActive
                  ? 'text-[var(--primary)] font-bold bg-[var(--primary-light)]/70 dark:bg-emerald-950/60 shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              {/* Active Top Glow Pill on Desktop/Mobile */}
              {isActive && (
                <span className="absolute -top-1 sm:-top-1.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-[var(--primary)]" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive
                      ? 'scale-110 text-[var(--primary)]'
                      : 'group-hover:scale-105'
                  }`}
                />
                {item.isSpecial && (
                  <span
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse ring-2 ring-[var(--bg-surface)]"
                    title="Active Accountability Partner"
                  />
                )}
              </div>
              <span className="mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

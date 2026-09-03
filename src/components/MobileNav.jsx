// Mobile Bottom Navigation
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, CalendarCheck, Flame, BookOpen, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function MobileNav() {
  const { user, activePartnershipId } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const items = [
    { label: 'Qur\'an', path: '/quran', icon: BookOpen },
    { label: 'Tracker', path: '/tracker', icon: CalendarCheck },
    { label: 'My Mate', path: '/partnership', icon: Flame, isSpecial: !!activePartnershipId },
    { label: 'Discover', path: '/discover', icon: Users },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-color)] px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === '/quran' && location.pathname.startsWith('/ayah-finder')) ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-[var(--primary)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[var(--primary)]' : ''}`} />
                {item.isSpecial && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </div>
              <span className="mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

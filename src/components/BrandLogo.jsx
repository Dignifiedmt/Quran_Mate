// Brand Logo Component with Open Holy Qur'an on Rehal with radiant Crescent Moon
import React from 'react';

export default function BrandLogo({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div
      aria-label="Quran Mate Logo"
      className={`rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 text-white flex items-center justify-center shadow-md ring-1 ring-emerald-400/30 shrink-0 select-none ${
        sizeMap[size] || sizeMap.md
      } ${className}`}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4/5 h-4/5 text-amber-300 drop-shadow-sm"
      >
        {/* Radiant Crescent Moon rising gracefully behind/above the Quran */}
        <path
          d="M37 6 C42 6, 48 10, 50 16 C45 14, 38 17, 37 23 C36 27, 39 31, 44 32 C39 35, 31 34, 27 28 C23 22, 25 12, 33 7 C34.3 6.3, 35.6 6, 37 6 Z"
          fill="url(#moonGlow)"
        />

        {/* Small brilliant 8-point Islamic star near the crescent */}
        <polygon
          points="49,11 50.5,13.5 53,14 51,16 51.5,18.5 49,17.5 46.5,18.5 47,16 45,14 47.5,13.5"
          fill="#fef08a"
        />

        {/* Open Qur'an Left Page */}
        <path
          d="M32 37 C24 35, 14 36, 9 40 L9 26 C15 22, 24 22, 32 25 Z"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="0.8"
        />

        {/* Open Qur'an Right Page */}
        <path
          d="M32 37 C40 35, 50 36, 55 40 L55 26 C49 22, 40 22, 32 25 Z"
          fill="#f1f5f9"
          stroke="#cbd5e1"
          strokeWidth="0.8"
        />

        {/* Delicate Golden Scripture Lines on Left Page */}
        <line x1="14" y1="27" x2="28" y2="26" stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
        <line x1="13" y1="30" x2="28" y2="29" stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
        <line x1="14" y1="33" x2="28" y2="32" stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
        <line x1="15" y1="36" x2="28" y2="35" stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.75" />

        {/* Delicate Golden Scripture Lines on Right Page */}
        <line x1="36" y1="26" x2="50" y2="27" stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
        <line x1="36" y1="29" x2="51" y2="30" stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
        <line x1="36" y1="32" x2="50" y2="33" stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
        <line x1="36" y1="35" x2="49" y2="36" stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.75" />

        {/* Spine / Center Binding of the Holy Quran with Gold Bookmark Ribbon */}
        <line x1="32" y1="24" x2="32" y2="38" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 37 Q33 44 35 48" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Wooden Rehal / Bookstand (Traditional Crossed Stand) */}
        <path
          d="M16 43 L32 54 L48 43"
          stroke="#b45309"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 48 L14 56"
          stroke="#92400e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M41 48 L50 56"
          stroke="#92400e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="moonGlow" x1="26" y1="6" x2="50" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.6" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

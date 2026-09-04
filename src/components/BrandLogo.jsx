import React from 'react';

export default function BrandLogo({ size = 'md', className = '' }) {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div
      aria-label="Quran Mate Logo"
      className={`relative rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 text-white flex items-center justify-center shadow-md ring-1 ring-emerald-400/30 shrink-0 select-none overflow-hidden p-1 ${
        sizeMap[size] || sizeMap.md
      } ${className}`}
    >
      {/* Radiant ambient glow */}
      <div className="absolute inset-0 bg-radial from-amber-300/20 via-transparent to-transparent pointer-events-none" />

      {/* Actual Quran Mate Brand Logo SVG */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4/5 h-4/5 text-amber-300 drop-shadow-sm"
      >
        <path
          d="M37 6 C42 6, 48 10, 50 16 C45 14, 38 17, 37 23 C36 27, 39 31, 44 32 C39 35, 31 34, 27 28 C23 22, 25 12, 33 7 C34.3 6.3, 35.6 6, 37 6 Z"
          fill="#fef08a"
        />
        <polygon
          points="49,11 50.5,13.5 53,14 51,16 51.5,18.5 49,17.5 46.5,18.5 47,16 45,14 47.5,13.5"
          fill="#fef08a"
        />
        {/* Open Quran pages */}
        <path
          d="M32 37 C24 35, 14 36, 9 40 L9 26 C15 22, 24 22, 32 25 Z"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="0.8"
        />
        <path
          d="M32 37 C40 35, 50 36, 55 40 L55 26 C49 22, 40 22, 32 25 Z"
          fill="#f1f5f9"
          stroke="#cbd5e1"
          strokeWidth="0.8"
        />
        {/* Wooden Rehal */}
        <path
          d="M16 43 L32 54 L48 43"
          stroke="#b45309"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M23 48 L14 56" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M41 48 L50 56" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

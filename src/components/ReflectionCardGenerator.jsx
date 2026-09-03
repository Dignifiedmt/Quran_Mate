// Client-side Reflection Card Generator - Simple UI, Color Themes & Instant Canvas Export
import React, { useState, useRef, useEffect } from 'react';
import {
  Palette,
  Download,
  Copy,
  Check,
  Share2,
  RefreshCw,
  Sparkles,
  BookOpen,
  Moon,
  Star,
  Type,
  Maximize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLOR_THEMES = [
  {
    id: 'emerald-gold',
    name: 'Emerald & Gold',
    bgStart: '#064e3b',
    bgEnd: '#022c22',
    accent: '#fbbf24',
    text: '#ffffff',
    subtext: '#d1fae5',
    border: '#d97706',
  },
  {
    id: 'midnight-navy',
    name: 'Midnight & Moon',
    bgStart: '#0f172a',
    bgEnd: '#1e1b4b',
    accent: '#38bdf8',
    text: '#ffffff',
    subtext: '#cbd5e1',
    border: '#60a5fa',
  },
  {
    id: 'warm-amber',
    name: 'Desert Sunset',
    bgStart: '#78350f',
    bgEnd: '#451a03',
    accent: '#fde047',
    text: '#ffffff',
    subtext: '#fef3c7',
    border: '#d97706',
  },
  {
    id: 'royal-teal',
    name: 'Oceanic Teal',
    bgStart: '#115e59',
    bgEnd: '#134e4a',
    accent: '#5eead4',
    text: '#ffffff',
    subtext: '#ccfbf1',
    border: '#2dd4bf',
  },
  {
    id: 'slate-silver',
    name: 'Dark Slate & Silver',
    bgStart: '#18181b',
    bgEnd: '#27272a',
    accent: '#e4e4e7',
    text: '#ffffff',
    subtext: '#a1a1aa',
    border: '#71717a',
  },
  {
    id: 'ivory-parchment',
    name: 'Parchment & Bronze',
    bgStart: '#fef3c7',
    bgEnd: '#fde68a',
    accent: '#92400e',
    text: '#451a03',
    subtext: '#78350f',
    border: '#b45309',
  },
];

const PRESET_VERSES = [
  {
    ref: 'Surah Al-Baqarah (2:255)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence.',
  },
  {
    ref: 'Surah Al-Inshirah (94:5-6)',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'For indeed, with hardship comes ease. Indeed, with hardship comes ease.',
  },
  {
    ref: 'Surah Al-Kahf (18:10)',
    arabic: 'رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا',
    translation: 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.',
  },
  {
    ref: 'Surah Ar-Rahman (55:13)',
    arabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    translation: 'So which of the favors of your Lord would you deny?',
  },
  {
    ref: 'Surah Taha (20:114)',
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translation: 'And say, "My Lord, increase me in knowledge."',
  },
];

export default function ReflectionCardGenerator({ defaultAyahText = '', onShareWithMate }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Card Content State
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[0]);
  const [arabicText, setArabicText] = useState('اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ');
  const [translation, setTranslation] = useState(
    defaultAyahText || 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence.'
  );
  const [reference, setReference] = useState('Surah Al-Baqarah (2:255)');
  const [ornamentType, setOrnamentType] = useState('crescent'); // 'crescent' | 'bismillah' | 'star' | 'book'
  const [showBorder, setShowBorder] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Custom Color override
  const [customBgStart, setCustomBgStart] = useState('#064e3b');
  const [customBgEnd, setCustomBgEnd] = useState('#022c22');
  const [isCustomColor, setIsCustomColor] = useState(false);

  const activeTheme = isCustomColor
    ? {
        ...selectedTheme,
        bgStart: customBgStart,
        bgEnd: customBgEnd,
      }
    : selectedTheme;

  // Apply defaultAyahText if passed
  useEffect(() => {
    if (defaultAyahText) {
      setTranslation(defaultAyahText);
    }
  }, [defaultAyahText]);

  // Canvas drawing function for high-res instant download
  const renderCardToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1000;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, activeTheme.bgStart);
    gradient.addColorStop(1, activeTheme.bgEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Subtle Geometric Islamic Pattern in Background
    ctx.save();
    ctx.strokeStyle = activeTheme.accent;
    ctx.globalAlpha = 0.08;
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 80) {
      for (let j = 0; j < height; j += 80) {
        ctx.strokeRect(i + 10, j + 10, 60, 60);
        ctx.beginPath();
        ctx.arc(i + 40, j + 40, 25, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();

    // 3. Draw Islamic Borders
    if (showBorder) {
      ctx.save();
      // Outer border
      ctx.strokeStyle = activeTheme.border;
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Inner border
      ctx.strokeStyle = activeTheme.accent;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(55, 55, width - 110, height - 110);

      // Decorative Corner Ornaments
      const corners = [
        [55, 55],
        [width - 55, 55],
        [55, height - 55],
        [width - 55, height - 55],
      ];
      ctx.fillStyle = activeTheme.accent;
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // 4. Draw Header Ornament
    ctx.save();
    ctx.fillStyle = activeTheme.accent;
    ctx.textAlign = 'center';

    if (ornamentType === 'bismillah') {
      ctx.font = 'bold 36px "Amiri", "Traditional Arabic", serif';
      ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', width / 2, 140);
    } else if (ornamentType === 'crescent') {
      ctx.font = '40px sans-serif';
      ctx.fillText('🌙  ✦  ✨', width / 2, 140);
    } else if (ornamentType === 'star') {
      ctx.font = '36px sans-serif';
      ctx.fillText('۞  •  ۞  •  ۞', width / 2, 140);
    } else {
      ctx.font = '36px sans-serif';
      ctx.fillText('📖  Qur\'an Reflection  📖', width / 2, 140);
    }
    ctx.restore();

    // 5. Draw Arabic Verse Text
    ctx.save();
    ctx.fillStyle = activeTheme.text;
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.font = 'bold 44px "Amiri", "Scheherazade New", "Traditional Arabic", serif';

    // Wrap Arabic text if needed
    const arabicWords = arabicText.split(' ');
    let currentLine = '';
    const arabicLines = [];
    arabicWords.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length > 35) {
        arabicLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) arabicLines.push(currentLine);

    const arabicStartY = 320;
    arabicLines.forEach((line, idx) => {
      ctx.fillText(line, width / 2, arabicStartY + idx * 75);
    });
    ctx.restore();

    // Divider line
    ctx.save();
    ctx.strokeStyle = activeTheme.accent;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, 530);
    ctx.lineTo(width / 2 + 120, 530);
    ctx.stroke();

    ctx.fillStyle = activeTheme.accent;
    ctx.beginPath();
    ctx.arc(width / 2, 530, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. Draw English Translation Text
    ctx.save();
    ctx.fillStyle = activeTheme.subtext;
    ctx.textAlign = 'center';
    ctx.direction = 'ltr';
    ctx.font = 'italic 26px system-ui, -apple-system, sans-serif';

    const transWords = translation.split(' ');
    let transLine = '';
    const transLines = [];
    transWords.forEach((word) => {
      const test = transLine ? `${transLine} ${word}` : word;
      if (test.length > 55) {
        transLines.push(transLine);
        transLine = word;
      } else {
        transLine = test;
      }
    });
    if (transLine) transLines.push(transLine);

    const transStartY = 600;
    transLines.forEach((l, idx) => {
      ctx.fillText(`“${l}”`, width / 2, transStartY + idx * 42);
    });
    ctx.restore();

    // 7. Draw Reference & Footer Branding
    ctx.save();
    ctx.fillStyle = activeTheme.accent;
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText(reference, width / 2, 830);

    ctx.fillStyle = activeTheme.subtext;
    ctx.globalAlpha = 0.65;
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Quran Mate • Peer Memorization & Reflection', width / 2, 880);
    ctx.restore();
  };

  // Re-render canvas whenever state changes
  useEffect(() => {
    renderCardToCanvas();
  }, [activeTheme, arabicText, translation, reference, ornamentType, showBorder]);

  // Instant PNG Download
  const handleDownload = () => {
    try {
      setDownloading(true);
      renderCardToCanvas();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `quran-card-${reference.replace(/[^a-z0-9]/gi, '_')}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  // Copy to Clipboard as Image
  const handleCopyImage = async () => {
    try {
      renderCardToCanvas();
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        } catch (clipErr) {
          // Fallback: copy text
          navigator.clipboard.writeText(`${reference}\n${arabicText}\n"${translation}"`);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyPreset = (preset) => {
    setArabicText(preset.arabic);
    setTranslation(preset.translation);
    setReference(preset.ref);
  };

  return (
    <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Ayah Reflection Card Studio</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            Create Custom Quran Reflection Cards
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Choose colors, verse typography, and borders to generate instant shareable cards for study or social sharing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyImage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-all shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Card'}</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Exporting...' : 'Download PNG'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
              Popular Ayah Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_VERSES.map((pv, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(pv)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-[var(--primary-border)] hover:text-[var(--primary)] transition-colors"
                >
                  {pv.ref.split(' ')[1] || pv.ref}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
              Color Theme:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_THEMES.map((theme) => {
                const isSelected = !isCustomColor && selectedTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setIsCustomColor(false);
                      setSelectedTheme(theme);
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-[var(--primary)] ring-2 ring-[var(--primary)] bg-[var(--bg-subtle)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full shrink-0 shadow-xs border border-white/20"
                      style={{
                        background: `linear-gradient(135deg, ${theme.bgStart}, ${theme.bgEnd})`,
                      }}
                    />
                    <span className="text-[11px] font-semibold text-[var(--text-primary)] truncate">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Toggle */}
            <div className="mt-2.5 p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-secondary)]">Custom Gradient Colors:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customBgStart}
                  onChange={(e) => {
                    setIsCustomColor(true);
                    setCustomBgStart(e.target.value);
                  }}
                  title="Gradient Start Color"
                  className="w-7 h-7 rounded-lg cursor-pointer border border-[var(--border-color)] bg-transparent"
                />
                <input
                  type="color"
                  value={customBgEnd}
                  onChange={(e) => {
                    setIsCustomColor(true);
                    setCustomBgEnd(e.target.value);
                  }}
                  title="Gradient End Color"
                  className="w-7 h-7 rounded-lg cursor-pointer border border-[var(--border-color)] bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Top Motif / Ornament */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
              Header Motif:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'crescent', label: 'Crescent Moon', icon: Moon },
                { id: 'bismillah', label: 'Bismillah', icon: Type },
                { id: 'star', label: 'Islamic Star', icon: Star },
                { id: 'book', label: 'Holy Book', icon: BookOpen },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setOrnamentType(m.id)}
                  className={`py-2 px-1 rounded-xl border text-center text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                    ornamentType === m.id
                      ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <m.icon className="w-3.5 h-3.5" />
                  <span className="text-[10px]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Border Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-[var(--text-primary)]">Decorative Gold Border:</span>
            <button
              type="button"
              onClick={() => setShowBorder(!showBorder)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                showBorder
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]'
              }`}
            >
              {showBorder ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Text Inputs */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                Arabic Ayah Text:
              </label>
              <textarea
                rows="2"
                dir="rtl"
                value={arabicText}
                onChange={(e) => setArabicText(e.target.value)}
                className="w-full text-sm font-arabic rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                English Translation / Reflection:
              </label>
              <textarea
                rows="2"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                Surah & Ayah Reference:
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="w-full max-w-[420px] aspect-square rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-center relative overflow-hidden shadow-xl select-none transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${activeTheme.bgStart}, ${activeTheme.bgEnd})`,
              border: showBorder ? `2px solid ${activeTheme.border}` : 'none',
              boxShadow: `0 20px 35px -10px ${activeTheme.bgEnd}90`,
            }}
          >
            {/* Inner Border */}
            {showBorder && (
              <div
                className="absolute inset-3 rounded-2xl pointer-events-none"
                style={{ border: `1px solid ${activeTheme.accent}50` }}
              />
            )}

            {/* Top Ornament */}
            <div className="relative z-10 pt-2" style={{ color: activeTheme.accent }}>
              {ornamentType === 'bismillah' && (
                <p className="font-arabic text-lg sm:text-xl font-bold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              )}
              {ornamentType === 'crescent' && (
                <div className="text-xl sm:text-2xl flex items-center justify-center gap-2">
                  <span>🌙</span>
                  <span className="text-xs opacity-75">✦</span>
                  <span className="text-sm">✨</span>
                </div>
              )}
              {ornamentType === 'star' && (
                <p className="text-base tracking-widest">۞ &bull; ۞ &bull; ۞</p>
              )}
              {ornamentType === 'book' && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-black/20">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Qur'an Reflection</span>
                </div>
              )}
            </div>

            {/* Arabic Center Text */}
            <div className="my-auto py-4 relative z-10">
              <p
                className="font-arabic text-xl sm:text-2xl lg:text-3xl leading-[2.2] sm:leading-[2.4] text-center"
                dir="rtl"
                style={{ color: activeTheme.text }}
              >
                {arabicText}
              </p>

              <div
                className="w-20 h-0.5 mx-auto my-3 rounded-full opacity-60"
                style={{ backgroundColor: activeTheme.accent }}
              />

              <p
                className="text-xs sm:text-sm italic leading-relaxed px-2 font-medium"
                style={{ color: activeTheme.subtext }}
              >
                &ldquo;{translation}&rdquo;
              </p>
            </div>

            {/* Bottom Reference */}
            <div className="relative z-10 pb-1">
              <span
                className="text-xs font-bold tracking-wide block"
                style={{ color: activeTheme.accent }}
              >
                {reference}
              </span>
              <span
                className="text-[10px] tracking-wider opacity-60 block mt-0.5 font-sans"
                style={{ color: activeTheme.subtext }}
              >
                Quran Mate &bull; Peer Accountability
              </span>
            </div>
          </div>

          {/* Hidden Canvas for crisp image generation */}
          <canvas ref={canvasRef} className="hidden" />

          <p className="text-[11px] text-[var(--text-muted)] text-center mt-3">
            Pure client-side card render &bull; Generates instant high-resolution PNG image
          </p>
        </div>
      </div>
    </div>
  );
}

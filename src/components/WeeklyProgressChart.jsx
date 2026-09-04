// Weekly Progress Chart using Recharts
// Visualizes verses memorized (Hifz) and reviewed (Muraja'ah) over the past 7 days
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  Award,
  BookOpen,
  RotateCcw,
  Sparkles,
  Calendar
} from 'lucide-react';

// Custom Tooltip component for Recharts
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 shadow-lg text-xs space-y-1.5 z-50">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-color)] pb-1">
          <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            {data.day}, {data.date}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-medium">
            {data.minutes > 0 ? `${data.minutes} mins` : 'Completed'}
          </span>
        </div>

        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between gap-3 text-emerald-700 dark:text-emerald-300 font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Memorized (Hifz):
            </span>
            <span>{data.memorized || 0} ayahs</span>
          </div>

          <div className="flex items-center justify-between gap-3 text-teal-700 dark:text-teal-300 font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              Reviewed (Muraja&rsquo;ah):
            </span>
            <span>{data.reviewed || 0} ayahs</span>
          </div>

          <div className="border-t border-[var(--border-color)] pt-1 flex items-center justify-between font-bold text-[var(--text-primary)]">
            <span>Total Verses:</span>
            <span>{(data.memorized || 0) + (data.reviewed || 0)} ayahs</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function WeeklyProgressChart({ data, title = 'Weekly Progress Chart', subtitle = 'Verses memorized vs. reviewed over the past 7 days' }) {
  // Default mock data if empty (e.g. before initial log)
  const defaultPast7 = [
    { day: 'Mon', date: 'Day 1', memorized: 5, reviewed: 15, totalVerses: 20, minutes: 25 },
    { day: 'Tue', date: 'Day 2', memorized: 6, reviewed: 20, totalVerses: 26, minutes: 30 },
    { day: 'Wed', date: 'Day 3', memorized: 4, reviewed: 18, totalVerses: 22, minutes: 20 },
    { day: 'Thu', date: 'Day 4', memorized: 7, reviewed: 25, totalVerses: 32, minutes: 35 },
    { day: 'Fri', date: 'Day 5', memorized: 8, reviewed: 30, totalVerses: 38, minutes: 40 },
    { day: 'Sat', date: 'Day 6', memorized: 5, reviewed: 22, totalVerses: 27, minutes: 25 },
    { day: 'Sun', date: 'Day 7', memorized: 6, reviewed: 28, totalVerses: 34, minutes: 35 },
  ];

  const chartData = data && data.length > 0 ? data : defaultPast7;

  // Compute weekly totals
  const totalMemorized = chartData.reduce((acc, d) => acc + (d.memorized || 0), 0);
  const totalReviewed = chartData.reduce((acc, d) => acc + (d.reviewed || 0), 0);
  const totalVerses = totalMemorized + totalReviewed;
  const totalMinutes = chartData.reduce((acc, d) => acc + (d.minutes || 0), 0);
  const dailyAverage = Math.round(totalVerses / (chartData.length || 7));

  return (
    <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header & Metrics Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              {title}
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            {subtitle}
          </p>
        </div>

        {/* 7-Day Quick Stats */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs">
            <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
              New Verses
            </span>
            <span className="font-extrabold text-sm">{totalMemorized} ayahs</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 text-xs">
            <span className="block text-[10px] text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">
              Reviewed
            </span>
            <span className="font-extrabold text-sm">{totalReviewed} ayahs</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs">
            <span className="block text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
              Weekly Total
            </span>
            <span className="font-extrabold text-sm">{totalVerses} ayahs</span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: 'var(--border-color)', strokeWidth: 1 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
              formatter={(value) => {
                if (value === 'memorized') return <span className="text-xs font-semibold text-[var(--text-primary)]">Memorized (Hifz)</span>;
                if (value === 'reviewed') return <span className="text-xs font-semibold text-[var(--text-primary)]">Reviewed (Muraja&rsquo;ah)</span>;
                return value;
              }}
            />
            <Bar
              dataKey="memorized"
              name="memorized"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="reviewed"
              name="reviewed"
              fill="#0d9488"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Accountability Footer Footnote */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--text-muted)] border-t border-[var(--border-color)] pt-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            Daily consistency average: <strong className="text-[var(--text-primary)]">{dailyAverage} verses/day</strong> &bull; Total time: <strong className="text-[var(--text-primary)]">{totalMinutes} mins</strong>
          </span>
        </div>
        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          Verified with your Quran Accountability Partner
        </div>
      </div>
    </div>
  );
}

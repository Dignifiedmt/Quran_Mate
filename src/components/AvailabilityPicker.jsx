// Availability Picker Component
import React from 'react';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityPicker({ slots = [], onChange }) {
  const handleAddSlot = () => {
    const newSlot = {
      day: 'Saturday',
      start_time: '19:00',
      end_time: '20:00',
    };
    onChange([...slots, newSlot]);
  };

  const handleRemoveSlot = (index) => {
    const updated = slots.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)]">
            Preferred Study & Revision Windows
          </label>
          <p className="text-xs text-[var(--text-muted)]">
            Indicate when you are open to study (not a live online status).
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddSlot}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Window</span>
        </button>
      </div>

      {slots.length === 0 ? (
        <div className="text-center py-6 px-4 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-subtle)]/50">
          <Clock className="w-6 h-6 mx-auto text-[var(--text-muted)] mb-2 opacity-60" />
          <p className="text-xs text-[var(--text-muted)]">
            No study windows added yet. Click &ldquo;Add Window&rdquo; to share your schedule with potential Quran Mates.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {slots.map((slot, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs transition-all"
            >
              <div className="flex items-center gap-2 flex-1">
                <Calendar className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <select
                  value={slot.day}
                  onChange={(e) => handleSlotChange(index, 'day', e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-2.5 py-1.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <Clock className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <input
                  type="time"
                  value={slot.start_time}
                  onChange={(e) => handleSlotChange(index, 'start_time', e.target.value)}
                  className="w-full text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <span className="text-xs text-[var(--text-muted)]">to</span>
                <input
                  type="time"
                  value={slot.end_time}
                  onChange={(e) => handleSlotChange(index, 'end_time', e.target.value)}
                  className="w-full text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveSlot(index)}
                className="self-end sm:self-center p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                title="Remove study window"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

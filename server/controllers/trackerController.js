// Daily Quran Study Tracker Controller
import { query, get, run } from '../database/database.js';

function getTodayDateStr() {
  return new Date().toISOString().split('T')[0];
}

// Calculate consecutive daily study streak
async function calculateUserStreak(userId) {
  // Get distinct dates user logged study sessions
  const datesResult = await query(
    `SELECT DISTINCT date FROM daily_tracker_logs 
     WHERE user_id = ? AND completed = 1
     UNION
     SELECT DISTINCT date FROM checkins
     WHERE user_id = ? AND completed = 1
     ORDER BY date DESC`,
    [userId, userId]
  );

  if (!datesResult || datesResult.length === 0) return 0;

  const dateSet = new Set(datesResult.map((r) => r.date));
  const today = new Date();
  let current = new Date(today);
  let streak = 0;

  const todayStr = current.toISOString().split('T')[0];
  const todayDone = dateSet.has(todayStr);

  // If today is not done yet, check if yesterday was done to keep streak intact
  if (!todayDone) {
    current.setDate(current.getDate() - 1);
  }

  for (let i = 0; i < 365; i++) {
    const dStr = current.toISOString().split('T')[0];
    if (dateSet.has(dStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export async function getTrackerSummary(req, res) {
  try {
    const userId = req.user.id;
    const todayStr = getTodayDateStr();

    // 1. Fetch today's logs
    const todayLogs = await query(
      `SELECT id, activity_type, portion_covered, pages_count, ayahs_count, duration_minutes, notes, created_at
       FROM daily_tracker_logs
       WHERE user_id = ? AND date = ?
       ORDER BY id DESC`,
      [userId, todayStr]
    );

    // 2. Fetch active partnership if any
    const partnership = await get(
      `SELECT id, user_a_id, user_b_id, status FROM partnerships
       WHERE (user_a_id = ? OR user_b_id = ?) AND status = 'active'`,
      [userId, userId]
    );

    let partnerInfo = null;
    if (partnership) {
      const partnerId = partnership.user_a_id === userId ? partnership.user_b_id : partnership.user_a_id;
      const partnerUser = await get(
        `SELECT id, name, memorization_stage, goal, avatar_color FROM users WHERE id = ?`,
        [partnerId]
      );
      const partnerTodayCheckin = await get(
        `SELECT id, completed, notes FROM checkins
         WHERE partnership_id = ? AND user_id = ? AND date = ?`,
        [partnership.id, partnerId, todayStr]
      );

      partnerInfo = {
        partnershipId: partnership.id,
        partner: partnerUser,
        partnerCompletedToday: partnerTodayCheckin ? partnerTodayCheckin.completed === 1 : false,
        partnerNotes: partnerTodayCheckin?.notes || '',
      };
    }

    // 3. User streak
    const streak = await calculateUserStreak(userId);

    // 4. Past 30 days totals
    const past30DaysDate = new Date();
    past30DaysDate.setDate(past30DaysDate.getDate() - 30);
    const past30Str = past30DaysDate.toISOString().split('T')[0];

    const past30Stats = await get(
      `SELECT 
         COUNT(DISTINCT date) as days_studied,
         SUM(duration_minutes) as total_minutes,
         SUM(pages_count) as total_pages,
         SUM(ayahs_count) as total_ayahs
       FROM daily_tracker_logs
       WHERE user_id = ? AND date >= ?`,
      [userId, past30Str]
    );

    // 5. Activity breakdown (Hifz vs Murajaah vs Tilawah vs Tadabbur)
    const activityCounts = await query(
      `SELECT activity_type, COUNT(*) as count, SUM(duration_minutes) as minutes
       FROM daily_tracker_logs
       WHERE user_id = ?
       GROUP BY activity_type`,
      [userId]
    );

    // 6. Last 14 days grid
    const recentDays = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();

      recentDays.push({
        date: dStr,
        dayName,
        dayNum,
        isToday: dStr === todayStr,
      });
    }

    // Fetch dates that had logs in the last 14 days
    const recentActivityDates = await query(
      `SELECT date, COUNT(*) as logs_count, SUM(duration_minutes) as minutes
       FROM daily_tracker_logs
       WHERE user_id = ? AND date >= ?
       GROUP BY date`,
      [userId, recentDays[0].date]
    );

    const activeDateMap = {};
    for (const r of recentActivityDates) {
      activeDateMap[r.date] = { count: r.logs_count, minutes: r.minutes || 0 };
    }

    const weeklyGrid = recentDays.map((d) => ({
      ...d,
      completed: !!activeDateMap[d.date],
      minutes: activeDateMap[d.date]?.minutes || 0,
      logsCount: activeDateMap[d.date]?.count || 0,
    }));

    return res.json({
      today: {
        date: todayStr,
        hasCompletedToday: todayLogs.length > 0,
        logs: todayLogs,
        totalMinutes: todayLogs.reduce((acc, l) => acc + (l.duration_minutes || 0), 0),
        totalPages: todayLogs.reduce((acc, l) => acc + (l.pages_count || 0), 0),
        totalAyahs: todayLogs.reduce((acc, l) => acc + (l.ayahs_count || 0), 0),
      },
      streak,
      past30Days: {
        daysStudied: past30Stats?.days_studied || 0,
        totalMinutes: past30Stats?.total_minutes || 0,
        totalPages: past30Stats?.total_pages || 0,
        totalAyahs: past30Stats?.total_ayahs || 0,
      },
      activityCounts,
      weeklyGrid,
      partnerInfo,
    });
  } catch (err) {
    console.error('Error fetching tracker summary:', err);
    return res.status(500).json({ error: 'Failed to retrieve study tracker summary' });
  }
}

export async function getTrackerLogs(req, res) {
  try {
    const userId = req.user.id;
    const { date, limit = 50 } = req.query;

    let sql = `
      SELECT id, date, activity_type, portion_covered, pages_count, ayahs_count, duration_minutes, notes, created_at
      FROM daily_tracker_logs
      WHERE user_id = ?
    `;
    const params = [userId];

    if (date) {
      sql += ` AND date = ?`;
      params.push(date);
    }

    sql += ` ORDER BY date DESC, id DESC LIMIT ?`;
    params.push(Number(limit) || 50);

    const logs = await query(sql, params);
    return res.json({ logs });
  } catch (err) {
    console.error('Error fetching tracker logs:', err);
    return res.status(500).json({ error: 'Failed to load tracker logs' });
  }
}

export async function createTrackerLog(req, res) {
  try {
    const userId = req.user.id;
    const {
      date = getTodayDateStr(),
      activity_type = 'hifz',
      portion_covered = '',
      pages_count = 0,
      ayahs_count = 0,
      duration_minutes = 15,
      notes = '',
    } = req.body;

    // Check if user is in active partnership
    const partnership = await get(
      `SELECT id FROM partnerships
       WHERE (user_a_id = ? OR user_b_id = ?) AND status = 'active'`,
      [userId, userId]
    );

    const partnershipId = partnership ? partnership.id : null;

    // Insert study log
    const insertResult = await run(
      `INSERT INTO daily_tracker_logs 
       (user_id, partnership_id, date, activity_type, portion_covered, pages_count, ayahs_count, duration_minutes, notes, completed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        userId,
        partnershipId,
        date,
        activity_type,
        portion_covered.trim(),
        Number(pages_count) || 0,
        Number(ayahs_count) || 0,
        Number(duration_minutes) || 0,
        notes.trim(),
      ]
    );

    // If partnered and log is for today, sync with partnership checkins
    if (partnershipId) {
      const existingCheckin = await get(
        `SELECT id FROM checkins WHERE partnership_id = ? AND user_id = ? AND date = ?`,
        [partnershipId, userId, date]
      );

      const checkinNote = portion_covered.trim()
        ? `Completed ${activity_type.toUpperCase()}: ${portion_covered.trim()}`
        : `Completed daily study (${duration_minutes}m)`;

      if (existingCheckin) {
        await run(
          `UPDATE checkins SET completed = 1, notes = ? WHERE id = ?`,
          [notes.trim() || checkinNote, existingCheckin.id]
        );
      } else {
        await run(
          `INSERT INTO checkins (partnership_id, user_id, date, completed, notes)
           VALUES (?, ?, ?, 1, ?)`,
          [partnershipId, userId, date, notes.trim() || checkinNote]
        );
      }
    }

    const createdLog = await get(
      `SELECT * FROM daily_tracker_logs WHERE id = ?`,
      [insertResult.lastInsertRowid]
    );

    const streak = await calculateUserStreak(userId);

    return res.status(201).json({
      message: 'Study session logged successfully!',
      log: createdLog,
      streak,
    });
  } catch (err) {
    console.error('Error creating tracker log:', err);
    return res.status(500).json({ error: 'Failed to record study session' });
  }
}

export async function deleteTrackerLog(req, res) {
  try {
    const userId = req.user.id;
    const logId = req.params.id;

    const log = await get(
      `SELECT * FROM daily_tracker_logs WHERE id = ? AND user_id = ?`,
      [logId, userId]
    );

    if (!log) {
      return res.status(404).json({ error: 'Log entry not found' });
    }

    await run(`DELETE FROM daily_tracker_logs WHERE id = ?`, [logId]);

    return res.json({ message: 'Log deleted successfully' });
  } catch (err) {
    console.error('Error deleting tracker log:', err);
    return res.status(500).json({ error: 'Failed to delete log entry' });
  }
}

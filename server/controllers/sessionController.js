// Peer Quran Study Session Scheduling Controller
import { query, get, run } from '../database/database.js';

export async function getSessions(req, res) {
  try {
    const userId = req.user.id;

    // Fetch all sessions where user is either creator or partner
    const rows = await query(
      `SELECT 
        s.id,
        s.partnership_id,
        s.creator_id,
        s.partner_id,
        s.title,
        s.session_date,
        s.start_time,
        s.duration_minutes,
        s.agenda,
        s.session_type,
        s.meeting_link,
        s.status,
        s.created_at,
        c.name as creator_name,
        c.avatar_color as creator_avatar,
        p.name as partner_name,
        p.avatar_color as partner_avatar
      FROM study_sessions s
      LEFT JOIN users c ON s.creator_id = c.id
      LEFT JOIN users p ON s.partner_id = p.id
      WHERE s.creator_id = ? OR s.partner_id = ?
      ORDER BY s.session_date ASC, s.start_time ASC`,
      [userId, userId]
    );

    const todayStr = new Date().toISOString().split('T')[0];

    const upcoming = [];
    const past = [];

    for (const session of rows) {
      const isPastDate = session.session_date < todayStr;
      const isCompleted = session.status === 'completed';
      const isCancelled = session.status === 'cancelled';

      const enriched = {
        ...session,
        isCreator: session.creator_id === userId,
        otherParticipant: session.creator_id === userId 
          ? { id: session.partner_id, name: session.partner_name, avatar: session.partner_avatar }
          : { id: session.creator_id, name: session.creator_name, avatar: session.creator_avatar }
      };

      if (isCompleted || isCancelled || isPastDate) {
        past.push(enriched);
      } else {
        upcoming.push(enriched);
      }
    }

    return res.json({
      sessions: rows,
      upcoming,
      past: past.reverse() // Most recent past first
    });
  } catch (err) {
    console.error('getSessions error:', err);
    return res.status(500).json({ error: 'Failed to retrieve study sessions' });
  }
}

export async function createSession(req, res) {
  try {
    const creatorId = req.user.id;
    const {
      partnership_id,
      partner_id,
      title,
      session_date,
      start_time,
      duration_minutes = 30,
      agenda = '',
      session_type = 'hifz',
      meeting_link = ''
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Session title is required (e.g. Surah Al-Mulk Revision)' });
    }

    if (!session_date || !session_date.trim()) {
      return res.status(400).json({ error: 'Session date is required (YYYY-MM-DD)' });
    }

    if (!start_time || !start_time.trim()) {
      return res.status(400).json({ error: 'Session start time is required (e.g. 18:30)' });
    }

    // Default meeting link if empty
    const cleanMeetingLink = meeting_link.trim() 
      ? meeting_link.trim() 
      : `https://meet.jit.si/QuranMate-${Date.now().toString(36)}`;

    const insertRes = await run(
      `INSERT INTO study_sessions 
        (partnership_id, creator_id, partner_id, title, session_date, start_time, duration_minutes, agenda, session_type, meeting_link, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')`,
      [
        partnership_id || null,
        creatorId,
        partner_id || null,
        title.trim(),
        session_date.trim(),
        start_time.trim(),
        Number(duration_minutes) || 30,
        agenda.trim(),
        session_type || 'hifz',
        cleanMeetingLink
      ]
    );

    const newSession = await get(
      `SELECT s.*, 
              c.name as creator_name, c.avatar_color as creator_avatar,
              p.name as partner_name, p.avatar_color as partner_avatar
       FROM study_sessions s
       LEFT JOIN users c ON s.creator_id = c.id
       LEFT JOIN users p ON s.partner_id = p.id
       WHERE s.id = ?`,
      [insertRes.lastInsertRowid]
    );

    return res.status(201).json({
      message: 'Study session scheduled successfully!',
      session: newSession
    });
  } catch (err) {
    console.error('createSession error:', err);
    return res.status(500).json({ error: 'Failed to schedule study session' });
  }
}

export async function updateSession(req, res) {
  try {
    const userId = req.user.id;
    const sessionId = parseInt(req.params.id, 10);

    const session = await get(`SELECT * FROM study_sessions WHERE id = ?`, [sessionId]);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Must be participant
    if (session.creator_id !== userId && session.partner_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to modify this session' });
    }

    const { status, title, session_date, start_time, duration_minutes, agenda, meeting_link } = req.body;

    const newStatus = status || session.status;
    const newTitle = title ? title.trim() : session.title;
    const newDate = session_date ? session_date.trim() : session.session_date;
    const newTime = start_time ? start_time.trim() : session.start_time;
    const newDuration = duration_minutes !== undefined ? Number(duration_minutes) : session.duration_minutes;
    const newAgenda = agenda !== undefined ? agenda.trim() : session.agenda;
    const newLink = meeting_link !== undefined ? meeting_link.trim() : session.meeting_link;

    await run(
      `UPDATE study_sessions 
       SET status = ?, title = ?, session_date = ?, start_time = ?, duration_minutes = ?, agenda = ?, meeting_link = ?
       WHERE id = ?`,
      [newStatus, newTitle, newDate, newTime, newDuration, newAgenda, newLink, sessionId]
    );

    const updated = await get(
      `SELECT s.*, 
              c.name as creator_name, c.avatar_color as creator_avatar,
              p.name as partner_name, p.avatar_color as partner_avatar
       FROM study_sessions s
       LEFT JOIN users c ON s.creator_id = c.id
       LEFT JOIN users p ON s.partner_id = p.id
       WHERE s.id = ?`,
      [sessionId]
    );

    return res.json({
      message: 'Session updated successfully',
      session: updated
    });
  } catch (err) {
    console.error('updateSession error:', err);
    return res.status(500).json({ error: 'Failed to update study session' });
  }
}

export async function deleteSession(req, res) {
  try {
    const userId = req.user.id;
    const sessionId = parseInt(req.params.id, 10);

    const session = await get(`SELECT * FROM study_sessions WHERE id = ?`, [sessionId]);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.creator_id !== userId && session.partner_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this session' });
    }

    await run(`DELETE FROM study_sessions WHERE id = ?`, [sessionId]);

    return res.json({ message: 'Session removed successfully' });
  } catch (err) {
    console.error('deleteSession error:', err);
    return res.status(500).json({ error: 'Failed to delete session' });
  }
}

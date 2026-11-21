// User & Profile Controller
import { query, get, run } from '../database/database.js';

export async function getUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const { stage, goal, day, search, sameLevelOnly } = req.query;

    // Get current user's stage and memorized portion to personalize matching
    const currentUser = await get(
      'SELECT memorization_stage, memorized_from_surah, memorized_to_surah FROM users WHERE id = ?',
      [currentUserId]
    );
    const userStage = currentUser?.memorization_stage || 'Beginning';

    let sql = `
      SELECT u.id, u.name, u.bio, u.memorization_stage, u.memorized_from_surah, u.memorized_to_surah, u.goal, u.avatar_color, u.created_at,
             (CASE WHEN u.memorization_stage = ? THEN 1 ELSE 0 END) as is_same_level
      FROM users u
      WHERE u.id != ?
    `;
    const params = [userStage, currentUserId];

    if (sameLevelOnly === 'true') {
      sql += ` AND u.memorization_stage = ?`;
      params.push(userStage);
    } else if (stage && stage !== 'all') {
      sql += ` AND u.memorization_stage = ?`;
      params.push(stage);
    }

    if (goal && goal !== 'all') {
      sql += ` AND u.goal = ?`;
      params.push(goal);
    }

    if (search && search.trim()) {
      sql += ` AND (u.name LIKE ? OR u.bio LIKE ?)`;
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    // Always rank same-level learners at the very top, followed by newest
    sql += ` ORDER BY is_same_level DESC, u.created_at DESC`;

    const learners = await query(sql, params);

    if (learners.length === 0) {
      return res.json({ learners: [] });
    }

    // Batch fetch availability, active partnerships, and pending requests (eliminates N+1 queries)
    const [allAvail, myPartnerships, mySentReqs, myReceivedReqs] = await Promise.all([
      query('SELECT user_id, day, start_time, end_time FROM availability ORDER BY id ASC'),
      query(
        `SELECT id, user_a_id, user_b_id FROM partnerships
         WHERE (user_a_id = ? OR user_b_id = ?) AND status = 'active'`,
        [currentUserId, currentUserId]
      ),
      query(
        `SELECT id, receiver_id FROM partner_requests
         WHERE sender_id = ? AND status = 'pending'`,
        [currentUserId]
      ),
      query(
        `SELECT id, sender_id FROM partner_requests
         WHERE receiver_id = ? AND status = 'pending'`,
        [currentUserId]
      )
    ]);

    const availMap = new Map();
    for (const a of allAvail) {
      if (!availMap.has(a.user_id)) availMap.set(a.user_id, []);
      availMap.get(a.user_id).push({ day: a.day, start_time: a.start_time, end_time: a.end_time });
    }

    const partnerSet = new Set();
    for (const p of myPartnerships) {
      partnerSet.add(p.user_a_id === currentUserId ? p.user_b_id : p.user_a_id);
    }

    const sentReqMap = new Map();
    for (const r of mySentReqs) {
      sentReqMap.set(r.receiver_id, r.id);
    }

    const receivedReqMap = new Map();
    for (const r of myReceivedReqs) {
      receivedReqMap.set(r.sender_id, r.id);
    }

    const enriched = learners.map((learner) => {
      const availList = availMap.get(learner.id) || [];
      const sentId = sentReqMap.get(learner.id);
      const receivedId = receivedReqMap.get(learner.id);

      return {
        ...learner,
        sameLevelMatch: learner.memorization_stage === userStage,
        currentUserStage: userStage,
        availability: availList,
        isPartner: partnerSet.has(learner.id),
        hasSentPendingRequest: !!sentId,
        hasReceivedPendingRequest: !!receivedId,
        pendingRequestId: sentId || receivedId || null
      };
    });

    // Filter by day if requested
    let filtered = enriched;
    if (day && day !== 'all') {
      const targetDay = day.toLowerCase();
      filtered = enriched.filter((learner) =>
        learner.availability.some((a) => a.day.toLowerCase() === targetDay)
      );
    }

    return res.json({ learners: filtered });
  } catch (err) {
    console.error('getUsers error:', err);
    return res.status(500).json({ error: 'Failed to retrieve learners' });
  }
}

export async function getUserById(req, res) {
  try {
    const currentUserId = req.user.id;
    const targetUserId = parseInt(req.params.id, 10);

    const learner = await get(
      `SELECT id, name, bio, memorization_stage, memorized_from_surah, memorized_to_surah, goal, avatar_color, created_at
       FROM users WHERE id = ?`,
      [targetUserId]
    );

    if (!learner) {
      return res.status(404).json({ error: 'Learner profile not found' });
    }

    const availability = await query(
      'SELECT id, day, start_time, end_time FROM availability WHERE user_id = ? ORDER BY id ASC',
      [targetUserId]
    );

    const partnership = await get(
      `SELECT id, status FROM partnerships
       WHERE ((user_a_id = ? AND user_b_id = ?) OR (user_a_id = ? AND user_b_id = ?))
         AND status = 'active'`,
      [currentUserId, targetUserId, targetUserId, currentUserId]
    );

    const pendingRequest = await get(
      `SELECT id, sender_id, receiver_id, status FROM partner_requests
       WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
         AND status = 'pending'`,
      [currentUserId, targetUserId, targetUserId, currentUserId]
    );

    return res.json({
      learner: {
        ...learner,
        availability,
        isPartner: !!partnership,
        isCurrentUser: currentUserId === targetUserId,
        requestStatus: pendingRequest
          ? (pendingRequest.sender_id === currentUserId ? 'sent' : 'received')
          : null,
        pendingRequestId: pendingRequest ? pendingRequest.id : null
      }
    });
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ error: 'Failed to retrieve learner details' });
  }
}

export async function updateMe(req, res) {
  try {
    const currentUserId = req.user.id;
    const existing = await get('SELECT * FROM users WHERE id = ?', [currentUserId]);
    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, bio, memorization_stage, memorized_from_surah, memorized_to_surah, goal, avatar_color } = req.body;

    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const finalName = name !== undefined ? String(name).trim() : existing.name;
    const finalBio = bio !== undefined ? bio : existing.bio;
    const finalStage = memorization_stage !== undefined ? memorization_stage : existing.memorization_stage;
    const fromSurah = memorized_from_surah !== undefined ? (Number(memorized_from_surah) || 1) : (existing.memorized_from_surah || 1);
    const toSurah = memorized_to_surah !== undefined ? (Number(memorized_to_surah) || 114) : (existing.memorized_to_surah || 114);
    const finalGoal = goal !== undefined ? goal : existing.goal;
    const finalColor = avatar_color !== undefined ? avatar_color : (existing.avatar_color || '#047857');

    await run(
      `UPDATE users
       SET name = ?, bio = ?, memorization_stage = ?, memorized_from_surah = ?, memorized_to_surah = ?, goal = ?, avatar_color = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [finalName, finalBio, finalStage, fromSurah, toSurah, finalGoal, finalColor, currentUserId]
    );

    const updated = await get(
      `SELECT id, name, email, bio, memorization_stage, memorized_from_surah, memorized_to_surah, goal, avatar_color, created_at
       FROM users WHERE id = ?`,
      [currentUserId]
    );

    return res.json({ message: 'Profile updated successfully', user: updated });
  } catch (err) {
    console.error('updateMe error:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}

export async function getAvailability(req, res) {
  try {
    const currentUserId = req.user.id;
    const list = await query(
      'SELECT id, day, start_time, end_time FROM availability WHERE user_id = ? ORDER BY id ASC',
      [currentUserId]
    );
    return res.json({ availability: list });
  } catch (err) {
    console.error('getAvailability error:', err);
    return res.status(500).json({ error: 'Failed to load availability' });
  }
}

export async function updateAvailability(req, res) {
  try {
    const currentUserId = req.user.id;
    const { slots } = req.body; // array of { day, start_time, end_time }

    if (!Array.isArray(slots)) {
      return res.status(400).json({ error: 'Slots must be an array' });
    }

    // Replace current user slots
    await run('DELETE FROM availability WHERE user_id = ?', [currentUserId]);

    for (const slot of slots) {
      if (slot.day && slot.start_time && slot.end_time) {
        await run(
          `INSERT INTO availability (user_id, day, start_time, end_time)
           VALUES (?, ?, ?, ?)`,
          [currentUserId, slot.day, slot.start_time, slot.end_time]
        );
      }
    }

    const updated = await query(
      'SELECT id, day, start_time, end_time FROM availability WHERE user_id = ? ORDER BY id ASC',
      [currentUserId]
    );

    return res.json({ message: 'Availability updated', availability: updated });
  } catch (err) {
    console.error('updateAvailability error:', err);
    return res.status(500).json({ error: 'Failed to update availability' });
  }
}

// Bookmarks Controller
export async function getBookmarks(req, res) {
  try {
    const currentUserId = req.user.id;
    const bookmarks = await query(
      `SELECT id, surah_number, ayah_number, surah_name, surah_english_name,
              arabic_text, translation_text, note, created_at
       FROM verse_bookmarks WHERE user_id = ? ORDER BY id DESC`,
      [currentUserId]
    );
    return res.json({ bookmarks });
  } catch (err) {
    console.error('getBookmarks error:', err);
    return res.status(500).json({ error: 'Failed to retrieve bookmarks' });
  }
}

export async function addBookmark(req, res) {
  try {
    const currentUserId = req.user.id;
    const { surah_number, ayah_number, surah_name, surah_english_name, arabic_text, translation_text, note } = req.body;

    if (!surah_number || !ayah_number) {
      return res.status(400).json({ error: 'Surah and Ayah numbers are required' });
    }

    await run(
      `INSERT OR REPLACE INTO verse_bookmarks
       (user_id, surah_number, ayah_number, surah_name, surah_english_name, arabic_text, translation_text, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [currentUserId, surah_number, ayah_number, surah_name || '', surah_english_name || '', arabic_text || '', translation_text || '', note || '']
    );

    return res.status(201).json({ message: 'Ayah bookmarked for revision' });
  } catch (err) {
    console.error('addBookmark error:', err);
    return res.status(500).json({ error: 'Failed to save bookmark' });
  }
}

export async function deleteBookmark(req, res) {
  try {
    const currentUserId = req.user.id;
    const bookmarkId = req.params.id;
    await run('DELETE FROM verse_bookmarks WHERE id = ? AND user_id = ?', [bookmarkId, currentUserId]);
    return res.json({ message: 'Bookmark removed' });
  } catch (err) {
    console.error('deleteBookmark error:', err);
    return res.status(500).json({ error: 'Failed to delete bookmark' });
  }
}

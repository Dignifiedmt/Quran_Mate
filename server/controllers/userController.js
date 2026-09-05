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

    // Fetch availability and request/partnership status for each learner
    const enriched = await Promise.all(
      learners.map(async (learner) => {
        const availList = await query(
          'SELECT day, start_time, end_time FROM availability WHERE user_id = ?',
          [learner.id]
        );

        // Check if there is an active partnership
        const partnership = await get(
          `SELECT id FROM partnerships
           WHERE ((user_a_id = ? AND user_b_id = ?) OR (user_a_id = ? AND user_b_id = ?))
             AND status = 'active'`,
          [currentUserId, learner.id, learner.id, currentUserId]
        );

        // Check pending requests
        const sentRequest = await get(
          `SELECT id, status FROM partner_requests
           WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'`,
          [currentUserId, learner.id]
        );

        const receivedRequest = await get(
          `SELECT id, status FROM partner_requests
           WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'`,
          [learner.id, currentUserId]
        );

        const isSameLevel = learner.memorization_stage === userStage;

        return {
          ...learner,
          sameLevelMatch: isSameLevel,
          currentUserStage: userStage,
          availability: availList,
          isPartner: !!partnership,
          hasSentPendingRequest: !!sentRequest,
          hasReceivedPendingRequest: !!receivedRequest,
          pendingRequestId: sentRequest ? sentRequest.id : (receivedRequest ? receivedRequest.id : null)
        };
      })
    );

    // Filter by day if requested
    let filtered = enriched;
    if (day && day !== 'all') {
      filtered = enriched.filter((learner) =>
        learner.availability.some((a) => a.day.toLowerCase() === day.toLowerCase())
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
    const { name, bio, memorization_stage, memorized_from_surah, memorized_to_surah, goal, avatar_color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const fromSurah = Number(memorized_from_surah) || 1;
    const toSurah = Number(memorized_to_surah) || 114;

    await run(
      `UPDATE users
       SET name = ?, bio = ?, memorization_stage = ?, memorized_from_surah = ?, memorized_to_surah = ?, goal = ?, avatar_color = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name.trim(), bio || '', memorization_stage || 'Beginning', fromSurah, toSurah, goal || 'Memorize consistently', avatar_color || '#047857', currentUserId]
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

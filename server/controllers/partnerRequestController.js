// Partner Request Controller
import { query, get, run } from '../database/database.js';

export async function sendPartnerRequest(req, res) {
  try {
    const senderId = req.user.id;
    const { receiver_id, note } = req.body;

    if (!receiver_id) {
      return res.status(400).json({ error: 'Receiver ID is required' });
    }

    const receiverId = parseInt(receiver_id, 10);

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'You cannot send a partner request to yourself' });
    }

    // Verify receiver exists
    const receiver = await get('SELECT id, name FROM users WHERE id = ?', [receiverId]);
    if (!receiver) {
      return res.status(404).json({ error: 'Learner profile not found' });
    }

    // Check if sender already has an active partnership
    const senderActive = await get(
      `SELECT id FROM partnerships WHERE (user_a_id = ? OR user_b_id = ?) AND status = 'active'`,
      [senderId, senderId]
    );
    if (senderActive) {
      return res.status(400).json({
        error: 'You already have an active Quran Mate partnership. Please end your current partnership before pairing with a new mate.'
      });
    }

    // Check if receiver already has an active partnership
    const receiverActive = await get(
      `SELECT id FROM partnerships WHERE (user_a_id = ? OR user_b_id = ?) AND status = 'active'`,
      [receiverId, receiverId]
    );
    if (receiverActive) {
      return res.status(400).json({
        error: `${receiver.name} is currently paired with an active Quran Mate.`
      });
    }

    // Check if a pending request already exists in either direction
    const existing = await get(
      `SELECT id, status, sender_id FROM partner_requests
       WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
         AND status = 'pending'`,
      [senderId, receiverId, receiverId, senderId]
    );

    if (existing) {
      if (existing.sender_id === senderId) {
        return res.status(400).json({ error: 'You have already sent a pending request to this learner.' });
      } else {
        return res.status(400).json({ error: 'This learner has already sent you a request. Please check your Received tab to accept!' });
      }
    }

    const result = await run(
      `INSERT INTO partner_requests (sender_id, receiver_id, status, note)
       VALUES (?, ?, 'pending', ?)`,
      [senderId, receiverId, note || '']
    );

    return res.status(201).json({
      message: 'Partner request sent successfully',
      requestId: result.lastInsertRowid
    });
  } catch (err) {
    console.error('sendPartnerRequest error:', err);
    return res.status(500).json({ error: 'Failed to send partner request' });
  }
}

export async function getReceivedRequests(req, res) {
  try {
    const currentUserId = req.user.id;
    const requests = await query(
      `SELECT r.id, r.sender_id, r.receiver_id, r.status, r.note, r.created_at,
              u.name as sender_name, u.bio as sender_bio, u.memorization_stage as sender_stage,
              u.goal as sender_goal, u.avatar_color as sender_avatar
       FROM partner_requests r
       JOIN users u ON r.sender_id = u.id
       WHERE r.receiver_id = ?
       ORDER BY r.created_at DESC`,
      [currentUserId]
    );

    // Enrich with sender availability
    const enriched = await Promise.all(
      requests.map(async (reqItem) => {
        const avail = await query(
          'SELECT day, start_time, end_time FROM availability WHERE user_id = ?',
          [reqItem.sender_id]
        );
        return { ...reqItem, sender_availability: avail };
      })
    );

    return res.json({ requests: enriched });
  } catch (err) {
    console.error('getReceivedRequests error:', err);
    return res.status(500).json({ error: 'Failed to load received requests' });
  }
}

export async function getSentRequests(req, res) {
  try {
    const currentUserId = req.user.id;
    const requests = await query(
      `SELECT r.id, r.sender_id, r.receiver_id, r.status, r.note, r.created_at,
              u.name as receiver_name, u.bio as receiver_bio, u.memorization_stage as receiver_stage,
              u.goal as receiver_goal, u.avatar_color as receiver_avatar
       FROM partner_requests r
       JOIN users u ON r.receiver_id = u.id
       WHERE r.sender_id = ?
       ORDER BY r.created_at DESC`,
      [currentUserId]
    );

    return res.json({ requests });
  } catch (err) {
    console.error('getSentRequests error:', err);
    return res.status(500).json({ error: 'Failed to load sent requests' });
  }
}

export async function acceptRequest(req, res) {
  try {
    const currentUserId = req.user.id;
    const requestId = parseInt(req.params.id, 10);

    const partnerRequest = await get(
      'SELECT * FROM partner_requests WHERE id = ? AND receiver_id = ? AND status = ?',
      [requestId, currentUserId, 'pending']
    );

    if (!partnerRequest) {
      return res.status(404).json({ error: 'Pending request not found or unauthorized' });
    }

    // Check if either is already partnered
    const senderActive = await get(
      `SELECT id FROM partnerships WHERE (user_a_id = ? OR user_b_id = ?) AND status = 'active'`,
      [partnerRequest.sender_id, partnerRequest.sender_id]
    );
    const receiverActive = await get(
      `SELECT id FROM partnerships WHERE (user_a_id = ? OR user_b_id = ?) AND status = 'active'`,
      [currentUserId, currentUserId]
    );

    if (senderActive || receiverActive) {
      return res.status(400).json({ error: 'Cannot accept request because one of the users already has an active Quran Mate' });
    }

    // Update request status to accepted
    await run(
      `UPDATE partner_requests SET status = 'accepted', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [requestId]
    );

    // Create active 1:1 partnership
    const partnershipResult = await run(
      `INSERT INTO partnerships (user_a_id, user_b_id, status)
       VALUES (?, ?, 'active')`,
      [partnerRequest.sender_id, currentUserId]
    );

    const partnershipId = partnershipResult.lastInsertRowid;

    // Send an automated greeting message to establish the thread
    await run(
      `INSERT INTO messages (partnership_id, sender_id, text)
       VALUES (?, ?, 'Assalamu alaikum! 🌙 Alhamdulillah, we are now Quran Mates! Looking forward to memorizing and revising together.')`,
      [partnershipId, currentUserId]
    );

    // Automatically decline other pending requests involving either partner to prevent multiple simultaneous partners
    await run(
      `UPDATE partner_requests
       SET status = 'declined', updated_at = CURRENT_TIMESTAMP
       WHERE status = 'pending' AND (sender_id = ? OR receiver_id = ? OR sender_id = ? OR receiver_id = ?)`,
      [currentUserId, currentUserId, partnerRequest.sender_id, partnerRequest.sender_id]
    );

    return res.json({
      message: 'Partner request accepted! Your partnership is now active.',
      partnershipId
    });
  } catch (err) {
    console.error('acceptRequest error:', err);
    return res.status(500).json({ error: 'Failed to accept partner request' });
  }
}

export async function declineRequest(req, res) {
  try {
    const currentUserId = req.user.id;
    const requestId = parseInt(req.params.id, 10);

    const partnerRequest = await get(
      'SELECT id FROM partner_requests WHERE id = ? AND receiver_id = ? AND status = ?',
      [requestId, currentUserId, 'pending']
    );

    if (!partnerRequest) {
      return res.status(404).json({ error: 'Pending request not found' });
    }

    await run(
      `UPDATE partner_requests SET status = 'declined', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [requestId]
    );

    return res.json({ message: 'Request declined' });
  } catch (err) {
    console.error('declineRequest error:', err);
    return res.status(500).json({ error: 'Failed to decline request' });
  }
}

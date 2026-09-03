// Message Controller for Partnership Coordination
import { query, get, run } from '../database/database.js';

export async function getMessages(req, res) {
  try {
    const currentUserId = req.user.id;
    const partnershipId = parseInt(req.params.id, 10);

    // Verify caller belongs to this partnership
    const partnership = await get(
      `SELECT id, user_a_id, user_b_id FROM partnerships
       WHERE id = ? AND (user_a_id = ? OR user_b_id = ?)`,
      [partnershipId, currentUserId, currentUserId]
    );

    if (!partnership) {
      return res.status(403).json({ error: 'Access denied: not a partner in this conversation' });
    }

    const messages = await query(
      `SELECT m.id, m.partnership_id, m.sender_id, m.text, m.created_at,
              u.name as sender_name, u.avatar_color as sender_avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.partnership_id = ?
       ORDER BY m.created_at ASC`,
      [partnershipId]
    );

    return res.json({ messages });
  } catch (err) {
    console.error('getMessages error:', err);
    return res.status(500).json({ error: 'Failed to retrieve messages' });
  }
}

export async function sendMessage(req, res) {
  try {
    const currentUserId = req.user.id;
    const partnershipId = parseInt(req.params.id, 10);
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text cannot be empty' });
    }

    // Verify caller belongs to this partnership
    const partnership = await get(
      `SELECT id FROM partnerships
       WHERE id = ? AND (user_a_id = ? OR user_b_id = ?) AND status = 'active'`,
      [partnershipId, currentUserId, currentUserId]
    );

    if (!partnership) {
      return res.status(403).json({ error: 'Access denied: active partnership required to send messages' });
    }

    const result = await run(
      `INSERT INTO messages (partnership_id, sender_id, text)
       VALUES (?, ?, ?)`,
      [partnershipId, currentUserId, text.trim()]
    );

    const sender = await get('SELECT name, avatar_color FROM users WHERE id = ?', [currentUserId]);

    const newMessage = {
      id: result.lastInsertRowid,
      partnership_id: partnershipId,
      sender_id: currentUserId,
      sender_name: sender.name,
      sender_avatar: sender.avatar_color,
      text: text.trim(),
      created_at: new Date().toISOString()
    };

    return res.status(201).json({ message: 'Message sent', data: newMessage });
  } catch (err) {
    console.error('sendMessage error:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}

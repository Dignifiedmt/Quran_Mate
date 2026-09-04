// Qur'an Study Circles & Collaborative Halaqahs Controller
import { query, get, run, exec } from '../database/database.js';

// Ensure tables exist on invocation
async function ensureTables() {
  await exec(`
    CREATE TABLE IF NOT EXISTS study_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT 'Memorization',
      target_goal TEXT DEFAULT 'Complete collective Quran Khatmah',
      creator_id INTEGER NOT NULL,
      meeting_schedule TEXT DEFAULT 'Weekly on Fridays at 07:00 AM UTC',
      meeting_link TEXT DEFAULT '',
      max_members INTEGER DEFAULT 30,
      avatar_theme TEXT DEFAULT 'emerald',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS group_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(group_id, user_id),
      FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS group_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      ayah_ref TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS group_khatmah (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      juz_number INTEGER NOT NULL CHECK(juz_number BETWEEN 1 AND 30),
      user_id INTEGER,
      status TEXT DEFAULT 'available',
      notes TEXT DEFAULT '',
      completed_at DATETIME,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(group_id, juz_number),
      FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);
}

// Seed initial study groups if empty
async function seedDefaultGroupsIfEmpty() {
  await ensureTables();
  const existing = await query('SELECT count(*) as count FROM study_groups');
  if (existing[0] && existing[0].count > 0) return;

  const firstUser = await get('SELECT id FROM users ORDER BY id ASC LIMIT 1');
  const creatorId = firstUser ? firstUser.id : 1;

  const sampleGroups = [
    {
      name: 'Surah Al-Kahf Friday Recitation Circle',
      description: 'Weekly collaborative halaqah reciting and reflecting on Surah Al-Kahf every Friday before Jummah. Reciters take turns with tartil and share ayah lessons.',
      category: 'Surah Al-Kahf',
      target_goal: 'Recite all 110 verses of Surah Al-Kahf with tartil every Friday',
      meeting_schedule: 'Every Friday at 08:30 AM UTC',
      avatar_theme: 'emerald',
      max_members: 25
    },
    {
      name: 'Juz 30 (Amma) Memorization & Tajweed Halaqah',
      description: 'Supportive sisterhood circle dedicated to memorizing, polishing tajweed, and testing mutashabihat in Juz Amma (Surah An-Naba to An-Nas).',
      category: 'Juz Amma',
      target_goal: 'Master Juz 30 with correct makharij and flawless retention',
      meeting_schedule: 'Tuesdays & Thursdays at 19:00 UTC',
      avatar_theme: 'amber',
      max_members: 20
    },
    {
      name: 'Dawn (Fajr) Muraja\'ah & Revision Sisterhood',
      description: 'Early morning 25-minute quiet revision circle right after Fajr prayer. Start the barakah of your day by reciting your revision portion to a fellow seeker.',
      category: 'Murajaah',
      target_goal: 'Revise 1/2 Juz daily after Fajr prayer consistently',
      meeting_schedule: 'Daily at 05:30 AM UTC',
      avatar_theme: 'teal',
      max_members: 30
    },
    {
      name: 'Monthly 30-Juz Collective Khatmah Circle',
      description: 'Collaborative group where members claim 1 or 2 Juz each month to complete a full communal Qur\'an Khatmah with shared du\'a khatm al-Qur\'an.',
      category: 'Khatmah',
      target_goal: 'Complete 30/30 Juz Khatmah every Hijri month',
      meeting_schedule: 'Last Saturday of every month at 16:00 UTC',
      avatar_theme: 'indigo',
      max_members: 35
    }
  ];

  // Get other demo users to populate members
  const allUsers = await query('SELECT id FROM users LIMIT 6');

  for (const g of sampleGroups) {
    const res = await run(
      `INSERT INTO study_groups (name, description, category, target_goal, creator_id, meeting_schedule, meeting_link, max_members, avatar_theme)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        g.name,
        g.description,
        g.category,
        g.target_goal,
        creatorId,
        g.meeting_schedule,
        `https://meet.jit.si/QuranMate-Halaqah-${encodeURIComponent(g.category.replace(/\s+/g, '-'))}`,
        g.max_members,
        g.avatar_theme
      ]
    );

    const groupId = res.lastInsertRowid;

    // Initialize 30 Juz entries in group_khatmah
    for (let j = 1; j <= 30; j++) {
      // Pre-claim a few juz for realistic community feel
      let status = 'available';
      let claimerId = null;
      let completedAt = null;

      if (allUsers.length > 0 && (j === 1 || j === 2 || j === 18 || j === 29 || j === 30)) {
        const u = allUsers[(j + groupId) % allUsers.length];
        claimerId = u.id;
        status = j === 1 || j === 18 ? 'completed' : 'claimed';
        completedAt = status === 'completed' ? new Date().toISOString() : null;
      }

      await run(
        `INSERT INTO group_khatmah (group_id, juz_number, user_id, status, completed_at)
         VALUES (?, ?, ?, ?, ?)`,
        [groupId, j, claimerId, status, completedAt]
      );
    }

    // Add members
    for (const u of allUsers) {
      await run(
        `INSERT OR IGNORE INTO group_members (group_id, user_id, role)
         VALUES (?, ?, ?)`,
        [groupId, u.id, u.id === creatorId ? 'admin' : 'member']
      );
    }

    // Add sample encouragement discussion messages
    await run(
      `INSERT INTO group_messages (group_id, user_id, text, ayah_ref, created_at)
       VALUES (?, ?, ?, ?, datetime('now', '-2 hours'))`,
      [
        groupId,
        allUsers[0]?.id || creatorId,
        'As-salamu alaykum wa rahmatullah dear sisters! Welcome to our halaqah. Please claim your Juz for this week.',
        'Al-Baqarah 2:185'
      ]
    );

    if (allUsers.length > 1) {
      await run(
        `INSERT INTO group_messages (group_id, user_id, text, ayah_ref, created_at)
         VALUES (?, ?, ?, ?, datetime('now', '-45 minutes'))`,
        [
          groupId,
          allUsers[1].id,
          'Wa alaykum as-salam! I have claimed Juz 1 and completed my recitation today. May Allah accept our efforts!',
          'Fatir 35:29'
        ]
      );
    }
  }
}

// 1. GET /api/groups - List all available study circles & rooms
export async function getGroups(req, res) {
  try {
    await seedDefaultGroupsIfEmpty();
    const userId = req.user?.id;
    const { category, search } = req.query;

    let sql = `
      SELECT 
        g.*,
        u.name as creator_name,
        u.avatar_color as creator_avatar,
        (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as members_count,
        (SELECT COUNT(*) FROM group_khatmah WHERE group_id = g.id AND status = 'completed') as completed_juz_count,
        (SELECT COUNT(*) FROM group_khatmah WHERE group_id = g.id AND status = 'claimed') as claimed_juz_count,
        (SELECT COUNT(*) FROM group_members WHERE group_id = g.id AND user_id = ?) as is_member
      FROM study_groups g
      LEFT JOIN users u ON g.creator_id = u.id
      WHERE 1=1
    `;
    const params = [userId || 0];

    if (category && category !== 'All') {
      sql += ` AND g.category = ?`;
      params.push(category);
    }

    if (search && search.trim()) {
      sql += ` AND (g.name LIKE ? OR g.description LIKE ? OR g.target_goal LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY g.created_at DESC`;

    const groups = await query(sql, params);

    const formatted = groups.map((g) => ({
      ...g,
      is_member: Boolean(g.is_member),
      completed_percentage: Math.round(((g.completed_juz_count || 0) / 30) * 100)
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching study groups:', err);
    res.status(500).json({ error: 'Failed to retrieve study groups' });
  }
}

// 2. GET /api/groups/:id - Get detailed study group room with members, khatmah board, & discussion
export async function getGroupById(req, res) {
  try {
    await seedDefaultGroupsIfEmpty();
    const groupId = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    const group = await get(
      `SELECT 
        g.*,
        u.name as creator_name,
        u.avatar_color as creator_avatar,
        (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as members_count,
        (SELECT COUNT(*) FROM group_khatmah WHERE group_id = g.id AND status = 'completed') as completed_juz_count,
        (SELECT COUNT(*) FROM group_members WHERE group_id = g.id AND user_id = ?) as is_member
      FROM study_groups g
      LEFT JOIN users u ON g.creator_id = u.id
      WHERE g.id = ?`,
      [userId || 0, groupId]
    );

    if (!group) {
      return res.status(404).json({ error: 'Study circle room not found' });
    }

    // Fetch members
    const members = await query(
      `SELECT 
        gm.role,
        gm.joined_at,
        u.id as user_id,
        u.name,
        u.email,
        u.avatar_color,
        u.memorization_stage,
        u.goal
      FROM group_members gm
      JOIN users u ON gm.user_id = u.id
      WHERE gm.group_id = ?
      ORDER BY gm.role DESC, gm.joined_at ASC`,
      [groupId]
    );

    // Fetch 30 Juz Khatmah board
    const khatmahRows = await query(
      `SELECT 
        k.juz_number,
        k.status,
        k.notes,
        k.completed_at,
        u.id as user_id,
        u.name as user_name,
        u.avatar_color as user_avatar
      FROM group_khatmah k
      LEFT JOIN users u ON k.user_id = u.id
      WHERE k.group_id = ?
      ORDER BY k.juz_number ASC`,
      [groupId]
    );

    // Fetch group discussion messages
    const messages = await query(
      `SELECT 
        m.id,
        m.text,
        m.ayah_ref,
        m.created_at,
        u.id as user_id,
        u.name as user_name,
        u.avatar_color as user_avatar,
        u.memorization_stage as user_stage
      FROM group_messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.group_id = ?
      ORDER BY m.created_at ASC
      LIMIT 80`,
      [groupId]
    );

    const completedCount = khatmahRows.filter((k) => k.status === 'completed').length;
    const claimedCount = khatmahRows.filter((k) => k.status === 'claimed').length;

    res.json({
      ...group,
      is_member: Boolean(group.is_member),
      meeting_link: group.meeting_link || `https://meet.jit.si/QuranMate-Halaqah-${group.id}`,
      completed_juz_count: completedCount,
      claimed_juz_count: claimedCount,
      completed_percentage: Math.round((completedCount / 30) * 100),
      members,
      khatmah: khatmahRows,
      messages
    });
  } catch (err) {
    console.error('Error fetching group detail:', err);
    res.status(500).json({ error: 'Failed to retrieve study circle details' });
  }
}

// 3. POST /api/groups - Create a new study circle / collaborative room
export async function createGroup(req, res) {
  try {
    await ensureTables();
    const userId = req.user.id;
    const {
      name,
      description = '',
      category = 'Memorization',
      target_goal = 'Complete collective Quran Khatmah',
      meeting_schedule = 'Weekly on Fridays at 07:00 AM UTC',
      max_members = 30,
      avatar_theme = 'emerald'
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Please provide a name for your study circle' });
    }

    const cleanName = name.trim();
    const safeRoomSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    const generatedMeetingLink = `https://meet.jit.si/QuranMate-Halaqah-${safeRoomSlug}-${Date.now().toString().slice(-4)}`;

    const result = await run(
      `INSERT INTO study_groups (name, description, category, target_goal, creator_id, meeting_schedule, meeting_link, max_members, avatar_theme)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanName,
        description.trim(),
        category,
        target_goal.trim(),
        userId,
        meeting_schedule.trim(),
        generatedMeetingLink,
        parseInt(max_members, 10) || 30,
        avatar_theme
      ]
    );

    const groupId = result.lastInsertRowid;

    // Add creator as admin member
    await run(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES (?, ?, 'admin')`,
      [groupId, userId]
    );

    // Initialize 30 Juz slots for group Khatmah
    for (let j = 1; j <= 30; j++) {
      await run(
        `INSERT INTO group_khatmah (group_id, juz_number, status)
         VALUES (?, ?, 'available')`,
        [groupId, j]
      );
    }

    // Add welcome initial message
    await run(
      `INSERT INTO group_messages (group_id, user_id, text, ayah_ref)
       VALUES (?, ?, ?, ?)`,
      [
        groupId,
        userId,
        `As-salamu alaykum wa rahmatullah! Welcome to ${cleanName}. May Allah grant us steadfastness and barakah in reciting and studying His Book together.`,
        'Al-Isra 17:82'
      ]
    );

    res.status(201).json({
      id: groupId,
      message: 'Study circle room created successfully'
    });
  } catch (err) {
    console.error('Error creating study group:', err);
    res.status(500).json({ error: 'Failed to create study group' });
  }
}

// 4. POST /api/groups/:id/join - Join a study circle room
export async function joinGroup(req, res) {
  try {
    const groupId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const group = await get('SELECT id, max_members, name FROM study_groups WHERE id = ?', [groupId]);
    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }

    const currentMembersCount = await get(
      'SELECT count(*) as count FROM group_members WHERE group_id = ?',
      [groupId]
    );

    if (currentMembersCount && currentMembersCount.count >= group.max_members) {
      return res.status(400).json({ error: 'This study circle has reached its maximum member capacity' });
    }

    await run(
      `INSERT OR IGNORE INTO group_members (group_id, user_id, role)
       VALUES (?, ?, 'member')`,
      [groupId, userId]
    );

    // Send notification message in group discussion
    const user = await get('SELECT name FROM users WHERE id = ?', [userId]);
    if (user) {
      await run(
        `INSERT INTO group_messages (group_id, user_id, text)
         VALUES (?, ?, ?)`,
        [groupId, userId, `Joined the circle. As-salamu alaykum everyone! Ready to recite together.`]
      );
    }

    res.json({ success: true, message: `Successfully joined ${group.name}` });
  } catch (err) {
    console.error('Error joining group:', err);
    res.status(500).json({ error: 'Failed to join group' });
  }
}

// 5. POST /api/groups/:id/leave - Leave a study circle room
export async function leaveGroup(req, res) {
  try {
    const groupId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    await run('DELETE FROM group_members WHERE group_id = ? AND user_id = ?', [groupId, userId]);

    // Unclaim any pending claimed Juz by this user
    await run(
      `UPDATE group_khatmah 
       SET user_id = NULL, status = 'available', notes = '' 
       WHERE group_id = ? AND user_id = ? AND status = 'claimed'`,
      [groupId, userId]
    );

    res.json({ success: true, message: 'Left study group successfully' });
  } catch (err) {
    console.error('Error leaving group:', err);
    res.status(500).json({ error: 'Failed to leave group' });
  }
}

// 6. POST /api/groups/:id/messages - Post a group reflection or discussion message
export async function postGroupMessage(req, res) {
  try {
    const groupId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { text, ayah_ref = '' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Verify membership
    const membership = await get(
      'SELECT id FROM group_members WHERE group_id = ? AND user_id = ?',
      [groupId, userId]
    );

    if (!membership) {
      return res.status(403).json({ error: 'You must join this study circle before posting' });
    }

    const result = await run(
      `INSERT INTO group_messages (group_id, user_id, text, ayah_ref)
       VALUES (?, ?, ?, ?)`,
      [groupId, userId, text.trim(), ayah_ref.trim()]
    );

    const user = await get('SELECT name, avatar_color, memorization_stage FROM users WHERE id = ?', [userId]);

    res.status(201).json({
      id: result.lastInsertRowid,
      group_id: groupId,
      user_id: userId,
      user_name: user?.name,
      user_avatar: user?.avatar_color,
      user_stage: user?.memorization_stage,
      text: text.trim(),
      ayah_ref: ayah_ref.trim(),
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error posting group message:', err);
    res.status(500).json({ error: 'Failed to post message' });
  }
}

// 7. POST /api/groups/:id/khatmah - Claim, complete, or unclaim a Juz in collaborative Khatmah
export async function updateGroupKhatmah(req, res) {
  try {
    const groupId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { juz_number, action, notes = '' } = req.body;

    const juzNum = parseInt(juz_number, 10);
    if (!juzNum || juzNum < 1 || juzNum > 30) {
      return res.status(400).json({ error: 'Invalid Juz number (must be 1-30)' });
    }

    // Verify membership
    const membership = await get(
      'SELECT id, role FROM group_members WHERE group_id = ? AND user_id = ?',
      [groupId, userId]
    );

    if (!membership) {
      return res.status(403).json({ error: 'You must join this study circle to participate in the Khatmah' });
    }

    const currentSlot = await get(
      'SELECT * FROM group_khatmah WHERE group_id = ? AND juz_number = ?',
      [groupId, juzNum]
    );

    if (!currentSlot) {
      return res.status(404).json({ error: 'Khatmah slot not found' });
    }

    const user = await get('SELECT name FROM users WHERE id = ?', [userId]);

    if (action === 'claim') {
      if (currentSlot.status === 'completed') {
        return res.status(400).json({ error: 'This Juz is already marked completed' });
      }
      if (currentSlot.status === 'claimed' && currentSlot.user_id !== userId) {
        return res.status(400).json({ error: 'This Juz has already been claimed by another sister' });
      }

      await run(
        `UPDATE group_khatmah 
         SET user_id = ?, status = 'claimed', notes = ?, updated_at = CURRENT_TIMESTAMP
         WHERE group_id = ? AND juz_number = ?`,
        [userId, notes, groupId, juzNum]
      );

      // Post notification in chat
      await run(
        `INSERT INTO group_messages (group_id, user_id, text)
         VALUES (?, ?, ?)`,
        [groupId, userId, `Claimed Juz ${juzNum} for recitation. Du'as appreciated!`]
      );
    } else if (action === 'complete') {
      await run(
        `UPDATE group_khatmah 
         SET user_id = ?, status = 'completed', completed_at = CURRENT_TIMESTAMP, notes = ?, updated_at = CURRENT_TIMESTAMP
         WHERE group_id = ? AND juz_number = ?`,
        [userId, notes, groupId, juzNum]
      );

      // Post celebration in chat
      await run(
        `INSERT INTO group_messages (group_id, user_id, text, ayah_ref)
         VALUES (?, ?, ?, ?)`,
        [groupId, userId, `Alhamdulillah, I have completed Juz ${juzNum}! May Allah accept our Khatmah.`, 'Fatir 35:29']
      );
    } else if (action === 'unclaim') {
      if (currentSlot.user_id !== userId && membership.role !== 'admin') {
        return res.status(403).json({ error: 'You can only unclaim your own assigned Juz' });
      }

      await run(
        `UPDATE group_khatmah 
         SET user_id = NULL, status = 'available', completed_at = NULL, notes = '', updated_at = CURRENT_TIMESTAMP
         WHERE group_id = ? AND juz_number = ?`,
        [groupId, juzNum]
      );
    } else if (action === 'reset_khatmah' && membership.role === 'admin') {
      // Admin resets all 30 Juz for a new Khatmah cycle
      await run(
        `UPDATE group_khatmah 
         SET user_id = NULL, status = 'available', completed_at = NULL, notes = '', updated_at = CURRENT_TIMESTAMP
         WHERE group_id = ?`,
        [groupId]
      );

      await run(
        `INSERT INTO group_messages (group_id, user_id, text)
         VALUES (?, ?, ?)`,
        [groupId, userId, `Mabrook! Our previous Khatmah is complete. Starting a brand new collective Khatmah round today! Bismillah.`]
      );
    } else {
      return res.status(400).json({ error: 'Invalid Khatmah action' });
    }

    // Return updated board
    const updatedRows = await query(
      `SELECT 
        k.juz_number,
        k.status,
        k.notes,
        k.completed_at,
        u.id as user_id,
        u.name as user_name,
        u.avatar_color as user_avatar
      FROM group_khatmah k
      LEFT JOIN users u ON k.user_id = u.id
      WHERE k.group_id = ?
      ORDER BY k.juz_number ASC`,
      [groupId]
    );

    const completedCount = updatedRows.filter((k) => k.status === 'completed').length;

    res.json({
      success: true,
      khatmah: updatedRows,
      completed_juz_count: completedCount,
      completed_percentage: Math.round((completedCount / 30) * 100)
    });
  } catch (err) {
    console.error('Error updating group khatmah:', err);
    res.status(500).json({ error: 'Failed to update Khatmah' });
  }
}

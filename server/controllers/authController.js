// Auth Controller
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, get, run } from '../database/database.js';
import { JWT_SECRET } from '../middleware/auth.js';

export async function register(req, res) {
  try {
    const { name, email, password, confirmPassword, memorized_from_surah, memorized_to_surah, memorization_stage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing
    const existing = await get('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Pick a subtle pastel/green avatar color
    const colors = ['#047857', '#0f766e', '#854d0e', '#1e3a8a', '#4338ca', '#065f46', '#701a75', '#15803d'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const fromSurah = Number(memorized_from_surah) || 1;
    const toSurah = Number(memorized_to_surah) || 114;
    const stage = memorization_stage || (fromSurah >= 78 ? 'Juz 30' : (fromSurah >= 67 ? 'Juz 29–30' : 'Beginning'));

    const result = await run(
      `INSERT INTO users (name, email, password_hash, bio, memorization_stage, memorized_from_surah, memorized_to_surah, goal, avatar_color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), cleanEmail, passwordHash, '', stage, fromSurah, toSurah, 'Memorize consistently', avatarColor]
    );

    const user = {
      id: result.lastInsertRowid,
      name: name.trim(),
      email: cleanEmail,
      bio: '',
      memorization_stage: stage,
      memorized_from_surah: fromSurah,
      memorized_to_surah: toSurah,
      goal: 'Memorize consistently',
      avatar_color: avatarColor
    };

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await get('SELECT * FROM users WHERE email = ?', [cleanEmail]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Exclude password_hash
    delete user.password_hash;

    return res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}

export async function demoLogin(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for demo login' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await get('SELECT * FROM users WHERE email = ?', [cleanEmail]);

    if (!user) {
      return res.status(404).json({ error: 'Demo user not found' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    delete user.password_hash;

    return res.json({
      message: 'Demo login successful',
      token,
      user
    });
  } catch (err) {
    console.error('Demo login error:', err);
    return res.status(500).json({ error: 'Demo login failed' });
  }
}

export async function getMe(req, res) {
  try {
    const user = await get(
      `SELECT id, name, email, bio, memorization_stage, memorized_from_surah, memorized_to_surah, goal, avatar_color, created_at
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const availability = await query(
      'SELECT id, day, start_time, end_time FROM availability WHERE user_id = ? ORDER BY id ASC',
      [user.id]
    );

    // Check if user is currently partnered
    const partnership = await get(
      `SELECT p.id, p.status, p.created_at,
              CASE WHEN p.user_a_id = ? THEN p.user_b_id ELSE p.user_a_id END as partner_id
       FROM partnerships p
       WHERE (p.user_a_id = ? OR p.user_b_id = ?) AND p.status = 'active'`,
      [user.id, user.id, user.id]
    );

    return res.json({
      user,
      availability,
      activePartnershipId: partnership ? partnership.id : null,
      partnerId: partnership ? partnership.partner_id : null
    });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
}

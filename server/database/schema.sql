-- Quran Mate 🌙 SQLite Database Schema
PRAGMA foreign_keys = ON;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT DEFAULT '',
  memorization_stage TEXT DEFAULT 'Beginning',
  goal TEXT DEFAULT 'Memorize consistently',
  avatar_color TEXT DEFAULT '#15803d',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Availability Table (Days and preferred time blocks)
CREATE TABLE IF NOT EXISTS availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  day TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Partner Requests Table (1-to-1 matching workflow)
CREATE TABLE IF NOT EXISTS partner_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  status TEXT CHECK(status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  note TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Partnerships Table (Active 1:1 accountability pairing)
CREATE TABLE IF NOT EXISTS partnerships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_a_id INTEGER NOT NULL,
  user_b_id INTEGER NOT NULL,
  status TEXT CHECK(status IN ('active', 'ended')) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_a_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_b_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Daily Check-ins Table (Tracks daily Quran progress for both partners)
CREATE TABLE IF NOT EXISTS checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partnership_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL, -- Format: YYYY-MM-DD
  completed INTEGER DEFAULT 1,
  notes TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(partnership_id, user_id, date),
  FOREIGN KEY (partnership_id) REFERENCES partnerships(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Messages Table (Simple REST message polling for study coordination)
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partnership_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partnership_id) REFERENCES partnerships(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Verse Bookmarks Table (Fast study & revision Ayah saves)
CREATE TABLE IF NOT EXISTS verse_bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  surah_name TEXT,
  surah_english_name TEXT,
  arabic_text TEXT,
  translation_text TEXT,
  note TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, surah_number, ayah_number),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Daily Quran Tracker Logs (Personal & Shared daily study tracking)
CREATE TABLE IF NOT EXISTS daily_tracker_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  partnership_id INTEGER,
  date TEXT NOT NULL, -- Format: YYYY-MM-DD
  activity_type TEXT DEFAULT 'hifz', -- 'hifz' | 'murajaah' | 'tilawah' | 'tafsir'
  portion_covered TEXT DEFAULT '',
  pages_count INTEGER DEFAULT 0,
  ayahs_count INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  notes TEXT DEFAULT '',
  completed INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Scheduled Peer Study Sessions (Accountability & Live recitation appointments)
CREATE TABLE IF NOT EXISTS study_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partnership_id INTEGER,
  creator_id INTEGER NOT NULL,
  partner_id INTEGER,
  title TEXT NOT NULL,
  session_date TEXT NOT NULL, -- Format: YYYY-MM-DD
  start_time TEXT NOT NULL,   -- e.g. "18:30"
  duration_minutes INTEGER DEFAULT 30,
  agenda TEXT DEFAULT '',     -- e.g. "Review Surah Al-Mulk and cross-test mutashabihat"
  session_type TEXT DEFAULT 'hifz', -- 'hifz' | 'murajaah' | 'tajweed' | 'milestone'
  meeting_link TEXT DEFAULT '',
  status TEXT DEFAULT 'scheduled', -- 'scheduled' | 'completed' | 'cancelled'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partnership_id) REFERENCES partnerships(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (partner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 10. Study Groups & Collaborative Circles (Halaqahs / Group Recitation Rooms)
CREATE TABLE IF NOT EXISTS study_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'Memorization', -- 'Juz Amma' | 'Surah Al-Kahf' | 'Murajaah' | 'Tajweed' | 'Khatmah' | 'General'
  target_goal TEXT DEFAULT 'Complete collective Quran Khatmah',
  creator_id INTEGER NOT NULL,
  meeting_schedule TEXT DEFAULT 'Weekly on Fridays at 07:00 AM UTC',
  meeting_link TEXT DEFAULT '',
  max_members INTEGER DEFAULT 30,
  avatar_theme TEXT DEFAULT 'emerald',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. Group Members Table
CREATE TABLE IF NOT EXISTS group_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT DEFAULT 'member', -- 'admin' | 'member'
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, user_id),
  FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. Group Collaborative Messages & Reflection Posts
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

-- 13. Group Collaborative Khatmah / 30 Juz Tracker
CREATE TABLE IF NOT EXISTS group_khatmah (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  juz_number INTEGER NOT NULL CHECK(juz_number BETWEEN 1 AND 30),
  user_id INTEGER, -- User who claimed/completed the Juz
  status TEXT DEFAULT 'available', -- 'available' | 'claimed' | 'completed'
  notes TEXT DEFAULT '',
  completed_at DATETIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, juz_number),
  FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_availability_user ON availability(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_requests_sender ON partner_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_partner_requests_receiver ON partner_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_partnerships_users ON partnerships(user_a_id, user_b_id);
CREATE INDEX IF NOT EXISTS idx_checkins_lookup ON checkins(partnership_id, date);
CREATE INDEX IF NOT EXISTS idx_messages_partnership ON messages(partnership_id, created_at);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON verse_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_tracker_user_date ON daily_tracker_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_sessions_creator ON study_sessions(creator_id);
CREATE INDEX IF NOT EXISTS idx_sessions_partner ON study_sessions(partner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON study_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_group_members_lookup ON group_members(group_id, user_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_lookup ON group_messages(group_id, created_at);
CREATE INDEX IF NOT EXISTS idx_group_khatmah_lookup ON group_khatmah(group_id, juz_number);

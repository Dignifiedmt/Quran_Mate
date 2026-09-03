// Seed database with realistic demo accounts and profiles for Quran Mate 🌙
import bcrypt from 'bcryptjs';
import { getDb, query, run, get } from './database.js';

export async function seedDatabase() {
  await getDb();

  // Check if users already exist
  const existing = await query('SELECT count(*) as count FROM users');
  if (existing[0] && existing[0].count > 0) {
    console.log('Database already populated. Skipping seed.');
    return;
  }

  console.log('Seeding demo data for Quran Mate...');
  const defaultPassword = 'password123';
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(defaultPassword, salt);

  const demoUsers = [
    {
      name: 'Maryam Al-Fassi',
      email: 'maryam@quranmate.demo',
      bio: 'Memorizing Surah Al-Baqarah and striving to complete Juz 1-2 this quarter. Looking for an early morning or evening revision partner to listen to mutashabihat and test each other.',
      memorization_stage: 'Juz 1–5',
      goal: 'Memorize new Ayahs daily',
      avatar_color: '#047857',
      availability: [
        { day: 'Monday', start_time: '19:00', end_time: '20:00' },
        { day: 'Wednesday', start_time: '19:00', end_time: '20:00' },
        { day: 'Saturday', start_time: '08:00', end_time: '09:30' }
      ]
    },
    {
      name: 'Aisha Siddiqah',
      email: 'aisha@quranmate.demo',
      bio: 'Completed Juz Amma and now working through Juz 29 (Surah Al-Mulk to Al-Mursalat). Need a supportive sister for 30-minute daily review sessions.',
      memorization_stage: 'Juz 29–30',
      goal: 'Complete a Juz',
      avatar_color: '#0f766e',
      availability: [
        { day: 'Tuesday', start_time: '18:30', end_time: '19:30' },
        { day: 'Thursday', start_time: '18:30', end_time: '19:30' },
        { day: 'Sunday', start_time: '17:00', end_time: '18:00' }
      ]
    },
    {
      name: 'Fatimah Zahra',
      email: 'fatimah@quranmate.demo',
      bio: 'Revising previously memorized Juz 26-30. Consistent accountability helps me avoid forgetting. Excited to pair with someone who loves slow, reflective tartil.',
      memorization_stage: 'Revision-focused',
      goal: 'Maintain previous memorization',
      avatar_color: '#854d0e',
      availability: [
        { day: 'Monday', start_time: '20:00', end_time: '21:00' },
        { day: 'Friday', start_time: '16:00', end_time: '17:00' },
        { day: 'Saturday', start_time: '10:00', end_time: '11:00' }
      ]
    },
    {
      name: 'Zainab Nur',
      email: 'zainab@quranmate.demo',
      bio: 'Beginning my Hifz journey starting with Juz 30. Looking for an encouraging peer to practice tajweed rules and memorize 3-5 ayahs every day.',
      memorization_stage: 'Beginning',
      goal: 'Memorize new Ayahs daily',
      avatar_color: '#1e3a8a',
      availability: [
        { day: 'Wednesday', start_time: '19:30', end_time: '20:30' },
        { day: 'Saturday', start_time: '11:00', end_time: '12:00' },
        { day: 'Sunday', start_time: '11:00', end_time: '12:00' }
      ]
    },
    {
      name: 'Hafsah Bint Umar',
      email: 'hafsah@quranmate.demo',
      bio: 'Halfway through the Quran! Currently focused on Juz 11-15 (Yunus through Al-Hijr). Need a dedicated partner for rigorous cross-recitation.',
      memorization_stage: 'Juz 11–15',
      goal: 'Prepare for a Quran milestone',
      avatar_color: '#4338ca',
      availability: [
        { day: 'Monday', start_time: '06:30', end_time: '07:30' },
        { day: 'Wednesday', start_time: '06:30', end_time: '07:30' },
        { day: 'Saturday', start_time: '07:00', end_time: '08:30' }
      ]
    },
    {
      name: 'Sumayyah Yasir',
      email: 'sumayyah@quranmate.demo',
      bio: 'Working on Juz 6 to 10. Committed to weekly milestones and reciprocal testing. Would love to share tips on retaining difficult ayah endings.',
      memorization_stage: 'Juz 6–10',
      goal: 'Revise consistently',
      avatar_color: '#065f46',
      availability: [
        { day: 'Tuesday', start_time: '20:00', end_time: '21:00' },
        { day: 'Thursday', start_time: '20:00', end_time: '21:00' },
        { day: 'Sunday', start_time: '09:00', end_time: '10:00' }
      ]
    },
    {
      name: 'Safiyyah Khan',
      email: 'safiyyah@quranmate.demo',
      bio: 'Memorized 10 Juz and now revising regularly while balancing work. Looking for weekend intensive study sessions and weekday check-ins.',
      memorization_stage: 'Multiple Juz',
      goal: 'Revise consistently',
      avatar_color: '#701a75',
      availability: [
        { day: 'Friday', start_time: '19:00', end_time: '20:30' },
        { day: 'Saturday', start_time: '14:00', end_time: '15:30' }
      ]
    },
    {
      name: 'Khadijah Kareem',
      email: 'khadijah@quranmate.demo',
      bio: 'Studying Juz 30 with focus on accurate pronunciation and meaning. A warm partner makes all the difference in keeping the daily habit alive!',
      memorization_stage: 'Juz 30',
      goal: 'Complete a Juz',
      avatar_color: '#15803d',
      availability: [
        { day: 'Monday', start_time: '18:00', end_time: '19:00' },
        { day: 'Wednesday', start_time: '18:00', end_time: '19:00' },
        { day: 'Saturday', start_time: '16:00', end_time: '17:00' }
      ]
    }
  ];

  const userIds = [];

  for (const user of demoUsers) {
    const res = await run(
      `INSERT INTO users (name, email, password_hash, bio, memorization_stage, goal, avatar_color)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user.name, user.email, passwordHash, user.bio, user.memorization_stage, user.goal, user.avatar_color]
    );
    const uId = res.lastInsertRowid;
    userIds.push(uId);

    for (const avail of user.availability) {
      await run(
        `INSERT INTO availability (user_id, day, start_time, end_time)
         VALUES (?, ?, ?, ?)`,
        [uId, avail.day, avail.start_time, avail.end_time]
      );
    }
  }

  // Set up a sample active partnership between Aisha (id 2) and Fatimah (id 3)
  // so the Active Partnership & streak features can be immediately inspected and experienced!
  const aishaId = userIds[1];
  const fatimahId = userIds[2];
  const partRes = await run(
    `INSERT INTO partnerships (user_a_id, user_b_id, status, created_at)
     VALUES (?, ?, 'active', datetime('now', '-7 days'))`,
    [aishaId, fatimahId]
  );
  const partnershipId = partRes.lastInsertRowid;

  // Insert 6 consecutive days of check-ins for both partners to show a 6-day streak
  const now = new Date();
  for (let i = 6; i >= 1; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    await run(
      `INSERT OR IGNORE INTO checkins (partnership_id, user_id, date, completed, notes)
       VALUES (?, ?, ?, 1, 'Completed assigned quarter juz recitation')`,
      [partnershipId, aishaId, dateStr]
    );
    await run(
      `INSERT OR IGNORE INTO checkins (partnership_id, user_id, date, completed, notes)
       VALUES (?, ?, ?, 1, 'Revised Surah Al-Mulk and recorded mutashabihat notes')`,
      [partnershipId, fatimahId, dateStr]
    );
  }

  // Sample coordination messages
  await run(
    `INSERT INTO messages (partnership_id, sender_id, text, created_at)
     VALUES (?, ?, 'Assalamu alaikum Aisha! 🌙 Ready for our review session this evening?', datetime('now', '-2 days'))`,
    [partnershipId, fatimahId]
  );
  await run(
    `INSERT INTO messages (partnership_id, sender_id, text, created_at)
     VALUES (?, ?, 'Wa alaikum assalam Fatimah! Yes inshaAllah, I am free at 6:30 PM. Let us review Surah Al-Qalam.', datetime('now', '-2 days', '+1 hour'))`,
    [partnershipId, aishaId]
  );
  await run(
    `INSERT INTO messages (partnership_id, sender_id, text, created_at)
     VALUES (?, ?, 'Alhamdulillah session completed! Marked today check-in.', datetime('now', '-1 day'))`,
    [partnershipId, aishaId]
  );

  // Sample incoming partner request for Maryam (user 1) from Zainab (user 4)
  const maryamId = userIds[0];
  const zainabId = userIds[3];
  await run(
    `INSERT INTO partner_requests (sender_id, receiver_id, status, note, created_at)
     VALUES (?, ?, 'pending', 'Assalamu alaikum Maryam! I noticed your Saturday schedule aligns with mine. Would love to partner for Quran accountability!', datetime('now', '-1 day'))`,
    [zainabId, maryamId]
  );

  // Sample bookmarked ayahs for Maryam
  await run(
    `INSERT INTO verse_bookmarks (user_id, surah_number, ayah_number, surah_name, surah_english_name, arabic_text, translation_text, note)
     VALUES (?, 2, 255, 'سُورَةُ البَقَرَةِ', 'Al-Baqarah', 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ', 'Allah! There is no deity except Him, the Alive, the Eternal Sustainer...', 'Ayat al-Kursi - Memorizing this week')`,
    [maryamId]
  );
  await run(
    `INSERT INTO verse_bookmarks (user_id, surah_number, ayah_number, surah_name, surah_english_name, arabic_text, translation_text, note)
     VALUES (?, 94, 5, 'سُورَةُ الشَّرۡحِ', 'Ash-Sharh', 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', 'For indeed, with hardship [will be] ease.', 'Encouragement reminder')`,
    [maryamId]
  );

  console.log('Demo data seeded successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    console.log('Seed completed.');
    process.exit(0);
  }).catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  });
}

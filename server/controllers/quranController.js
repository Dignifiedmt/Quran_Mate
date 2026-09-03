// Quran Controller with AlQuran Cloud API proxy & resilient fallback data
// Standard editions:
// Arabic: quran-uthmani (Clear Uthmani script)
// English: en.sahih (Sahih International)

// Resilient curated cache of common Ayahs to guarantee zero failure in isolated or offline environments
const OFFLINE_AYAHS = {
  '2:255': {
    surahNumber: 2,
    surahName: 'سُورَةُ البَقَرَةِ',
    surahEnglishName: 'Al-Baqarah',
    surahTranslation: 'The Cow',
    ayahNumber: 255,
    ayahInQuran: 262,
    arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    translationText: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    edition: 'Sahih International',
    juz: 3
  },
  '1:1': {
    surahNumber: 1,
    surahName: 'سُورَةُ الفَاتِحَةِ',
    surahEnglishName: 'Al-Faatiha',
    surahTranslation: 'The Opening',
    ayahNumber: 1,
    ayahInQuran: 1,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translationText: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    edition: 'Sahih International',
    juz: 1
  },
  '94:5': {
    surahNumber: 94,
    surahName: 'سُورَةُ الشَّرۡحِ',
    surahEnglishName: 'Ash-Sharh',
    surahTranslation: 'The Relief',
    ayahNumber: 5,
    ayahInQuran: 6095,
    arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translationText: 'For indeed, with hardship [will be] ease.',
    edition: 'Sahih International',
    juz: 30
  },
  '94:6': {
    surahNumber: 94,
    surahName: 'سُورَةُ الشَّرۡحِ',
    surahEnglishName: 'Ash-Sharh',
    surahTranslation: 'The Relief',
    ayahNumber: 6,
    ayahInQuran: 6096,
    arabicText: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translationText: 'Indeed, with hardship [will be] ease.',
    edition: 'Sahih International',
    juz: 30
  },
  '67:1': {
    surahNumber: 67,
    surahName: 'سُورَةُ المُلۡكِ',
    surahEnglishName: 'Al-Mulk',
    surahTranslation: 'The Sovereignty',
    ayahNumber: 1,
    ayahInQuran: 5242,
    arabicText: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translationText: 'Blessed is He in whose hand is dominion, and He is over all things competent -',
    edition: 'Sahih International',
    juz: 29
  },
  '112:1': {
    surahNumber: 112,
    surahName: 'سُورَةُ الإِخۡلَاصِ',
    surahEnglishName: 'Al-Ikhlaas',
    surahTranslation: 'The Sincerity',
    ayahNumber: 1,
    ayahInQuran: 6222,
    arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    translationText: 'Say, "He is Allah, [who is] One,',
    edition: 'Sahih International',
    juz: 30
  }
};

const SURAH_LIST = [
  { number: 1, name: 'سُورَةُ الفَاتِحَةِ', englishName: 'Al-Faatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7 },
  { number: 2, name: 'سُورَةُ البَقَرَةِ', englishName: 'Al-Baqarah', englishNameTranslation: 'The Cow', numberOfAyahs: 286 },
  { number: 3, name: 'سُورَةُ آلِ عِمْرَانَ', englishName: 'Aal-i-Imraan', englishNameTranslation: 'The Family of Imran', numberOfAyahs: 200 },
  { number: 4, name: 'سُورَةُ النِّسَاءِ', englishName: 'An-Nisaa', englishNameTranslation: 'The Women', numberOfAyahs: 176 },
  { number: 5, name: 'سُورَةُ المَائِدَةِ', englishName: 'Al-Maaida', englishNameTranslation: 'The Table', numberOfAyahs: 120 },
  { number: 18, name: 'سُورَةُ الكَهۡفِ', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave', numberOfAyahs: 110 },
  { number: 19, name: 'سُورَةُ مَرۡيَمَ', englishName: 'Maryam', englishNameTranslation: 'Mary', numberOfAyahs: 98 },
  { number: 36, name: 'سُورَةُ ي يسٓ', englishName: 'Yaseen', englishNameTranslation: 'Ya-Seen', numberOfAyahs: 83 },
  { number: 55, name: 'سُورَةُ الرَّحۡمَٰنِ', englishName: 'Ar-Rahmaan', englishNameTranslation: 'The Beneficent', numberOfAyahs: 78 },
  { number: 67, name: 'سُورَةُ المُلۡكِ', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30 },
  { number: 94, name: 'سُورَةُ الشَّرۡحِ', englishName: 'Ash-Sharh', englishNameTranslation: 'The Relief', numberOfAyahs: 8 },
  { number: 112, name: 'سُورَةُ الإِخۡلَاصِ', englishName: 'Al-Ikhlaas', englishNameTranslation: 'The Sincerity', numberOfAyahs: 4 },
  { number: 113, name: 'سُورَةُ الفَلَقِ', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak', numberOfAyahs: 5 },
  { number: 114, name: 'سُورَةُ النَّاسِ', englishName: 'An-Naas', englishNameTranslation: 'Mankind', numberOfAyahs: 6 }
];

export async function getAyahByReference(req, res) {
  try {
    const rawRef = req.params.reference.trim(); // e.g. "2:255" or "255"
    let reference = rawRef;

    // Check offline fallback first if matching
    if (OFFLINE_AYAHS[reference]) {
      return res.json({ ayah: OFFLINE_AYAHS[reference] });
    }

    // Call AlQuran Cloud API with both Arabic uthmani and Sahih International translation
    const url = `https://api.alquran.cloud/v1/ayah/${encodeURIComponent(reference)}/editions/quran-uthmani,en.sahih`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        // If 404 or bad reference
        return res.status(404).json({
          error: 'Ayah not found. Please verify the reference format, e.g. "2:255" (Surah:Ayah).'
        });
      }

      const data = await response.json();

      if (data.code === 200 && Array.isArray(data.data) && data.data.length >= 2) {
        const arabicData = data.data[0];
        const translationData = data.data[1];

        const ayah = {
          surahNumber: arabicData.surah.number,
          surahName: arabicData.surah.name,
          surahEnglishName: arabicData.surah.englishName,
          surahTranslation: arabicData.surah.englishNameTranslation,
          ayahNumber: arabicData.numberInSurah,
          ayahInQuran: arabicData.number,
          arabicText: arabicData.text,
          translationText: translationData.text,
          edition: 'Sahih International',
          juz: arabicData.juz
        };

        return res.json({ ayah });
      }
    } catch (netErr) {
      clearTimeout(timeout);
      console.warn('AlQuran API fetch failed or timed out, checking fallback:', netErr.message);
    }

    // Fallback if network was unreachable
    if (OFFLINE_AYAHS[reference]) {
      return res.json({ ayah: OFFLINE_AYAHS[reference] });
    }

    return res.status(503).json({
      error: 'We could not retrieve this Ayah right now. Please check your connection and try again.'
    });
  } catch (err) {
    console.error('getAyahByReference error:', err);
    return res.status(500).json({
      error: 'We could not retrieve this Ayah right now. Please check your connection and try again.'
    });
  }
}

export async function searchAyahs(req, res) {
  try {
    const query = req.query.query ? req.query.query.trim() : '';

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Direct check in local sample if query matches
    const lower = query.toLowerCase();
    const localMatches = Object.values(OFFLINE_AYAHS).filter((a) =>
      a.translationText.toLowerCase().includes(lower) ||
      a.arabicText.includes(query) ||
      a.surahEnglishName.toLowerCase().includes(lower)
    );

    // Call AlQuran Cloud search endpoint
    try {
      const url = `https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/en.sahih`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        if (data.code === 200 && data.data && Array.isArray(data.data.matches)) {
          const results = data.data.matches.slice(0, 20).map((m) => ({
            surahNumber: m.surah.number,
            surahName: m.surah.name,
            surahEnglishName: m.surah.englishName,
            ayahNumber: m.numberInSurah,
            ayahInQuran: m.number,
            translationText: m.text,
            edition: 'Sahih International'
          }));

          return res.json({ results, count: data.data.count });
        }
      }
    } catch (e) {
      console.warn('AlQuran search API failed or timed out:', e.message);
    }

    if (localMatches.length > 0) {
      return res.json({ results: localMatches, count: localMatches.length });
    }

    return res.json({ results: [], count: 0, message: 'No verses found matching your query.' });
  } catch (err) {
    console.error('searchAyahs error:', err);
    return res.status(500).json({ error: 'Search request failed. Please try again.' });
  }
}

import fs from 'fs';
import path from 'path';

// Load full 114 surahs from local cache if available
let ALL_SURAHS = SURAH_LIST;
try {
  const jsonPath = path.join(process.cwd(), 'server', 'data', 'surahs.json');
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.data && Array.isArray(parsed.data)) {
      ALL_SURAHS = parsed.data;
    }
  }
} catch (e) {
  console.warn('Using default surahs fallback:', e.message);
}

// In-memory cache for full Surahs
const SURAH_CACHE = {};

export async function getSurahs(req, res) {
  try {
    return res.json({ surahs: ALL_SURAHS });
  } catch (err) {
    console.error('getSurahs error:', err);
    return res.status(500).json({ error: 'Failed to retrieve Surahs' });
  }
}

export async function getSurahByNumber(req, res) {
  try {
    const surahNumber = parseInt(req.params.number, 10);
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return res.status(400).json({ error: 'Invalid Surah number. Must be between 1 and 114.' });
    }

    // Check memory cache first
    if (SURAH_CACHE[surahNumber]) {
      return res.json({ surah: SURAH_CACHE[surahNumber] });
    }

    const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch Surah from Qur\'an source.' });
    }

    const data = await response.json();
    if (data.code === 200 && Array.isArray(data.data) && data.data.length >= 2) {
      const arabicData = data.data[0];
      const translationData = data.data[1];

      const ayahs = arabicData.ayahs.map((a, idx) => {
        const trans = translationData.ayahs && translationData.ayahs[idx] ? translationData.ayahs[idx].text : '';
        return {
          number: a.number, // Ayah number in whole Quran
          numberInSurah: a.numberInSurah,
          juz: a.juz,
          page: a.page,
          arabicText: a.text,
          translationText: trans,
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`
        };
      });

      const formattedSurah = {
        number: arabicData.number,
        name: arabicData.name,
        englishName: arabicData.englishName,
        englishNameTranslation: arabicData.englishNameTranslation,
        revelationType: arabicData.revelationType,
        numberOfAyahs: arabicData.numberOfAyahs,
        ayahs
      };

      // Cache it
      SURAH_CACHE[surahNumber] = formattedSurah;

      return res.json({ surah: formattedSurah });
    }

    return res.status(500).json({ error: 'Unexpected response from Qur\'an API.' });
  } catch (err) {
    console.error('getSurahByNumber error:', err);
    return res.status(500).json({ error: 'Unable to retrieve Surah at this time. Please try again.' });
  }
}

export async function getRandomAyah(req, res) {
  try {
    // Generate a random ayah number between 1 and 6236
    const randomAyahNumber = Math.floor(Math.random() * 6236) + 1;

    try {
      const url = `https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/editions/quran-uthmani,en.sahih`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        if (data.code === 200 && Array.isArray(data.data) && data.data.length >= 2) {
          const arabicData = data.data[0];
          const translationData = data.data[1];

          return res.json({
            ayah: {
              surahNumber: arabicData.surah.number,
              surahName: arabicData.surah.name,
              surahEnglishName: arabicData.surah.englishName,
              surahTranslation: arabicData.surah.englishNameTranslation,
              ayahNumber: arabicData.numberInSurah,
              ayahInQuran: arabicData.number,
              arabicText: arabicData.text,
              translationText: translationData.text,
              edition: 'Sahih International',
              juz: arabicData.juz
            }
          });
        }
      }
    } catch (netErr) {
      console.warn('Random Ayah fetch failed:', netErr.message);
    }

    // Pick from curated list
    const keys = Object.keys(OFFLINE_AYAHS);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return res.json({ ayah: OFFLINE_AYAHS[randomKey] });
  } catch (err) {
    console.error('getRandomAyah error:', err);
    const keys = Object.keys(OFFLINE_AYAHS);
    return res.json({ ayah: OFFLINE_AYAHS[keys[0]] });
  }
}

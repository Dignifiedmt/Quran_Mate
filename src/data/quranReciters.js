// Authentic Qur'an Reciters (القراء) with Verified High-Fidelity Audio CDNs
// Supports both Ayah-by-Ayah recitation and full Surah recitation with CDN fallback

export const QURRA_LIST = [
  {
    id: 'ar.alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    style: 'Murattal',
    origin: 'Kuwait',
    getAyahAudioUrl: (surahNum, ayahInSurah, ayahInQuran) =>
      `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahInQuran}.mp3`,
    getAyahFallbackUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/Alafasy_128kbps/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getSurahAudioUrl: (surahNum) =>
      `https://server8.mp3quran.net/afs/${String(surahNum).padStart(3, '0')}.mp3`,
  },
  {
    id: 'ar.minshawi',
    name: 'Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    style: 'Classic Murattal',
    origin: 'Egypt',
    getAyahAudioUrl: (surahNum, ayahInSurah, ayahInQuran) =>
      `https://cdn.islamic.network/quran/audio/128/ar.minshawi/${ayahInQuran}.mp3`,
    getAyahFallbackUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/Minshawy_Murattal_128kbps/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getSurahAudioUrl: (surahNum) =>
      `https://server10.mp3quran.net/minsh/${String(surahNum).padStart(3, '0')}.mp3`,
  },
  {
    id: 'ar.husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    style: 'Tajweed Mastery',
    origin: 'Egypt',
    getAyahAudioUrl: (surahNum, ayahInSurah, ayahInQuran) =>
      `https://cdn.islamic.network/quran/audio/128/ar.husary/${ayahInQuran}.mp3`,
    getAyahFallbackUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/Husary_128kbps/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getSurahAudioUrl: (surahNum) =>
      `https://server13.mp3quran.net/husr/${String(surahNum).padStart(3, '0')}.mp3`,
  },
  {
    id: 'ar.abdulbasit',
    name: 'AbdulBaset AbdulSamad',
    arabicName: 'عبد الباسط عبد الصمد',
    style: 'Golden Voice (Murattal)',
    origin: 'Egypt',
    getAyahAudioUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getAyahFallbackUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getSurahAudioUrl: (surahNum) =>
      `https://server7.mp3quran.net/basit/${String(surahNum).padStart(3, '0')}.mp3`,
  },
  {
    id: 'ar.mahermuaiqly',
    name: 'Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    style: 'Imam of Masjid Al-Haram',
    origin: 'Makkah',
    getAyahAudioUrl: (surahNum, ayahInSurah, ayahInQuran) =>
      `https://cdn.islamic.network/quran/audio/128/ar.mahermuaiqly/${ayahInQuran}.mp3`,
    getAyahFallbackUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/MaherAlMuaiqly128kbps/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getSurahAudioUrl: (surahNum) =>
      `https://server12.mp3quran.net/maher/${String(surahNum).padStart(3, '0')}.mp3`,
  },
  {
    id: 'ar.shaatree',
    name: 'Abu Bakr Ash-Shatri',
    arabicName: 'أبو بكر الشاطري',
    style: 'Emotional & Moving',
    origin: 'Saudi Arabia',
    getAyahAudioUrl: (surahNum, ayahInSurah, ayahInQuran) =>
      `https://cdn.islamic.network/quran/audio/128/ar.shaatree/${ayahInQuran}.mp3`,
    getAyahFallbackUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getSurahAudioUrl: (surahNum) =>
      `https://server11.mp3quran.net/shatri/${String(surahNum).padStart(3, '0')}.mp3`,
  },
  {
    id: 'ar.saadalghamdi',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    style: 'Distinctive Rhythmic',
    origin: 'Saudi Arabia',
    getAyahAudioUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/Ghamadi_40kbps/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getAyahFallbackUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/Ghamadi_40kbps/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getSurahAudioUrl: (surahNum) =>
      `https://server7.mp3quran.net/s_gmd/${String(surahNum).padStart(3, '0')}.mp3`,
  },
  {
    id: 'ar.sudais',
    name: 'Abdur-Rahman As-Sudais',
    arabicName: 'عبد الرحمن السديس',
    style: 'Haramain Khateeb',
    origin: 'Makkah',
    getAyahAudioUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getAyahFallbackUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getSurahAudioUrl: (surahNum) =>
      `https://server11.mp3quran.net/sds/${String(surahNum).padStart(3, '0')}.mp3`,
  },
  {
    id: 'ar.ahmedajamy',
    name: 'Ahmed Al-Ajamy',
    arabicName: 'أحمد بن علي العجمي',
    style: 'Melodic & Clear',
    origin: 'Saudi Arabia',
    getAyahAudioUrl: (surahNum, ayahInSurah, ayahInQuran) =>
      `https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy/${ayahInQuran}.mp3`,
    getAyahFallbackUrl: (surahNum, ayahInSurah) =>
      `https://everyayah.com/data/Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net/${String(surahNum).padStart(3, '0')}${String(ayahInSurah).padStart(3, '0')}.mp3`,
    getSurahAudioUrl: (surahNum) =>
      `https://server10.mp3quran.net/ajm/${String(surahNum).padStart(3, '0')}.mp3`,
  },
];

// Helper to look up a reciter by ID (with fallback to Alafasy)
export function getReciterById(id) {
  return QURRA_LIST.find((q) => q.id === id) || QURRA_LIST[0];
}

// Get primary Ayah audio URL
export function getAyahAudioUrl(reciterId, surahNum, ayahInSurah, ayahInQuran) {
  const reciter = getReciterById(reciterId);
  return reciter.getAyahAudioUrl(surahNum, ayahInSurah, ayahInQuran);
}

// Get fallback Ayah audio URL
export function getAyahFallbackUrl(reciterId, surahNum, ayahInSurah, ayahInQuran) {
  const reciter = getReciterById(reciterId);
  return reciter.getAyahFallbackUrl ? reciter.getAyahFallbackUrl(surahNum, ayahInSurah, ayahInQuran) : '';
}

// Get complete Surah recitation audio URL
export function getSurahAudioUrl(reciterId, surahNum) {
  const reciter = getReciterById(reciterId);
  return reciter.getSurahAudioUrl(surahNum);
}

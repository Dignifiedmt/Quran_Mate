# Quran Mate 🌙
> **Peer Accountability & Daily Tilawah Platform for Quran Memorization (Hifz) and Revision (Muraja'ah)**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57.svg)](https://sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 🌟 Overview

**Quran Mate** is a full-stack web application purpose-built to help Muslims cultivate lifelong consistency with the Book of Allah. Memorizing (Hifz) and revising (Muraja'ah) the Quran requires daily discipline; Quran Mate bridges the gap between solitary effort and lasting commitment through **peer accountability**, **rich audio study tools**, and **habit tracking**.

Whether you are beginning your journey with Juz 'Amma, reviewing previously memorized Surahs, or maintaining a daily recitation habit, Quran Mate connects you with an accountability partner and provides all the tools needed to stay steadfast.

---

## ✨ Key Features

### 1. 🤝 Peer Accountability & Study Partnerships
- **Partner Matching & Invite Codes**: Generate unique pairing codes or join a study partner with one click.
- **Mutual Streak Tracking**: Keep each other accountable with synchronized daily streaks and milestone celebrations.
- **Shared Revision Goals**: Commit together to weekly memorization targets (e.g., Surah Al-Kahf or Juz 30).
- **Scheduled Study Sessions**: Schedule live revision sessions with automatic Jitsi Meet integration for reciprocal recitation testing.

### 2. 📖 The Noble Quran & Ayah Finder
- **Authentic Uthmani Text**: Clear, elegant Arabic typography rendered with high legibility.
- **English Translation**: Sahih International translation alongside the original Arabic.
- **Surah & Juz Browser**: Complete directory of all 114 Surahs with revelation classification (Meccan / Medinan), total ayah counts, and 30 Juz breakdowns.
- **Lazy-Loaded Calligraphy**: Authentic vector Bismillah headers and loading indicators.
- **Quick Reference Lookup**: Search any verse instantly (e.g., `2:255` for Ayat Al-Kursi, `67:1` for Al-Mulk).

### 3. 🎧 9 Renowned Qurra' (Reciters) with Multi-CDN Audio
High-fidelity verse-by-verse and full-Surah recitation with automatic fallback:
1. **Mishary Rashid Alafasy** (*مشاري راشد العفاسي*) — Murattal
2. **Muhammad Siddiq Al-Minshawi** (*محمد صديق المنشاوي*) — Classic Murattal & Tajweed
3. **Mahmoud Khalil Al-Husary** (*محمود خليل الحصري*) — Tajweed Mastery
4. **AbdulBaset AbdulSamad** (*عبد الباسط عبد الصمد*) — Golden Voice of the Quran
5. **Maher Al-Muaiqly** (*ماهر المعيقلي*) — Imam of Masjid Al-Haram, Makkah
6. **Abu Bakr Ash-Shatri** (*أبو بكر الشاطري*) — Emotional & Melodic
7. **Saad Al-Ghamdi** (*سعد الغامدي*) — Distinctive Rhythmic Murattal
8. **Abdur-Rahman As-Sudais** (*عبد الرحمن السديس*) — Chief Imam of the Two Holy Mosques
9. **Ahmed Al-Ajamy** (*أحمد بن علي العجمي*) — Deep & Resonant Recitation

#### Advanced Audio Player Capabilities:
- **Hifz Loop Mode**: Repeat a single Ayah continuously until memorization is solidified.
- **Continuous Recitation**: Automatically advance to the next verse upon completion.
- **Speed Controls**: Adjust playback between `0.75x`, `1.0x`, and `1.25x` for careful tajweed study.
- **Interactive Scrubber**: Seek through audio timelines with millisecond responsiveness.
- **Resilient Dual-CDN Fallback**: If an audio CDN is unreachable or throttled, playback automatically switches to a verified secondary mirror without interrupting your session.

### 4. 📊 Daily Habit Tracker & Consistency Visualizers
- **Categorized Activity Logging**: Log daily **Recitation (تلاوة)**, **Memorization (حفظ)**, **Revision (مراجعة)**, and **Tafsir Study**.
- **Interactive Weekly Chart**: Visualize pages and ayahs completed over the past 7 days using Recharts.
- **14-Day Consistency Heatmap**: Track daily habit completion status at a glance.
- **Streak Protection**: Real-time streak tracking to encourage unbroken daily habits.

### 5. 📝 Quran Reflections (Tadabbur) & Bookmarks
- **Personal Verse Notes**: Write personal insights and reflections attached to specific Surahs and Ayahs.
- **One-Click Bookmarking**: Save verses for quick reference during prayer or revision.
- **Share & Copy**: Copy formatted Arabic and English verses with attribution directly to your clipboard.

---

## 🏗️ Architecture & Tech Stack

```
├── client/ (Vite + React 18)
│   ├── src/
│   │   ├── components/      # UI components (Bismillah, Navigation, Cards, Quran)
│   │   ├── context/         # Auth and App state contexts
│   │   ├── data/            # Curated datasets (Surahs, Juz, Reciters, Hadiths)
│   │   ├── pages/           # Application views (Dashboard, AyahFinder, Tracker, etc.)
│   │   └── services/        # Client API service client
│   └── index.html           # PWA-ready HTML entry point
│
├── server/ (Express + Node.js)
│   ├── controllers/         # Quran, Auth, Tracker, Partner, Session handlers
│   ├── database/            # SQLite initialization, schema, & write fallbacks
│   ├── routes/              # Express API route endpoints
│   └── middleware/          # JWT authentication and request validation
│
└── server.js                # Full-stack server entry & Vite development bridge
```

- **Frontend**: React 18, Vite 6, Tailwind CSS v4, Lucide React icons, Recharts data visualization, React Router v6.
- **Backend**: Express.js REST API with modular controllers and route definitions.
- **Database**: SQLite with `better-sqlite3` — zero external database dependencies required, with automated permissions testing and filesystem fallbacks.
- **Authentication**: Stateless JSON Web Tokens (JWT) with secure `bcryptjs` password hashing.
- **Audio CDN Network**: Dual-source multi-CDN architecture leveraging Islamic Network CDN, EveryAyah, and MP3Quran mirrors.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/quran-mate.git
   cd quran-mate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```

   | Variable | Description | Default |
   |---|---|---|
   | `PORT` | HTTP server binding port | `3000` (Dev / Sandbox), `10000` (Render) |
   | `JWT_SECRET` | Secret key used to sign and verify user JWTs | Any secure random string |
   | `SQLITE_PATH` | Path or connection URI for the SQLite database | `./quran_mate.sqlite` |
   | `NODE_ENV` | Environment mode (`development` or `production`) | `development` |

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## ☁️ Deployment Guide

### Deploying on Render (Web Service)
Quran Mate is fully optimized for **Render**:
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your Git repository.
3. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `node server.js`
4. Set Environment Variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `<your-secure-random-token>`
   - `SQLITE_PATH` = `sqlite:///app.db` (Render will automatically place this inside your application directory)
   - `PORT` = `10000` *(Render sets this automatically)*
5. The server will dynamically bind to Render's port, initialize the database with write safety checks, and serve static assets seamlessly.

### Deploying on Google Cloud Run / Container Platforms
Quran Mate runs seamlessly inside Docker or Cloud Run:
```bash
# Build production bundle
npm run build

# Start production server
node server.js
```
The server listens on `0.0.0.0:3000` (or `process.env.PORT`) with sub-second health checks at `/api/health`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Health check & service status | No |
| `POST` | `/api/auth/register` | Create a new Quran Mate account | No |
| `POST` | `/api/auth/login` | Sign in and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/quran/surahs` | List all 114 Surahs with metadata | No |
| `GET` | `/api/quran/surahs/:num` | Fetch Arabic text and translation for Surah | No |
| `GET` | `/api/quran/ayahs/:ref` | Fetch Ayah by reference (e.g., `2:255`) | No |
| `GET` | `/api/quran/random` | Retrieve a random Ayah with translation | No |
| `GET` | `/api/tracker/logs` | Fetch daily habit logs and weekly stats | Yes |
| `POST` | `/api/tracker/logs` | Record recitation, Hifz, or revision | Yes |
| `GET` | `/api/partners/current` | Get active accountability partner | Yes |
| `POST` | `/api/partners/invite` | Generate partner invite code | Yes |
| `POST` | `/api/partners/join` | Join partner using invite code | Yes |
| `GET` | `/api/sessions` | Fetch upcoming study & revision sessions | Yes |
| `POST` | `/api/sessions` | Schedule a revision session with video link | Yes |
| `GET` | `/api/reflections` | Retrieve personal Quran reflections | Yes |
| `POST` | `/api/reflections` | Save reflection note for a verse | Yes |

---

## 📜 License

This project is licensed under the MIT License — feel free to use and contribute.

---

*“The best among you are those who learn the Quran and teach it.”* — **Prophet Muhammad ﷺ (Sahih Al-Bukhari)**

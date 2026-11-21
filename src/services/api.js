// Quran Mate Frontend API Service Client

const BASE_URL = '/api';

export function getAuthToken() {
  return localStorage.getItem('quran_mate_token');
}

export function setAuthToken(token) {
  apiCache.clear();
  if (token) {
    localStorage.setItem('quran_mate_token', token);
  } else {
    localStorage.removeItem('quran_mate_token');
  }
}

const apiCache = new Map();
const CACHE_TTL_MS = 15000;

async function request(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  if (method !== 'GET') {
    apiCache.clear();
  }

  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    apiCache.clear();
    setAuthToken(null);
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function cachedGet(endpoint, ttlMs = CACHE_TTL_MS) {
  const now = Date.now();
  const cached = apiCache.get(endpoint);
  if (cached && now - cached.timestamp < ttlMs) {
    return cached.promise;
  }
  const promise = request(endpoint).catch((err) => {
    apiCache.delete(endpoint);
    throw err;
  });
  apiCache.set(endpoint, { promise, timestamp: now });
  return promise;
}

const quranCache = new Map();

async function cachedQuranRequest(key, fetcher) {
  if (quranCache.has(key)) {
    return quranCache.get(key);
  }
  const pending = fetcher().catch((err) => {
    quranCache.delete(key);
    throw err;
  });
  quranCache.set(key, pending);
  return pending;
}

export const api = {
  // Authentication
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),

  // Users & Profiles
  getUsers: (params = {}) => {
    const query = new URLSearchParams();
    if (params.stage) query.set('stage', params.stage);
    if (params.goal) query.set('goal', params.goal);
    if (params.day) query.set('day', params.day);
    if (params.search) query.set('search', params.search);
    if (params.sameLevelOnly) query.set('sameLevelOnly', params.sameLevelOnly);
    return cachedGet(`/users?${query.toString()}`);
  },
  getUserById: (id) => cachedGet(`/users/${id}`),
  updateProfile: (payload) => request('/users/me', { method: 'PUT', body: JSON.stringify(payload) }),
  getAvailability: () => cachedGet('/users/me/availability'),
  updateAvailability: (slots) => request('/users/me/availability', { method: 'PUT', body: JSON.stringify({ slots }) }),

  // Bookmarks
  getBookmarks: () => cachedGet('/users/me/bookmarks'),
  addBookmark: (payload) => request('/users/me/bookmarks', { method: 'POST', body: JSON.stringify(payload) }),
  deleteBookmark: (id) => request(`/users/me/bookmarks/${id}`, { method: 'DELETE' }),

  // Partner Requests
  sendPartnerRequest: (receiverId, note) =>
    request('/partner-requests', { method: 'POST', body: JSON.stringify({ receiver_id: receiverId, note }) }),
  getReceivedRequests: () => cachedGet('/partner-requests/received'),
  getSentRequests: () => cachedGet('/partner-requests/sent'),
  acceptRequest: (id) => request(`/partner-requests/${id}/accept`, { method: 'PATCH' }),
  declineRequest: (id) => request(`/partner-requests/${id}/decline`, { method: 'PATCH' }),

  // Active Partnership & Check-ins
  getCurrentPartnership: () => cachedGet('/partnerships/current'),
  toggleCheckin: (partnershipId, notes = '') =>
    request(`/partnerships/${partnershipId}/checkins`, { method: 'POST', body: JSON.stringify({ notes }) }),
  endPartnership: (partnershipId) =>
    request(`/partnerships/${partnershipId}/end`, { method: 'POST' }),

  // Messaging & Coordination
  getMessages: (partnershipId) => request(`/partnerships/${partnershipId}/messages`),
  sendMessage: (partnershipId, text) =>
    request(`/partnerships/${partnershipId}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),

  // Quran & Ayah Finder (cached in memory per session)
  getAyah: (reference) =>
    cachedQuranRequest(`ayah:${reference}`, () => request(`/quran/ayah/${encodeURIComponent(reference)}`)),
  getSurah: (number) =>
    cachedQuranRequest(`surah:${number}`, () => request(`/quran/surah/${number}`)),
  searchAyahs: (query) => request(`/quran/search?query=${encodeURIComponent(query)}`),
  getSurahs: () => cachedQuranRequest('surahs:all', () => request('/quran/surahs')),
  getRandomAyah: () => request('/quran/random'),

  // Gemini Image Generation (Reflection Cards)
  generateImage: (params) =>
    request('/images/generate', { method: 'POST', body: JSON.stringify(params) }),

  // Daily Quran Habit & Study Tracker
  getTrackerSummary: () => cachedGet('/tracker/summary'),
  getTrackerLogs: (params = {}) => {
    const query = new URLSearchParams();
    if (params.date) query.set('date', params.date);
    if (params.limit) query.set('limit', params.limit);
    return cachedGet(`/tracker/logs?${query.toString()}`);
  },
  createTrackerLog: (payload) =>
    request('/tracker/logs', { method: 'POST', body: JSON.stringify(payload) }),
  deleteTrackerLog: (id) =>
    request(`/tracker/logs/${id}`, { method: 'DELETE' }),

  // Peer Session Scheduling
  getSessions: () => cachedGet('/sessions'),
  createSession: (payload) =>
    request('/sessions', { method: 'POST', body: JSON.stringify(payload) }),
  updateSession: (id, payload) =>
    request(`/sessions/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteSession: (id) =>
    request(`/sessions/${id}`, { method: 'DELETE' }),

  // Group Study Circles & Collaborative Halaqahs
  getGroups: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    return cachedGet(`/groups?${query.toString()}`);
  },
  getGroupById: (id) => request(`/groups/${id}`),
  createGroup: async (payload) => {
    const res = await request('/groups', { method: 'POST', body: JSON.stringify(payload) });
    if (res?.token) {
      setAuthToken(res.token);
      window.dispatchEvent(new CustomEvent('auth:updated', { detail: res.user }));
    }
    return res;
  },
  joinGroup: async (id, payload = {}) => {
    const res = await request(`/groups/${id}/join`, { method: 'POST', body: JSON.stringify(payload) });
    if (res?.token) {
      setAuthToken(res.token);
      window.dispatchEvent(new CustomEvent('auth:updated', { detail: res.user }));
    }
    return res;
  },
  leaveGroup: (id) => request(`/groups/${id}/leave`, { method: 'POST' }),
  postGroupMessage: (id, payload) =>
    request(`/groups/${id}/messages`, { method: 'POST', body: JSON.stringify(payload) }),
  updateGroupKhatmah: (id, payload) =>
    request(`/groups/${id}/khatmah`, { method: 'POST', body: JSON.stringify(payload) }),
};

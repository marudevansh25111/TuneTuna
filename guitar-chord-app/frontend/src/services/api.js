import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Songs API
export const songsAPI = {
  // Get all songs
  getAllSongs: (params = {}) => api.get('/songs', { params }),
  
  // Search songs by chords
  searchSongs: (chords, exact = false) => 
    api.get('/songs/search', { params: { chords: chords.join(','), exact } }),
  
  // Get song by ID
  getSongById: (id) => api.get(`/songs/${id}`),
  
  // Create new song
  createSong: (songData) => api.post('/songs', songData),
  
  // Update song
  updateSong: (id, songData) => api.put(`/songs/${id}`, songData),
  
  // Delete song
  deleteSong: (id) => api.delete(`/songs/${id}`),
};

// Recommendations API
export const recommendationsAPI = {
  // Get recommendations based on chords
  getRecommendations: (chords, limit = 5) => 
    api.get('/recommendations/chords', { 
      params: { chords: chords.join(','), limit } 
    }),
  
  // Get trending songs
  getTrending: (limit = 10) => 
    api.get('/recommendations/trending', { params: { limit } }),
  
  // Get similar songs
  getSimilar: (songId, limit = 5) => 
    api.get(`/recommendations/similar/${songId}`, { params: { limit } }),
};

// Lyrics API
export const lyricsAPI = {
  // Get full song with lyrics
  getFullSong: (songId) => api.get(`/lyrics/song/${songId}/full`),
  
  // Update song lyrics
  updateLyrics: (songId, lyricsData) => 
    api.put(`/lyrics/song/${songId}/lyrics`, lyricsData),
};

export default api;
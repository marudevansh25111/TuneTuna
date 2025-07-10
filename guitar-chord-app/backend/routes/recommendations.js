// backend/routes/recommendations.js - FIXED VERSION
const express = require('express');
const router = express.Router();
const RecommendationEngine = require('../utils/recommendationEngine');

// Get recommendations based on chords
router.get('/chords', async (req, res) => {
  try {
    const { chords, limit = 5 } = req.query;
    
    if (!chords) {
      return res.status(400).json({ message: 'Chords parameter is required' });
    }
    
    const searchChords = chords.split(',').map(chord => chord.trim());
    const userPreferences = req.user ? {
      favoriteGenres: req.user.favoriteGenres,
      skillLevel: req.user.skillLevel
    } : {};
    
    const recommendations = await RecommendationEngine.getRecommendations(
      searchChords,
      parseInt(limit),
      userPreferences
    );
    
    res.json({
      recommendations,
      searchChords,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Error in GET /recommendations/chords:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get trending songs
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const trendingSongs = await RecommendationEngine.getTrendingSongs(parseInt(limit));
    
    res.json({
      trending: trendingSongs,
      count: trendingSongs.length
    });
  } catch (error) {
    console.error('Error in GET /recommendations/trending:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get similar songs - SIMPLIFIED (NO REGEX)
router.get('/similar/:songId', async (req, res) => {
  try {
    const { songId } = req.params;
    const { limit = 5 } = req.query;
    
    const similarSongs = await RecommendationEngine.getSimilarSongs(songId, parseInt(limit));
    
    res.json({
      similar: similarSongs,
      count: similarSongs.length
    });
  } catch (error) {
    console.error('Error in GET /recommendations/similar/:songId:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
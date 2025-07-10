// backend/routes/lyrics.js - FIXED VERSION
const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// Get full song with lyrics - SIMPLIFIED (NO REGEX)
router.get('/song/:id/full', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    console.error('Error in GET /lyrics/song/:id/full:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add/update lyrics for a song - SIMPLIFIED (NO REGEX)
router.put('/song/:id/lyrics', async (req, res) => {
  try {
    const { lyricsWithChords, songStructure, copyrightInfo, lyricsSource } = req.body;
    
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { 
        lyricsWithChords, 
        songStructure, 
        copyrightInfo, 
        lyricsSource 
      },
      { new: true, runValidators: true }
    );
    
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    res.json(song);
  } catch (error) {
    console.error('Error in PUT /lyrics/song/:id/lyrics:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
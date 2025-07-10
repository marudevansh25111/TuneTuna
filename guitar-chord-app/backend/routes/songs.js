// backend/routes/songs.js - FIXED VERSION
const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// Get all songs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, difficulty, key } = req.query;
    
    const query = {};
    if (genre) query.genre = genre;
    if (difficulty) query.difficulty = difficulty;
    if (key) query.key = key;
    
    const songs = await Song.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Song.countDocuments(query);
    
    res.json({
      songs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error in GET /songs:', error);
    res.status(500).json({ message: error.message });
  }
});

// Search songs by chords
router.get('/search', async (req, res) => {
  try {
    const { chords, exact = false } = req.query;
    
    if (!chords) {
      return res.status(400).json({ message: 'Chords parameter is required' });
    }
    
    const searchChords = chords.split(',').map(chord => chord.trim());
    
    let query;
    if (exact === 'true') {
      query = { chords: { $all: searchChords } };
    } else {
      query = { chords: { $in: searchChords } };
    }
    
    const songs = await Song.find(query);
    
    // Update search count for found songs
    if (songs.length > 0) {
      await Song.updateMany(
        { _id: { $in: songs.map(song => song._id) } },
        { $inc: { searchCount: 1 } }
      );
    }
    
    res.json({ songs, searchChords });
  } catch (error) {
    console.error('Error in GET /songs/search:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get song by ID - SIMPLIFIED (NO REGEX)
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    console.error('Error in GET /songs/:id:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new song
router.post('/', async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    console.error('Error in POST /songs:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update song - SIMPLIFIED (NO REGEX)
router.put('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    console.error('Error in PUT /songs/:id:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete song - SIMPLIFIED (NO REGEX)
router.delete('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /songs/:id:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
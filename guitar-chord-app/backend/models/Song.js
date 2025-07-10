const mongoose = require('mongoose');

// Schema for individual lyrics sections with chord positions
const lyricsSectionSchema = new mongoose.Schema({
  sectionType: {
    type: String,
    enum: ['verse', 'chorus', 'bridge', 'intro', 'outro', 'instrumental'],
    required: true
  },
  sectionName: {
    type: String, // e.g., "Verse 1", "Chorus", "Bridge"
    required: true
  },
  lines: [{
    text: String,
    chords: [{
      chord: String,
      position: Number // Character position where chord appears
    }]
  }]
}, { _id: false });

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  chords: [{
    type: String,
    required: true
  }],
  key: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  tempo: {
    type: Number,
    required: true
  },
  // Enhanced lyrics structure with chord positions
  lyricsWithChords: [lyricsSectionSchema],
  // Song structure/arrangement
  songStructure: [{
    type: String, // References to section names
    repeat: {
      type: Number,
      default: 1
    }
  }],
  // Additional metadata
  capoPosition: {
    type: Number,
    default: 0
  },
  tuning: {
    type: String,
    default: 'Standard' // Standard, Drop D, etc.
  },
  strummingPattern: {
    type: String,
    default: ''
  },
  // Copyright and source information
  lyricsSource: {
    type: String,
    default: 'User contributed' // Track source of lyrics
  },
  copyrightInfo: {
    type: String,
    default: ''
  },
  searchCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better search performance
songSchema.index({ title: 'text', artist: 'text' });
songSchema.index({ chords: 1 });
songSchema.index({ genre: 1 });
songSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Song', songSchema);
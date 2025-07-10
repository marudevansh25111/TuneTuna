const mongoose = require('mongoose');
const Song = require('../models/Song');
const connectDB = require('../config/database');

// Sample songs with placeholder lyrics and chord positions
const sampleSongs = [
  {
    title: "Demo Folk Song",
    artist: "Sample Artist",
    chords: ["G", "D", "Em", "C"],
    key: "G",
    difficulty: "Beginner",
    genre: "Folk",
    tempo: 90,
    rating: 4.5,
    searchCount: 150,
    capoPosition: 2,
    tuning: "Standard",
    strummingPattern: "D-D-U-U-D-U",
    lyricsSource: "Original composition for demo",
    lyricsWithChords: [
      {
        sectionType: "verse",
        sectionName: "Verse 1",
        lines: [
          {
            text: "Walking down this old road today",
            chords: [
              { chord: "Am", position: 0 },
              { chord: "F", position: 15 }
            ]
          }
        ]
      },
      {
        sectionType: "chorus",
        sectionName: "Chorus",
        lines: [
          {
            text: "We are young and we are free",
            chords: [
              { chord: "C", position: 0 },
              { chord: "G", position: 10 },
              { chord: "Am", position: 20 }
            ]
          },
          {
            text: "This is how we're meant to be",
            chords: [
              { chord: "F", position: 0 },
              { chord: "C", position: 15 },
              { chord: "G", position: 25 }
            ]
          }
        ]
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Song.deleteMany({});
    console.log('Cleared existing songs');
    
    // Insert sample data
    await Song.insertMany(sampleSongs);
    console.log('Sample songs with lyrics inserted successfully');
    console.log(`Inserted ${sampleSongs.length} songs`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
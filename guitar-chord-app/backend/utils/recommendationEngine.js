const Song = require('../models/Song');

class RecommendationEngine {
  // Calculate chord similarity between two songs
  static calculateChordSimilarity(searchChords, songChords) {
    const searchSet = new Set(searchChords.map(chord => chord.toLowerCase()));
    const songSet = new Set(songChords.map(chord => chord.toLowerCase()));
    
    const intersection = new Set([...searchSet].filter(x => songSet.has(x)));
    const union = new Set([...searchSet, ...songSet]);
    
    return intersection.size / union.size; // Jaccard similarity
  }

  // Calculate popularity score
  static calculatePopularityScore(song) {
    const searchWeight = 0.4;
    const ratingWeight = 0.6;
    
    const normalizedSearchCount = Math.min(song.searchCount / 100, 1);
    const normalizedRating = song.rating / 5;
    
    return (searchWeight * normalizedSearchCount) + (ratingWeight * normalizedRating);
  }

  // Main recommendation function
  static async getRecommendations(searchChords, limit = 5, userPreferences = {}) {
    try {
      // Get all songs
      const allSongs = await Song.find({});
      
      // Calculate scores for each song
      const scoredSongs = allSongs.map(song => {
        const chordSimilarity = this.calculateChordSimilarity(searchChords, song.chords);
        const popularityScore = this.calculatePopularityScore(song);
        
        // Bonus for exact chord matches
        const exactMatches = searchChords.filter(chord => 
          song.chords.some(songChord => 
            songChord.toLowerCase() === chord.toLowerCase()
          )
        ).length;
        
        const exactMatchBonus = exactMatches / searchChords.length;
        
        // Genre preference bonus
        let genreBonus = 0;
        if (userPreferences.favoriteGenres && userPreferences.favoriteGenres.includes(song.genre)) {
          genreBonus = 0.2;
        }
        
        // Difficulty preference bonus
        let difficultyBonus = 0;
        if (userPreferences.skillLevel === song.difficulty) {
          difficultyBonus = 0.1;
        }
        
        // Final score calculation
        const finalScore = (
          chordSimilarity * 0.4 +
          popularityScore * 0.3 +
          exactMatchBonus * 0.2 +
          genreBonus +
          difficultyBonus
        );
        
        return {
          song,
          score: finalScore,
          chordSimilarity,
          exactMatches,
          popularityScore
        };
      });
      
      // Sort by score and return top recommendations
      return scoredSongs
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => ({
          ...item.song.toObject(),
          recommendationScore: item.score,
          matchingChords: searchChords.filter(chord => 
            item.song.chords.some(songChord => 
              songChord.toLowerCase() === chord.toLowerCase()
            )
          )
        }));
    } catch (error) {
      console.error('Error in recommendation engine:', error);
      throw error;
    }
  }

  // Get trending songs
  static async getTrendingSongs(limit = 10) {
    try {
      return await Song.find({})
        .sort({ searchCount: -1, rating: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting trending songs:', error);
      throw error;
    }
  }

  // Get similar songs based on a specific song
  static async getSimilarSongs(songId, limit = 5) {
    try {
      const targetSong = await Song.findById(songId);
      if (!targetSong) return [];
      
      return await this.getRecommendations(targetSong.chords, limit);
    } catch (error) {
      console.error('Error getting similar songs:', error);
      throw error;
    }
  }
}

module.exports = RecommendationEngine;
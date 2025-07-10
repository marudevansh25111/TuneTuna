import React, { useState, useEffect } from 'react';
import { recommendationsAPI } from '../services/api';
import SongCard from './SongCard';
import './Recommendations.css';

const Recommendations = ({ searchChords, onViewLyrics }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    if (searchChords && searchChords.length > 0) {
      fetchRecommendations();
    }
  }, [searchChords]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await recommendationsAPI.getRecommendations(searchChords);
      setRecommendations(response.data.recommendations);
    } catch (err) {
      setError('Failed to fetch recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await recommendationsAPI.getTrending();
      setTrending(response.data.trending);
    } catch (err) {
      console.error('Error fetching trending songs:', err);
    }
  };

  const handleGetSimilar = async (songId) => {
    try {
      const response = await recommendationsAPI.getSimilar(songId);
      setRecommendations(response.data.similar);
    } catch (err) {
      console.error('Error fetching similar songs:', err);
    }
  };

  if (loading) {
    return (
      <div className="recommendations loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Finding perfect recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations">
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <div className="section-header">
            <h2>🎯 Recommended for You</h2>
            <p>Based on your search: <strong>{searchChords?.join(', ')}</strong></p>
          </div>
          <div className="recommendations-grid">
            {recommendations.map(song => (
              <SongCard
                key={song._id}
                song={song}
                highlightChords={searchChords}
                onGetSimilar={handleGetSimilar}
                onViewLyrics={onViewLyrics}
              />
            ))}
          </div>
        </div>
      )}

      {trending.length > 0 && (
        <div className="trending-section">
          <div className="section-header">
            <h2>🔥 Trending Songs</h2>
            <p>Popular songs based on user searches and ratings</p>
          </div>
          <div className="trending-grid">
            {trending.slice(0, 6).map(song => (
              <SongCard
                key={song._id}
                song={song}
                onGetSimilar={handleGetSimilar}
                onViewLyrics={onViewLyrics}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
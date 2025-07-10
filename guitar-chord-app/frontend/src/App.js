import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import SongList from './components/SongList';
import Recommendations from './components/Recommendations';
import LyricsDisplay from './components/LyricsDisplay';
import AddSongForm from './components/AddSongForm';
import { songsAPI, recommendationsAPI } from './services/api';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchChords, setSearchChords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('search');
  const [selectedSong, setSelectedSong] = useState(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSearch = async (chords, exact) => {
    setLoading(true);
    setError(null);
    setSearchChords(chords);
    
    try {
      const response = await songsAPI.searchSongs(chords, exact);
      setSongs(response.data.songs);
      setActiveTab('results');
      
      // Show success message
      if (response.data.songs.length === 0) {
        setError(`No songs found with chords: ${chords.join(', ')}. Try different chords or remove exact match.`);
      }
    } catch (err) {
      setError('Failed to search songs. Please check your connection and try again.');
      console.error('Error searching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async (chords) => {
    setLoading(true);
    setError(null);
    setSearchChords(chords);
    
    try {
      const response = await recommendationsAPI.getRecommendations(chords);
      setRecommendations(response.data.recommendations);
      setActiveTab('recommendations');
      
      if (response.data.recommendations.length === 0) {
        setError(`No recommendations found for chords: ${chords.join(', ')}. Try different chord combinations.`);
      }
    } catch (err) {
      setError('Failed to get recommendations. Please check your connection and try again.');
      console.error('Error getting recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSimilar = async (songId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await recommendationsAPI.getSimilar(songId);
      setRecommendations(response.data.similar);
      setActiveTab('recommendations');
      
      // Update search chords to match the similar songs
      if (response.data.similar.length > 0) {
        const song = response.data.similar[0];
        setSearchChords(song.chords || []);
      }
    } catch (err) {
      setError('Failed to get similar songs. Please try again.');
      console.error('Error getting similar songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLyrics = (song) => {
    setSelectedSong(song);
    setShowLyrics(true);
  };

  const handleCloseLyrics = () => {
    setShowLyrics(false);
    setSelectedSong(null);
  };

  const handleSongAdded = () => {
    // Refresh the current view after adding a song
    if (activeTab === 'results' && searchChords.length > 0) {
      handleSearch(searchChords, false);
    }
    setShowAddForm(false);
  };

  const clearError = () => {
    setError(null);
  };

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'search':
        return 'Search';
      case 'results':
        return `Results (${songs.length})`;
      case 'recommendations':
        return 'Recommendations';
      default:
        return tab;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🎸 TuneTuna </h1>
          <h2>Guitar Chord Finder</h2>
          <p>Discover songs by the chords you know</p>
          <div className="header-stats">
            <span className="stat-item">
              🎵 Search by chords
            </span>
            <span className="stat-item">
              📝 View lyrics with chord positions
            </span>
            <span className="stat-item">
              🎯 Smart recommendations
            </span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="main-controls">
          <SearchBar 
            onSearch={handleSearch}
            onGetRecommendations={handleGetRecommendations}
          />
          
          <div className="action-buttons">
            <button 
              className="add-song-button"
              onClick={() => setShowAddForm(true)}
            >
              ➕ Add New Song
            </button>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            {['search', 'results', 'recommendations'].map(tab => (
              <button 
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {getTabTitle(tab)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="error-container">
            <div className="error">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
              <button className="error-close" onClick={clearError}>×</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="loading">
              <div className="loading-spinner"></div>
              <p className="loading-text">
                {activeTab === 'results' ? 'Searching songs...' : 
                 activeTab === 'recommendations' ? 'Finding recommendations...' : 
                 'Loading...'}
              </p>
            </div>
          </div>
        )}

        <div className="content">
          {activeTab === 'search' && (
            <div className="welcome-section">
              <div className="welcome-content">
                <h2>Welcome to Guitar Chord Finder!</h2>
                <p>Select chords above to find songs that use them. You can:</p>
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">🎵</div>
                    <h3>Search Songs</h3>
                    <p>Find songs containing specific chords with exact or partial matching</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3>Get Recommendations</h3>
                    <p>AI-powered suggestions based on your chord preferences</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🔥</div>
                    <h3>Trending Songs</h3>
                    <p>Discover popular songs based on user searches</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">📝</div>
                    <h3>Lyrics & Chords</h3>
                    <p>View full lyrics with chord positions and transpose functionality</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🎸</div>
                    <h3>Find Similar</h3>
                    <p>Discover songs similar to ones you already like</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">➕</div>
                    <h3>Add Songs</h3>
                    <p>Contribute new songs to the database with lyrics and chords</p>
                  </div>
                </div>
              </div>
              <Recommendations searchChords={[]} onViewLyrics={handleViewLyrics} />
            </div>
          )}

          {activeTab === 'results' && !loading && (
            <SongList 
              songs={songs}
              title="Search Results"
              highlightChords={searchChords}
              onGetSimilar={handleGetSimilar}
              onViewLyrics={handleViewLyrics}
            />
          )}

          {activeTab === 'recommendations' && !loading && (
            <div className="recommendations-tab">
              {recommendations.length > 0 ? (
                <SongList 
                  songs={recommendations}
                  title="Recommended Songs"
                  highlightChords={searchChords}
                  onGetSimilar={handleGetSimilar}
                  onViewLyrics={handleViewLyrics}
                />
              ) : (
                <Recommendations 
                  searchChords={searchChords} 
                  onViewLyrics={handleViewLyrics}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Lyrics Modal */}
      {showLyrics && selectedSong && (
        <LyricsDisplay 
          song={selectedSong}
          onClose={handleCloseLyrics}
        />
      )}

      {/* Add Song Modal */}
      {showAddForm && (
        <AddSongForm
          onSongAdded={handleSongAdded}
          onClose={() => setShowAddForm(false)}
        />
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Guitar Chord Finder</h4>
            <p>Find your next favorite song through the chords you know!</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Chord-based search</li>
              <li>AI recommendations</li>
              <li>Lyrics with chords</li>
              <li>Add new songs</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Quick Start</h4>
            <ul>
              <li>Select common chords</li>
              <li>Try G, C, D, Em</li>
              <li>Use exact match for precision</li>
              <li>Add your own songs</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Guitar Chord Finder - Made with ❤️ for musicians</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
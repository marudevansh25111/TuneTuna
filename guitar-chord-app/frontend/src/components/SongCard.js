import React from 'react';
import './SongCard.css';

const SongCard = ({ song, highlightChords = [], onGetSimilar, onViewLyrics }) => {
  const renderChords = () => {
    return song.chords.map(chord => (
      <span 
        key={chord} 
        className={`chord-tag ${highlightChords.includes(chord) ? 'highlighted' : ''}`}
      >
        {chord}
      </span>
    ));
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#757575';
    }
  };

  const hasLyrics = song.lyricsWithChords && song.lyricsWithChords.length > 0;

  return (
    <div className="song-card">
      <div className="song-header">
        <h3 className="song-title">{song.title}</h3>
        <p className="song-artist">by {song.artist}</p>
        {hasLyrics && (
          <div className="lyrics-badge">📝 Has Lyrics</div>
        )}
      </div>
      
      <div className="song-info">
        <div className="info-row">
          <span className="label">Key:</span>
          <span className="value">{song.key}</span>
        </div>
        <div className="info-row">
          <span className="label">Genre:</span>
          <span className="value">{song.genre}</span>
        </div>
        <div className="info-row">
          <span className="label">Tempo:</span>
          <span className="value">{song.tempo} BPM</span>
        </div>
        <div className="info-row">
          <span className="label">Difficulty:</span>
          <span 
            className="value difficulty"
            style={{ color: getDifficultyColor(song.difficulty) }}
          >
            {song.difficulty}
          </span>
        </div>
        {song.capoPosition > 0 && (
          <div className="info-row">
            <span className="label">Capo:</span>
            <span className="value">Fret {song.capoPosition}</span>
          </div>
        )}
        {song.strummingPattern && (
          <div className="info-row">
            <span className="label">Strumming:</span>
            <span className="value strumming">{song.strummingPattern}</span>
          </div>
        )}
      </div>

      <div className="song-chords">
        <h4>Chords ({song.chords.length}):</h4>
        <div className="chord-list">
          {renderChords()}
        </div>
      </div>

      <div className="song-stats">
        <div className="stat">
          <span className="stat-label">Rating:</span>
          <span className="stat-value">
            <span className="stars">
              {'★'.repeat(Math.floor(song.rating))}
              {'☆'.repeat(5 - Math.floor(song.rating))}
            </span>
            <span className="rating-number">({song.rating}/5)</span>
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Searches:</span>
          <span className="stat-value popularity">{song.searchCount}</span>
        </div>
      </div>

      {song.recommendationScore && (
        <div className="recommendation-score">
          <span className="score-label">Match Score:</span>
          <span className="score-value">{(song.recommendationScore * 100).toFixed(1)}%</span>
          <div className="score-bar">
            <div 
              className="score-fill" 
              style={{ width: `${song.recommendationScore * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {song.matchingChords && song.matchingChords.length > 0 && (
        <div className="matching-chords">
          <span className="match-label">Matching Chords ({song.matchingChords.length}):</span>
          <div className="match-chords">
            {song.matchingChords.map(chord => (
              <span key={chord} className="match-chord">{chord}</span>
            ))}
          </div>
        </div>
      )}

      <div className="song-actions">
        {hasLyrics && (
          <button 
            className="lyrics-button"
            onClick={() => onViewLyrics(song)}
          >
            📝 View Lyrics & Chords
          </button>
        )}
        <button 
          className="similar-button"
          onClick={() => onGetSimilar(song._id)}
        >
          🎸 Find Similar Songs
        </button>
      </div>
    </div>
  );
};

export default SongCard;
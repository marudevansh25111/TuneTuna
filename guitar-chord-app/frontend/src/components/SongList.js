import React from 'react';
import SongCard from './SongCard';
import './SongList.css';

const SongList = ({ songs, title, highlightChords = [], onGetSimilar, onViewLyrics }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="song-list empty">
        <h2>{title}</h2>
        <div className="empty-state">
          <div className="empty-icon">🎵</div>
          <p>No songs found. Try different chords or search criteria.</p>
          <div className="empty-suggestions">
            <h4>Suggestions:</h4>
            <ul>
              <li>Try fewer chords for broader results</li>
              <li>Remove the "exact match" requirement</li>
              <li>Use common chords like G, C, D, Em</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="song-list">
      <div className="list-header">
        <h2>{title}</h2>
        <div className="list-meta">
          <span className="song-count">{songs.length} songs found</span>
          {highlightChords.length > 0 && (
            <span className="search-chords">
              Searching: {highlightChords.join(', ')}
            </span>
          )}
        </div>
      </div>
      
      <div className="songs-grid">
        {songs.map(song => (
          <SongCard
            key={song._id}
            song={song}
            highlightChords={highlightChords}
            onGetSimilar={onGetSimilar}
            onViewLyrics={onViewLyrics}
          />
        ))}
      </div>
    </div>
  );
};

export default SongList;
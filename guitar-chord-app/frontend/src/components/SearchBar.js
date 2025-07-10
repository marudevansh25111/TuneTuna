import React, { useState } from 'react';
import './SearchBar.css';

const COMMON_CHORDS = [
  'A', 'Am', 'A7', 'B', 'Bm', 'B7', 'C', 'Cm', 'C7',
  'D', 'Dm', 'D7', 'E', 'Em', 'E7', 'F', 'Fm', 'F7',
  'G', 'Gm', 'G7', 'Am7', 'Bm7', 'Cm7', 'Dm7', 'Em7', 'Fm7', 'Gm7'
];

const SearchBar = ({ onSearch, onGetRecommendations }) => {
  const [selectedChords, setSelectedChords] = useState([]);
  const [customChord, setCustomChord] = useState('');
  const [exactMatch, setExactMatch] = useState(false);

  const addChord = (chord) => {
    if (!selectedChords.includes(chord)) {
      setSelectedChords([...selectedChords, chord]);
    }
  };

  const removeChord = (chord) => {
    setSelectedChords(selectedChords.filter(c => c !== chord));
  };

  const addCustomChord = () => {
    if (customChord.trim() && !selectedChords.includes(customChord.trim())) {
      setSelectedChords([...selectedChords, customChord.trim()]);
      setCustomChord('');
    }
  };

  const handleSearch = () => {
    if (selectedChords.length > 0) {
      onSearch(selectedChords, exactMatch);
    }
  };

  const handleGetRecommendations = () => {
    if (selectedChords.length > 0) {
      onGetRecommendations(selectedChords);
    }
  };

  const clearAll = () => {
    setSelectedChords([]);
    setCustomChord('');
    setExactMatch(false);
  };

  return (
    <div className="search-bar">
      <div className="search-header">
        <h2>🎸 Search Songs by Chords</h2>
        <p>Select chords to find songs that use them</p>
      </div>

      <div className="selected-chords">
        <h3>Selected Chords ({selectedChords.length}):</h3>
        <div className="chord-tags">
          {selectedChords.map(chord => (
            <span key={chord} className="chord-tag">
              {chord}
              <button 
                onClick={() => removeChord(chord)}
                aria-label={`Remove ${chord} chord`}
              >
                ×
              </button>
            </span>
          ))}
          {selectedChords.length === 0 && (
            <span className="no-chords">No chords selected</span>
          )}
        </div>
      </div>

      <div className="chord-selector">
        <h3>Common Chords:</h3>
        <div className="chord-grid">
          {COMMON_CHORDS.map(chord => (
            <button
              key={chord}
              className={`chord-button ${selectedChords.includes(chord) ? 'selected' : ''}`}
              onClick={() => addChord(chord)}
              disabled={selectedChords.includes(chord)}
            >
              {chord}
            </button>
          ))}
        </div>
      </div>

      <div className="custom-chord">
        <h3>Add Custom Chord:</h3>
        <div className="custom-chord-input">
          <input
            type="text"
            value={customChord}
            onChange={(e) => setCustomChord(e.target.value)}
            placeholder="Enter chord (e.g., Fsus4, C/E)"
            onKeyPress={(e) => e.key === 'Enter' && addCustomChord()}
          />
          <button onClick={addCustomChord} disabled={!customChord.trim()}>
            Add
          </button>
        </div>
      </div>

      <div className="search-options">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={exactMatch}
            onChange={(e) => setExactMatch(e.target.checked)}
          />
          Exact match (all selected chords must be present)
        </label>
      </div>

      <div className="search-actions">
        <button 
          className="search-button"
          onClick={handleSearch}
          disabled={selectedChords.length === 0}
        >
          🔍 Search Songs
        </button>
        <button 
          className="recommendation-button"
          onClick={handleGetRecommendations}
          disabled={selectedChords.length === 0}
        >
          🎯 Get Recommendations
        </button>
        <button 
          className="clear-button"
          onClick={clearAll}
          disabled={selectedChords.length === 0}
        >
          🗑️ Clear All
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
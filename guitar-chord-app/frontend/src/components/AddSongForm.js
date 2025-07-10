import React, { useState } from 'react';
import { songsAPI } from '../services/api';
import './AddSongForm.css';

const AddSongForm = ({ onSongAdded, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    chords: '',
    key: '',
    difficulty: 'Beginner',
    genre: '',
    tempo: '',
    rating: 0,
    capoPosition: 0,
    strummingPattern: '',
    lyrics: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to determine section type
  const getSectionType = (sectionName) => {
    const name = sectionName.toLowerCase();
    if (name.includes('chorus')) return 'chorus';
    if (name.includes('verse')) return 'verse';
    if (name.includes('bridge')) return 'bridge';
    if (name.includes('intro')) return 'intro';
    if (name.includes('outro')) return 'outro';
    return 'verse'; // default
  };

  // Process lyrics text into structured format - PRESERVE WHITESPACE
  const processLyricsText = (lyricsText) => {
    if (!lyricsText || lyricsText.trim() === '') return [];
    
    const lines = lyricsText.split('\n'); // Don't filter empty lines - preserve all
    const sections = [];
    let currentSection = {
      sectionType: "verse",
      sectionName: "Verse 1",
      lines: []
    };
    
    lines.forEach((line, index) => {
      // Don't trim the line - preserve all whitespace
      const originalLine = line;
      const trimmedForCheck = line.trim();
      
      // Check if line is a section header (like [Verse 1], [Chorus], etc.)
      if (trimmedForCheck.startsWith('[') && trimmedForCheck.endsWith(']')) {
        // Save current section if it has lines
        if (currentSection.lines.length > 0) {
          sections.push(currentSection);
        }
        
        // Start new section
        const sectionName = trimmedForCheck.slice(1, -1); // Remove brackets
        currentSection = {
          sectionType: getSectionType(sectionName),
          sectionName: sectionName,
          lines: []
        };
      } else {
        // Add line to current section - preserve original whitespace
        currentSection.lines.push({
          text: originalLine, // Keep original line with all whitespace
          chords: [] // No chord positions for user-entered lyrics initially
        });
      }
    });
    
    // Add the last section
    if (currentSection.lines.length > 0) {
      sections.push(currentSection);
    }
    
    // If no sections were created, create a default verse with all lines
    if (sections.length === 0 && lines.length > 0) {
      sections.push({
        sectionType: "verse",
        sectionName: "Verse 1",
        lines: lines.map(line => ({
          text: line, // Preserve original whitespace
          chords: []
        }))
      });
    }
    
    return sections;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert chords string to array
      const chordsArray = formData.chords.split(',').map(chord => chord.trim());
      
      // Process lyrics into structured format
      const processedLyrics = formData.lyrics ? processLyricsText(formData.lyrics) : [];
      
      // Create song object
      const songData = {
        ...formData,
        chords: chordsArray,
        tempo: parseInt(formData.tempo),
        rating: parseFloat(formData.rating),
        capoPosition: parseInt(formData.capoPosition),
        lyricsWithChords: processedLyrics,
        lyricsSource: "User contributed"
      };

      // Remove the plain lyrics field since we're using structured lyrics
      delete songData.lyrics;

      await songsAPI.createSong(songData);
      alert('Song added successfully!');
      onSongAdded && onSongAdded();
      onClose && onClose();
    } catch (err) {
      setError('Failed to add song: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    setFormData({
      title: '',
      artist: '',
      chords: '',
      key: '',
      difficulty: 'Beginner',
      genre: '',
      tempo: '',
      rating: 0,
      capoPosition: 0,
      strummingPattern: '',
      lyrics: ''
    });
    setError('');
  };

  return (
    <div className="add-song-overlay">
      <div className="add-song-form">
        <div className="form-header">
          <h2>🎵 Add New Song</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close form">×</button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Song Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter song title"
              />
            </div>
            <div className="form-group">
              <label>Artist *</label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                required
                placeholder="Enter artist name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Chords * (comma separated)</label>
              <input
                type="text"
                name="chords"
                value={formData.chords}
                onChange={handleChange}
                required
                placeholder="G, C, D, Em, Am, F"
              />
              <small className="form-hint">
                Separate chords with commas. Example: G, C, D, Em
              </small>
            </div>
            <div className="form-group">
              <label>Key *</label>
              <input
                type="text"
                name="key"
                value={formData.key}
                onChange={handleChange}
                required
                placeholder="G"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label>Genre *</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                placeholder="Pop, Rock, Folk, Blues, etc."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tempo (BPM) *</label>
              <input
                type="number"
                name="tempo"
                value={formData.tempo}
                onChange={handleChange}
                required
                placeholder="120"
                min="60"
                max="200"
              />
            </div>
            <div className="form-group">
              <label>Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="5"
                placeholder="4.5"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Capo Position</label>
              <input
                type="number"
                name="capoPosition"
                value={formData.capoPosition}
                onChange={handleChange}
                min="0"
                max="12"
                placeholder="0"
              />
              <small className="form-hint">
                Fret number where capo is placed (0 = no capo)
              </small>
            </div>
            <div className="form-group">
              <label>Strumming Pattern</label>
              <input
                type="text"
                name="strummingPattern"
                value={formData.strummingPattern}
                onChange={handleChange}
                placeholder="D-D-U-U-D-U"
              />
              <small className="form-hint">
                Use D for down, U for up, X for mute
              </small>
            </div>
          </div>

          <div className="form-group">
            <label>Lyrics (optional)</label>
            <textarea
              name="lyrics"
              value={formData.lyrics}
              onChange={handleChange}
              rows="12"
              placeholder="Enter song lyrics exactly as you want them to appear...

[Verse 1]
Walking down this old road today
Thinking of the words I want to say
    (Indented lines will stay indented)

Every step brings me closer home

[Chorus]
And I'll sing this melody
For everyone to hear
    Music is the language of the heart
    Bringing souls together near and far

[Verse 2] 
Another verse here
    With custom spacing
        And indentation

[Bridge]
Bridge section with
    Your exact formatting
        Including all spaces

Note: 
- All spacing, indentation, and blank lines will be preserved
- Use [Section Name] to organize parts  
- Empty lines create visual breaks
- Indentation will be maintained exactly as typed"
            />
            <small className="form-hint">
              💡 <strong>Formatting preserved:</strong> All spaces, indentation, and blank lines will be displayed exactly as you type them.
              Use [Verse 1], [Chorus], [Bridge] etc. to organize sections.
            </small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleReset} className="reset-btn">
              🔄 Reset Form
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '⏳ Adding...' : '✅ Add Song'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSongForm;
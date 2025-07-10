import React, { useState, useEffect } from 'react';
import './LyricsDisplay.css';

const LyricsDisplay = ({ song, onClose }) => {
  const [fontSize, setFontSize] = useState(16);
  const [showChords, setShowChords] = useState(true);
  const [transposeSteps, setTransposeSteps] = useState(0);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Debug lyrics data
  useEffect(() => {
    console.log('Song lyrics data:', song.lyricsWithChords);
    console.log('Plain lyrics:', song.lyrics);
  }, [song]);

  // Chord transposition logic
  const transposeChord = (chord, steps) => {
    const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const chordRegex = /^([A-G][#b]?)(.*)$/;
    const match = chord.match(chordRegex);
    
    if (!match) return chord;
    
    let [, root, modifier] = match;
    
    // Convert flat to sharp
    if (root.includes('b')) {
      const flatToSharp = {'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'};
      root = flatToSharp[root] || root;
    }
    
    const currentIndex = chromatic.indexOf(root);
    if (currentIndex === -1) return chord;
    
    const newIndex = (currentIndex + steps + 12) % 12;
    return chromatic[newIndex] + modifier;
  };

  const renderLineWithChords = (line) => {
    // Handle string input (convert to object)
    if (typeof line === 'string') {
      return (
        <div className="lyrics-line-container">
          <div className="lyrics-line-text">{line}</div>
        </div>
      );
    }

    // Handle object with text and chords
    if (!line.text) return null;

    if (!showChords || !line.chords || line.chords.length === 0) {
      return (
        <div className="lyrics-line-container">
          <div className="lyrics-line-text">{line.text}</div>
        </div>
      );
    }

    const elements = [];
    let lastPosition = 0;

    // Sort chords by position
    const sortedChords = [...line.chords].sort((a, b) => a.position - b.position);

    sortedChords.forEach((chordInfo, index) => {
      const { chord, position } = chordInfo;
      
      // Add text before this chord
      if (position > lastPosition) {
        const textBefore = line.text.substring(lastPosition, position);
        if (textBefore) {
          elements.push(
            <span key={`text-${index}`} className="lyrics-text-segment">
              {textBefore}
            </span>
          );
        }
      }

      // Add the chord
      elements.push(
        <span key={`chord-${index}`} className="chord-container">
          <span className="chord-label">
            {transposeSteps !== 0 ? transposeChord(chord, transposeSteps) : chord}
          </span>
          <span className="chord-spacer"> </span>
        </span>
      );

      lastPosition = position;
    });

    // Add remaining text
    if (lastPosition < line.text.length) {
      const remainingText = line.text.substring(lastPosition);
      elements.push(
        <span key="remaining-text" className="lyrics-text-segment">
          {remainingText}
        </span>
      );
    }

    return (
      <div className="lyrics-line-container">
        <div className="lyrics-line-with-chords">{elements}</div>
      </div>
    );
  };

  const renderSection = (section) => {
    return (
      <div key={section.sectionName} className="lyrics-section">
        <h3 className="section-header">{section.sectionName}</h3>
        <div className="section-content">
          {section.lines.map((line, index) => (
            <div key={index} className="line-wrapper">
              {renderLineWithChords(line)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSongStructure = () => {
    if (!song.songStructure || song.songStructure.length === 0) {
      return song.lyricsWithChords?.map(renderSection);
    }

    return song.songStructure.map((structureItem, index) => {
      const section = song.lyricsWithChords?.find(
        s => s.sectionName === structureItem.type
      );
      
      if (!section) return null;

      const elements = [];
      for (let i = 0; i < (structureItem.repeat || 1); i++) {
        elements.push(
          <div key={`${index}-${i}`}>
            {renderSection(section)}
            {structureItem.repeat > 1 && i < structureItem.repeat - 1 && (
              <div className="repeat-indicator">
                (Repeat {i + 1}/{structureItem.repeat})
              </div>
            )}
          </div>
        );
      }
      return elements;
    });
  };

  // Handle plain text lyrics by splitting into lines - PRESERVE WHITESPACE
  const renderPlainTextLyrics = (lyricsText) => {
    if (!lyricsText) return null;
    
    const lines = lyricsText.split('\n'); // Don't filter empty lines
    
    return (
      <div className="plain-lyrics-container">
        <div className="lyrics-section">
          <h3 className="section-header">Lyrics</h3>
          <div className="section-content">
            {lines.map((line, index) => (
              <div key={index} className="line-wrapper">
                <div className="lyrics-line-container">
                  <div className="lyrics-line-text">{line}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const printLyrics = () => {
    const printContent = document.querySelector('.lyrics-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${song.title} - ${song.artist}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .lyrics-section { margin-bottom: 20px; }
            .section-header { font-weight: bold; color: #667eea; margin-bottom: 10px; font-size: 1.2rem; }
            .chord-label { font-weight: bold; color: #333; }
            .lyrics-line-container { margin-bottom: 8px; }
            .lyrics-line-text { margin-bottom: 5px; white-space: pre-wrap; }
            .section-content { margin-left: 10px; }
          </style>
        </head>
        <body>
          <h1>${song.title}</h1>
          <h2>by ${song.artist}</h2>
          <p><strong>Key:</strong> ${song.key} | <strong>Tempo:</strong> ${song.tempo} BPM</p>
          ${song.capoPosition > 0 ? `<p><strong>Capo:</strong> Fret ${song.capoPosition}</p>` : ''}
          ${song.strummingPattern ? `<p><strong>Strumming:</strong> ${song.strummingPattern}</p>` : ''}
          <hr>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="lyrics-display-fullscreen">
      {/* Fixed Header */}
      <div className="lyrics-header-fixed">
        <div className="header-left">
          <button 
            className="back-button" 
            onClick={onClose}
            title="Back to search"
          >
            ← Back
          </button>
          <div className="song-info-compact">
            <h2>{song.title}</h2>
            <p>by {song.artist}</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="print-button" 
            onClick={printLyrics}
            title="Print lyrics"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="lyrics-controls-bar">
        <div className="control-group">
          <label>Font:</label>
          <button 
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            disabled={fontSize <= 12}
            className="size-button"
          >
            A-
          </button>
          <span className="font-size-display">{fontSize}px</span>
          <button 
            onClick={() => setFontSize(Math.min(28, fontSize + 2))}
            disabled={fontSize >= 28}
            className="size-button"
          >
            A+
          </button>
        </div>

        <div className="control-group">
          <label className="checkbox-control">
            <input
              type="checkbox"
              checked={showChords}
              onChange={(e) => setShowChords(e.target.checked)}
            />
            <span className="checkbox-label">Chords</span>
          </label>
        </div>

        <div className="control-group">
          <label>Transpose:</label>
          <button 
            onClick={() => setTransposeSteps(transposeSteps - 1)}
            className="transpose-button"
          >
            ♭
          </button>
          <span className="transpose-display">
            {transposeSteps === 0 ? 'Original' : 
             transposeSteps > 0 ? `+${transposeSteps}` : transposeSteps}
          </span>
          <button 
            onClick={() => setTransposeSteps(transposeSteps + 1)}
            className="transpose-button"
          >
            ♯
          </button>
          <button 
            onClick={() => setTransposeSteps(0)}
            disabled={transposeSteps === 0}
            className="reset-button"
          >
            Reset
          </button>
        </div>

        <div className="song-details-compact">
          <span>Key: <strong>{transposeSteps !== 0 ? transposeChord(song.key, transposeSteps) : song.key}</strong></span>
          <span>Tempo: <strong>{song.tempo} BPM</strong></span>
          {song.capoPosition > 0 && <span>Capo: <strong>Fret {song.capoPosition}</strong></span>}
          {song.strummingPattern && <span>Strumming: <strong>{song.strummingPattern}</strong></span>}
        </div>
      </div>

      {/* Main Lyrics Content */}
      <div className="lyrics-main-content">
        <div 
          className="lyrics-content-fullscreen"
          style={{ fontSize: `${fontSize}px` }}
        >
          {song.lyricsWithChords && song.lyricsWithChords.length > 0 ? (
            <div className="lyrics-sections">
              {renderSongStructure()}
            </div>
          ) : song.lyrics ? (
            // Handle plain text lyrics by converting to lines
            renderPlainTextLyrics(song.lyrics)
          ) : (
            <div className="no-lyrics">
              <div className="no-lyrics-icon">🎵</div>
              <h3>No Lyrics Available</h3>
              <p>Lyrics are not available for this song.</p>
              <div className="chord-reference">
                <h4>Chord Reference:</h4>
                <div className="chord-list-display">
                  {song.chords.map(chord => (
                    <span key={chord} className="chord-ref">
                      {transposeSteps !== 0 ? transposeChord(chord, transposeSteps) : chord}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="lyrics-footer-fixed">
        {song.lyricsSource && (
          <div className="source-info">
            Source: {song.lyricsSource}
          </div>
        )}
        {song.copyrightInfo && (
          <div className="copyright-notice">
            {song.copyrightInfo}
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsDisplay;
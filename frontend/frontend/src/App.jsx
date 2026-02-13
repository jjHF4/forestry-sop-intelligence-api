import React, { useState } from 'react';
import { ObservationForm } from './components/ObservationForm';
import { MatchesList } from './components/MatchesList';
import { RecommendationPanel } from './components/RecommendationPanel';
import { FieldMap } from './components/FieldMap';
import { VoiceAssistant } from './components/VoiceAssistant';
import { Sparkles, TreePine } from 'lucide-react';
import './styles/App.css';

function App() {
  const [noteId, setNoteId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleObservationSubmit = (result) => {
    setNoteId(result.note_id);
    setMatches(result.matches || []);
    setSelectedMatch(null);
    
    if (result.matches && result.matches.length > 0) {
      setTimeout(() => setSelectedMatch(result.matches[0]), 500);
    }
  };

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
  };

  return (
    <div className="app">
      <header className="header-enhanced">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <TreePine className="logo-icon" />
              <div>
                <h1 className="header-title">
                  Field Ops Advisor
                  <Sparkles className="sparkle-icon" />
                </h1>
                <p className="header-subtitle">
                  AI-powered SOP recommendations with voice assistance
                </p>
              </div>
            </div>
          </div>
          
          <VoiceAssistant />
        </div>
        <div className="header-bg-pattern"></div>
      </header>

      <main className="container-enhanced">
        <div className="left-panel">
          <ObservationForm onSubmit={handleObservationSubmit} />
          <div className="matches-container">
            <MatchesList
              matches={matches}
              selectedMatch={selectedMatch}
              onSelectMatch={handleSelectMatch}
            />
          </div>
        </div>

        
        <div className="center-panel">
          <FieldMap />
        </div>

        
        <div className="right-panel">
          <RecommendationPanel
            noteId={noteId}
            match={selectedMatch}
          />
        </div>
      </main>

      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

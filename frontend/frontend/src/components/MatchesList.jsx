import React from 'react';

export function MatchesList({ matches, selectedMatch, onSelectMatch }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="card">
        <h2>📋 Matched SOPs</h2>
        <div className="empty-state">
          Submit an observation to see matching SOPs
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📋 Matched SOPs ({matches.length})</h2>
      <div className="matches-list">
        {matches.map(match => (
          <div
            key={match.id}
            className={`match-item ${selectedMatch?.id === match.id ? 'selected' : ''}`}
            onClick={() => onSelectMatch(match)}
          >
            <div className="match-header">
              <div className="match-title">{match.title}</div>
              <div className="relevance-badge">{match.relevance_score}%</div>
            </div>
            
            <div className="match-meta">
              <span>{match.domain}</span>
              <span>•</span>
              <span>{match.category}</span>
            </div>
            
            <div className="match-evidence">
              "{match.evidence_snippet}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

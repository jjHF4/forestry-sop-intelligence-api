import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function RecommendationPanel({ noteId, match }) {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (noteId && match) {
      loadRecommendation();
    }
  }, [noteId, match?.id]);

  const loadRecommendation = async () => {
    setLoading(true);
    try {
      const data = await api.getRecommendation(noteId, match.id);
      setRecommendation(data);
    } catch (error) {
      console.error('Error loading recommendation:', error);
      setRecommendation(null);
    } finally {
      setLoading(false);
    }
  };

  if (!match) {
    return (
      <div className="card">
        <h2>✅ Recommendations</h2>
        <div className="empty-state">
          Select a matched SOP to see recommendations
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <h2>✅ Recommendations</h2>
        <div className="loading">Generating recommendations...</div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="card">
        <h2>✅ Recommendations</h2>
        <div className="empty-state">Failed to load recommendations</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>✅ Recommendations</h2>
      
      {recommendation.fallback_used && (
        <div className="fallback-badge">
          ⚠️ Fallback Mode (LLM unavailable)
        </div>
      )}

      <h3>{match.title}</h3>
      
      <div className="recommendation-section">
        <ul className="rec-bullets">
          {recommendation.bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>
      </div>

      {recommendation.citations && recommendation.citations.length > 0 && (
        <div className="citations">
          <h4>📎 Citations from SOP:</h4>
          {recommendation.citations.slice(0, 3).map((citation, idx) => (
            <div key={idx} className="citation">
              {citation.quoted_text.substring(0, 150)}
              {citation.quoted_text.length > 150 ? '...' : ''}
              <br />
              <small>
                (chars {citation.source_char_range[0]}-{citation.source_char_range[1]}, 
                confidence: {citation.confidence})
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

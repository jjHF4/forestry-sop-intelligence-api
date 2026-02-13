import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function ObservationForm({ onSubmit }) {
  const [observation, setObservation] = useState('');
  const [region, setRegion] = useState('');
  const [cropType, setCropType] = useState('');
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const data = await api.getSOPs();
      setRegions(data.filters_available?.regions || []);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!observation.trim()) return;
    
    setLoading(true);
    try {
      const result = await api.submitObservation(observation, region, cropType);
      onSubmit(result);
    } catch (error) {
      console.error('Error submitting observation:', error);
      alert('Failed to submit observation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🌱 Field Observation</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="observation">Observation</label>
          <textarea
            id="observation"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Describe what you observed in the field..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="region">Region (optional)</label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">All regions</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="cropType">Crop/Forest Type (optional)</label>
          <input
            id="cropType"
            type="text"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            placeholder="e.g., Pine plantation, Row crops"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Analyzing...' : 'Find Matching SOPs'}
        </button>
      </form>
    </div>
  );
}

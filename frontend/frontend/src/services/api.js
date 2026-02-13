const API_BASE = 'http://localhost:5000';

export const api = {
  async submitObservation(observation, region, crop_type) {
    const response = await fetch(`${API_BASE}/field-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ observation, region, crop_type })
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit observation');
    }
    
    return response.json();
  },

  async getRecommendation(note_id, doc_id) {
    const response = await fetch(
      `${API_BASE}/recommendation?note_id=${note_id}&doc_id=${doc_id}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get recommendation');
    }
    
    return response.json();
  },

  async getSOPs(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}/sops?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to get SOPs');
    }
    
    return response.json();
  },

  async getMapState(plot_id = null) {
    const url = plot_id 
      ? `${API_BASE}/map-state?plot_id=${plot_id}`
      : `${API_BASE}/map-state`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to get map state');
    }
    
    return response.json();
  }
};

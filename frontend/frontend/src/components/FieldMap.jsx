import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../services/api';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function FieldMap() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlots();
    const interval = setInterval(loadPlots, 10000); 
    return () => clearInterval(interval);
  }, []);

  const loadPlots = async () => {
    try {
      const data = await api.getMapState();
      setPlots(data.plots || []);
    } catch (error) {
      console.error('Error loading plots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2>🗺️ Field Locations</h2>
        <div className="loading">Loading map data...</div>
      </div>
    );
  }

  // Center on first plot or default
  const center = plots.length > 0 
    ? [plots[0].coordinates.latitude, plots[0].coordinates.longitude]
    : [20, 0];

  return (
    <div className="card">
      <h2>🗺️ Field Locations</h2>
      <div className="map-container">
        <MapContainer center={center} zoom={3} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {plots.map(plot => (
            <Marker
              key={plot.plot_id}
              position={[plot.coordinates.latitude, plot.coordinates.longitude]}
            >
              <Popup>
                <div className="popup-content">
                  <div className="popup-title">{plot.name}</div>
                  <div className="popup-info">
                    {plot.region} • {plot.crop_type}<br />
                    {plot.hectares} hectares
                  </div>
                  
                  {plot.last_observation && (
                    <div className="popup-observation">
                      <strong>Latest Observation:</strong><br />
                      {plot.last_observation.text}
                    </div>
                  )}
                  
                  {plot.active_recommendation && (
                    <div className="popup-rec">
                      <strong>Active Recommendation</strong>
                      <span className={`severity-badge severity-${plot.active_recommendation.severity}`}>
                        {plot.active_recommendation.severity}
                      </span>
                      <br />
                      {plot.active_recommendation.title}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

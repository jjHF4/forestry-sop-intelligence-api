import { store } from "../data/store.js";

export function initializePlots() {
  const samplePlots = [
    {
      plot_id: "plot-001",
      name: "North Block A",
      region: "India",
      crop_type: "Pine plantation",
      coordinates: { latitude: 18.5204, longitude: 73.8567 },
      hectares: 45.2
    },
    {
      plot_id: "plot-002",
      name: "South Valley",
      region: "North America",
      crop_type: "Row crops",
      coordinates: { latitude: 41.8781, longitude: -87.6298 },
      hectares: 32.8
    },
    {
      plot_id: "plot-003",
      name: "East Ridge",
      region: "Europe",
      crop_type: "Mixed forest",
      coordinates: { latitude: 48.8566, longitude: 2.3522 },
      hectares: 67.5
    }
  ];

  samplePlots.forEach(p =>
    store.plots.set(p.plot_id, p)
  );
}

import { store } from "../data/store.js";

function buildPlotResponse(plot) {
  let latestNote = null;

  for (const [noteId, note] of store.fieldNotes.entries()) {
    if (
      note.region === plot.region &&
      note.crop_type === plot.crop_type
    ) {
      if (
        !latestNote ||
        note.timestamp > latestNote.timestamp
      ) {
        latestNote = { ...note, note_id: noteId };
      }
    }
  }

  const response = {
    plot_id: plot.plot_id,
    name: plot.name,
    region: plot.region,
    crop_type: plot.crop_type,
    coordinates: plot.coordinates,
    hectares: plot.hectares
  };

  if (latestNote) {
    response.last_observation = {
      note_id: latestNote.note_id,
      text: latestNote.observation,
      timestamp: latestNote.timestamp
    };

    if (
      latestNote.matches &&
      latestNote.matches.length > 0
    ) {
      const top = latestNote.matches[0];

      response.active_recommendation = {
        doc_id: top.id,
        title: top.title,
        severity:
          top.relevance_score > 70
            ? "high"
            : "medium",
        bullets: [top.evidence_snippet]
      };
    }
  }

  return response;
}

export function getMapState(req, res) {
  try {
    const { plot_id } = req.query;

    const plots = [];

    if (plot_id) {
      const plot = store.plots.get(plot_id);
      if (plot)
        plots.push(buildPlotResponse(plot));
    } else {
      store.plots.forEach(plot =>
        plots.push(buildPlotResponse(plot))
      );
    }

    res.json({ plots });

  } catch (err) {
    console.error("Map controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

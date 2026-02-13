import { v4 as uuidv4 } from "uuid";
import { store } from "../data/store.js";
import { getEmbedding } from "../services/embedding.service.js";
import { cosineSimilarity } from "../utils/similarity.js";
import { extractEvidence } from "../utils/evidence.js";

export async function submitFieldNote(req, res) {
  try {
    const { observation, region, crop_type } = req.body;

    if (!observation)
      return res.status(400).json({ error: "Observation required" });

    const noteId = `note-${uuidv4()}`;

    const queryEmb = await getEmbedding(noteId, observation);

    const scored = [];

    for (const sop of store.sops) {
      if (region && sop.region !== region) continue;
      if (crop_type && sop.crop_or_forest_type !== crop_type) continue;

      const emb = await getEmbedding(sop.id, sop.text);

      const score = cosineSimilarity(queryEmb, emb) * 100;

      if (score > 30) {
        const ev = extractEvidence(sop.text, observation);

        scored.push({
          id: sop.id,
          title: sop.title,
          relevance_score: Math.round(score),
          evidence_snippet: ev.snippet
        });
      }
    }

    scored.sort((a, b) => b.relevance_score - a.relevance_score);

    store.fieldNotes.set(noteId, {
      observation,
      region,
      crop_type,
      matches: scored
    });

    res.json({ note_id: noteId, matches: scored.slice(0, 5) });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

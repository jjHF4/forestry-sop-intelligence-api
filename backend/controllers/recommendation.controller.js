import { store } from "../data/store.js";
import { v4 as uuidv4 } from "uuid";
import { generateRecommendation } from "../services/llm.service.js";

export async function recommendation(req, res) {
  try {
    const { note_id, doc_id } = req.query;

    if (!note_id || !doc_id) {
      return res.status(400).json({
        error: "note_id and doc_id required"
      });
    }

    const note = store.fieldNotes.get(note_id);
    const sop = store.sops.find(s => s.id === doc_id);

    if (!note || !sop) {
      return res.status(404).json({
        error: "Note or SOP not found"
      });
    }

    // 🔹 Call AI service
    const result = await generateRecommendation(
      note,
      sop
    );

    res.json({
      recommendation_id: `rec-${uuidv4()}`,
      doc_id,
      bullets: result.bullets,
      citations: result.citations,
      fallback_used: result.fallbackUsed,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error(
      "Recommendation controller error:",
      error
    );

    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}

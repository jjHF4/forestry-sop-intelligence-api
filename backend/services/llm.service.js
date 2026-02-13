import { client, llmDeployment } from "../config/azure.js";

/**
 * Generate actionable recommendations from SOP + observation
 */
export async function generateRecommendation(note, sop) {
  let bullets = [];
  let citations = [];
  let fallbackUsed = false;

  try {
    const prompt = `
Based on this field observation:
"${note.observation}"

And this SOP text:
${sop.text}

Generate 3-5 specific, actionable bullet points.

Return ONLY JSON:

{
  "bullets": ["action 1", "action 2"]
}
`;

    const completion = await client.getChatCompletions(
      llmDeployment,
      [{ role: "user", content: prompt }],
      {
        max_completion_tokens: 500
      }
    );

    const text = completion.choices[0].message.content.trim();

    const parsed = JSON.parse(text);

    bullets = parsed.bullets || [];

    // 🔹 Build citations
    bullets.forEach((bullet, i) => {
      const match = bullet.match(/"([^"]+)"/);

      if (match) {
        const quoted = match[1];
        const idx = sop.text.indexOf(quoted);

        if (idx !== -1) {
          citations.push({
            bullet_index: i,
            quoted_text: quoted,
            source_char_range: [
              idx,
              idx + quoted.length
            ],
            confidence: "high"
          });
        }
      } else {
        // soft match fallback
        const word = bullet
          .split(" ")
          .find(w => w.length > 5);

        if (word) {
          const idx = sop.text
            .toLowerCase()
            .indexOf(word.toLowerCase());

          if (idx !== -1) {
            const snippet = sop.text.substring(
              idx,
              Math.min(idx + 80, sop.text.length)
            );

            citations.push({
              bullet_index: i,
              quoted_text: snippet,
              source_char_range: [
                idx,
                idx + snippet.length
              ],
              confidence: "medium"
            });
          }
        }
      }
    });

  } catch (err) {
    console.error("LLM failed — fallback mode:", err);
    fallbackUsed = true;

    // 🔹 Fallback: extract SOP sentences
    const sentences =
      sop.text.match(/[^.!?]+[.!?]+/g) || [];

    const steps = sentences.filter(s =>
      s.includes("Step")
    );

    bullets =
      steps.length > 0
        ? steps.slice(0, 5)
        : sentences.slice(0, 3);

    bullets.forEach((b, i) => {
      const idx = sop.text.indexOf(b);

      if (idx !== -1) {
        citations.push({
          bullet_index: i,
          quoted_text: b.trim(),
          source_char_range: [
            idx,
            idx + b.length
          ],
          confidence: "high"
        });
      }
    });
  }

  return {
    bullets,
    citations,
    fallbackUsed
  };
}

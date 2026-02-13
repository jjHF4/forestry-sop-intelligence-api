export function extractEvidence(text, query) {
  const idx = text
    .toLowerCase()
    .indexOf(query.split(" ")[0]);

  return {
    snippet: text.substring(idx, idx + 200) + "...",
    char_start: idx,
    char_end: idx + 200
  };
}

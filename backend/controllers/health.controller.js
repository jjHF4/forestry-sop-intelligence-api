import { store } from "../data/store.js";

export function healthCheck(req, res) {
  res.json({
    status: "ok",
    sops: store.sops.length,
    embeddings: store.sopEmbeddings.size
  });
}

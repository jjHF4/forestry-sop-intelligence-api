import { client, embeddingDeployment } from "../config/azure.js";
import { store } from "../data/store.js";

export async function getEmbedding(id, text) {
  if (store.sopEmbeddings.has(id))
    return store.sopEmbeddings.get(id);

  try {
    const res = await client.getEmbeddings(embeddingDeployment, [text]);

    const emb = res.data[0].embedding;

    store.sopEmbeddings.set(id, emb);

    return emb;

  } catch (err) {
    console.error("Embedding error:", err);
    return null;
  }
}


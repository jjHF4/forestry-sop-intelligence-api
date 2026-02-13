import { readFileSync } from "fs";
import { store } from "../data/store.js";
import { getEmbedding } from "./embedding.service.js";
import { initializePlots } from "./plot.service.js";

export async function loadSOPs() {
  try {
    const data = JSON.parse(
      readFileSync("./dataset/sop.json", "utf-8")
    );

    store.sops = data.documents || [];

    console.log(`✅ Loaded ${store.sops.length} SOPs`);

    for (let i = 0; i < Math.min(50, store.sops.length); i++) {
      const sop = store.sops[i];
      await getEmbedding(sop.id, sop.text);
    }

    initializePlots();

  } catch (err) {
    console.error("SOP load error:", err);
  }
}

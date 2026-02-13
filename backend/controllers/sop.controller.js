import { store } from "../data/store.js";

export function browseSOPs(req, res) {
  try {
    const {
      region,
      domain,
      category,
      crop_type,
      limit = 10
    } = req.query;

    let filtered = store.sops;

    if (region)
      filtered = filtered.filter(s => s.region === region);

    if (domain)
      filtered = filtered.filter(s => s.domain === domain);

    if (category)
      filtered = filtered.filter(s => s.category === category);

    if (crop_type)
      filtered = filtered.filter(
        s => s.crop_or_forest_type === crop_type
      );

    const results = filtered.slice(0, parseInt(limit));

    const regions = [...new Set(store.sops.map(s => s.region))];
    const domains = [...new Set(store.sops.map(s => s.domain))];
    const categories = [...new Set(store.sops.map(s => s.category))];

    res.json({
      total: filtered.length,
      sops: results.map(s => ({
        id: s.id,
        title: s.title,
        region: s.region,
        domain: s.domain,
        category: s.category,
        crop_or_forest_type: s.crop_or_forest_type,
        keywords: s.keywords,
        preview: s.text.substring(0, 150) + "..."
      })),
      filters_available: {
        regions,
        domains,
        categories
      }
    });

  } catch (err) {
    console.error("SOP controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

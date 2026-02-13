import express from "express";
import cors from "cors";

import fieldRoutes from "./routes/field.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import sopRoutes from "./routes/sop.routes.js";
import mapRoutes from "./routes/map.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/field-note", fieldRoutes);
app.use("/recommendation", recommendationRoutes);
app.use("/sops", sopRoutes);
app.use("/map-state", mapRoutes);
app.use("/health", healthRoutes);

export default app;

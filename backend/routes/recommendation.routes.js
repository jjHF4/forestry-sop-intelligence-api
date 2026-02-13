import express from "express";
import { recommendation } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/", recommendation);

export default router;

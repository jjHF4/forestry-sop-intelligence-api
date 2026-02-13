import express from "express";
import { getMapState } from "../controllers/map.controller.js";

const router = express.Router();

router.get("/", getMapState);

export default router;

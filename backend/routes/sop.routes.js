import express from "express";
import { browseSOPs } from "../controllers/sop.controller.js";

const router = express.Router();

router.get("/", browseSOPs);

export default router;

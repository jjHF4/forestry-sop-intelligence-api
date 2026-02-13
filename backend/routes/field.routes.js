import express from "express";
import { submitFieldNote } from "../controllers/field.controller.js";

const router = express.Router();

router.post("/", submitFieldNote);

export default router;

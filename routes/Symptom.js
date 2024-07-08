import express from "express";
import { getSymptoms, addSymptom } from "../controllers/symptomController.js";

const router = express.Router();

// POST route to add symptom data
router.post("/", addSymptom);

// GET route to retrieve all symptom data
router.get("/", getSymptoms);

export default router;

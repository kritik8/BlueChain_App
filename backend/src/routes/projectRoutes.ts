import express from "express";
import { createProject } from "../controllers/projectController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Only authenticated generators can create projects
router.post("/", protect, createProject);

export default router;

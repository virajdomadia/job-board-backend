import express from "express";
import {
  createJob,
  getJob,
  getJobById,
  updateJob,
  deleteJob,
} from "../controller/jobController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isEmployer } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, isEmployer, createJob);
router.get("/", protect, getJob);
router.get("/:id", protect, getJobById);
router.put("/:id", protect, isEmployer, updateJob);
router.delete("/:id", protect, isEmployer, deleteJob);

export default router;

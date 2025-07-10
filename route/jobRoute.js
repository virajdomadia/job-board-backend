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
import { validateJobPost } from "../validators/jobValidator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/", protect, isEmployer, validateJobPost, validate, createJob);
router.get("/", protect, getJob);
router.get("/:id", protect, getJobById);
router.put("/:id", protect, isEmployer, validateJobPost, validate, updateJob);
router.delete("/:id", protect, isEmployer, deleteJob);

export default router;

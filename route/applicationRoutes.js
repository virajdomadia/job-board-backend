import express from "express";
import {
  applyToJob,
  getAllApplications,
  getMyApplications,
  updateApplicationStatus,
} from "../controller/applicationController.js";
import protect from "../middleware/authMiddleware.js";
import { isSeeker, isEmployer } from "../middleware/roleMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/apply", protect, isSeeker, upload.single("resume"), applyToJob);
router.get("/", protect, isEmployer, getAllApplications);
router.get("/me", protect, isSeeker, getMyApplications);
router.put("/:id/status", protect, isEmployer, updateApplicationStatus);

export default router;

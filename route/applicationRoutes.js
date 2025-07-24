import express from "express";
import {
  applyToJob,
  getAllApplications,
  getMyApplications,
  updateApplicationStatus,
  checkIfApplied,
} from "../controller/applicationController.js";
import protect from "../middleware/authMiddleware.js";
import { isSeeker, isEmployer } from "../middleware/roleMiddleware.js";
import upload from "../middleware/upload.js";
import { validateApplication } from "../validators/applicationValidator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// Seeker applies to job
router.post(
  "/apply",
  protect,
  isSeeker,
  upload.single("resume"),
  validateApplication,
  validate,
  applyToJob
);

// Employer views applications
router.get("/employer", protect, isEmployer, getAllApplications);

// Seeker views own applications
router.get("/me", protect, isSeeker, getMyApplications);

// Employer updates status + optional notes
router.put("/:id/status", protect, isEmployer, updateApplicationStatus);

// Seeker checks if already applied
router.get("/check/:jobId", protect, isSeeker, checkIfApplied);

export default router;

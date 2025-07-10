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
import { validateApplication } from "../validators/applicationValidator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/apply",
  protect,
  isSeeker,
  upload.single("resume"),
  validateApplication,
  validate,
  applyToJob
);
router.get("/", protect, isEmployer, getAllApplications);
router.get("/me", protect, isSeeker, getMyApplications);
router.put("/:id/status", protect, isEmployer, updateApplicationStatus);

export default router;

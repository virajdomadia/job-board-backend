import express from "express";
import {
  applyToJob,
  getAllApplications,
  getMyApplications,
  updateApplicationStatus,
} from "../controller/applicationController.js";
import protect from "../middleware/authMiddleware.js";
import { isSeeker, isEmployer } from "../middleware/roleMiddleware.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/", protect, isSeeker, upload.single("resume"), applyToJob);
router.get("/", protect, getAllApplications); // Optional: add role-based access
router.get("/me", protect, isSeeker, getMyApplications);
router.put("/:id/status", protect, isEmployer, updateApplicationStatus);

export default router;

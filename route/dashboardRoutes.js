import express from "express";
import {
  getEmployerDashboard,
  getSeekerDashboard,
} from "../controller/dashboardController.js";
import protect from "../middleware/authMiddleware.js";
import { isEmployer, isSeeker } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/employer", protect, isEmployer, getEmployerDashboard);
router.get("/seeker", protect, isSeeker, getSeekerDashboard);

export default router;

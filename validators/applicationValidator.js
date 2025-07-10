import { body } from "express-validator";

export const validateApplication = [
  body("jobId").notEmpty().withMessage("Job ID is required"),
  body("coverLetter")
    .isLength({ min: 10 })
    .withMessage("Cover letter must be at least 10 characters")
    .optional(),
];

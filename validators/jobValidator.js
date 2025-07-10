import { body } from "express-validator";

export const validateJobPost = [
  body("title").notEmpty().withMessage("Job title is required"),
  body("description").notEmpty().withMessage("Job description is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("salary")
    .isNumeric()
    .withMessage("Salary must be a number")
    .optional({ nullable: true }),
];

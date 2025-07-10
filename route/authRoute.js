import express from "express";
import { register, login } from "../controller/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../validators/userValidator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/register", validateRegister, validate, register);
router.post("/login", validateLogin, validate, login);

export default router;

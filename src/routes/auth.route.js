import { Router } from "express";
import { body } from "express-validator";
import {
  exampleProtectedRoute,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import validationResultExpress from "../middlewares/validationResultExpress.js";

const router = Router();

router.post(
  "/register",
  [
    body("email", "Invalid email").trim().isEmail().normalizeEmail(),
    body("userName", "Minimum 4 characters").trim().isLength({ min: 6 }),
    body("userName", "Maximum 15 characters").trim().isLength({ max: 15 }),
    body("password", "Minimum 6 characters").trim().isLength({ min: 6 }),
    body("password", "Maximum 20 characters").trim().isLength({ max: 20 }),
  ],
  validationResultExpress,
  register
);

router.post(
  "/login",
  [
    body("email", "Invalid email").trim().isEmail().normalizeEmail(),
    body("password", "Minimum 6 characters").trim().isLength({ min: 6 }),
    body("password", "Maximum 20 characters").trim().isLength({ max: 20 }),
  ],
  validationResultExpress,
  login
);

router.post("/logout", logout);

router.post("/protectedExample", [requireToken], exampleProtectedRoute);

export default router;

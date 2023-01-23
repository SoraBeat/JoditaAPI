import { Router } from "express";
import { body } from "express-validator";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import { requireToken } from "../middlewares/requireToken.js";
import { requireAdminPermissions } from "../middlewares/requireAdminPermission.js";
import { postBell } from "../controllers/bell.controller.js";
const router = Router();

router.post(
  "/bell",
  [
    body("title", "Minimum 3 characters").trim().isLength({ min: 3 }),
    body("title", "Maximum 20 characters").trim().isLength({ max: 20 }),
    body("message", "Maximum 150 characters").trim().isLength({ max: 150 }),
    body("message", "Maximum 5 characters").trim().isLength({ min: 5 }),
    body("datetime", "The format of date is wrong").trim().isDate(),
    requireToken,
    requireAdminPermissions,
  ],
  validationResultExpress,
  postBell
);

export default router;
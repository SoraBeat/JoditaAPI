import { Router } from "express";
import { body } from "express-validator";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import { requireToken } from "../middlewares/requireToken.js";
import { postMessage } from "../controllers/messages.controller.js";
const router = Router();

router.post(
  "/message",
  [
    body("userId")
    .trim()
    .isLength({ isLength: 24 })
    .withMessage("The userId param is incorrect, have to be 24 characters"),
    body("content", "Minimum 1 characters").trim().isLength({ min: 1 }),
    body("content", "Maximum 250 characters").trim().isLength({ max: 250 }),
    body("datetime", "The format of date is wrong").trim().isDate(),
    requireToken,
  ],
  validationResultExpress,
  postMessage
);

export default router;
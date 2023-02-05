import { Router } from "express";
import { body } from "express-validator";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import { requireToken } from "../middlewares/requireToken.js";
import {
  getMessages,
  postMessage,
} from "../controllers/messages.controller.js";
import { imageValidator } from "../middlewares/imageValidator.js";
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
    requireToken,
    imageValidator,
  ],
  validationResultExpress,
  postMessage
);

router.get("/messages", [requireToken], validationResultExpress, getMessages);

export default router;

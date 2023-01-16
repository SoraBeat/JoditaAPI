import { Router } from "express";
import { body } from "express-validator";
import { requireToken } from "../middlewares/requireToken.js";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import {
  reportPerson,
  reportProblem,
} from "../controllers/report.controller.js";

const router = Router();

//Report user
router.post(
  "/reportPerson",
  [
    body("userId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The userId param is incorrect, have to be 24 characters"),
    requireToken,
  ],
  validationResultExpress,
  reportPerson
);
//Report problem
router.post(
  "/reportProblem",
  [
    body("userId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The userId param is incorrect, have to be 24 characters"),
    body("problemType")
      .trim()
      .isLength({ max: 15 })
      .withMessage("Maximum 15 characters"),
    body("problemType")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Minimum 3 characters"),
    body("description")
      .trim()
      .isLength({ max: 100 })
      .withMessage("Maximum 100 characters"),
    requireToken,
  ],
  validationResultExpress,
  reportProblem
);

export default router;

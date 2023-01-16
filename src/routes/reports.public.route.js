import { Router } from "express";
import { body } from "express-validator";
import { requireToken } from "../middlewares/requireToken.js";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import { reportPerson } from "../controllers/report.controller.js";

const router = Router();

//Follow user
router.put(
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

export default router;
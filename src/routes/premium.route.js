import { Router } from "express";
import { body } from "express-validator";
import { requireToken } from "../middlewares/requireToken.js";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import {
  addPremium,
  removePremium,
} from "../controllers/premium.controller.js";
import { requireAdminPermissions } from "../middlewares/requireAdminPermission.js";

const router = Router();

//Add premium
router.put(
  "/addPremium",
  [
    body("userId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The fromId param is incorrect, have to be 24 characters"),
    requireToken,
    requireAdminPermissions,
  ],
  validationResultExpress,
  addPremium
);

//Remove premium
router.put(
  "/removePremium",
  [
    body("userId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The fromId param is incorrect, have to be 24 characters"),
    requireToken,
    requireAdminPermissions,
  ],
  validationResultExpress,
  removePremium
);
export default router;

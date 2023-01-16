import { Router } from "express";
import { query } from "express-validator";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import { requireToken } from "../middlewares/requireToken.js";

import {
  getUserPublic,
  getUsersPublic,
} from "../controllers/user.controller.js";

const router = Router();
//Get all users
router.get(
  "/users",
  [
    query("search")
      .trim()
      .isLength({ max: 15 })
      .withMessage("The search query param is to loong max 15 characters"),
    requireToken,
  ],
  validationResultExpress,
  getUsersPublic
);

//Get user by id
router.get(
  "/user/:userId",
  [
    query("userId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The userId param is incorrect, have to be 24 characters"),
    requireToken,
  ],
  validationResultExpress,
  getUserPublic
);

export default router;

import { Router } from "express";
import { body } from "express-validator";
import { requireToken } from "../middlewares/requireToken.js";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import { follow, unfollow } from "../controllers/follow.controller.js";

const router = Router();

//Follow user
router.put(
  "/follow",
  [
    body("userId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The userId param is incorrect, have to be 24 characters"),
    requireToken,
  ],
  validationResultExpress,
  follow
);
//Unfollow user
router.put(
  "/unfollow",
  [
    body("userId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The userId param is incorrect, have to be 24 characters"),
    requireToken,
  ],
  validationResultExpress,
  unfollow
);

export default router;

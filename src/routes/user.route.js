import { Router } from "express";
import { query, body } from "express-validator";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import { requireToken } from "../middlewares/requireToken.js";
import { requireAdminPermissions } from "../middlewares/requireAdminPermission.js";

import {
  getUsers,
  getUser,
  postUser,
  deleteUser,
  putUser,
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
    requireAdminPermissions,
  ],
  validationResultExpress,
  getUsers
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
    requireAdminPermissions,
  ],
  validationResultExpress,
  getUser
);
//Create user
router.post(
  "/user",
  [
    body("email", "Invalid email").trim().isEmail().normalizeEmail(),
    body("userName", "Minimum 4 characters").trim().isLength({ min: 6 }),
    body("userName", "Maximum 15 characters").trim().isLength({ max: 15 }),
    body("password", "Minimum 6 characters").trim().isLength({ min: 6 }),
    body("password", "Maximum 20 characters").trim().isLength({ max: 20 }),
    body("isAdmin", "IsAdmin value has to be Boolean").isBoolean().exists(),
    body("isPremium", "isPremium value has to be Boolean").isBoolean().exists(),
    requireToken,
    requireAdminPermissions,
  ],
  validationResultExpress,
  postUser
);
//Delete user by id
router.delete(
  "/user/:userId",
  [
    query("userId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The userId param is incorrect, have to be 24 characters"),
    requireToken,
    requireAdminPermissions,
  ],
  validationResultExpress,
  deleteUser
);
//Create user
router.put(
  "/user/:userId",
  [
    body("email", "Invalid email").trim().isEmail().normalizeEmail(),
    body("userName", "Minimum 4 characters").trim().isLength({ min: 6 }),
    body("userName", "Maximum 15 characters").trim().isLength({ max: 15 }),
    body("password", "Minimum 6 characters").trim().isLength({ min: 6 }),
    body("password", "Maximum 20 characters").trim().isLength({ max: 20 }),
    body("isAdmin", "IsAdmin value has to be Boolean").isBoolean().exists(),
    body("isPremium", "isPremium value has to be Boolean").isBoolean().exists(),
    query("userId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The userId param is incorrect, have to be 24 characters"),
    requireToken,
    requireAdminPermissions,
  ],
  validationResultExpress,
  putUser
);

export default router;

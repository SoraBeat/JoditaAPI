import { Router } from "express";
import { query, body } from "express-validator";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import { requireToken } from "../middlewares/requireToken.js";
import { requireAdminPermissions } from "../middlewares/requireAdminPermission.js";
import { imageValidator } from "../middlewares/imageValidator.js";
import {
  deleteEvent,
  getEvents,
  postEvent,
  putEvent,
  getEvent,
} from "../controllers/events.controller.js";

const router = Router();
//Get all events
router.get(
  "/events",
  [
    query("search")
      .trim()
      .isLength({ max: 20 })
      .withMessage("The search query param is to loong max 20 characters"),
    query("eventType")
      .trim()
      .isLength({ max: 15 })
      .withMessage("The search query param is to loong max 15 characters"),
    requireToken,
    requireAdminPermissions,
  ],
  validationResultExpress,
  getEvents
);
//Get event by id
router.get(
  "/event/:eventId",
  [
    query("eventId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The eventId param is incorrect, have to be 24 characters"),
    requireToken,
    requireAdminPermissions,
  ],
  validationResultExpress,
  getEvent
);
//Create event
router.post(
  "/event",
  [
    body("userId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The userId param is incorrect, have to be 24 characters"),
    body("title", "Minimum 5 characters").trim().isLength({ min: 5 }),
    body("title", "Maximum 20 characters").trim().isLength({ max: 20 }),
    body("description", "Minimum 10 characters").trim().isLength({ min: 10 }),
    body("description", "Maximum 100 characters").trim().isLength({ max: 100 }),
    body("place", "Minimum 1 character").trim().isLength({ min: 1 }),
    body("place", "Maximum 100 characters").trim().isLength({ max: 100 }),
    body("eventType", "Minimum 5 characters").trim().isLength({ min: 5 }),
    body("eventType", "Maximum 15 characters").trim().isLength({ max: 15 }),
    body("capacity", "Minumum 1 Maximum 99999 of capacity")
      .trim()
      .isNumeric()
      .isLength({ min: 1, max: 5 }),
    body("tags", "Maximum 3 tags").isArray({ max: 3 }),
    body("datetime", "The format of date is wrong").trim().isDate(),
    body("price", "Minimum $0 Maximum $99.999")
      .trim()
      .isNumeric()
      .isLength({ min: 0, max: 5 }),
    body("isPremium", "isPremium value is not boolean").isBoolean(),
    imageValidator,
    requireToken,
    requireAdminPermissions,
  ],
  validationResultExpress,
  postEvent
);
//Edit event
router.put(
  "/event/:eventId",
  [
    query("eventId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The eventId param is incorrect, have to be 24 characters"),
    body("userId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The userId param is incorrect, have to be 24 characters"),
    body("title", "Minimum 5 characters").trim().isLength({ min: 5 }),
    body("title", "Maximum 20 characters").trim().isLength({ max: 20 }),
    body("description", "Minimum 10 characters").trim().isLength({ min: 10 }),
    body("description", "Maximum 100 characters").trim().isLength({ max: 100 }),
    body("place", "Minimum 1 character").trim().isLength({ min: 1 }),
    body("place", "Maximum 100 characters").trim().isLength({ max: 100 }),
    body("eventType", "Minimum 5 characters").trim().isLength({ min: 5 }),
    body("eventType", "Maximum 15 characters").trim().isLength({ max: 15 }),
    body("capacity", "Minumum 1 Maximum 99999 of capacity")
      .trim()
      .isNumeric()
      .isLength({ min: 1, max: 5 }),
    body("tags", "Maximum 3 tags").isArray({ max: 3 }),
    body("datetime", "The format of date is wrong").trim().isDate(),
    body("price", "Minimum $0 Maximum $99.999")
      .trim()
      .isNumeric()
      .isLength({ min: 0, max: 5 }),
    body("isPremium", "isPremium value is not boolean").isBoolean(),
    imageValidator,
    requireToken,
    requireAdminPermissions,
  ],
  validationResultExpress,
  putEvent
);

//Delete event
router.delete(
  "/event/:eventId",
  [
    query("eventId")
      .trim()
      .isLength({ isLength: 24 })
      .withMessage("The eventId param is incorrect, have to be 24 characters"),
    requireToken,
    requireAdminPermissions,
  ],
  validationResultExpress,
  deleteEvent
);

export default router;

import { Router } from "express";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import { requireToken } from "../middlewares/requireToken.js";
import { getBell } from "../controllers/bell.controller.js";
const router = Router();

router.get(
  "/bell",
  [
    requireToken,
  ],
  validationResultExpress,
  getBell
);

export default router;
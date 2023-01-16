import { Router } from "express";
import { requireToken } from "../middlewares/requireToken.js";
import validationResultExpress from "../middlewares/validationResultExpress.js";
import {
  getReportedProblems,
  getReports,
} from "../controllers/report.controller.js";
import { requireAdminPermissions } from "../middlewares/requireAdminPermission.js";

const router = Router();

//Get the blacklist of users
router.get(
  "/reportPerson",
  [requireToken, requireAdminPermissions],
  validationResultExpress,
  getReports
);

//Get the reported problems
router.get(
  "/reportProblem",
  [requireToken, requireAdminPermissions],
  validationResultExpress,
  getReportedProblems
);

export default router;

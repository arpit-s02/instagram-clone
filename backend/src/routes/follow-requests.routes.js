import express from "express";
import followRequestStatusSchema from "../schemas/followRequestStatus.schema.js";
import { updateRequestStatus } from "../controllers/follow.controllers.js";
import { getMongoIdSchema } from "../schemas/mongoId.schema.js";
import validate from "../middlewares/validate.middleware.js";
import authenticate from "../middlewares/authenticate.middleware.js";

const router = express.Router();

router.use(authenticate);

router.patch(
  "/:followRequestId/status",
  validate(getMongoIdSchema("followRequestId"), "params"),
  validate(followRequestStatusSchema, "body"),
  updateRequestStatus
);

export default router;

import express from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import mongoIdSchema from "../schemas/mongoId.schema.js";
import followRequestStatusSchema from "../schemas/followRequestStatus.schema.js";
import {
  deleteFollower,
  unfollowUser,
  updateRequestStatus,
} from "../controllers/follow.controllers.js";

const router = express.Router();

router.use(authenticate);

router.patch(
  "/status/:id",
  validate(mongoIdSchema, "params"),
  validate(followRequestStatusSchema, "body"),
  updateRequestStatus
);

router.delete(
  "/followings/:id",
  validate(mongoIdSchema, "params"),
  unfollowUser
);

router.delete(
  "/followers/:id",
  validate(mongoIdSchema, "params"),
  deleteFollower
);

export default router;

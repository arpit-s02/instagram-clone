import express from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import mongoIdSchema from "../schemas/mongoId.schema.js";
import {
  deleteFollower,
  unfollowUser,
} from "../controllers/follow.controllers.js";

const router = express.Router();

router.use(authenticate);

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

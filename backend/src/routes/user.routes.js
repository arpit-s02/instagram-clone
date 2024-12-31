import express from "express";
import validate from "../middlewares/validate.middleware.js";
import registerSchema from "../schemas/register.schema.js";
import loginSchema from "../schemas/login.schema.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import { getMongoIdSchema } from "../schemas/mongoId.schema.js";
import { getUploads } from "../controllers/post.controllers.js";
import {
  getFollowings,
  getFollowRequestDetails,
  sendFollowRequest,
} from "../controllers/follow.controllers.js";
import {
  getAuthenticatedUserDetails,
  getUserDetails,
  signin,
  signup,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/register", validate(registerSchema, "body"), signup);

router.post("/login", validate(loginSchema, "body"), signin);

router.use(authenticate);

router.get("/me", getAuthenticatedUserDetails);

router.get("/:username", getUserDetails);

router.get("/:username/uploads", getUploads);

router.get("/:username/followings", getFollowings);

router.post(
  "/:followingId/follow",
  validate(getMongoIdSchema("followingId"), "params"),
  sendFollowRequest
);

router.get(
  "/:followingId/follow",
  validate(getMongoIdSchema("followingId"), "params"),
  getFollowRequestDetails
);

export default router;

import express from "express";
import validate from "../middlewares/validate.middleware.js";
import registerSchema from "../schemas/register.schema.js";
import loginSchema from "../schemas/login.schema.js";
import { signin, signup } from "../controllers/user.controllers.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import {
  getFollowRequestDetails,
  sendFollowRequest,
} from "../controllers/follow.controllers.js";
import { getMongoIdSchema } from "../schemas/mongoId.schema.js";

const router = express.Router();

router.post("/register", validate(registerSchema, "body"), signup);

router.post("/login", validate(loginSchema, "body"), signin);

router.use(authenticate);

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

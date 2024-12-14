import express from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { deleteFollower } from "../controllers/follow.controllers.js";
import { getMongoIdSchema } from "../schemas/mongoId.schema.js";

const router = express.Router();

router.use(authenticate);

router.delete(
  "/:followerId",
  validate(getMongoIdSchema("followerId"), "params"),
  deleteFollower
);

export default router;

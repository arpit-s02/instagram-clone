import express from "express";
import validate from "../middlewares/validate.middleware.js";
import { deleteFromFollowings } from "../controllers/follow.controllers.js";
import { getMongoIdSchema } from "../schemas/mongoId.schema.js";
import authenticate from "../middlewares/authenticate.middleware.js";

const router = express.Router();

router.use(authenticate);

router.delete(
  "/:followingId",
  validate(getMongoIdSchema("followingId"), "params"),
  deleteFromFollowings
);

export default router;

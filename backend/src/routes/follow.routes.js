import express from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import mongoIdSchema from "../schemas/mongoId.schema.js";
import { deleteFollower } from "../controllers/follow.controllers.js";

const router = express.Router();

router.use(authenticate);

router.delete(
  "/followers/:id",
  validate(mongoIdSchema, "params"),
  deleteFollower
);

export default router;

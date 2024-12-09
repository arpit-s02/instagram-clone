import express from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import { sendFollowRequest } from "../controllers/follow.controllers.js";
import validate from "../middlewares/validate.middleware.js";
import mongoIdSchema from "../schemas/mongoId.schema.js";

const router = express.Router();

router.use(authenticate);

router.post("/new", validate(mongoIdSchema, "body"), sendFollowRequest);

export default router;

import express from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import mongoIdSchema from "../schemas/mongoId.schema.js";
import followRequestStatusSchema from "../schemas/followRequestStatus.schema.js";
import {
    sendFollowRequest,
    unfollowUser,
    updateRequestStatus,
} from "../controllers/follow.controllers.js";

const router = express.Router();

router.use(authenticate);

router.post("/new", validate(mongoIdSchema, "body"), sendFollowRequest);
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

export default router;

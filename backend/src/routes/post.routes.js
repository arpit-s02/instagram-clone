import express from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import mongoIdSchema from "../schemas/mongoId.schema.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createNewPost,
    getFeed,
    getPost,
    getPostLikes,
    getUploads,
} from "../controllers/post.controllers.js";

const router = express.Router();

router.use(authenticate);

router.get("/feed", getFeed);
router.get("/uploads", getUploads);
router.get("/:id", validate(mongoIdSchema, "params"), getPost);
router.get("/:id/likes", validate(mongoIdSchema, "params"), getPostLikes);

router.post("/create", upload.array("media"), createNewPost);

export default router;

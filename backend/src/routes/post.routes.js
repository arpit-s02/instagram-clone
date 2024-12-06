import express from "express";
import {
    createNewPost,
    getPost,
    getPostLikes,
    getUploads,
} from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import mongoIdSchema from "../schemas/mongoId.schema.js";

const router = express.Router();

router.use(authenticate);

router.get("/uploads", getUploads);
router.post("/create", upload.array("media"), createNewPost);
router.get("/:id", validate(mongoIdSchema, "params"), getPost);
router.get("/:id/likes", validate(mongoIdSchema, "params"), getPostLikes);

export default router;

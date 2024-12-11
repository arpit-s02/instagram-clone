import express from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import mongoIdSchema from "../schemas/mongoId.schema.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createNewPost,
    createPostLike,
    deletePost,
    deletePostLike,
    getPost,
    getPostLikes,
} from "../controllers/post.controllers.js";

const router = express.Router();

router.use(authenticate);

router.post("/", upload.array("media"), createNewPost);
router.get("/:id", validate(mongoIdSchema, "params"), getPost);
router.delete("/:id", validate(mongoIdSchema, "params"), deletePost);

router.get("/:id/likes", validate(mongoIdSchema, "params"), getPostLikes);
router.post("/:id/likes", validate(mongoIdSchema, "params"), createPostLike);
router.delete("/:id/likes", validate(mongoIdSchema, "params"), deletePostLike);

export default router;

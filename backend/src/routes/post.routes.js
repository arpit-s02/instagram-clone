import express from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { getMongoIdSchema } from "../schemas/mongoId.schema.js";
import postLikeRoutes from "./postLike.routes.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createNewPost,
  deletePost,
  getPost,
} from "../controllers/post.controllers.js";

const router = express.Router();

router.use(authenticate);

router.use(
  "/:postId/likes",
  validate(getMongoIdSchema("postId"), "params"),
  postLikeRoutes
);

router.post("/", upload.array("media"), createNewPost);

router.get("/:postId", validate(getMongoIdSchema("postId"), "params"), getPost);

router.delete(
  "/:postId",
  validate(getMongoIdSchema("postId"), "params"),
  deletePost
);

export default router;

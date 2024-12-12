import express from "express";
import validate from "../middlewares/validate.middleware.js";
import commentSchema from "../schemas/comment.schema.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import {
  createComment,
  deleteComment,
} from "../controllers/comment.controllers.js";
import mongoIdSchema from "../schemas/mongoId.schema.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(commentSchema, "body"), createComment);
router.delete("/:id", validate(mongoIdSchema, "params"), deleteComment);

export default router;

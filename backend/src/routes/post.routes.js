import express from "express";
import { createNewPost } from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import authenticate from "../middlewares/authenticate.middleware.js";

const router = express.Router();

router.use(authenticate);
router.post('/create', upload.array("media"), createNewPost);

export default router;
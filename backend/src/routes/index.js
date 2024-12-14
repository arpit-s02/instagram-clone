import express from "express";
import userRoutes from "./user.routes.js";
import postRoutes from "./post.routes.js";
import followRoutes from "./follow.routes.js";
import commentRoutes from "./comment.routes.js";
import followRequestRoutes from "./follow-requests.routes.js";
import followingRoutes from "./following.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/follow", followRoutes);
router.use("/comments", commentRoutes);
router.use("/follow-requests", followRequestRoutes);
router.use("/followings", followingRoutes);

export default router;

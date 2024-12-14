import express from "express";
import userRoutes from "./user.routes.js";
import postRoutes from "./post.routes.js";
import followRequestRoutes from "./follow-requests.routes.js";
import followingRoutes from "./following.routes.js";
import followerRoutes from "./follower.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/follow-requests", followRequestRoutes);
router.use("/followings", followingRoutes);
router.use("/followers", followerRoutes);

export default router;

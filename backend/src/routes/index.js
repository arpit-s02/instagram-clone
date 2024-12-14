import express from "express";
import userRoutes from "./user.routes.js";
import postRoutes from "./post.routes.js";
import followRoutes from "./follow.routes.js";
import commentRoutes from "./comment.routes.js";
import followRequestsRoutes from "./follow-requests.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/follow", followRoutes);
router.use("/comments", commentRoutes);
router.use("/follow-requests", followRequestsRoutes);

export default router;

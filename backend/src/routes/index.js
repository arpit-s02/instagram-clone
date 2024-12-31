import express from "express";
import userRoutes from "./user.routes.js";
import postRoutes from "./post.routes.js";
import followRequestRoutes from "./follow-requests.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/follow-requests", followRequestRoutes);

export default router;

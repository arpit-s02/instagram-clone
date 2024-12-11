import express from "express";
import validate from "../middlewares/validate.middleware.js";
import registerSchema from "../schemas/register.schema.js";
import { signin, signup } from "../controllers/user.controllers.js";
import loginSchema from "../schemas/login.schema.js";
import { getFeed, getUploads } from "../controllers/post.controllers.js";
import authenticate from "../middlewares/authenticate.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema, "body"), signup);
router.post("/login", validate(loginSchema, "body"), signin);

router.use(authenticate);

router.get("/feed", getFeed);
router.get("/uploads", getUploads);

export default router;

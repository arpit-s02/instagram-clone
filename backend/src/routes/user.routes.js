import express from "express";
import validate from "../middlewares/validate.middleware.js";
import registerSchema from "../schemas/register.schema.js";
import loginSchema from "../schemas/login.schema.js";
import { signin, signup } from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/register", validate(registerSchema, "body"), signup);
router.post("/login", validate(loginSchema, "body"), signin);

export default router;

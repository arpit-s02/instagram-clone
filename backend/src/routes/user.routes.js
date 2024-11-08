import express from "express";
import validate from "../middlewares/validate.middleware.js";
import registerSchema from "../schemas/register.schema.js";
import { signup } from "../controllers/signup.controllers.js";

const router = express.Router();

router.post("/register", validate(registerSchema, 'body'), signup);

export default router;
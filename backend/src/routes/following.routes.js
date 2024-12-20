import express from "express";
import authenticate from "../middlewares/authenticate.middleware.js";

const router = express.Router();

router.use(authenticate);

export default router;

import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    return res.send("Instagram app");
})

export default router;
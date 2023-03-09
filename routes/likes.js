import express from "express";

const router = express.Router();
import { toggleLike } from "../controllers/likes_controller.js";

router.post("/toggle", toggleLike);

export default router;

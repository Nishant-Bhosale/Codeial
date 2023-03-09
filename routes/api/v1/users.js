import express from "express";

const router = express.Router();
import { createSession } from "../../../controllers/api/v1/users_api.js";

router.post("/create-session", createSession);

export default router;

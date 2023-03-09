import express from "express";
const router = express.Router();
import passport from "passport";

import { create, destroy } from "../controllers/posts_controller.js";

router.post("/create", passport.checkAuthentication, create);
router.get("/destroy/:id", passport.checkAuthentication, destroy);
export default router;

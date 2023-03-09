import express from "express";
const router = express.Router();
import passport from "passport";

import {
  profile,
  update,
  create,
  signIn,
  signUp,
  createSession,
  destroySession,
} from "../controllers/users_controller.js";

router.get("/profile/:id", passport.checkAuthentication, profile);
router.post("/update/:id", passport.checkAuthentication, update);

router.get("/sign-up", signUp);
router.get("/sign-in", signIn);

router.post("/create", create);

// use passport as a middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  createSession
);

router.get("/sign-out", destroySession);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  createSession
);

export default router;

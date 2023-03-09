import express from "express";
import userRouter from "./users.js";
import postsRouter from "./posts.js";
import commentsRouter from "./comments.js";
import likesRouter from "./likes.js";
const router = express.Router();
import homeController from "../controllers/home_controller.js";

console.log("router loaded");

router.get("/", homeController);
router.use("/users", userRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);
router.use("/likes", likesRouter);

import api from "./api/index.js";
router.use("/api", api);

// for any further routes, access from here
// router.use('/routerName', require('./routerfile));

export default router;

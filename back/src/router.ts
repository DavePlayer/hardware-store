import express from "express";
import { loginRouter } from "./routes/loginRoutes.js";
import { registerRouter } from "./routes/registerRoutes.js";

export const router = express.Router();
router.use("/login", loginRouter);
router.use("/register", registerRouter);

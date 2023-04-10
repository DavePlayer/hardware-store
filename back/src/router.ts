import express from "express";
import { itemsRouter } from "./routes/itemsToures.js";
import { loginRouter } from "./routes/loginRoutes.js";
import { registerRouter } from "./routes/registerRoutes.js";

export const router = express.Router();
router.use("/login", loginRouter);
router.use("/register", registerRouter);
router.use("/items", itemsRouter);

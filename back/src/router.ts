import express from "express"
import { loginRouter } from "./routes/loginRoutes.js"

export const router = express.Router()
router.use("/login", loginRouter)
import { Router } from "express"
import { read } from "fs"

export const loginRouter = Router()

loginRouter.get("/", (req, res) => {
    const { login, password } = req.body
    if (!login || !password) return res.status(400).json({ error: "login or password is empty" })
    console.log(login, password)

    res.status(200).json({ sth: "ok" })
})
import { Router } from "express";
import { database } from "../index.js";

export const registerRouter = Router();

registerRouter.post("/", async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ error: "login or password is empty" });

    const user = await database.getUser(login, "users");
    if (user == null) database.saveUser({ login, password }, "users");
    else return res.status(406).json({ status: "user already exists" });

    res.status(200).json({ status: "user registered properly" });
});

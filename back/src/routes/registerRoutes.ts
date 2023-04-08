import { Router } from "express";
import { database } from "../index.js";

export const registerRouter = Router();

registerRouter.post("/", async (req, res) => {
    console.log(`registering new user`);
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ error: "login or password is empty" });

    try {
        const user = await database.getUser(login, "users");
        if (user == null || user == undefined) database.saveUser({ login, password }, "users");
        else return res.status(406).json({ status: "user already exists" });

        return res.status(200).json({ status: "user registered properly" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "internal server error" });
    }
});

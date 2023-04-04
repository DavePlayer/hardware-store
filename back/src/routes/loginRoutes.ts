import { Router } from "express";
import { database } from "../index.js";
import bcrypt from "bcrypt";

export const loginRouter = Router();

loginRouter.get("/", async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ error: "login or password is empty" });

    const dbuser = await database.getUser(login, "users");
    if (dbuser == null) {
        console.error(`user ${login} does not exist`);
        return res.status(403).json({ status: "forbidden" });
    }
    if (bcrypt.compareSync(password, dbuser!.password)) {
        console.log("valid user");
        return res.status(200).json({ sth: "ok" });
    } else {
        console.error(`password does not match ${login}`);
        return res.status(403).json({ status: "forbidden" });
    }
    return res.status(500).json({ status: "hit the end of a function which shouldn't accour" });
});

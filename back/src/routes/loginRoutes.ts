import { Router } from "express";
import { database } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginRouter = Router();

loginRouter.get("/", async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password)
            return res.status(400).json({ error: "login or password is empty" });
        const dbuser = await database.getUser(login, "users");
        if (dbuser == null) {
            console.error(`user ${login} does not exist`);
            return res.status(403).json({ status: "forbidden" });
        }
        if (bcrypt.compareSync(password, dbuser!.password)) {
            // remove password field from database user
            const { password: _, ...user } = dbuser;
            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET enviromental variable is undefined");
                return res.status(500).json({ status: "internal server errror" });
            }
            const token = jwt.sign(user, process.env.JWT_SECRET as string);
            return res.status(200).json({ token: token });
        } else {
            console.error(`password does not match ${login}`);
            return res.status(403).json({ status: "forbidden" });
        }
        return res.status(500).json({ status: "hit the end of a function which shouldn't accour" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "internal server error" });
    }
});

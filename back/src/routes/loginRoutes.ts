import { Router } from "express";
import { database } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateJWT } from "../middlewares/validateJWT.js";
import { IUser } from "../database.js";
import { validateJWTadmin } from "../middlewares/validateJWTadmin.js";

export const loginRouter = Router();

loginRouter.get("/", async (req, res) => {
    try {
        const { login, password } = req.query as { login: string; password: string };
        if (!login || !password)
            return res.status(400).json({ status: "login or password is empty" });
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
            return res.status(403).json({ status: "invalid credentials" });
        }
        return res.status(500).json({ status: "hit the end of a function which shouldn't accour" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "internal server error" });
    }
});

loginRouter.get("/get-all-users", validateJWTadmin, async (req, res) => {
    try {
        let users: Array<Partial<IUser>> | null = await database.getAllUsers("users");
        if (users == null)
            return res.status(404).json({ status: "couldn't get users from database" });
        users.map((user) => delete user.password);
        console.log(users);
        res.status(200).json({ users, jwt: req.body.token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "internal server error" });
    }
});

loginRouter.get("/validate-token", validateJWT, (req, res) => {
    res.json({ status: "ok" });
});

import { Router, json } from "express";
import { database } from "../index.js";
import { validateJWTadmin } from "../middlewares/validateJWTadmin.js";
import multerLib from "multer";
import { validateJWT } from "../middlewares/validateJWT.js";

const upload = multerLib({ dest: "uploads/" });
export const registerRouter = Router();

registerRouter.post("/", validateJWTadmin, upload.single("image"), async (req, res) => {
    req.body = JSON.parse(req.body.data);
    console.log(`registering new user`, req.body, req.file);
    const { login, password, isAdmin, userName } = req.body;
    if (!login || !password || isAdmin == null || isAdmin == undefined || !userName)
        return res.status(400).json({ status: "not enough data provided" });
    if (!req.file) return res.status(400).json({ status: "image file not provided" });

    try {
        console.log(req.file);
        const user = await database.getUser(login, "users");
        if (user == null || user == undefined)
            database.saveUser(
                { login, password, isAdmin, userName, imgPath: req.file.path },
                "users"
            );
        else return res.status(406).json({ status: "user already exists" });

        return res.status(200).json({ status: "user registered properly" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "internal server error" });
    }
});

registerRouter.post("/update", validateJWTadmin, async (req, res) => {
    console.log(`updating new user`);
    const { _id } = req.body;
    console.log(req.body);
    if (!_id || Object.keys(req.body).length <= 2)
        return res.status(400).json({ status: "not enough data provided" });
    try {
        await database.updateUser(req.body, "users");
        console.log(`updated user ${_id}`);
        const user = await database.getUserByID(_id, "users");
        console.log(user);
        if (user == null || user == undefined)
            return res.status(500).json({ status: "internal server error" });

        return res.status(200).json({ status: "user updated properly", user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "internal server error" });
    }
});
function multer(arg0: { dest: string }) {
    throw new Error("Function not implemented.");
}

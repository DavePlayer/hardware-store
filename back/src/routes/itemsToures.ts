import { Router } from "express";
import { database } from "../index.js";
import { validateJWT } from "../middlewares/validateJWT.js";

export const itemsRouter = Router();

itemsRouter.get("/", validateJWT, async (req, res) => {
    try {
        const items = await database.getItems("items", req.body._id);
        // console.log(
        //     "------------------------------\n",
        //     items,
        //     "\n------------------------------------------"
        // );
        return res.json({ items });
    } catch (err) {
        res.status(500).json({ status: "server error when reciving items" });
    }
});

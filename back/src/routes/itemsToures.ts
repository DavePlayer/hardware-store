import { Router } from "express";
import { database } from "../index.js";
import { validateJWT } from "../middlewares/validateJWT.js";
import { validateJWTadmin } from "../middlewares/validateJWTadmin.js";

export const itemsRouter = Router();

itemsRouter.get("/", validateJWT, async (req, res) => {
    try {
        const items = await database.getItems("items", req.body.token._id);
        // console.log(
        //     "------------------------------\n",
        //     items,
        //     "\n------------------------------------------"
        // );
        return res.json({ items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "server error when reciving items" });
    }
});

itemsRouter.post("/add", validateJWTadmin, async (req, res) => {
    try {
        console.log(req.body);
        const { token, ...item } = req.body;
        if (
            !item.nameAndCompany ||
            !item.date ||
            typeof item.rentedTo == "undefined" ||
            item.beingRepaired == undefined ||
            item.beingRepaired == null
        )
            return res.status(400).json({ error: "item is invalid" });
        const status = await database.addItem("items", item);
        // console.log(
        //     "------------------------------\n",
        //     items,
        //     "\n------------------------------------------"
        // );
        return res.json({ status: status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "server error when renting item" });
    }
});

itemsRouter.post("/delete", validateJWTadmin, async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) return res.status(400).json({ error: "item id not provided" });
        const item = await database.getItem("items", itemId);
        if (!item) return res.status(404).json({ status: "item does not exist" });
        const status = await database.deleteItem("items", itemId);
        return res.json({ status: status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "server error when renting item" });
    }
});

itemsRouter.post("/rent", validateJWT, async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) return res.status(400).json({ error: "item id not provided" });
        const status = await database.rentItem("items", req.body.token._id, itemId);
        // console.log(
        //     "------------------------------\n",
        //     items,
        //     "\n------------------------------------------"
        // );
        return res.json({ status: status, itemId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "server error when renting item" });
    }
});

itemsRouter.post("/release", validateJWT, async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) return res.status(400).json({ error: "item id not provided" });
        const status = await database.release("items", itemId);
        return res.json({ status: status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "server error when renting item" });
    }
});

itemsRouter.post("/repair", validateJWTadmin, async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) return res.status(400).json({ error: "item id not provided" });
        const item = await database.getItem("items", itemId);
        if (item?.beingRepaired == true)
            return res.status(406).json({ status: "item is already being repaired" });
        const status = await database.sendToRepair("items", itemId);
        return res.json({ status: status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "server error when renting item" });
    }
});

itemsRouter.post("/get-from-repair", validateJWTadmin, async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) return res.status(400).json({ error: "item id not provided" });
        const item = await database.getItem("items", itemId);
        if (item?.beingRepaired == false)
            return res.status(406).json({ status: "item is not being repaired" });
        const status = await database.getFromRepair("items", itemId);
        return res.json({ status: status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "server error when renting item" });
    }
});

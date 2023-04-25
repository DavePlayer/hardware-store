import express from "express";
import DatabaseC from "./database.js";
import { router } from "./router.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json({ limit: "10mb" }));
dotenv.config();

export const database = new DatabaseC();
database.establishConnection(process.env.MONGO_STRING as string, "hardware-store").catch((err) => {
    throw err;
});

app.use(cors());

app.use("/", router);
app.get("/uploads/:filename", (req, res) => {
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Content-Type", "image/jpeg");
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), "uploads", filename);

    res.sendFile(filePath);
});

app.listen(9999, () => console.log(`listening on port 9999`));

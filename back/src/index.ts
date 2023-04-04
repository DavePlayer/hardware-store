import express from "express";
import DatabaseC from "./database.js";
import { router } from "./router.js";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
dotenv.config();

app.use("/", router);

export const database = new DatabaseC(process.env.MONGO_STRING as string, "hardware-store");

app.listen(9999, () => console.log(`listening on port 9999`));

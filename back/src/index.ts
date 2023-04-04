import express from "express";
import { router } from "./router.js";

const app = express();
app.use(express.json())

app.use("/", router)

app.listen(9999, () => console.log(`listening on port 9999`))
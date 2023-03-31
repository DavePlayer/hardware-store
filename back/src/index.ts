import express from "express";

const app = express();

app.get("/",(req, res) => {
    console.log(`sth happens`);
    res.send("works");
})

app.listen(9999, () => console.log(`listening on port 9999`))
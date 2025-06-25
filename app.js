const express = require("express");
const db = require("./config/mongoose-connection");
const app = express();
app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/testlist", async (req, res) => {
    let newList = new db({
        title: "My House",
        description: "Home Sweet Home",
        country: "India",
        location: "Kolkata",
        price: "1000000"
    });
    await newList.save();
    console.log("sample done");
})
app.listen(3000);
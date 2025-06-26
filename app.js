const express = require("express");
const db = require("./config/mongoose-connection");
const listingModel=require("./models/listing");
const path=require("path");
const app = express();
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/listing",async(req,res)=>{
    const alllistings=await listingModel.find({});
    res.render("listings/index.ejs",{alllistings});
})
/*app.get("/testlist", async (req, res) => {
    let newList =await  listingModel.create({
        title: "My House",
        description: "Home Sweet Home",
        country: "India",
        location: "Kolkata",
        price: "1000000"
    });
    res.send(newList);
})*/
app.listen(3000);
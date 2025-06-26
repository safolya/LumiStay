const express = require("express");
const db = require("./config/mongoose-connection");
const listingModel=require("./models/listing");
const path=require("path");
const app = express();
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.send("hello");
});
//index route
app.get("/listing",async(req,res)=>{
    const alllistings=await listingModel.find({});
    res.render("listings/index.ejs",{alllistings});
});

//New List Route
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
});

app.post("/listing/create",async(req,res)=>{
    let {title,description,image,country,location,price}=req.body;
    let newlist=await listingModel.create({
        title:title ,
        description: description,
        country: country,
        location: location ,
        price: price
    });
    newlist.save();
    console.log(newlist);
    res.redirect("/listing");
})

//show route
app.get("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    let list=await listingModel.findById(id);
    res.render("listings/show.ejs",{list});
});


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
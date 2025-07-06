const express = require("express");
const db = require("./config/mongoose-connection");
const listingModel = require("./models/listing");
const reviewModel = require("./models/reviews");
const joilistingSchema = require("./joischema");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello");
});



//index route
app.get("/listing", wrapAsync(async (req, res) => {
    const alllistings = await listingModel.find({});
    res.render("listings/index.ejs", { alllistings });
}));

//New List Route
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs");
});

const validatelisting = (req, res, next) => {
    let {error} = joilistingSchema.validate(req.body);
    if (error) {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errmsg);
    }else{
        next();
    }
};

//create route
app.post("/listing/create", validatelisting, wrapAsync(async (req, res, next) => {

    let newlist = await listingModel.create(req.body.list);
    newlist.save();
    res.redirect("/listing");
    /*title: title,
          description: description,
          country: country,
          location: location,
          price: price*/
})
);

//edit route
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await listingModel.findById(id);
    res.render("listings/edit.ejs", { list });
}));

//update route
app.put("/listing/:id", validatelisting, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await listingModel.findByIdAndUpdate(id, { ...req.body.list });
    for (let field in req.body.list) {
        // Only update if the value is not undefined (i.e., it was explicitly submitted)
        // If you want an empty string to clear a field, then check for `!== undefined`
        if (req.body.list[field] !== undefined) {
            list[field] = req.body.list[field];
        }
    }

    // Mongoose validation will run on .save() by default
    await list.save();
    res.redirect(`/listing/${id}`);
}));

//delete route
app.delete("/listing/:id/delete", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletelist = await listingModel.findByIdAndDelete(id);
    console.log(deletelist);
    res.redirect("/listing");
}));
//show route
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await listingModel.findById(id);
    res.render("listings/show.ejs", { list });
}));

//review(post route)
app.post("/listing/:id/reviews",async(req,res)=>{
    let list=await listingModel.findById(req.params.id);
    let review=await reviewModel.create(req.body.review);
    console.log(review);
    list.reviews.push(review);
    await list.save();
    res.redirect("/listing/");
});

app.all("/{*any}", (req, res, next) => { // Or use "/{*any}" for more explicit naming
    next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.render("listings/error.ejs", { message });
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
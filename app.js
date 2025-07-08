const express = require("express");
const db = require("./config/mongoose-connection");
const listingModel = require("./models/listing");
const reviewModel = require("./models/reviews");
const listingRouter=require("./routes/listingRouter");
const reviewRouter=require("./routes/reviewRouter")
const {joilistingSchema,reviewSchema} = require("./joischema");
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


app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);


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
if(process.env.NODE_ENV !== "production") {
    // Load environment variables from .env file
    require("dotenv").config();
}
require('dotenv').config();
const express = require("express");
const db = require("./config/mongoose-connection");
const listingModel = require("./models/listing");
const reviewModel = require("./models/reviews");
const listingRouter=require("./routes/listingRouter");
const reviewRouter=require("./routes/reviewRouter")
const userRouter=require("./routes/userRouter");
const session=require("express-session");
const connectFlash=require("connect-flash");
const {joilistingSchema,reviewSchema} = require("./joischema");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const userModel=require("./models/user");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

const sessionOptions={
    secret:"mysecert",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
}

app.get("/", (req, res) => {
    res.send("hello");
});

app.use(session(sessionOptions));
app.use(connectFlash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userModel.authenticate()));

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});

/*app.get("/demouser",async(req,res)=>{
    let fakeuser=await userModel.create({
        email:"safolyamondal12345@gmail.com",
        username: "safolya12345",
    });
    let registeruser=await userModel.register(fakeuser,"helloworld");
    res.send(registeruser);
});*/

app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);




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
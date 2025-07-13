const express=require("express");
const router=express.Router({mergeParams:true});
const listingModel = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const reviewModel = require("../models/reviews");
const {joilistingSchema,reviewSchema} = require("../joischema");
const isloggedin = require("../middlewares/isloggedin");


const validatelisting = (req, res, next) => {
    let {error} = joilistingSchema.validate(req.body);
    if (error) {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errmsg);
    }else{
        next();
    }
};
//index route
router.get("/", wrapAsync(async (req, res) => {
    const alllistings = await listingModel.find({});
    res.render("listings/index.ejs", { alllistings });
}));

//New List Route
router.get("/new",isloggedin, (req, res) => {
        res.render("listings/new.ejs");
});


//create route
router.post("/create", isloggedin, validatelisting, wrapAsync(async (req, res, next) => {

    let newlist = await listingModel.create(req.body.list);
    newlist.save();
    req.flash("success","New List added successfully");
    res.redirect("/listing");
    /*title: title,
          description: description,
          country: country,
          location: location,
          price: price*/
})
);

//edit route
router.get("/:id/edit", isloggedin, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await listingModel.findById(id);
    if(!list){
        req.flash("error","list already deleted");
        res.redirect("/listing");
    }else{
    res.render("listings/edit.ejs", { list });
    }
}));

//update route
router.put("/:id", isloggedin, validatelisting, wrapAsync(async (req, res) => {
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
    req.flash("success"," List updated successfully");
    res.redirect(`/listing/${id}`);
    
}));

//delete route
router.delete("/:id/delete", isloggedin, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletelist = await listingModel.findByIdAndDelete(id);
    req.flash("success"," List deleted successfully");
    res.redirect("/listing");
}));
//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await listingModel.findById(id).populate("reviews");
    if(!list){
        req.flash("error","list already deleted");
        res.redirect("/listing");
    }else{
        res.render("listings/show.ejs", { list });
    }
}));

module.exports=router;
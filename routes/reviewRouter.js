const express=require("express");
const router=express.Router({mergeParams:true});
const listingModel = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const reviewModel = require("../models/reviews");
const {joilistingSchema,reviewSchema} = require("../joischema");
const {isloggedin,reviewownerCheck} = require("../middlewares/isloggedin");

const validatereview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errmsg);
    }else{
        next();
    }
};

//review(post route)
router.post("/",isloggedin,wrapAsync(async(req,res)=>{
    let list=await listingModel.findById(req.params.id);
    let review=await reviewModel.create(req.body.review);
    review.author=req.user._id; // Set the author to the currently logged-in user
    console.log(review.author);
    list.reviews.push(review);
    await review.save(); // Save the review to the database
    await list.save();
    req.flash("success"," Review added successfully");
    res.redirect(`/listing/${list._id}`);
}));

//delete review

router.delete("/:reviewid",isloggedin,reviewownerCheck,wrapAsync(async(req,res)=>{
    let {id,reviewid}=req.params;
    await listingModel.findByIdAndUpdate(id,{$pull: {reviews:reviewid}});
    await reviewModel.findByIdAndDelete(reviewid);
    req.flash("success"," Review deleted successfully");
    res.redirect(`/listing/${id}`);
}));



module.exports=router;
const express=require("express");
const router=express.Router({mergeParams:true});
const listingModel = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const reviewModel = require("../models/reviews");
const {joilistingSchema,reviewSchema} = require("../joischema");

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
router.post("/",wrapAsync(async(req,res)=>{
    let list=await listingModel.findById(req.params.id);
    let review=await reviewModel.create(req.body.review);
    console.log(review);
    list.reviews.push(review);
    await list.save();
    req.flash("success"," Review added successfully");
    res.redirect(`/listing/${list._id}`);
}));

//delete review

router.delete("/:reviewid",async(req,res)=>{
    let {id,reviewid}=req.params;
    await listingModel.findByIdAndUpdate(id,{$pull: {reviews:reviewid}});
    await reviewModel.findByIdAndDelete(reviewid);
    req.flash("success"," Review deleted successfully");
    res.redirect(`/listing/${id}`);
})



module.exports=router;
const express=require("express");
const router=express.Router({mergeParams:true});
const listingModel = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const reviewModel = require("../models/reviews");
const {joilistingSchema,reviewSchema} = require("../joischema");
const {isloggedin,reviewownerCheck} = require("../middlewares/isloggedin");
const reviewController=require("../controllers/review");

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
router.post("/",isloggedin,wrapAsync(reviewController.reviewpost));

//delete review
router.delete("/:reviewid",isloggedin,reviewownerCheck,wrapAsync(reviewController.delete));



module.exports=router;
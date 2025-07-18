const listingModel = require("../models/listing");
const reviewModel = require("../models/reviews");

module.exports.reviewpost=async(req,res)=>{
    let list=await listingModel.findById(req.params.id);
    let review=await reviewModel.create(req.body.review);
    review.author=req.user._id; // Set the author to the currently logged-in user
    console.log(review.author);
    list.reviews.push(review);
    await review.save(); // Save the review to the database
    await list.save();
    req.flash("success"," Review added successfully");
    res.redirect(`/listing/${list._id}`);
}

module.exports.delete=async(req,res)=>{
    let {id,reviewid}=req.params;
    await listingModel.findByIdAndUpdate(id,{$pull: {reviews:reviewid}});
    await reviewModel.findByIdAndDelete(reviewid);
    req.flash("success"," Review deleted successfully");
    res.redirect(`/listing/${id}`);
}
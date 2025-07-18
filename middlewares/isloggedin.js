const expressError = require("../utils/expressError");
const listingModel = require("../models/listing");
const reviewModel = require("../models/reviews");


module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must login first");
        return res.redirect("/login");
    }
    next()
};

module.exports.savedUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.ownerCheck = async(req, res, next) => {
    let { id } = req.params;
    let listing = await listingModel.findById(id);
    if(!listing.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","You do not have permission to edit this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
    };

    module.exports.reviewownerCheck = async(req, res, next) => {
    let { reviewid } = req.params;
    let review = await reviewModel.findById(reviewid);
    if(!review.author._id.equals(res.locals.curruser._id)){
        req.flash("error","You do not have permission to edit this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
    };
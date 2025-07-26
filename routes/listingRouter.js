const express=require("express");
const router=express.Router({mergeParams:true});
const listingModel = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const reviewModel = require("../models/reviews");
const {joilistingSchema,reviewSchema} = require("../joischema");
const {isloggedin,ownerCheck} = require("../middlewares/isloggedin");
const listingContoller = require("../controllers/listing");
const multer  = require('multer')
const {storage} = require("../cloudinaryconfig"); // Use memory storage for multer
const upload = multer({ storage })




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
router.get("/", wrapAsync(listingContoller.index));

//New List Route
router.get("/new",isloggedin, (req, res) => {
        res.render("listings/new.ejs");
});


//create route
router.post("/create", isloggedin, validatelisting, upload.single('list[image]'), wrapAsync(listingContoller.create));

//edit route
router.get("/:id/edit", isloggedin, ownerCheck, wrapAsync(listingContoller.edit));

//update route
router.put("/:id", isloggedin,ownerCheck, validatelisting, wrapAsync(listingContoller.update));

//delete route
router.delete("/:id/delete", isloggedin, ownerCheck, wrapAsync(listingContoller.delete));

//show route
router.get("/:id", wrapAsync(listingContoller.show));

module.exports=router;
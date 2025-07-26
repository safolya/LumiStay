const { model } = require("mongoose");
const listingModel = require("../models/listing");
const express=require("express");
const multer  = require('multer')
const {storage} = require("../cloudinaryconfig"); // Use memory storage for multer
const upload = multer({ storage })

module.exports.index=async (req, res) => {
    const alllistings = await listingModel.find({});
    res.render("listings/index.ejs", { alllistings });
}

module.exports.create=async (req, res, next) => {
    let newlist = await listingModel.create(req.body.list);
    console.log(req.file);
    newlist.owner = req.user._id; // Set the owner to the currently logged-in user
    newlist.save();
    req.flash("success","New List added successfully");
    /*title: title,
          description: description,
          country: country,
          location: location,
          price: price*/
}

module.exports.edit=async (req, res) => {
    let { id } = req.params;
    let list = await listingModel.findById(id);
    if(!list){
        req.flash("error","list already deleted");
        res.redirect("/listing");
    }else{
    res.render("listings/edit.ejs", { list });
    }
}

module.exports.update=async (req, res) => {
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
    
}

module.exports.delete=async (req, res) => {
    let { id } = req.params;
    let deletelist = await listingModel.findByIdAndDelete(id);
    req.flash("success"," List deleted successfully");
    res.redirect("/listing");
}

module.exports.show=async (req, res) => {
    let { id } = req.params;
    let list = await listingModel.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    if(!list){
        req.flash("error","list already deleted");
        res.redirect("/listing");
    }else{
        res.render("listings/show.ejs", { list });
    }
}
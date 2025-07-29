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
    try {
        if (!req.file) {
            req.flash("error", "Please upload an image");
            return res.redirect("/listing/new");
        }
        let url = req.file.path;
        let filename = req.file.filename;
        let newlist = new listingModel(req.body.list);
        newlist.owner = req.user._id;
        newlist.image = { url, filename };
        await newlist.save();
        req.flash("success", "New List added successfully");
        return res.redirect("/listing");
    } catch (error) {
        console.error(error);
        req.flash("error", "Error creating listing: " + error.message);
        return res.redirect("/listing/new");
    }
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
const mongoose=require("mongoose");
const { type } = require("../joischema");
const { number } = require("joi");

const reviewSchema=new mongoose.Schema({
    comment:String,
    rate:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    }
});

module.exports=mongoose.model("review",reviewSchema);
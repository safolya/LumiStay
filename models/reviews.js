const mongoose=require("mongoose");
const { type } = require("../joischema");
const { number } = require("joi");

const reviewSchema=new mongoose.Schema({
    rate:{
        type:Number,
        min:1,
        max:5,
    },
    
    comment:String,

    createdAt:{
        type:Date,
        default: Date.now(),
    }
});

module.exports=mongoose.model("review",reviewSchema);
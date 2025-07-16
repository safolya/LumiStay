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
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }
});

module.exports=mongoose.model("review",reviewSchema);
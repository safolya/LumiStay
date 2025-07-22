const { required } = require("joi");
const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const profilepic = require("./profilepic");

const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("user",userSchema);
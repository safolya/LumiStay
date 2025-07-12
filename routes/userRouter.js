const express=require("express");
const router=express.Router({mergeParams:true});
const userModel=require("../models/user");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});

router.post("signup",async(req,res)=>{
       let {username,email,password}=req.body;
       let newUser=userModel.create({
         username: username,
         email: email
       });

       
});

module.exports=router;
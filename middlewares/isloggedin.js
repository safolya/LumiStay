module.exports=isloggedin=(req,res,next)=>{
if(!req.isAuthenticated()){
        req.flash("error","Login First");
       return res.redirect("/login");
    }
    next()
}



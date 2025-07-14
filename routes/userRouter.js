const express = require("express");
const router = express.Router({ mergeParams: true });
const userModel = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {isloggedin,savedUrl}=require("../middlewares/isloggedin");

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new userModel({
      email: email,
      username: username // passport-local-mongoose will use this as the primary identifier
    });
    let registeruser = await userModel.register(newUser, password);
    req.login(registeruser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash = ("success", "Welcome To LumiStay");
      res.redirect("/listing");
    })
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }

}));

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post("/login",savedUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectUrl || "/listing");
});

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out");
    res.redirect("/listing");
  });
})

module.exports = router;
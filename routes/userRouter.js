const express = require("express");
const router = express.Router({ mergeParams: true });
const userModel = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isloggedin, savedUrl } = require("../middlewares/isloggedin");
const multer = require('multer');
const { storage } = require("../cloudinaryconfig");
const upload = multer({ storage });

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

router.post("/login", savedUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
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

router.get("/profile", isloggedin, async (req, res) => {
  const user = await userModel.findById(req.user._id);
  res.render("user/profile.ejs", { user });
});

router.post("/profile", isloggedin, upload.single('profilePic'), async (req, res) => {
  try {
    // Find the user in the database
    const user = await userModel.findById(req.user._id);
    
    if (!user) {
      req.flash("error", "User not found. Please log in again.");
      return res.redirect("/login");
    }

    // Update username and email if provided
    if (req.body.username) {
      user.username = req.body.username;
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    // Handle profile image upload
    if (req.file) {
      user.profileImage = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    // Save the updated user
    await user.save();
    req.flash("success", "Profile updated successfully");
    res.redirect("/profile");
  } catch (error) {
    console.error("Profile update error:", error);
    req.flash("error", "There was an error updating your profile.");
    res.redirect("/profile");
  }
});

module.exports = router;

// try {
//     // 1. Find the user in the database
//     const user = await userModel.findById(req.user._id);

//     // 2. Update username and email only if they were provided in the form
//     if (req.body.username) {
//       user.username = req.body.username;
//     }
//     if (req.body.email) {
//       user.email = req.body.email;
//     }

//     // 3. Update profile picture only if a new file was uploaded
//     if (req.file) {
//       // It's good practice to include the MIME type for browser compatibility
//       user.profilePic = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
//     }

//     // 4. Save the updated user object
//     await user.save();

//     req.flash("success", "Profile updated successfully");
//     res.redirect("/profile");

//   } catch (error) {
//     console.error("Profile update failed:", error);
//     req.flash("error", "There was an error updating your profile.");
//     res.redirect("/profile");
//   }
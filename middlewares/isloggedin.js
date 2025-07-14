module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login First");
        return res.redirect("/login");
    }
    next()
};

module.exports.savedUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


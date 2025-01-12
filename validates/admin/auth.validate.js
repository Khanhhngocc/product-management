module.exports.loginPost = (req, res, next) => {
    if(!req.body.email){
        req.flash("error", "");
        res.redirect("back");
        return;
    }

    if(!req.body.password){
        req.flash("error", "");
        res.redirect("back");
        return;
    }

    next();
}
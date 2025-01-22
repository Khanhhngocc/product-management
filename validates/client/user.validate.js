module.exports.registerPost = (req, res, next) => {
    if(!req.body.fullName) {
        req.flash("error", "Không để trống họ tên!");
        res.redirect("back");
        return;
    }

    if(!req.body.email) {
        req.flash("error", "Không để trống email!");
        res.redirect("back");
        return;
    }

    if(!req.body.password) {
        req.flash("error", "Không để trống mật khẩu!");
        res.redirect("back");
        return;
    }

    next();
}

module.exports.loginPost = (req, res, next) => {
    if(!req.body.email) {
        req.flash("error", "Không để trống email!");
        res.redirect("back");
        return;
    }

    if(!req.body.password) {
        req.flash("error", "Không để trống mật khẩu!");
        res.redirect("back");
        return;
    }

    next();
}
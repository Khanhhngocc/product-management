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

module.exports.forgotPasswordPost = (req, res, next) => {
    if(!req.body.email) {
        req.flash("error", "Không để trống email!");
        res.redirect("back");
        return;
    }

    next();
}

module.exports.resetPasswordPost = (req, res, next) => {
    if(!req.body.password) {
        req.flash("error", "Nhập mật khẩu mới vào đi");
        res.redirect("back");
        return;
    }

    if(!req.body.confirmPassword) {
        req.flash("error", "Đéo nhập xác nhận mật khẩu à? :))");
        res.redirect("back");
        return;
    }

    if(req.body.password != req.body.confirmPassword) {
        req.flash("error", "xác nhận không khớp với mật khẩu mới đâu");
        res.redirect("back");
        return;
    }

    next();
}
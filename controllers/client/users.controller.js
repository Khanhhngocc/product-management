const User = require("../../models/user.model.js");

module.exports.notFriends = async(req, res) => {
    const userId = res.locals.user.id;

    const users = await User.find({
        _id: { $ne: userId },
        status: "active",
        deleted: false
    }).select("avatar fullName")
    res.render("client/pages/user/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}
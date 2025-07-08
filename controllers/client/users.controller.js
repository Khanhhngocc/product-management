const User = require("../../models/user.model.js");
const usersSocket = require("../../sockets/client/users.socket.js");

module.exports.notFriends = async(req, res) => {

    usersSocket(res)

    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends }}
        ],
        status: "active",
        deleted: false
    }).select("avatar fullName")
    res.render("client/pages/user/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}
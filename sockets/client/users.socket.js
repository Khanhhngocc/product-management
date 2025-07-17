const User = require("../../models/user.model");

module.exports = async (res) => {
    _io.once("connection", (socket) => {

        // Chức năng gửi yêu cầu
        socket.on("CLIENT_ADD_FRIEND", async(userId) => {
            const myUserId = res.locals.user.id;

            const existUserAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if(!existUserAInB){
                await User.updateOne({
                    _id : userId
                }, { 
                    $push: { acceptFriends: myUserId }
                })
            }

            const existUserBInA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if(!existUserBInA) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: { requestFriends: userId }
                })
            }

            //Lấy ra độ dài acceptFriends mới
            const infoUser = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUser.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })

            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName");

            socket.broadcast.emit("SERVER_RETURN_LENGTH_INFO_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            })
        })

        // Chức năng huỷ yêu cầu
        socket.on("CLIENT_CANCEL_FRIEND", async(userId) => {

            const myUserId = res.locals.user.id;

            const existAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if(existAInB){
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { requestFriends: myUserId }
                })
            }

            const existBInA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if(existBInA){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { requestFriends: userId }
                })
            }

            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })

            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userId: userId,
                userIdA: myUserId
            })

        })

        // Chức năng từ chối kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async(userId) => {
            const myUserId = res.locals.user.id;

            const existAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            if(existAInB){
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: { acceptFriends: userId }
                })
            }

            const existBInA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            if(existBInA){
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { requestFriends: myUserId }
                })
            }
        })

        // Chức năng chấp nhận kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async(userId) => {
            const myUserId = res.locals.user.id;
            
            const existAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            if(existAInB){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: { 
                        friendsList: {
                            user_id: userId,
                            room_chat_id: ""
                        }
                    },
                    $pull: { acceptFriends: userId }
                })
            }

            const existBInA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            if(existBInA){
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        friendsList: {
                            user_id: myUserId,
                            room_chat_id: ""
                        }
                    },
                    $pull: { requestFriends: myUserId }
                })
            }
        })
    })
}
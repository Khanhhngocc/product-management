const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

//[GET] /chat/
module.exports.chat = async(req, res) => {
    const userId = res.locals.user.id;

    // SocketIO
    _io.once('connection', (socket) => { // on mỗi lần load lại trang là 1 lần kết nối mới -> khi gửi tin nhắn đi sẽ bị gửi nhiều lần
        socket.on("CLIENT_SEND_MESSAGE", async(content) => {
            // Lưu vào database
            const chat = new Chat({
                user_id: userId,
                content: content
            });
            await chat.save();
        });
    });
    // End SocketIO

    // Lấy ra data
    const chats = await Chat.find({
        deleted: false
    });

    console.log(chats);

    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id,
        }).select("fullName");

        console.log(infoUser);
        
        chat.infoUser = infoUser;

    }


    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats,
    })
}
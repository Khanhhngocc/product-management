//[GET] /chat/
module.exports.chat = (req, res) => {
    // SocketIO
    _io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
    });

    // End SocketIO

    res.render("client/pages/chat/index", {
        pageTitle: "Chat"
    })
}
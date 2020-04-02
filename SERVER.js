var express = require("express")
var app = express();
app.use(express.static("./public")); // xu dung thu muc public
app.set("view engine", 'ejs');
app.set("views", "./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var mangUsers = [];

io.on("connection", function(socket) {
    socket.on("client-send-Username", function(data) {
        if (mangUsers.indexOf(data) >= 0) {
            // fail
            socket.emit("Server-send-dki-thatbai");
        } else {
            // success
            mangUsers.push(data);
            socket.username = data;
            socket.emit("Server-send-dki-thanhcong", data);
            io.sockets.emit("Server-send-danhsach-Users", mangUsers);
        }
    })

    // logout
    socket.on("logout", function() {
        mangUsers.splice(mangUsers.indexOf(socket.username), 1);
        socket.broadcast.emit("Server-send-danhsach-Users", mangUsers);
    })

    // message
    socket.on("user-send-message", function(data) {
        io.sockets.emit("server-send-message", { username: socket.username, mess: data })
    });

    // hien dang go chu
    socket.on("toi-dang-go-chu", function() {
        var s = socket.username + "dang go chu"
        socket.broadcast.emit("ai-do-dang-go-chu", s)
    })

    // da ngung go chu
    socket.on("toi-ngung-go-chu", function() {
        var s = socket.username + "dang ngung go chu"
        socket.broadcast.emit("ai-do-da-ngung-go-chu", s)
    })

    // tao room
    socket.on("tao-room", function(data) {
        socket.join(data)
        socket.phong = data

        // show danh sach room dang co tren server
        // console.log(socket.adapter.rooms)

        var mang = []
        for (r in socket.adapter.rooms) {
            mang.push(r)
        }
        io.sockets.emit("Server-send-rooms", mang)
        socket.emit("Server-send-room-socket", data)
    })
    socket.on("user-chat", function(data) {
        io.sockets.in(socket.phong).emit("Server-chat", data)
    })


    // disconnect
    socket.on("disconnect", function() {
        mangUsers.splice(mangUsers.indexOf(socket.username), 1);
        socket.broadcast.emit("Server-send-danhsach-Users", mangUsers);
    })


})

app.get("/", function(req, res) {
    res.render("home")
})
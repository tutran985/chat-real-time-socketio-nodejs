// var socket = io("http://localhost:3000")
var socket = io("https://chatsocail.herokuapp.com/")

socket.on("Server-send-dki-thatbai", function() {
    alert('co nguoi da dang ky roi')
})

socket.on("Server-send-dki-thanhcong", function(data) {
    $("#currentUser").html(data)
    $('#loginForm').hide(2000)
    $('#chatForm').show(1000)
})

socket.on("Server-send-danhsach-Users", function(mangUsers) {
    // console.log(mangUsers)
    $("#boxContent").html("");
    mangUsers.forEach(i => {
        $("#boxContent").append("<div class='useronline'>" + i + "</div>");
    });
});

socket.on("server-send-message", function(data) {
    $("#listMes").append("<div class='ms'>" + data.username + ": " + data.mess + "</div>");
});

socket.on("ai-do-dang-go-chu", function(data) {
    $("#noti").html("<img width='40px' src='tenor.gif'/>");
});
socket.on("ai-do-da-ngung-go-chu", function(data) {
    $("#noti").html("");
});
socket.on("Server-send-rooms", function(data) {
    $("#boxRoom").html("");
    data.forEach(i => {
        $("#boxRoom").append("<div class='room'>" + i + "</div>");
    });
})

socket.on("Server-send-room-socket", function(data) {
    $("#roomHienTai").html(data)
})

socket.on("Server-chat", function(data) {
    console.log(data)
    $("#listMes").append("<div class='ms'>" + data + "</div>");
})

$(document).ready(function() {
    // console.log(1)
    $('#loginForm').show();
    $('#chatForm').hide();

    $('#btnRegister').click(function() {
        socket.emit("client-send-Username", $('#txtUserName').val());
    });
    $("#txtUserName").keypress(function() {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            socket.emit("client-send-Username", $("#txtUserName").val())
            $("#txtUserName").html("")
        }
    });

    // logout
    $("#btnLogout").click(function() {
        socket.emit("logout");
        $('#loginForm').show(1);
        $('#chatForm').hide(2);
    });

    // bat xu kien go chu
    $("#txtMessage").focusin(function() {
        socket.emit("toi-dang-go-chu")
    });
    $("#txtMessage").focusout(function() {
        socket.emit("toi-ngung-go-chu")
    });

    $("#btnSendMessage").click(function() {
        socket.emit("user-send-message", $("#txtMessage").val())
        $("#txtMessage").val('')
    });
    $("#txtMessage").keypress(function() {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            socket.emit("user-send-message", $("#txtMessage").val())
            $("#txtMessage").val('')
        }
    });

    // Tao room
    $("#btnRoom").click(function() {
        socket.emit("tao-room", $("#txtRoom").val())
    });

    // chat in room
    $("#btnMessRoom").click(function() {
        socket.emit("user-chat", $("#txtMessRoom").val())
    })

})
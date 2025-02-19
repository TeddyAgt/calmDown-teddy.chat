const app = require("express")();
const express = require("express");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
require("dotenv/config");
const { colors } = require("./utils/colors.js");
const { CalmDowner } = require("./classes/CalmDowner.js");
const PORT = process.env.PORT;
let users = [];

app.use(express.static("public"));

http.listen(PORT, () => {
    console.log(`Server started, listening on port ${PORT}`);
});

// routes **************************************************
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/chat", (req, res) => {
    res.sendFile(__dirname + "/pages/chat.html");
});

// application settings **************************************************
function setUserColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// socket **************************************************
io.on("connection", (socket) => {
    console.log("New user connection");

    socket.on("user_connection", (user) => {
        console.log(`${user.username} is online`);
        const calmDowner = new CalmDowner(user.username, setUserColor());
        users.push(calmDowner);

        io.to(socket.id).emit("set_client-user", calmDowner);
        io.emit("user_connection", calmDowner);
        io.emit("user-list_update", users);
    });

    socket.on("disconnect", (socket) => {
        console.log("User disconnected");
    });

    socket.on("user_logout", (user) => {
        console.log(`${user.username} is offline`);
        users = users.filter((u) => {
            return u.username !== user.username;
        });

        io.emit("user-list_update", users);
        io.emit("user_logout", user);
    });

    socket.on("chat_message", (msg) => {
        console.log(`New message from ${msg.author.username}`);

        io.emit("chat_message", msg);
    });
});

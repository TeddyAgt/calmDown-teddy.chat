const app = require("express")();
const express = require("express");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
require("dotenv/config");

const PORT = process.env.PORT;

app.use(cors());
app.use(express.static("public"));

http.listen(PORT, () => {
    console.log(`Server started, listening on port ${PORT}`);
});

// routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/chat", (req, res) => {
    res.sendFile(__dirname + "/pages/chat.html");
});

// socket
io.on("connection", (socket) => {
    console.log("New user connection");

    socket.on("disconnect", (socket) => {
        console.log("User disconnected");
    });

    socket.on("user_connection", (user) => {
        console.log(`${user.username} is online`);
        io.emit("user_connection", user);
    });

    socket.on("user_logout", (user) => {
        console.log(`${user.username} is offline`);
        io.emit("user_logout", user);
    });

    socket.on("chat_message", (msg) => {
        io.emit("chat_message", msg);
    });
});

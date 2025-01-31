const app = require("express")();
const express = require("express");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");

app.use(cors());
app.use(express.static("public"));

http.listen(3000, () => {
    console.log("Server started, listening on port 3000");
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

    socket.on("chat_message", (msg) => {
        io.emit("chat_message", msg);
    });
});

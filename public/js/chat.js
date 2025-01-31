const username = document.cookie
    .split("; ")
    .find((brownie) => brownie.startsWith("username="))
    ?.split("=")[1];

if (!username) {
    window.location = "/";
}

const socket = io();
const messageForm = document.querySelector("#message-form");
const usernameInput = document.querySelector("#username");
const messageInput = document.querySelector("#message");
const messagesContainer = document.querySelector("#chat-container");

messageForm.addEventListener("submit", handleSubmitMessageForm);

function handleUserConnection() {
    socket.emit("user_connection", {
        username: username,
    });
}

handleUserConnection();

function handleSubmitMessageForm(e) {
    e.preventDefault();

    socket.emit("chat_message", {
        username: username,
        message: messageInput.value,
    });
}

socket.on("chat_message", (msg) => {
    const messageElem = document.createElement("p");
    messageElem.classList.add("chat-message");
    messageElem.textContent = `${msg.username}: ${msg.message}`;
    messagesContainer.appendChild(messageElem);
});

socket.on("user_connection", (user) => {
    const messageElem = document.createElement("p");
    messageElem.classList.add("chat-connection");
    messageElem.textContent = `${user.username} s'est connecté !`;
    messagesContainer.appendChild(messageElem);
});

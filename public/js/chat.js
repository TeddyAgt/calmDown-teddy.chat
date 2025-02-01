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
const messagesContainer = document.querySelector("#messages-container");

messageForm.addEventListener("submit", handleSubmitMessageForm);
messageInput.addEventListener("keydown", handleInputKeydown);
window.addEventListener("beforeunload", handleUserLogout);

handleUserConnection();

function handleUserConnection() {
    socket.emit("user_connection", {
        username: username,
    });
}

function handleUserLogout() {
    socket.emit("user_logout", {
        username: username,
    });
}

function handleSubmitMessageForm(e) {
    e.preventDefault();

    socket.emit("chat_message", {
        username: username,
        message: messageInput.value,
    });
    messageForm.reset();
}

function handleInputKeydown(e) {
    if (e.keyCode === 13) {
        socket.emit("chat_message", {
            username: username,
            message: messageInput.value,
        });
        messageForm.reset();
    }
}

socket.on("chat_message", (msg) => {
    const messageElem = document.createElement("p");
    messageElem.classList.add("chat-message");
    messageElem.innerHTML = `<span class="chat__username">${msg.username}</span>: ${msg.message}`;
    messagesContainer.appendChild(messageElem);
    messagesContainer.scrollTop =
        messagesContainer.scrollHeight - messagesContainer.clientHeight;
});

socket.on("user_connection", (user) => {
    const messageElem = document.createElement("p");
    messageElem.classList.add("chat-message", "chat-connection");
    messageElem.innerHTML = `<span class="chat-connection chat__username">${user.username}</span> s'est connecté !`;
    messagesContainer.appendChild(messageElem);
    messagesContainer.scrollTop =
        messagesContainer.scrollHeight - messagesContainer.clientHeight;
});

socket.on("user_logout", (user) => {
    const messageElem = document.createElement("p");
    messageElem.classList.add("chat-message", "chat-logout");
    messageElem.innerHTML = `<span class="chat-logout chat__username">${user.username}</span> s'est déconnecté !`;
    messagesContainer.appendChild(messageElem);
    messagesContainer.scrollTop =
        messagesContainer.scrollHeight - messagesContainer.clientHeight;
});

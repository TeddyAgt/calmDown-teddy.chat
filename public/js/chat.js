const username = document.cookie
    .split("; ")
    .find((brownie) => brownie.startsWith("username="))
    ?.split("=")[1];

if (!username) {
    window.location = "/";
}

// DOM elements
const socket = io();
const messageForm = document.querySelector("#message-form");
const usernameInput = document.querySelector("#username");
const messageInput = document.querySelector("#message");
const messagesContainer = document.querySelector("#messages-container");
const userList = document.querySelector("#connected-users-list");

const clientUser = {};

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
    console.log(username);

    socket.emit("user_logout", {
        username: username,
    });
}

function handleSubmitMessageForm(e) {
    e.preventDefault();

    socket.emit("chat_message", {
        author: clientUser,
        message: messageInput.value,
    });
    messageForm.reset();
}

function handleInputKeydown(e) {
    if (e.keyCode === 13) {
        socket.emit("chat_message", {
            author: clientUser,
            message: messageInput.value,
        });
        messageForm.reset();
    }
}

socket.on("user_connection", (user) => {
    const messageElem = document.createElement("p");
    messageElem.classList.add("chat-event", "chat-element", "chat-connection");
    messageElem.innerHTML = `<span class="chat-connection chat__username" style="color:${user.color}">${user.username}</span> s'est connecté !`;
    messagesContainer.appendChild(messageElem);
    messagesContainer.scrollTop =
        messagesContainer.scrollHeight - messagesContainer.clientHeight;
});

socket.on("user_logout", (user) => {
    const messageElem = document.createElement("p");
    messageElem.classList.add("chat-event", "chat-element", "chat-logout");
    messageElem.innerHTML = `<span class="chat-logout chat__username"  style="color:${user.color}">${user.username}</span> s'est déconnecté !`;
    messagesContainer.appendChild(messageElem);
    messagesContainer.scrollTop =
        messagesContainer.scrollHeight - messagesContainer.clientHeight;
});

socket.on("user-list_update", (users) => {
    userList.innerHTML = "";
    users.map((user) => {
        const userListElem = document.createElement("li");
        userListElem.classList.add("connected-users-list__item");
        userListElem.style.color = user.color;
        userListElem.textContent = user.username;
        userList.appendChild(userListElem);
    });
});

socket.on("chat_message", (msg) => {
    const messageElem = document.createElement("p");
    messageElem.classList.add("chat-message", "chat-element");
    messageElem.innerHTML = `<span class="chat__username" style="color:${msg.author.color}">${msg.author.username}</span>: ${msg.message}`;
    messagesContainer.appendChild(messageElem);
    messagesContainer.scrollTop =
        messagesContainer.scrollHeight - messagesContainer.clientHeight;
});

socket.on("set_client-user", (serverUser) => {
    clientUser.username = serverUser.username;
    clientUser.color = serverUser.color;
});

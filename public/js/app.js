const socket = io();
const messageForm = document.querySelector("#message-form");
const usernameInput = document.querySelector("#username");
const messageInput = document.querySelector("#message");
const messagesContainer = document.querySelector("#chat-container");

messageForm.addEventListener("submit", handleSubmitMessageForm);

function handleSubmitMessageForm(e) {
    e.preventDefault();

    socket.emit("chat_message", {
        username: usernameInput.value,
        message: messageInput.value,
    });
}

socket.on("chat_message", (msg) => {
    const messageElem = document.createElement("p");
    messageElem.textContent = `${msg.username}: ${msg.message}`;
    messagesContainer.appendChild(messageElem);
});

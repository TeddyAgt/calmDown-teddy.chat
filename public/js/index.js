const overlay = document.querySelector("#overlay");
const usernameModal = document.querySelector("#username-modal");
const chatBtn = document.querySelector("#chat-link");
const cancelBtn = document.querySelector("#cancel-btn");
const usernameForm = document.querySelector("#username-form");
const usernameInput = document.querySelector("#username");
const errorMessageElement = document.querySelector(
    "#username-form .form-error"
);

overlay.addEventListener("click", hideUsernameModal);
usernameModal.addEventListener("click", (e) => e.stopPropagation());
chatBtn.addEventListener("click", handleClickChatBtn);
cancelBtn.addEventListener("click", hideUsernameModal);
usernameForm.addEventListener("submit", handleSubmitUsernameForm);
usernameInput.addEventListener("change", handleChangeUsernameInput);

function handleClickChatBtn(e) {
    e.preventDefault();
    const username = document.cookie
        .split("; ")
        .find((brownie) => brownie.startsWith("username="))
        ?.split("=")[1];

    if (username) {
        window.location = "/chat";
        return;
    }

    showUsernameModal();
}

function showUsernameModal(e) {
    overlay.classList.add("overlay--active");
    usernameInput.focus();
}

function hideUsernameModal() {
    usernameForm.reset();
    overlay.classList.remove("overlay--active");
}

function handleChangeUsernameInput() {}

function handleSubmitUsernameForm(e) {
    e.preventDefault();
    errorMessageElement.textContent = "";
    const username = e.target[0].value;

    // error handling
    if (!username) {
        errorMessageElement.textContent = "Choisis un pseudo mon BG";
        return;
    } else if (username.length < 4) {
        errorMessageElement.textContent =
            "Minimum 4 caractères pour le pseudo princesse";
        return;
    } else if (username.length > 31) {
        errorMessageElement.textContent =
            "Abuse pas le pseudo c'est 31 caractères max bro";
        return;
    }

    document.cookie = `username=${username}`;
    window.location = "/chat";
}

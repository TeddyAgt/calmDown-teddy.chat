const overlay = document.querySelector("#overlay");
const usernameModal = document.querySelector("#username-modal");
const chatBtn = document.querySelector("#chat-link");
const cancelBtn = document.querySelector("#cancel-btn");
const usernameForm = document.querySelector("#username-form");
const errorMessageElement = document.querySelector(
    "#username-form .form-error"
);

overlay.addEventListener("click", hideUsernameModal);
usernameModal.addEventListener("click", (e) => e.stopPropagation());
chatBtn.addEventListener("click", handleClickChatBtn);
cancelBtn.addEventListener("click", hideUsernameModal);
usernameForm.addEventListener("submit", handleSubmitUsernameForm);

function handleClickChatBtn(e) {
    e.preventDefault();
    const username = document.cookie
        .split("; ")
        .find((brownie) => brownie.startsWith("username="))
        ?.split("=")[1];
    console.log(username);

    if (username) {
        window.location = "/chat";
        return;
    }

    showUsernameModal();
}

function showUsernameModal(e) {
    // e.preventDefault();
    overlay.classList.add("overlay--active");
}

function hideUsernameModal() {
    usernameForm.reset();
    overlay.classList.remove("overlay--active");
}

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
    }

    document.cookie = `username=${username}`;
    window.location = "/chat";
}

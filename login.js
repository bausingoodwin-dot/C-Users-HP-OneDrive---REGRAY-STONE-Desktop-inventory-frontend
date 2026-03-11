// Get DOM elements
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("error");
const loginCard = document.querySelector(".login-card");

// Hardcoded admin credentials (replace with your own)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";

// Shake animation CSS
const style = document.createElement("style");
style.innerHTML = `
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-8px); }
  80% { transform: translateX(8px); }
  100% { transform: translateX(0); }
}
.shake {
  animation: shake 0.5s;
}
`;
document.head.appendChild(style);

// Handle login
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Check credentials
    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem("adminLoggedIn", "true");
        window.location.href = "index.html";
    } else {
        // Show error message
        errorMsg.textContent = "Invalid username or password";
        errorMsg.style.opacity = 0;
        errorMsg.style.transition = "opacity 0.3s";
        setTimeout(() => errorMsg.style.opacity = 1, 10);

        // Shake card
        loginCard.classList.remove("shake"); // reset if already shaking
        void loginCard.offsetWidth; // force reflow
        loginCard.classList.add("shake");

        // Clear password field
        passwordInput.value = "";
    }
});

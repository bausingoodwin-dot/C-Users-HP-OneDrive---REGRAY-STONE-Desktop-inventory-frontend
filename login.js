document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const errorEl = document.getElementById("error");
    errorEl.textContent = "";

    // Hardcoded credentials for admin (replace with your own logic)
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
        localStorage.setItem("adminLoggedIn", "true");
        window.location.href = "index.html";
    } else {
        errorEl.textContent = "Invalid username or password!";
        // Shake animation (optional)
        const form = document.getElementById("loginForm");
        form.classList.remove("shake");
        void form.offsetWidth; // trigger reflow
        form.classList.add("shake");
    }
});

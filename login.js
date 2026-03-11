document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const errorEl = document.getElementById("error");

    loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        // Check credentials
        if(username === "admin" && password === "12345"){
            localStorage.setItem("adminLoggedIn","true");
            window.location.href = "index.html"; // your dashboard file
        } else {
            errorEl.textContent = "Wrong username or password";
        }
    });

    // Clear error when typing again
    document.getElementById("username").addEventListener("input", ()=> { errorEl.textContent = ""; });
    document.getElementById("password").addEventListener("input", ()=> { errorEl.textContent = ""; });
});

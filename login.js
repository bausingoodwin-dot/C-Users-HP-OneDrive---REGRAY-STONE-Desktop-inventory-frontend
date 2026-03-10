document.addEventListener("DOMContentLoaded", function() {

    const loginForm = document.getElementById("loginForm");
    const errorEl = document.getElementById("error");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginBtn = loginForm.querySelector("button");

    // Auto focus username
    usernameInput.focus();

    loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Show loading effect
        loginBtn.textContent = "Logging in...";
        loginBtn.disabled = true;

        setTimeout(() => {

            if(username === "admin" && password === "12345"){

                localStorage.setItem("adminLoggedIn","true");

                // redirect to dashboard
                window.location.href = "index.html";

            } else {

                errorEl.textContent = "Wrong username or password";

                // shake effect
                loginForm.classList.add("shake");

                setTimeout(()=>{
                    loginForm.classList.remove("shake");
                },500);

                loginBtn.textContent = "Login";
                loginBtn.disabled = false;

            }

        },700);

    });

    // Clear error when typing again
    usernameInput.addEventListener("input", ()=> {
        errorEl.textContent = "";
    });

    passwordInput.addEventListener("input", ()=> {
        errorEl.textContent = "";
    });

});

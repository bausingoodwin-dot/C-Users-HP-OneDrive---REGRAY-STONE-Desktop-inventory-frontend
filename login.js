// Simple login system using localStorage
window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  // Replace with your own admin credentials
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
      localStorage.setItem("adminLoggedIn", "true");
      window.location.href = "index.html"; // redirect to dashboard
    } else {
      loginError.textContent = "Invalid username or password";
    }
  });
});

document.getElementById("loginForm").addEventListener("submit",function(e){

e.preventDefault();

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

if(username === "admin" && password === "12345"){

localStorage.setItem("adminLoggedIn","true");
window.location.href = "index.html";

}else{

document.getElementById("error").textContent = "Wrong username or password";

}

});

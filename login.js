document.getElementById("loginForm").addEventListener("submit",function(e){

e.preventDefault();

const username = document.getElementById("username").value.trim();
const password = document.getElementById("password").value.trim();

if(username === "admin" && password === "12345"){

localStorage.setItem("adminLoggedIn","true");
window.location.href = "index.html";

}else{

document.getElementById("error").textContent = "Wrong username or password";

}
document.getElementById("username").addEventListener("input", ()=> {
document.getElementById("error").textContent = "";
});

document.getElementById("password").addEventListener("input", ()=> {
document.getElementById("error").textContent = "";

});

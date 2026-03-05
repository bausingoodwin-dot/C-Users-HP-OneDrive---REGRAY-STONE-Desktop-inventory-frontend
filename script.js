let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

const table = document.getElementById("inventoryTable");
const totalProducts = document.getElementById("totalProducts");
const totalStock = document.getElementById("totalStock");

const addBtn = document.getElementById("stockInBtn");

addBtn.addEventListener("click", addProduct);

function addProduct(){

let name = document.getElementById("productName").value;
let qty = parseInt(document.getElementById("productQty").value);
let imageInput = document.getElementById("productImage");

if(name === "" || isNaN(qty)){
alert("Fill product name and quantity");
return;
}

let image = "";

if(imageInput.files[0]){

let reader = new FileReader();

reader.onload = function(e){

image = e.target.result;

saveProduct(name, qty, image);

};

reader.readAsDataURL(imageInput.files[0]);

}else{

saveProduct(name, qty, image);

}

}

function saveProduct(name, qty, image){

inventory.push({
name:name,
qty:qty,
image:image
});

localStorage.setItem("inventory", JSON.stringify(inventory));

displayProducts();

clearForm();

}

function displayProducts(){

table.innerHTML = "";

let stockTotal = 0;

inventory.forEach((item,index)=>{

stockTotal += item.qty;

let row = `

<tr>

<td>
<img src="${item.image}" width="60" onclick="previewImage('${item.image}')">
</td>

<td>${item.name}</td>

<td>${item.qty}</td>

<td>

<button onclick="stockIn(${index})">+</button>

<button onclick="stockOut(${index})">-</button>

<button onclick="deleteProduct(${index})" class="delete-btn">Delete</button>

</td>

</tr>

`;

table.innerHTML += row;

});

totalProducts.innerText = inventory.length;

totalStock.innerText = stockTotal;

}

function stockIn(index){

inventory[index].qty++;

saveData();

}

function stockOut(index){

if(inventory[index].qty > 0){

inventory[index].qty--;

saveData();

}

}

function deleteProduct(index){

inventory.splice(index,1);

saveData();

}

function saveData(){

localStorage.setItem("inventory", JSON.stringify(inventory));

displayProducts();

}

function clearForm(){

document.getElementById("productName").value = "";
document.getElementById("productQty").value = "";
document.getElementById("productImage").value = "";

}

function previewImage(src){

if(src === "") return;

document.getElementById("imagePreview").style.display = "block";

document.getElementById("previewImg").src = src;

}

document.getElementById("closePreview").onclick = function(){

document.getElementById("imagePreview").style.display = "none";

};

displayProducts();


document.getElementById("searchInput").addEventListener("keyup", function(){

let value = this.value.toLowerCase();

let rows = table.getElementsByTagName("tr");

for(let i=0;i<rows.length;i++){

let text = rows[i].innerText.toLowerCase();

rows[i].style.display = text.includes(value) ? "" : "none";

}

});

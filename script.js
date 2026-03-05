let products = JSON.parse(localStorage.getItem("products")) || [];

let history = JSON.parse(localStorage.getItem("history")) || [];

const table = document.getElementById("inventoryTable");
const historyTable = document.getElementById("historyTable");
const productSelect = document.getElementById("productSelect");

function saveData(){

localStorage.setItem("products", JSON.stringify(products));
localStorage.setItem("history", JSON.stringify(history));

}

function render(){

table.innerHTML = "";
productSelect.innerHTML = '<option value="">Select Product</option>';

let totalStock = 0;

products.forEach((p,i)=>{

totalStock += p.qty;

let option = `<option value="${i}">${p.name}</option>`;
productSelect.innerHTML += option;

let row = `

<tr>

<td><img src="${p.image}" width="50"></td>
<td>${p.name}</td>
<td>${p.category}</td>
<td>${p.qty}</td>

<td>

<button onclick="deleteProduct(${i})">Delete</button>

</td>

</tr>

`;

table.innerHTML += row;

});

document.getElementById("totalProducts").innerText = products.length;
document.getElementById("totalStocks").innerText = totalStock;

renderHistory();

}

function renderHistory(){

historyTable.innerHTML="";

history.forEach(h=>{

let row = `

<tr>

<td>${h.date}</td>
<td>${h.product}</td>
<td>${h.type}</td>
<td>${h.qty}</td>

</tr>

`;

historyTable.innerHTML += row;

});

}


document.getElementById("addProductForm").addEventListener("submit",function(e){

e.preventDefault();

let name=document.getElementById("name").value;
let category=document.getElementById("category").value;
let qty=parseInt(document.getElementById("quantity").value);
let imageInput=document.getElementById("image");

let image="";

if(imageInput.files[0]){

let reader=new FileReader();

reader.onload=function(e){

image=e.target.result;

products.push({name,category,qty,image});

saveData();
render();

};

reader.readAsDataURL(imageInput.files[0]);

}else{

products.push({name,category,qty,image});

saveData();
render();

}

this.reset();

});


document.getElementById("stockInBtn").onclick=function(){

let index=productSelect.value;
let qty=parseInt(document.getElementById("stockQty").value);

if(index===""||!qty) return;

products[index].qty+=qty;

history.push({

date:new Date().toLocaleString(),
product:products[index].name,
type:"IN",
qty

});

saveData();
render();

}


document.getElementById("stockOutBtn").onclick=function(){

let index=productSelect.value;
let qty=parseInt(document.getElementById("stockQty").value);

if(index===""||!qty) return;

if(products[index].qty<qty){

alert("Not enough stock");
return;

}

products[index].qty-=qty;

history.push({

date:new Date().toLocaleString(),
product:products[index].name,
type:"OUT",
qty

});

saveData();
render();

}


function deleteProduct(i){

if(confirm("Delete product?")){

products.splice(i,1);

saveData();
render();

}

}


document.getElementById("search").addEventListener("input",function(){

let value=this.value.toLowerCase();

let rows=table.getElementsByTagName("tr");

for(let i=0;i<rows.length;i++){

rows[i].style.display = rows[i].innerText.toLowerCase().includes(value) ? "" : "none";

}

});


document.getElementById("exportBtn").onclick=function(){

let csv="Product,Category,Stock\n";

products.forEach(p=>{

csv+=`${p.name},${p.category},${p.qty}\n`;

});

let blob=new Blob([csv]);

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);
a.download="inventory.csv";

a.click();

};

render();

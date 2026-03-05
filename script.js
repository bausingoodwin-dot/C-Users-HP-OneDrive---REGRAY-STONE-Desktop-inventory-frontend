let products = [];

function addProduct(){

let name = document.getElementById("productName").value;
let stock = document.getElementById("productStock").value;
let imageInput = document.getElementById("productImage");

if(name === "" || stock === ""){
alert("Please fill all fields");
return;
}

let imageURL = "";

if(imageInput.files[0]){
imageURL = URL.createObjectURL(imageInput.files[0]);
}

let product = {
name:name,
stock:stock,
image:imageURL
};

products.push(product);

displayProducts();

document.getElementById("productName").value="";
document.getElementById("productStock").value="";
imageInput.value="";
}


function displayProducts(){

let table = document.getElementById("productTable");
table.innerHTML="";

products.forEach((item,index)=>{

let row = `
<tr>

<td>
<img src="${item.image}" class="product-img" onclick="previewImage('${item.image}')">
</td>

<td>${item.name}</td>

<td>${item.stock}</td>

<td>

<button onclick="editStock(${index})">Edit</button>

<button onclick="deleteProduct(${index})">Delete</button>

</td>

</tr>
`;

table.innerHTML += row;

});

}


function deleteProduct(index){

products.splice(index,1);
displayProducts();

}


function editStock(index){

let newStock = prompt("Enter new stock:");

if(newStock !== null){
products[index].stock = newStock;
displayProducts();
}

}


function previewImage(src){

let modal = document.getElementById("previewModal");
let image = document.getElementById("previewImage");

modal.style.display="block";
image.src = src;

}


function closePreview(){
document.getElementById("previewModal").style.display="none";
}

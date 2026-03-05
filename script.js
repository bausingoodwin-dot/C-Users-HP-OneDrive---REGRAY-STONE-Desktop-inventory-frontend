let products = JSON.parse(localStorage.getItem("products")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

const inventoryTable = document.getElementById("inventoryTable");
const historyTable = document.getElementById("historyTable");
const productSelect = document.getElementById("productSelect");

const totalProducts = document.getElementById("totalProducts");
const totalStocks = document.getElementById("totalStocks");

function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("history", JSON.stringify(history));
}

function renderInventory() {

    inventoryTable.innerHTML = "";
    productSelect.innerHTML = `<option value="">Select Product</option>`;

    let stockCount = 0;

    products.forEach((p, index) => {

        stockCount += p.quantity;

        let option = document.createElement("option");
        option.value = index;
        option.textContent = p.name;
        productSelect.appendChild(option);

        let row = document.createElement("tr");

        row.innerHTML = `
        <td>${p.image ? `<img src="${p.image}" width="60">` : "-"}</td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.quantity}</td>
        <td><button onclick="deleteProduct(${index})">Delete</button></td>
        `;

        inventoryTable.appendChild(row);
    });

    totalProducts.textContent = products.length;
    totalStocks.textContent = stockCount;

    renderHistory();
}

function renderHistory() {

    historyTable.innerHTML = "";

    history.forEach(h => {

        let row = document.createElement("tr");

        row.innerHTML = `
        <td>${h.date}</td>
        <td>${h.product}</td>
        <td>${h.type}</td>
        <td>${h.qty}</td>
        `;

        historyTable.appendChild(row);
    });
}


document.getElementById("addProductForm").addEventListener("submit", function(e){

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const category = document.getElementById("category").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);
    const imageInput = document.getElementById("image");

    if(!name || !category || !quantity){
        alert("Please fill all fields");
        return;
    }

    let image = "";

    if(imageInput.files[0]){

        const reader = new FileReader();

        reader.onload = function(e){

            image = e.target.result;

            addProduct(name,category,quantity,image);
        };

        reader.readAsDataURL(imageInput.files[0]);

    }else{

        addProduct(name,category,quantity,image);

    }

});


function addProduct(name,category,quantity,image){

    products.push({
        name:name,
        category:category,
        quantity:quantity,
        image:image
    });

    saveData();
    renderInventory();

    document.getElementById("addProductForm").reset();
}



document.getElementById("stockInBtn").addEventListener("click",function(){

    const index = productSelect.value;
    const qty = parseInt(document.getElementById("stockQty").value);

    if(index === "" || !qty) return;

    products[index].quantity += qty;

    history.push({
        date:new Date().toLocaleString(),
        product:products[index].name,
        type:"IN",
        qty:qty
    });

    saveData();
    renderInventory();
});


document.getElementById("stockOutBtn").addEventListener("click",function(){

    const index = productSelect.value;
    const qty = parseInt(document.getElementById("stockQty").value);

    if(index === "" || !qty) return;

    if(products[index].quantity < qty){
        alert("Not enough stock");
        return;
    }

    products[index].quantity -= qty;

    history.push({
        date:new Date().toLocaleString(),
        product:products[index].name,
        type:"OUT",
        qty:qty
    });

    saveData();
    renderInventory();
});


function deleteProduct(index){

    if(confirm("Delete product?")){

        products.splice(index,1);

        saveData();
        renderInventory();
    }
}


document.getElementById("search").addEventListener("input",function(){

    const value = this.value.toLowerCase();
    const rows = inventoryTable.getElementsByTagName("tr");

    for(let i=0;i<rows.length;i++){

        rows[i].style.display =
        rows[i].innerText.toLowerCase().includes(value)
        ? ""
        : "none";

    }

});


document.getElementById("exportBtn").addEventListener("click",function(){

    let csv = "Product,Category,Stock\n";

    products.forEach(p=>{
        csv += `${p.name},${p.category},${p.quantity}\n`;
    });

    const blob = new Blob([csv]);
    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "inventory.csv";
    a.click();

});


renderInventory();

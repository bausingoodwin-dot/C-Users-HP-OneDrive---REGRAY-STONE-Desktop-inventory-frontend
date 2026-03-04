const tableBody = document.querySelector("#inventoryTable tbody");
const totalProducts = document.getElementById("totalProducts");
const totalStock = document.getElementById("totalStock");
const logBody = document.querySelector("#logTable tbody");

let products = JSON.parse(localStorage.getItem("products")) || [];
let logs = JSON.parse(localStorage.getItem("logs")) || [];

/* ------------------------------
   SAVE + LOAD
--------------------------------*/

function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("logs", JSON.stringify(logs));
}

function loadData() {
    tableBody.innerHTML = "";
    logBody.innerHTML = "";

    products.forEach((p, index) => renderRow(p, index));
    logs.forEach(log => renderLog(log));

    updateSummary();
}

/* ------------------------------
   ADD PRODUCT
--------------------------------*/

function addProduct() {

    let name = prompt("Product name:");
    if (!name) return;

    let categoryOptions = ["PATAGONIA QUARTZITE","QUARTZITE","ONYX","MARBLE","GRANITE","TRAVERTINE","LIMESTONE","CRAZY CUTS","COBBLESTONE"];
    let unitOptions = ["SLABS","PIECE"];

    let category = prompt("Category:\n" + categoryOptions.join("\n"));
    let size = prompt("Size:");
    let unit = prompt("Unit:\n" + unitOptions.join("\n"));
    let supplier = prompt("Supplier:");
    let price = prompt("Price:");
    let stock = parseInt(prompt("Stock:")) || 0;

    let today = new Date().toLocaleString();

    let product = {
        name, category, size, unit, supplier, price,
        stock,
        lastUpdated: today,
        image: ""
    };

    products.push(product);
    saveData();
    loadData();
}

/* ------------------------------
   RENDER ROW
--------------------------------*/

function renderRow(product, index) {

    let row = tableBody.insertRow();

    row.innerHTML = `
        <td>
            <img src="${product.image || ''}" class="thumb" data-index="${index}">
            <input type="file" onchange="changeImage(event, ${index})">
        </td>
        <td contenteditable onblur="updateField(${index}, 'name', this.innerText)">${product.name}</td>
        <td contenteditable onblur="updateField(${index}, 'category', this.innerText)">${product.category}</td>
        <td contenteditable onblur="updateField(${index}, 'size', this.innerText)">${product.size}</td>
        <td contenteditable onblur="updateField(${index}, 'unit', this.innerText)">${product.unit}</td>
        <td contenteditable onblur="updateField(${index}, 'supplier', this.innerText)">${product.supplier}</td>
        <td contenteditable onblur="updateField(${index}, 'price', this.innerText)">${product.price}</td>
        <td contenteditable onblur="updateStock(${index}, this.innerText)">${product.stock}</td>
        <td>${product.lastUpdated}</td>
        <td><button onclick="deleteProduct(${index})">Delete</button></td>
    `;

    if (product.stock < 5) {
        row.classList.add("low-stock");
    }
}

/* ------------------------------
   UPDATE FIELD
--------------------------------*/

function updateField(index, field, value) {
    products[index][field] = value;
    saveData();
}

/* ------------------------------
   UPDATE STOCK + LOG
--------------------------------*/

function updateStock(index, value) {

    let oldStock = products[index].stock;
    let newStock = parseInt(value) || 0;

    if (oldStock !== newStock) {

        let date = new Date().toLocaleString();

        products[index].stock = newStock;
        products[index].lastUpdated = date;

        logs.push({
            name: products[index].name,
            oldStock,
            newStock,
            date
        });

        saveData();
        loadData();
    }
}

/* ------------------------------
   CHANGE IMAGE ANYTIME
--------------------------------*/

function changeImage(event, index) {

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        products[index].image = e.target.result;
        saveData();
        loadData();
    };
    reader.readAsDataURL(file);
}

/* ------------------------------
   DELETE
--------------------------------*/

function deleteProduct(index) {
    products.splice(index, 1);
    saveData();
    loadData();
}

/* ------------------------------
   SUMMARY
--------------------------------*/

function updateSummary() {
    totalProducts.textContent = products.length;
    totalStock.textContent = products.reduce((sum, p) => sum + p.stock, 0);
}

/* ------------------------------
   TRANSACTION LOG
--------------------------------*/

function renderLog(log) {
    let row = logBody.insertRow();
    row.innerHTML = `
        <td>${log.name}</td>
        <td>${log.oldStock}</td>
        <td>${log.newStock}</td>
        <td>${log.date}</td>
    `;
}

/* ------------------------------
   NAVIGATION
--------------------------------*/

function showDashboard() {
    document.getElementById("dashboardPage").style.display = "block";
    document.getElementById("transactionPage").style.display = "none";
}

function showTransactions() {
    document.getElementById("dashboardPage").style.display = "none";
    document.getElementById("transactionPage").style.display = "block";
}

/* ------------------------------
   IMAGE MODAL PREVIEW
--------------------------------*/

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("thumb") && e.target.src) {
        document.getElementById("modalImage").src = e.target.src;
        document.getElementById("imageModal").classList.add("show");
    }
});

document.getElementById("imageModal").addEventListener("click", function() {
    this.classList.remove("show");
});

/* ------------------------------
   INITIAL LOAD
--------------------------------*/

loadData();

// ========================================
// REGRAY INVENTORY SYSTEM - PROFESSIONAL VERSION
// ========================================

// Load inventory & logs
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ================= SAVE SYSTEM =================
function saveData() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ================= DROPDOWN UPDATE =================
function updateProductDropdown() {
    const select = document.getElementById("product");
    select.innerHTML = "";

    for (let product in inventory) {
        const option = document.createElement("option");
        option.value = product;
        option.textContent = product;
        select.appendChild(option);
    }

    updateCategoryField();
}

// ================= CATEGORY AUTO FILL =================
function updateCategoryField() {
    const selected = document.getElementById("product").value;
    const categoryInput = document.getElementById("category");

    if (inventory[selected]) {
        categoryInput.value = inventory[selected].category;
    } else {
        categoryInput.value = "";
    }
}

// ================= TABLE UPDATE =================
function updateTable() {
    const tableBody = document.getElementById("inventoryTable");
    tableBody.innerHTML = "";

    const searchValue = document.getElementById("search").value.toLowerCase();

    for (let product in inventory) {

        if (!product.toLowerCase().includes(searchValue)) continue;

        const row = document.createElement("tr");

        if (inventory[product].quantity < 5) {
            row.classList.add("low-stock");
        }

        row.innerHTML = `
            <td>${product}</td>
            <td>${inventory[product].category}</td>
            <td>${inventory[product].quantity}</td>
            <td>
                <button onclick="deleteProduct('${product}')">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    }

    updateSummary();
}

// ================= SUMMARY =================
function updateSummary() {
    let totalProducts = Object.keys(inventory).length;
    let totalStocks = 0;

    for (let product in inventory) {
        totalStocks += inventory[product].quantity;
    }

    document.getElementById("totalProducts").textContent = totalProducts;
    document.getElementById("totalStocks").textContent = totalStocks;
    document.getElementById("totalItems").textContent = totalStocks;
}

// ================= ADD NEW PRODUCT =================
function addNewProduct() {
    const name = document.getElementById("newProductName").value.trim();
    const category = document.getElementById("newProductCategory").value.trim();

    if (!name || !category) {
        alert("Please fill all fields.");
        return;
    }

    if (inventory[name]) {
        alert("Product already exists.");
        return;
    }

    inventory[name] = {
        category: category,
        quantity: 0
    };

    saveData();
    updateProductDropdown();
    updateTable();

    document.getElementById("newProductName").value = "";
    document.getElementById("newProductCategory").value = "";
}

// ================= STOCK IN =================
function stockIn() {
    const product = document.getElementById("product").value;
    const qty = parseInt(document.getElementById("quantity").value);

    if (!product || isNaN(qty) || qty <= 0) {
        alert("Enter valid quantity.");
        return;
    }

    inventory[product].quantity += qty;

    transactions.push({
        product,
        type: "Stock In",
        quantity: qty,
        date: new Date().toLocaleString()
    });

    saveData();
    updateTable();
    document.getElementById("quantity").value = "";
}

// ================= STOCK OUT =================
function stockOut() {
    const product = document.getElementById("product").value;
    const qty = parseInt(document.getElementById("quantity").value);

    if (!product || isNaN(qty) || qty <= 0) {
        alert("Enter valid quantity.");
        return;
    }

    if (inventory[product].quantity < qty) {
        alert("Not enough stock.");
        return;
    }

    inventory[product].quantity -= qty;

    transactions.push({
        product,
        type: "Stock Out",
        quantity: qty,
        date: new Date().toLocaleString()
    });

    saveData();
    updateTable();
    document.getElementById("quantity").value = "";
}

// ================= DELETE PRODUCT =================
function deleteProduct(product) {
    if (confirm("Delete this product?")) {
        delete inventory[product];
        saveData();
        updateProductDropdown();
        updateTable();
    }
}

// ================= EXPORT CSV =================
function exportCSV() {
    let csv = "Product,Category,Quantity\n";

    for (let product in inventory) {
        csv += `${product},${inventory[product].category},${inventory[product].quantity}\n`;
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inventory.csv";
    link.click();
}

// ================= INITIAL LOAD =================
document.getElementById("product").addEventListener("change", updateCategoryField);

updateProductDropdown();
updateTable();

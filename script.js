let products = JSON.parse(localStorage.getItem("inventory")) || [];

// Elements
const addProductForm = document.getElementById("addProductForm");
const productSelect = document.getElementById("product");
const categoryInput = document.getElementById("category");
const inventoryTable = document.getElementById("inventoryTable");
const totalProducts = document.getElementById("totalProducts");
const totalStocks = document.getElementById("totalStocks");
const searchInput = document.getElementById("search");
const quantityInput = document.getElementById("quantity");

// Save Data
function saveData() {
    localStorage.setItem("inventory", JSON.stringify(products));
}

// Update Summary
function updateSummary() {
    totalProducts.textContent = products.length;
    totalStocks.textContent = products.reduce((sum, p) => sum + p.quantity, 0);
}

// Render Products
function renderProducts(filter = "") {
    inventoryTable.innerHTML = "";
    productSelect.innerHTML = "<option value=''>Select Product</option>";

    products.forEach((product, index) => {

        if (!product.name.toLowerCase().includes(filter.toLowerCase())) return;

        // Add to select dropdown
        const option = document.createElement("option");
        option.value = index;
        option.textContent = product.name;
        productSelect.appendChild(option);

        // Create table row
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><img src="${product.image}" style="cursor:pointer"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>${product.lastUpdated || "-"}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        // Delete Button
        row.querySelector(".delete-btn").addEventListener("click", () => {
            if (confirm("Delete this product?")) {
                products.splice(index, 1);
                saveData();
                renderProducts(searchInput.value);
            }
        });

        // Image Preview
        row.querySelector("img").addEventListener("click", () => {
            previewImage(product.image);
        });

        inventoryTable.appendChild(row);
    });

    updateSummary();
}

// Add Product (FIXED)
addProductForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("newProductName").value.trim();
    const category = document.getElementById("newProductCategory").value.trim();
    const imageInput = document.getElementById("newProductImage");
    const imageFile = imageInput.files[0];

    if (!name || !category) {
        alert("Please fill in product name and category.");
        return;
    }

    if (!imageFile) {
        alert("Please select an image.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function() {
        products.push({
            name: name,
            category: category,
            quantity: 0,
            image: reader.result,
            lastUpdated: "-"
        });

        saveData();
        renderProducts(searchInput.value);
        addProductForm.reset();
    };

    reader.readAsDataURL(imageFile);
});

// Update category on select
productSelect.addEventListener("change", function() {
    const index = this.value;
    categoryInput.value = index !== "" ? products[index].category : "";
});

// Stock In
document.getElementById("stockInBtn").addEventListener("click", function() {
    const index = productSelect.value;
    const qty = parseInt(quantityInput.value);

    if (index === "" || !qty || qty <= 0) {
        alert("Select product and enter valid quantity.");
        return;
    }

    products[index].quantity += qty;
    products[index].lastUpdated = new Date().toLocaleString();

    saveData();
    renderProducts(searchInput.value);
    quantityInput.value = "";
});

// Stock Out
document.getElementById("stockOutBtn").addEventListener("click", function() {
    const index = productSelect.value;
    const qty = parseInt(quantityInput.value);

    if (index === "" || !qty || qty <= 0) {
        alert("Select product and enter valid quantity.");
        return;
    }

    if (products[index].quantity < qty) {
        alert("Not enough stock!");
        return;
    }

    products[index].quantity -= qty;
    products[index].lastUpdated = new Date().toLocaleString();

    saveData();
    renderProducts(searchInput.value);
    quantityInput.value = "";
});

// Search
searchInput.addEventListener("input", function() {
    renderProducts(this.value);
});

// Export CSV
document.getElementById("exportBtn").addEventListener("click", function() {
    let csv = "Product,Category,Quantity,Last Updated\n";

    products.forEach(p => {
        csv += `"${p.name}","${p.category}",${p.quantity},"${p.lastUpdated}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
});

// Image Preview Modal
function previewImage(src) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.8)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = 9999;

    overlay.addEventListener("click", () => {
        document.body.removeChild(overlay);
    });

    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "80%";
    img.style.maxHeight = "80%";
    img.style.borderRadius = "10px";

    overlay.appendChild(img);
    document.body.appendChild(overlay);
}

// Initial Load
renderProducts();

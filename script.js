let products = JSON.parse(localStorage.getItem("inventory")) || [];

const addProductForm = document.getElementById("addProductForm");
const productSelect = document.getElementById("product");
const categoryInput = document.getElementById("category");
const inventoryTable = document.getElementById("inventoryTable");
const totalProducts = document.getElementById("totalProducts");
const totalStocks = document.getElementById("totalStocks");
const searchInput = document.getElementById("search");
const quantityInput = document.getElementById("quantity");

// Save to localStorage
function saveData() {
    localStorage.setItem("inventory", JSON.stringify(products));
}

// Update total summary
function updateSummary() {
    totalProducts.textContent = products.length;
    totalStocks.textContent = products.reduce((sum, p) => sum + p.quantity, 0);
}

// Render table and select options
function renderProducts(filter = "") {
    inventoryTable.innerHTML = "";
    productSelect.innerHTML = "<option value=''>Select Product</option>";

    products.forEach((product, index) => {
        if (!product.name.toLowerCase().includes(filter.toLowerCase())) return;

        // Populate product select
        const option = document.createElement("option");
        option.value = index;
        option.textContent = product.name;
        productSelect.appendChild(option);

        // Table row
        const tr = document.createElement("tr");

        // Image cell with preview
        const imgTd = document.createElement("td");
        const img = document.createElement("img");
        img.src = product.image;
        img.style.cursor = "pointer";
        img.addEventListener("click", () => previewImage(product.image));
        imgTd.appendChild(img);
        tr.appendChild(imgTd);

        tr.innerHTML += `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>${product.lastUpdated || "-"}</td>
        `;

        const actionTd = document.createElement("td");
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "delete-btn";
        delBtn.addEventListener("click", () => deleteProduct(index));
        actionTd.appendChild(delBtn);
        tr.appendChild(actionTd);

        inventoryTable.appendChild(tr);
    });

    updateSummary();
}

// Delete product
function deleteProduct(index) {
    if (confirm("Are you sure you want to delete this product?")) {
        products.splice(index, 1);
        saveData();
        renderProducts(searchInput.value);
    }
}

// Add product
addProductForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("newProductName").value.trim();
    const category = document.getElementById("newProductCategory").value.trim();
    const imageFile = document.getElementById("newProductImage").files[0];

    if (!name || !category || !imageFile) return;

    const reader = new FileReader();
    reader.onload = function() {
        products.push({
            name,
            category,
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

// Update category when selecting product
productSelect.addEventListener("change", function() {
    const index = this.value;
    categoryInput.value = index !== "" ? products[index].category : "";
});

// Stock In
document.getElementById("stockInBtn").addEventListener("click", function() {
    const index = productSelect.value;
    const qty = parseInt(quantityInput.value);

    if (index === "" || !qty || qty <= 0) {
        alert("Please select a product and enter a valid quantity.");
        return;
    }

    products[index].quantity += qty;
    products[index].lastUpdated = new Date().toLocaleString();

    saveData();
    renderProducts(searchInput.value);
});

// Stock Out
document.getElementById("stockOutBtn").addEventListener("click", function() {
    const index = productSelect.value;
    const qty = parseInt(quantityInput.value);

    if (index === "" || !qty || qty <= 0) {
        alert("Please select a product and enter a valid quantity.");
        return;
    }

    if (products[index].quantity >= qty) {
        products[index].quantity -= qty;
        products[index].lastUpdated = new Date().toLocaleString();
        saveData();
        renderProducts(searchInput.value);
    } else {
        alert("Not enough stock!");
    }
});

// Export CSV
document.getElementById("exportBtn").addEventListener("click", function() {
    let csv = "Product,Category,Quantity,Last Updated\n";
    products.forEach(p => {
        const name = `"${p.name.replace(/"/g, '""')}"`;
        const category = `"${p.category.replace(/"/g, '""')}"`;
        csv += `${name},${category},${p.quantity},${p.lastUpdated}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
});

// Search
searchInput.addEventListener("input", function() {
    renderProducts(this.value);
});

// Image preview modal
function previewImage(src) {
    // Create overlay
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
    overlay.addEventListener("click", () => document.body.removeChild(overlay));

    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "80%";
    img.style.maxHeight = "80%";
    img.style.borderRadius = "10px";
    overlay.appendChild(img);

    document.body.appendChild(overlay);
}

// Initial render
renderProducts();

let products = JSON.parse(localStorage.getItem("inventory")) || [];

const addProductForm = document.getElementById("addProductForm");
const productSelect = document.getElementById("product");
const categoryInput = document.getElementById("category");
const inventoryTable = document.getElementById("inventoryTable");
const totalProducts = document.getElementById("totalProducts");
const totalStocks = document.getElementById("totalStocks");
const searchInput = document.getElementById("search");

function saveData() {
    localStorage.setItem("inventory", JSON.stringify(products));
}

function updateSummary() {
    totalProducts.textContent = products.length;
    totalStocks.textContent = products.reduce((sum, p) => sum + p.quantity, 0);
}

function renderProducts(filter = "") {
    inventoryTable.innerHTML = "";
    productSelect.innerHTML = "<option value=''>Select Product</option>";

    products.forEach((product, index) => {

        if (!product.name.toLowerCase().includes(filter.toLowerCase())) return;

        const option = document.createElement("option");
        option.value = index;
        option.textContent = product.name;
        productSelect.appendChild(option);

        inventoryTable.innerHTML += `
            <tr>
                <td><img src="${product.image}"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>${product.lastUpdated || "-"}</td>
                <td>
                    <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
                </td>
            </tr>
        `;
    });

    updateSummary();
}

function deleteProduct(index) {
    products.splice(index, 1);
    saveData();
    renderProducts();
}

addProductForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("newProductName").value;
    const category = document.getElementById("newProductCategory").value;
    const imageFile = document.getElementById("newProductImage").files[0];

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
        renderProducts();
        addProductForm.reset();
    };

    reader.readAsDataURL(imageFile);
});

productSelect.addEventListener("change", function() {
    const index = this.value;
    categoryInput.value = index !== "" ? products[index].category : "";
});

document.getElementById("stockInBtn").addEventListener("click", function() {
    const index = productSelect.value;
    const qty = parseInt(document.getElementById("quantity").value);

    if (index === "" || !qty) return;

    products[index].quantity += qty;
    products[index].lastUpdated = new Date().toLocaleString();

    saveData();
    renderProducts();
});

document.getElementById("stockOutBtn").addEventListener("click", function() {
    const index = productSelect.value;
    const qty = parseInt(document.getElementById("quantity").value);

    if (index === "" || !qty) return;

    if (products[index].quantity >= qty) {
        products[index].quantity -= qty;
        products[index].lastUpdated = new Date().toLocaleString();
    } else {
        alert("Not enough stock!");
    }

    saveData();
    renderProducts();
});

document.getElementById("exportBtn").addEventListener("click", function() {
    let csv = "Product,Category,Quantity,Last Updated\n";

    products.forEach(p => {
        csv += `${p.name},${p.category},${p.quantity},${p.lastUpdated}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
});

searchInput.addEventListener("input", function() {
    renderProducts(this.value);
});

renderProducts();

let inventory = {};

// ================= LOAD INVENTORY =================
async function loadInventory() {
    try {
        const res = await fetch("/api/inventory");
        if (!res.ok) throw new Error("Failed to fetch inventory");

        inventory = await res.json();
        loadProductDropdown();
        updateTable();
    } catch (err) {
        alert("Failed to load inventory: " + err.message);
    }
}

// ================= STOCK IN =================
async function stockIn() {
    const product = document.getElementById("product").value;
    const qty = parseInt(document.getElementById("quantity").value);
    const category = document.getElementById("category").value;

    if (!product) return alert("Select a product");
    if (!Number.isInteger(qty) || qty <= 0)
        return alert("Enter a valid positive quantity");

    try {
        const res = await fetch("/api/stockin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product, quantity: qty, category })
        });

        if (!res.ok) throw new Error(await res.text());

        inventory = await res.json();
        updateTable();
        document.getElementById("quantity").value = "";
    } catch (err) {
        alert("Stock In failed: " + err.message);
    }
}

// ================= STOCK OUT =================
async function stockOut() {
    const product = document.getElementById("product").value;
    const qty = parseInt(document.getElementById("quantity").value);

    if (!product) return alert("Select a product");
    if (!Number.isInteger(qty) || qty <= 0)
        return alert("Enter a valid positive quantity");

    try {
        const res = await fetch("/api/stockout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product, quantity: qty })
        });

        if (!res.ok) throw new Error(await res.text());

        inventory = await res.json();
        updateTable();
        document.getElementById("quantity").value = "";
    } catch (err) {
        alert("Stock Out failed: " + err.message);
    }
}

// ================= DELETE PRODUCT =================
async function deleteProduct(product) {
    if (!confirm(`Delete ${product}?`)) return;

    try {
        const res = await fetch(`/api/product/${encodeURIComponent(product)}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error(await res.text());

        inventory = await res.json();
        loadProductDropdown();
        updateTable();
    } catch (err) {
        alert("Delete failed: " + err.message);
    }
}

// ================= ADD NEW PRODUCT =================
async function addNewProduct() {
    const name = document.getElementById("newProductName").value.trim();
    const category = document.getElementById("newProductCategory").value.trim();

    if (!name || !category)
        return alert("Enter valid name and category");

    try {
        const res = await fetch("/api/product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product: name, category })
        });

        if (!res.ok) throw new Error(await res.text());

        inventory[name] = { category, quantity: 0 };
        loadProductDropdown();
        updateTable();

        document.getElementById("newProductName").value = "";
        document.getElementById("newProductCategory").value = "";
    } catch (err) {
        alert("Add product failed: " + err.message);
    }
}

// ================= DROPDOWN =================
function loadProductDropdown() {
    const dropdown = document.getElementById("product");
    dropdown.innerHTML = "";

    Object.keys(inventory).sort().forEach(product => {
        const option = document.createElement("option");
        option.value = product;
        option.textContent = product;
        dropdown.appendChild(option);
    });

    dropdown.onchange = () => {
        document.getElementById("category").value =
            inventory[dropdown.value]?.category || "";
    };

    if (dropdown.options.length > 0) {
        dropdown.selectedIndex = 0;
        dropdown.onchange();
    }
}

// ================= UPDATE TABLE =================
function updateTable() {
    const table = document.getElementById("inventoryTable");
    const search = document.getElementById("search").value.toLowerCase();
    table.innerHTML = "";

    let totalStock = 0;
    const fragment = document.createDocumentFragment();

    Object.keys(inventory).forEach(product => {
        if (!product.toLowerCase().includes(search)) return;

        totalStock += inventory[product].quantity;

        const tr = document.createElement("tr");

        // Low stock warning
        if (inventory[product].quantity <= 5) {
            tr.classList.add("low-stock");
        }

        tr.innerHTML = `
            <td>${product}</td>
            <td>${inventory[product].category}</td>
            <td>${inventory[product].quantity}</td>
            <td>
                <button onclick="deleteProduct('${product}')" class="danger">
                    Delete
                </button>
            </td>
        `;

        fragment.appendChild(tr);
    });

    table.appendChild(fragment);

    // Summary
    document.getElementById("totalProducts").innerText =
        Object.keys(inventory).length;

    document.getElementById("totalStocks").innerText = totalStock;
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
    link.download = "inventory_report.csv";
    link.click();
}

// ================= INITIALIZE =================
loadInventory();

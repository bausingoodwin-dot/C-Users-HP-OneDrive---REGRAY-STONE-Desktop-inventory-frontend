// Load inventory from localStorage or initialize
let inventory = JSON.parse(localStorage.getItem("inventory"));

if (!inventory) {
    inventory = [
        { product: "ANGELI LUCE", category: "PATAGONIA QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 0, updated: "" },
        { product: "ARCTIC PINK 2", category: "PATAGONIA QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 0, updated: "" },
        { product: "FOLLAJE ROSA", category: "PATAGONIA QUARTZITE", size: "3.42 X 2.01 M", unit: "", supplier: "", price: "", stock: 8, updated: "" },
        { product: "FOLLAJE ROSA", category: "PATAGONIA QUARTZITE", size: "3.43 X 2.01 M", unit: "", supplier: "", price: "", stock: 8, updated: "" },
        { product: "FRACASSI", category: "PATAGONIA QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 0, updated: "" },
        { product: "AVOCADO GREEN", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 3, updated: "" },
        { product: "BULGARI WHITE", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 2, updated: "" },
        { product: "MONT BLANC", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 1, updated: "" },
        { product: "OCEAN BLUE", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 8, updated: "" },
        { product: "SAGE CASCADE", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 3, updated: "" },
        { product: "SAGE CASCADE 2", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 5, updated: "" },
        { product: "CLASSICAL GREEN", category: "ONYX", size: "", unit: "", supplier: "", price: "", stock: 2, updated: "" },
        { product: "CALACATTA VIOLA 1", category: "MARBLE", size: "", unit: "", supplier: "", price: "", stock: 11, updated: "" },
        { product: "CIPPOLINO UNDULATO 2", category: "MARBLE", size: "", unit: "", supplier: "", price: "", stock: 8, updated: "" },
        { product: "CREMA MARFIL", category: "MARBLE", size: "", unit: "", supplier: "", price: "", stock: 2, updated: "" },
        { product: "GOLDEN BLACK MARQUINA", category: "MARBLE", size: "", unit: "", supplier: "", price: "", stock: 19, updated: "" }
        // Add the rest of your products here...
    ];

    localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Function to load inventory into table
function loadInventory() {
    const tableBody = document.querySelector("#inventoryTable tbody");
    tableBody.innerHTML = "";

    let totalStock = 0;

    inventory.forEach((item, index) => {
        totalStock += item.stock;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.category}</td>
            <td>${item.size}</td>
            <td>${item.unit}</td>
            <td>${item.supplier}</td>
            <td>${item.price}</td>
            <td>${item.stock}</td>
            <td>${item.updated}</td>
            <td>
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById("totalProducts").textContent = inventory.length;
    document.getElementById("totalStock").textContent = totalStock;
}

// Edit a product
function editProduct(index) {
    const item = inventory[index];
    const newStock = prompt(`Edit stock for ${item.product}:`, item.stock);
    if (newStock !== null && !isNaN(parseInt(newStock))) {
        item.stock = parseInt(newStock);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        loadInventory();
    }
}

// Delete a product
function deleteProduct(index) {
    if (confirm(`Delete ${inventory[index].product}?`)) {
        inventory.splice(index, 1);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        loadInventory();
    }
}

// Load table on page open
loadInventory();

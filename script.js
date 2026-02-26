// Load inventory from localStorage
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

// Load inventory into table
function loadInventory() {
    const tableBody = document.querySelector("#inventoryTable tbody");
    tableBody.innerHTML = "";

    for (let product in inventory) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${product}</td><td>${inventory[product]}</td>`;
        tableBody.appendChild(row);
    }
}

// Save inventory to localStorage
function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Stock in function
document.getElementById("stockInBtn").addEventListener("click", () => {
    const product = document.getElementById("product").value.trim();
    const qty = parseInt(document.getElementById("quantity").value);

    if (!product || isNaN(qty) || qty <= 0) {
        alert("Please enter a valid product name and quantity.");
        return;
    }

    if (inventory[product]) {
        inventory[product] += qty;
    } else {
        inventory[product] = qty;
    }

    saveInventory();
    document.getElementById("product").value = "";
    document.getElementById("quantity").value = "";
    loadInventory();
});

// Initial load
loadInventory();

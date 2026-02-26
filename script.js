let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function loadInventory() {
    const tableBody = document.querySelector("#inventoryTable tbody");
    tableBody.innerHTML = "";

    let totalProducts = 0;
    let totalQuantity = 0;

    for (let product in inventory) {
        totalProducts++;
        totalQuantity += inventory[product];

        const row = document.createElement("tr");
        row.innerHTML = `<td>${product}</td><td>${inventory[product]}</td>`;
        tableBody.appendChild(row);
    }

    document.getElementById("totalProducts").textContent = totalProducts;
    document.getElementById("totalQuantity").textContent = totalQuantity;
}

document.getElementById("stockInBtn").addEventListener("click", () => {
    const product = document.getElementById("product").value.trim();
    const qty = parseInt(document.getElementById("quantity").value);

    if (!product || isNaN(qty) || qty <= 0) {
        alert("Enter valid product and quantity.");
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

loadInventory();

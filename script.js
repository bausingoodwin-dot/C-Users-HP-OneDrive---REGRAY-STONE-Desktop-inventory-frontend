let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function loadInventory() {
    const tableBody = document.querySelector("#inventoryTable tbody");
    tableBody.innerHTML = "";

    let totalQuantity = 0;

    inventory.forEach((item, index) => {
        totalQuantity += item.quantity;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${item.description}</td>
            <td><button onclick="deleteProduct(${index})">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById("totalProducts").textContent = inventory.length;
    document.getElementById("totalQuantity").textContent = totalQuantity;
}

function deleteProduct(index) {
    inventory.splice(index, 1);
    saveInventory();
    loadInventory();
}

document.getElementById("addBtn").addEventListener("click", () => {
    const product = document.getElementById("product").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);
    const description = document.getElementById("description").value.trim();

    if (!product || isNaN(quantity) || quantity <= 0) {
        alert("Please enter valid product details.");
        return;
    }

    inventory.push({
        product,
        quantity,
        description
    });

    saveInventory();

    document.getElementById("product").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("description").value = "";

    loadInventory();
});

loadInventory();

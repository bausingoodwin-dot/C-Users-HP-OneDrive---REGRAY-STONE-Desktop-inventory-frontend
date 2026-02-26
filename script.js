let inventory = JSON.parse(localStorage.getItem("inventory"));

// Initialize inventory if empty
if (!inventory) {
    inventory = [
        { product: "ANGELI LUCE", category: "PATAGONIA QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 0, updated: "" },
        { product: "ARCTIC PINK 2", category: "PATAGONIA QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 0, updated: "" },
        { product: "FOLLAJE ROSA", category: "PATAGONIA QUARTZITE", size: "3.42 X 2.01 M", unit: "", supplier: "", price: "", stock: 8, updated: "" },
        { product: "FOLLAJE ROSA", category: "PATAGONIA QUARTZITE", size: "3.43 X 2.01 M", unit: "", supplier: "", price: "", stock: 8, updated: "" }
        // add remaining products here
    ];
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function loadInventory() {
    const tbody = document.querySelector("#inventoryTable tbody");
    tbody.innerHTML = "";
    let totalStock = 0;

    inventory.forEach((item, index) => {
        totalStock += item.stock;
        const row = document.createElement("tr");

        row.innerHTML = `
            <td contenteditable="true" oninput="updateField(${index}, 'product', this.innerText)">${item.product}</td>
            <td contenteditable="true" oninput="updateField(${index}, 'category', this.innerText)">${item.category}</td>
            <td contenteditable="true" oninput="updateField(${index}, 'size', this.innerText)">${item.size}</td>
            <td contenteditable="true" oninput="updateField(${index}, 'unit', this.innerText)">${item.unit}</td>
            <td contenteditable="true" oninput="updateField(${index}, 'supplier', this.innerText)">${item.supplier}</td>
            <td contenteditable="true" oninput="updateField(${index}, 'price', this.innerText)">${item.price}</td>
            <td contenteditable="true" oninput="updateField(${index}, 'stock', this.innerText, true)">${item.stock}</td>
            <td contenteditable="true" oninput="updateField(${index}, 'updated', this.innerText)">${item.updated}</td>
            <td><button onclick="deleteProduct(${index})">Delete</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById("totalProducts").textContent = inventory.length;
    document.getElementById("totalStock").textContent = totalStock;
}

function updateField(index, field, value, isNumber=false) {
    if (isNumber) {
        let num = parseInt(value);
        inventory[index][field] = isNaN(num) ? 0 : num;
    } else {
        inventory[index][field] = value;
    }
    localStorage.setItem("inventory", JSON.stringify(inventory));
    loadInventory(); // reload to update totals
}

function deleteProduct(index) {
    if(confirm(`Delete ${inventory[index].product}?`)) {
        inventory.splice(index,1);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        loadInventory();
    }
}

loadInventory();

let inventory = JSON.parse(localStorage.getItem("inventory")) || [
    { product: "ANGELI LUCE", category: "PATAGONIA QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 0, updated: "" },
    { product: "ARCTIC PINK 2", category: "PATAGONIA QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 0, updated: "" },
    { product: "FOLLAJE ROSA", category: "PATAGONIA QUARTZITE", size: "3.42 X 2.01 M", unit: "", supplier: "", price: "", stock: 8, updated: "" },
    { product: "FOLLAJE ROSA", category: "PATAGONIA QUARTZITE", size: "3.43 X 2.01 M", unit: "", supplier: "", price: "", stock: 8, updated: "" }
];

function loadInventory(filter="") {
    const tbody = document.querySelector("#inventoryTable tbody");
    tbody.innerHTML = "";

    inventory.forEach((item, index) => {
        if(filter && !Object.values(item).some(v => v.toString().toLowerCase().includes(filter.toLowerCase()))) return;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td contenteditable="true" data-field="product" data-index="${index}">${item.product}</td>
            <td contenteditable="true" data-field="category" data-index="${index}">${item.category}</td>
            <td contenteditable="true" data-field="size" data-index="${index}">${item.size}</td>
            <td contenteditable="true" data-field="unit" data-index="${index}">${item.unit}</td>
            <td contenteditable="true" data-field="supplier" data-index="${index}">${item.supplier}</td>
            <td contenteditable="true" data-field="price" data-index="${index}">${item.price}</td>
            <td contenteditable="true" data-field="stock" data-index="${index}">${item.stock}</td>
            <td contenteditable="true" data-field="updated" data-index="${index}">${item.updated}</td>
            <td><button data-index="${index}" class="deleteBtn">Delete</button></td>
        `;
        if(item.stock < 5) row.classList.add("low-stock");
        tbody.appendChild(row);
    });

    document.querySelectorAll("[contenteditable=true]").forEach(cell => {
        cell.addEventListener("input", liveEdit);
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", deleteProduct);
    });

    updateTotals();
}

function liveEdit(e) {
    const cell = e.target;
    const field = cell.dataset.field;
    const index = parseInt(cell.dataset.index);
    let value = cell.innerText;

    if(field === "stock") {
        let num = parseInt(value);
        inventory[index][field] = isNaN(num) ? 0 : num;
    } else {
        inventory[index][field] = value;
    }
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateTotals();
}

function deleteProduct(e) {
    const index = parseInt(e.target.dataset.index);
    if(confirm(`Delete ${inventory[index].product}?`)) {
        inventory.splice(index, 1);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        loadInventory();
    }
}

function updateTotals() {
    const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);
    document.getElementById("totalProducts").textContent = inventory.length;
    document.getElementById("totalStock").textContent = totalStock;
}

function addNewProduct() {
    const newItem = { product:"", category:"", size:"", unit:"", supplier:"", price:"", stock:0, updated:"" };
    inventory.push(newItem);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    loadInventory();
}

// Search filter
document.getElementById("searchBox").addEventListener("input", e => {
    loadInventory(e.target.value);
});

// Sort table by column
function sortTable(colIndex) {
    const keyMap = ["product","category","size","unit","supplier","price","stock","updated"];
    const key = keyMap[colIndex];
    inventory.sort((a,b)=>{
        if(key==="stock") return a[key]-b[key];
        return a[key].toString().localeCompare(b[key].toString());
    });
    loadInventory();
}

loadInventory();

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

/* LOAD TABLE */
function loadInventory(filter = "") {
    const tbody = document.querySelector("#inventoryTable tbody");
    tbody.innerHTML = "";

    inventory.forEach((item, index) => {

        if (filter && !Object.values(item).some(v =>
            v.toString().toLowerCase().includes(filter.toLowerCase())
        )) return;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                ${item.image ? `<img src="${item.image}">` : "No Image"}
            </td>
            <td contenteditable="true" data-field="product" data-index="${index}">${item.product}</td>
            <td contenteditable="true" data-field="category" data-index="${index}">${item.category}</td>
            <td contenteditable="true" data-field="size" data-index="${index}">${item.size}</td>
            <td contenteditable="true" data-field="unit" data-index="${index}">${item.unit}</td>
            <td contenteditable="true" data-field="supplier" data-index="${index}">${item.supplier}</td>
            <td contenteditable="true" data-field="price" data-index="${index}">${item.price}</td>
            <td contenteditable="true" data-field="stock" data-index="${index}">${item.stock}</td>
            <td contenteditable="true" data-field="updated" data-index="${index}">${item.updated}</td>
            <td>
                <button onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;

        if (parseInt(item.stock) < 5) {
            row.classList.add("low-stock");
        }

        tbody.appendChild(row);
    });

    attachEditListeners();
    updateTotals();
}

/* EDIT CELLS */
function attachEditListeners() {
    document.querySelectorAll("[contenteditable=true]").forEach(cell => {
        cell.addEventListener("input", function () {
            const index = this.dataset.index;
            const field = this.dataset.field;
            let value = this.innerText;

            if (field === "stock") {
                value = parseInt(value) || 0;
            }

            inventory[index][field] = value;
            saveAndReload();
        });
    });
}

/* ADD PRODUCT */
function addNewProduct() {

    const imageFile = document.getElementById("imageInput").files[0];

    const newItem = {
        image: "",
        product: "New Product",
        category: "",
        size: "",
        unit: "",
        supplier: "",
        price: "",
        stock: 0,
        updated: new Date().toLocaleDateString()
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            newItem.image = e.target.result;
            inventory.push(newItem);
            saveAndReload();
        };
        reader.readAsDataURL(imageFile);
    } else {
        inventory.push(newItem);
        saveAndReload();
    }

    document.getElementById("imageInput").value = "";
}

/* DELETE */
function deleteProduct(index) {
    if (confirm("Delete this product?")) {
        inventory.splice(index, 1);
        saveAndReload();
    }
}

/* SEARCH */
document.getElementById("searchBox").addEventListener("input", function () {
    loadInventory(this.value);
});

/* SORT */
function sortTable(colIndex) {

    const keys = [
        null, // image column skip
        "product",
        "category",
        "size",
        "unit",
        "supplier",
        "price",
        "stock",
        "updated"
    ];

    const key = keys[colIndex];

    if (!key) return;

    inventory.sort((a, b) => {
        if (key === "stock") {
            return parseInt(a[key]) - parseInt(b[key]);
        }
        return a[key].toString().localeCompare(b[key].toString());
    });

    saveAndReload(false);
}

/* TOTALS */
function updateTotals() {
    document.getElementById("totalProducts").textContent = inventory.length;

    const totalStock = inventory.reduce((sum, item) =>
        sum + (parseInt(item.stock) || 0), 0
    );

    document.getElementById("totalStock").textContent = totalStock;
}

/* SAVE */
function saveAndReload(reload = true) {
    localStorage.setItem("inventory", JSON.stringify(inventory));
    if (reload) loadInventory();
}

/* INITIAL LOAD */
loadInventory();

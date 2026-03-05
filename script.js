let products = JSON.parse(localStorage.getItem("products")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

const table = document.getElementById("inventoryTable");
const historyTable = document.getElementById("historyTable");
const productSelect = document.getElementById("productSelect");

function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("history", JSON.stringify(history));
}

function render() {

    table.innerHTML = "";
    productSelect.innerHTML = '<option value="">Select Product</option>';

    let totalStock = 0;

    products.forEach((p, i) => {

        totalStock += p.qty;

        let option = document.createElement("option");
        option.value = i;
        option.textContent = p.name;
        productSelect.appendChild(option);

        let row = document.createElement("tr");

        row.innerHTML = `
        <td>${p.image ? `<img src="${p.image}" width="60">` : "-"}</td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.qty}</td>
        <td><button onclick="deleteProduct(${i})">Delete</button></td>
        `;

        table.appendChild(row);
    });

    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("totalStocks").textContent = totalStock;

    renderHistory();
}

function renderHistory() {

    historyTable.innerHTML = "";

    history.forEach(h => {

        let row = document.createElement("tr");

        row.innerHTML = `
        <td>${h.date}</td>
        <td>${h.product}</td>
        <td>${h.type}</td>
        <td>${h.qty}</td>
        `;

        historyTable.appendChild(row);
    });
}


// ADD PRODUCT
document.getElementById("addProductForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let category = document.getElementById("category").value.trim();
    let qty = parseInt(document.getElementById("quantity").value);
    let imageInput = document.getElementById("image");

    if (!name || !category || !qty) {
        alert("Please fill all fields");
        return;
    }

    let imageFile = imageInput.files[0];

    if (imageFile) {

        let reader = new FileReader();

        reader.onload = function(event) {

            products.push({
                name: name,
                category: category,
                qty: qty,
                image: event.target.result
            });

            saveData();
            render();
        };

        reader.readAsDataURL(imageFile);

    } else {

        products.push({
            name: name,
            category: category,
            qty: qty,
            image: ""
        });

        saveData();
        render();
    }

    this.reset();
});


// STOCK IN
document.getElementById("stockInBtn").onclick = function() {

    let index = productSelect.value;
    let qty = parseInt(document.getElementById("stockQty").value);

    if (index === "" || !qty) return;

    products[index].qty += qty;

    history.push({
        date: new Date().toLocaleString(),
        product: products[index].name,
        type: "IN",
        qty: qty
    });

    saveData();
    render();
};


// STOCK OUT
document.getElementById("stockOutBtn").onclick = function() {

    let index = productSelect.value;
    let qty = parseInt(document.getElementById("stockQty").value);

    if (index === "" || !qty) return;

    if (products[index].qty < qty) {
        alert("Not enough stock");
        return;
    }

    products[index].qty -= qty;

    history.push({
        date: new Date().toLocaleString(),
        product: products[index].name,
        type: "OUT",
        qty: qty
    });

    saveData();
    render();
};


// DELETE
function deleteProduct(i) {

    if (confirm("Delete product?")) {

        products.splice(i, 1);

        saveData();
        render();
    }
}


// SEARCH
document.getElementById("search").addEventListener("input", function() {

    let value = this.value.toLowerCase();

    let rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {

        rows[i].style.display =
            rows[i].innerText.toLowerCase().includes(value) ? "" : "none";
    }
});


// EXPORT CSV
document.getElementById("exportBtn").onclick = function() {

    let csv = "Product,Category,Stock\n";

    products.forEach(p => {
        csv += `${p.name},${p.category},${p.qty}\n`;
    });

    let blob = new Blob([csv]);
    let a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "inventory.csv";

    a.click();
};

render();

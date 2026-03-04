let tableBody = document.querySelector("#inventoryTable tbody");
let totalProducts = document.getElementById("totalProducts");
let totalStock = document.getElementById("totalStock");
let searchBox = document.getElementById("searchBox");
let imageInput = document.getElementById("imageInput");

let selectedImage = "";

/* =========================
   IMAGE HANDLING
========================= */

imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            selectedImage = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

/* =========================
   ADD PRODUCT
========================= */

function addNewProduct() {

    let name = prompt("Enter product name:");
    if (!name) return;

    let category = prompt("Enter category:");
    let size = prompt("Enter size:");
    let unit = prompt("Enter unit:");
    let supplier = prompt("Enter supplier:");
    let price = prompt("Enter unit price:");
    let stock = prompt("Enter stock quantity:");

    let today = new Date().toLocaleDateString();

    let row = tableBody.insertRow();

    row.innerHTML = `
        <td>
            ${selectedImage ? 
                `<img src="${selectedImage}" class="thumb">`
                : "No Image"}
        </td>
        <td contenteditable="true">${name}</td>
        <td contenteditable="true">${category}</td>
        <td contenteditable="true">${size}</td>
        <td contenteditable="true">${unit}</td>
        <td contenteditable="true">${supplier}</td>
        <td contenteditable="true">${price}</td>
        <td contenteditable="true">${stock}</td>
        <td>${today}</td>
        <td>
            <button onclick="deleteRow(this)">Delete</button>
        </td>
    `;

    selectedImage = "";
    imageInput.value = "";

    updateSummary();
}

/* =========================
   DELETE
========================= */

function deleteRow(button) {
    button.closest("tr").remove();
    updateSummary();
}

/* =========================
   UPDATE SUMMARY
========================= */

function updateSummary() {
    let rows = tableBody.querySelectorAll("tr");
    totalProducts.textContent = rows.length;

    let stockTotal = 0;

    rows.forEach(row => {
        let stock = parseInt(row.cells[7].textContent) || 0;
        stockTotal += stock;

        if (stock < 5) {
            row.classList.add("low-stock");
        } else {
            row.classList.remove("low-stock");
        }
    });

    totalStock.textContent = stockTotal;
}

/* =========================
   SEARCH
========================= */

searchBox.addEventListener("keyup", function () {
    let value = this.value.toLowerCase();
    let rows = tableBody.querySelectorAll("tr");

    rows.forEach(row => {
        let text = row.textContent.toLowerCase();
        row.style.display = text.includes(value) ? "" : "none";
    });
});

/* =========================
   SORT
========================= */

function sortTable(columnIndex) {
    let rows = Array.from(tableBody.rows);

    rows.sort((a, b) => {
        let A = a.cells[columnIndex].textContent.toLowerCase();
        let B = b.cells[columnIndex].textContent.toLowerCase();
        return A.localeCompare(B);
    });

    rows.forEach(row => tableBody.appendChild(row));
}

/* =========================
   IMAGE MODAL PREVIEW
========================= */

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("thumb")) {
        let modal = document.getElementById("imageModal");
        let modalImg = document.getElementById("modalImage");

        modalImg.src = e.target.src;
        modal.classList.add("show");
    }
});

document.getElementById("imageModal").addEventListener("click", function () {
    this.classList.remove("show");
});

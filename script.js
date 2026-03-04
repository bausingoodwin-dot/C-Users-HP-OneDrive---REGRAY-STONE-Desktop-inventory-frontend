const tableBody = document.querySelector("#inventoryTable tbody");
const totalProducts = document.getElementById("totalProducts");
const totalStock = document.getElementById("totalStock");
const searchBox = document.getElementById("searchBox");
const imageInput = document.getElementById("imageInput");
const addBtn = document.getElementById("addBtn");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");

let selectedImage = "";

/* IMAGE LOAD */
imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        selectedImage = e.target.result;
    };
    reader.readAsDataURL(file);
});

/* ADD PRODUCT */
addBtn.addEventListener("click", function () {

    let name = prompt("Product name:");
    if (!name) return;

    let category = prompt("Category:");
    let size = prompt("Size:");
    let unit = prompt("Unit:");
    let supplier = prompt("Supplier:");
    let price = prompt("Unit price:");
    let stock = prompt("Stock quantity:");

    let today = new Date().toLocaleDateString();

    let row = tableBody.insertRow();

    // IMAGE CELL WITH CLICKABLE PREVIEW
    let imgHTML = selectedImage 
        ? `<img src="${selectedImage}" class="thumb" onclick="openImagePreview(this.src)">`
        : "No Image";

    row.insertCell(0).innerHTML = imgHTML;

    row.insertCell(1).innerHTML = `<span contenteditable="true">${name}</span>`;
    row.insertCell(2).innerHTML = `<span contenteditable="true">${category}</span>`;
    row.insertCell(3).innerHTML = `<span contenteditable="true">${size}</span>`;
    row.insertCell(4).innerHTML = `<span contenteditable="true">${unit}</span>`;
    row.insertCell(5).innerHTML = `<span contenteditable="true">${supplier}</span>`;
    row.insertCell(6).innerHTML = `<span contenteditable="true">${price}</span>`;
    row.insertCell(7).innerHTML = `<span contenteditable="true">${stock}</span>`;
    row.insertCell(8).innerHTML = today;
    row.insertCell(9).innerHTML = `<button onclick="deleteRow(this)">Delete</button>`;

    // RESET
    selectedImage = "";
    imageInput.value = "";

    updateSummary();
});

/* OPEN IMAGE PREVIEW */
function openImagePreview(src) {
    modalImg.src = src;
    modal.classList.add("show");
}

/* CLOSE MODAL */
modal.addEventListener("click", function () {
    modal.classList.remove("show");
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") modal.classList.remove("show");
});

/* DELETE */
function deleteRow(btn) {
    btn.closest("tr").remove();
    updateSummary();
}

/* SUMMARY */
function updateSummary() {
    const rows = tableBody.querySelectorAll("tr");
    totalProducts.textContent = rows.length;

    let total = 0;
    rows.forEach(row => {
        let stock = parseInt(row.cells[7].textContent) || 0;
        total += stock;
        if (stock < 5) row.classList.add("low-stock");
        else row.classList.remove("low-stock");
    });

    totalStock.textContent = total;
}

/* SEARCH */
searchBox.addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(value)
            ? ""
            : "none";
    });
});

/* SORT */
function sortTable(index) {
    const rows = Array.from(tableBody.rows);

    rows.sort((a, b) => {
        let A = a.cells[index].textContent.toLowerCase();
        let B = b.cells[index].textContent.toLowerCase();
        return A.localeCompare(B);
    });

    rows.forEach(row => tableBody.appendChild(row));
}

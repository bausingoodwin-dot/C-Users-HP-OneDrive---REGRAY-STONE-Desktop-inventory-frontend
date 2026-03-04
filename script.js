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

    row.innerHTML = `
        <td>
            ${selectedImage 
                ? `<img src="${selectedImage}" class="thumb">`
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
        <td><button onclick="deleteRow(this)">Delete</button></td>
    `;

    selectedImage = "";
    imageInput.value = "";

    updateSummary();
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

        if (stock < 5) {
            row.classList.add("low-stock");
        } else {
            row.classList.remove("low-stock");
        }
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

/* IMAGE CLICK PREVIEW */
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("thumb")) {
        modalImg.src = e.target.src;
        modal.classList.add("show");
    }
});

/* CLOSE MODAL */
modal.addEventListener("click", function () {
    modal.classList.remove("show");
});

/* ESC CLOSE */
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        modal.classList.remove("show");
    }
});

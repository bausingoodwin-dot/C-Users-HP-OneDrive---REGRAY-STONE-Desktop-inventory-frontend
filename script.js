const tableBody = document.querySelector("#inventoryTable tbody");
const totalProducts = document.getElementById("totalProducts");
const totalStock = document.getElementById("totalStock");
const searchBox = document.getElementById("searchBox");
const imageInput = document.getElementById("imageInput");
const addBtn = document.getElementById("addBtn");
const exportLogBtn = document.getElementById("exportLogBtn");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");

let selectedImage = "";
let stockLog = []; // {productName, oldStock, newStock, date}

/* IMAGE UPLOAD */
imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) { selectedImage = e.target.result; };
    reader.readAsDataURL(file);
});

/* ADD PRODUCT */
addBtn.addEventListener("click", function () {
    let name = prompt("Product name:"); if (!name) return;
    let category = prompt("Category:");
    let size = prompt("Size:");
    let unit = prompt("Unit:");
    let supplier = prompt("Supplier:");
    let price = prompt("Unit price:");
    let stock = prompt("Stock quantity:");

    let today = new Date().toLocaleDateString();
    let row = tableBody.insertRow();

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
    row.insertCell(7).innerHTML = `<span contenteditable="true" data-old-stock="${stock}">${stock}</span>`;
    row.insertCell(8).textContent = today;
    row.insertCell(9).innerHTML = `<button onclick="deleteRow(this)">Delete</button>`;

    selectedImage = "";
    imageInput.value = "";
    updateSummary();
});

/* STOCK EDIT & AUTO DATE */
tableBody.addEventListener("input", function(e) {
    const cell = e.target;
    const row = cell.closest("tr");
    if (cell.parentElement.cellIndex === 7) { // Stock column
        const oldStock = parseInt(cell.getAttribute("data-old-stock")) || 0;
        const newStock = parseInt(cell.textContent) || 0;

        stockLog.push({
            productName: row.cells[1].textContent,
            oldStock: oldStock,
            newStock: newStock,
            date: new Date().toLocaleString()
        });

        cell.setAttribute("data-old-stock", newStock);
        row.cells[8].textContent = new Date().toLocaleDateString();
        updateSummary();
    }
});

/* IMAGE PREVIEW */
function openImagePreview(src) {
    modalImg.src = src;
    modal.classList.add("show");
}
modal.addEventListener("click", () => modal.classList.remove("show"));
document.addEventListener("keydown", e => { if (e.key === "Escape") modal.classList.remove("show"); });

/* DELETE ROW */
function deleteRow(btn) {
    btn.closest("tr").remove();
    updateSummary();
}

/* UPDATE SUMMARY */
function updateSummary() {
    const rows = tableBody.querySelectorAll("tr");
    totalProducts.textContent = rows.length;
    let total = 0;
    rows.forEach(row => {
        const stockCell = row.cells[7].querySelector("span");
        const stock = parseInt(stockCell.textContent) || 0;
        total += stock;
        row.classList.toggle("low-stock", stock < 5);
    });
    totalStock.textContent = total;
}

/* SEARCH */
searchBox.addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    tableBody.querySelectorAll("tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(value) ? "" : "none";
    });
});

/* SORT */
function sortTable(index) {
    Array.from(tableBody.rows)
        .sort((a,b)=>a.cells[index].textContent.toLowerCase().localeCompare(b.cells[index].textContent.toLowerCase()))
        .forEach(row=>tableBody.appendChild(row));
}

/* EXPORT STOCK LOG */
exportLogBtn.addEventListener("click", function () {
    if (stockLog.length === 0) return alert("No stock changes to export yet!");
    let csv = "Product Name,Old Stock,New Stock,Date\n";
    stockLog.forEach(e => { csv += `${e.productName},${e.oldStock},${e.newStock},${e.date}\n`; });
    const link = document.createElement("a");
    link.href = encodeURI("data:text/csv;charset=utf-8," + csv);
    link.download = `stock_log_${new Date().toLocaleDateString().replace(/\//g,"-")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

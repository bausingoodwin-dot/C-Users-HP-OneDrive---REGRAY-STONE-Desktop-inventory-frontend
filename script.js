// ------------------------
// SELECTORS
// ------------------------
const tableBody = document.querySelector("#inventoryTable tbody");
const totalProducts = document.getElementById("totalProducts");
const totalStock = document.getElementById("totalStock");
const searchBox = document.getElementById("searchBox");
const imageInput = document.getElementById("imageInput");
const addBtn = document.getElementById("addBtn");
const exportLogBtn = document.getElementById("exportLogBtn");
const undoBtn = document.getElementById("undoBtn");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const transactionBody = document.querySelector("#transactionLogTable tbody");

let selectedImage = "";
let stockLog = [];

// ------------------------
// CATEGORY & UNIT OPTIONS
// ------------------------
const categoryOptions = [
    "PATAGONIA QUARTZITE",
    "QUARTZITE",
    "ONYX",
    "MARBLE",
    "GRANITE",
    "TRAVERTINE",
    "LIMESTONE",
    "CRAZY CUTS",
    "COBBLESTONE"
];
const unitOptions = ["SLABS", "PIECE"];

// ------------------------
// LOAD DATA
// ------------------------
window.addEventListener("load", () => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const savedLog = JSON.parse(localStorage.getItem("stockLog")) || [];
    stockLog = savedLog;
    savedProducts.forEach(prod => addRowFromData(prod,false));
    updateSummary();
    renderTransactionLog();
});

// ------------------------
// IMAGE UPLOAD
// ------------------------
imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => selectedImage = e.target.result;
    reader.readAsDataURL(file);
});

// ------------------------
// ADD PRODUCT
// ------------------------
addBtn.addEventListener("click", function () {
    const name = prompt("Product name:"); if(!name) return;
    const category = prompt("Category (default first option if empty):") || categoryOptions[0];
    const size = prompt("Size:") || "";
    const unit = prompt("Unit (SLABS or PIECE):") || unitOptions[0];
    const supplier = prompt("Supplier:") || "";
    const price = prompt("Unit price:") || "";
    const stock = prompt("Stock quantity:") || "0";
    const today = new Date().toLocaleDateString();

    addRowFromData({
        name, category, size, unit, supplier, price, stock,
        image:selectedImage, updated:today
    }, true);

    selectedImage = "";
    imageInput.value = "";
});

// ------------------------
// ADD ROW FROM DATA
// ------------------------
function addRowFromData(data, save=true){
    const row = tableBody.insertRow();
    row.insertCell(0).innerHTML = data.image ? `<img src="${data.image}" class="thumb" onclick="openImagePreview(this.src)">` : "No Image";
    row.insertCell(1).innerHTML = `<span contenteditable="true">${data.name}</span>`;

    const selectCategory = `<select class="category-select">${categoryOptions.map(opt =>
        `<option value="${opt}" ${opt===data.category?"selected":""}>${opt}</option>`).join('')}</select>`;
    row.insertCell(2).innerHTML = selectCategory;

    row.insertCell(3).innerHTML = `<span contenteditable="true">${data.size}</span>`;

    const selectUnit = `<select class="unit-select">${unitOptions.map(opt =>
        `<option value="${opt}" ${opt===data.unit?"selected":""}>${opt}</option>`).join('')}</select>`;
    row.insertCell(4).innerHTML = selectUnit;

    row.insertCell(5).innerHTML = `<span contenteditable="true">${data.supplier}</span>`;
    row.insertCell(6).innerHTML = `<span contenteditable="true">${data.price}</span>`;
    row.insertCell(7).innerHTML = `<span contenteditable="true" data-old-stock="${data.stock}">${data.stock}</span>`;
    row.insertCell(8).textContent = data.updated;
    row.insertCell(9).innerHTML = `<button onclick="deleteRow(this)">Delete</button>`;

    if(save) saveProductsToLocal();
    updateSummary();
}

// ------------------------
// HANDLE STOCK EDIT
// ------------------------
tableBody.addEventListener("input", handleStockEdit);
tableBody.addEventListener("blur", handleStockEdit, true);

function handleStockEdit(e){
    const cell = e.target;
    const row = cell.closest("tr");

    // STOCK CHANGES
    if(cell.parentElement.cellIndex===7){
        const oldStock = parseInt(cell.getAttribute("data-old-stock"))||0;
        const newStock = parseInt(cell.textContent)||0;
        if(newStock!==oldStock){
            stockLog.push({
                productName: row.cells[1].textContent,
                oldStock, newStock,
                date: new Date().toLocaleString()
            });
            cell.setAttribute("data-old-stock",newStock);
            row.cells[8].textContent=new Date().toLocaleDateString();
            saveProductsToLocal();
            saveLogToLocal();
            updateSummary();
            renderTransactionLog();
        }
    }

    // OTHER EDITS (Name, Size, Supplier)
    if(cell.tagName==="SPAN" && cell.contentEditable==="true"){
        saveProductsToLocal();
    }
}

// ------------------------
// SAVE SELECT CHANGES (Category, Unit)
// ------------------------
tableBody.addEventListener("change", function(e){
    const sel = e.target;
    if(sel.tagName==="SELECT"){
        saveProductsToLocal();
    }
});

// ------------------------
// IMAGE PREVIEW
// ------------------------
function openImagePreview(src){ modalImg.src=src; modal.classList.add("show"); }
modal.addEventListener("click",()=>modal.classList.remove("show"));
document.addEventListener("keydown", e=>{if(e.key==="Escape") modal.classList.remove("show");});

// ------------------------
// DELETE ROW
// ------------------------
function deleteRow(btn){ btn.closest("tr").remove(); saveProductsToLocal(); updateSummary(); }

// ------------------------
// UPDATE SUMMARY
// ------------------------
function updateSummary(){
    const rows = tableBody.querySelectorAll("tr");
    totalProducts.textContent = rows.length;
    let total=0;
    rows.forEach(row=>{
        const stock = parseInt(row.cells[7].querySelector("span").textContent)||0;
        total+=stock;
        row.classList.toggle("low-stock",stock<5);
    });
    totalStock.textContent=total;
}

// ------------------------
// SEARCH
// ------------------------
searchBox.addEventListener("keyup", function(){
    const val=this.value.toLowerCase();
    tableBody.querySelectorAll("tr").forEach(row=>{
        row.style.display=row.textContent.toLowerCase().includes(val)?"":"none";
    });
});

// ------------------------
// SORT
// ------------------------
function sortTable(i){
    Array.from(tableBody.rows)
    .sort((a,b)=>a.cells[i].textContent.toLowerCase().localeCompare(b.cells[i].textContent.toLowerCase()))
    .forEach(r=>tableBody.appendChild(r));
}

// ------------------------
// RENDER TRANSACTION LOG
// ------------------------
function renderTransactionLog(){
    transactionBody.innerHTML = "";
    stockLog.forEach(tx=>{
        const row = transactionBody.insertRow();
        row.insertCell(0).textContent = tx.productName;
        row.insertCell(1).textContent = tx.oldStock;
        row.insertCell(2).textContent = tx.newStock;
        row.insertCell(3).textContent = tx.date;
    });
}

// ------------------------
// EXPORT LOG
// ------------------------
exportLogBtn.addEventListener("click", function(){
    if(stockLog.length===0){ alert("No stock changes to export!"); return; }
    let csv="Product Name,Old Stock,New Stock,Date\n";
    stockLog.forEach(e=>{ csv+=`${e.productName},${e.oldStock},${e.newStock},${e.date}\n`; });
    const link=document.createElement("a");
    link.href=encodeURI("data:text/csv;charset=utf-8,"+csv);
    link.download=`stock_log_${new Date().toLocaleDateString().replace(/\//g,"-")}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
});

// ------------------------
// UNDO LAST STOCK EDIT
// ------------------------
undoBtn.addEventListener("click", function(){
    if(stockLog.length===0){ alert("No stock edits to undo!"); return; }
    const last = stockLog.pop();
    const rows = tableBody.querySelectorAll("tr");
    for(let row of rows){
        if(row.cells[1].textContent===last.productName){
            const stockCell=row.cells[7].querySelector("span");
            stockCell.textContent=last.oldStock;
            stockCell.setAttribute("data-old-stock",last.oldStock);
            row.cells[8].textContent=new Date().toLocaleDateString();
            break;
        }
    }
    saveProductsToLocal(); saveLogToLocal(); updateSummary(); renderTransactionLog();
    alert(`Undo successful! ${last.productName} stock reverted to ${last.oldStock}`);
});

// ------------------------
// LOCAL STORAGE
// ------------------------
function saveProductsToLocal(){
    const products=[];
    tableBody.querySelectorAll("tr").forEach(row=>{
        products.push({
            name: row.cells[1].textContent,
            category: row.cells[2].querySelector(".category-select")?.value||"",
            size: row.cells[3].textContent,
            unit: row.cells[4].querySelector(".unit-select")?.value||"",
            supplier: row.cells[5].textContent,
            price: row.cells[6].textContent,
            stock: row.cells[7].querySelector("span").textContent,
            image: row.cells[0].querySelector("img")?.src||"",
            updated: row.cells[8].textContent
        });
    });
    localStorage.setItem("products",JSON.stringify(products));
}
function saveLogToLocal(){ localStorage.setItem("stockLog",JSON.stringify(stockLog)); }

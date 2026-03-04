// ------------------------
// SELECTORS
// ------------------------
const mainPage = document.getElementById("mainPage");
const transactionPage = document.getElementById("transactionPage");

const dashboardLink = document.getElementById("dashboardLink");
const logLink = document.getElementById("logLink");

const tableBody = document.querySelector("#inventoryTable tbody");
const totalProducts = document.getElementById("totalProducts");
const totalStock = document.getElementById("totalStock");
const searchBox = document.getElementById("searchBox");
const imageInput = document.getElementById("imageInput");
const addBtn = document.getElementById("addBtn");
const transactionBody = document.querySelector("#transactionLogTable tbody");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");

// DATA STORAGE
let selectedImage = "";
let stockLog = [];
let lastStockChange = {}; // store per cell last stock for undo

// CATEGORY & UNIT OPTIONS
const categoryOptions = ["PATAGONIA QUARTZITE","QUARTZITE","ONYX","MARBLE","GRANITE","TRAVERTINE","LIMESTONE","CRAZY CUTS","COBBLESTONE"];
const unitOptions = ["SLABS","PIECE"];

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
    const category = prompt("Category:") || categoryOptions[0];
    const size = prompt("Size:") || "";
    const unit = prompt("Unit (SLABS or PIECE):") || unitOptions[0];
    const supplier = prompt("Supplier:") || "";
    const price = prompt("Unit price:") || "";
    const stock = prompt("Stock quantity:") || "0";
    const today = new Date().toLocaleDateString();

    addRowFromData({name,category,size,unit,supplier,price,stock,image:selectedImage,updated:today},true);

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
    row.insertCell(2).innerHTML = `<select class="category-select">${categoryOptions.map(opt=>`<option value="${opt}" ${opt===data.category?"selected":""}>${opt}</option>`).join('')}</select>`;
    row.insertCell(3).innerHTML = `<span contenteditable="true">${data.size}</span>`;
    row.insertCell(4).innerHTML = `<select class="unit-select">${unitOptions.map(opt=>`<option value="${opt}" ${opt===data.unit?"selected":""}>${opt}</option>`).join('')}</select>`;
    row.insertCell(5).innerHTML = `<span contenteditable="true">${data.supplier}</span>`;
    row.insertCell(6).innerHTML = `<span contenteditable="true">${data.price}</span>`;
    row.insertCell(7).innerHTML = `<span contenteditable="true" data-old-stock="${data.stock}">${data.stock}</span>`;
    row.insertCell(8).textContent = data.updated;
    row.insertCell(9).innerHTML = `<button onclick="undoStock(this)">Undo</button>`;
    row.insertCell(10).innerHTML = `<button onclick="deleteRow(this)">Delete</button>`;

    if(save) saveProductsToLocal();
    updateSummary();
}

// ------------------------
// UNDO PER PRODUCT
// ------------------------
function undoStock(btn){
    const row = btn.closest("tr");
    const cell = row.cells[7].querySelector("span");
    const oldStock = parseInt(cell.getAttribute("data-old-stock")) || 0;
    const currentStock = parseInt(cell.textContent) || 0;

    if(oldStock !== currentStock){
        // log transaction
        stockLog.push({
            productName: row.cells[1].textContent,
            oldStock: currentStock,
            newStock: oldStock,
            date: new Date().toLocaleString()
        });
        cell.textContent = oldStock;
        row.cells[8].textContent = new Date().toLocaleDateString();
        cell.setAttribute("data-old-stock", oldStock);
        saveProductsToLocal();
        saveLogToLocal();
        updateSummary();
        renderTransactionLog();
        alert("Undo applied for this product only!");
    } else {
        alert("Nothing to undo for this product!");
    }
}

// ------------------------
// PAGE SWITCHING
// ------------------------
dashboardLink.addEventListener("click", () => {
    transactionPage.style.display = "none";
    mainPage.style.display = "block";
});

logLink.addEventListener("click", () => {
    mainPage.style.display = "none";
    transactionPage.style.display = "block";
    renderTransactionLog();
});

// ------------------------
// STOCK EDIT
// ------------------------
tableBody.addEventListener("input", handleStockEdit);
tableBody.addEventListener("blur", handleStockEdit,true);

function handleStockEdit(e){
    const cell=e.target,row=cell.closest("tr");
    if(cell.parentElement.cellIndex===7){
        const oldStock=parseInt(cell.getAttribute("data-old-stock"))||0,newStock=parseInt(cell.textContent)||0;
        if(newStock!==oldStock){
            stockLog.push({productName:row.cells[1].textContent,oldStock,newStock,date:new Date().toLocaleString()});
            cell.setAttribute("data-old-stock",newStock);
            row.cells[8].textContent=new Date().toLocaleDateString();
            saveProductsToLocal(); saveLogToLocal(); updateSummary(); renderTransactionLog();
        }
    }
    if(cell.tagName==="SPAN" && cell.contentEditable==="true"){ saveProductsToLocal(); }
}

// SAVE SELECT CHANGES
tableBody.addEventListener("change",e=>{ if(e.target.tagName==="SELECT") saveProductsToLocal(); });

// IMAGE PREVIEW
function openImagePreview(src){ modalImg.src=src; modal.classList.add("show"); }
modal.addEventListener("click",()=>modal.classList.remove("show"));
document.addEventListener("keydown",e=>{if(e.key==="Escape") modal.classList.remove("show");});

// DELETE ROW
function deleteRow(btn){ btn.closest("tr").remove(); saveProductsToLocal(); updateSummary(); }

// UPDATE SUMMARY
function updateSummary(){
    const rows=tableBody.querySelectorAll("tr"); totalProducts.textContent=rows.length;
    let total=0; rows.forEach(r=>{
        const stock=parseInt(r.cells[7].querySelector("span").textContent)||0; total+=stock;
        r.classList.toggle("low-stock",stock<5);
    }); totalStock.textContent=total;
}

// SEARCH
searchBox.addEventListener("keyup",function(){ const val=this.value.toLowerCase();
    tableBody.querySelectorAll("tr").forEach(row=>{ row.style.display=row.textContent.toLowerCase().includes(val)?"":"none"; });
});

// SORT
function sortTable(i){ Array.from(tableBody.rows).sort((a,b)=>a.cells[i].textContent.toLowerCase().localeCompare(b.cells[i].textContent.toLowerCase())).forEach(r=>tableBody.appendChild(r)); }

// RENDER TRANSACTION LOG
function renderTransactionLog(){
    transactionBody.innerHTML="";
    stockLog.forEach(tx=>{
        const row=transactionBody.insertRow();
        row.insertCell(0).textContent=tx.productName;
        row.insertCell(1).textContent=tx.oldStock;
        row.insertCell(2).textContent=tx.newStock;
        row.insertCell(3).textContent=tx.date;
    });
}

// LOCAL STORAGE
function saveProductsToLocal(){
    const products=[];
    tableBody.querySelectorAll("tr").forEach(row=>{ products.push({
        name: row.cells[1].textContent,
        category: row.cells[2].querySelector(".category-select")?.value||"",
        size: row.cells[3].textContent,
        unit: row.cells[4].querySelector(".unit-select")?.value||"",
        supplier: row.cells[5].textContent,
        price: row.cells[6].textContent,
        stock: row.cells[7].querySelector("span").textContent,
        image: row.cells[0].querySelector("img")?.src||"",
        updated: row.cells[8].textContent
    }); });
    localStorage.setItem("products",JSON.stringify(products));
}
function saveLogToLocal(){ localStorage.setItem("stockLog",JSON.stringify(stockLog)); }

const tableBody = document.querySelector("#inventoryTable tbody");
const logBody = document.querySelector("#logTable tbody");
const totalProducts = document.getElementById("totalProducts");
const totalStock = document.getElementById("totalStock");

const productForm = document.getElementById("productForm");
const dashboardPage = document.getElementById("dashboardPage");
const transactionPage = document.getElementById("transactionPage");
const showDashboardBtn = document.getElementById("showDashboardBtn");
const showTransactionsBtn = document.getElementById("showTransactionsBtn");

let products = JSON.parse(localStorage.getItem("products")) || [];
let logs = JSON.parse(localStorage.getItem("logs")) || [];

/* ------------------ SAVE & LOAD ------------------ */
function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("logs", JSON.stringify(logs));
}

function loadData() {
    tableBody.innerHTML = "";
    logBody.innerHTML = "";

    products.forEach((p, i) => renderRow(p, i));
    logs.forEach(log => renderLog(log));

    totalProducts.textContent = products.length;
    totalStock.textContent = products.reduce((sum,p)=>sum+p.stock,0);
}

/* ------------------ ADD PRODUCT ------------------ */
productForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const size = document.getElementById("productSize").value.trim();
    const supplier = document.getElementById("productSupplier").value.trim();
    const price = parseFloat(document.getElementById("productPrice").value) || 0;
    const stock = parseInt(document.getElementById("productQty").value) || 0;
    const imageInput = document.getElementById("productImage");

    const product = {
        name,
        category: "PATAGONIA QUARTZITE", // default category; will change in table dropdown
        size,
        unit: "SLABS", // default unit; will change in table dropdown
        supplier,
        price,
        stock,
        lastUpdated: new Date().toLocaleString(),
        image: ""
    };

    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            product.image = e.target.result;
            products.push(product);
            saveData();
            loadData();
            productForm.reset();
        }
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        products.push(product);
        saveData();
        loadData();
        productForm.reset();
    }
});

/* ------------------ RENDER ROW ------------------ */
function renderRow(product,index) {
    const categories = ["PATAGONIA QUARTZITE","QUARTZITE","ONYX","MARBLE","GRANITE","TRAVERTINE","LIMESTONE","CRAZY CUTS","COBBLESTONE"];
    const units = ["SLABS","PIECE"];

    let categoryDropdown = `<select onchange="updateField(${index},'category',this.value)">`;
    categories.forEach(c => categoryDropdown += `<option value="${c}" ${c===product.category?'selected':''}>${c}</option>`);
    categoryDropdown += `</select>`;

    let unitDropdown = `<select onchange="updateField(${index},'unit',this.value)">`;
    units.forEach(u => unitDropdown += `<option value="${u}" ${u===product.unit?'selected':''}>${u}</option>`);
    unitDropdown += `</select>`;

    const row = tableBody.insertRow();
    row.innerHTML = `
        <td>
            <img src="${product.image}" class="thumb" data-index="${index}">
            <input type="file" onchange="changeImage(event,${index})">
        </td>
        <td contenteditable="true" onblur="updateField(${index},'name',this.innerText)">${product.name}</td>
        <td>${categoryDropdown}</td>
        <td contenteditable="true" onblur="updateField(${index},'size',this.innerText)">${product.size}</td>
        <td>${unitDropdown}</td>
        <td contenteditable="true" onblur="updateField(${index},'supplier',this.innerText)">${product.supplier}</td>
        <td contenteditable="true" onblur="updateField(${index},'price',this.innerText)">${product.price}</td>
        <td contenteditable="true" onblur="updateStock(${index},this.innerText)">${product.stock}</td>
        <td>${product.lastUpdated}</td>
        <td><button onclick="deleteProduct(${index})">Delete</button></td>
    `;
    if(product.stock<5) row.classList.add("low-stock");
}

/* ------------------ UPDATE FIELD ------------------ */
function updateField(index,field,value){
    products[index][field]=value;
    saveData();
}

/* ------------------ UPDATE STOCK ------------------ */
function updateStock(index,value){
    const oldStock = products[index].stock;
    const newStock = parseInt(value)||0;
    if(oldStock!==newStock){
        const date = new Date().toLocaleString();
        products[index].stock=newStock;
        products[index].lastUpdated=date;
        logs.push({name:products[index].name, oldStock, newStock, date});
        saveData();
        loadData();
    }
}

/* ------------------ CHANGE IMAGE ------------------ */
function changeImage(event,index){
    const file=event.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=e=>{
        products[index].image=e.target.result;
        saveData();
        loadData();
    }
    reader.readAsDataURL(file);
}

/* ------------------ DELETE ------------------ */
function deleteProduct(index){
    products.splice(index,1);
    saveData();
    loadData();
}

/* ------------------ RENDER LOG ------------------ */
function renderLog(log){
    const row = logBody.insertRow();
    row.innerHTML=`
        <td>${log.name}</td>
        <td>${log.oldStock}</td>
        <td>${log.newStock}</td>
        <td>${log.date}</td>
    `;
}

/* ------------------ NAVIGATION ------------------ */
showDashboardBtn.addEventListener("click",()=>{dashboardPage.style.display="block"; transactionPage.style.display="none";});
showTransactionsBtn.addEventListener("click",()=>{dashboardPage.style.display="none"; transactionPage.style.display="block";});

/* ------------------ IMAGE MODAL ------------------ */
document.addEventListener("click",function(e){
    if(e.target.classList.contains("thumb") && e.target.src){
        document.getElementById("modalImage").src=e.target.src;
        document.getElementById("imageModal").classList.add("show");
    }
});
document.getElementById("imageModal").addEventListener("click",function(){
    this.classList.remove("show");
});

/* ------------------ INITIAL LOAD ------------------ */
loadData();

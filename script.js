// --- DATA STORAGE ---
let products = JSON.parse(localStorage.getItem("products")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

// --- DOM ELEMENTS ---
const inventoryTable = document.getElementById("inventoryTable");
const historyTable = document.getElementById("historyTable");
const productSelect = document.getElementById("productSelect");
const step2ProductSelect = document.getElementById("step2ProductSelect");
const updateProductSelect = document.getElementById("updateProductSelect");
const updateImageInput = document.getElementById("updateImage");
const updateImageBtn = document.getElementById("updateImageBtn");
const totalProducts = document.getElementById("totalProducts");
const totalStocks = document.getElementById("totalStocks");
const dashboardSection = document.getElementById("dashboardSection");
const transactionsSection = document.getElementById("transactionsSection");
const chartSection = document.getElementById("chartSection");
const dashboardBtn = document.getElementById("dashboardBtn");
const transactionsBtn = document.getElementById("transactionsBtn");
const chartBtn = document.getElementById("chartBtn");

let categoryChart;

// --- SPA NAVIGATION ---
dashboardBtn.addEventListener("click", () => {
  dashboardSection.style.display = "block";
  transactionsSection.style.display = "none";
  chartSection.style.display = "none";
  dashboardBtn.classList.add("active");
  transactionsBtn.classList.remove("active");
  chartBtn.classList.remove("active");
});

transactionsBtn.addEventListener("click", () => {
  dashboardSection.style.display = "none";
  transactionsSection.style.display = "block";
  chartSection.style.display = "none";
  dashboardBtn.classList.remove("active");
  transactionsBtn.classList.add("active");
  chartBtn.classList.remove("active");
});

chartBtn.addEventListener("click", () => {
  dashboardSection.style.display = "none";
  transactionsSection.style.display = "none";
  chartSection.style.display = "block";
  dashboardBtn.classList.remove("active");
  transactionsBtn.classList.remove("active");
  chartBtn.classList.add("active");
  renderChart();
});

// --- SAVE DATA ---
function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("history", JSON.stringify(history));
}

// --- RENDER INVENTORY ---
function renderInventory() {
  inventoryTable.innerHTML = "";
  productSelect.innerHTML = '<option value="">Select Product</option>';
  step2ProductSelect.innerHTML = '<option value="">Select Product</option>';
  updateProductSelect.innerHTML = '<option value="">Select Product</option>';

  let stockCount = 0;

  products.forEach((p, i) => {
    stockCount += p.quantity;

    // Populate all select boxes
    [productSelect, step2ProductSelect, updateProductSelect].forEach(sel => {
      const opt = document.createElement("option");
      opt.value = i; // store index
      opt.textContent = p.name;
      sel.appendChild(opt);
    });

    // Inventory table row
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.image ? `<img src="${p.image}" width="60" style="cursor:pointer" onclick="previewImage('${p.image}')">` : "-"}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.quantity}</td>
      <td><button onclick="deleteProduct(${i})">Delete</button></td>
    `;
    inventoryTable.appendChild(row);
  });

  totalProducts.textContent = products.length;
  totalStocks.textContent = stockCount;

  renderHistory();
}

// --- RENDER HISTORY ---
function renderHistory() {
  historyTable.innerHTML = "";
  history.forEach(h => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${h.date}</td><td>${h.product}</td><td>${h.type}</td><td>${h.qty}</td>`;
    historyTable.appendChild(row);
  });
}

// --- ADD PRODUCT ---
document.getElementById("addProductForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const imageInput = document.getElementById("image");

  if(!name || !category || !quantity){ alert("Fill all fields"); return; }

  const add = (image="") => {
    products.push({name, category, quantity, image});
    history.push({date:new Date().toLocaleString(), product:name, type:"IN", qty:quantity});
    saveData();
    renderInventory();
  };

  if(imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e){ add(e.target.result); };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    add();
  }
  this.reset();
});

// --- STOCK IN ---
document.getElementById("stockInBtn").onclick = function() {
  const index = parseInt(productSelect.value);
  const qty = parseInt(document.getElementById("stockQty").value);
  if(isNaN(index) || !qty) return;
  products[index].quantity += qty;
  history.push({date:new Date().toLocaleString(), product:products[index].name, type:"IN", qty});
  saveData();
  renderInventory();
  document.getElementById("stockQty").value = "";
};

// --- STOCK OUT ---
document.getElementById("stockOutBtn").onclick = function() {
  const index = parseInt(productSelect.value);
  const qty = parseInt(document.getElementById("stockQty").value);
  if(isNaN(index) || !qty) return;
  if(products[index].quantity < qty){ alert("Not enough stock"); return; }
  products[index].quantity -= qty;
  history.push({date:new Date().toLocaleString(), product:products[index].name, type:"OUT", qty});
  saveData();
  renderInventory();
  document.getElementById("stockQty").value = "";
};

// --- DELETE PRODUCT ---
function deleteProduct(i) {
  if(confirm("Delete product?")) {
    products.splice(i,1);
    saveData();
    renderInventory();
  }
}

// --- SEARCH & FILTER ---
document.getElementById("search").addEventListener("input", function() {
  const value = this.value.toLowerCase();
  [...inventoryTable.rows].forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
  });
});
document.getElementById("categoryFilter").addEventListener("change", function() {
  const cat = this.value;
  [...inventoryTable.rows].forEach(row => {
    row.style.display = cat === "" || row.innerText.includes(cat) ? "" : "none";
  });
});

// --- UPDATE PRODUCT IMAGE (FIXED) ---
updateImageBtn.onclick = function() {
  const index = parseInt(updateProductSelect.value);
  if(isNaN(index)) { alert("Please select a product to update."); return; }
  const file = updateImageInput.files[0];
  if(!file){ alert("Please choose an image."); return; }

  const reader = new FileReader();
  reader.onload = function(e) {
    products[index].image = e.target.result; // update image
    saveData();
    renderInventory();
    alert("Product image updated successfully!");
    updateImageInput.value = "";
  };
  reader.readAsDataURL(file);
};

// --- IMAGE PREVIEW ---
function previewImage(src) {
  const overlay = document.createElement("div");
  overlay.style.position="fixed";
  overlay.style.top="0"; overlay.style.left="0";
  overlay.style.width="100%"; overlay.style.height="100%";
  overlay.style.background="rgba(0,0,0,0.8)";
  overlay.style.display="flex";
  overlay.style.justifyContent="center";
  overlay.style.alignItems="center";
  overlay.onclick = () => document.body.removeChild(overlay);

  const img = document.createElement("img");
  img.src = src;
  img.style.maxWidth="80%";
  img.style.maxHeight="80%";
  overlay.appendChild(img);
  document.body.appendChild(overlay);
}

// --- EXPORT CSV ---
document.getElementById("exportInventoryBtn").onclick = function() {
  let csv="Product,Category,Stock\n";
  products.forEach(p => csv+=`${p.name},${p.category},${p.quantity}\n`);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv]));
  a.download = "inventory.csv"; a.click();
};

document.getElementById("exportTransactionsBtn").onclick = function() {
  let csv="Date,Product,Type,Quantity\n";
  history.forEach(h => csv+=`${h.date},${h.product},${h.type},${h.qty}\n`);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv]));
  a.download = "transactions.csv"; a.click();
};

// --- CATEGORY CHART ---
function renderChart() {
  const categories = ["PATAGONIA","QUARTZITE","ONYX","MARBLE","TRAVERTINE","LIMESTONE","GRANITE","CRAZY CUT","COBBLESTONE"];
  const data = categories.map(cat => products.filter(p=>p.category===cat).reduce((sum,p)=>sum+p.quantity,0));
  const ctx = document.getElementById("categoryChart").getContext("2d");
  if(categoryChart) categoryChart.destroy();
  categoryChart = new Chart(ctx, {
    type:'bar',
    data:{labels:categories,datasets:[{label:'Stock per Category',data:data,backgroundColor:'rgba(54, 162, 235, 0.7)',borderColor:'rgba(54, 162, 235, 1)',borderWidth:1}]},
    options:{responsive:true,plugins:{legend:{display:false},title:{display:true,text:'Stock per Category'}},scales:{y:{beginAtZero:true}}}
  });
}

// --- LOGOUT SYSTEM ---
const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn){
  logoutBtn.onclick = function(){
      localStorage.removeItem("adminLoggedIn");
      window.location.href = "login.html";
  };
}

// --- INITIAL RENDER ---
renderInventory();

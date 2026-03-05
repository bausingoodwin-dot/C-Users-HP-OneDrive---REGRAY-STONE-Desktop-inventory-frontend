let products = JSON.parse(localStorage.getItem("products")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

const inventoryTable = document.getElementById("inventoryTable");
const historyTable = document.getElementById("historyTable");
const productSelect = document.getElementById("productSelect");
const totalProducts = document.getElementById("totalProducts");
const totalStocks = document.getElementById("totalStocks");

function saveData(){
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("history", JSON.stringify(history));
}

function renderInventory() {
    inventoryTable.innerHTML = "";
    productSelect.innerHTML = '<option value="">Select Product</option>';
    let stockCount = 0;

    products.forEach((p,i)=>{
        stockCount += p.quantity;

        // Fill product select
        let option = document.createElement("option");
        option.value=i;
        option.textContent=p.name;
        productSelect.appendChild(option);

        // Table row
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${p.image? `<img src="${p.image}" width="60" style="cursor:pointer" onclick="previewImage('${p.image}')">`:"-"}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td style="color:${p.quantity<5?'red':'black'}">${p.quantity} ${p.quantity<5? "(LOW)":""}</td>
            <td><button onclick="deleteProduct(${i})">Delete</button></td>
        `;
        inventoryTable.appendChild(row);
    });

    totalProducts.textContent = products.length;
    totalStocks.textContent = stockCount;

    renderHistory();
}

function renderHistory() {
    historyTable.innerHTML = "";
    history.forEach(h=>{
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

// Add product
document.getElementById("addProductForm").addEventListener("submit",function(e){
    e.preventDefault();
    const name=document.getElementById("name").value.trim();
    const category=document.getElementById("category").value;
    const quantity=parseInt(document.getElementById("quantity").value);
    const imageInput=document.getElementById("image");
    if(!name || !category || !quantity){alert("Fill all fields");return;}
    let image="";
    if(imageInput.files[0]){
        const reader=new FileReader();
        reader.onload=function(e){
            image=e.target.result;
            addProduct(name,category,quantity,image);
        }
        reader.readAsDataURL(imageInput.files[0]);
    }else{ addProduct(name,category,quantity,image); }
    this.reset();
});

function addProduct(name,category,quantity,image){
    products.push({name,category,quantity,image});
    saveData();
    renderInventory();
}

// Stock In
document.getElementById("stockInBtn").onclick=function(){
    const index=productSelect.value;
    const qty=parseInt(document.getElementById("stockQty").value);
    if(index===""||!qty) return;
    products[index].quantity+=qty;
    history.push({date:new Date().toLocaleString(),product:products[index].name,type:"IN",qty});
    saveData(); renderInventory();
}

// Stock Out
document.getElementById("stockOutBtn").onclick=function(){
    const index=productSelect.value;
    const qty=parseInt(document.getElementById("stockQty").value);
    if(index===""||!qty) return;
    if(products[index].quantity<qty){alert("Not enough stock"); return;}
    products[index].quantity-=qty;
    history.push({date:new Date().toLocaleString(),product:products[index].name,type:"OUT",qty});
    saveData(); renderInventory();
}

// Delete product
function deleteProduct(i){ if(confirm("Delete product?")){ products.splice(i,1); saveData(); renderInventory(); } }

// Search
document.getElementById("search").addEventListener("input",function(){
    const value=this.value.toLowerCase();
    const rows=inventoryTable.getElementsByTagName("tr");
    for(let i=0;i<rows.length;i++){
        rows[i].style.display=rows[i].innerText.toLowerCase().includes(value)?"":"none";
    }
});

// Category filter
document.getElementById("categoryFilter").addEventListener("change",function(){
    const cat=this.value;
    const rows=inventoryTable.getElementsByTagName("tr");
    for(let i=0;i<rows.length;i++){
        rows[i].style.display=cat===""||rows[i].innerText.includes(cat)?"":"none";
    }
});

// Image preview
function previewImage(src){
    const overlay=document.createElement("div");
    overlay.style.position="fixed";
    overlay.style.top="0";
    overlay.style.left="0";
    overlay.style.width="100%";
    overlay.style.height="100%";
    overlay.style.background="rgba(0,0,0,0.8)";
    overlay.style.display="flex";
    overlay.style.justifyContent="center";
    overlay.style.alignItems="center";
    overlay.onclick=function(){document.body.removeChild(overlay);}
    const img=document.createElement("img");
    img.src=src;
    img.style.maxWidth="80%";
    img.style.maxHeight="80%";
    overlay.appendChild(img);
    document.body.appendChild(overlay);
}

// Export CSV
document.getElementById("exportBtn").onclick=function(){
    let csv="Product,Category,Stock\n";
    products.forEach(p=>{csv+=`${p.name},${p.category},${p.quantity}\n`;});
    const blob=new Blob([csv]); const a=document.createElement("a");
    a.href=URL.createObjectURL(blob); a.download="inventory.csv"; a.click();
}

renderInventory();

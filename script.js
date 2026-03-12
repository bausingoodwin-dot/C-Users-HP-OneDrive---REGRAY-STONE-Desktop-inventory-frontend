// --- script.js ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-storage.js";

// --- Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyBGPcbKoiXo-Sd3KpoYjjLcVifTKpgQnCE",
  authDomain: "regray-inventory-system.firebaseapp.com",
  projectId: "regray-inventory-system",
  storageBucket: "regray-inventory-system.firebasestorage.app",
  messagingSenderId: "899045696177",
  appId: "1:899045696177:web:deec1a0522f5811c75f890",
  measurementId: "G-RWMZBWHZ5L"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

window.addEventListener("DOMContentLoaded", () => {

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
  const stockQtyInput = document.getElementById("stockQty");
  const dashboardSection = document.getElementById("dashboardSection");
  const transactionsSection = document.getElementById("transactionsSection");
  const chartSection = document.getElementById("chartSection");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const transactionsBtn = document.getElementById("transactionsBtn");
  const chartBtn = document.getElementById("chartBtn");
  const categoryChartEl = document.getElementById("categoryChart");
  let categoryChart;

  // --- SPA Navigation ---
  function showSection(section){
    [dashboardSection, transactionsSection, chartSection].forEach(s=>s.style.display="none");
    section.style.display = "block";
  }
  dashboardBtn.onclick = ()=>{ showSection(dashboardSection); dashboardBtn.classList.add("active"); transactionsBtn.classList.remove("active"); chartBtn.classList.remove("active"); };
  transactionsBtn.onclick = ()=>{ showSection(transactionsSection); dashboardBtn.classList.remove("active"); transactionsBtn.classList.add("active"); chartBtn.classList.remove("active"); };
  chartBtn.onclick = ()=>{ showSection(chartSection); dashboardBtn.classList.remove("active"); transactionsBtn.classList.remove("active"); chartBtn.classList.add("active"); renderChart(); };

  // --- FETCH DATA ---
  async function fetchData(){
    const productsSnap = await getDocs(collection(db,"products"));
    const historySnap = await getDocs(collection(db,"history"));
    return {
      products: productsSnap.docs.map(d=>({id:d.id,...d.data()})),
      history: historySnap.docs.map(d=>({id:d.id,...d.data()}))
    };
  }

  // --- RENDER INVENTORY ---
  async function renderInventory(){
    const {products,history} = await fetchData();
    inventoryTable.innerHTML="";
    productSelect.innerHTML='<option value="">Select Product</option>';
    step2ProductSelect.innerHTML='<option value="">Select Product</option>';
    updateProductSelect.innerHTML='<option value="">Select Product</option>';

    let stockCount = 0;
    products.forEach(p=>{
      stockCount += p.quantity;

      [productSelect, step2ProductSelect, updateProductSelect].forEach(sel=>{
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.name;
        sel.appendChild(opt);
      });

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.image?`<img src="${p.image}" width="60" style="cursor:pointer">`:"-"}</td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.quantity}</td>
        <td><button class="deleteBtn">Delete</button></td>
      `;

      const imgEl = row.querySelector("img");
      if(imgEl) imgEl.addEventListener("click", ()=>previewImage(p.image));

      row.querySelector(".deleteBtn").addEventListener("click", async ()=>{
        if(confirm("Delete product?")){
          await deleteDoc(doc(db,"products",p.id));
          const historySnap = await getDocs(collection(db,"history"));
          for(const h of historySnap.docs){
            if(h.data().productId===p.id){
              await deleteDoc(doc(db,"history",h.id));
            }
          }
          renderInventory();
        }
      });

      inventoryTable.appendChild(row);
    });

    totalProducts.textContent = products.length;
    totalStocks.textContent = stockCount;
    renderHistory(history);
  }

  // --- RENDER HISTORY ---
  function renderHistory(historyData){
    historyTable.innerHTML="";
    historyData.forEach(h=>{
      const dateValue = h.date?.seconds ? new Date(h.date.seconds*1000) : new Date(h.date);
      const row = document.createElement("tr");
      row.innerHTML = `<td>${dateValue.toLocaleString()}</td><td>${h.product}</td><td>${h.type}</td><td>${h.qty}</td>`;
      historyTable.appendChild(row);
    });
  }

  // --- ADD PRODUCT ---
  document.getElementById("addProductForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const category = document.getElementById("category").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const imageInput = document.getElementById("image");

    if(!name||!category||!quantity){ alert("Fill all fields"); return; }

    let imageURL = "";
    if(imageInput.files[0]){
      const file = imageInput.files[0];
      const storageRef = ref(storage,"products/"+Date.now()+"_"+file.name);
      await uploadBytes(storageRef,file);
      imageURL = await getDownloadURL(storageRef);
    }

    const productRef = await addDoc(collection(db,"products"), {name, category, quantity, image: imageURL});
    await addDoc(collection(db,"history"), {date:new Date(), product:name, productId:productRef.id, type:"IN", qty:quantity});
    renderInventory();
    this.reset();
  });

  // --- STOCK IN/OUT ---
  async function handleStock(isIn){
    const productId = productSelect.value;
    const qty = parseInt(stockQtyInput.value);
    if(!productId || isNaN(qty) || qty<=0){ alert("Enter valid quantity"); return; }
    const productRef = doc(db,"products",productId);
    const productSnap = await getDoc(productRef);
    if(!productSnap.exists()){ alert("Product not found"); return; }
    const productData = productSnap.data();
    if(!isIn && productData.quantity<qty){ alert("Not enough stock"); return; }

    await updateDoc(productRef, {quantity:isIn?productData.quantity+qty:productData.quantity-qty});
    await addDoc(collection(db,"history"), {date:new Date(), product:productData.name, productId, type:isIn?"IN":"OUT", qty});
    stockQtyInput.value="";
    renderInventory();
  }
  document.getElementById("stockInBtn").onclick = ()=>handleStock(true);
  document.getElementById("stockOutBtn").onclick = ()=>handleStock(false);

  // --- UPDATE IMAGE ---
  updateImageBtn.onclick = async ()=>{
    const productId = updateProductSelect.value;
    const file = updateImageInput.files[0];
    if(!productId){ alert("Select product"); return; }
    if(!file){ alert("Choose image"); return; }
    const storageRef = ref(storage,"products/"+Date.now()+"_"+file.name);
    await uploadBytes(storageRef,file);
    const imageURL = await getDownloadURL(storageRef);
    await updateDoc(doc(db,"products",productId), {image:imageURL});
    alert("Image updated");
    updateImageInput.value="";
    renderInventory();
  };

  // --- IMAGE PREVIEW ---
  window.previewImage = function(src){
    const overlay = document.createElement("div");
    overlay.style.position="fixed";
    overlay.style.top="0"; overlay.style.left="0";
    overlay.style.width="100%"; overlay.style.height="100%";
    overlay.style.background="rgba(0,0,0,0.8)";
    overlay.style.display="flex";
    overlay.style.justifyContent="center";
    overlay.style.alignItems="center";
    overlay.onclick = ()=>document.body.removeChild(overlay);
    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth="80%";
    img.style.maxHeight="80%";
    overlay.appendChild(img);
    document.body.appendChild(overlay);
  };

  // --- RENDER CHART ---
  async function renderChart(){
    const {products} = await fetchData();
    const categories = ["PATAGONIA","QUARTZITE","ONYX","MARBLE","TRAVERTINE","LIMESTONE","GRANITE","CRAZY CUT","COBBLESTONE"];
    const data = categories.map(c=>products.filter(p=>p.category===c).reduce((sum,p)=>sum+p.quantity,0));
    const ctx = categoryChartEl.getContext("2d");
    if(categoryChart) categoryChart.destroy();
    categoryChart = new Chart(ctx, {
      type:'bar',
      data:{labels:categories,datasets:[{label:'Stock per Category',data:data,backgroundColor:'rgba(54,162,235,0.7)'}]},
      options:{responsive:true,plugins:{legend:{display:false},title:{display:true,text:'Stock per Category'}},scales:{y:{beginAtZero:true}}}
    });
  }

  // --- EXPORT CSV ---
  document.getElementById("exportInventoryBtn").onclick = async ()=>{
    const {products} = await fetchData();
    let csv = "Product,Category,Stock\n";
    products.forEach(p=>csv+=`${p.name},${p.category},${p.quantity}\n`);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download = "inventory.csv";
    a.click();
  };

  document.getElementById("exportTransactionsBtn").onclick = async ()=>{
    const {history} = await fetchData();
    let csv = "Date,Product,Type,Quantity\n";
    history.forEach(h=>csv+=`${new Date(h.date?.seconds*1000||h.date).toLocaleString()},${h.product},${h.type},${h.qty}\n`);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download = "transactions.csv";
    a.click();
  };

  // --- LOGOUT ---
  document.getElementById("logoutBtn").onclick = ()=>{
    localStorage.removeItem("adminLoggedIn");
    window.location.href="login.html";
  };

  // --- INITIAL RENDER ---
  renderInventory();
});

let products = JSON.parse(localStorage.getItem("products")) || [];
const tableBody = document.getElementById("tableBody");

function saveProducts(){
    localStorage.setItem("products", JSON.stringify(products));
}

function addProduct(){
    const product = {
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        size: document.getElementById("size").value,
        unit: document.getElementById("unit").value,
        supplier: document.getElementById("supplier").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        image: "",
        lastUpdated: new Date().toLocaleDateString()
    };

    products.push(product);
    saveProducts();
    renderTable();
}

function renderTable(){
    tableBody.innerHTML = "";
    products.forEach((product, index)=>{
        renderRow(product,index);
    });
}

function renderRow(product,index){

    const categories = ["PATAGONIA QUARTZITE","QUARTZITE","ONYX","MARBLE","GRANITE","TRAVERTINE","LIMESTONE","CRAZY CUTS","COBBLESTONE"];
    const units = ["SLABS","PIECE"];

    let categoryDropdown = `<select onchange="updateField(${index},'category',this.value)">`;
    categories.forEach(c=>{
        categoryDropdown += `<option value="${c}" ${c===product.category?'selected':''}>${c}</option>`;
    });
    categoryDropdown += "</select>";

    let unitDropdown = `<select onchange="updateField(${index},'unit',this.value)">`;
    units.forEach(u=>{
        unitDropdown += `<option value="${u}" ${u===product.unit?'selected':''}>${u}</option>`;
    });
    unitDropdown += "</select>";

    const row = tableBody.insertRow();

    row.innerHTML = `
        <td>
            <div class="image-wrapper">
                <img src="${product.image || ''}" class="thumb">
                <div class="image-overlay">Change Photo</div>
                <input type="file" class="image-input" accept="image/*">
            </div>
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

    const wrapper = row.querySelector(".image-wrapper");
    const img = row.querySelector(".thumb");
    const fileInput = row.querySelector(".image-input");

    wrapper.addEventListener("click", ()=> fileInput.click());

    fileInput.addEventListener("change", function(){
        const file = this.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = function(e){
            img.src = e.target.result;
            products[index].image = e.target.result;
            saveProducts();
        };
        reader.readAsDataURL(file);
    });

    if(product.stock < 5){
        row.classList.add("low-stock");
    }
}

function updateField(index,field,value){
    products[index][field] = value;
    products[index].lastUpdated = new Date().toLocaleDateString();
    saveProducts();
}

function updateStock(index,value){
    products[index].stock = value;
    products[index].lastUpdated = new Date().toLocaleDateString();
    saveProducts();
    renderTable();
}

function deleteProduct(index){
    products.splice(index,1);
    saveProducts();
    renderTable();
}

renderTable();

// Load inventory from localStorage or initialize
let inventory = JSON.parse(localStorage.getItem("inventory"));

if (!inventory) {
    inventory = [
        { product: "ANGELI LUCE", category: "PATAGONIA QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 0, updated: "" },
        { product: "ARCTIC PINK 2", category: "PATAGONIA QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 0, updated: "" },
        { product: "FOLLAJE ROSA", category: "PATAGONIA QUARTZITE", size: "3.42 X 2.01 M", unit: "", supplier: "", price: "", stock: 8, updated: "" },
        { product: "FOLLAJE ROSA", category: "PATAGONIA QUARTZITE", size: "3.43 X 2.01 M", unit: "", supplier: "", price: "", stock: 8, updated: "" },
        { product: "FRACASSI", category: "PATAGONIA QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 0, updated: "" },
        { product: "AVOCADO GREEN", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 3, updated: "" },
        { product: "BULGARI WHITE", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 2, updated: "" },
        { product: "MONT BLANC", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 1, updated: "" },
        { product: "OCEAN BLUE", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 8, updated: "" },
        { product: "SAGE CASCADE", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 3, updated: "" },
        { product: "SAGE CASCADE 2", category: "QUARTZITE", size: "", unit: "", supplier: "", price: "", stock: 5, updated: "" },
        { product: "CLASSICAL GREEN", category: "ONYX", size: "", unit: "", supplier: "", price: "", stock: 2, updated: "" },
        { product: "CALACATTA VIOLA 1", category: "MARBLE", size: "", unit: "", supplier: "", price: "", stock: 11, updated: "" },
        { product: "CIPPOLINO UNDULATO 2", category: "MARBLE", size: "", unit: "", supplier: "", price: "", stock: 8, updated: "" },
        { product: "CREMA MARFIL", category: "MARBLE", size: "", unit: "", supplier: "", price: "", stock: 2, updated: "" },
        { product: "GOLDEN BLACK MARQUINA", category: "MARBLE", size: "", unit: "", supplier: "", price: "", stock: 19, updated: "" },
        { product: "BLACK FLAMED, BRUSHED", category: "GRANITE", size: "", unit: "PCS", supplier: "", price: "", stock: 19, updated: "FEB 09, 2026" },
        { product: "DARK GREY GRANITE", category: "GRANITE", size: "", unit: "SQM", supplier: "", price: "", stock: 83, updated: "" },
        { product: "GRAY FLAMED", category: "GRANITE", size: "", unit: "PCS", supplier: "", price: "", stock: 20, updated: "FEB 20, 2026, FEB 25, 2026" },
        { product: "BEIGE", category: "TRAVERTINE", size: "", unit: "", supplier: "", price: "", stock: 14, updated: "" },
        { product: "LIMESTONE 2", category: "TRAVERTINE", size: "", unit: "", supplier: "", price: "", stock: 9, updated: "" },
        { product: "SILVER", category: "TRAVERTINE", size: "", unit: "", supplier: "", price: "", stock: 8, updated: "" },
        { product: "CRYSTAL BEIGE MARBLE", category: "CRAZY CUTS", size: "", unit: "CRATE", supplier: "", price: "", stock: 1, updated: "FEB 11, 2026" },
        { product: "CRYSTAL GREY MARBLE", category: "CRAZY CUTS", size: "10 SQM", unit: "CRATE", supplier: "", price: "", stock: 18, updated: "" },
        { product: "IVORY LIMESTONE", category: "CRAZY CUTS", size: "", unit: "CRATES", supplier: "", price: "", stock: 3, updated: "FEB 24, 2026" },
        { product: "ASH GREY GRANITE", category: "COBBLESTONE", size: "", unit: "CRATES & PCS", supplier: "", price: "", stock: 4, updated: "" },
        { product: "WARM BEIGE GRANITE", category: "COBBLESTONE", size: "", unit: "CRATES", supplier: "", price: "", stock: 5, updated: "" }
    ];

    localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Function to load inventory into table
function loadInventory() {
    const tableBody = document.querySelector("#inventoryTable tbody");
    tableBody.innerHTML = "";

    let totalStock = 0;

    inventory.forEach(item => {
        totalStock += item.stock;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.category}</td>
            <td>${item.size}</td>
            <td>${item.unit}</td>
            <td>${item.supplier}</td>
            <td>${item.price}</td>
            <td>${item.stock}</td>
            <td>${item.updated}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById("totalProducts").textContent = inventory.length;
    document.getElementById("totalStock").textContent = totalStock;
}

// Load table when page opens
loadInventory();

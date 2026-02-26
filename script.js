let inventory = JSON.parse(localStorage.getItem("inventory"));

if (!inventory) {
    inventory = [

        { product: "ANGELI LUCE", category: "PATAGONIA QUARTZITE", stock: 0 },
        { product: "ARCTIC PINK 2", category: "PATAGONIA QUARTZITE", stock: 0 },
        { product: "FOLLAJE ROSA 3.42x2.01", category: "PATAGONIA QUARTZITE", stock: 8 },
        { product: "FOLLAJE ROSA 3.43x2.01", category: "PATAGONIA QUARTZITE", stock: 8 },
        { product: "FRACASSI", category: "PATAGONIA QUARTZITE", stock: 0 },
        { product: "GREEN", category: "PATAGONIA QUARTZITE", stock: 0 },
        { product: "LA LUZ 2", category: "PATAGONIA QUARTZITE", stock: 0 },
        { product: "LA LUZ 3", category: "PATAGONIA QUARTZITE", stock: 0 },
        { product: "PASSAFORTE 5", category: "PATAGONIA QUARTZITE", stock: 0 },
        { product: "PHOENIX", category: "PATAGONIA QUARTZITE", stock: 0 },
        { product: "PIAZZA", category: "PATAGONIA QUARTZITE", stock: 0 },
        { product: "SAVANNAH DAWN 3", category: "PATAGONIA QUARTZITE", stock: 0 },
        { product: "VEYMONT GREEN", category: "PATAGONIA QUARTZITE", stock: 0 },
        { product: "VOLERE 2", category: "PATAGONIA QUARTZITE", stock: 0 },

        { product: "AVOCADO GREEN", category: "QUARTZITE", stock: 3 },
        { product: "BULGARI WHITE", category: "QUARTZITE", stock: 2 },
        { product: "MONT BLANC", category: "QUARTZITE", stock: 1 },
        { product: "OCEAN BLUE", category: "QUARTZITE", stock: 8 },
        { product: "SAGE CASCADE", category: "QUARTZITE", stock: 3 },
        { product: "SAGE CASCADE 2", category: "QUARTZITE", stock: 5 },

        { product: "CLASSICAL GREEN", category: "ONYX", stock: 2 },

        { product: "CALACATTA VIOLA 1", category: "MARBLE", stock: 11 },
        { product: "CIPPOLINO UNDULATO 2", category: "MARBLE", stock: 8 },
        { product: "CREMA MARFIL", category: "MARBLE", stock: 2 },
        { product: "GOLDEN BLACK MARQUINA", category: "MARBLE", stock: 19 },

        { product: "BLACK FLAMED BRUSHED", category: "GRANITE", stock: 19 },
        { product: "DARK GREY GRANITE", category: "GRANITE", stock: 83 },
        { product: "GRAY FLAMED", category: "GRANITE", stock: 20 },

        { product: "BEIGE", category: "TRAVERTINE", stock: 14 },
        { product: "LIMESTONE 2", category: "TRAVERTINE", stock: 9 },
        { product: "SILVER", category: "TRAVERTINE", stock: 8 },

        { product: "CRYSTAL BEIGE MARBLE", category: "CRAZY CUTS", stock: 1 },
        { product: "CRYSTAL GREY MARBLE", category: "CRAZY CUTS", stock: 18 },
        { product: "IVORY LIMESTONE", category: "CRAZY CUTS", stock: 3 },

        { product: "ASH GREY GRANITE", category: "COBBLESTONE", stock: 4 },
        { product: "WARM BEIGE GRANITE", category: "COBBLESTONE", stock: 5 }

    ];

    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function loadInventory() {
    const tableBody = document.querySelector("#inventoryTable tbody");
    tableBody.innerHTML = "";

    let totalQuantity = 0;

    inventory.forEach((item) => {
        totalQuantity += item.stock;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
        `;

        tableBody.appendChild(row);
    });

    document.getElementById("totalProducts").textContent = inventory.length;
    document.getElementById("totalQuantity").textContent = totalQuantity;
}

loadInventory();

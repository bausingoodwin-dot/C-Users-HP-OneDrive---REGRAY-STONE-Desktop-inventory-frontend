addProductForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("newProductName").value.trim();
    const category = document.getElementById("newProductCategory").value.trim();
    const imageFileInput = document.getElementById("newProductImage");
    const imageFile = imageFileInput.files[0];

    if (!name || !category) {
        alert("Please enter a product name and category.");
        return;
    }

    if (!imageFile) {
        alert("Please select a product image.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function() {
        products.push({
            name,
            category,
            quantity: 0,
            image: reader.result,
            lastUpdated: "-"
        });

        saveData();
        renderProducts(searchInput.value);
        addProductForm.reset();
    };

    reader.onerror = function() {
        alert("Failed to read image. Please try again.");
    };

    reader.readAsDataURL(imageFile);
});

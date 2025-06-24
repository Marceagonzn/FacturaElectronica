document.addEventListener('DOMContentLoaded', () => {
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const addProductButton = document.getElementById('add-new-product');
    const productListBody = document.getElementById('product-list-body');
    const productsCodeOutput = document.getElementById('products-code-output');
    const copyCodeButton = document.getElementById('copy-code');

    // Usamos una copia mutable de los productos cargados de products.js
    let currentProducts = [...products]; 

    // Función para renderizar la tabla de productos
    const renderProductList = () => {
        productListBody.innerHTML = ''; // Limpiar la tabla
        currentProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td><button class="remove-product" data-id="${product.id}">Eliminar</button></td>
            `;
            productListBody.appendChild(row);
        });
        attachRemoveEventListeners(); // Adjuntar eventos a los nuevos botones
        updateProductsCodeOutput(); // Actualizar el código de salida
    };

    // Función para adjuntar eventos a los botones de eliminar
    const attachRemoveEventListeners = () => {
        document.querySelectorAll('.remove-product').forEach(button => {
            button.onclick = (event) => {
                const productIdToRemove = event.target.dataset.id;
                // Filtrar el array para remover el producto
                currentProducts = currentProducts.filter(p => p.id !== productIdToRemove);
                renderProductList(); // Volver a renderizar la lista
            };
        });
    };

    // Función para agregar un nuevo producto
    const addProduct = () => {
        const id = productIdInput.value.trim();
        const name = productNameInput.value.trim();
        const price = parseFloat(productPriceInput.value);

        if (!id || !name || isNaN(price) || price < 0) {
            alert('Por favor, complete todos los campos correctamente (ID, Nombre y Precio).');
            return;
        }
        if (currentProducts.some(p => p.id === id)) {
            alert('Ya existe un producto con este ID. Por favor, use un ID único.');
            return;
        }

        currentProducts.push({ id, name, price }); // Añadir al array temporal
        productIdInput.value = ''; // Limpiar campos
        productNameInput.value = '';
        productPriceInput.value = '';
        renderProductList(); // Volver a renderizar la lista
    };

    // Función para generar el código JavaScript del array de productos
    const updateProductsCodeOutput = () => {
        let code = 'const products = [\n';
        currentProducts.forEach((product, index) => {
            code += `    { id: '${product.id}', name: '${product.name}', price: ${product.price.toFixed(2)} }`;
            if (index < currentProducts.length - 1) {
                code += ',\n';
            } else {
                code += '\n';
            }
        });
        code += '];';
        productsCodeOutput.value = code;
    };

    // Función para copiar el código al portapapeles
    const copyCodeToClipboard = () => {
        productsCodeOutput.select();
        productsCodeOutput.setSelectionRange(0, 99999); // Para móviles
        document.execCommand('copy');
        alert('Código copiado al portapapeles. ¡No olvides pegarlo en tu archivo products.js y guardar!');
    };

    // Inicialización
    addProductButton.addEventListener('click', addProduct);
    copyCodeButton.addEventListener('click', copyCodeToClipboard);

    renderProductList(); // Renderizar la lista inicial al cargar
});
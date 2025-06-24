document.addEventListener('DOMContentLoaded', () => {
    const invoiceDateSpan = document.getElementById('invoice-date');
    const invoiceItemsBody = document.getElementById('invoice-items');
    const addItemButton = document.getElementById('add-item');
    const subtotalSpan = document.getElementById('subtotal');
    const taxSpan = document.getElementById('tax');
    const totalSpan = document.getElementById('total');
    const printInvoiceButton = document.getElementById('print-invoice');
    const shareWhatsappButton = document.getElementById('share-whatsapp');

    let itemCounter = 0;

    const setInvoiceDate = () => {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        invoiceDateSpan.textContent = today.toLocaleDateString('es-ES', options);
    };

    // Función para generar las opciones del select de productos
    const generateProductOptions = () => {
        let optionsHtml = '<option value="">-- Seleccione un producto --</option>';
        products.forEach(product => {
            optionsHtml += `<option value="${product.id}">${product.name}</option>`;
        });
        return optionsHtml;
    };

    const addNewItem = () => {
        itemCounter++;
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="number" value="1" min="1" class="item-quantity" data-id="${itemCounter}"></td>
            <td>
                <select class="item-selector" data-id="${itemCounter}">
                    ${generateProductOptions()}
                </select>
            </td>
            <td><input type="number" value="0.00" min="0" step="0.01" class="item-price" data-id="${itemCounter}" readonly></td> <td><span class="item-subtotal" data-id="${itemCounter}">0.00</span></td>
            <td><button class="remove-item" data-id="${itemCounter}">Eliminar</button></td>
        `;
        invoiceItemsBody.appendChild(newRow);
        attachItemEventListeners(newRow);
        calculateTotals();
    };

    const attachItemEventListeners = (row) => {
        const quantityInput = row.querySelector('.item-quantity');
        const priceInput = row.querySelector('.item-price');
        const productSelector = row.querySelector('.item-selector'); // Nuevo: Selector de producto
        const removeButton = row.querySelector('.remove-item');

        quantityInput.addEventListener('input', calculateItemSubtotal);
        productSelector.addEventListener('change', updateItemPriceAndSubtotal); // Nuevo: Evento para el selector
        removeButton.addEventListener('click', removeItem);
    };

    // Nueva función para actualizar precio y subtotal al seleccionar producto
    const updateItemPriceAndSubtotal = (event) => {
        const itemId = event.target.dataset.id;
        const selectedProductId = event.target.value;
        const priceInput = document.querySelector(`.item-price[data-id="${itemId}"]`);
        const quantityInput = document.querySelector(`.item-quantity[data-id="${itemId}"]`);

        if (selectedProductId) {
            const selectedProduct = products.find(p => p.id === selectedProductId);
            if (selectedProduct) {
                priceInput.value = selectedProduct.price.toFixed(2); // Establece el precio
            }
        } else {
            priceInput.value = "0.00"; // Si no hay producto seleccionado, el precio es 0
        }
        // Recalcula el subtotal del ítem después de actualizar el precio
        // Se simula un evento input en la cantidad para disparar calculateItemSubtotal
        const fakeEvent = { target: quantityInput };
        calculateItemSubtotal(fakeEvent);
    };

    const calculateItemSubtotal = (event) => {
        const itemId = event.target.dataset.id;
        const quantity = parseFloat(document.querySelector(`.item-quantity[data-id="${itemId}"]`).value);
        const price = parseFloat(document.querySelector(`.item-price[data-id="${itemId}"]`).value); // Obtener el precio actual

        const itemSubtotalSpan = document.querySelector(`.item-subtotal[data-id="${itemId}"]`);

        const subtotal = (quantity * price).toFixed(2);
        itemSubtotalSpan.textContent = subtotal;
        calculateTotals();
    };

    const removeItem = (event) => {
        const itemId = event.target.dataset.id;
        const rowToRemove = event.target.closest('tr');
        rowToRemove.remove();
        calculateTotals();
    };

    const calculateTotals = () => {
        let currentSubtotal = 0;
        document.querySelectorAll('.item-subtotal').forEach(span => {
            currentSubtotal += parseFloat(span.textContent);
        });

        const taxRate = 0.10; // 10% de IVA
        const taxAmount = (currentSubtotal * taxRate).toFixed(2);
        const totalAmount = (currentSubtotal + parseFloat(taxAmount)).toFixed(2);

        subtotalSpan.textContent = currentSubtotal.toFixed(2);
        taxSpan.textContent = taxAmount;
        totalSpan.textContent = totalAmount;
    };

    const printInvoice = () => {
        window.print();
    };

    const shareViaWhatsApp = () => {
        const clientName = document.getElementById('client-name').value;
        const invoiceNumber = document.getElementById('invoice-number').textContent;
        const totalAmount = document.getElementById('total').textContent;
        const companyName = "La Pizza Feliz";
        const companyPhone = "595981789012"; // Número de teléfono de la pizzería con código de país para WhatsApp

        const message = encodeURIComponent(
            `¡Hola ${clientName}!\n\nTu pedido de ${companyName} con Factura Nro. ${invoiceNumber} está listo.\nEl total a pagar es: Gs. ${totalAmount}.\n\n¡Que lo disfrutes!\n\nPara ver el detalle de la factura, puedes generar el PDF desde el navegador y adjuntarlo aquí.`
        );

        window.open(`https://wa.me/${companyPhone}?text=${message}`, '_blank');
        alert("Se abrirá WhatsApp. Por favor, primero genera el PDF de la factura (botón 'Imprimir/Generar PDF') y luego adjúntalo manualmente en el chat de WhatsApp.");
    };

    // Inicialización al cargar la página
    setInvoiceDate();
    addNewItem(); // Añade el primer ítem con selector
    addItemButton.addEventListener('click', addNewItem);
    printInvoiceButton.addEventListener('click', printInvoice);
    shareWhatsappButton.addEventListener('click', shareViaWhatsApp);
});
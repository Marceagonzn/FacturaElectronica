document.addEventListener('DOMContentLoaded', () => {
    const invoiceDateSpan = document.getElementById('invoice-date');
    const invoiceItemsBody = document.getElementById('invoice-items');
    const addItemButton = document.getElementById('add-item');
    const subtotalSpan = document.getElementById('subtotal');
    const taxSpan = document.getElementById('tax');
    const totalSpan = document.getElementById('total');
    const printInvoiceButton = document.getElementById('print-invoice');
    const shareWhatsappButton = document.getElementById('share-whatsapp'); // Nuevo: Referencia al botón de WhatsApp

    let itemCounter = 0;

    const setInvoiceDate = () => {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        invoiceDateSpan.textContent = today.toLocaleDateString('es-ES', options);
    };

    const addNewItem = () => {
        itemCounter++;
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="number" value="1" min="1" class="item-quantity" data-id="${itemCounter}"></td>
            <td><input type="text" value="Pizza Grande de Muzzarella" class="item-description" data-id="${itemCounter}"></td>
            <td><input type="number" value="55000.00" min="0" step="0.01" class="item-price" data-id="${itemCounter}"></td>
            <td><span class="item-subtotal" data-id="${itemCounter}">0.00</span></td>
            <td><button class="remove-item" data-id="${itemCounter}">Eliminar</button></td>
        `;
        invoiceItemsBody.appendChild(newRow);
        attachItemEventListeners(newRow);
        calculateTotals();
    };

    const attachItemEventListeners = (row) => {
        const quantityInput = row.querySelector('.item-quantity');
        const priceInput = row.querySelector('.item-price');
        const removeButton = row.querySelector('.remove-item');

        quantityInput.addEventListener('input', calculateItemSubtotal);
        priceInput.addEventListener('input', calculateItemSubtotal);
        removeButton.addEventListener('click', removeItem);
    };

    const calculateItemSubtotal = (event) => {
        const itemId = event.target.dataset.id;
        const quantity = parseFloat(document.querySelector(`.item-quantity[data-id="${itemId}"]`).value);
        const price = parseFloat(document.querySelector(`.item-price[data-id="${itemId}"]`).value);
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

        const taxRate = 0.09; // 9% de IVA
        const taxAmount = (currentSubtotal * taxRate).toFixed(2);
        const totalAmount = (currentSubtotal + parseFloat(taxAmount)).toFixed(2);

        subtotalSpan.textContent = currentSubtotal.toFixed(2);
        taxSpan.textContent = taxAmount;
        totalSpan.textContent = totalAmount;
    };

    const printInvoice = () => {
        window.print();
    };

    // Función para compartir por WhatsApp
    const shareViaWhatsApp = () => {
        const clientName = document.getElementById('client-name').value;
        const invoiceNumber = document.getElementById('invoice-number').textContent;
        const totalAmount = document.getElementById('total').textContent;
        const companyName = "La Pizza Feliz";
        const companyPhone = "+12345678910"; // Número de teléfono de la pizzería sin formato, solo dígitos

        const message = encodeURIComponent(
            `¡Hola ${clientName}!\n\nTu pedido de ${companyName} con Factura Nro. ${invoiceNumber} está listo.\nEl total a pagar es: Gs. ${totalAmount}.\n\n¡Que lo disfrutes!\n`
        );

        // Abre WhatsApp Web o la aplicación si está instalada
        window.open(`https://wa.me/${companyPhone}?text=${message}`, '_blank');

        // Opcional: Instrucciones para el usuario
        alert("Se abrirá WhatsApp. Por favor, primero genera el PDF de la factura (botón 'Imprimir/Generar PDF') y luego adjúntalo manualmente en el chat de WhatsApp.");
    };


    setInvoiceDate();
    addNewItem();
    addItemButton.addEventListener('click', addNewItem);
    printInvoiceButton.addEventListener('click', printInvoice);
    shareWhatsappButton.addEventListener('click', shareViaWhatsApp); // Nuevo: Evento para el botón de WhatsApp
});
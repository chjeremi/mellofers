document.addEventListener('DOMContentLoaded', () => {
   const floatingCart = document.getElementById('floating-cart');
const toggleCartButton = document.getElementById('toggle-cart');



    // --- Navigasi Hamburger ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav .nav-list a');

    hamburgerMenu.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = hamburgerMenu.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                hamburgerMenu.querySelector('i').classList.remove('fa-times');
                hamburgerMenu.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // --- Elemen container untuk menu (SUDAH SESUAI DENGAN INDEX.HTML TERBARU ANDA) ---
    const recommendedMenuGrid = document.getElementById('recommended-menu-grid');
    const bestsellerMenuGrid = document.getElementById('bestseller-menu-grid');
    const allMenuGrid = document.getElementById('all-menu-grid');

    // --- Modal elements (Deklarasikan di sini karena modal statis di HTML) ---
    const itemDetailModal = document.getElementById('itemDetailModal');
    const closeDetailModalButton = itemDetailModal.querySelector('.close-button'); // Tombol silang modal detail
    const modalItemName = document.getElementById('modalItemName');
    const modalItemImage = document.getElementById('modalItemImage');
    const modalItemPrice = document.getElementById('modalItemPrice');
    const modalItemIngredients = document.getElementById('modalItemIngredients');

    // --- Elemen Keranjang Belanja ---
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    // --- Modal Konfirmasi Pesanan ---
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    const closeOrderModalButton = orderConfirmationModal.querySelector('.order-close-button'); // Tombol silang modal order
    const orderForm = document.getElementById('order-form');
    const customerNameInput = document.getElementById('customer-name');
    const customerAddressInput = document.getElementById('customer-address');

    // --- Variabel Global untuk Keranjang ---
    let cart = JSON.parse(localStorage.getItem('melfoodCart')) || [];
    let allMenuItems = []; // Menyimpan semua data menu yang diambil dari API

    // --- Fungsi untuk membuat elemen kartu menu dari data API (Tidak Berubah) ---
    // function createMenuItem(menuItem) {
    //     const itemDiv = document.createElement('div');
    //     itemDiv.classList.add('menu-item');
    //     itemDiv.dataset.id = menuItem.id;
    //     itemDiv.dataset.name = menuItem.name;
    //     itemDiv.dataset.ingredients = menuItem.ingredients || '';
    //     itemDiv.dataset.price = menuItem.price;

    //     // Backend Anda tidak memiliki kolom 'available', jadi kita gunakan is_recommended atau is_best_seller
    //     // atau Anda dapat menambahkan kolom 'available' di database Anda jika diperlukan.
    //     // Untuk saat ini, kita akan asumsikan menu selalu tersedia jika tidak ada kolom 'available'.
    //     // Jika Anda ingin mengimplementasikan ketersediaan, Anda perlu memodifikasi skema DB dan backend.
    //     if (true) { // Asumsi selalu tersedia sampai ada kolom 'available' di DB
    //         itemDiv.classList.add('on-sale');
    //     } else {
    //         itemDiv.classList.add('not-sale');
    //     }

    //     const imageUrl = menuItem.image_url ? `http://localhost:3000${menuItem.image_url}` : 'https://via.placeholder.com/400x250?text=No+Image';

    //     itemDiv.innerHTML = `
    //         <img src="${imageUrl}" alt="${menuItem.name}">
    //         <div class="menu-info">
    //             <h3>${menuItem.name}</h3>
    //             <p>Harga: Rp ${new Intl.NumberFormat('id-ID').format(menuItem.price)}</p>
    //             <div class="menu-actions">
    //                 <button class="buy-button">Beli</button>
    //                 <button class="detail-icon" aria-label="Lihat Detail"><i class="fas fa-ellipsis-h"></i></button>
    //             </div>
    //         </div>
    //     `;
    //     return itemDiv;
    // }

    function createMenuItem(menuItem) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('menu-item');
    itemDiv.dataset.id = menuItem.id;
    itemDiv.dataset.name = menuItem.name;
    itemDiv.dataset.ingredients = menuItem.ingredients || '';
    itemDiv.dataset.price = menuItem.price;

    const isAvailable = menuItem.available === 1 || menuItem.available === "1"; // Pastikan boolean
    if (isAvailable) {
        itemDiv.classList.add('on-sale');
    } else {
        itemDiv.classList.add('not-sale');
        itemDiv.style.opacity = '0.5';
        itemDiv.style.pointerEvents = 'none';
    }

    const imageUrl = menuItem.image_url ? `https://mellfood.nasiuduklapangantenis.my.id${menuItem.image_url}` : 'https://via.placeholder.com/400x250?text=No+Image';

    itemDiv.innerHTML = `
        <img src="${imageUrl}" alt="${menuItem.name}">
        <div class="menu-info">
            <h3>${menuItem.name}</h3>
            <p>Harga: Rp ${new Intl.NumberFormat('id-ID').format(menuItem.price)}</p>
            <div class="menu-actions">
                <button class="buy-button"${!isAvailable ? ' disabled' : ''}>Beli</button>
                <button class="detail-icon" aria-label="Lihat Detail"><i class="fas fa-ellipsis-h"></i></button>
            </div>
        </div>
    `;

    return itemDiv;
}


    // --- Handler untuk klik ikon detail ---
    function handleDetailClick() {
        const item = this.closest('.menu-item');
        // Jika Anda mengimplementasikan ketersediaan, uncomment baris ini:
        // if (item.classList.contains('not-sale')) {
        //     return;
        // }

        const name = item.dataset.name;
        const ingredients = item.dataset.ingredients ? item.dataset.ingredients.split(',').map(i => i.trim()) : [];
        const price = item.dataset.price;
        const imageUrl = item.querySelector('img').src;

        modalItemName.textContent = name;
        modalItemImage.src = imageUrl;
        modalItemPrice.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;
        modalItemIngredients.innerHTML = '';
        ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            modalItemIngredients.appendChild(li);
        });

        itemDetailModal.style.display = 'flex';
    }

    // --- Handler untuk menambahkan item ke keranjang ---
    function handleBuyClick() {
        const itemElement = this.closest('.menu-item');
        // Jika Anda mengimplementasikan ketersediaan, uncomment baris ini:
        // if (itemElement.classList.contains('not-sale')) {
        //     alert('Maaf, menu ini sedang tidak tersedia.');
        //     return;
        // }

        const itemId = itemElement.dataset.id;
        const existingItemIndex = cart.findIndex(item => item.id === itemId);

        if (existingItemIndex > -1) {
            // Jika item sudah ada, tingkatkan kuantitas
            cart[existingItemIndex].quantity++;
        } else {
            // Jika item belum ada, tambahkan baru
            const menuItemData = allMenuItems.find(menu => menu.id == itemId); // Cari data lengkap dari allMenuItems
            if (menuItemData) {
                cart.push({
                    id: menuItemData.id,
                    name: menuItemData.name,
                    image_url: menuItemData.image_url,
                    price: parseFloat(menuItemData.price),
                    quantity: 1,
                    notes: '' ,// Inisialisasi catatan kosong
                    available: 1
                });
            } else {
                console.error('Menu item data not found in allMenuItems:', itemId);
                alert('Gagal menambahkan item ke keranjang.');
                return;
            }
        }
        updateCartDisplay();
        saveCartToLocalStorage();
        alert(`"${itemElement.dataset.name}" ditambahkan ke keranjang!`);
    }

    // --- Fungsi untuk memperbarui tampilan keranjang ---
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Bersihkan keranjang
        let totalPrice = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutButton.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutButton.disabled = false;
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.dataset.id = item.id;

                const imageUrl = item.image_url ? `https://mellfood.nasiuduklapangantenis.my.id${item.image_url}` : 'https://via.placeholder.com/80x80?text=No+Image';

                cartItemDiv.innerHTML = `
                    <img src="${imageUrl}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Harga: Rp ${new Intl.NumberFormat('id-ID').format(item.price)}</p>
                        <label for="qty-${item.id}">Jumlah:</label>
                        <input type="number" id="qty-${item.id}" value="${item.quantity}" min="1" data-item-id="${item.id}" class="item-quantity-input">
                        <label for="notes-${item.id}">Catatan:</label>
                        <textarea id="notes-${item.id}" class="item-notes" placeholder="Contoh: Tanpa sambal, Extra keju">${item.notes}</textarea>
                    </div>
                    <button class="remove-item-button" data-item-id="${item.id}" aria-label="Hapus item"><i class="fas fa-trash"></i></button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);

                totalPrice += item.price * item.quantity;
            });
        }

        cartTotalElement.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(totalPrice)}`;
        attachCartItemListeners(); // Lampirkan listener untuk item keranjang yang baru
    }

    // --- Fungsi untuk menyimpan keranjang ke LocalStorage ---
    function saveCartToLocalStorage() {
        localStorage.setItem('melfoodCart', JSON.stringify(cart));
    }

    // --- Fungsi untuk melampirkan event listeners pada elemen dinamis ---
    function attachEventListeners() {
        const detailIcons = document.querySelectorAll('.detail-icon');
        const buyButtons = document.querySelectorAll('.buy-button');

        // Listener untuk tombol detail menu
        detailIcons.forEach(icon => {
            icon.removeEventListener('click', handleDetailClick);
            icon.addEventListener('click', handleDetailClick);
        });

        // Listener untuk tombol beli menu
        buyButtons.forEach(button => {
            button.removeEventListener('click', handleBuyClick);
            button.addEventListener('click', handleBuyClick);
        });

        // Listener untuk tombol silang modal detail
        if (closeDetailModalButton) {
            closeDetailModalButton.removeEventListener('click', handleCloseModalClick);
            closeDetailModalButton.addEventListener('click', handleCloseModalClick);
        }

        // Listener untuk tombol silang modal konfirmasi pesanan
        if (closeOrderModalButton) {
            closeOrderModalButton.removeEventListener('click', handleCloseOrderModalClick);
            closeOrderModalButton.addEventListener('click', handleCloseOrderModalClick);
        }
    }

    // --- Fungsi untuk melampirkan event listeners khusus untuk item keranjang ---
    function attachCartItemListeners() {
        // Listener untuk input quantity
        document.querySelectorAll('.item-quantity-input').forEach(input => {
            input.removeEventListener('change', handleQuantityChange);
            input.addEventListener('change', handleQuantityChange);
        });

        // Listener untuk textarea catatan
        document.querySelectorAll('.item-notes').forEach(textarea => {
            textarea.removeEventListener('input', handleNotesChange); // Gunakan 'input' agar real-time
            textarea.addEventListener('input', handleNotesChange);
        });

        // Listener untuk tombol hapus item
        document.querySelectorAll('.remove-item-button').forEach(button => {
            button.removeEventListener('click', handleRemoveItem);
            button.addEventListener('click', handleRemoveItem);
        });
    }

    // --- Handler perubahan kuantitas item di keranjang ---
    function handleQuantityChange(event) {
        const itemId = event.target.dataset.itemId;
        const newQuantity = parseInt(event.target.value);

        if (newQuantity < 1) {
            event.target.value = 1; // Minimal kuantitas 1
            return;
        }

        const itemIndex = cart.findIndex(item => item.id == itemId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity = newQuantity;
            updateCartDisplay();
            saveCartToLocalStorage();
        }
    }

    // --- Handler perubahan catatan item di keranjang ---
    function handleNotesChange(event) {
        const itemId = event.target.closest('.cart-item').dataset.id;
        const newNotes = event.target.value;

        const itemIndex = cart.findIndex(item => item.id == itemId);
        if (itemIndex > -1) {
            cart[itemIndex].notes = newNotes;
            saveCartToLocalStorage();
        }
    }

    // --- Handler hapus item dari keranjang ---
    function handleRemoveItem() {
        const itemIdToRemove = this.dataset.itemId;
        cart = cart.filter(item => item.id !== itemIdToRemove);
        updateCartDisplay();
        saveCartToLocalStorage();
    }

    // --- Handler untuk menutup modal detail item ---
    function handleCloseModalClick() {
        itemDetailModal.style.display = 'none';
    }

    // --- Handler untuk menutup modal konfirmasi pesanan ---
    function handleCloseOrderModalClick() {
        orderConfirmationModal.style.display = 'none';
    }

    // --- Event listener untuk tombol Checkout / Konfirmasi Pesanan ---
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            orderConfirmationModal.style.display = 'flex'; // Tampilkan modal konfirmasi
        } else {
            alert('Keranjang Anda kosong. Tambahkan item terlebih dahulu.');
        }
    });

    // --- Event listener untuk submit form pesanan ---
    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Mencegah submit form default

        const customerName = customerNameInput.value.trim();
        const customerAddress = customerAddressInput.value.trim();
        // Pastikan untuk mengambil total harga dari elemen display, atau hitung ulang dari keranjang
        const totalPriceText = cartTotalElement.textContent.replace('Rp ', '').replace(/\./g, '');
        const totalPrice = parseFloat(totalPriceText) || 0; // Pastikan konversi ke number, default 0 jika gagal

        if (!customerName || !customerAddress || cart.length === 0) {
            alert('Harap lengkapi nama, alamat, dan pastikan keranjang tidak kosong.');
            return;
        }

        const orderItems = cart.map(item => ({
            menu_id: item.id,
            menu_name: item.name, // Kirim juga nama menu untuk kemudahan di backend
            quantity: item.quantity,
            notes: item.notes,
            price_at_purchase: item.price // Simpan harga saat dipesan
        }));

        try {
            // Perhatikan bahwa backend Anda (index.js) mengharapkan 'table_id'
            // Jika ini adalah aplikasi pemesanan untuk pelanggan, Anda mungkin tidak memiliki 'table_id'.
            // Anda dapat mengirimkan 'null' atau ID tabel default, atau memodifikasi backend agar table_id opsional.
            // Untuk contoh ini, saya akan mengirimkan null untuk table_id.
            const response = await fetch('https://mellfood.nasiuduklapangantenis.my.id/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    table_id: null, // Mengirim null karena ini pesanan pelanggan bukan dari meja
                    customer_name: customerName, // Anda mungkin perlu menambahkan kolom ini ke tabel 'orders' di DB
                    customer_address: customerAddress, // Anda mungkin perlu menambahkan kolom ini ke tabel 'orders' di DB
                    total_price: totalPrice, // Anda mungkin perlu menambahkan kolom ini ke tabel 'orders' di DB
                    items: orderItems
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert(`Pesanan Anda berhasil dikirim! ID Pesanan: ${result.order_id}`);

            // Reset keranjang setelah pesanan berhasil
            cart = [];
            saveCartToLocalStorage();
            updateCartDisplay();
            orderConfirmationModal.style.display = 'none'; // Tutup modal
            orderForm.reset(); // Reset form

        } catch (error) {
            console.error('Gagal mengirim pesanan:', error);
            alert(`Gagal mengirim pesanan: ${error.message || 'Terjadi kesalahan jaringan.'}`);
        }
    });

    // --- Event listener untuk menutup modal saat klik di luar area modal content ---
    window.addEventListener('click', function(event) {
        if (event.target == itemDetailModal) {
            itemDetailModal.style.display = 'none';
        }
        if (event.target == orderConfirmationModal) {
            orderConfirmationModal.style.display = 'none';
        }
    });

    // --- Fungsi untuk mengambil dan merender menu (Ditempatkan di sini) ---
    async function fetchAndRenderMenus() {
        try {
            const response = await fetch('https://mellfood.nasiuduklapangantenis.my.id/api/menus');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allMenuItems = await response.json(); // Simpan semua menu ke variabel global

            // Bersihkan kontainer sebelum merender
            if (recommendedMenuGrid) recommendedMenuGrid.innerHTML = '';
            if (bestsellerMenuGrid) bestsellerMenuGrid.innerHTML = '';
            if (allMenuGrid) allMenuGrid.innerHTML = '';

            // Filter dan render menu
            allMenuItems.forEach(menuItem => {
                const itemElement = createMenuItem(menuItem);
                if (allMenuGrid) allMenuGrid.appendChild(itemElement.cloneNode(true)); // Tambahkan ke daftar lengkap

                if (menuItem.is_recommended && recommendedMenuGrid) {
                    recommendedMenuGrid.appendChild(itemElement.cloneNode(true)); // Tambahkan ke rekomendasi
                }
                if (menuItem.is_best_seller && bestsellerMenuGrid) {
                    bestsellerMenuGrid.appendChild(itemElement.cloneNode(true)); // Tambahkan ke terlaris
                }
            });

            attachEventListeners(); // Lampirkan event listeners setelah menu dirender

        } catch (error) {
            console.error('Error fetching or rendering menus:', error);
            // Tampilkan pesan error di UI jika kontainer tersedia
            if (recommendedMenuGrid) recommendedMenuGrid.innerHTML = '<p style="color: red;">Gagal memuat menu rekomendasi.</p>';
            if (bestsellerMenuGrid) bestsellerMenuGrid.innerHTML = '<p style="color: red;">Gagal memuat menu terlaris.</p>';
            if (allMenuGrid) allMenuGrid.innerHTML = '<p style="color: red;">Gagal memuat daftar menu lengkap.</p>';
        }
    }


    // --- Inisialisasi Halaman ---
    fetchAndRenderMenus();
    updateCartDisplay(); // Tampilkan keranjang saat pertama kali dimuat

    // Perbaikan navigasi admin (pastikan admin-login-btn mengarah ke admin.html)
    const adminLoginBtn = document.querySelector('.admin-login-btn');
    if (adminLoginBtn) {
        adminLoginBtn.href = 'admin.html';
    }
});


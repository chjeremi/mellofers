const SERVER_URL = "http://localhost:3000"
const ordersList = document.getElementById('orders-list');
const noOrdersMessage = document.getElementById('no-orders-message');
const printAllOrdersBtn = document.getElementById('printAllOrdersBtn'); // Dapatkan tombol cetak
let currentOrderToComplete = null;

// Peringatan Penting untuk Pengguna:
// Jika Anda menjalankan backend (index.js) secara lokal, Anda mungkin perlu mengubah SERVER_URL menjadi:
// const SERVER_URL = 'http://localhost:3000';
// Pastikan ini sesuai dengan port tempat backend Anda berjalan.
console.warn(`PENTING: Pastikan SERVER_URL di print.js ('${SERVER_URL}') sesuai dengan URL backend Anda.`);
console.warn("Jika Anda menjalankan backend (index.js) secara lokal, ubah SERVER_URL menjadi 'http://localhost:3000'.");


async function fetchUnprintedOrders() {
  try {
    console.log('Mengambil pesanan yang belum dicetak dari:', `${SERVER_URL}/api/orders/unprinted`);
    const response = await fetch(`${SERVER_URL}/api/orders/unprinted`);
    const data = await response.json();

    ordersList.innerHTML = ''; // Bersihkan konten yang ada

    if (data.length > 0) {
      noOrdersMessage.style.display = 'none';
      printAllOrdersBtn.style.display = 'block'; // Tampilkan tombol cetak jika ada pesanan
      data.forEach(order => renderOrderCard(order));
    } else {
      noOrdersMessage.style.display = 'block';
      printAllOrdersBtn.style.display = 'none'; // Sembunyikan tombol cetak jika tidak ada pesanan
    }
  } catch (error) {
    console.error('Gagal mengambil pesanan:', error);
    noOrdersMessage.style.display = 'block';
    printAllOrdersBtn.style.display = 'none';
    ordersList.innerHTML = `<div class="col-12"><div class="alert alert-danger" role="alert">Gagal memuat pesanan: ${error.message}. Pastikan server backend berjalan.</div></div>`;
  }
}

function renderOrderCard(orderData) {
  const cardCol = document.createElement('div');
  cardCol.className = 'col-lg-6 col-md-12'; // Bootstrap column for responsive layout

  const orderCard = document.createElement('div');
  orderCard.className = 'order-card'; // Class untuk styling
  orderCard.id = `order-${orderData.order_id}`; // ID unik untuk setiap pesanan

  let itemsHtml = '';
  orderData.items.forEach(item => {
    const itemTotal = item.price_at_purchase * item.quantity;
    itemsHtml += `
      <li>
        <div class="item-name-qty">
            ${item.menu_name} (x${item.quantity})
            ${item.notes ? `<div class="item-notes">Catatan: ${item.notes}</div>` : ''}
        </div>
        <div class="item-price">Rp ${new Intl.NumberFormat('id-ID').format(itemTotal)}</div>
      </li>
    `;
  });

  orderCard.innerHTML = `
    <div class="order-header">
        <h5>Pesanan #${orderData.order_id}</h5>
        <small>Tanggal: ${new Date(orderData.order_date).toLocaleString('id-ID')}</small>
    </div>
    <div class="order-details">
        <p><strong>Nama Pelanggan:</strong> ${orderData.customer_name || '-'}</p>
        <p><strong>Alamat:</strong> ${orderData.customer_address || '-'}</p>
    </div>
    <div class="order-items">
        <h6>Daftar Item:</h6>
        <ul>${itemsHtml}</ul>
    </div>
    <div class="order-total">
        Total: Rp ${new Intl.NumberFormat('id-ID').format(orderData.total_price)}
    </div>
    <div class="actions">
        <button class="btn btn-success complete-btn" data-id="${orderData.order_id}" data-bs-toggle="modal" data-bs-target="#completeOrderModal">Selesai</button>
        <button class="btn btn-danger cancel-btn" data-id="${orderData.order_id}">Batal</button>
    </div>
  `;
  cardCol.appendChild(orderCard);
  ordersList.appendChild(cardCol);

  // Add event listeners for the new buttons
  orderCard.querySelector('.complete-btn').addEventListener('click', function() {
    currentOrderToComplete = this.dataset.id;
  });

  orderCard.querySelector('.cancel-btn').addEventListener('click', async function() {
    const orderId = this.dataset.id;
    if (confirm(`Apakah Anda yakin ingin membatalkan pesanan #${orderId}?`)) {
        try {
            const response = await fetch(`${SERVER_URL}/api/orders/${orderId}/cancel`, { method: 'POST' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            alert(`Pesanan #${orderId} berhasil dibatalkan.`);
            fetchUnprintedOrders(); // Refresh list
        } catch (error) {
            console.error(`Gagal membatalkan order #${orderId}:`, error);
            alert(`Terjadi kesalahan saat membatalkan pesanan: ${error.message}`);
        }
    }
  });
}

// Event Listener for confirm complete button in modal
document.getElementById('confirmCompleteBtn').addEventListener('click', async () => {
  if (currentOrderToComplete) {
    try {
      const response = await fetch(`${SERVER_URL}/api/orders/${currentOrderToComplete}/complete`, { method: 'POST' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      alert(`Pesanan #${currentOrderToComplete} berhasil ditandai selesai.`);
      fetchUnprintedOrders(); // Refresh list
      // Ensure Bootstrap's modal is correctly closed
      const modalElement = document.getElementById('completeOrderModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      currentOrderToComplete = null;
    } catch (error) {
      console.error(`Gagal menyelesaikan order #${currentOrderToComplete}:`, error);
      alert(`Terjadi kesalahan saat mencoba menyelesaikan pesanan: ${error.message}`);
    }
  }
});


// Event Listener for Print All Orders Button
if (printAllOrdersBtn) {
    printAllOrdersBtn.addEventListener('click', () => {
        // Ini akan memicu dialog cetak browser.
        // Jika "Thermer" (aplikasi pihak ketiga Anda) dikonfigurasi sebagai printer default
        // atau dapat menangani print job dari browser, ini akan berfungsi.
        window.print();

        // Catatan Penting Mengenai Integrasi Thermer:
        // Jika Thermer memiliki integrasi yang lebih spesifik (misalnya, custom URL scheme
        // seperti 'thermer://print?data=...' atau API JavaScript), Anda perlu merujuk
        // dokumentasi Thermer untuk implementasi yang tepat di sini.
        // Contoh placeholder untuk integrasi langsung Thermer (jika ada):
        // const printContent = document.getElementById('orders-list').innerHTML; // Ambil semua konten pesanan
        // window.location.href = `thermer://print?data=${encodeURIComponent(printContent)}`;
        // Anda perlu memastikan format data yang dikirim sesuai dengan yang diharapkan Thermer.
    });
}


// Ensure fetchUnprintedOrders and setInterval run after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchUnprintedOrders(); // Initial fetch when page loads
    // Refresh setiap 30 detik untuk pesanan baru
    setInterval(fetchUnprintedOrders, 30000);
});
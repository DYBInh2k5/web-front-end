// cart.js
const STORAGE_KEY = 'cart';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addBtn').addEventListener('click', handleAdd);
  document.getElementById('clearBtn').addEventListener('click', clearCart);
  renderCart(); // hiển thị nếu đã có dữ liệu session
});

function getCart() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function handleAdd(e) {
  e.preventDefault();
  const id = document.getElementById('productId').value.trim();
  const name = document.getElementById('productName').value.trim();
  const qtyRaw = document.getElementById('productQty').value;
  const priceRaw = document.getElementById('productPrice').value;

  // Validation cơ bản
  if (!id || !name) {
    alert('Vui lòng nhập Mã và Tên sản phẩm.');
    return;
  }
  const qty = parseInt(qtyRaw, 10);
  const price = parseFloat(priceRaw);
  if (isNaN(qty) || qty <= 0) {
    alert('Số lượng phải là số >= 1');
    return;
  }
  if (isNaN(price) || price < 0) {
    alert('Giá phải là số >= 0');
    return;
  }

  addToCart({ id, name, qty, price });
  // Tự động reset quantity về 1 nếu muốn:
  document.getElementById('productQty').value = 1;
}

function addToCart(item) {
  const cart = getCart();
  // Nếu đã có sản phẩm cùng mã, gộp số lượng
  const idx = cart.findIndex(p => p.id === item.id);
  if (idx >= 0) {
    cart[idx].qty = Number(cart[idx].qty) + Number(item.qty);
  } else {
    // lưu thông tin cần thiết
    cart.push({
      id: item.id,
      name: item.name,
      qty: Number(item.qty),
      price: Number(item.price)
    });
  }
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = getCart();
  const tbody = document.querySelector('#cartTable tbody');
  tbody.innerHTML = '';

  let totalQty = 0;
  let totalPrice = 0;

  cart.forEach(product => {
    const row = document.createElement('tr');

    const subtotal = product.qty * product.price;
    totalQty += product.qty;
    totalPrice += subtotal;

    row.innerHTML = `
      <td>${escapeHtml(product.id)}</td>
      <td>${escapeHtml(product.name)}</td>
      <td>${product.qty}</td>
      <td>${formatNum(product.price)}</td>
      <td>${formatNum(subtotal)}</td>
      <td><button data-id="${product.id}" class="remove-btn">Xóa</button></td>
    `;
    tbody.appendChild(row);
  });

  // gắn sự kiện xóa
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      removeItem(id);
    });
  });

  document.getElementById('totalItems').textContent = totalQty;
  document.getElementById('totalPrice').textContent = formatNum(totalPrice);
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(p => p.id !== id);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  if (!confirm('Bạn có muốn xóa toàn bộ giỏ hàng?')) return;
  sessionStorage.removeItem(STORAGE_KEY);
  renderCart();
}

// Helpers
function formatNum(n) {
  // Hiển thị số dạng 1,234.56 (tuỳ bạn chỉnh locale)
  return Number(n).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
}

function escapeHtml(txt) {
  return String(txt)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

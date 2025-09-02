// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Add to cart function
function addToCart(productId, name, price, image) {
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, name, price: parseFloat(price), image, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  renderCartItems && renderCartItems();
  showCartNotification();
}

// Update cart display (cart badge and totals)
function updateCartDisplay() {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');
  if (countEl) countEl.textContent = cartCount;
  if (totalEl) totalEl.textContent = cartTotal.toFixed(2);
  // Persist total for checkout convenience
  localStorage.setItem('cart-total', cartTotal.toFixed(2));
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  if (typeof renderCartItems === 'function') renderCartItems();
}

// Shopping cart notification (as required)
function showCartNotification() {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50 transform translate-x-full transition-transform duration-300';
  notification.textContent = 'Item added to cart!';
  document.body.appendChild(notification);
  setTimeout(() => notification.classList.remove('translate-x-full'), 100);
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 2000);
}

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenu) return;
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden', isOpen);
  document.getElementById('hamburger-icon').classList.toggle('hidden', !isOpen);
  document.getElementById('close-icon').classList.toggle('hidden', isOpen);
}

// Scroll reveal (simple, CSS-based)
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => {
    el.classList.add('opacity-0', 'translate-y-8');
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
}

// Render cart items into cart page (standalone function to be used by cart.html)
function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p class="text-gray-600">Your cart is empty. Add grooming, daycare, or training services to begin.</p>';
    document.getElementById('checkout-total')?.textContent = '0.00';
    return;
  }
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between p-3 border-b';
    row.innerHTML = `<div class='flex items-center gap-3'>
      <img src='${item.image}' alt='${item.name}' class='w-12 h-12 object-cover rounded'/>
      <div>
        <div class='font-bold text-gray-800'>${item.name}</div>
        <div class='text-sm text-gray-600'>$${item.price.toFixed(2)} • qty ${item.quantity}</div>
      </div>
    </div>
    <button class='text-sm text-white bg-red-500 px-3 py-1 rounded' onclick="removeFromCart('${item.id}')">Remove</button>`;
    container.appendChild(row);
  });
  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = total.toFixed(2);
}

// Initialize page features
function initPage() {
  updateCartDisplay();
  initScrollReveal();
  renderCartItems();
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');
      const image = btn.getAttribute('data-image');
      addToCart(id, name, price, image);
    });
  });
}

document.addEventListener('DOMContentLoaded', initPage);

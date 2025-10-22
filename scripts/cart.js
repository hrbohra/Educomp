import PRODUCTS from './products.js';

// Use TEST key - NEVER put live keys in client code!
const stripe = Stripe('pk_test_51SGQyDK59urnrzfrWpJVkPiRegZKOf9EgwVFg8xqTA9WdDCiS6koqdlSbcu1BvufRMtiHZQKKNBACDjYIYOHZtoT00zaqV1pMX');

// --- Helper functions ---
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('Educomp_cart') || '[]');
  } catch (e) {
    console.error('Error reading cart:', e);
    return [];
  }
}

function setCart(cart) {
  try {
    localStorage.setItem('Educomp_cart', JSON.stringify(cart));
    renderCart();
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

function updateCartCount() {
  const totalQty = getCart().reduce((sum, item) => sum + item.qty, 0);
  try {
    localStorage.setItem('Educomp_cart_count', totalQty);
  } catch (e) {}
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.textContent = totalQty;
}

function formatPrice(p) {
  return '£' + p.toFixed(2);
}

// --- DOM Elements ---
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Set year
const yearEl = document.getElementById('year2');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// --- Render Cart ---
function renderCart() {
  const cart = getCart();
  
  if (!cartItemsEl || !cartTotalEl) {
    console.error('Cart elements not found');
    return;
  }
  
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px">Your cart is empty. Start learning today!</p>';
    cartTotalEl.textContent = formatPrice(0);
    if(checkoutBtn) checkoutBtn.disabled = true;
    updateCartCount();
    return;
  }

  if(checkoutBtn) checkoutBtn.disabled = false;

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1">
        <div style="font-weight:700;font-size:1.1rem">${item.name}</div>
        <div class="muted">Price: ${formatPrice(item.price)}</div>
      </div>
      <div class="qty-controls">
        <button class="btn dec" data-id="${item.id}">-</button>
        <div style="min-width:30px;text-align:center">${item.qty}</div>
        <button class="btn add" data-id="${item.id}">+</button>
        <button class="btn alt remove" data-id="${item.id}">Remove</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotalEl.textContent = formatPrice(total);
  updateCartCount();
}

// --- Quantity and Remove Handlers ---
if(cartItemsEl) {
  cartItemsEl.addEventListener('click', e => {
    const target = e.target;
    const id = target.dataset.id ? Number(target.dataset.id) : null;
    if (id === null) return;

    const cart = getCart();
    const idx = cart.findIndex(i => i.id === id);
    if (idx === -1) return;

    if (target.matches('button.add')) cart[idx].qty++;
    if (target.matches('button.dec')) cart[idx].qty = Math.max(1, cart[idx].qty - 1);
    if (target.matches('button.remove')) cart.splice(idx, 1);

    setCart(cart);
  });
}

// --- Checkout Handler ---
if(checkoutBtn) {
  checkoutBtn.addEventListener('click', async () => {
    const cart = getCart();
    if (cart.length === 0) { 
      alert('Your cart is empty.'); 
      return; 
    }

    // Disable button during processing
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Processing...';

    try {
      const resp = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      });

      if (!resp.ok) {
        const text = await resp.text();
        alert('Server error creating session: ' + text);
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Proceed to Checkout';
        return;
      }

      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Server did not return a Checkout URL. Check logs.');
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Proceed to Checkout';
      }
    } catch (err) {
      console.error(err);
      alert('Could not reach checkout endpoint. Check deployment.');
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = 'Proceed to Checkout';
    }
  });
}

// --- Continue Shopping Handler ---
const continueBtn = document.getElementById('continue-shopping');
if (continueBtn) {
  continueBtn.addEventListener('click', () => {
    window.location.href = '../';
  });
}

// --- Initial Render ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCount();
  });
} else {
  renderCart();
  updateCartCount();
}
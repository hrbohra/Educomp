import PRODUCTS from './products.js';

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get('id'));
const product = PRODUCTS.find(p => p.id === productId);

// Update year and cart count
document.getElementById('year').textContent = new Date().getFullYear();
const cartCountEl = document.getElementById('cart-count');

function getCart(){ return JSON.parse(localStorage.getItem('GearStrength_cart') || '[]'); }
function setCart(cart){ localStorage.setItem('GearStrength_cart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){ 
  const cart = getCart(); 
  const totalQty = cart.reduce((s,i)=>s+i.qty,0); 
  cartCountEl.textContent = totalQty; 
}

updateCartCount();

function formatPrice(p){ return '£' + p.toFixed(2); }

// If product not found, redirect to home
if (!product) {
  window.location.href = '../';
}

// Render product detail
const contentEl = document.getElementById('product-content');
contentEl.innerHTML = `
  <div class="product-image-section">
    <img src="${product.image}" alt="${product.name}" class="product-detail-image">
    ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
  </div>
  
  <div class="product-info-section">
    <h1 class="product-title">${product.name}</h1>
    <div class="product-price">${formatPrice(product.price)}</div>
    
    <div class="product-description">
      <h3>Product Details</h3>
      <p>${product.description.trim()}</p>
    </div>
    
    <div class="product-actions">
      <button class="btn primary large add-to-cart-btn" data-id="${product.id}">
        <span>Add to Cart</span>
      </button>
     <button class="btn secondary large back-btn">
    <span>Back</span>
  </button>
    </div>
    
    <div class="product-meta">
      <p class="meta-item">✓ Fast & secure checkout</p>
      <p class="meta-item">✓ Quality guaranteed</p>
      <p class="meta-item">✓ Customer support available</p>
    </div>
  </div>
`;

// Add to cart functionality
const addBtn = document.querySelector('.add-to-cart-btn');
addBtn.addEventListener('click', () => {
  const cart = getCart();
  const found = cart.find(i => i.id === product.id);
  
  if (found) {
    found.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }
  
  setCart(cart);
  
  // Visual feedback
  const span = addBtn.querySelector('span');
  const originalText = span.textContent;
  span.textContent = 'Added ✓';
  addBtn.style.background = '#10b981';
  
  setTimeout(() => {
    span.textContent = originalText;
    addBtn.style.background = '';
  }, 1000);
});

// Back button functionality
const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', () => {
  window.history.back();
});

// Animation
document.querySelector('.product-detail-image').animate(
  [{opacity:0, transform:'scale(0.95)'},{opacity:1, transform:'scale(1)'}], 
  {duration:500, easing:'cubic-bezier(.2,.9,.3,1)'}
);
document.querySelector('.product-info-section').animate(
  [{opacity:0, transform:'translateY(20px)'},{opacity:1, transform:'translateY(0)'}], 
  {duration:600, delay:100, easing:'cubic-bezier(.2,.9,.3,1)'}
);
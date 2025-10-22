import PRODUCTS from './products.js';

// Update year and cart count
document.getElementById('year').textContent = new Date().getFullYear();
const cartCountEl = document.getElementById('cart-count');

function getCart(){
  return JSON.parse(localStorage.getItem('GearStrength_cart') || '[]');
}
function setCart(cart){ localStorage.setItem('GearStrength_cart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){ const cart = getCart(); const totalQty = cart.reduce((s,i)=>s+i.qty,0); cartCountEl.textContent = totalQty; }

updateCartCount();

const grid = document.getElementById('products-grid');

function formatPrice(p){ return '£' + p.toFixed(2); }

PRODUCTS.forEach(p => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <a href="pages/product.html?id=${p.id}" class="product-link">
      <img loading="lazy" src="${p.image}" alt="${p.name}">
    </a>
    <div class="card-body">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <a href="pages/product.html?id=${p.id}" class="title-link">
          <div class="title">${p.name}</div>
        </a>
        ${p.badge ? `<div class="badge">${p.badge}</div>` : ''}
      </div>
      <div class="desc">${p.description.trim().slice(0,140)}...</div>
      <div class="price-row">
        <div class="price">${formatPrice(p.price)}</div>
        <div>
          <button class="btn add" data-id="${p.id}">Add</button>
          <a class="btn" href="pages/product.html?id=${p.id}">Details</a>
        </div>
      </div>
    </div>
  `;
  grid.appendChild(card);
});

grid.addEventListener('click', (e)=>{
  if(e.target.matches('button.add')){
    const id = Number(e.target.dataset.id);
    const prod = PRODUCTS.find(x=>x.id===id);
    const cart = getCart();
    const found = cart.find(i=>i.id===id);
    if(found) found.qty++;
    else cart.push({id:prod.id, name:prod.name, price:prod.price, image:prod.image, qty:1});
    setCart(cart);
    e.target.textContent = 'Added ✓';
    setTimeout(()=>e.target.textContent='Add',600);
  }
});

// small animation for hero
document.querySelector('.hero h1').animate([{opacity:0, transform:'translateY(10px)'},{opacity:1, transform:'translateY(0)'}], {duration:700, easing:'cubic-bezier(.2,.9,.3,1)'});
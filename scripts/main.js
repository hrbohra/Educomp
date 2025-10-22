import PRODUCTS from './products.js';

// Update year and cart count
document.getElementById('year').textContent = new Date().getFullYear();
const cartCountEl = document.getElementById('cart-count');

function getCart(){
  return JSON.parse(localStorage.getItem('Educomp_cart') || '[]');
}
function setCart(cart){ 
  localStorage.setItem('Educomp_cart', JSON.stringify(cart)); 
  updateCartCount(); 
}
function updateCartCount(){ 
  const cart = getCart(); 
  const totalQty = cart.reduce((s,i)=>s+i.qty,0); 
  cartCountEl.textContent = totalQty; 
}

updateCartCount();

const grid = document.getElementById('product-list');

function formatPrice(p){ return '£' + p.toFixed(2); }

PRODUCTS.forEach(p => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="product-image-wrapper">
      <img loading="lazy" src="${p.image}" alt="${p.name}">
      ${p.badge ? `<div class="badge">${p.badge}</div>` : ''}
    </div>
    <div class="card-body">
      <div class="title">${p.name}</div>
      <div class="desc">${p.description.trim().slice(0,120)}...</div>
      <div class="price-row">
        <div class="price">${formatPrice(p.price)}</div>
        <button class="btn primary add" data-id="${p.id}">Enrol Now</button>
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
    setTimeout(()=>e.target.textContent='Enrol Now',800);
  }
});

// Hero animation
const heroTitle = document.querySelector('.hero h2');
if(heroTitle) {
  heroTitle.animate(
    [{opacity:0, transform:'translateY(10px)'},{opacity:1, transform:'translateY(0)'}], 
    {duration:700, easing:'cubic-bezier(.2,.9,.3,1)'}
  );
}
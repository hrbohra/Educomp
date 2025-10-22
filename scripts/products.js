const products = [
  {
    id: 1,
    name: "AI Fundamentals",
    price: 79,
    description: "Learn the foundations of Artificial Intelligence — machine learning, neural networks and data ethics.",
    image: "../assets/ai-course.jpg"
  },
  {
    id: 2,
    name: "Python for Beginners",
    price: 59,
    description: "A practical introduction to Python programming — ideal for beginners wanting to start coding.",
    image: "../assets/python-course.jpg"
  },
  {
    id: 3,
    name: "Web Development Bootcamp",
    price: 99,
    description: "Master HTML, CSS and JavaScript to build responsive, modern websites from scratch.",
    image: "../assets/webdev-course.jpg"
  }
];

const productList = document.getElementById("product-list");

if (productList) {
  products.forEach(product => {
    const item = document.createElement("div");
    item.className = "product";
    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>£${product.price}</p>
      <button onclick="addToCart(${product.id})">Enrol Now</button>
    `;
    productList.appendChild(item);
  });
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find(p => p.id === id);
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} added to your courses.`);
}

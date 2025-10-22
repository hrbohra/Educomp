// api/create-checkout-session.js
const Stripe = require('stripe');

// ✅ Server-side course catalog (prices in GBP → converted to pence)
const PRODUCTS = [
  {
    id: 1,
    name: "AI Fundamentals",
    price: 79, // GBP
    description: "Learn the foundations of Artificial Intelligence — machine learning, neural networks and data ethics. Perfect for beginners wanting to understand how AI works and its real-world applications.",
    image: "https://placehold.co/600x400/1a1a1a/ff6b00?text=AI+Fundamentals",
    badge: "Popular",
    currency: "gbp"
  },
  {
    id: 2,
    name: "Python for Beginners",
    price: 59,
    description: "A practical introduction to Python programming — ideal for beginners wanting to start coding. Learn variables, functions, loops, and build real projects from day one.",
    image: "https://placehold.co/600x400/1a1a1a/ff6b00?text=Python+Course",
    badge: "Best Value",
    currency: "gbp"
  },
  {
    id: 3,
    name: "Web Development Bootcamp",
    price: 99,
    description: "Master HTML, CSS and JavaScript to build responsive, modern websites from scratch. Includes hands-on projects and real portfolio pieces you can showcase to employers.",
    image: "https://placehold.co/600x400/1a1a1a/ff6b00?text=Web+Development",
    badge: "New",
    currency: "gbp"
  }
];

module.exports = async (req, res) => {
  // ✅ Enable CORS (same as version 1)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ✅ Ensure Stripe key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not configured in environment');
    }

    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    // ✅ Securely map client cart items to server product catalog
    const line_items = items.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) {
        throw new Error(`Invalid product ID: ${item.id}`);
      }

      return {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
            images: [product.image]
          },
          unit_amount: Math.round(product.price * 100) // Convert GBP → pence
        },
        quantity: item.qty || 1
      };
    });

    // ✅ Determine origin (for redirect URLs)
    const origin =
      req.headers.origin ||
      req.headers.referer?.replace(/\/$/, '') ||
      `https://${req.headers.host}`;

    // ✅ Create Stripe Checkout Session (digital products — no shipping)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      success_url: `${origin}/pages/success.html`,
      cancel_url: `${origin}/pages/cancel.html`
    });

    // ✅ Return session URL
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

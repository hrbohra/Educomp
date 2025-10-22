const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map(item => ({
          price_data: {
            currency: "gbp",
            product_data: {
              name: item.name,
              description: "Online course enrolment"
            },
            unit_amount: item.price * 100,
          },
          quantity: 1,
        })),
        success_url: `${req.headers.origin}/pages/success.html`,
        cancel_url: `${req.headers.origin}/pages/cancel.html`,
      });

      res.status(200).json({ url: session.url });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

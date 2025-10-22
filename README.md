
# 🏍️ GearStrength - Kevlar Infused Performance Gear

A modern, full-featured e-commerce site for motorcycle protective gear with integrated Stripe checkout.

![GearStrength](https://img.shields.io/badge/Stripe-Enabled-blue) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🛒 **Shopping Cart** - Add/remove items, adjust quantities
- 💳 **Stripe Checkout** - Secure payment processing
- 📱 **Responsive Design** - Mobile-first, works on all devices
- ⚡ **Serverless** - No database required, deploys to Vercel
- 🎨 **Modern UI** - Dark theme optimized for motorcycle gear
- 🔒 **Secure** - Client-side cart, server-side validation

## Folder structure
```
pawtrove-static-site/
  assets/             # (optional) images or fonts you add
  scripts/
    products.js       # your provided product data (already integrated)
    main.js           # homepage product rendering + add-to-cart
    cart.js           # cart page logic and Stripe integration hooks
  styles/
    styles.css
  pages/
    cart.html
    about.html
    success.html
    cancel.html
  server/
    server.js         # example Node/Express server (use for real Stripe Checkout)
  index.html
  README.md
```



## Deploying the server (example)
1. Create a project on Vercel/Heroku/Render or run locally with Node 18+.
2. Set environment variables `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
3. Run `node server/server.js` (or follow your provider's instructions).
4. Ensure your site calls the server's `/create-checkout-session` endpoint (adjust fetch URL if hosted under a different domain).

## Order receipt & owner notification
- Stripe will send email receipts to customers when `customer_email`/receipt email is provided in the Checkout Session (handled server-side).
- The included server webhook shows where you would parse the session and send an email to both customer and owner using your email provider (SendGrid, Amazon SES, etc.).



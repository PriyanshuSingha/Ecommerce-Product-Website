# NovaMarket — React E-Commerce Storefront

A complete, production-ready e-commerce front end built with **React 18 + Vite**,
**Tailwind CSS**, **React Router**, **Axios**, and the **Context API**. Product
data comes live from the [Fake Store API](https://fakestoreapi.com).

## Getting started

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

## Design identity

The storefront's signature visual motif is a torn-ticket / price-tag
**perforation line** (see `.perforation` in `src/index.css`) that separates
product imagery from pricing throughout the app, echoing the coupon-first
concept. Typography pairs **Space Grotesk** (display), **Inter** (body), and
**IBM Plex Mono** (prices & coupon codes, receipt-style). Brand colors are a
deep indigo ink (`ink-*`) with a warm marigold accent (`marigold-*`), defined
as CSS-variable-friendly Tailwind tokens in `tailwind.config.js`.

## Feature highlights

- **Catalog** — live data from `GET /products`, with category browsing,
  keyword search, and five sort modes (price, rating, name).
- **Coupons** — every product is deterministically assigned its own coupon
  code (`src/utils/coupons.js`), applied per line item in both the product
  page and the cart, with live discount math.
- **Cart & Wishlist** — persisted to `localStorage`, with quantity controls,
  a live navbar counter, and per-line coupon application.
- **Checkout** — customer info, shipping address, and payment method
  (Credit Card / UPI / Cash on Delivery) with client-side validation, backed
  by an in-memory order history (`Orders` page).
- **Theming** — light/dark mode toggle, persisted and OS-preference aware.
- **Resilience** — skeleton loaders while fetching, a dedicated error state
  with retry, and a 404 page for unmatched routes.

## Project structure

```
src/
├── api/            Axios client + Fake Store API calls
├── components/     Reusable UI (Navbar, Footer, ProductCard, CouponBox, …)
├── context/         Product / Cart / Wishlist / Theme providers
├── pages/           One file per route
├── routes/          <AppRoutes /> route table
├── utils/            Coupon logic, formatting, localStorage helpers
├── App.jsx
└── main.jsx
```

## Notes on the API

The Fake Store API returns a single image per product, so the product-detail
gallery treats that image as the hero and reuses it for thumbnails while
adding a real hover-to-zoom interaction — see `ProductDetails.jsx`. Prices
returned by the API are shown as the "current" price; a synthetic 25% higher
"original" price is derived in `utils/format.js` to drive the strike-through
+ discount badge treatment used across the UI.

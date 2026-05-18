# Shoply — Next.js E-Commerce App

A complete, modern e-commerce storefront built with **Next.js 15** (App Router) and **Tailwind CSS v4**.

## Features

| Area | Details |
|---|---|
| Homepage | Hero banner, featured products, category grid, promo CTA |
| Product Listing | Filter by category, sort by price / rating / reviews |
| Product Detail | Image, description, quantity selector, add-to-cart, related products |
| Shopping Cart | Persistent cart (localStorage via Zustand), order summary, free shipping threshold |
| Checkout Flow | 4-step wizard — Contact → Shipping → Payment → Review → Confirmation |
| Admin Panel | Product table with create / edit / delete (in-memory, resets on reload) |

## Stack

- **Next.js 15** — App Router, Server Components
- **Tailwind CSS v4**
- **Zustand** — cart state (persisted) + admin state
- **Lucide React** — icons
- **Unsplash** — demo product images (remote, no API key needed)

## Setup & Run

```bash
# Enter the project directory
cd shop

# Install dependencies (already done if you ran the scaffold)
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| URL | Page |
|---|---|
| `/` | Homepage |
| `/products` | Product listing grid |
| `/products?category=Electronics` | Filtered listing |
| `/products/[id]` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | 4-step checkout |
| `/checkout/success` | Order confirmation |
| `/admin` | Product management |

## Notes

- Cart persists across page reloads via `localStorage`.
- Admin changes are **in-memory** only — refreshing the page resets to seed data.
- Checkout is fully simulated — no real payments or emails.
- No database or backend required.

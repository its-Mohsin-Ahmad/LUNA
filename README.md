# LUNA — Shop Better. Live Better. Discover More.

A premium international e-commerce marketplace demo built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

**Live:** https://its-Mohsin-Ahmad.github.io/LUNA/

## Highlights

- **Catalogue** — 199 products across 14 categories, 90+ subcategories and 173 brands, with faceted filtering, sorting, price ranges and URL-synced filter state
- **Storefront** — home sections (hero carousel, flash sale, category rails), shop browser, product detail with gallery/quick view, compare, wishlist, deals, new arrivals, brand & subcategory pages, instant search with suggestions
- **Commerce flow** — cart drawer + cart page, coupon codes, multi-step checkout, order confirmation, order tracking
- **Accounts** — sign-up, login, email verification, forgot/reset password (demo mode), profile, orders, wishlist, addresses, activity & alerts, settings (currency, language, motion, data controls)
- **Role dashboards** — customer, vendor, salesman and admin workspaces with role guarding, tables, KPIs and charts
- **Preferences** — multi-currency conversion, wishlist, toasts, responsive chrome (mega menu, mobile nav, bottom bar)

All data is client-side demo data persisted to `localStorage` — no backend required.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production server build |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run check:data` | Validate product/brand/category data |
| `NEXT_OUTPUT=export NEXT_BASE_PATH=/LUNA npm run build` | Static export for GitHub Pages → `out/` |

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@luna.shop` | `Admin123` |
| Salesman | `sales@luna.shop` | `Sales123` |
| Vendor | `vendor@luna.shop` | `Vendor123` |
| Customer | `customer@luna.shop` | `Customer123` |

## Deployment (GitHub Pages)

The site is deployed as a **static export published to the `gh-pages` branch**. GitHub Pages serves it at https://its-Mohsin-Ahmad.github.io/LUNA/ with `basePath: /LUNA`.

To redeploy after changes:

```bash
NEXT_OUTPUT=export NEXT_BASE_PATH=/LUNA npm run build
touch out/.nojekyll

# Publish out/ as the gh-pages branch:
cd out
git init && git checkout -b gh-pages
git add . && git commit -m "deploy"
git push https://github.com/its-Mohsin-Ahmad/LUNA.git gh-pages --force
```

In the repository settings, GitHub Pages is configured to deploy from the `gh-pages` branch root.

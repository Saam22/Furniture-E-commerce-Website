# الأثاث العصري — Modern Furniture

An Arabic RTL furniture e-commerce single-page application built with React 19 + Vite. All data is client-side with localStorage persistence — no backend required.

## Features

- **Product Gallery** — Multi-angle thumbnails, zoom overlay, environment context (living room / office / bedroom / dining), keyboard navigation
- **Reviews & Ratings** — Star rating input, image upload (base64), rating distribution chart, sortable reviews, filter products by minimum rating
- **Furniture Bundles** — Complete room sets with 18–25% discount, customizable item selection, live pricing
- **Loyalty Program** — Points per order (10 EGP = 1 pt), redeem for discount (1 pt = 2 EGP, min 100 pts), tier progress (Bronze → Platinum), birthday month 2× points, referral codes
- **Cart & Checkout** — Quantity controls, delivery zones + cities, coupon codes, loyalty discounts, points redemption, savings breakdown
- **Order Tracking** — Timeline with step-by-step status per order
- **Wishlist** — Save products, share via URL, bulk add to cart
- **Product Comparison** — Compare up to 4 products side-by-side with best-value highlighting
- **Chair Designer** — Customize chair material, legs, cushion, color with live 3D preview (CSS 3D transforms)
- **Virtual Room Designer** — Drag products onto a grid to design a room layout
- **Offers Page** — Dedicated page for active promotions and discounted products
- **Dark Mode** — Full theme with CSS custom properties, persisted preference
- **Responsive** — Breakpoints at 980, 920, 860, 768, 640, 620, 600, 520, 480, 420px
- **Arabic RTL** — Full Arabic interface with right-to-left layout
- **Animations** — Framer Motion + CSS transitions for smooth interactions

## Tech Stack

- **React 19** — Components, hooks, context
- **Vite 8** — Build tool with fast HMR
- **CSS** — Plain CSS with custom properties for theming, no frameworks
- **localStorage** — All persistence (cart, orders, wishlist, compare, reviews, points)
- **Framer Motion** — Page transitions and animations
- **Unsplash** — Product and hero images via CDN

## Getting Started

```bash
npm install
npm run dev
```


## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── Products.jsx
│   ├── ProductCard.jsx
│   ├── Cart.jsx
│   ├── BundlesSection.jsx
│   ├── OffersPage.jsx
│   ├── ProductGallery.jsx
│   ├── ReviewForm.jsx / ReviewList.jsx / RatingFilter.jsx
│   ├── LoyaltyDashboard.jsx
│   ├── CompareSlideout.jsx / WishlistSlideout.jsx
│   ├── ChairDesigner.jsx / VirtualRoom.jsx
│   ├── OrderTracking.jsx / DeliverySection.jsx / DiscountSection.jsx
│   └── ...
├── data/             # Static data + localStorage helpers
│   ├── productsData.js
│   ├── bundlesData.js
│   ├── discountsData.js
│   ├── productGallery.js
│   ├── reviewsData.js
│   └── loyaltyData.js
├── utils/            # Business logic
│   ├── discountUtils.js
│   ├── shippingUtils.js
│   └── ...
├── styles/           # CSS files (one per component)
│   ├── Navbar.css / Hero.css / Products.css / Cart.css / ...
│   ├── Bundles.css / OffersPage.css
│   ├── Reviews.css / ProductGallery.css
│   ├── LoyaltyDashboard.css / Compare.css / Wishlist.css
│   ├── VirtualRoom.css / ChairDesigner.css
│   └── animations.css
├── App.jsx           # Root component — routing + state
├── App.css           # Global styles, variables, dark mode
└── main.jsx          # Entry point
```

## Data Flow

All state lives in `App.jsx` with `useState` hooks. Data is persisted to `localStorage` on every change via `useEffect`. Components receive data and callbacks as props — no global state library needed.

- **cart**, **orders**, **wishlist**, **compareIds** → persisted as JSON arrays
- **reviews** → persisted in `reviewsData.js` with `localStorage` CRUD
- **points**, **birthday**, **referrals** → persisted in `loyaltyData.js`
- **theme** → persisted as `'dark'` / `'light'`

## License

MIT

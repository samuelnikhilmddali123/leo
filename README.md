# LEO — Luxury Modern Clothing & Fashion Atelier

> *"Defined by Power & Precision."*

LEO is a production-grade, full-stack luxury fashion e-commerce web application crafted with high-end editorial aesthetics, architectural tailoring, pure Mulberry silk, and Italian double-faced cashmere presentations.

---

## 🏛️ Brand & Visual Direction

- **Brand Personality**: Luxury, Editorial, Minimalist, Confident, Architectural.
- **Color Palette**:
  - Deep Obsidian: `#0A0A0A`
  - Warm Paper White: `#F7F5F0`
  - Champagne Gold Accent: `#C5A880`
  - Alabaster Background: `#FAF9F5`
  - Hairline Stone Borders: `#E8E5DF`
- **Typography Hierarchy**:
  - Editorial Serifs: *Cormorant Garamond* & *Playfair Display*
  - Clean UI Sans: *Plus Jakarta Sans*

---

## ⚡ Technology Stack

### Frontend
- **Framework**: React.js 18 with Vite
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
- **Animations**: Framer Motion (page transitions, parallax hero, drawer slide-overs)
- **Icons**: Lucide React
- **Analytics & Graphs**: Recharts
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with JWT interceptors
- **Celebration Effects**: Canvas Confetti

### Backend
- **Server**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB & Mongoose
- **Zero-Friction In-Memory Fallback**: Built-in `mongodb-memory-server` fallback when no local MongoDB daemon is running
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password encryption
- **Payment Processing**: Razorpay Gateway (UPI, Cards, Net Banking) + Cash on Delivery (COD) + Test Sandbox
- **Media Storage**: Static upload engine with Cloudinary integration
- **Security**: Express rate limiting, CORS headers, environment isolation

---

## ✨ Complete Feature Matrix

### 1. Storefront & Customer Experience
- **Cinematic Hero**: Full-viewport parallax hero with "THE NEW STANDARD" headline, Autumn/Winter release tag, and dual department actions (Shop Men / Shop Women).
- **Asymmetric Collections**: Editorial storytelling layouts with lookbook imagery and seasonal background stories.
- **Taxonomy Categories**: 8 category cards (Outerwear, Tailored Shirts, Trousers, Knitwear, Dresses, T-Shirts & Polos, Accessories, Tailored Suits) with smooth hover zoom.
- **Interactive Product Discovery**:
  - Dynamic image hover swap to secondary product angle.
  - Quick Add modal with instant size and colorway selection without leaving the page.
  - Faceted filters (Department, Categories, Collections, Sizes, Colors, Price Range slider, In-Stock only).
  - Multi-column grid switcher (2, 3, or 4 columns).
- **Product Details Page**:
  - Vertical image thumbnails with high-res active viewport.
  - Interactive Size Guide modal with inches (`in`) and centimeters (`cm`) unit toggle.
  - Color swatches with live selection.
  - Customer review summary, rating breakdowns, and review submission modal.
  - Related pairings and Recently Viewed local history carousel.
- **Slide-Over Cart Drawer & Full Bag**:
  - Dynamic free delivery progress bar (Threshold: ₹2,999).
  - Promo code validation (`LEO10`, `LUXE20`, `FIRST500`, `VIP25`).
  - Item quantity modifiers, live GST calculation, and animated badges.
- **Distraction-Free Multi-Step Checkout**:
  - Step 1: Contact details & saved address selector.
  - Step 2: Delivery speed & courier options.
  - Step 3: Razorpay secure checkout / Cash on Delivery.
  - Order confirmation receipt with celebratory gold confetti.
- **Live Consignment Tracking**:
  - Interactive order status progression timeline (`Placed` → `Confirmed` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`) with timestamped activity logs.
- **Full-Screen Search Overlay**:
  - Live debounced search as you type.
  - Trending search keyword tags.
- **Customer Account Portal**:
  - Order history with item breakdown and invoice status.
  - Address book with primary default tags.
  - Profile settings and password updater.
  - Persistent Wishlist with instant Move-to-Bag.

### 2. Administrative Suite (`/admin`)
- **Executive Dashboard**:
  - Real-time KPIs (Gross Revenue, Total Consignments, Average Order Value, Registered Clients).
  - Recharts revenue trend area graphs and category proportion pie charts.
  - Recent orders table and low-stock warnings.
- **Product Catalog Management**:
  - Full CRUD operations with rich attributes (material, care, features, tags, department).
  - Multi-variant size & color stock matrix.
  - Image URL manager with instant previews.
- **Order & Consignment Processing**:
  - Update status pipeline and attach courier tracking identifiers (`BlueDart Express Luxury`).
- **Inventory Matrix**:
  - Inline variant stock manager with instant updates.
- **Taxonomy Manager**:
  - Add & edit Categories and Lookbook Collections with campaign cover images.
- **Promotion & Coupon Builder**:
  - Percentage or flat discounts, minimum order spend, and validity dates.
- **Homepage Banner Manager**:
  - Reorder and configure hero campaigns and call-to-action destinations.
- **Review Moderation**:
  - Approve or hide customer ratings and fit evaluations.
- **Client Registry**:
  - Track customer order counts and lifetime spend.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Path |
|---|---|---|---|
| **Administrator** | `admin@leo.com` | `Admin@12345` | `/admin/login` or `/admin` |
| **VIP Customer** | `customer@leo.com` | `Customer@12345` | `/login` or `/account/orders` |

### Available Sample Coupons:
- `LEO10` — 10% privilege discount on orders above ₹4,999
- `LUXE20` — 20% release discount on orders above ₹9,999
- `FIRST500` — Flat ₹500 welcome discount on orders above ₹2,999
- `VIP25` — 25% VIP Atelier discount on orders above ₹15,000

---

## 🚀 Installation & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/konapalask/fashion.git
cd fashion

# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Environment Variables
Create a `.env` file in the `/server` directory (or use default values):
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/leo
JWT_SECRET=leo_jwt_luxury_secret_key_2026_super_secure
RAZORPAY_KEY_ID=rzp_test_leo_luxury
RAZORPAY_KEY_SECRET=leo_luxury_secret_mock_key
```

### 3. Seed Database (32 Luxury Garments, 8 Categories, 5 Collections, 20 Orders)
```bash
npm run seed
```

### 4. Run Development Servers
```bash
# Starts both Express API on port 5001 and Vite React on port 5173 concurrently
npm run dev
```

Visit the application at:
- **Storefront**: [http://localhost:5173](http://localhost:5173)
- **Admin Atelier**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 📦 Production Build
```bash
npm run build
```

---

## 📁 Repository Structure

```
fashion/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── animations/
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Icons.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── QuickAddModal.jsx
│   │   │   ├── ReviewModal.jsx
│   │   │   ├── SearchModal.jsx
│   │   │   ├── SizeGuideModal.jsx
│   │   │   └── SkeletonLoader.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── ToastContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardPage.jsx
│   │   │   │   ├── AdminInventoryPage.jsx
│   │   │   │   ├── AdminLoginPage.jsx
│   │   │   │   ├── AdminMarketingPages.jsx
│   │   │   │   ├── AdminModerationPages.jsx
│   │   │   │   ├── AdminOrdersPage.jsx
│   │   │   │   ├── AdminProductForm.jsx
│   │   │   │   ├── AdminProductsPage.jsx
│   │   │   │   └── AdminTaxonomyPages.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── AuthPages.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── CollectionsPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── CustomerAccount.jsx
│   │   │   ├── FAQPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── OrderSuccessPage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── StaticPages.jsx
│   │   │   ├── TrackOrderPage.jsx
│   │   │   └── WishlistPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── bannerController.js
│   │   ├── categoryController.js
│   │   ├── collectionController.js
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Banner.js
│   │   ├── Category.js
│   │   ├── Collection.js
│   │   ├── Coupon.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bannerRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── collectionRoutes.js
│   │   ├── couponRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   ├── seeder.js
│   └── server.js
├── .gitignore
├── package.json
└── README.md
```

---

## 📜 License
© 2026 LEO Atelier. All Rights Reserved. Crafted for high-altitude elegance.

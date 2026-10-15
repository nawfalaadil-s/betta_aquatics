# BETTA AQUATICS — ULTIMATE E-COMMERCE PLATFORM
## Premium Mobile-First Storefront + Amazon/Flipkart-Style Shopping + Complete Visual CMS & Admin Operations

**Betta Aquatics** is an enterprise-grade, mobile-first e-commerce platform designed specifically for the luxury ornamental fish, rare Betta breeding, and aquascaping market in India. It unites the speed, high-conversion discovery, and dependability of Amazon & Flipkart with the sophisticated aesthetics of high-end boutique aquaculture.

---

## 🌟 Key Architecture & Highlights

### 1. Mobile-First Storefront (320px — Desktop)
- **Compact Mobile Header**: Brand logo, expandable live autocomplete search with instant product preview, wishlist counter, and cart badge.
- **Scrollable Category Navigation**: Smooth horizontal strip with active badges and category shortcuts.
- **Fixed Mobile Bottom Navigation**: Home, Categories/Shop, Wishlist, My Orders, Account with safe-area notch padding (`env(safe-area-inset-bottom)`).
- **Responsive Specimen Grids**: 2 columns on mobile, up to 4 columns on large displays, strictly calibrated image ratios, and zero layout shift.

### 2. High-Conversion Shopping & Discovery
- **Amazon/Flipkart Style Multi-Faceted Filters**: Real-time filtering by category, price slider, fish strain (Halfmoon, Plakat, Crowntail, Dumbo Ear, Koi Galaxy), gender (Male, Female, Breeding Pair), care level, and in-stock status.
- **Single-Specimen Transparency**: For unique 1-of-1 fish, guarantees that the exact fish pictured/filmed is what the customer receives. Automatically locks cart quantity to 1 to prevent race conditions.
- **Debounced Instant Search**: Typeahead autocomplete with category matching, SKU search, and direct product card recommendations.
- **Quick View Modal**: Preview high-resolution gallery, biological parameters, and add to cart without navigating away.
- **Live PIN Code Serviceability Checker**: Validates 6-digit Indian PIN codes and computes overnight air transit time.
- **Promotional Announcement Bar**: Configurable promotional message with 1-click coupon code copy button and scheduled campaign links.
- **Cart & Free Shipping Progress Bar**: Dynamic threshold calculation (e.g., "Add ₹499 more for Free Live Air Delivery!"), coupon code system (`AQUA10`, `FIRSTFISH`, `VIPBETTA`), and specialized medical oxygen packing fees.

### 3. Manual Payment Verification Workflow (Zero Gateway Fees)
Because live fish require individual health inspection before order approval, Betta Aquatics utilizes a high-trust manual payment verification flow:
1. **Customer Places Order**: Chooses UPI (Google Pay, PhonePe, Paytm, BHIM) or Direct Bank Transfer (NEFT/IMPS).
2. **Instant QR Code Generation**: A dynamic UPI QR code is generated with the exact order total encoded (`upi://pay?pa=...&am=...`).
3. **Customer Submits Reference**: Customer enters their 12-digit UTR transaction ID and attaches a payment receipt screenshot.
4. **Admin Inspection Desk**: Store administrators review pending orders, inspect the attached screenshot, verify bank statement credit, and click **"Approve Payment"** or **"Reject Payment"** (with custom feedback).
5. **Customer Updates**: Order status immediately updates to **Processing** or **Action Required** with reason.

### 4. Admin Courier Tracking & Shipment Management
- **Pre-Configured Courier Presets**:
  - Bluedart Air Express (Apex Live)
  - DTDC Priority Air Cargo
  - Delhivery Direct
  - India Post Speed Post
  - Custom Courier Partner
- **AWB Tracking & Dispatch**: Admin enters tracking number, estimated delivery date, and transport notes.
- **Live Customer Tracking**: Customers receive a dedicated tracking card in their order history with a 1-click **"Copy Tracking ID"** button and a **"Track Shipment"** button that opens the carrier's live website in a new tab.

### 5. Full Visual CMS & Page Builder
- **Homepage Section Reordering**: Administrators can reorder sections (Hero, Categories, Deal of the Day, Specimen Showcase, Care Guide, Trust Badges, Reviews) with Up/Down buttons, toggle section visibility, and edit headlines.
- **Custom Policy & Care Guide Manager**: Built-in rich content editor for *About Us*, *Shipping & Acclimation Guide*, *DOA Policy*, and *FAQs*, with immutable revision history.
- **Global Store Settings**: Update UPI ID, Payee Name, Bank Details, Delivery fees, Announcement banner, and Brand contacts without touching source code or redeploying.

### 6. Application Security & Database Architecture
- **Supabase PostgreSQL Migrations**: Located in `supabase/migrations/20261015000000_initial_schema.sql`.
- **Row Level Security (RLS)**: Strict tenant isolation. Customers can only view their own orders, addresses, and wishlist items. Admin-only policies govern payment approvals, shipments, and CMS edits.
- **Dual-Mode Data Engine**: Seamlessly connects to live Supabase Cloud when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided, and falls back to a persistent LocalStorage mock database with initial seed data for local testing.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti.
- **Routing**: React Router DOM (v7).
- **Backend / Database**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS), Supabase Storage.
- **Deployment**: Vercel ready (`vercel.json`), GitHub Actions ready.

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
# Clone or navigate to the directory
cd "e:\betta aquatics"

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

### 2. Testing Roles (Customer vs Administrator)
A 1-click role switcher is built into the top navigation header and the Auth page:
- **Customer Mode**:
  - Browse specimens, test filters, search.
  - Add unique specimens to cart, apply coupon code `AQUA10`.
  - Enter shipping address, scan UPI QR code, input sample UTR `407519823412`, and place order.
  - View order in **My Orders** with "Verification Pending" status.
- **Administrator Mode**:
  - Click **"Switch to Admin Mode"** in the header or visit `/admin`.
  - Open **Orders & Fulfillment** -> Click **"Inspect & Process"** on the pending order.
  - Review the submitted UTR and click **"Approve Payment & Credit"**.
  - Click **"Enter Courier Tracking & Mark Shipped"** -> Choose Bluedart -> Enter AWB `BLUEDART-882947192` -> Confirm Dispatch.
  - Switch back to Customer Mode -> Check **My Orders** -> View live tracking card and test the **"Track Shipment"** button!

### 3. Supabase Cloud Configuration (Optional)
To connect your own Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL schema from `supabase/migrations/20261015000000_initial_schema.sql` in the Supabase SQL Editor.
3. Run the initial data seed from `supabase/seed.sql`.
4. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
5. Restart the development server (`npm run dev`).

### 4. Production Build
```bash
npm run build
```
Generates optimized, code-split chunks under `dist/` with all bundles < 300 kB gzip.

---

## 📁 Repository Structure
```
betta-aquatics/
├── public/
│   ├── logo-fish.svg                 # Vector Betta silhouette logo
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/                   # Navbar, MobileHeader, MobileBottomNav, ProductCard, QuickViewModal, StarRating, AnnouncementBar, Footer
│   │   ├── home/                     # HeroCarousel, CategoryBar, FlashDealSection, SpecimenShowcase, CareGuideSection, TrustBadges, ReviewCarousel
│   │   └── admin/                    # AdminLayout, Navigation sidebar, Modals
│   ├── contexts/                     # AuthContext, CartContext, WishlistContext, StoreSettingsContext, ToastContext
│   ├── lib/                          # mockDatabase, supabase client, constants, types, utils
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── OrderDetailPage.tsx
│   │   ├── WishlistPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── CMSPage.tsx
│   │   └── admin/                    # AdminDashboardPage, AdminOrdersPage, AdminProductsPage, AdminCMSPage, AdminSettingsPage, AdminAuditLogsPage
│   ├── App.tsx                       # Provider tree and client routing
│   └── main.tsx
├── supabase/
│   ├── migrations/
│   │   └── 20261015000000_initial_schema.sql   # Complete PostgreSQL schema with RLS
│   └── seed.sql                      # Seed data script
├── tailwind.config.js                # Custom aquatic color palette & safe area utilities
├── vercel.json                       # SPA rewrites for Vercel deployment
└── package.json
```

---

## 🔒 Security Standards Implemented
- **No Client Secrets**: Service-role keys and master database credentials are never included in client bundles.
- **Row Level Security (RLS)**: Enforced in PostgreSQL schema for profiles, addresses, carts, orders, payments, shipments, and CMS configurations.
- **Safe State Changes**: Orders and payments cannot be arbitrarily marked as verified by client-side code; verified states require administrator role enforcement.
- **Specimen Race Condition Guard**: Prevents two customers from purchasing the same unique 1-of-1 live fish specimen simultaneously.

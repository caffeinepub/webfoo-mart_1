# WebFoo Mart

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full multi-store e-commerce marketplace with 12 stores
- Guest browsing (homepage, stores, products, cart) + authenticated checkout/orders/account
- Admin panel at /admin with password protection (webfoo@admin2026)
- Bottom navigation bar (only for logged-in customers, 4 tabs)
- localStorage-based data store for customers, orders, stores, products
- Seed data: 12 stores, 3-5 products each, 1 demo customer, 1 sample order
- Blob-storage integration for store/product image uploads in admin
- Authorization component for session management
- React Router with all specified routes
- React Context for cart and auth state

**Pages:**
- `/` — Homepage: WF logo, search bar, 2-column store grid
- `/store/:storeId` — Store page: product grid
- `/product/:productId` — Product detail: photo, description, price, qty selector, reviews, Add to Cart / Buy Now
- `/cart` — Cart: items list, total, Proceed to Checkout
- `/checkout` — Checkout: delivery address form, Cash on Delivery, Place Order
- `/order-confirmed` — Success: order ID, summary
- `/login` — Login: mobile + password
- `/register` — Register: name, mobile, password, confirm password
- `/account` — My Account: profile, edit
- `/orders` — My Orders: order history with status badges
- `/admin` — Admin panel: Orders, Manage Stores, Manage Products, Customers tabs

**Admin tabs:**
- Orders: table with filter by status, status update dropdown
- Manage Stores: add/edit/delete stores with image upload
- Manage Products: per-store product management with image upload, in-stock toggle
- Customers: table with show/hide password, expandable order history

**Data keys in localStorage:**
- `wfm_customers`: [{id, name, mobile, password, address}]
- `wfm_orders`: [{id, customerId, customerName, items, total, address, phone, status, createdAt}]
- `wfm_stores`: [{id, name, imageUrl, createdAt}]
- `wfm_products`: [{id, storeId, name, price, description, imageUrl, inStock, reviews}]

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan
1. Select Caffeine components: blob-storage, authorization
2. Generate Motoko backend canister with blob-storage and authorization support
3. Build React frontend:
   a. Setup React Router, global context providers (CartContext, AuthContext)
   b. Implement localStorage data layer + seed data initialization
   c. Build shared components: Header, BottomNav, WF Logo, ProductCard, StoreCard
   d. Implement all customer-facing pages (/, /store, /product, /cart, /checkout, /order-confirmed, /login, /register, /account, /orders)
   e. Implement admin panel with sidebar and 4 tabs (Orders, Manage Stores, Manage Products, Customers)
   f. Wire blob-storage for image uploads in admin
   g. Apply branding: dark #0f0f0f bg, cyan #06B6D4 accent, white text
   h. Add all data-ocid markers on interactive surfaces

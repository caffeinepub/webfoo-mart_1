# WebFoo Mart

## Current State
- Full-stack e-commerce app with 12 stores, product pages, cart, checkout, orders, admin panel
- Logo component (`WFLogo.tsx`) references `/assets/uploads/cropped_circle_image-1.png` (old path)
- A new logo image has been uploaded: `/assets/uploads/cropped_circle_image-1-1.png` (cyan circle with "WEBFOO MART" in black/white, gold geometric lines, tagline "Delivering Desires...")
- Theme is already dark with cyan primary (#06B6D4 / oklch(0.72 0.17 213))
- After checkout, a modal popup appears AND a separate `/order-confirmed` route exists
- Basic card-pop animation exists on stores/products
- Various page-entry and general UI animations present

## Requested Changes (Diff)

### Add
- Rich page-entry animations: staggered fade-up for store cards, product cards, page sections on mount
- Floating/shimmer animations on hero section
- Smooth hover animations on nav items, buttons, and cards (scale, glow)
- Scroll-triggered reveal animations for product/store grids
- Loading skeleton pulse animations
- Cyan glow effects matching the logo's color to reinforce theme

### Modify
- **Logo**: Update `WFLogo.tsx` to use the new image path `/assets/uploads/cropped_circle_image-1-1.png` everywhere (header, home hero, login, register, admin login, admin top bar)
- **Theme**: Strengthen cyan + black + gold accents to match the logo — add gold (`oklch(0.82 0.15 85)`) as a secondary accent color for highlights, borders, tags
- **Order flow**: Remove the `/order-confirmed` page navigation entirely. After placing an order, only the popup modal shows. "View Order Details" in the popup navigates to `/orders`. "Continue Shopping" dismisses and goes to `/`. The `OrderConfirmedPage` route can remain but is no longer navigated to from checkout.
- **Card pop animation**: Enhance existing card-pop to feel more springy and satisfying
- **Page transitions**: Add fade-in on all main page mounts

### Remove
- Navigation from `onViewDetails` to `/order-confirmed` — replace with navigation to `/orders`

## Implementation Plan
1. Update `WFLogo.tsx`: change image src to `/assets/uploads/cropped_circle_image-1-1.png`
2. Update `index.css`: add gold accent CSS variable, enhance card-pop keyframes, add stagger/fade-up/shimmer/glow animation classes
3. Update `CheckoutPage.tsx`: change `onViewDetails` handler to `navigate("/orders")` instead of `/order-confirmed`
4. Update `HomePage.tsx`: add staggered fade-up entrance animation to store/product grid items
5. Update `StorePage.tsx`: add fade-up entrance to product cards
6. Update `Header.tsx`: add hover glow/scale to logo link
7. Update `LoginPage.tsx` and `RegisterPage.tsx`: add page fade-in, logo entrance animation
8. Update `AdminPage.tsx`: ensure admin logo uses new path (already via WFLogo), add any missing gold accent touches
9. Add subtle floating animation to logo in hero on `HomePage`

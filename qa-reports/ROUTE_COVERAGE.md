# Route Coverage

| Route | Status | Notes |
|---|---|---|
| `/` | PASS | Homepage renders; announcement, search, categories, product cards |
| `/shop` | PASS | Search/filter UI renders |
| `/shop?q=betta` | PASS | Search results render |
| `/product/:slug` | PASS | PDP, gallery, PIN checker, add-to-cart |
| `/product/does-not-exist` | PASS | Not-found state |
| `/cart` | PASS | Totals, coupon, quantity constraints |
| `/checkout` | PASS | UPI QR, UTR, receipt upload, order creation |
| `/auth` | PASS | Role switcher and sign-in UI |
| `/account` | PASS | Profile/address UI |
| `/account/orders` | PASS | History and tracking |
| `/account/orders/:id` | PASS | Detail, ownership now enforced |
| `/account/wishlist` | PASS | Wishlist UI |
| `/page/about-us` | PASS | CMS page |
| `/page/shipping-acclimation` | PASS | CMS page |
| `/page/faq` | PASS | CMS page |
| `/blog` | PASS | Blog listing |
| `/blog/:slug` | PASS | Blog detail |
| `/admin` | PASS | Dashboard; unauthorized users redirected |
| `/admin/orders` | PASS | Review, approve, reject, dispatch |
| `/admin/products` | PASS | Inventory management UI |
| `/admin/cms` | PASS | Section visibility/reorder |
| `/admin/blogs` | PASS | Blog management UI |
| `/admin/settings` | PASS | Store/UPI/shipping settings |
| `/admin/audit` | PASS | Audit log UI |

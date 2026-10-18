# Betta Aquatics — Screen Reader Semantics & ARIA Implementation Report

**Audit Type:** Assistive Technology & Screen Reader Compatibility  
**Target Standard:** WCAG 2.2 AA (1.3.1 Info and Relationships, 4.1.2 Name, Role, Value)  
**Status:** PASS & VERIFIED  
**Date:** October 17, 2026  

---

## 1. Overview of Semantic HTML & ARIA Architecture

Assistive technologies (such as NVDA, JAWS, VoiceOver, and TalkBack) rely on HTML5 landmark elements, clean heading hierarchies, explicit labels, and precise ARIA state descriptors to convey the UI's purpose and state to blind and low-vision users.

---

## 2. Landmark Structure & Heading Hierarchy

### 2.1 Landmark Distribution
- `<header>`: Encloses branding and primary storefront navigation.
- `<nav aria-label="Administrative Navigation">`: Primary sidebar and mobile navigation drawer.
- `<nav aria-label="Administrative Breadcrumb">`: Provides location pathing (e.g. `Console > Orders`).
- `<main id="admin-main">` and `<main id="main-content">`: Primary content containers targeted by skip links.
- `<footer>`: Customer support coordinates and compliance credentials.

### 2.2 Heading Sequence
- Every view utilizes a single `<h1>` defining the primary page title (e.g., `Live Specimen & Inventory Control`, `Care Guides & Article Management`).
- Sub-sections utilize `<h2>` (e.g., `UPI & Manual Payment Coordinates`, `Shipping & Live Packing Rules`).
- Card groupings and individual modal sections use `<h3>` without skipping levels.

---

## 3. Accessible Form Controls & Label Association

Under WCAG 1.3.1 and 4.1.2, every form control must have an accessible name derived from an associated `<label>` or `aria-label`.

### Verification Across Administrative Forms:
1. **Catalog Specimen Editor (`AdminProductsPage.tsx`)**:
   - `htmlFor="prod-name"` → `<input id="prod-name">`
   - `htmlFor="prod-price"` → `<input id="prod-price">`
   - `htmlFor="prod-compare-price"` → `<input id="prod-compare-price">`
   - `htmlFor="prod-category"` → `<select id="prod-category">`
   - `htmlFor="prod-stock"` → `<input id="prod-stock">`
   - `htmlFor="prod-strain"` → `<input id="prod-strain">`
   - `htmlFor="prod-gender"` → `<select id="prod-gender">`
   - `htmlFor="prod-care"` → `<select id="prod-care">`
   - `htmlFor="prod-image"` → `<input id="prod-image">`
   - `htmlFor="prod-desc"` → `<textarea id="prod-desc">`
   - `htmlFor="prod-unique"` → `<input id="prod-unique" type="checkbox">`

2. **Article Editor (`AdminBlogsPage.tsx`)**:
   - `htmlFor="blog-title"`, `htmlFor="blog-slug"`, `htmlFor="blog-category"`, `htmlFor="blog-read-time"`, `htmlFor="blog-image-url"`, `htmlFor="blog-author-name"`, `htmlFor="blog-author-role"`, `htmlFor="blog-excerpt"`, `htmlFor="blog-content-html"`, `htmlFor="blog-tags"`, `htmlFor="blog-is-published"`.

3. **Global Settings (`AdminSettingsPage.tsx`)**:
   - `htmlFor="set-upi-id"`, `htmlFor="set-upi-payee"`, `htmlFor="set-bank-name"`, `htmlFor="set-bank-acc"`, `htmlFor="set-bank-ifsc"`, `htmlFor="set-bank-holder"`, `htmlFor="set-shipping-free-thresh"`, `htmlFor="set-shipping-rate"`, `htmlFor="set-packing-charge"`, `htmlFor="set-ann-active"`, `htmlFor="set-ann-text"`, `htmlFor="set-ann-code"`, `htmlFor="set-ann-link"`, `htmlFor="set-brand-name"`, `htmlFor="set-contact-email"`, `htmlFor="set-whatsapp"`.

---

## 4. Table Semantics

Data tables on `/admin/orders`, `/admin/products`, `/admin/blogs`, and `/admin/audit-logs` implement full accessibility semantics:
- `<caption className="sr-only">`: Informs screen reader users of the table's purpose before entering data cells.
- `<th scope="col">`: Informs the screen reader which header applies to each cell in the column as the user navigates rows.
- Formatted values (e.g. prices `₹1,499`) are announced naturally.

---

## 5. ARIA Live Regions & Dynamic Notifications

- **Status Toasts (`ToastContext.tsx`)**:
  - Encapsulated in `<div role="status" aria-live="polite">`
  - Screen readers announce confirmations (e.g., "Specimen saved successfully!", "Asset URL copied to clipboard!") without interrupting ongoing speech.
- **Access Denied Alerts (`AdminRoute.tsx`)**:
  - Encapsulated in `<div role="alert" aria-live="assertive">`
  - Immediately interrupts screen readers to warn that the account lacks authorization to access the protected endpoint.

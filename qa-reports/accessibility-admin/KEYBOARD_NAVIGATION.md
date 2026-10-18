# Betta Aquatics — Keyboard Navigation & Focus Management Report

**Audit Type:** Keyboard Operability (WCAG 2.1.1, 2.1.2, 2.4.3, 2.4.7)  
**Standard:** WCAG 2.2 AA  
**Status:** PASS & VERIFIED  
**Date:** October 17, 2026  

---

## 1. Overview of Keyboard Navigation Architecture

Keyboard accessibility ensures that visitors who rely on keyboards, switch devices, screen readers, or sip-and-puff hardware can navigate, inspect, and perform all actions across Betta Aquatics without touching a mouse.

---

## 2. Key Interaction Patterns Evaluated

### 2.1 Focus Order & Logical Tab Sequence (WCAG 2.4.3)
- **Tab Sequence:** Strictly follows the DOM hierarchy from top to bottom, left to right.
- **Skip Links:**
  - Public Storefront: `#main-content` skip link allows bypassing header menus directly to `<main id="main-content">`.
  - Admin Panel: `#admin-main` skip link allows bypassing administrative sidebars directly to `<main id="admin-main">`.

### 2.2 Modal Focus Trapping & Return Focus (WCAG 2.1.2)
- Evaluated across:
  1. `<ConfirmDialog />` (Destructive action confirmation)
  2. Product Creation & Edit Modal (`AdminProductsPage.tsx`)
  3. Article Publishing Modal (`AdminBlogsPage.tsx`)
  4. Media Asset Upload & Alt-Text Modal (`AdminCMSPage.tsx`)
  5. Order Payment Rejection Modal (`AdminOrdersPage.tsx`)
  6. Shipping Consignment Modal (`AdminOrdersPage.tsx`)
  7. Proof of Payment Lightbox Modal (`AdminOrdersPage.tsx`)
  8. Mobile Navigation Drawer (`AdminLayout.tsx`)
  9. Customer Quick View Modal (`QuickViewModal.tsx`)
  10. Tax Invoice Print Modal (`TaxInvoiceModal.tsx`)

#### Verification Results:
- When any modal opens, focus is programmatically shifted into the modal.
- For `<ConfirmDialog />`, focus defaults to the **Cancel** button rather than Confirm to prevent accidental destructive triggers.
- Pressing `Tab` on the last interactive element wraps back to the first interactive element.
- Pressing `Shift+Tab` on the first interactive element wraps to the last interactive element.
- No background page elements can receive keyboard focus while a modal is active.

### 2.3 Escape Key Dismissal
- All modals and dismissible drawers attach a global `keydown` listener listening for `e.key === 'Escape'`.
- Pressing `Escape` immediately closes the dialog without submitting changes.
- Upon dismissal, focus is returned cleanly to the triggering element (e.g., the button that opened the modal).

### 2.4 Accessible Alternative to Drag-and-Drop (CMS Reordering)
- While the homepage block editor supports HTML5 mouse drag-and-drop, it also provides dedicated **Move Up** and **Move Down** keyboard buttons.
- Each button has:
  - `min-h-[44px] min-w-[44px]` target size
  - Explicit `aria-label={`Move section ${section.title} Up`}` / `Down`
  - High-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-blue-900`)
  - Disabled state (`disabled={index === 0}`) when at boundaries, with `disabled:opacity-30`.

### 2.5 Focus Indicator Styling (WCAG 2.4.7 & 2.4.11)
- Universally declared in `src/index.css`:
  ```css
  :focus-visible {
    outline: 2px solid #1e3a8a;
    outline-offset: 2px;
  }
  ```
- Complies with 2px minimum thickness and provides >3:1 contrast against both light and dark surroundings.

---

## 3. Keyboard Shortcut Matrix

| Key / Sequence | Context | Operational Effect |
| :--- | :--- | :--- |
| `Tab` | Anywhere | Moves focus to the next interactive control. |
| `Shift + Tab` | Anywhere | Moves focus to the previous interactive control. |
| `Enter` | Buttons / Links | Activates link navigation or triggers button action. |
| `Space` | Buttons / Checkboxes | Toggles checkboxes or triggers buttons. |
| `Escape` | Modals / Drawers | Dismisses modal or drawer and returns focus to trigger. |
| `ArrowUp / ArrowDown` | Select Dropdowns | Cycles through options without triggering page refresh. |

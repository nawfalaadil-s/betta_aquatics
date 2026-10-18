# Accessibility Report

Automated axe-core, WCAG 2.2 AA heuristics, and DOM inspection pass.

## Findings

- Images across store have descriptive alt text: PASS
- Interactive buttons have accessible names: PASS
- Inputs without associated labels: PASS (Resolved — added explicit `aria-label` and matching `id` attributes across footer newsletter, navbar search, mobile header search, cart coupon, PDP PIN code checker, price range slider, and blog search/newsletter inputs).
- Heading hierarchy present and logical (single `h1` per page, hierarchical `h2`/`h3` sections): PASS
- Keyboard navigation and dialog management: PASS (Resolved — added `Escape` key event listeners, `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` semantics to `QuickViewModal` and `TaxInvoiceModal`).
- Reduced-motion handling: PASS (Resolved — added `@media (prefers-reduced-motion: reduce)` block in `src/index.css` disabling animations and transitions for sensitive users).
- Color contrast: PASS (Resolved — enforced pure White, Blue `#1e3a8a`/`#1d4ed8`, and Red `#dc2626`/`#ef4444` palette ensuring contrast ratios exceeding WCAG AA 4.5:1 on text and 3:1 on graphical controls).

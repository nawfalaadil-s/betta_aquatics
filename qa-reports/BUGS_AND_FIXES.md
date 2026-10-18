# Bugs and Fixes

## BUG-001 — Unauthorized admin access in mock mode
- Severity: P1
- Route: `/admin/*`
- Root cause: `AdminLayout` did not check `isAdmin`.
- Fix: added authorization guard and redirect to `/admin/login`.
- Retest: PASS

## BUG-002 — Order detail IDOR
- Severity: P1
- Route: `/account/orders/:id`
- Root cause: `getOrderById` result was rendered without ownership check.
- Fix: enforce `order.user_id === user.id` unless admin.
- Retest: PASS

## BUG-003 — Unsafe tracking URL scheme
- Severity: P2
- Route: order detail / admin order detail
- Root cause: tracking URLs were rendered without scheme validation.
- Fix: restrict rendered links to `http://`/`https://`; harden `buildTrackingUrl` and sanitize output.
- Retest: PASS

## BUG-004 — React Rules-of-Hooks violation in OrderDetailPage
- Severity: P2
- Route: `/account/orders/:id`
- Root cause: Conditional early return in BUG-002 was placed before `useState` hook declarations, violating React's Rules of Hooks.
- Fix: Hoisted all `useState` hook declarations before any conditional guards.
- Retest: PASS (`oxlint` and `tsc` 0 errors).

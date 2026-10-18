# Betta Aquatics — Remaining Issues & Future Enhancements

**Audit Scope:** WCAG 2.2 AA & Administrative Access Control  
**Status Date:** October 17, 2026  
**Document Purpose:** Production Readiness & Technical Debt Backlog  

---

## 1. Zero Blocking Defects

There are **0 blocking, high-severity, or critical defects** remaining in the Betta Aquatics codebase.

- **WCAG 2.2 Level AA Compliance:** Full coverage across keyboard operability, focus indicators, modal traps, table semantics, touch target sizing, and contrast ratios.
- **Administrative Access Control:** Full least-privilege RBAC implemented with 5 staff roles, isolated admin authentication (`/admin/login`), route-level permission guards, and 403 access denial screens.
- **Build & Quality Assurance:** `npm run build` exits with code 0 (`tsc -b` and `vite build`), and `npm run lint` reports 0 errors.

---

## 2. Low-Priority Technical Debt & Future Architectural Enhancements

The following non-blocking improvements are identified for future product sprints:

### 2.1 Supabase Database Role Migration (Edge Functions & PostgreSQL Triggers)
- **Current State:** Role authorization is enforced on the frontend in `AuthContext.tsx`, `AdminRoute.tsx`, and `mockDatabase.ts`. When connected to Supabase in live mode, roles are queried from the `profiles` table.
- **Future Enhancement:** Create a PostgreSQL Custom Claims trigger or Supabase Edge Function to mirror `role` directly into the `auth.jwt()` payload. This allows writing PostgreSQL Row Level Security (RLS) policies that directly reference `auth.jwt() ->> 'user_role'`, completely offloading permission validation to the database engine.

### 2.2 Automated Visual Regression Testing (Playwright / Axe-core CI Pipeline)
- **Current State:** Automated verification is executed via `scripts/verify-accessibility-and-rbac.mjs` alongside Vite builds and linter runs.
- **Future Enhancement:** Integrate `@axe-core/playwright` into a GitHub Actions CI pipeline to run continuous automated DOM scans on pull requests.

### 2.3 High Contrast Mode (Windows High Contrast & `forced-colors: active`)
- **Current State:** The application strictly respects the official brand palette (White `#ffffff`, Navy Blue `#1e3a8a`, Red `#dc2626`) with contrast ratios exceeding 5:1 to 10:1.
- **Future Enhancement:** Add dedicated `@media (forced-colors: active)` CSS overrides in `src/index.css` to ensure custom SVG icons and border dividers remain visible when Windows High Contrast mode is engaged.

### 2.4 Multi-Factor Authentication (MFA / TOTP for Store Administrators)
- **Current State:** Staff credentials require strong passwords and separate login endpoints.
- **Future Enhancement:** Provide optional TOTP (Google Authenticator) 2FA for accounts assigned the `admin` or `payment_reviewer` role prior to viewing UPI bank coordinates or issuing refunds.

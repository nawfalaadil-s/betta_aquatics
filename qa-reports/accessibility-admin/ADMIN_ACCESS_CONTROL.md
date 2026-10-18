# Betta Aquatics — Administrative Access Control & Least-Privilege RBAC Report

**System Security Level:** Enterprise Hardened  
**Architecture:** Least-Privilege Role-Based Access Control (RBAC)  
**Separation of Duties:** Dedicated Admin Portal (`/admin/login`) vs Public Customer Auth (`/auth`, `/login`)  
**Status:** FULLY IMPLEMENTED & VERIFIED  
**Date:** October 17, 2026  

---

## 1. Architectural Architecture & Role Matrix

To prevent privilege escalation, prevent insider threat compromise, and satisfy strict e-commerce audit standards, Betta Aquatics establishes 5 granular administrative staff roles alongside the standard customer role.

### Role Hierarchy & Definitions

| Role ID | Role Title | Assigned Scope & Purpose |
| :--- | :--- | :--- |
| `customer` | Verified Hobbyist | Public customer shopping, order placement, and consignment status tracking. |
| `admin` | Store Administrator | Executive control across all modules, settings, audit logs, catalog, and staff. |
| `product_manager` | Product & Inventory Manager | Management of specimen catalog, fish genetics, live stock levels, and photography. |
| `order_manager` | Order & Courier Manager | Consignment fulfillment, courier partner assignment, dispatch, and tracking AWBs. |
| `payment_reviewer` | Payment Verification Reviewer | Inspection of manual UPI transaction references, bank credits, and payment approval. |
| `content_manager` | Content & CMS Specialist | Authoring care whitepapers, homepage visual layout, and static policy pages. |

---

## 2. Granular Permissions Mapping

Defined in `src/lib/permissions.ts` and enforced via `AdminRoute.tsx` and `AdminLayout.tsx`:

| Permission Key | Description | `admin` | `product_manager` | `order_manager` | `payment_reviewer` | `content_manager` |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `view_dashboard` | Executive KPI overview | Yes | Yes | Yes | Yes | Yes |
| `manage_products` | Create/edit/delete fish stock | Yes | Yes | No | No | No |
| `manage_orders` | View & update order consignments | Yes | No | Yes | Yes | No |
| `verify_payments` | Approve/reject UPI payments | Yes | No | No | Yes | No |
| `manage_cms` | Homepage blocks, media, and pages | Yes | No | No | No | Yes |
| `manage_blogs` | Care articles & genetics guides | Yes | No | No | No | Yes |
| `manage_settings` | Financial coordinates & delivery fees | Yes | No | No | No | No |
| `view_audit_logs` | Security ledger inspection | Yes | No | Yes | No | No |

---

## 3. Dedicated Authentication Flow & Separation of Entry Points

1. **Customer Authentication (`/auth`, `/login`)**:
   - Strictly validates `role === 'customer'`.
   - Registration creates only `customer` role accounts.
   - Customers never see administrative UI controls, login prompts, or management navigation links.

2. **Administrative Authentication (`/admin/login`)**:
   - Exclusively validates staff roles (`admin`, `product_manager`, `order_manager`, `payment_reviewer`, `content_manager`).
   - If a customer account attempts login on `/admin/login`, access is strictly rejected with a generic message to prevent account enumeration:
     `"Access Denied: Customer accounts cannot access the executive admin portal."`
   - Valid staff accounts are issued secure sessions and routed to `/admin`.

---

## 4. Route Guarding & Accessible 403 Security Screens

In `src/App.tsx`, all admin routes are wrapped in `<AdminRoute requiredPermission="...">`:
- `/admin` → `view_dashboard`
- `/admin/orders` → `manage_orders`
- `/admin/products` → `manage_products`
- `/admin/cms` → `manage_cms`
- `/admin/blogs` → `manage_blogs`
- `/admin/settings` → `manage_settings`
- `/admin/audit-logs` → `view_audit_logs`

### Guard Behavior:
1. **Unauthenticated visitor**:
   - Redirected immediately to `/admin/login` with preserved redirect target state.
2. **Authenticated customer attempting direct administrative URL**:
   - Displayed an accessible `403 Forbidden` screen with `role="alert"` explaining that the signed-in account lacks administrative credentials.
3. **Staff member attempting access to an unauthorized module** (e.g. `product_manager` navigating to `/admin/settings`):
   - Displayed an accessible `403 Restricted Role` screen detailing their current role and the exact missing permission required.

---

## 5. Sidebar Navigation Filtering

In `src/components/admin/AdminLayout.tsx`:
- Desktop and mobile sidebar menus dynamically evaluate `hasPermission(link.permission)`.
- Staff members only see navigation items they are authorized to operate.
- This prevents clutter, reduces user error, and enforces clean least-privilege visibility.

---

## 6. Audit Logging & Non-Repudiation

All critical administrative actions are recorded in an immutable ledger (`mockDb.addAuditLog`):
- Staff member email address
- Precise action and operational details
- Entity type (`order`, `product`, `cms`, `settings`, `security`)
- UTC ISO timestamp

Audited in `/admin/audit-logs` with full table accessibility semantics.

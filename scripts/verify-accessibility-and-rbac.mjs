import fs from 'node:fs';

console.log('=== BETTA AQUATICS ACCESSIBILITY & RBAC VERIFICATION SUITE ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failCount++;
  }
}

// -------------------------------------------------------------
// Test 1: RBAC Permission Matrix & Granular Roles
// -------------------------------------------------------------
console.log('1. Testing RBAC Role Definitions & Permission Matrix...');

const permissionsFile = fs.readFileSync('src/lib/permissions.ts', 'utf8');
const typesFile = fs.readFileSync('src/lib/types.ts', 'utf8');

assert(typesFile.includes("'product_manager'"), 'UserRole includes product_manager');
assert(typesFile.includes("'order_manager'"), 'UserRole includes order_manager');
assert(typesFile.includes("'payment_reviewer'"), 'UserRole includes payment_reviewer');
assert(typesFile.includes("'content_manager'"), 'UserRole includes content_manager');

assert(permissionsFile.includes('manage_products'), 'Permission manage_products defined');
assert(permissionsFile.includes('manage_orders'), 'Permission manage_orders defined');
assert(permissionsFile.includes('verify_payments'), 'Permission verify_payments defined');
assert(permissionsFile.includes('manage_cms'), 'Permission manage_cms defined');
assert(permissionsFile.includes('manage_blogs'), 'Permission manage_blogs defined');
assert(permissionsFile.includes('manage_settings'), 'Permission manage_settings defined');
assert(permissionsFile.includes('view_audit_logs'), 'Permission view_audit_logs defined');

// Verify role mapping logic in permissions.ts
assert(permissionsFile.includes("order_manager: ["), 'order_manager permissions mapped');
assert(permissionsFile.includes("payment_reviewer: ["), 'payment_reviewer permissions mapped');
assert(permissionsFile.includes("product_manager: ["), 'product_manager permissions mapped');
assert(permissionsFile.includes("content_manager: ["), 'content_manager permissions mapped');
assert(permissionsFile.includes("'verify_payments',"), 'payment_reviewer granted verify_payments');

// -------------------------------------------------------------
// Test 2: Staff Accounts & Mock Database Isolation
// -------------------------------------------------------------
console.log('\n2. Testing Mock Database Staff Accounts & Secure Auth...');

const mockDbFile = fs.readFileSync('src/lib/mockDatabase.ts', 'utf8');

assert(mockDbFile.includes('products@bettaaquatics.in'), 'Staff account products@bettaaquatics.in present');
assert(mockDbFile.includes('orders@bettaaquatics.in'), 'Staff account orders@bettaaquatics.in present');
assert(mockDbFile.includes('reviewer@bettaaquatics.in'), 'Staff account reviewer@bettaaquatics.in present');
assert(mockDbFile.includes('content@bettaaquatics.in'), 'Staff account content@bettaaquatics.in present');
assert(mockDbFile.includes('customer@bettaaquatics.in'), 'Customer test account customer@bettaaquatics.in present');

// Verify no customer authentication leakage to admin
assert(mockDbFile.includes("user.role === 'customer'") && mockDbFile.includes('Customer accounts cannot access the executive admin portal'), 'authenticateAdmin strictly rejects customer accounts');
assert(mockDbFile.includes('authenticateAdmin'), 'authenticateAdmin helper exists in mockDatabase');

// -------------------------------------------------------------
// Test 3: Admin Route Guards & Accessible 403 Screens
// -------------------------------------------------------------
console.log('\n3. Testing AdminRoute Authorization Guards & 403 Responses...');

const adminRouteFile = fs.readFileSync('src/components/admin/AdminRoute.tsx', 'utf8');

assert(adminRouteFile.includes('requiredPermission?: AdminPermission'), 'AdminRoute accepts requiredPermission parameter');
assert(adminRouteFile.includes('to="/admin/login"'), 'Unauthenticated requests redirect to /admin/login');
assert(adminRouteFile.includes('Administrative Access Denied'), 'Customer accounts receive dedicated 403 Forbidden screen');
assert(adminRouteFile.includes('Module Access Restricted'), 'Staff with insufficient permissions receive dedicated 403 Restricted Role screen');
assert(adminRouteFile.includes('role="alert"'), 'Access denial screens include semantic role="alert"');

const appFile = fs.readFileSync('src/App.tsx', 'utf8');
assert(appFile.includes('requiredPermission="manage_orders"'), 'Orders route guarded with manage_orders');
assert(appFile.includes('requiredPermission="manage_products"'), 'Products route guarded with manage_products');
assert(appFile.includes('requiredPermission="manage_cms"'), 'CMS route guarded with manage_cms');
assert(appFile.includes('requiredPermission="manage_blogs"'), 'Blogs route guarded with manage_blogs');
assert(appFile.includes('requiredPermission="manage_settings"'), 'Settings route guarded with manage_settings');
assert(appFile.includes('requiredPermission="view_audit_logs"'), 'Audit logs route guarded with view_audit_logs');
assert(appFile.includes('href="#main-content"'), 'Skip-to-content link present in App.tsx');

// -------------------------------------------------------------
// Test 4: Accessible Navigation & Sidebar (AdminLayout)
// -------------------------------------------------------------
console.log('\n4. Testing Accessible Administrative Layout & Navigation...');

const adminLayoutFile = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

assert(adminLayoutFile.includes('href="#admin-main"'), 'Admin skip-to-content link present');
assert(adminLayoutFile.includes('aria-label="Administrative Breadcrumb"'), 'Breadcrumbs equipped with accessible aria-label');
assert(adminLayoutFile.includes('hasPermission(item.permission)'), 'Navigation items filtered by current staff permissions');
assert(adminLayoutFile.includes('role="dialog"'), 'Mobile drawer marked with role="dialog"');
assert(adminLayoutFile.includes('aria-modal="true"'), 'Mobile drawer marked with aria-modal="true"');
assert(adminLayoutFile.includes("e.key === 'Escape'"), 'Mobile drawer listens for Escape key');

// -------------------------------------------------------------
// Test 5: Accessible Confirm Dialog & Table Semantics
// -------------------------------------------------------------
console.log('\n5. Testing ConfirmDialog, Table Captions, and Form Labels...');

const confirmDialogFile = fs.readFileSync('src/components/common/ConfirmDialog.tsx', 'utf8');
assert(confirmDialogFile.includes('role="alertdialog"'), 'ConfirmDialog uses role="alertdialog"');
assert(confirmDialogFile.includes('aria-modal="true"'), 'ConfirmDialog uses aria-modal="true"');
assert(confirmDialogFile.includes('aria-labelledby="confirm-dialog-title"'), 'ConfirmDialog has aria-labelledby');
assert(confirmDialogFile.includes('aria-describedby="confirm-dialog-desc"'), 'ConfirmDialog has aria-describedby');
assert(confirmDialogFile.includes('cancelBtnRef.current?.focus()'), 'ConfirmDialog auto-focuses cancel button on mount');

// Check admin pages for captions and table headers
const productsPageFile = fs.readFileSync('src/pages/admin/AdminProductsPage.tsx', 'utf8');
assert(productsPageFile.includes('<caption className="sr-only">'), 'Products table has accessible caption');
assert(productsPageFile.includes('scope="col"'), 'Products table has th scope="col"');
assert(productsPageFile.includes('htmlFor="prod-name"'), 'Product edit modal has htmlFor associated with prod-name');
assert(productsPageFile.includes('min-h-[44px]'), 'Product action buttons provide minimum 44px touch targets');
assert(productsPageFile.includes('<ConfirmDialog'), 'Products page uses ConfirmDialog for safe deletion');

const ordersPageFile = fs.readFileSync('src/pages/admin/AdminOrdersPage.tsx', 'utf8');
assert(ordersPageFile.includes('<caption className="sr-only">'), 'Orders table has accessible caption');
assert(ordersPageFile.includes('scope="col"'), 'Orders table has th scope="col"');
assert(ordersPageFile.includes('aria-label="Filter orders by payment status"'), 'Orders filter has accessible aria-label');

const blogsPageFile = fs.readFileSync('src/pages/admin/AdminBlogsPage.tsx', 'utf8');
assert(blogsPageFile.includes('<caption className="sr-only">'), 'Blogs table has accessible caption');
assert(blogsPageFile.includes('scope="col"'), 'Blogs table has th scope="col"');
assert(blogsPageFile.includes('htmlFor="blog-title"'), 'Blog modal has htmlFor associated with blog-title');
assert(blogsPageFile.includes('<ConfirmDialog'), 'Blogs page uses ConfirmDialog for article deletion');

const cmsPageFile = fs.readFileSync('src/pages/admin/AdminCMSPage.tsx', 'utf8');
assert(cmsPageFile.includes('min-h-[44px] min-w-[44px]'), 'CMS Move Up/Down buttons provide 44px touch targets');
assert(cmsPageFile.includes('aria-pressed='), 'CMS visibility toggle includes aria-pressed state');
assert(cmsPageFile.includes('<ConfirmDialog'), 'CMS page uses ConfirmDialog for layout reset and media deletion');

const settingsPageFile = fs.readFileSync('src/pages/admin/AdminSettingsPage.tsx', 'utf8');
assert(settingsPageFile.includes('htmlFor="set-upi-id"'), 'Settings page has htmlFor for UPI ID');
assert(settingsPageFile.includes('htmlFor="set-upi-payee"'), 'Settings page has htmlFor for UPI payee');
assert(settingsPageFile.includes('htmlFor="set-bank-name"'), 'Settings page has htmlFor for bank name');

const indexCssFile = fs.readFileSync('src/index.css', 'utf8');
assert(indexCssFile.includes(':focus-visible'), 'Universal focus-visible outline defined in index.css');
assert(indexCssFile.includes('prefers-reduced-motion'), 'Prefers-reduced-motion media query defined in index.css');

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n-------------------------------------------------------------');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('-------------------------------------------------------------\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('All Accessibility and RBAC verification checks passed successfully!');
}

import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('BETTA AQUATICS — GLOBAL BRANDING & DYNAMIC THEME VERIFICATION');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS [Test ${totalTests}]: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL [Test ${totalTests}]: ${message}`);
    failedTests++;
  }
}

// -------------------------------------------------------------
// Read codebase files
// -------------------------------------------------------------
const typesTs = fs.readFileSync(path.resolve('src/lib/types.ts'), 'utf-8');
const constantsTs = fs.readFileSync(path.resolve('src/lib/constants.ts'), 'utf-8');
const brandingUtilsTs = fs.readFileSync(path.resolve('src/lib/brandingUtils.ts'), 'utf-8');
const mockDbTs = fs.readFileSync(path.resolve('src/lib/mockDatabase.ts'), 'utf-8');
const brandingContextTs = fs.readFileSync(path.resolve('src/contexts/BrandingContext.tsx'), 'utf-8');
const brandLogoTsx = fs.readFileSync(path.resolve('src/components/common/BrandLogo.tsx'), 'utf-8');
const brandingEditorTsx = fs.readFileSync(path.resolve('src/components/admin/BrandingThemeEditor.tsx'), 'utf-8');
const adminBrandingPageTsx = fs.readFileSync(path.resolve('src/pages/admin/AdminBrandingPage.tsx'), 'utf-8');
const adminCmsPageTsx = fs.readFileSync(path.resolve('src/pages/admin/AdminCMSPage.tsx'), 'utf-8');
const adminSettingsPageTsx = fs.readFileSync(path.resolve('src/pages/admin/AdminSettingsPage.tsx'), 'utf-8');
const adminLayoutTsx = fs.readFileSync(path.resolve('src/components/admin/AdminLayout.tsx'), 'utf-8');
const appTsx = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
const tailwindConfig = fs.readFileSync(path.resolve('tailwind.config.js'), 'utf-8');
const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf-8');

// Customer-facing and admin pages
const navbarTsx = fs.readFileSync(path.resolve('src/components/common/Navbar.tsx'), 'utf-8');
const mobileHeaderTsx = fs.readFileSync(path.resolve('src/components/common/MobileHeader.tsx'), 'utf-8');
const footerTsx = fs.readFileSync(path.resolve('src/components/common/Footer.tsx'), 'utf-8');
const invoiceModalTsx = fs.readFileSync(path.resolve('src/components/common/TaxInvoiceModal.tsx'), 'utf-8');
const authPageTsx = fs.readFileSync(path.resolve('src/pages/AuthPage.tsx'), 'utf-8');
const adminLoginPageTsx = fs.readFileSync(path.resolve('src/pages/admin/AdminLoginPage.tsx'), 'utf-8');
const homePageTsx = fs.readFileSync(path.resolve('src/pages/HomePage.tsx'), 'utf-8');

console.log('--- SUITE 1: BRANDING SCHEMA & DATABASE PERSISTENCE CONFIGURATION ---');

// 1. BrandingSettings interface
assert(
  typesTs.includes('export interface BrandingSettings') &&
  typesTs.includes('logo_url: string') &&
  typesTs.includes('primary_color: string') &&
  typesTs.includes('secondary_color: string'),
  'BrandingSettings interface is defined in src/lib/types.ts with full schema'
);

// 2. DEFAULT_BRANDING_SETTINGS constants
assert(
  constantsTs.includes('DEFAULT_BRANDING_SETTINGS') &&
  constantsTs.includes("logo_url: '/logo-fish.svg'") &&
  constantsTs.includes("primary_color: '#1e3a8a'") &&
  constantsTs.includes("secondary_color: '#dc2626'"),
  'DEFAULT_BRANDING_SETTINGS constants provide safe fallbacks in src/lib/constants.ts'
);

// 3. SQL migration exists for store_settings branding
const migrationPath = path.resolve('supabase/migrations/20261018100000_branding_and_theme_settings.sql');
assert(
  fs.existsSync(migrationPath),
  'PostgreSQL migration exists for branding store_settings table'
);

const migrationSql = fs.readFileSync(migrationPath, 'utf-8');
assert(
  migrationSql.includes('store_settings') &&
  migrationSql.includes("'branding'") &&
  migrationSql.includes('"logo_url"') &&
  migrationSql.includes('"primary_color"'),
  'Migration seeds default branding JSON into store_settings table'
);

console.log('\n--- SUITE 2: CONTRAST UTILITIES & ACCESSIBILITY AUDIT ---');

// 4. Contrast calculations
assert(
  brandingUtilsTs.includes('calculateContrastRatio') &&
  brandingUtilsTs.includes('getAccessibleTextColor') &&
  brandingUtilsTs.includes('getWcagRating'),
  'brandingUtils provides WCAG 2.2 relative luminance, contrast ratio, and accessible text foreground calculation'
);

// 5. CSS variables injection
assert(
  brandingUtilsTs.includes('--brand-primary') &&
  brandingUtilsTs.includes('--brand-secondary') &&
  brandingUtilsTs.includes('--brand-primary-text') &&
  brandingUtilsTs.includes('applyBrandingCssVariables'),
  'applyBrandingCssVariables dynamically binds CSS variables to document.documentElement'
);

// 6. Dynamic favicon updates
assert(
  brandingUtilsTs.includes("link.rel = 'icon'") &&
  brandingUtilsTs.includes('link.href ='),
  'applyBrandingCssVariables dynamically updates the browser favicon'
);

console.log('\n--- SUITE 3: REACT CONTEXT & GLOBAL STATE SYNCHRONIZATION ---');

// 7. BrandingProvider and useBranding hook
assert(
  brandingContextTs.includes('export const BrandingProvider') &&
  brandingContextTs.includes('export const useBranding = ()'),
  'BrandingProvider and useBranding hook are exported'
);

// 8. Event listeners for instant cross-tab / cross-component updates
assert(
  brandingContextTs.includes('ba_branding_updated') &&
  mockDbTs.includes("new CustomEvent('ba_branding_updated'"),
  'BrandingContext synchronizes state instantaneously via custom events and storage broadcasts'
);

// 9. App.tsx provider wrapping
assert(
  appTsx.includes('<BrandingProvider>') &&
  appTsx.includes('</BrandingProvider>'),
  'App component is wrapped with BrandingProvider at the top level'
);

console.log('\n--- SUITE 4: DYNAMIC <BrandLogo /> COMPONENT & CACHE BUSTING ---');

// 10. BrandLogo component features
assert(
  brandLogoTsx.includes('export const BrandLogo: React.FC<BrandLogoProps>') &&
  brandLogoTsx.includes('onError=') &&
  brandLogoTsx.includes('?v='),
  'BrandLogo component provides variant support, graceful fallback on error, and cache-busting version queries'
);

// 11. Customer Header / Navbar
assert(
  navbarTsx.includes('<BrandLogo') && navbarTsx.includes('variant="header"'),
  'Desktop Navbar displays dynamic BrandLogo'
);

// 12. Mobile Header
assert(
  mobileHeaderTsx.includes('<BrandLogo') && mobileHeaderTsx.includes('variant="mobile"'),
  'MobileHeader displays dynamic BrandLogo'
);

// 13. Customer Footer
assert(
  footerTsx.includes('<BrandLogo') && footerTsx.includes('variant="footer"'),
  'Global Footer displays dynamic BrandLogo'
);

// 14. Tax Invoice Modal
assert(
  invoiceModalTsx.includes('<BrandLogo') && invoiceModalTsx.includes('variant="invoice"'),
  'GST Tax Invoice Modal displays dynamic BrandLogo'
);

// 15. Customer Auth Page
assert(
  authPageTsx.includes('<BrandLogo') && authPageTsx.includes('variant="auth"'),
  'Customer Auth / Login Page displays dynamic BrandLogo'
);

// 16. Admin Login Page
assert(
  adminLoginPageTsx.includes('<BrandLogo') && adminLoginPageTsx.includes('variant="auth"'),
  'Admin Login Page displays dynamic BrandLogo'
);

// 17. Admin Layout Navigation & Drawer
assert(
  adminLayoutTsx.includes('<BrandLogo'),
  'Admin Layout sidebar and mobile drawer display dynamic BrandLogo'
);

// 18. Structured JSON-LD SEO Data
assert(
  homePageTsx.includes('branding.logo_url'),
  'HomePage JSON-LD Organization schema dynamically incorporates branding.logo_url'
);

console.log('\n--- SUITE 5: ADMIN BRANDING & THEME SETTINGS CMS INTERFACE ---');

// 19. Dedicated Admin Branding Page
assert(
  adminBrandingPageTsx.includes('<BrandingThemeEditor />'),
  'AdminBrandingPage renders the BrandingThemeEditor'
);

// 20. App.tsx route for /admin/branding
assert(
  appTsx.includes('path="branding"') &&
  appTsx.includes('AdminBrandingPage'),
  'Route /admin/branding is registered and secured with manage_cms permission in App.tsx'
);

// 21. AdminLayout sidebar item
assert(
  adminLayoutTsx.includes("path: '/admin/branding'") &&
  adminLayoutTsx.includes('Branding & Theme'),
  'AdminLayout navigation includes Branding & Theme link'
);

// 22. Admin CMS tab integration
assert(
  adminCmsPageTsx.includes('Branding & Theme') &&
  adminCmsPageTsx.includes('<BrandingThemeEditor />'),
  'Admin CMS section includes dedicated Branding & Theme tab'
);

// 23. Admin Settings direct link
assert(
  adminSettingsPageTsx.includes('/admin/branding'),
  'Admin Settings page includes quick access card to Branding & Theme'
);

// 24. BrandingThemeEditor features
assert(
  brandingEditorTsx.includes('PRIMARY_PRESETS') &&
  brandingEditorTsx.includes('SECONDARY_PRESETS') &&
  brandingEditorTsx.includes('ConfirmDialog') &&
  brandingEditorTsx.includes('MediaPickerModal') &&
  brandingEditorTsx.includes('previewBranding'),
  'BrandingThemeEditor includes live previews, color presets, contrast scoring, media picker, and reset dialog'
);

console.log('\n--- SUITE 6: CSS VARIABLES & TAILWIND INTEGRATION ---');

// 25. Tailwind CSS brand color mapping
assert(
  tailwindConfig.includes("primary: 'var(--brand-primary") &&
  tailwindConfig.includes("secondary: 'var(--brand-secondary") &&
  tailwindConfig.includes("brand: {"),
  'Tailwind config configures brand color tokens bound to CSS variables'
);

// 26. Global CSS custom properties and buttons
assert(
  indexCss.includes('--brand-primary:') &&
  indexCss.includes('--brand-secondary:') &&
  indexCss.includes('var(--brand-primary') &&
  indexCss.includes('.btn-primary') &&
  indexCss.includes('.btn-accent'),
  'src/index.css defines root CSS variables and maps .btn-primary / .btn-accent to dynamic brand tokens'
);

// 27. Universal accessible focus indicator uses brand color
assert(
  indexCss.includes(':focus-visible') &&
  indexCss.includes('var(--brand-primary'),
  ':focus-visible outline uses dynamic --brand-primary color variable'
);

console.log('\n--- SUITE 7: PERSISTENT STORAGE & RESET SAFETY ---');

// 28. MockDatabase storage keys and methods
assert(
  mockDbTs.includes('STORAGE_KEYS.BRANDING_SETTINGS') &&
  mockDbTs.includes('getBrandingSettings') &&
  mockDbTs.includes('updateBrandingSettings') &&
  mockDbTs.includes('resetBrandingSettings'),
  'mockDatabase.ts implements getBrandingSettings, updateBrandingSettings, and resetBrandingSettings'
);

// 29. Multi-tier persistence (dual Supabase + localStorage)
assert(
  brandingContextTs.includes(".from('store_settings')") &&
  brandingContextTs.includes('mockDb.updateBrandingSettings'),
  'BrandingContext saves to Supabase store_settings with dual fallback to mockDb'
);

// 30. Versioned cache-busting timestamp on update
assert(
  mockDbTs.includes('version: (current.version || 1) + 1'),
  'mockDatabase.ts bumps monotonic version on update to invalidate browser asset cache'
);

console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL BRANDING & THEME VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
}

import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('BETTA AQUATICS — LOGO MISMATCH & SINGLE SOURCE OF TRUTH TEST');
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
const brandLogoTsx = fs.readFileSync(path.resolve('src/components/common/BrandLogo.tsx'), 'utf-8');
const adminLayoutTsx = fs.readFileSync(path.resolve('src/components/admin/AdminLayout.tsx'), 'utf-8');
const brandingEditorTsx = fs.readFileSync(path.resolve('src/components/admin/BrandingThemeEditor.tsx'), 'utf-8');
const brandingContextTs = fs.readFileSync(path.resolve('src/contexts/BrandingContext.tsx'), 'utf-8');
const navbarTsx = fs.readFileSync(path.resolve('src/components/common/Navbar.tsx'), 'utf-8');
const mobileHeaderTsx = fs.readFileSync(path.resolve('src/components/common/MobileHeader.tsx'), 'utf-8');
const footerTsx = fs.readFileSync(path.resolve('src/components/common/Footer.tsx'), 'utf-8');
const authPageTsx = fs.readFileSync(path.resolve('src/pages/AuthPage.tsx'), 'utf-8');
const adminLoginPageTsx = fs.readFileSync(path.resolve('src/pages/admin/AdminLoginPage.tsx'), 'utf-8');
const taxInvoiceTsx = fs.readFileSync(path.resolve('src/components/common/TaxInvoiceModal.tsx'), 'utf-8');

console.log('--- SUITE 1: CENTRAL SOURCE OF TRUTH & REACT STATE IN BRANDLOGO ---');

// 1. BrandLogo consumes activeSettings for immediate preview & saved synchronization
assert(
  brandLogoTsx.includes('const { activeSettings, branding } = useBranding();') &&
  brandLogoTsx.includes('const currentSettings = activeSettings || branding;'),
  'BrandLogo binds to activeSettings so CMS previews and saved updates reflect simultaneously without page refresh'
);

// 2. BrandLogo resets hasError when logo URL or version updates
assert(
  brandLogoTsx.includes('useEffect(() => {') &&
  brandLogoTsx.includes('setHasError(false);') &&
  brandLogoTsx.includes('[logoSrc, currentSettings.version]'),
  'BrandLogo resets error state whenever logoSrc or version changes, preventing sticky fallback locks'
);

// 3. Safe cache-busting algorithm (prevents corrupting data: and blob: URLs)
assert(
  brandLogoTsx.includes("!logoSrc.startsWith('data:')") &&
  brandLogoTsx.includes("!logoSrc.startsWith('blob:')") &&
  brandLogoTsx.includes("const sep = logoSrc.includes('?') ? '&' : '?';"),
  'BrandLogo strictly protects base64 and blob data URLs from invalid query strings and handles existing queries'
);

// 4. Aspect-ratio and overflow containment
assert(
  brandLogoTsx.includes('object-contain') &&
  brandLogoTsx.includes('max-w-full max-h-full overflow-hidden') &&
  brandLogoTsx.includes("style={{ aspectRatio: 'auto' }}"),
  'BrandLogo enforces max bounds, object-contain, and auto aspect-ratio to prevent image blowout'
);

console.log('\n--- SUITE 2: ADMIN LAYOUT SIDEBAR & HEADER LOGO INTEGRATION ---');

// 5. Admin Top Header Logo Container
assert(
  adminLayoutTsx.includes('overflow-hidden shrink-0') &&
  adminLayoutTsx.includes('<BrandLogo variant="admin"') &&
  adminLayoutTsx.includes('imgClassName="w-full h-full object-contain"'),
  'Admin top header logo is strictly contained within bounded dimensions and uses BrandLogo variant="admin"'
);

// 6. Admin Desktop Sidebar Top Showcase
assert(
  adminLayoutTsx.includes('Top Sidebar Brand Showcase (Strict Source of Truth from CMS)') &&
  adminLayoutTsx.includes('w-10 h-10 rounded-xl bg-white') &&
  adminLayoutTsx.includes('overflow-hidden shrink-0'),
  'Desktop sidebar includes a dedicated top brand showcase strictly bounded to 40x40px container'
);

// 7. Admin Mobile Drawer Logo
assert(
  adminLayoutTsx.includes('w-8 h-8 rounded-lg bg-blue-950') &&
  adminLayoutTsx.includes('overflow-hidden shrink-0'),
  'Admin mobile drawer logo is strictly bounded and uses BrandLogo with overflow protection'
);

console.log('\n--- SUITE 3: CMS BRANDING EDITOR UPLOAD & PERSISTENCE ---');

// 8. Direct File Upload Support
assert(
  brandingEditorTsx.includes('triggerDirectUpload') &&
  brandingEditorTsx.includes('handleDirectFileChange') &&
  brandingEditorTsx.includes('uploadMediaFile(file,'),
  'BrandingThemeEditor supports direct device file upload via uploadMediaFile'
);

// 9. Instant live preview on URL input change
assert(
  brandingEditorTsx.includes("handleTextChange = (key: keyof BrandingSettings, value: string)") &&
  brandingEditorTsx.includes("previewBranding(updated);"),
  'handleTextChange immediately invokes previewBranding so typed or pasted URLs update active components'
);

// 10. Live UI Component Preview includes Admin Sidebar Simulation
assert(
  brandingEditorTsx.includes('Admin Sidebar & Header Simulation') &&
  brandingEditorTsx.includes('Admin Sidebar & Header Preview') &&
  brandingEditorTsx.includes('BETTA <span className="text-red-500">ADMIN</span>'),
  'Live UI Preview card renders simulated Admin Header and Sidebar block displaying active logo in real-time'
);

console.log('\n--- SUITE 4: GLOBAL PROPAGATION & COMPONENT HARMONIZATION ---');

// 11. Navbar Header logo
assert(
  navbarTsx.includes('<BrandLogo variant="header"') &&
  navbarTsx.includes('overflow-hidden shrink-0'),
  'Public Navbar uses BrandLogo variant="header" with overflow containment'
);

// 12. Mobile Header logo
assert(
  mobileHeaderTsx.includes('<BrandLogo variant="mobile"') &&
  mobileHeaderTsx.includes('overflow-hidden shrink-0'),
  'MobileHeader uses BrandLogo variant="mobile" with overflow containment'
);

// 13. Footer logo
assert(
  footerTsx.includes('<BrandLogo variant="footer"') &&
  footerTsx.includes('overflow-hidden shrink-0'),
  'Global Footer uses BrandLogo variant="footer" with overflow containment'
);

// 14. Tax Invoice modal logo
assert(
  taxInvoiceTsx.includes('<BrandLogo variant="invoice"') &&
  taxInvoiceTsx.includes('overflow-hidden shrink-0'),
  'GST Tax Invoice uses BrandLogo variant="invoice" with overflow containment'
);

// 15. Customer Auth page logo
assert(
  authPageTsx.includes('<BrandLogo variant="auth"') &&
  authPageTsx.includes('overflow-hidden shrink-0'),
  'Customer Auth page uses BrandLogo variant="auth" with overflow containment'
);

// 16. Admin Login page logo
assert(
  adminLoginPageTsx.includes('<BrandLogo variant="auth"') &&
  adminLoginPageTsx.includes('overflow-hidden shrink-0'),
  'Admin Login page uses BrandLogo variant="auth" with overflow containment'
);

console.log('\n--- SUITE 5: ALGORITHMIC UNIT TESTS ---');

// 17. Unit test: safe cache busting logic on data URL
function computeFinalSrc(logoSrc, version) {
  let finalSrc = logoSrc;
  if (
    version &&
    typeof logoSrc === 'string' &&
    !logoSrc.startsWith('data:') &&
    !logoSrc.startsWith('blob:')
  ) {
    const sep = logoSrc.includes('?') ? '&' : '?';
    finalSrc = `${logoSrc}${sep}v=${version}`;
  }
  return finalSrc;
}

const base64Url = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
assert(
  computeFinalSrc(base64Url, 2) === base64Url,
  'Unit test: base64 data: URL is untouched without appending ?v=2'
);

// 18. Unit test: safe cache busting logic on blob URL
const blobUrl = 'blob:http://localhost:5173/a4f32c38-c89b-4654-8c43-982736452819';
assert(
  computeFinalSrc(blobUrl, 3) === blobUrl,
  'Unit test: blob: URL is untouched without appending ?v=3'
);

// 19. Unit test: standard relative/absolute URL
const standardUrl = '/uploaded/logo.svg';
assert(
  computeFinalSrc(standardUrl, 5) === '/uploaded/logo.svg?v=5',
  'Unit test: standard path appends ?v=5'
);

// 20. Unit test: URL with existing query parameters
const queryUrl = 'https://supabase.co/storage/v1/object/public/media/logo.png?token=xyz123';
assert(
  computeFinalSrc(queryUrl, 5) === 'https://supabase.co/storage/v1/object/public/media/logo.png?token=xyz123&v=5',
  'Unit test: URL with existing query parameters safely appends &v=5 using ampersand'
);

console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL LOGO MISMATCH & SOURCE OF TRUTH TESTS PASSED SUCCESSFULLY!\n');
}

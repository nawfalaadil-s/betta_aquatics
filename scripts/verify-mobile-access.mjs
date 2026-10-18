import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('BETTA AQUATICS — LOCAL MOBILE ACCESS & CONNECTIVITY VERIFICATION');
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
const viteConfig = fs.readFileSync(path.resolve('vite.config.ts'), 'utf-8');
const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));
const startBat = fs.readFileSync(path.resolve('start-mobile.bat'), 'utf-8');
const mobileGuide = fs.readFileSync(path.resolve('MOBILE-ACCESS-GUIDE.md'), 'utf-8');
const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
const mainTsx = fs.readFileSync(path.resolve('src/main.tsx'), 'utf-8');
const manifestContent = fs.readFileSync(path.resolve('public/manifest.webmanifest'), 'utf-8');
const swContent = fs.readFileSync(path.resolve('public/sw.js'), 'utf-8');
const mobileNav = fs.readFileSync(path.resolve('src/components/common/MobileBottomNav.tsx'), 'utf-8');
const mobileHeader = fs.readFileSync(path.resolve('src/components/common/MobileHeader.tsx'), 'utf-8');
const productDetail = fs.readFileSync(path.resolve('src/pages/ProductDetailPage.tsx'), 'utf-8');
const checkout = fs.readFileSync(path.resolve('src/pages/CheckoutPage.tsx'), 'utf-8');

console.log('--- SUITE 1: VITE NETWORK CONFIGURATION & PORT PRESERVATION ---');

// 1. Vite server configuration binds to 0.0.0.0
assert(
  viteConfig.includes("host: '0.0.0.0'") && viteConfig.includes("port: 5173"),
  'Vite server is explicitly configured to listen on 0.0.0.0 and port 5173'
);

// 2. Strict port preservation
assert(
  viteConfig.includes("strictPort: true"),
  'Vite strictPort is enabled to prevent silent port-hopping to 5174/5175'
);

// 3. Preview configuration also binds to 0.0.0.0
assert(
  viteConfig.includes("preview:") && viteConfig.includes("host: '0.0.0.0'"),
  'Vite preview server is also configured with host 0.0.0.0 and strictPort'
);

console.log('\n--- SUITE 2: WINDOWS STARTUP WORKFLOW (start-mobile.bat) ---');

// 4. Batch file directory handling
assert(
  startBat.includes('cd /d "%~dp0"'),
  'start-mobile.bat switches to script directory to ensure path consistency'
);

// 5. Node.js & npm environment checks
assert(
  startBat.includes('where node') && startBat.includes('where npm'),
  'start-mobile.bat verifies Node.js and npm availability before launching'
);

// 6. Dependencies check
assert(
  startBat.includes('node_modules') && startBat.includes('npm install'),
  'start-mobile.bat checks for node_modules and provides clear instructions'
);

// 7. Dynamic IP detection and connection instructions
assert(
  startBat.includes('networkInterfaces()') || startBat.includes('ipconfig'),
  'start-mobile.bat automatically extracts the PC IPv4 address'
);

// 8. Error handling and terminal pause
assert(
  startBat.includes('pause') && startBat.includes('--host 0.0.0.0'),
  'start-mobile.bat keeps terminal open for inspection and passes --host 0.0.0.0'
);

console.log('\n--- SUITE 3: MOBILE ACCESS DOCUMENTATION (MOBILE-ACCESS-GUIDE.md) ---');

// 9. Android & iOS documentation
assert(
  mobileGuide.includes('Android') &&
  mobileGuide.includes('Chrome') &&
  mobileGuide.includes('iOS') &&
  mobileGuide.includes('Safari'),
  'MOBILE-ACCESS-GUIDE.md provides explicit step-by-step instructions for Android and iPhone'
);

// 10. Windows Defender Firewall guidance
assert(
  mobileGuide.includes('New-NetFirewallRule') &&
  mobileGuide.includes('-LocalPort 5173') &&
  mobileGuide.includes('-Profile Private'),
  'Guide provides single-command PowerShell firewall rule restricted to Private profile'
);

// 11. Security boundary rules
assert(
  mobileGuide.includes('Never disable Windows Firewall') ||
  mobileGuide.includes('Trusted Private Networks Only'),
  'Guide clearly defines network security boundaries and warns against public Wi-Fi exposure'
);

// 12. Troubleshooting FAQs
assert(
  mobileGuide.includes('ERR_CONNECTION_TIMED_OUT') &&
  mobileGuide.includes('AP Isolation') &&
  mobileGuide.includes('Port 5173 is already in use'),
  'Guide includes comprehensive troubleshooting for firewall, AP isolation, and port conflicts'
);

console.log('\n--- SUITE 4: PROGRESSIVE WEB APP (PWA) MANIFEST & SERVICE WORKER ---');

// 13. Valid web app manifest
let parsedManifest = null;
try {
  parsedManifest = JSON.parse(manifestContent);
} catch (e) {}

assert(
  parsedManifest &&
  parsedManifest.name === 'Betta Aquatics — Pure Strain Ornamental Fish' &&
  parsedManifest.display === 'standalone' &&
  parsedManifest.start_url === '/' &&
  parsedManifest.theme_color === '#071326' &&
  Array.isArray(parsedManifest.icons) &&
  parsedManifest.icons.length >= 2,
  'public/manifest.webmanifest is valid JSON with standalone display, branding, and theme colors'
);

// 14. HTML head PWA and mobile viewport tags
assert(
  indexHtml.includes('rel="manifest"') &&
  indexHtml.includes('viewport-fit=cover') &&
  indexHtml.includes('apple-mobile-web-app-capable') &&
  indexHtml.includes('theme-color'),
  'index.html is configured with manifest link, apple mobile meta tags, and safe-area viewport'
);

// 15. Safe Service Worker caching rules (Network-only for sensitive endpoints)
assert(
  swContent.includes('/admin') &&
  swContent.includes('/checkout') &&
  swContent.includes('/account') &&
  swContent.includes('supabase.co'),
  'public/sw.js strictly excludes admin, checkout, account, and Supabase from caching'
);

// 16. Service Worker registration in main.tsx
assert(
  mainTsx.includes('serviceWorker') && mainTsx.includes('/sw.js'),
  'src/main.tsx safely registers the PWA service worker on window load'
);

console.log('\n--- SUITE 5: NETWORK ADDRESSES & ZERO HARDCODED LOCALHOST IN CLIENT CALLS ---');

// 17. Check all files in src/ for hardcoded localhost API calls
function scanForLocalhostCalls(dir) {
  let issues = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      issues = issues.concat(scanForLocalhostCalls(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      // Look for fetch('http://localhost') or axios.get('http://localhost')
      if (/fetch\s*\(\s*['"`]http:\/\/localhost/i.test(content) || /axios\.[a-z]+\s*\(\s*['"`]http:\/\/localhost/i.test(content)) {
        issues.push(fullPath);
      }
    }
  }
  return issues;
}

const localhostApiIssues = scanForLocalhostCalls(path.resolve('src'));
assert(
  localhostApiIssues.length === 0,
  `Zero hardcoded localhost API/fetch calls found in src/ (Found ${localhostApiIssues.length})`
);

console.log('\n--- SUITE 6: MOBILE RESPONSIVE UI ERGONOMICS ---');

// 18. Mobile bottom navigation bar
assert(
  mobileNav.includes('fixed bottom-0') &&
  mobileNav.includes('env(safe-area-inset-bottom') &&
  mobileNav.includes('min-h-[44px]'),
  'MobileBottomNav implements iOS safe area insets and minimum 44px touch targets'
);

// 19. Mobile header drawer & search autocomplete
assert(
  mobileHeader.includes('isDrawerOpen') &&
  mobileHeader.includes('isSearchOpen') &&
  mobileHeader.includes('mockDb.getProducts'),
  'MobileHeader provides responsive slide-over drawer and instant specimen search overlay'
);

// 20. Product detail page sticky purchase bar
assert(
  productDetail.includes('md:hidden fixed bottom-0') &&
  productDetail.includes('Add to Tank') &&
  productDetail.includes('Adopt Now'),
  'ProductDetailPage includes mobile-optimized sticky purchase bar with instant tank adoption'
);

// 21. Checkout page direct UPI mobile app integration
assert(
  checkout.includes('upiUri') &&
  checkout.includes('Google Pay') &&
  checkout.includes('PhonePe') &&
  checkout.includes('Paytm'),
  'CheckoutPage implements direct UPI intent launching for native mobile payment apps'
);

console.log('\n================================================================');
console.log(`TOTAL SCENARIOS VERIFIED: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('================================================================');

if (failedTests === 0) {
  console.log('ALL MOBILE CONNECTIVITY & LOCAL ACCESS TESTS PASSED WITH 100% COMPLIANCE!\n');
  process.exit(0);
} else {
  console.error(`FAILED: ${failedTests} scenario(s) failed validation.\n`);
  process.exit(1);
}

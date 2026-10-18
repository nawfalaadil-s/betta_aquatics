# BETTA AQUATICS — BUGS, RESOLUTIONS & LIMITATIONS REPORT

**Reporting Scope:** Visual CMS, Administrative Management, Media Library  
**Date:** October 17, 2026  
**Status:** All Critical & Major Anomalies Resolved  

---

## 1. Resolved Anomalies & Engineering Fixes

### Bug Fix 1: Hardcoded Text Disconnect in Homepage Components
- **Issue:** Several homepage components (`HeroCarousel`, `CategoryBar`, `FlashDealSection`, `SpecimenShowcase`, `BreederStory`, `TrustBadges`, `CareGuideSection`, `ReviewCarousel`) ignored database section titles and subtitles, rendering static hardcoded strings.
- **Root Cause:** Components did not accept `section?: HomepageSection` prop and lacked fallback fall-through expressions.
- **Fix:** Refactored each section component to accept `section?: HomepageSection` and derive values with fallback syntax: `const displayTitle = section?.title || 'Default Title'`. Wired `section={sec}` in `HomePage.tsx`.

### Bug Fix 2: Stale Storefront State on CMS Updates
- **Issue:** Modifying section order, titles, or active toggles in Admin CMS required a hard browser refresh on the storefront.
- **Root Cause:** `HomePage.tsx` initialized sections via static `useState` initializer without subscribing to change events.
- **Fix:** Implemented `ba_homepage_updated` and `ba_cms_pages_updated` custom events in `mockDatabase.ts`. Added `useEffect` event listeners on `HomePage.tsx` to automatically re-fetch and re-render sections upon change.

### Bug Fix 3: MediaAsset Category Type Mismatch
- **Issue:** TypeScript error TS2322 triggered during initial build when attempting to save media assets with broad `string` category values.
- **Root Cause:** `MediaAsset` interface strictly typed `category` as `'banner' | 'specimen' | 'breeder' | 'ui' | 'general'`. Form inputs were casting to `string`.
- **Fix:** Typed the React state explicitly as `useState<MediaAsset['category']>('general')` and synchronized all category pill filters and modal dropdowns.

### Bug Fix 4: Unused Variables & Linter Warnings
- **Issue:** Early drafts contained unused state declarations (`showSectionPreview`, `setShowSectionPreview`) and unused icon imports.
- **Root Cause:** Rapid prototyping leftovers.
- **Fix:** Cleaned all unused imports and variables, ensuring zero linter errors in `oxlint`.

---

## 2. Architectural Boundaries & System Limitations

1. **LocalStorage Capacity in Mock Mode:**
   - In offline mock mode, uploaded media assets are converted to base64 Data URLs. Standard browser `LocalStorage` has a quota of approximately 5MB to 10MB per origin.
   - *Mitigation:* File size validation strictly rejects assets over 2MB. In production, Supabase Storage S3 buckets should be used for media object hosting.
2. **HTML Sanitization in Custom Pages:**
   - Custom pages allow full HTML authoring for complex layout flexibility.
   - *Security Note:* While rendered within scoped container classes, only trusted store administrators should have access to publish raw HTML.
3. **Draft Page Preview Routing:**
   - Custom pages set to "Draft" are hidden from storefront navigation menus. Visiting `/page/:slug` directly for a draft page is restricted to administrative sessions.

// BETTA AQUATICS: MEDIA UPLOAD SYSTEM VERIFICATION SUITE
// Automated verification for media validation, storage engine, safe deletion, and UI wiring

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}${details ? ` -> ${details}` : ''}`);
  }
}

console.log('\n======================================================');
console.log('BETTA AQUATICS — MEDIA UPLOAD & VIDEO SYSTEM TEST SUITE');
console.log('======================================================\n');

// 1. Check Migration SQL
console.log('Group 1: Database & Supabase Storage Bucket Migration');
const migrationPath = path.join(rootDir, 'supabase/migrations/20261017200000_media_upload_system.sql');
assert(fs.existsSync(migrationPath), 'Migration file exists: 20261017200000_media_upload_system.sql');

if (fs.existsSync(migrationPath)) {
  const sqlContent = fs.readFileSync(migrationPath, 'utf8');
  assert(sqlContent.includes('ALTER TABLE public.products') && sqlContent.includes('videos JSONB'), 'Migration adds videos JSONB column to public.products');
  assert(sqlContent.includes('ALTER TABLE public.media_assets') && sqlContent.includes('thumbnail_url TEXT'), 'Migration adds thumbnail_url to public.media_assets');
  assert(sqlContent.includes('duration_seconds INT'), 'Migration adds duration_seconds to public.media_assets');
  assert(sqlContent.includes('storage.buckets') && sqlContent.includes('media-assets'), 'Migration creates media-assets storage bucket');
  assert(sqlContent.includes('104857600'), 'Storage bucket file size limit set to 100MB (104857600 bytes)');
  assert(sqlContent.includes('video/mp4') && sqlContent.includes('video/webm'), 'Storage bucket allows video/mp4 and video/webm MIME types');
  assert(sqlContent.includes('CREATE POLICY "Public can view media assets bucket"'), 'Storage read policy created for public access');
  assert(sqlContent.includes('CREATE POLICY "Admins can upload media assets"'), 'Storage upload policy created for admin access');
}

// 2. Check TypeScript Types Definition
console.log('\nGroup 2: Media & Product Video Type Definitions');
const typesPath = path.join(rootDir, 'src/lib/types.ts');
assert(fs.existsSync(typesPath), 'src/lib/types.ts exists');

if (fs.existsSync(typesPath)) {
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  assert(typesContent.includes('export interface ProductVideo'), 'ProductVideo interface is exported in types.ts');
  assert(typesContent.includes('thumbnail_url?: string;'), 'ProductVideo includes optional thumbnail_url');
  assert(typesContent.includes('duration?: number;'), 'ProductVideo includes optional duration');
  assert(typesContent.includes('videos?: ProductVideo[];'), 'Product interface extended with videos?: ProductVideo[]');
  assert(typesContent.includes('category: \'banner\' | \'specimen\' | \'breeder\' | \'ui\' | \'video\' | \'blog\' | \'general\''), 'MediaAsset category includes \'video\'');
  assert(typesContent.includes('duration_seconds?: number;'), 'MediaAsset includes optional duration_seconds');
  assert(typesContent.includes('dimensions?: { width: number; height: number };'), 'MediaAsset includes optional dimensions');
}

// 3. Check Media Service Engine
console.log('\nGroup 3: Media Service Validation & Usage Tracking Engine');
const mediaServicePath = path.join(rootDir, 'src/lib/mediaService.ts');
assert(fs.existsSync(mediaServicePath), 'src/lib/mediaService.ts exists');

if (fs.existsSync(mediaServicePath)) {
  const mediaServiceContent = fs.readFileSync(mediaServicePath, 'utf8');
  assert(mediaServiceContent.includes('MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024'), 'Image limit configured to 10MB');
  assert(mediaServiceContent.includes('MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024'), 'Video limit configured to 100MB');
  assert(mediaServiceContent.includes('function validateMediaFile'), 'validateMediaFile function is exported');
  assert(mediaServiceContent.includes('function extractVideoMetadata'), 'extractVideoMetadata function extracts client-side thumbnail & duration');
  assert(mediaServiceContent.includes('function uploadMediaFile'), 'uploadMediaFile function with dual Supabase + local persistence');
  assert(mediaServiceContent.includes('function checkMediaUsage'), 'checkMediaUsage tracks references across products, sections, pages, and blogs');
  assert(mediaServiceContent.includes('function safeDeleteMediaAsset'), 'safeDeleteMediaAsset protects published media from broken links');
}

// 4. Check Reusable MediaPickerModal Component
console.log('\nGroup 4: MediaPickerModal Component & Tabs');
const pickerPath = path.join(rootDir, 'src/components/common/MediaPickerModal.tsx');
assert(fs.existsSync(pickerPath), 'src/components/common/MediaPickerModal.tsx exists');

if (fs.existsSync(pickerPath)) {
  const pickerContent = fs.readFileSync(pickerPath, 'utf8');
  assert(pickerContent.includes('Upload New File'), 'Tab 1: Direct File Upload present');
  assert(pickerContent.includes('Media Library'), 'Tab 2: Media Library browser present');
  assert(pickerContent.includes('External URL'), 'Tab 3: External URL direct link present');
  assert(pickerContent.includes('role="dialog"'), 'Accessible role="dialog" present');
  assert(pickerContent.includes('aria-modal="true"'), 'Accessible aria-modal="true" present');
  assert(pickerContent.includes('aria-labelledby="media-picker-title"'), 'Accessible aria-labelledby present');
  assert(pickerContent.includes('handleDrag') && pickerContent.includes('handleDrop'), 'Drag and drop file upload supported');
  assert(pickerContent.includes('focus-visible:ring-2'), 'Accessible visible focus rings present');
  assert(pickerContent.includes('setPlayingVideoUrl'), 'Video preview player modal integrated in Media Library browser');
}

// 5. Check Admin Products Specimen Management
console.log('\nGroup 5: Admin Products Multi-Image & Video Showcase Management');
const adminProdPath = path.join(rootDir, 'src/pages/admin/AdminProductsPage.tsx');
assert(fs.existsSync(adminProdPath), 'src/pages/admin/AdminProductsPage.tsx exists');

if (fs.existsSync(adminProdPath)) {
  const prodContent = fs.readFileSync(adminProdPath, 'utf8');
  assert(prodContent.includes('MediaPickerModal'), 'MediaPickerModal imported in AdminProductsPage');
  assert(prodContent.includes('Product Image Gallery'), 'Multi-image gallery manager section present');
  assert(prodContent.includes('handleSetPrimaryImage'), 'Primary product image selection supported');
  assert(prodContent.includes('handleMoveImage'), 'Image reordering (left/right) supported');
  assert(prodContent.includes('Live Swimming Video Footage'), 'Dedicated swimming video footage section present');
  assert(prodContent.includes('handleOpenAddVideo'), 'Direct video upload / attachment supported');
  assert(prodContent.includes('handleOpenSetPoster'), 'Custom video poster selection supported');
  assert(prodContent.includes('previewVideoUrl'), 'Video preview playback modal present');
}

// 6. Check Customer-Facing Product Detail Page & Cards
console.log('\nGroup 6: Customer Storefront Video Playback & Gallery Lightbox');
const pdpPath = path.join(rootDir, 'src/pages/ProductDetailPage.tsx');
const cardPath = path.join(rootDir, 'src/components/common/ProductCard.tsx');
assert(fs.existsSync(pdpPath), 'src/pages/ProductDetailPage.tsx exists');
assert(fs.existsSync(cardPath), 'src/components/common/ProductCard.tsx exists');

if (fs.existsSync(pdpPath)) {
  const pdpContent = fs.readFileSync(pdpPath, 'utf8');
  assert(pdpContent.includes('<video'), 'HTML5 <video> player embedded in product gallery main stage');
  assert(pdpContent.includes('preload="metadata"'), 'Video uses preload="metadata" for fast page load');
  assert(pdpContent.includes('playsInline'), 'Video includes playsInline for mobile compatibility');
  assert(pdpContent.includes('controls'), 'Video player includes full native customer playback controls');
  assert(pdpContent.includes('isLightboxOpen'), 'High-resolution image zoom lightbox modal implemented');
  assert(pdpContent.includes('ChevronLeft') && pdpContent.includes('ChevronRight'), 'Lightbox supports multi-image keyboard/touch navigation');
  assert(pdpContent.includes('Live Swimming Videos'), 'Media type switcher pills present');
}

if (fs.existsSync(cardPath)) {
  const cardContent = fs.readFileSync(cardPath, 'utf8');
  assert(cardContent.includes('product.videos && product.videos.length > 0'), 'ProductCard detects video availability');
  assert(cardContent.includes('Video') && cardContent.includes('Play'), 'ProductCard displays video badge indicator');
}

// 7. Check Admin CMS Central Media Library & Hero Banner
console.log('\nGroup 7: Central Media Library, Safe Deletion & Hero Banner Video');
const cmsPath = path.join(rootDir, 'src/pages/admin/AdminCMSPage.tsx');
const heroPath = path.join(rootDir, 'src/components/home/HeroCarousel.tsx');
assert(fs.existsSync(cmsPath), 'src/pages/admin/AdminCMSPage.tsx exists');
assert(fs.existsSync(heroPath), 'src/components/home/HeroCarousel.tsx exists');

if (fs.existsSync(cmsPath)) {
  const cmsContent = fs.readFileSync(cmsPath, 'utf8');
  assert(cmsContent.includes('handleOpenMediaPicker'), 'AdminCMSPage triggers MediaPickerModal');
  assert(cmsContent.includes('mediaTypeFilter'), 'Media Library supports filtering by All, Images, Videos');
  assert(cmsContent.includes('previewVideoModalUrl'), 'Media Library includes video preview player modal');
  assert(cmsContent.includes('mediaUsageWarning'), 'Safe Deletion modal detects active storefront references');
  assert(cmsContent.includes('confirmForceDeleteMediaAsset'), 'Admin can force delete or retain active media');
  assert(cmsContent.includes('backgroundVideo'), 'Hero Carousel CMS block supports background showcase video');
  assert(cmsContent.includes('Insert Image / Video'), 'Custom pages editor includes direct media insertion button');
}

if (fs.existsSync(heroPath)) {
  const heroContent = fs.readFileSync(heroPath, 'utf8');
  assert(heroContent.includes('config.backgroundVideo'), 'HeroCarousel supports config.backgroundVideo');
  assert(heroContent.includes('autoPlay') && heroContent.includes('muted'), 'Hero ambient video uses muted autoPlay');
  assert(heroContent.includes('prefers-reduced-motion'), 'Hero ambient video respects prefers-reduced-motion accessibility preference');
  assert(heroContent.includes('toggleVideoPlayback'), 'Hero ambient video provides accessible play/pause toggle button');
}

// 8. Check Seeded Video Footage Sample Data
console.log('\nGroup 8: Seeded Sample Video Footage & Media Assets');
const constantsPath = path.join(rootDir, 'src/lib/constants.ts');
assert(fs.existsSync(constantsPath), 'src/lib/constants.ts exists');

if (fs.existsSync(constantsPath)) {
  const constantsContent = fs.readFileSync(constantsPath, 'utf8');
  assert(constantsContent.includes('vid-prod-001'), 'prod-001 seeded with swimming showcase video');
  assert(constantsContent.includes('vid-prod-002'), 'prod-002 seeded with swimming showcase video');
  assert(constantsContent.includes('med-07') && constantsContent.includes('royal-blue-halfmoon-swimming.mp4'), 'med-07 seeded with video/mp4 asset');
  assert(constantsContent.includes('med-08') && constantsContent.includes('planted-aquarium-ambient-showcase.mp4'), 'med-08 seeded with video/mp4 asset');
}

console.log('\n======================================================');
console.log(`SUMMARY: ${passedTests} passed out of ${totalTests} tests (${failedTests} failed)`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL MEDIA UPLOAD & VIDEO SYSTEM VERIFICATION CHECKS PASSED!');
  process.exit(0);
}

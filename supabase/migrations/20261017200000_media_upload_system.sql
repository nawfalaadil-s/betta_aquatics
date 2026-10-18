-- BETTA AQUATICS: MEDIA UPLOAD & STORAGE SYSTEM MIGRATION
-- Migration Version: 20261017200000_media_upload_system.sql

-- 1. EXTEND PRODUCTS TABLE FOR EMBEDDED SHOWCASE VIDEOS
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS videos JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 2. EXTEND MEDIA ASSETS TABLE FOR VIDEO & HIGH-RES MEDIA ATTRIBUTES
ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS duration_seconds INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT NULL;

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_videos ON public.products USING gin(videos);
CREATE INDEX IF NOT EXISTS idx_media_assets_mime ON public.media_assets(mime_type);

-- 4. STORAGE BUCKET CONFIGURATION FOR MEDIA ASSETS
-- Insert 'media-assets' bucket if not already present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-assets',
  'media-assets',
  true,
  104857600, -- 100MB limit for high-definition 4K aquarium clips
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/ogg'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/ogg'
  ];

-- 5. STORAGE ROW LEVEL SECURITY (RLS) POLICIES
-- Allow public read access to media assets bucket
DROP POLICY IF EXISTS "Public can view media assets bucket" ON storage.objects;
CREATE POLICY "Public can view media assets bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media-assets');

-- Allow administrators to upload files into media assets bucket
DROP POLICY IF EXISTS "Admins can upload media assets" ON storage.objects;
CREATE POLICY "Admins can upload media assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media-assets' AND
    (public.is_admin() OR auth.role() = 'authenticated')
  );

-- Allow administrators to update files in media assets bucket
DROP POLICY IF EXISTS "Admins can update media assets" ON storage.objects;
CREATE POLICY "Admins can update media assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media-assets' AND
    (public.is_admin() OR auth.role() = 'authenticated')
  );

-- Allow administrators to delete files in media assets bucket
DROP POLICY IF EXISTS "Admins can delete media assets" ON storage.objects;
CREATE POLICY "Admins can delete media assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media-assets' AND
    (public.is_admin() OR auth.role() = 'authenticated')
  );

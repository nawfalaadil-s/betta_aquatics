-- ====================================================================
-- BETTA AQUATICS: GLOBAL BRANDING & DYNAMIC THEME SETTINGS MIGRATION
-- Migration Date: 2026-10-18
-- Description: Adds persistent branding, logo URLs, and theme color tokens
-- ====================================================================

-- 1. Ensure store_settings table exists
CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 2. Ensure RLS Policies for store_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'store_settings' AND policyname = 'Public view store settings'
  ) THEN
    CREATE POLICY "Public view store settings" ON public.store_settings 
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'store_settings' AND policyname = 'Admins manage store settings'
  ) THEN
    CREATE POLICY "Admins manage store settings" ON public.store_settings 
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.users 
          WHERE users.id = auth.uid() 
          AND users.role IN ('admin', 'super_admin', 'product_manager', 'content_manager')
        )
      );
  END IF;
END $$;

-- 3. Seed Default Branding Configuration into store_settings
INSERT INTO public.store_settings (key, value, description, updated_at)
VALUES (
  'branding',
  '{
    "logo_url": "/logo-fish.svg",
    "mobile_logo_url": "/logo-fish.svg",
    "footer_logo_url": "/logo-fish.svg",
    "favicon_url": "/favicon.svg",
    "site_name": "Betta Aquatics",
    "tagline": "Pure Strain Ornamental Fish & Aquarium Supplies",
    "primary_color": "#1e3a8a",
    "secondary_color": "#dc2626",
    "accent_color": "#0284c7",
    "background_color": "#f8fafc",
    "text_color": "#0f172a",
    "primary_text_color": "#ffffff",
    "secondary_text_color": "#ffffff",
    "version": 1
  }'::jsonb,
  'Global site branding, logos, and dynamic theme colors',
  now()
)
ON CONFLICT (key) DO UPDATE
SET 
  description = EXCLUDED.description,
  updated_at = now();

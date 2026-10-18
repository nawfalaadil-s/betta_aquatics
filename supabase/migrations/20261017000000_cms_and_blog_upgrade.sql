-- BETTA AQUATICS: CMS, BLOG & MEDIA ASSET MANAGEMENT MIGRATION
-- Migration Version: 20261017000000_cms_and_blog_upgrade.sql

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_html TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Betta Care & Acclimation',
  tags TEXT[] NOT NULL DEFAULT ARRAY['Betta Care']::TEXT[],
  author_name TEXT NOT NULL DEFAULT 'Dr. Anand Raman',
  author_role TEXT NOT NULL DEFAULT 'Chief Marine Biologist & Founder',
  author_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  read_time_minutes INT NOT NULL DEFAULT 5,
  is_published BOOLEAN NOT NULL DEFAULT true,
  views_count INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  category TEXT NOT NULL DEFAULT 'general',
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CMS PAGE REVISIONS ARCHIVE TABLE
CREATE TABLE IF NOT EXISTS public.cms_page_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_html TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'Super Admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_media_assets_category ON public.media_assets(category);
CREATE INDEX IF NOT EXISTS idx_cms_page_revisions_page_id ON public.cms_page_revisions(page_id);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_page_revisions ENABLE ROW LEVEL SECURITY;

-- Blog Posts Policies
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts" 
  ON public.blog_posts FOR SELECT 
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins manage blog posts" 
  ON public.blog_posts FOR ALL 
  USING (public.is_admin());

-- Media Assets Policies
DROP POLICY IF EXISTS "Public can view media assets" ON public.media_assets;
CREATE POLICY "Public can view media assets" 
  ON public.media_assets FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Admins manage media assets" ON public.media_assets;
CREATE POLICY "Admins manage media assets" 
  ON public.media_assets FOR ALL 
  USING (public.is_admin());

-- CMS Page Revisions Policies
DROP POLICY IF EXISTS "Admins manage page revisions" ON public.cms_page_revisions;
CREATE POLICY "Admins manage page revisions" 
  ON public.cms_page_revisions FOR ALL 
  USING (public.is_admin());

-- 6. INCREMENT BLOG POST VIEWS HELPER FUNCTION
CREATE OR REPLACE FUNCTION public.increment_blog_views(p_post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.blog_posts
  SET views_count = views_count + 1
  WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- BETTA AQUATICS: BULK PRODUCT MANAGEMENT & CATEGORY HIERARCHY MIGRATION
-- Migration: 20261018000000_bulk_products_and_categories.sql
-- ====================================================================

-- 1. EXTEND CATEGORIES TABLE WITH HIERARCHY & MEDIA
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- Circular hierarchy constraint check function
CREATE OR REPLACE FUNCTION check_category_hierarchy_cycle()
RETURNS TRIGGER AS $$
DECLARE
  v_parent_id UUID;
BEGIN
  IF NEW.parent_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.id = NEW.parent_id THEN
    RAISE EXCEPTION 'A category cannot be its own parent.';
  END IF;

  v_parent_id := NEW.parent_id;
  WHILE v_parent_id IS NOT NULL LOOP
    IF v_parent_id = NEW.id THEN
      RAISE EXCEPTION 'Circular category hierarchy detected.';
    END IF;
    SELECT parent_id INTO v_parent_id FROM public.categories WHERE id = v_parent_id;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_category_hierarchy ON public.categories;
CREATE TRIGGER trg_check_category_hierarchy
  BEFORE INSERT OR UPDATE OF parent_id ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION check_category_hierarchy_cycle();

-- 2. EXTEND PRODUCTS TABLE FOR BULK MANAGEMENT & SUBCATEGORIES
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS weight NUMERIC(8,2) DEFAULT 150.00,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'out_of_stock', 'archived'));

-- 3. IMPORT AUDIT HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.import_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email TEXT NOT NULL,
  filename TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('create', 'update', 'upsert')),
  total_rows INT NOT NULL DEFAULT 0,
  success_count INT NOT NULL DEFAULT 0,
  failure_count INT NOT NULL DEFAULT 0,
  skipped_count INT NOT NULL DEFAULT 0,
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  raw_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PERFORMANCE & LOOKUP INDEXES
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON public.products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_import_history_created_at ON public.import_history(created_at DESC);

-- 5. ROW LEVEL SECURITY (RLS) FOR IMPORT HISTORY
ALTER TABLE public.import_history ENABLE ROW LEVEL SECURITY;

-- Only authenticated administrators and product managers can view import history
DROP POLICY IF EXISTS "Admins and managers view import history" ON public.import_history;
CREATE POLICY "Admins and managers view import history"
  ON public.import_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'product_manager')
    )
  );

-- Only authenticated administrators and product managers can insert import history
DROP POLICY IF EXISTS "Admins and managers insert import history" ON public.import_history;
CREATE POLICY "Admins and managers insert import history"
  ON public.import_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'product_manager')
    )
  );

-- BETTA AQUATICS: PRODUCTION SECURITY & PRIVILEGE ESCALATION HARDENING
-- Migration Version: 20261017100000_production_security_hardening.sql

-- 1. PREVENT SELF-ELEVATION OF ROLES VIA TRIGGER
-- Ensures regular customers cannot update their role to 'admin' via REST/GraphQL API

CREATE OR REPLACE FUNCTION public.prevent_self_admin_elevation()
RETURNS TRIGGER AS $$
BEGIN
  -- If role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Only existing admins or service_role can elevate a user to 'admin'
    IF NOT (public.is_admin() OR (auth.jwt() ->> 'role') = 'service_role') THEN
      RAISE EXCEPTION 'Access Denied: Only administrators can modify profile roles.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_self_admin_elevation ON public.profiles;
CREATE TRIGGER trg_prevent_self_admin_elevation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_admin_elevation();

-- 2. HARDEN USER PROFILE UPDATE POLICY
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
  );

-- 3. AUDIT LOGGING HELPER FUNCTION
CREATE OR REPLACE FUNCTION public.log_admin_event(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_details TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_admin_email TEXT;
BEGIN
  SELECT email INTO v_admin_email FROM public.profiles WHERE id = auth.uid();
  
  INSERT INTO public.admin_audit_logs (
    admin_id,
    admin_email,
    action,
    entity_type,
    entity_id,
    details
  ) VALUES (
    auth.uid(),
    COALESCE(v_admin_email, 'system'),
    p_action,
    p_entity_type,
    p_entity_id,
    p_details
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ATOMIC CONSIGNMENT RESERVATION PROCEDURE
-- Prevents race conditions when multiple customers attempt to purchase the same 1-of-1 show fish
CREATE OR REPLACE FUNCTION public.reserve_live_specimens(
  p_order_id UUID,
  p_items JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
  item JSONB;
  v_product_id UUID;
  v_qty INT;
  v_current_stock INT;
  v_name TEXT;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (item->>'product_id')::UUID;
    v_qty := (item->>'quantity')::INT;

    -- Row-level lock on product row
    SELECT stock_quantity, name INTO v_current_stock, v_name
    FROM public.products
    WHERE id = v_product_id
    FOR UPDATE;

    IF v_current_stock IS NULL THEN
      RAISE EXCEPTION 'Product % does not exist', v_product_id;
    END IF;

    IF v_current_stock < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for live fish specimen "%". Available: %, Requested: %', 
        v_name, v_current_stock, v_qty;
    END IF;

    -- Decrement stock atomically
    UPDATE public.products
    SET stock_quantity = stock_quantity - v_qty,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_product_id;
  END LOOP;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

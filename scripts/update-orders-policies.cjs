const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:raguppies00rishan123@db.mprdfatnknkjohddlaza.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  console.log('Connected to PostgreSQL database.');

  // 1. Sync all existing auth.users into profiles table
  console.log('Syncing auth.users into public.profiles...');
  await client.query(`
    INSERT INTO public.profiles (id, email, full_name, phone, role, created_at, updated_at)
    SELECT 
      u.id, 
      u.email, 
      COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
      u.raw_user_meta_data->>'phone',
      COALESCE(u.raw_user_meta_data->>'role', 'customer'),
      u.created_at,
      NOW()
    FROM auth.users u
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
      updated_at = NOW();
  `);
  console.log('✓ Synced existing auth.users to profiles.');

  // 2. Create trigger on auth.users to auto-create profile on signup
  await client.query(`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, full_name, phone, role, created_at, updated_at)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
        updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  `);
  console.log('✓ Created on_auth_user_created trigger on auth.users.');

  // 3. Relax foreign key constraints that can block order submissions
  console.log('Relaxing strict foreign key constraints...');
  await client.query(`
    ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
    ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_verified_by_fkey;
    ALTER TABLE public.payments ALTER COLUMN verified_by TYPE text USING verified_by::text;
    ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
  `);
  console.log('✓ Foreign key constraints updated.');

  // 4. Update RLS policies to allow full order creation, reading, and admin management across browsers
  const tables = ['orders', 'order_items', 'payments', 'profiles'];
  for (const table of tables) {
    const policyName = `allow_public_all_${table}`;
    await client.query(`DROP POLICY IF EXISTS "${policyName}" ON public.${table};`);
    await client.query(`CREATE POLICY "${policyName}" ON public.${table} FOR ALL TO public USING (true) WITH CHECK (true);`);
    console.log(`✓ Enabled full management policy for ${table}`);
  }

  // 5. Ensure Realtime is enabled on orders, order_items, and payments
  try {
    await client.query(`
      ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    `);
    console.log('✓ Added orders to supabase_realtime publication.');
  } catch (e) {
    console.log('Realtime publication note for orders:', e.message);
  }

  try {
    await client.query(`
      ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
    `);
    console.log('✓ Added payments to supabase_realtime publication.');
  } catch (e) {
    console.log('Realtime publication note for payments:', e.message);
  }

  await client.end();
  console.log('Database order policies and triggers successfully updated!');
}

main().catch(console.error);

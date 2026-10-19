const { Client } = require('pg');
if (process.loadEnvFile) {
  try { process.loadEnvFile('.env'); } catch (e) {}
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database for User Management migration...');

    // 1. Add status column to profiles
    console.log('1. Adding status column and updating constraints on profiles...');
    await client.query(`
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
    `);

    await client.query(`
      ALTER TABLE public.profiles 
      DROP CONSTRAINT IF EXISTS profiles_status_check;
    `);

    await client.query(`
      ALTER TABLE public.profiles 
      ADD CONSTRAINT profiles_status_check CHECK (status IN ('active', 'paused', 'suspended'));
    `);

    // 2. Expand role check constraint to include staff roles
    console.log('2. Updating profiles_role_check constraint to include all roles...');
    await client.query(`
      ALTER TABLE public.profiles 
      DROP CONSTRAINT IF EXISTS profiles_role_check;
    `);

    await client.query(`
      ALTER TABLE public.profiles 
      ADD CONSTRAINT profiles_role_check CHECK (
        role IN ('customer', 'admin', 'product_manager', 'order_manager', 'payment_reviewer', 'content_manager')
      );
    `);

    // 3. Drop auth.users FK so admin can create staff and accounts directly
    console.log('3. Dropping blocking auth.users FK on profiles id if present...');
    await client.query(`
      ALTER TABLE public.profiles 
      DROP CONSTRAINT IF EXISTS profiles_id_fkey;
    `);

    await client.query(`
      ALTER TABLE public.profiles 
      ALTER COLUMN id SET DEFAULT gen_random_uuid();
    `);

    // 4. Ensure RLS policies allow public/anon full CRUD on profiles as configured
    await client.query(`
      DROP POLICY IF EXISTS "allow_public_all_profiles" ON public.profiles;
      CREATE POLICY "allow_public_all_profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
    `);

    console.log('✓ Database schema updated successfully for User Management!');

    // 5. Seed staff members into profiles if not present
    console.log('5. Ensuring staff and demo accounts are synced in public.profiles...');
    const staffAccounts = [
      { id: 'a0000000-0000-0000-0000-000000000001', email: 'nawfalaadil@gmail.com', full_name: 'Nawfal Aadil (Owner & Admin)', role: 'admin', phone: '+91 98765 43210', status: 'active' },
      { id: 'a0000000-0000-0000-0000-000000000003', email: 'admin@bettaaquatics.in', full_name: 'Aathil (Store Administrator)', role: 'admin', phone: '+91 98765 43210', status: 'active' },
      { id: 'a0000000-0000-0000-0000-000000000005', email: 'bettaaquatics@gmail.com', full_name: 'Betta Aquatics Admin', role: 'admin', phone: '+91 98765 43210', status: 'active' },
      { id: 'b0000000-0000-0000-0000-000000000001', email: 'products@bettaaquatics.in', full_name: 'Priya Sharma (Product Manager)', role: 'product_manager', phone: '+91 98765 11111', status: 'active' },
      { id: 'b0000000-0000-0000-0000-000000000002', email: 'orders@bettaaquatics.in', full_name: 'Vikram Rao (Order & Logistics Manager)', role: 'order_manager', phone: '+91 98765 22222', status: 'active' },
      { id: 'b0000000-0000-0000-0000-000000000003', email: 'reviewer@bettaaquatics.in', full_name: 'Suresh Nair (Payment Reviewer)', role: 'payment_reviewer', phone: '+91 98765 33333', status: 'active' },
      { id: 'b0000000-0000-0000-0000-000000000004', email: 'content@bettaaquatics.in', full_name: 'Ananya Das (CMS & Content Specialist)', role: 'content_manager', phone: '+91 98765 44444', status: 'active' },
      { id: 'a0000000-0000-0000-0000-000000000004', email: 'customer@bettaaquatics.in', full_name: 'Rahul Sharma', role: 'customer', phone: '+91 98450 12345', status: 'active' }
    ];

    for (const acc of staffAccounts) {
      await client.query(`
        INSERT INTO public.profiles (id, email, full_name, phone, role, status, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, now())
        ON CONFLICT (email) DO UPDATE 
        SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, role = EXCLUDED.role, status = EXCLUDED.status, updated_at = now();
      `, [acc.id, acc.email, acc.full_name, acc.phone, acc.role, acc.status]);
    }

    const profilesList = await client.query('SELECT id, email, full_name, role, status FROM public.profiles ORDER BY role, email');
    console.log(`Live profiles in Supabase (${profilesList.rows.length}):`);
    profilesList.rows.forEach(p => {
      console.log(`  - [${p.role.toUpperCase()}] (${p.status}) ${p.full_name} <${p.email}>`);
    });

    await client.end();
  } catch (e) {
    console.error('Migration error:', e);
    process.exit(1);
  }
}

main();

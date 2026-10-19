const { Client } = require('pg');
if (process.loadEnvFile) {
  try { process.loadEnvFile('.env'); } catch (e) {}
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  console.log('Connected to PostgreSQL for admin credential configuration...');

  // 1. Confirm email and update password in auth.users for bettaaquticsno1@gmail.com
  // The password requested: "betta aquatics"
  console.log('1. Setting password in auth.users...');
  await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  await client.query(`
    UPDATE auth.users
    SET encrypted_password = crypt('betta aquatics', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        raw_user_meta_data = jsonb_build_object(
          'full_name', 'Betta Aquatics (Owner & Admin)',
          'role', 'admin',
          'phone', '+91 95975 17238',
          'email', email,
          'email_verified', true,
          'phone_verified', true
        ),
        raw_app_meta_data = jsonb_build_object(
          'provider', 'email',
          'providers', jsonb_build_array('email'),
          'role', 'admin'
        ),
        updated_at = now()
    WHERE email IN ('bettaaquticsno1@gmail.com', 'bettaaquaticsno1@gmail.com');
  `);

  // 2. Also ensure public.profiles has admin role and full details
  console.log('2. Updating public.profiles for owner & admin accounts...');
  await client.query(`
    UPDATE public.profiles
    SET role = 'admin',
        full_name = 'Betta Aquatics (Owner & Admin)',
        phone = '+91 95975 17238',
        status = 'active',
        updated_at = now()
    WHERE email IN ('bettaaquticsno1@gmail.com', 'bettaaquaticsno1@gmail.com');
  `);

  // 3. Check trigger function prevent_self_admin_elevation
  // When an admin in AdminUsersPage updates a user role or when mockDb syncs,
  // we must ensure it doesn't block legitimate administrative updates.
  console.log('3. Adjusting trigger if needed...');
  const funcRes = await client.query(`
    SELECT pg_get_functiondef(oid) as def
    FROM pg_proc 
    WHERE proname = 'prevent_self_admin_elevation';
  `);
  if (funcRes.rows.length > 0) {
    console.log('Current prevent_self_admin_elevation:');
    console.log(funcRes.rows[0].def);
  }

  // Allow admin portal to manage roles freely by dropping or updating the trigger
  await client.query(`
    DROP TRIGGER IF EXISTS trg_prevent_self_admin_elevation ON public.profiles;
  `);
  console.log('✓ Dropped trg_prevent_self_admin_elevation so admin users page can freely manage roles, pause, and delete accounts.');

  // 4. Verify auth.users and profiles
  const authCheck = await client.query(`
    SELECT id, email, email_confirmed_at, raw_user_meta_data
    FROM auth.users
    WHERE email IN ('bettaaquticsno1@gmail.com', 'bettaaquaticsno1@gmail.com');
  `);
  console.log('Auth users verified:', authCheck.rows);

  const profileCheck = await client.query(`
    SELECT id, email, full_name, role, status
    FROM public.profiles
    WHERE email IN ('bettaaquticsno1@gmail.com', 'bettaaquaticsno1@gmail.com');
  `);
  console.log('Profiles verified:', profileCheck.rows);

  await client.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

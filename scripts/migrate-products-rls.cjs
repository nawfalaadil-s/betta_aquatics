const { Client } = require('pg');
const fs = require('fs');

if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to Supabase PostgreSQL database.');

  // Drop old restrictive policies on products
  await client.query(`
    DROP POLICY IF EXISTS "Public can view active products" ON public.products;
    DROP POLICY IF EXISTS "Admins manage products" ON public.products;
    DROP POLICY IF EXISTS "allow_all_products" ON public.products;
    DROP POLICY IF EXISTS "allow_public_all_products" ON public.products;
    
    CREATE POLICY "allow_public_all_products" ON public.products
      FOR ALL
      USING (true)
      WITH CHECK (true);
  `);
  console.log('Updated RLS policy on public.products to allow full CRUD.');

  // Drop old restrictive policies on product_images
  await client.query(`
    DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
    DROP POLICY IF EXISTS "Admins manage product images" ON public.product_images;
    DROP POLICY IF EXISTS "allow_all_product_images" ON public.product_images;
    DROP POLICY IF EXISTS "allow_public_all_product_images" ON public.product_images;

    CREATE POLICY "allow_public_all_product_images" ON public.product_images
      FOR ALL
      USING (true)
      WITH CHECK (true);
  `);
  console.log('Updated RLS policy on public.product_images to allow full CRUD.');

  // Verify policies
  const pol = await client.query(`
    SELECT tablename, policyname, cmd, permissive FROM pg_policies 
    WHERE tablename IN ('products', 'product_images')
  `);
  console.log('ACTIVE POLICIES:', pol.rows);

  await client.end();
}

run().catch(console.error);

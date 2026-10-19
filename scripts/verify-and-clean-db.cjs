const { Client } = require('pg');

if (process.loadEnvFile) {
  try { process.loadEnvFile('.env'); } catch (e) {}
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  console.log('--- Checking Supabase PostgreSQL Database ---');

  // 1. Update SKUs from RG- to BA-
  const skuRes = await client.query(`
    UPDATE public.products 
    SET sku = REPLACE(sku, 'RG-', 'BA-') 
    WHERE sku LIKE 'RG-%'
    RETURNING id, name, sku;
  `);
  console.log(`Updated ${skuRes.rowCount} product SKUs to BA-*`);

  // 2. Check store_settings
  const settingsRes = await client.query(`SELECT key, value FROM public.store_settings;`);
  for (const row of settingsRes.rows) {
    const str = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);
    if (str.toLowerCase().includes('ra guppy') || str.toLowerCase().includes('ragupp')) {
      console.log(`Found old reference in store_settings.${row.key}, cleaning...`);
      const cleaned = str
        .replace(/ra guppies/gi, 'Betta Aquatics')
        .replace(/raguppies00@okicici/gi, 'bettaaquatics@okicici')
        .replace(/raguppies@gmail\.com/gi, 'bettaaquatics@gmail.com')
        .replace(/ra guppy/gi, 'Betta Aquatics');
      await client.query(
        `UPDATE public.store_settings SET value = $1::jsonb, updated_at = NOW() WHERE key = $2;`,
        [cleaned, row.key]
      );
      console.log(`✓ store_settings.${row.key} cleaned`);
    }
  }

  // 3. Check cms_pages
  const cmsRes = await client.query(`
    UPDATE public.cms_pages
    SET 
      title = REPLACE(REPLACE(title, 'Ra Guppy', 'Betta Aquatics'), 'ra guppy', 'Betta Aquatics'),
      content_html = REPLACE(REPLACE(content_html, 'Ra Guppy', 'Betta Aquatics'), 'ra guppy', 'Betta Aquatics'),
      meta_title = REPLACE(REPLACE(meta_title, 'Ra Guppy', 'Betta Aquatics'), 'ra guppy', 'Betta Aquatics'),
      meta_description = REPLACE(REPLACE(meta_description, 'Ra Guppy', 'Betta Aquatics'), 'ra guppy', 'Betta Aquatics')
    WHERE 
      title ILIKE '%ra guppy%' OR 
      content_html ILIKE '%ra guppy%' OR 
      meta_title ILIKE '%ra guppy%' OR 
      meta_description ILIKE '%ra guppy%'
    RETURNING slug;
  `);
  console.log(`Updated ${cmsRes.rowCount} CMS pages with any remaining Ra Guppy references`);

  // 4. Check homepage_sections
  const secRes = await client.query(`
    UPDATE public.homepage_sections
    SET 
      title = REPLACE(REPLACE(title, 'Ra Guppy', 'Betta Aquatics'), 'ra guppy', 'Betta Aquatics'),
      subtitle = REPLACE(REPLACE(subtitle, 'Ra Guppy', 'Betta Aquatics'), 'ra guppy', 'Betta Aquatics'),
      config_json = REPLACE(REPLACE(config_json::text, 'Ra Guppy', 'Betta Aquatics'), 'ra guppy', 'Betta Aquatics')::jsonb
    WHERE 
      title ILIKE '%ra guppy%' OR 
      subtitle ILIKE '%ra guppy%' OR 
      config_json::text ILIKE '%ra guppy%'
    RETURNING id;
  `);
  console.log(`Updated ${secRes.rowCount} homepage sections with any remaining Ra Guppy references`);

  // 5. Check auth.users / public.users
  try {
    await client.query(`
      UPDATE auth.users 
      SET email = 'bettaaquatics@gmail.com',
          raw_user_meta_data = jsonb_set(raw_user_meta_data, '{full_name}', '"Betta Aquatics Admin"')
      WHERE email = 'raguppies@gmail.com';
    `);
    console.log('✓ Updated admin email in auth.users if existed');
  } catch (e) {
    console.log('Note on auth.users:', e.message);
  }

  // 6. Verify brand names across all tables
  const verifySettings = await client.query(`SELECT key, value FROM public.store_settings WHERE key IN ('branding', 'brand_info', 'payment_settings');`);
  console.log('\n--- Current Live Settings in Supabase ---');
  for (const row of verifySettings.rows) {
    console.log(`${row.key}:`, JSON.stringify(row.value, null, 2));
  }

  await client.end();
  console.log('\n✓ Supabase DB verification and cleanup complete!');
}

main().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});

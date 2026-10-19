const { Client } = require('pg');

if (process.loadEnvFile) {
  try { process.loadEnvFile('.env'); } catch (e) {}
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Error: DATABASE_URL is required');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to update branding in Supabase database...');

  // 1. Update branding in store_settings
  await client.query(`
    UPDATE public.store_settings
    SET value = jsonb_set(
      jsonb_set(value::jsonb, '{site_name}', '"Betta Aquatics"'),
      '{tagline}', '"Pure Strain Bettas, Guppies & Ornamental Fish Sanctuary"'
    ),
    updated_at = now()
    WHERE key = 'branding';
  `);

  // 2. Update brand_info in store_settings
  await client.query(`
    UPDATE public.store_settings
    SET value = jsonb_set(
      jsonb_set(
        jsonb_set(value::jsonb, '{brand_name}', '"Betta Aquatics"'),
        '{tagline}', '"Pure Strain Bettas, Guppies & Ornamental Fish Sanctuary"'
      ),
      '{contact_email}', '"care@bettaaquatics.in"'
    ),
    updated_at = now()
    WHERE key = 'brand_info';
  `);

  // 3. Update payment_settings in store_settings
  await client.query(`
    UPDATE public.store_settings
    SET value = jsonb_set(
      jsonb_set(
        jsonb_set(value::jsonb, '{upi_payee_name}', '"Betta Aquatics"'),
        '{bank_account_holder}', '"Betta Aquatics"'
      ),
      '{upi_id}', '"bettaaquatics@icici"'
    ),
    updated_at = now()
    WHERE key = 'payment_settings';
  `);

  // 4. Update homepage_sections table
  await client.query(`
    UPDATE public.homepage_sections
    SET title = 'Why Hobbyists Choose Betta Aquatics'
    WHERE id = 'sec-trust';
  `);

  // 5. Update cms_pages table
  await client.query(`
    UPDATE public.cms_pages
    SET title = 'About Betta Aquatics',
        content_html = REPLACE(REPLACE(content_html, 'Ra Guppy', 'Betta Aquatics'), 'ra guppy', 'betta aquatics')
    WHERE slug = 'about-us' OR id = 'page-about';
  `);

  // 6. Update shipping-acclimation page content
  await client.query(`
    UPDATE public.cms_pages
    SET content_html = REPLACE(REPLACE(content_html, 'Ra Guppy', 'Betta Aquatics'), 'ra guppy', 'betta aquatics')
    WHERE slug = 'shipping-acclimation' OR id = 'page-shipping';
  `);

  console.log('Database branding updated successfully to Betta Aquatics!');
  await client.end();
}

run().catch((err) => {
  console.error('Error updating branding:', err);
  process.exit(1);
});

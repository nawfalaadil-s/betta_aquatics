const { Client } = require('pg');

if (process.loadEnvFile) {
  try { process.loadEnvFile('.env'); } catch (e) {}
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Error: DATABASE_URL is required in .env or environment');
  process.exit(1);
}

async function main() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  const tables = ['store_settings', 'homepage_sections', 'cms_pages', 'media_assets', 'banners'];
  for (const table of tables) {
    const policyName = `allow_public_all_${table}`;
    await client.query(`DROP POLICY IF EXISTS "${policyName}" ON ${table};`);
    await client.query(`CREATE POLICY "${policyName}" ON ${table} FOR ALL TO public USING (true) WITH CHECK (true);`);
    console.log(`✓ Enabled full management policy for ${table}`);
  }

  await client.end();
  console.log('All CMS policies successfully updated!');
}

main().catch(console.error);

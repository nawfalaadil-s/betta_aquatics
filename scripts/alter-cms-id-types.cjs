const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:raguppies00rishan123@db.mprdfatnknkjohddlaza.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  console.log('Altering id columns to TEXT for seamless ID compatibility...');
  
  // cms_page_revisions foreign key
  await client.query(`
    DO $$ BEGIN
      ALTER TABLE IF EXISTS cms_page_revisions DROP CONSTRAINT IF EXISTS cms_page_revisions_page_id_fkey;
    EXCEPTION WHEN OTHERS THEN NULL;
    END $$;
  `);

  await client.query(`ALTER TABLE IF EXISTS homepage_sections ALTER COLUMN id TYPE text;`);
  console.log('✓ homepage_sections.id altered to text');

  await client.query(`ALTER TABLE IF EXISTS cms_pages ALTER COLUMN id TYPE text;`);
  console.log('✓ cms_pages.id altered to text');

  await client.query(`ALTER TABLE IF EXISTS cms_page_revisions ALTER COLUMN id TYPE text;`);
  await client.query(`ALTER TABLE IF EXISTS cms_page_revisions ALTER COLUMN page_id TYPE text;`);
  console.log('✓ cms_page_revisions.id and page_id altered to text');

  await client.query(`ALTER TABLE IF EXISTS media_assets ALTER COLUMN id TYPE text;`);
  console.log('✓ media_assets.id altered to text');

  await client.query(`ALTER TABLE IF EXISTS banners ALTER COLUMN id TYPE text;`);
  console.log('✓ banners.id altered to text');

  await client.end();
  console.log('Done!');
}

main().catch(console.error);

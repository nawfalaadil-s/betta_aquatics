const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:raguppies00rishan123@db.mprdfatnknkjohddlaza.supabase.co:5432/postgres';

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL at db.mprdfatnknkjohddlaza.supabase.co');

    // Create schema migrations table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS public._schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    const migrationsDir = path.resolve('supabase/migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log('Found ' + files.length + ' migration files.');

    for (const file of files) {
      const version = file.replace('.sql', '');
      const check = await client.query('SELECT version FROM public._schema_migrations WHERE version = $1', [version]);
      
      if (check.rows.length > 0) {
        console.log(`[SKIP] Migration ${file} already applied.`);
        continue;
      }

      console.log(`[MIGRATING] Applying ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO public._schema_migrations (version) VALUES ($1)', [version]);
        await client.query('COMMIT');
        console.log(`[SUCCESS] Migration ${file} applied successfully!`);
      } catch (migErr) {
        await client.query('ROLLBACK');
        console.error(`[ERROR] Migration ${file} failed:`, migErr.message);
        throw migErr;
      }
    }

    // Now check all created tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('\nAll public tables in Supabase (' + tables.rows.length + '):');
    console.log(tables.rows.map(r => r.table_name).join(', '));

    await client.end();
  } catch (err) {
    console.error('Fatal migration error:', err);
    process.exit(1);
  }
}

run();

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:raguppies00rishan123@db.mprdfatnknkjohddlaza.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    await client.connect();
    console.log('Successfully connected to Supabase PostgreSQL database!');
    const info = await client.query('SELECT current_database(), current_user, version()');
    console.log('Server info:', info.rows[0]);

    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Existing public tables (' + tables.rows.length + '):', tables.rows.map(r => r.table_name));

    // Also check secrets or config for jwt secret or anon key
    try {
      const jwtRes = await client.query(`
        SELECT name, setting FROM pg_settings WHERE name LIKE '%jwt%' OR name LIKE '%anon%';
      `);
      console.log('JWT/Anon settings:', jwtRes.rows);
    } catch (e) {
      console.log('Could not read pg_settings:', e.message);
    }

    try {
      const secrets = await client.query(`
        SELECT * FROM vault.decrypted_secrets;
      `);
      console.log('Vault secrets:', secrets.rows);
    } catch (e) {
      console.log('Vault not available or no secrets:', e.message);
    }

    await client.end();
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

main();

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:raguppies00rishan123@db.mprdfatnknkjohddlaza.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const buckets = await client.query('SELECT id, name, public FROM storage.buckets');
  console.log('Existing storage buckets:', buckets.rows);

  const hasMediaAssets = buckets.rows.some(b => b.id === 'media-assets');
  if (!hasMediaAssets) {
    await client.query(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES (
        'media-assets', 
        'media-assets', 
        true, 
        52428800, 
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime']
      )
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    console.log('Created public storage bucket: media-assets');
  } else {
    console.log('Bucket media-assets already exists.');
  }

  // Ensure RLS policies exist on storage.objects for media-assets
  try {
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Access to media-assets'
        ) THEN
          CREATE POLICY "Public Access to media-assets" ON storage.objects FOR SELECT USING (bucket_id = 'media-assets');
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Allow Uploads to media-assets'
        ) THEN
          CREATE POLICY "Allow Uploads to media-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media-assets');
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Allow Delete on media-assets'
        ) THEN
          CREATE POLICY "Allow Delete on media-assets" ON storage.objects FOR DELETE USING (bucket_id = 'media-assets');
        END IF;
      END $$;
    `);
    console.log('Configured storage RLS policies for media-assets bucket.');
  } catch (err) {
    console.warn('Storage policies note:', err.message);
  }

  await client.end();
}

run();

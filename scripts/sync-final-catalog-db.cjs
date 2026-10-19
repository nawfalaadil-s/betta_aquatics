const { Client } = require('pg');
if (process.loadEnvFile) {
  try { process.loadEnvFile('.env'); } catch (e) {}
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Error: DATABASE_URL is required in .env');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const INSTAGRAM_URL = 'https://instagram.com/betta_aquatic_no1?utm_source=qr&dlrf=MTN4eGt5Nmk3Z3Izbw==';

const finalProducts = [
  {
    id: "ba000001-0000-4000-8000-000000000001",
    name: "Air Stone Aeration Diffuser",
    slug: "air-stone-aeration-diffuser-20",
    sku: "BA-ACC-001",
    description: "High-density porous mineral air stone for consistent micro-bubble diffusion. Provides maximum oxygen saturation, gentle water movement, and optimal gas exchange for Bettas, guppies, and planted aquariums.",
    short_description: "Micro-bubble mineral air stone diffuser for optimal aeration.",
    price: 20,
    compare_at_price: 35,
    category_id: "1957f7ab-11a1-43d1-88bc-b96b9d7c069e",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    status: "published",
    strain: "Mineral Diffuser",
    gender: "Unsexed",
    size: "4 cm",
    care_level: "Easy",
    images: ["/product_image/air-stone-20.jpeg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000002",
    name: "Indian Almond Leaves (10 pcs Pack)",
    slug: "almond-leaves-10pc-20",
    sku: "BA-ACC-002",
    description: "Sun-dried organic Indian Almond Leaves (Terminalia Catappa) pack of 10. Naturally releases beneficial humic acids and tannins, lowers pH gently, provides anti-bacterial and anti-fungal immunity, and replicates native blackwater habitats for Bettas.",
    short_description: "10 pcs organic sun-dried Catappa leaves for conditioning & immunity.",
    price: 20,
    compare_at_price: 40,
    category_id: "1957f7ab-11a1-43d1-88bc-b96b9d7c069e",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Catappa Botanicals",
    gender: "Unsexed",
    size: "15 - 20 cm",
    care_level: "Easy",
    images: ["/product_image/almond-leaves-20.jpeg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000003",
    name: "Aqua Silent Air Pump",
    slug: "aqua-silent-air-pump-180",
    sku: "BA-ACC-003",
    description: "Ultra-quiet, energy-efficient electric aquarium air pump. Delivers constant air flow with minimal vibration noise. Perfect for powering sponge filters, corner filters, and air stones in Betta and nano shrimp setups.",
    short_description: "Ultra-quiet energy-efficient electric aquarium aeration pump.",
    price: 180,
    compare_at_price: 250,
    category_id: "1957f7ab-11a1-43d1-88bc-b96b9d7c069e",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    status: "published",
    strain: "Aeration Hardware",
    gender: "Unsexed",
    size: "Compact",
    care_level: "Easy",
    images: ["/product_image/aqua-air-pump-180.jpeg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000004",
    name: "Fighter Betta Male",
    slug: "fighter-betta-male-100",
    sku: "BA-BETTA-001",
    description: "High-vitality active male Fighter Betta (Betta splendens). Features vigorous flaring behavior, vivid iridescence, and hardy conditioning. Excellent centerpiece display specimen for solitary desktop aquariums or partitioned breeder tanks.",
    short_description: "1 Healthy active flaring male Fighter Betta.",
    price: 100,
    compare_at_price: 150,
    category_id: "0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4",
    subcategory_id: "71a4e4f4-1405-4fb7-8bd5-930700b65da8",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Fighter Betta",
    gender: "Male",
    size: "4.5 - 5.5 cm",
    care_level: "Easy",
    images: ["/product_image/purple-hm-tail-400.jpeg"],
    videos: [
      {
        id: "vid-betta-male",
        url: "/videos/betta-male-100.mp4",
        title: "Active Fighter Betta Male Swimming & Flaring Video",
        thumbnail_url: "/product_image/purple-hm-tail-400.jpeg"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000005",
    name: "Nano Glass Fish Tank (4x4x4 inch)",
    slug: "nano-glass-fish-tank-4x4x4-150",
    sku: "BA-TANK-001",
    description: "Ultra-clear high-transmittance 4x4x4 inch glass cube desktop tank. Smooth diamond-polished edges, silicone-sealed waterproof durability. Perfectly sized for Betta quarantine, show flaring displays, or desktop moss terrariums.",
    short_description: "Compact 4x4x4 inch ultra-clear diamond edge glass desktop nano cube.",
    price: 150,
    compare_at_price: 200,
    category_id: "1957f7ab-11a1-43d1-88bc-b96b9d7c069e",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    status: "published",
    strain: "Glass Cube",
    gender: "Unsexed",
    size: "4 x 4 x 4 inch",
    care_level: "Easy",
    images: ["/product_image/fish-tank-4x4x4-150.jpeg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000006",
    name: "Compact Glass Fish Tank (5x5x5 inch)",
    slug: "compact-glass-fish-tank-5x5x5-230",
    sku: "BA-TANK-002",
    description: "Premium 5x5x5 inch rimless glass cube tank with polished bevel edges. Provides ample swimming space for specimen Bettas with crystal clear 360-degree viewing. Robust glass construction with non-toxic transparent silicone.",
    short_description: "Premium 5x5x5 inch rimless diamond-cut glass cube show tank.",
    price: 230,
    compare_at_price: 300,
    category_id: "1957f7ab-11a1-43d1-88bc-b96b9d7c069e",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Rimless Glass Cube",
    gender: "Unsexed",
    size: "5 x 5 x 5 inch",
    care_level: "Easy",
    images: ["/product_image/fish-tank-5x5x5-230.jpeg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000007",
    name: "Foxtail Aquatic Bunch Plant",
    slug: "foxtail-aquatic-bunch-plant-50",
    sku: "BA-PLANT-001",
    description: "Fresh snail-free Foxtail (Ceratophyllum Demersum) stem bunch. One of the best natural oxygenators and nitrate absorbers. Fast-growing, easy to float or anchor, offering natural cover and biofilm grazing for fish fry and adult Bettas.",
    short_description: "Fresh snail-free Foxtail live stem bunch for planted tanks.",
    price: 50,
    compare_at_price: 80,
    category_id: "61282e57-e6d0-419d-8947-c63859e11560",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    status: "published",
    strain: "Ceratophyllum Demersum",
    gender: "Unsexed",
    size: "15 - 25 cm",
    care_level: "Easy",
    images: ["/product_image/foxtail-50.jpg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000008",
    name: "Full Moon Betta (10 pcs Pack)",
    slug: "full-moon-betta-10pc-750",
    sku: "BA-BETTA-002",
    description: "Special wholesale breeder bundle of 10 selected Full Moon Bettas. Features expansive 180-degree spread caudal finnage, brilliant varied iridescent colors, and prime health. Conditioned for retail display or breeding projects.",
    short_description: "Wholesale breeder lot of 10 selected Full Moon Bettas.",
    price: 750,
    compare_at_price: 1100,
    category_id: "0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4",
    subcategory_id: "a1e2811c-ab3d-407b-8d46-213ee3058f07",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Full Moon Betta",
    gender: "Unsexed",
    size: "4.0 - 5.5 cm",
    care_level: "Moderate",
    images: ["/product_image/full-moon-betta-750.jpeg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000009",
    name: "Green Zeiltail Guppy (1 Pair)",
    slug: "green-zeiltail-guppy-pair-100",
    sku: "BA-GUPPY-001",
    description: "Vibrant active breeding pair of Green Zeiltail guppies. Displays iridescent emerald green coloration, long flowing caudal finnage, and energetic schooling behavior. Conditioned and ready for breeding setups.",
    short_description: "1 Male + 1 Female pure strain Green Zeiltail breeding pair.",
    price: 100,
    compare_at_price: 160,
    category_id: "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Green Zeiltail",
    gender: "Breeding Pair",
    size: "3.5 - 4.5 cm",
    care_level: "Easy",
    images: ["/product_image/green-platinum-dumbo-500.jpeg"],
    videos: [
      {
        id: "vid-green-tail",
        url: "/videos/green-tail-100.mp4",
        title: "Green Zeiltail Guppy Swimming Video",
        thumbnail_url: "/product_image/green-platinum-dumbo-500.jpeg"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000010",
    name: "Grindal Worms Live Starter Culture",
    slug: "grindal-worms-live-starter-culture-100",
    sku: "BA-FOOD-001",
    description: "Nutritious live Grindal worms (Enchytraeus buchholzi) starter culture. Exceptionally rich in natural proteins and essential lipids. Odorless and easy to culture on coconut coir at room temperature. The ultimate conditioning food for Bettas and fry.",
    short_description: "High-protein live Grindal worm starter culture for fish & fry conditioning.",
    price: 100,
    compare_at_price: 150,
    category_id: "a71581d6-2d40-4436-834e-75ffb933faaa",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Enchytraeus buchholzi",
    gender: "Unsexed",
    size: "Starter Culture",
    care_level: "Easy",
    images: ["/product_image/grindal-worms-100.jpeg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000011",
    name: "Premium Strain Guppy (1 Pair - Grade A)",
    slug: "premium-strain-guppy-pair-120",
    sku: "BA-GUPPY-002",
    description: "Selected Grade-A pure strain fancy guppy pair. Bred for deep coloration, strong dorsal structure, and broad delta tail spread. Highly active and conditioned for aquarium communities or pure breeding colonies.",
    short_description: "1 Male + 1 Female Grade-A premium fancy guppy pair.",
    price: 120,
    compare_at_price: 180,
    category_id: "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    status: "published",
    strain: "Grade A Fancy Guppy",
    gender: "Breeding Pair",
    size: "3.2 - 4.5 cm",
    care_level: "Easy",
    images: ["/product_image/electric-blue-300.jpeg"],
    videos: [
      {
        id: "vid-guppy-120",
        url: "/videos/guppy-120.mp4",
        title: "Premium Strain Guppy Pair Swimming Video",
        thumbnail_url: "/product_image/electric-blue-300.jpeg"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000012",
    name: "High Dorsal Fancy Guppy (1 Pair)",
    slug: "high-dorsal-fancy-guppy-pair-150",
    sku: "BA-GUPPY-003",
    description: "Show lineage high dorsal fancy guppy breeding pair. Features an elongated dorsal sail that extends gracefully across the body with rich patterns and expansive caudal spread.",
    short_description: "1 Male + 1 Female high dorsal sail fancy guppy pair.",
    price: 150,
    compare_at_price: 220,
    category_id: "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "High Dorsal Fancy",
    gender: "Breeding Pair",
    size: "3.5 - 4.8 cm",
    care_level: "Easy",
    images: ["/product_image/afr-flower-dorsal-400.jpeg"],
    videos: [
      {
        id: "vid-guppy-150",
        url: "/videos/guppy-150.mp4",
        title: "High Dorsal Fancy Guppy Swimming Video",
        thumbnail_url: "/product_image/afr-flower-dorsal-400.jpeg"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000013",
    name: "Hardy Community Guppy (1 Pair)",
    slug: "hardy-community-guppy-pair-45",
    sku: "BA-GUPPY-004",
    description: "Resilient and active colorful community guppy pair. Acclimated to regular tap water conditions, highly disease-resistant, and ideal for beginners, planted nano tanks, and lively community setups.",
    short_description: "1 Male + 1 Female resilient colorful community guppy pair.",
    price: 45,
    compare_at_price: 70,
    category_id: "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    status: "published",
    strain: "Community Guppy",
    gender: "Breeding Pair",
    size: "3.0 - 4.2 cm",
    care_level: "Easy",
    images: ["/product_image/guppy-grass-50.jpeg"],
    videos: [
      {
        id: "vid-guppy-45",
        url: "/videos/guppy-45.mp4",
        title: "Hardy Community Guppy Active Swimming Video",
        thumbnail_url: "/product_image/guppy-grass-50.jpeg"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000014",
    name: "Full Red Guppy (1 Pair)",
    slug: "full-red-guppy-pair-120",
    sku: "BA-GUPPY-005",
    description: "Solid crimson Full Red line-bred guppy pair. Vivid red coloration covers the head, body, dorsal, and delta caudal fin. High fertility strain conditioned on live cultures for maximum vibrancy.",
    short_description: "1 Male + 1 Female pure strain solid Full Red guppy pair.",
    price: 120,
    compare_at_price: 180,
    category_id: "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Full Red",
    gender: "Breeding Pair",
    size: "3.5 - 4.5 cm",
    care_level: "Easy",
    images: ["/product_image/afr-flower-dorsal-400.jpeg"],
    videos: [
      {
        id: "vid-red-guppy-120",
        url: "/videos/guppy-pair-120.mp4",
        title: "Full Red Guppy Courtship & Swimming Video",
        thumbnail_url: "/product_image/afr-flower-dorsal-400.jpeg"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000015",
    name: "Samurai Betta (1 Pair)",
    slug: "samurai-betta-pair-350",
    sku: "BA-BETTA-003",
    description: "Rare Black Samurai dragon-scale Betta breeding pair. Features heavy metallic silver-white armor plating across the dorsal cap contrasting sharply against a midnight black body. Distinctive, bold flaring posture and championship genetics.",
    short_description: "1 Male + 1 Female rare Black Samurai Dragon Scale Betta pair.",
    price: 350,
    compare_at_price: 500,
    category_id: "0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4",
    subcategory_id: "71a4e4f4-1405-4fb7-8bd5-930700b65da8",
    stock_quantity: 30,
    is_unique_specimen: true,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Black Samurai Dragon Scale",
    gender: "Breeding Pair",
    size: "4.5 - 5.5 cm",
    care_level: "Moderate",
    images: ["/product_image/purple-hm-tail-400.jpeg"],
    videos: [
      {
        id: "vid-samurai-350",
        url: "/videos/betta-350.mp4",
        title: "Samurai Betta Flaring & Swimming Video",
        thumbnail_url: "/product_image/purple-hm-tail-400.jpeg"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000016",
    name: "Pure White Betta (1 Pair)",
    slug: "pure-white-betta-pair-250",
    sku: "BA-BETTA-004",
    description: "Snow-white Platinum Betta breeding pair. Flawless solid white coloration with thick scales and pure translucent-free finnage. Acclimated and conditioned together for high fertility and show-grade offspring.",
    short_description: "1 Male + 1 Female pristine Platinum Snow White Betta pair.",
    price: 250,
    compare_at_price: 380,
    category_id: "0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4",
    subcategory_id: "a1e2811c-ab3d-407b-8d46-213ee3058f07",
    stock_quantity: 30,
    is_unique_specimen: true,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Platinum Snow White",
    gender: "Breeding Pair",
    size: "4.5 - 5.5 cm",
    care_level: "Moderate",
    images: ["/product_image/tiger-halfmoon-300.jpeg"],
    videos: [
      {
        id: "vid-white-betta-250",
        url: "/videos/betta-250.mp4",
        title: "Pure White Betta Active Swimming Video",
        thumbnail_url: "/product_image/tiger-halfmoon-300.jpeg"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000017",
    name: "Platinum White Albino Guppy (1 Pair - Show Grade)",
    slug: "platinum-white-albino-guppy-pair-799",
    sku: "BA-GUPPY-006",
    description: "Champion exhibition grade pure Platinum White Albino guppy breeding pair. Features piercing ruby albino eyes, gleaming pearlescent platinum white body, and broad high-dorsal delta tail spread. Bred under strict quarantine conditions.",
    short_description: "1 Male + 1 Female show-grade Platinum White Albino collector pair.",
    price: 799,
    compare_at_price: 1199,
    category_id: "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    stock_quantity: 30,
    is_unique_specimen: true,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Platinum White Albino",
    gender: "Breeding Pair",
    size: "3.8 - 4.8 cm",
    care_level: "Moderate",
    images: ["/product_image/green-platinum-dumbo-500.jpeg"],
    videos: [
      {
        id: "vid-white-guppy-799",
        url: "/videos/guppy-800.mp4",
        title: "Platinum White Albino Guppy Swimming Video",
        thumbnail_url: "/product_image/green-platinum-dumbo-500.jpeg"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000018",
    name: "Zeiltail Guppy Colony (5 Pairs Pack)",
    slug: "zeiltail-guppy-colony-5pairs-150",
    sku: "BA-GUPPY-007",
    description: "Value colony package of 5 healthy breeding pairs (5 Males + 5 Females / 10 guppies total) of Zeiltail fancy guppies. Instant schooling community for planted aquariums with diverse shimmering colors and active swimming.",
    short_description: "Colony pack of 5 breeding pairs (10 guppies total) Zeiltail guppies.",
    price: 150,
    compare_at_price: 250,
    category_id: "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Zeiltail Fancy Colony",
    gender: "Breeding Pair",
    size: "3.0 - 4.2 cm",
    care_level: "Easy",
    images: ["/product_image/electric-blue-300.jpeg"],
    videos: [
      {
        id: "vid-zebra-5pair-150",
        url: "/videos/zebra-5pair-150.mp4",
        title: "Zeiltail Guppy Colony Pack Swimming Video",
        thumbnail_url: "/product_image/electric-blue-300.jpeg"
      }
    ]
  }
];

async function main() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database...');

    // 1. Update store_settings with Instagram URL
    console.log('1. Updating store_settings with Instagram link...');
    const brandInfoRes = await client.query("SELECT value FROM public.store_settings WHERE key = 'brand_info'");
    if (brandInfoRes.rows.length > 0) {
      const currentBrand = brandInfoRes.rows[0].value || {};
      currentBrand.instagram_url = INSTAGRAM_URL;
      await client.query(
        "UPDATE public.store_settings SET value = $1, updated_at = now() WHERE key = 'brand_info'",
        [JSON.stringify(currentBrand)]
      );
      console.log('✓ Updated store_settings.brand_info with Instagram URL');
    }

    const brandingRes = await client.query("SELECT value FROM public.store_settings WHERE key = 'branding'");
    if (brandingRes.rows.length > 0) {
      const currentBranding = brandingRes.rows[0].value || {};
      currentBranding.instagram_url = INSTAGRAM_URL;
      await client.query(
        "UPDATE public.store_settings SET value = $1, updated_at = now() WHERE key = 'branding'",
        [JSON.stringify(currentBranding)]
      );
      console.log('✓ Updated store_settings.branding with Instagram URL');
    }

    // 2. Clear old product_images and products
    console.log('2. Removing all previous mock/demo products and images...');
    await client.query('DELETE FROM public.product_images');
    console.log('✓ Cleared public.product_images');

    // Also unassign from collections or carts if any
    try { await client.query('DELETE FROM public.collection_products'); } catch (e) {}
    try { await client.query('DELETE FROM public.cart_items'); } catch (e) {}
    try { await client.query('DELETE FROM public.wishlists'); } catch (e) {}

    await client.query('DELETE FROM public.products');
    console.log('✓ Cleared all old products from public.products');

    // 3. Insert the 18 final products
    console.log('3. Inserting the 18 final products with 30 stock each...');
    for (const p of finalProducts) {
      await client.query(`
        INSERT INTO public.products (
          id, name, slug, sku, description, short_description, price, compare_at_price,
          category_id, subcategory_id, stock_quantity, is_unique_specimen, is_featured, is_active,
          strain, gender, size, care_level, rating, review_count, status, videos, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, $14, $15, $16, $17, 5.0, 15, 'published', $18, now(), now()
        );
      `, [
        p.id, p.name, p.slug, p.sku, p.description, p.short_description, p.price, p.compare_at_price,
        p.category_id, p.subcategory_id || null, p.stock_quantity, p.is_unique_specimen, p.is_featured,
        p.strain, p.gender, p.size, p.care_level, JSON.stringify(p.videos || [])
      ]);

      for (let i = 0; i < p.images.length; i++) {
        const imageId = require('crypto').randomUUID();
        await client.query(`
          INSERT INTO public.product_images (id, product_id, image_url, is_primary, display_order)
          VALUES ($1, $2, $3, $4, $5);
        `, [imageId, p.id, p.images[i], i === 0, i]);
      }
    }

    console.log(`✓ All ${finalProducts.length} products inserted into public.products with stock_quantity = 30!`);

    // 4. Verify in DB
    const countRes = await client.query('SELECT count(*) FROM public.products');
    console.log(`Live DB Product Count: ${countRes.rows[0].count}`);

    const verifyRes = await client.query('SELECT id, name, price, stock_quantity, category_id FROM public.products ORDER BY price ASC');
    console.log('Live Products in DB:');
    verifyRes.rows.forEach((r, idx) => {
      console.log(`  ${idx + 1}. [₹${r.price}] (Stock: ${r.stock_quantity}) ${r.name}`);
    });

    await client.end();
    console.log('Synchronization completed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

main();

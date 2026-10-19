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

const BETTA_CAT_ID = '0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4';
const GUPPY_CAT_ID = '9ebb7d17-8998-46b7-8e97-46a0812f7a80';
const ACC_CAT_ID = '1957f7ab-11a1-43d1-88bc-b96b9d7c069e';
const PLANT_CAT_ID = '61282e57-e6d0-419d-8947-c63859e11560';
const FOOD_CAT_ID = 'a71581d6-2d40-4436-834e-75ffb933faaa';

const updatedCatalog = [
  {
    id: "ba000001-0000-4000-8000-000000000001",
    name: "Fighter Betta Male",
    slug: "fighter-betta-male-100",
    sku: "BA-BETTA-001",
    description: "High-vitality active male Fighter Betta (Betta splendens). Features vigorous flaring behavior, vivid iridescence, and hardy conditioning. Excellent centerpiece display specimen for solitary desktop aquariums or partitioned breeder tanks.",
    short_description: "1 Healthy active flaring male Fighter Betta.",
    price: 100,
    compare_at_price: 150,
    category_id: BETTA_CAT_ID,
    category_name: "Betta Fish",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Fighter Betta",
    gender: "Male",
    size: "4.5 - 5.5 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "24°C - 28°C",
    ph_range: "6.5 - 7.5",
    care_level: "Easy",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/betta-main.png"],
    videos: [
      {
        id: "vid-betta-male",
        url: "/videos/betta-male-100.mp4",
        title: "Active Fighter Betta Male Swimming & Flaring Video",
        thumbnail_url: "/product_image/betta-main.png"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000002",
    name: "Black Samurai Betta (1 Pair)",
    slug: "black-samurai-betta-pair-350",
    sku: "BA-BETTA-002",
    description: "Striking pure lineage Black Samurai Plakat Betta breeding pair. Features intense midnight black body scale pigmentation contrasted with metallic silver-platinum samurai armor mask spanning the head and dorsal crest. Vigorous and conditioned for breeding.",
    short_description: "1 Male + 1 Female pure lineage Black Samurai metallic armor breeding pair.",
    price: 350,
    compare_at_price: 500,
    category_id: BETTA_CAT_ID,
    category_name: "Betta Fish",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Black Samurai Plakat",
    gender: "Breeding Pair",
    size: "4.0 - 5.2 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "24°C - 28°C",
    ph_range: "6.5 - 7.5",
    care_level: "Moderate",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/black-samurai.png"],
    videos: [
      {
        id: "vid-samurai-betta",
        url: "/videos/betta-350.mp4",
        title: "Black Samurai Betta Pair Active Flaring Video",
        thumbnail_url: "/product_image/black-samurai.png"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000003",
    name: "White Betta (1 Pair)",
    slug: "white-betta-pair-250",
    sku: "BA-BETTA-003",
    description: "Pristine opaque snowy Platinum White Betta breeding pair. Displays clean, uniform porcelain white coloration with zero blemishes. Broad finnage and vigorous flaring drive. Conditioned and ready for display or spawning setups.",
    short_description: "1 Male + 1 Female immaculate opaque Platinum White Betta breeding pair.",
    price: 250,
    compare_at_price: 350,
    category_id: BETTA_CAT_ID,
    category_name: "Betta Fish",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Platinum White Betta",
    gender: "Breeding Pair",
    size: "4.0 - 5.0 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "24°C - 28°C",
    ph_range: "6.5 - 7.5",
    care_level: "Moderate",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/white-betta.png"],
    videos: [
      {
        id: "vid-white-betta",
        url: "/videos/betta-250.mp4",
        title: "White Betta Pair Swimming Video",
        thumbnail_url: "/product_image/white-betta.png"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000004",
    name: "Full Moon Betta (10 pcs Pack)",
    slug: "full-moon-betta-10pc-750",
    sku: "BA-BETTA-004",
    description: "Special wholesale breeder bundle of 10 selected Full Moon Bettas. Features expansive 180-degree spread caudal finnage, brilliant varied iridescent colors, and prime health. Conditioned for retail display or breeding projects.",
    short_description: "Wholesale breeder lot of 10 selected Full Moon Bettas.",
    price: 750,
    compare_at_price: 1100,
    category_id: BETTA_CAT_ID,
    category_name: "Betta Fish",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Full Moon Betta",
    gender: "Unsexed",
    size: "4.0 - 5.5 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "24°C - 28°C",
    ph_range: "6.5 - 7.5",
    care_level: "Moderate",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/full-moon-betta-750.jpeg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000005",
    name: "Green Zeiltail (1 Pair)",
    slug: "green-zeiltail-pair-100",
    sku: "BA-GUPPY-001",
    description: "Vibrant active breeding pair of Green Zeiltail guppies. Displays iridescent emerald green coloration, long flowing caudal finnage, and energetic schooling behavior. Conditioned and ready for breeding setups.",
    short_description: "1 Male + 1 Female pure strain Green Zeiltail breeding pair.",
    price: 100,
    compare_at_price: 160,
    category_id: GUPPY_CAT_ID,
    category_name: "Guppies & Livebearers",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Green Zeiltail",
    gender: "Breeding Pair",
    size: "3.5 - 4.5 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "24°C - 28°C",
    ph_range: "6.8 - 7.8",
    care_level: "Easy",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/green-zeiltail-100.png"],
    videos: [
      {
        id: "vid-green-tail",
        url: "/videos/green-tail-100.mp4",
        title: "Green Zeiltail Guppy Swimming Video",
        thumbnail_url: "/product_image/green-zeiltail-100.png"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000006",
    name: "Zeiltail (5 Pair Pack)",
    slug: "zeiltail-5-pair-150",
    sku: "BA-GUPPY-002",
    description: "Complete colony pack of 5 breeding pairs (5 males + 5 females) of hardy Zeiltails. Rich iridescent fin patterns, strong genetics, and high fertility. Ideal for stocking vibrant planted tanks or starting a prolific breeding colony.",
    short_description: "Colony starter pack of 5 pairs (10 fish) selected Zeiltails.",
    price: 150,
    compare_at_price: 250,
    category_id: GUPPY_CAT_ID,
    category_name: "Guppies & Livebearers",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Zeiltail",
    gender: "Breeding Pair",
    size: "3.5 - 4.5 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "24°C - 28°C",
    ph_range: "6.8 - 7.8",
    care_level: "Easy",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/zeiltail.png"],
    videos: [
      {
        id: "vid-zebra-5pair",
        url: "/videos/zebra-5pair-150.mp4",
        title: "Zeiltail 5 Pair Pack Swimming Video",
        thumbnail_url: "/product_image/zeiltail.png"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000007",
    name: "Blue Guppy (1 Pair)",
    slug: "blue-guppy-pair-120",
    sku: "BA-GUPPY-003",
    description: "Deep oceanic blue pure strain fancy guppy pair. Vivid electric blue metallic shine covering the body and broad delta caudal fin. Extremely active and healthy, conditioned for breeding and community aquariums.",
    short_description: "1 Male + 1 Female pure strain Electric Blue fancy guppy pair.",
    price: 120,
    compare_at_price: 180,
    category_id: GUPPY_CAT_ID,
    category_name: "Guppies & Livebearers",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    status: "published",
    strain: "Electric Blue Guppy",
    gender: "Breeding Pair",
    size: "3.2 - 4.5 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "24°C - 28°C",
    ph_range: "6.8 - 7.8",
    care_level: "Easy",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/blue-guppy-120.png"],
    videos: [
      {
        id: "vid-guppy-120",
        url: "/videos/guppy-120.mp4",
        title: "Blue Guppy Pair Swimming Video",
        thumbnail_url: "/product_image/blue-guppy-120.png"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000008",
    name: "Albino Red Koi Guppy (1 Pair)",
    slug: "albino-red-koi-guppy-pair-120",
    sku: "BA-GUPPY-004",
    description: "Premium pure Albino Red Koi Guppy breeding pair. Features distinctive clear ruby-red albino eyes, creamy pearl white flanks, and intense scarlet-red koi pattern capping the head and caudal fin. High aesthetic appeal.",
    short_description: "1 Male + 1 Female pure strain Albino Red Koi guppy breeding pair.",
    price: 120,
    compare_at_price: 190,
    category_id: GUPPY_CAT_ID,
    category_name: "Guppies & Livebearers",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Albino Red Koi",
    gender: "Breeding Pair",
    size: "3.2 - 4.2 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "24°C - 28°C",
    ph_range: "6.8 - 7.8",
    care_level: "Easy",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/albino-red-koi.png"],
    videos: [
      {
        id: "vid-red-koi",
        url: "/videos/guppy-pair-120.mp4",
        title: "Albino Red Koi Guppy Pair Swimming Video",
        thumbnail_url: "/product_image/albino-red-koi.png"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000009",
    name: "Dumbo Ear Guppy (1 Pair)",
    slug: "dumbo-ear-guppy-pair-120",
    sku: "BA-GUPPY-005",
    description: "Stunning Dumbo Ear (Big Ear) fancy guppy breeding pair. Distinguished by greatly enlarged, fan-like pectoral fins that flutter gracefully like elephant ears, coupled with vibrant multi-hued body patterns.",
    short_description: "1 Male + 1 Female oversized pectoral Dumbo Ear fancy guppy pair.",
    price: 120,
    compare_at_price: 180,
    category_id: GUPPY_CAT_ID,
    category_name: "Guppies & Livebearers",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Dumbo Ear Fancy",
    gender: "Breeding Pair",
    size: "3.5 - 4.5 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "24°C - 28°C",
    ph_range: "6.8 - 7.8",
    care_level: "Easy",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/dumbo-ear-120.png"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000010",
    name: "Hardy Community Guppy (1 Pair)",
    slug: "hardy-community-guppy-pair-45",
    sku: "BA-GUPPY-006",
    description: "Resilient and active colorful community guppy pair. Acclimated to regular tap water conditions, highly disease-resistant, and ideal for beginners, planted nano tanks, and lively community setups.",
    short_description: "1 Male + 1 Female resilient colorful community guppy pair.",
    price: 45,
    compare_at_price: 70,
    category_id: GUPPY_CAT_ID,
    category_name: "Guppies & Livebearers",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    status: "published",
    strain: "Community Guppy",
    gender: "Breeding Pair",
    size: "3.0 - 4.2 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "22°C - 29°C",
    ph_range: "6.5 - 8.0",
    care_level: "Easy",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/guppy-45.png"],
    videos: [
      {
        id: "vid-guppy-45",
        url: "/videos/guppy-45.mp4",
        title: "Hardy Community Guppy Active Swimming Video",
        thumbnail_url: "/product_image/guppy-45.png"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000011",
    name: "Pure White Guppy (1 Pair - Exhibition Grade)",
    slug: "pure-white-guppy-pair-799",
    sku: "BA-GUPPY-007",
    description: "Exclusive Exhibition-Grade Pure Snow White Guppy breeding pair. Bred from champion lineages exhibiting clean non-yellowing albino snow-white scales, expansive delta caudal fins, and high genetic purity.",
    short_description: "1 Male + 1 Female rare Exhibition Grade Pure White breeding pair.",
    price: 799,
    compare_at_price: 1200,
    category_id: GUPPY_CAT_ID,
    category_name: "Guppies & Livebearers",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "Pure Snow White",
    gender: "Breeding Pair",
    size: "3.8 - 4.8 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "24°C - 28°C",
    ph_range: "6.8 - 7.6",
    care_level: "Moderate",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/white-guppy.png"],
    videos: [
      {
        id: "vid-white-guppy",
        url: "/videos/guppy-800.mp4",
        title: "Pure White Guppy Pair Swimming Video",
        thumbnail_url: "/product_image/white-guppy.png"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000012",
    name: "High Dorsal Fancy Guppy (1 Pair)",
    slug: "high-dorsal-fancy-guppy-pair-150",
    sku: "BA-GUPPY-008",
    description: "Show lineage high dorsal fancy guppy breeding pair. Features an elongated dorsal sail that extends gracefully across the body with rich patterns and expansive caudal spread.",
    short_description: "1 Male + 1 Female high dorsal sail fancy guppy pair.",
    price: 150,
    compare_at_price: 220,
    category_id: GUPPY_CAT_ID,
    category_name: "Guppies & Livebearers",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    strain: "High Dorsal Fancy",
    gender: "Breeding Pair",
    size: "3.5 - 4.8 cm",
    water_type: "Freshwater (Tropical)",
    temperature_range: "24°C - 28°C",
    ph_range: "6.8 - 7.8",
    care_level: "Easy",
    shipping_restriction: "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    images: ["/product_image/blue-guppy-120.png"],
    videos: [
      {
        id: "vid-guppy-150",
        url: "/videos/guppy-150.mp4",
        title: "High Dorsal Fancy Guppy Swimming Video",
        thumbnail_url: "/product_image/blue-guppy-120.png"
      }
    ]
  },
  {
    id: "ba000001-0000-4000-8000-000000000013",
    name: "Nano Glass Fish Tank (4x4x4 inch)",
    slug: "nano-glass-fish-tank-4x4x4-150",
    sku: "BA-TANK-001",
    description: "Ultra-clear high-transmittance 4x4x4 inch glass cube desktop tank. Smooth diamond-polished edges, silicone-sealed waterproof durability. Perfectly sized for Betta quarantine, show flaring displays, or desktop moss terrariums.",
    short_description: "Compact 4x4x4 inch ultra-clear diamond edge glass desktop nano cube.",
    price: 150,
    compare_at_price: 200,
    category_id: ACC_CAT_ID,
    category_name: "Aquarium Accessories",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    status: "published",
    weight: 600,
    water_type: "Freshwater (Tropical)",
    temperature_range: "20°C - 30°C",
    ph_range: "6.0 - 8.0",
    care_level: "Easy",
    images: ["/product_image/fish-tank-4x4x4-150.jpeg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000014",
    name: "Compact Glass Fish Tank (5x5x5 inch)",
    slug: "compact-glass-fish-tank-5x5x5-230",
    sku: "BA-TANK-002",
    description: "Premium 5x5x5 inch rimless glass cube tank with polished bevel edges. Provides ample swimming space for specimen Bettas with crystal clear 360-degree viewing. Robust glass construction with non-toxic transparent silicone.",
    short_description: "Premium 5x5x5 inch rimless diamond-cut glass cube show tank.",
    price: 230,
    compare_at_price: 300,
    category_id: ACC_CAT_ID,
    category_name: "Aquarium Accessories",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    weight: 900,
    water_type: "Freshwater (Tropical)",
    temperature_range: "20°C - 30°C",
    ph_range: "6.0 - 8.0",
    care_level: "Easy",
    images: ["/product_image/fish-tank-5x5x5-230.jpeg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000015",
    name: "Air Stone Aeration Diffuser",
    slug: "air-stone-aeration-diffuser-20",
    sku: "BA-ACC-001",
    description: "High-density porous mineral air stone for consistent micro-bubble diffusion. Provides maximum oxygen saturation, gentle water movement, and optimal gas exchange for Bettas, guppies, and planted aquariums.",
    short_description: "Micro-bubble mineral air stone diffuser for optimal aeration.",
    price: 20,
    compare_at_price: 35,
    category_id: ACC_CAT_ID,
    category_name: "Aquarium Accessories",
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
    id: "ba000001-0000-4000-8000-000000000016",
    name: "Indian Almond Leaves (10 pcs Pack)",
    slug: "almond-leaves-10pc-20",
    sku: "BA-ACC-002",
    description: "Sun-dried organic Indian Almond Leaves (Terminalia Catappa) pack of 10. Naturally releases beneficial humic acids and tannins, lowers pH gently, provides anti-bacterial and anti-fungal immunity, and replicates native blackwater habitats for Bettas.",
    short_description: "10 pcs organic sun-dried Catappa leaves for conditioning & immunity.",
    price: 20,
    compare_at_price: 40,
    category_id: ACC_CAT_ID,
    category_name: "Aquarium Accessories",
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
    id: "ba000001-0000-4000-8000-000000000017",
    name: "Aqua Silent Air Pump",
    slug: "aqua-silent-air-pump-180",
    sku: "BA-ACC-003",
    description: "Ultra-quiet, energy-efficient electric aquarium air pump. Delivers constant air flow with minimal vibration noise. Perfect for powering sponge filters, corner filters, and air stones in Betta and nano shrimp setups.",
    short_description: "Ultra-quiet energy-efficient electric aquarium aeration pump.",
    price: 180,
    compare_at_price: 250,
    category_id: ACC_CAT_ID,
    category_name: "Aquarium Accessories",
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
    id: "ba000001-0000-4000-8000-000000000018",
    name: "Foxtail Aquatic Bunch Plant",
    slug: "foxtail-aquatic-bunch-plant-50",
    sku: "BA-PLANT-001",
    description: "Fresh snail-free Foxtail (Ceratophyllum Demersum) stem bunch. One of the best natural oxygenators and nitrate absorbers. Fast-growing, easy to float or anchor, offering natural cover and biofilm grazing for fish fry and adult Bettas.",
    short_description: "Fresh snail-free Foxtail live stem bunch for planted tanks.",
    price: 50,
    compare_at_price: 80,
    category_id: PLANT_CAT_ID,
    category_name: "Aquatic Plants",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    status: "published",
    weight: 100,
    water_type: "Freshwater (Tropical)",
    temperature_range: "18°C - 28°C",
    ph_range: "6.0 - 7.8",
    care_level: "Easy",
    images: ["/product_image/foxtail-50.jpg"],
    videos: []
  },
  {
    id: "ba000001-0000-4000-8000-000000000019",
    name: "Grindal Worms Live Starter Culture",
    slug: "grindal-worms-live-starter-culture-100",
    sku: "BA-FOOD-001",
    description: "Nutritious live Grindal worms (Enchytraeus buchholzi) starter culture. Exceptionally rich in natural proteins and essential lipids. Odorless and easy to culture on coconut coir at room temperature. The ultimate conditioning food for Bettas and fry.",
    short_description: "High-protein live Grindal worm starter culture for fish & fry conditioning.",
    price: 100,
    compare_at_price: 150,
    category_id: FOOD_CAT_ID,
    category_name: "Fish Food & Nutrition",
    stock_quantity: 30,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    status: "published",
    weight: 120,
    water_type: "Freshwater (Tropical)",
    temperature_range: "20°C - 28°C",
    ph_range: "6.0 - 7.5",
    care_level: "Easy",
    images: ["/product_image/grindal-worms-100.jpeg"],
    videos: []
  }
];

async function run() {
  await client.connect();
  console.log('Connected to DB. Syncing user catalog...');

  await client.query("ALTER TABLE products DROP CONSTRAINT IF EXISTS products_gender_check");

  // 1. Delete old demo product images
  await client.query("DELETE FROM product_images");
  console.log('Cleared old product_images in Supabase.');

  // 2. Unlink any order items referencing existing products
  await client.query("UPDATE order_items SET product_id = NULL");

  // 3. Clear products table and repopulate
  await client.query("DELETE FROM products");
  console.log('Cleared old products table in Supabase.');

  for (const p of updatedCatalog) {
    const insertQuery = `
      INSERT INTO products (
        id, name, slug, sku, description, short_description, price, compare_at_price,
        category_id, stock_quantity, is_unique_specimen, is_featured, is_active,
        strain, gender, size, water_type, temperature_range, ph_range, care_level,
        diet, shipping_restriction, rating, review_count, videos, status, weight,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27,
        NOW(), NOW()
      )
    `;

    await client.query(insertQuery, [
      p.id, p.name, p.slug, p.sku, p.description, p.short_description || null,
      p.price, p.compare_at_price || null, p.category_id, p.stock_quantity,
      p.is_unique_specimen, p.is_featured, p.is_active, p.strain || null,
      p.gender || null, p.size || null, p.water_type || 'Freshwater (Tropical)',
      p.temperature_range || '24°C - 28°C', p.ph_range || '6.5 - 7.5', p.care_level || 'Easy',
      p.diet || null, p.shipping_restriction || null, 5.0, 15,
      JSON.stringify(p.videos || []), p.status || 'published', p.weight || null
    ]);

    // Insert image
    for (let i = 0; i < p.images.length; i++) {
      await client.query(`
        INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
        VALUES ($1, $2, $3, $4, $5)
      `, [p.id, p.images[i], p.name, i === 0, i + 1]);
    }

    console.log(`Synced: ${p.name} (Stock: ${p.stock_quantity}, Price: ₹${p.price})`);
  }

  const countRes = await client.query("SELECT COUNT(*) FROM products");
  console.log(`Successfully synced ${countRes.rows[0].count} products into Supabase PostgreSQL.`);

  await client.end();
}

run().catch(console.error);

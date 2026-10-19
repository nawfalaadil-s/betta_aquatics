import { Category, Product, StoreSettings, HomepageSection, CMSPage, Coupon, BlogPost, MediaAsset, BrandingSettings } from './types';

export const COURIER_PRESETS = [
  {
    name: 'The Professional Couriers (Road Courier)',
    urlTemplate: 'https://www.tpcindia.com/Tracking.aspx?ConsignmentNo={AWB}',
    description: 'Specialized surface road transport for live ornamental fish across India with 100% Live Arrival Guarantee.',
  },
  {
    name: 'The Professional Couriers (Express Surface)',
    urlTemplate: 'https://www.tpcindia.com/Tracking.aspx?ConsignmentNo={AWB}',
    description: 'Express door-to-door road consignment by The Professional Couriers logistics network.',
  },
  {
    name: 'India Post Speed Post',
    urlTemplate: 'https://www.indiapost.gov.in/_layouts/15/dpt.cept.tracking/trackconsignment.aspx',
    description: 'National government express network reaching all remote PIN codes.',
  },
  {
    name: 'Custom Courier Partner',
    urlTemplate: '{AWB}',
    description: 'Enter your custom courier tracking web link.',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: '9ebb7d17-8998-46b7-8e97-46a0812f7a80',
    name: 'Guppies & Livebearers',
    slug: 'guppies',
    description: 'Pure strain Albino Full Red, Dumbo Ear Mosaic, Green Tail, and Blue Dragon imported guppy pairs.',
    image_url: '/product_image/afr-flower-dorsal-400.jpeg',
    banner_url: '/product_image/afr-flower-dorsal-400.jpeg',
    parent_id: null,
    display_order: 1,
    is_active: true,
    is_featured: true,
  },
  {
    id: '61282e57-e6d0-419d-8947-c63859e11560',
    name: 'Aquatic Plants',
    slug: 'aquatic-plants',
    description: 'Snail-free natural floating plants, hornwort stems, and terrarium creeping vines.',
    image_url: '/product_image/guppy-grass-50.jpeg',
    banner_url: '/product_image/guppy-grass-50.jpeg',
    parent_id: null,
    display_order: 2,
    is_active: true,
    is_featured: true,
  },
  {
    id: 'a71581d6-2d40-4436-834e-75ffb933faaa',
    name: 'Fish Food & Nutrition',
    slug: 'fish-food',
    description: 'High-protein micro pellets and live Moina starter cultures.',
    image_url: '/product_image/insecta-pro-200.jpeg',
    banner_url: '/product_image/insecta-pro-200.jpeg',
    parent_id: null,
    display_order: 3,
    is_active: true,
    is_featured: true,
  },
  {
    id: 'b66e47f9-03cf-436b-8ae8-5b853f748350',
    name: 'Breeding Pairs & Rare Strains',
    slug: 'breeding-pairs',
    description: 'Carefully conditioned, proven fertile breeding pairs with lineage certificates.',
    image_url: '/product_image/green-platinum-dumbo-500.jpeg',
    parent_id: null,
    display_order: 4,
    is_active: true,
    is_featured: false,
  },
  {
    id: '1957f7ab-11a1-43d1-88bc-b96b9d7c069e',
    name: 'Aquarium Accessories',
    slug: 'accessories',
    description: 'Gentle sponge filters, conditioning botanicals, and water treatments.',
    image_url: '/product_image/duckweed-50.jpeg',
    parent_id: null,
    display_order: 5,
    is_active: true,
    is_featured: false,
  },
  {
    id: '0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4',
    name: 'Betta Fish',
    slug: 'betta-fish',
    description: 'Exquisite show specimen Bettas sourced from champion bloodlines.',
    image_url: '/product_image/purple-hm-tail-400.jpeg',
    parent_id: null,
    display_order: 6,
    is_active: true,
    is_featured: false,
  },
  {
    id: 'a1e2811c-ab3d-407b-8d46-213ee3058f07',
    name: 'Halfmoon Bettas',
    slug: 'halfmoon-bettas',
    description: '180-degree caudal spread show-class specimen males and females.',
    image_url: '/product_image/tiger-halfmoon-300.jpeg',
    parent_id: '0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4',
    display_order: 1,
    is_active: true,
    is_featured: false,
  },
  {
    id: 'd37deeef-1d73-4bfa-854f-e556e085fced',
    name: 'Crowntail Bettas',
    slug: 'crowntail-bettas',
    description: 'Dramatic ray web reductions creating crown-like finnage.',
    image_url: '/product_image/electric-blue-300.jpeg',
    parent_id: '0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4',
    display_order: 2,
    is_active: true,
    is_featured: false,
  },
  {
    id: '71a4e4f4-1405-4fb7-8bd5-930700b65da8',
    name: 'Plakat & Fighter Bettas',
    slug: 'plakat-bettas',
    description: 'Short-finned, muscular traditional and modern HMPK fighters.',
    image_url: '/product_image/purple-hm-tail-400.jpeg',
    parent_id: '0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4',
    display_order: 3,
    is_active: true,
    is_featured: false,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "ba000001-0000-4000-8000-000000000001",
    "name": "Air Stone Aeration Diffuser",
    "slug": "air-stone-aeration-diffuser-20",
    "sku": "BA-ACC-001",
    "description": "High-density porous mineral air stone for consistent micro-bubble diffusion. Provides maximum oxygen saturation, gentle water movement, and optimal gas exchange for Bettas, guppies, and planted aquariums.",
    "short_description": "Micro-bubble mineral air stone diffuser for optimal aeration.",
    "price": 20,
    "compare_at_price": 35,
    "category_id": "1957f7ab-11a1-43d1-88bc-b96b9d7c069e",
    "category_name": "Aquarium Accessories",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": false,
    "is_active": true,
    "status": "published",
    "weight": 50,
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "20°C - 32°C",
    "ph_range": "6.0 - 8.0",
    "care_level": "Easy",
    "images": [
      "/product_image/air-stone-20.jpeg"
    ],
    "videos": [],
    "rating": 4.8,
    "review_count": 14,
    "tags": [
      "Accessories",
      "Aeration",
      "Aquarium Care"
    ],
    "created_at": "2026-10-19T10:00:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000002",
    "name": "Indian Almond Leaves (10 pcs Pack)",
    "slug": "almond-leaves-10pc-20",
    "sku": "BA-ACC-002",
    "description": "Sun-dried organic Indian Almond Leaves (Terminalia Catappa) pack of 10. Naturally releases beneficial humic acids and tannins, lowers pH gently, provides anti-bacterial and anti-fungal immunity, and replicates native blackwater habitats for Bettas.",
    "short_description": "10 pcs organic sun-dried Catappa leaves for conditioning & immunity.",
    "price": 20,
    "compare_at_price": 40,
    "category_id": "1957f7ab-11a1-43d1-88bc-b96b9d7c069e",
    "category_name": "Aquarium Accessories",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 80,
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "22°C - 30°C",
    "ph_range": "5.5 - 7.5",
    "care_level": "Easy",
    "images": [
      "/product_image/almond-leaves-20.jpeg"
    ],
    "videos": [],
    "rating": 4.9,
    "review_count": 38,
    "tags": [
      "Catappa Leaves",
      "Natural Conditioning",
      "Betta Care",
      "Bestseller"
    ],
    "created_at": "2026-10-19T10:01:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000003",
    "name": "Aqua Silent Air Pump",
    "slug": "aqua-silent-air-pump-180",
    "sku": "BA-ACC-003",
    "description": "Ultra-quiet, energy-efficient electric aquarium air pump. Delivers constant air flow with minimal vibration noise. Perfect for powering sponge filters, corner filters, and air stones in Betta and nano shrimp setups.",
    "short_description": "Ultra-quiet energy-efficient electric aquarium aeration pump.",
    "price": 180,
    "compare_at_price": 250,
    "category_id": "1957f7ab-11a1-43d1-88bc-b96b9d7c069e",
    "category_name": "Aquarium Accessories",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": false,
    "is_active": true,
    "status": "published",
    "weight": 250,
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "18°C - 32°C",
    "ph_range": "6.0 - 8.0",
    "care_level": "Easy",
    "images": [
      "/product_image/aqua-air-pump-180.jpeg"
    ],
    "videos": [],
    "rating": 4.7,
    "review_count": 19,
    "tags": [
      "Air Pump",
      "Filtration",
      "Accessories"
    ],
    "created_at": "2026-10-19T10:02:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000004",
    "name": "Fighter Betta Male",
    "slug": "fighter-betta-male-100",
    "sku": "BA-BETTA-001",
    "description": "High-vitality active male Fighter Betta (Betta splendens). Features vigorous flaring behavior, vivid iridescence, and hardy conditioning. Excellent centerpiece display specimen for solitary desktop aquariums or partitioned breeder tanks.",
    "short_description": "1 Healthy active flaring male Fighter Betta.",
    "price": 100,
    "compare_at_price": 150,
    "category_id": "0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4",
    "category_name": "Betta Fish",
    "subcategory_id": "71a4e4f4-1405-4fb7-8bd5-930700b65da8",
    "subcategory_name": "Plakat & Fighter Bettas",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 120,
    "strain": "Fighter Betta",
    "gender": "Male",
    "size": "4.5 - 5.5 cm",
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "24°C - 28°C",
    "ph_range": "6.5 - 7.5",
    "care_level": "Easy",
    "shipping_restriction": "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    "images": [
      "/product_image/purple-hm-tail-400.jpeg"
    ],
    "videos": [
      {
        "id": "vid-betta-male",
        "url": "/videos/betta-male-100.mp4",
        "title": "Active Fighter Betta Male Swimming & Flaring Video",
        "thumbnail_url": "/product_image/purple-hm-tail-400.jpeg"
      }
    ],
    "rating": 4.9,
    "review_count": 27,
    "tags": [
      "Fighter Betta",
      "Live Betta",
      "Active Male",
      "Video Included"
    ],
    "created_at": "2026-10-19T10:03:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000005",
    "name": "Nano Glass Fish Tank (4x4x4 inch)",
    "slug": "nano-glass-fish-tank-4x4x4-150",
    "sku": "BA-TANK-001",
    "description": "Ultra-clear high-transmittance 4x4x4 inch glass cube desktop tank. Smooth diamond-polished edges, silicone-sealed waterproof durability. Perfectly sized for Betta quarantine, show flaring displays, or desktop moss terrariums.",
    "short_description": "Compact 4x4x4 inch ultra-clear diamond edge glass desktop nano cube.",
    "price": 150,
    "compare_at_price": 200,
    "category_id": "1957f7ab-11a1-43d1-88bc-b96b9d7c069e",
    "category_name": "Aquarium Accessories",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": false,
    "is_active": true,
    "status": "published",
    "weight": 600,
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "20°C - 30°C",
    "ph_range": "6.0 - 8.0",
    "care_level": "Easy",
    "images": [
      "/product_image/fish-tank-4x4x4-150.jpeg"
    ],
    "videos": [],
    "rating": 4.8,
    "review_count": 15,
    "tags": [
      "Glass Tank",
      "Nano Cube",
      "Desktop Aquarium"
    ],
    "created_at": "2026-10-19T10:04:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000006",
    "name": "Compact Glass Fish Tank (5x5x5 inch)",
    "slug": "compact-glass-fish-tank-5x5x5-230",
    "sku": "BA-TANK-002",
    "description": "Premium 5x5x5 inch rimless glass cube tank with polished bevel edges. Provides ample swimming space for specimen Bettas with crystal clear 360-degree viewing. Robust glass construction with non-toxic transparent silicone.",
    "short_description": "Premium 5x5x5 inch rimless diamond-cut glass cube show tank.",
    "price": 230,
    "compare_at_price": 300,
    "category_id": "1957f7ab-11a1-43d1-88bc-b96b9d7c069e",
    "category_name": "Aquarium Accessories",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 900,
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "20°C - 30°C",
    "ph_range": "6.0 - 8.0",
    "care_level": "Easy",
    "images": [
      "/product_image/fish-tank-5x5x5-230.jpeg"
    ],
    "videos": [],
    "rating": 4.9,
    "review_count": 22,
    "tags": [
      "Glass Tank",
      "Rimless Cube",
      "Show Tank",
      "Bestseller"
    ],
    "created_at": "2026-10-19T10:05:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000007",
    "name": "Foxtail Aquatic Bunch Plant",
    "slug": "foxtail-aquatic-bunch-plant-50",
    "sku": "BA-PLANT-001",
    "description": "Fresh snail-free Foxtail (Ceratophyllum Demersum) stem bunch. One of the best natural oxygenators and nitrate absorbers. Fast-growing, easy to float or anchor, offering natural cover and biofilm grazing for fish fry and adult Bettas.",
    "short_description": "Fresh snail-free Foxtail live stem bunch for planted tanks.",
    "price": 50,
    "compare_at_price": 80,
    "category_id": "61282e57-e6d0-419d-8947-c63859e11560",
    "category_name": "Aquatic Plants",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": false,
    "is_active": true,
    "status": "published",
    "weight": 100,
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "18°C - 28°C",
    "ph_range": "6.0 - 7.8",
    "care_level": "Easy",
    "images": [
      "/product_image/foxtail-50.jpg"
    ],
    "videos": [],
    "rating": 4.8,
    "review_count": 18,
    "tags": [
      "Live Plant",
      "Foxtail",
      "Nitrate Absorber",
      "Planted Tank"
    ],
    "created_at": "2026-10-19T10:06:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000008",
    "name": "Full Moon Betta (10 pcs Pack)",
    "slug": "full-moon-betta-10pc-750",
    "sku": "BA-BETTA-002",
    "description": "Special wholesale breeder bundle of 10 selected Full Moon Bettas. Features expansive 180-degree spread caudal finnage, brilliant varied iridescent colors, and prime health. Conditioned for retail display or breeding projects.",
    "short_description": "Wholesale breeder lot of 10 selected Full Moon Bettas.",
    "price": 750,
    "compare_at_price": 1100,
    "category_id": "0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4",
    "category_name": "Betta Fish",
    "subcategory_id": "a1e2811c-ab3d-407b-8d46-213ee3058f07",
    "subcategory_name": "Halfmoon Bettas",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 600,
    "strain": "Full Moon Betta",
    "gender": "Unsexed",
    "size": "4.0 - 5.5 cm",
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "24°C - 28°C",
    "ph_range": "6.5 - 7.5",
    "care_level": "Moderate",
    "shipping_restriction": "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    "images": [
      "/product_image/full-moon-betta-750.jpeg"
    ],
    "videos": [],
    "rating": 5,
    "review_count": 31,
    "tags": [
      "Full Moon",
      "Breeder Pack",
      "Wholesale Lot",
      "Betta"
    ],
    "created_at": "2026-10-19T10:07:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000009",
    "name": "Green Zeiltail Guppy (1 Pair)",
    "slug": "green-zeiltail-guppy-pair-100",
    "sku": "BA-GUPPY-001",
    "description": "Vibrant active breeding pair of Green Zeiltail guppies. Displays iridescent emerald green coloration, long flowing caudal finnage, and energetic schooling behavior. Conditioned and ready for breeding setups.",
    "short_description": "1 Male + 1 Female pure strain Green Zeiltail breeding pair.",
    "price": 100,
    "compare_at_price": 160,
    "category_id": "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    "category_name": "Guppies & Livebearers",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 150,
    "strain": "Green Zeiltail",
    "gender": "Breeding Pair",
    "size": "3.5 - 4.5 cm",
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "24°C - 28°C",
    "ph_range": "6.8 - 7.8",
    "care_level": "Easy",
    "shipping_restriction": "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    "images": [
      "/product_image/green-platinum-dumbo-500.jpeg"
    ],
    "videos": [
      {
        "id": "vid-green-tail",
        "url": "/videos/green-tail-100.mp4",
        "title": "Green Zeiltail Guppy Swimming Video",
        "thumbnail_url": "/product_image/green-platinum-dumbo-500.jpeg"
      }
    ],
    "rating": 4.8,
    "review_count": 16,
    "tags": [
      "Zeiltail",
      "Guppy Pair",
      "Green Strain",
      "Video Included"
    ],
    "created_at": "2026-10-19T10:08:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000010",
    "name": "Grindal Worms Live Starter Culture",
    "slug": "grindal-worms-live-starter-culture-100",
    "sku": "BA-FOOD-001",
    "description": "Nutritious live Grindal worms (Enchytraeus buchholzi) starter culture. Exceptionally rich in natural proteins and essential lipids. Odorless and easy to culture on coconut coir at room temperature. The ultimate conditioning food for Bettas and fry.",
    "short_description": "High-protein live Grindal worm starter culture for fish & fry conditioning.",
    "price": 100,
    "compare_at_price": 150,
    "category_id": "a71581d6-2d40-4436-834e-75ffb933faaa",
    "category_name": "Fish Food & Nutrition",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 120,
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "20°C - 28°C",
    "ph_range": "6.0 - 7.5",
    "care_level": "Easy",
    "images": [
      "/product_image/grindal-worms-100.jpeg"
    ],
    "videos": [],
    "rating": 4.9,
    "review_count": 24,
    "tags": [
      "Live Food",
      "Grindal Worms",
      "Conditioning Culture",
      "Bestseller"
    ],
    "created_at": "2026-10-19T10:09:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000011",
    "name": "Premium Strain Guppy (1 Pair - Grade A)",
    "slug": "premium-strain-guppy-pair-120",
    "sku": "BA-GUPPY-002",
    "description": "Selected Grade-A pure strain fancy guppy pair. Bred for deep coloration, strong dorsal structure, and broad delta tail spread. Highly active and conditioned for aquarium communities or pure breeding colonies.",
    "short_description": "1 Male + 1 Female Grade-A premium fancy guppy pair.",
    "price": 120,
    "compare_at_price": 180,
    "category_id": "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    "category_name": "Guppies & Livebearers",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": false,
    "is_active": true,
    "status": "published",
    "weight": 150,
    "strain": "Grade A Fancy Guppy",
    "gender": "Breeding Pair",
    "size": "3.2 - 4.5 cm",
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "24°C - 28°C",
    "ph_range": "6.8 - 7.8",
    "care_level": "Easy",
    "shipping_restriction": "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    "images": [
      "/product_image/electric-blue-300.jpeg"
    ],
    "videos": [
      {
        "id": "vid-guppy-120",
        "url": "/videos/guppy-120.mp4",
        "title": "Premium Strain Guppy Pair Swimming Video",
        "thumbnail_url": "/product_image/electric-blue-300.jpeg"
      }
    ],
    "rating": 4.8,
    "review_count": 15,
    "tags": [
      "Guppy Pair",
      "Breeding Pair",
      "Grade A",
      "Video Included"
    ],
    "created_at": "2026-10-19T10:10:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000012",
    "name": "High Dorsal Fancy Guppy (1 Pair)",
    "slug": "high-dorsal-fancy-guppy-pair-150",
    "sku": "BA-GUPPY-003",
    "description": "Show lineage high dorsal fancy guppy breeding pair. Features an elongated dorsal sail that extends gracefully across the body with rich patterns and expansive caudal spread.",
    "short_description": "1 Male + 1 Female high dorsal sail fancy guppy pair.",
    "price": 150,
    "compare_at_price": 220,
    "category_id": "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    "category_name": "Guppies & Livebearers",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 150,
    "strain": "High Dorsal Fancy",
    "gender": "Breeding Pair",
    "size": "3.5 - 4.8 cm",
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "24°C - 28°C",
    "ph_range": "6.8 - 7.8",
    "care_level": "Easy",
    "shipping_restriction": "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    "images": [
      "/product_image/afr-flower-dorsal-400.jpeg"
    ],
    "videos": [
      {
        "id": "vid-guppy-150",
        "url": "/videos/guppy-150.mp4",
        "title": "High Dorsal Fancy Guppy Swimming Video",
        "thumbnail_url": "/product_image/afr-flower-dorsal-400.jpeg"
      }
    ],
    "rating": 4.9,
    "review_count": 21,
    "tags": [
      "High Dorsal",
      "Fancy Guppy",
      "Breeding Pair",
      "Video Included"
    ],
    "created_at": "2026-10-19T10:11:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000013",
    "name": "Hardy Community Guppy (1 Pair)",
    "slug": "hardy-community-guppy-pair-45",
    "sku": "BA-GUPPY-004",
    "description": "Resilient and active colorful community guppy pair. Acclimated to regular tap water conditions, highly disease-resistant, and ideal for beginners, planted nano tanks, and lively community setups.",
    "short_description": "1 Male + 1 Female resilient colorful community guppy pair.",
    "price": 45,
    "compare_at_price": 70,
    "category_id": "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    "category_name": "Guppies & Livebearers",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": false,
    "is_active": true,
    "status": "published",
    "weight": 150,
    "strain": "Community Guppy",
    "gender": "Breeding Pair",
    "size": "3.0 - 4.2 cm",
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "22°C - 29°C",
    "ph_range": "6.5 - 8.0",
    "care_level": "Easy",
    "shipping_restriction": "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    "images": [
      "/product_image/guppy-grass-50.jpeg"
    ],
    "videos": [
      {
        "id": "vid-guppy-45",
        "url": "/videos/guppy-45.mp4",
        "title": "Hardy Community Guppy Active Swimming Video",
        "thumbnail_url": "/product_image/guppy-grass-50.jpeg"
      }
    ],
    "rating": 4.7,
    "review_count": 28,
    "tags": [
      "Community Guppy",
      "Affordable",
      "Hardy Pair",
      "Video Included"
    ],
    "created_at": "2026-10-19T10:12:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000014",
    "name": "Full Red Guppy (1 Pair)",
    "slug": "full-red-guppy-pair-120",
    "sku": "BA-GUPPY-005",
    "description": "Solid crimson Full Red line-bred guppy pair. Vivid red coloration covers the head, body, dorsal, and delta caudal fin. High fertility strain conditioned on live cultures for maximum vibrancy.",
    "short_description": "1 Male + 1 Female pure strain solid Full Red guppy pair.",
    "price": 120,
    "compare_at_price": 180,
    "category_id": "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    "category_name": "Guppies & Livebearers",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 150,
    "strain": "Full Red",
    "gender": "Breeding Pair",
    "size": "3.5 - 4.5 cm",
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "24°C - 28°C",
    "ph_range": "6.8 - 7.8",
    "care_level": "Easy",
    "shipping_restriction": "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    "images": [
      "/product_image/afr-flower-dorsal-400.jpeg"
    ],
    "videos": [
      {
        "id": "vid-red-guppy-120",
        "url": "/videos/guppy-pair-120.mp4",
        "title": "Full Red Guppy Courtship & Swimming Video",
        "thumbnail_url": "/product_image/afr-flower-dorsal-400.jpeg"
      }
    ],
    "rating": 4.9,
    "review_count": 32,
    "tags": [
      "Full Red",
      "Red Guppy",
      "Breeding Pair",
      "Video Included"
    ],
    "created_at": "2026-10-19T10:13:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000015",
    "name": "Samurai Betta (1 Pair)",
    "slug": "samurai-betta-pair-350",
    "sku": "BA-BETTA-003",
    "description": "Rare Black Samurai dragon-scale Betta breeding pair. Features heavy metallic silver-white armor plating across the dorsal cap contrasting sharply against a midnight black body. Distinctive, bold flaring posture and championship genetics.",
    "short_description": "1 Male + 1 Female rare Black Samurai Dragon Scale Betta pair.",
    "price": 350,
    "compare_at_price": 500,
    "category_id": "0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4",
    "category_name": "Betta Fish",
    "subcategory_id": "71a4e4f4-1405-4fb7-8bd5-930700b65da8",
    "subcategory_name": "Plakat & Fighter Bettas",
    "stock_quantity": 30,
    "is_unique_specimen": true,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 150,
    "strain": "Black Samurai Dragon Scale",
    "gender": "Breeding Pair",
    "size": "4.5 - 5.5 cm",
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "24°C - 28°C",
    "ph_range": "6.5 - 7.5",
    "care_level": "Moderate",
    "shipping_restriction": "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    "images": [
      "/product_image/purple-hm-tail-400.jpeg"
    ],
    "videos": [
      {
        "id": "vid-samurai-350",
        "url": "/videos/betta-350.mp4",
        "title": "Samurai Betta Flaring & Swimming Video",
        "thumbnail_url": "/product_image/purple-hm-tail-400.jpeg"
      }
    ],
    "rating": 5,
    "review_count": 18,
    "tags": [
      "Samurai Betta",
      "Dragon Scale",
      "Rare Pair",
      "WYSIWYG 1-of-1",
      "Video Included"
    ],
    "created_at": "2026-10-19T10:14:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000016",
    "name": "Pure White Betta (1 Pair)",
    "slug": "pure-white-betta-pair-250",
    "sku": "BA-BETTA-004",
    "description": "Snow-white Platinum Betta breeding pair. Flawless solid white coloration with thick scales and pure translucent-free finnage. Acclimated and conditioned together for high fertility and show-grade offspring.",
    "short_description": "1 Male + 1 Female pristine Platinum Snow White Betta pair.",
    "price": 250,
    "compare_at_price": 380,
    "category_id": "0fbc7845-bbcb-499a-8ad3-5c3c51c4bca4",
    "category_name": "Betta Fish",
    "subcategory_id": "a1e2811c-ab3d-407b-8d46-213ee3058f07",
    "subcategory_name": "Halfmoon Bettas",
    "stock_quantity": 30,
    "is_unique_specimen": true,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 150,
    "strain": "Platinum Snow White",
    "gender": "Breeding Pair",
    "size": "4.5 - 5.5 cm",
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "24°C - 28°C",
    "ph_range": "6.5 - 7.5",
    "care_level": "Moderate",
    "shipping_restriction": "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    "images": [
      "/product_image/tiger-halfmoon-300.jpeg"
    ],
    "videos": [
      {
        "id": "vid-white-betta-250",
        "url": "/videos/betta-250.mp4",
        "title": "Pure White Betta Active Swimming Video",
        "thumbnail_url": "/product_image/tiger-halfmoon-300.jpeg"
      }
    ],
    "rating": 4.9,
    "review_count": 23,
    "tags": [
      "White Betta",
      "Platinum White",
      "Breeding Pair",
      "Video Included"
    ],
    "created_at": "2026-10-19T10:15:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000017",
    "name": "Platinum White Albino Guppy (1 Pair - Show Grade)",
    "slug": "platinum-white-albino-guppy-pair-799",
    "sku": "BA-GUPPY-006",
    "description": "Champion exhibition grade pure Platinum White Albino guppy breeding pair. Features piercing ruby albino eyes, gleaming pearlescent platinum white body, and broad high-dorsal delta tail spread. Bred under strict quarantine conditions.",
    "short_description": "1 Male + 1 Female show-grade Platinum White Albino collector pair.",
    "price": 799,
    "compare_at_price": 1199,
    "category_id": "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    "category_name": "Guppies & Livebearers",
    "stock_quantity": 30,
    "is_unique_specimen": true,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 150,
    "strain": "Platinum White Albino",
    "gender": "Breeding Pair",
    "size": "3.8 - 4.8 cm",
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "24°C - 28°C",
    "ph_range": "6.8 - 7.6",
    "care_level": "Moderate",
    "shipping_restriction": "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    "images": [
      "/product_image/green-platinum-dumbo-500.jpeg"
    ],
    "videos": [
      {
        "id": "vid-white-guppy-799",
        "url": "/videos/guppy-800.mp4",
        "title": "Platinum White Albino Guppy Swimming Video",
        "thumbnail_url": "/product_image/green-platinum-dumbo-500.jpeg"
      }
    ],
    "rating": 5,
    "review_count": 19,
    "tags": [
      "Albino Guppy",
      "Platinum White",
      "Show Grade Pair",
      "Video Included"
    ],
    "created_at": "2026-10-19T10:16:00.000Z"
  },
  {
    "id": "ba000001-0000-4000-8000-000000000018",
    "name": "Zeiltail Guppy Colony (5 Pairs Pack)",
    "slug": "zeiltail-guppy-colony-5pairs-150",
    "sku": "BA-GUPPY-007",
    "description": "Value colony package of 5 healthy breeding pairs (5 Males + 5 Females / 10 guppies total) of Zeiltail fancy guppies. Instant schooling community for planted aquariums with diverse shimmering colors and active swimming.",
    "short_description": "Colony pack of 5 breeding pairs (10 guppies total) Zeiltail guppies.",
    "price": 150,
    "compare_at_price": 250,
    "category_id": "9ebb7d17-8998-46b7-8e97-46a0812f7a80",
    "category_name": "Guppies & Livebearers",
    "stock_quantity": 30,
    "is_unique_specimen": false,
    "is_featured": true,
    "is_active": true,
    "status": "published",
    "weight": 350,
    "strain": "Zeiltail Fancy Colony",
    "gender": "Breeding Pair",
    "size": "3.0 - 4.2 cm",
    "water_type": "Freshwater (Tropical)",
    "temperature_range": "23°C - 28°C",
    "ph_range": "6.8 - 7.8",
    "care_level": "Easy",
    "shipping_restriction": "Special Live Oxygen Packing required. The Professional Couriers Road Delivery only.",
    "images": [
      "/product_image/electric-blue-300.jpeg"
    ],
    "videos": [
      {
        "id": "vid-zebra-5pair-150",
        "url": "/videos/zebra-5pair-150.mp4",
        "title": "Zeiltail Guppy Colony Pack Swimming Video",
        "thumbnail_url": "/product_image/electric-blue-300.jpeg"
      }
    ],
    "rating": 4.8,
    "review_count": 29,
    "tags": [
      "Zeiltail Colony",
      "5 Pairs Pack",
      "Bulk Pack",
      "Video Included"
    ],
    "created_at": "2026-10-19T10:17:00.000Z"
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  brand_name: 'Betta Aquatics',
  tagline: 'Pure Strain Bettas, Guppies & Ornamental Fish Sanctuary',
  contact_email: 'care@bettaaquatics.in',
  contact_phone: '+91 98765 43210',
  whatsapp_number: '919876543210',
  upi_id: 'bettaaquatics@icici',
  upi_payee_name: 'Betta Aquatics',
  bank_name: 'ICICI Bank',
  bank_account_no: '002405009988',
  bank_ifsc: 'ICIC0000024',
  bank_account_holder: 'Betta Aquatics',
  free_shipping_threshold: 999999,
  standard_shipping_rate: 80,
  live_packing_charge: 0,
  announcement_text: '🚚 The Professional Couriers Road Delivery across India! Safe Live Arrival Guarantee.',
  announcement_code: 'AQUA10',
  announcement_active: true,
  announcement_link: '/shop',
  serviceable_pincodes: [
    '110001', '110020', '400001', '400050', '560001', '560034',
    '600001', '600028', '700001', '700029', '500001', '500081',
    '380001', '411001', '682001', '641001', '302001'
  ],
  maintenance_mode: false,
  instagram_url: 'https://instagram.com/betta_aquatic_no1?utm_source=qr&dlrf=MTN4eGt5Nmk3Z3Izbw==',
  branding: {
    logo_url: '/logo.jpeg',
    mobile_logo_url: '/logo.jpeg',
    footer_logo_url: '/logo.jpeg',
    favicon_url: '/favicon.svg',
    site_name: 'Betta Aquatics',
    tagline: 'Pure Strain Bettas, Guppies & Ornamental Fish Sanctuary',
    instagram_url: 'https://instagram.com/betta_aquatic_no1?utm_source=qr&dlrf=MTN4eGt5Nmk3Z3Izbw==',
    primary_color: '#1e3a8a',
    secondary_color: '#dc2626',
    accent_color: '#0284c7',
    background_color: '#f8fafc',
    text_color: '#0f172a',
    primary_text_color: '#ffffff',
    secondary_text_color: '#ffffff',
    version: 1,
  },
};

export const DEFAULT_BRANDING_SETTINGS: BrandingSettings = {
  logo_url: '/logo.jpeg',
  mobile_logo_url: '/logo.jpeg',
  footer_logo_url: '/logo.jpeg',
  favicon_url: '/favicon.svg',
  site_name: 'Betta Aquatics',
  tagline: 'Pure Strain Bettas, Guppies & Ornamental Fish Sanctuary',
  instagram_url: 'https://instagram.com/betta_aquatic_no1?utm_source=qr&dlrf=MTN4eGt5Nmk3Z3Izbw==',
  primary_color: '#1e3a8a',
  secondary_color: '#dc2626',
  accent_color: '#0284c7',
  background_color: '#f8fafc',
  text_color: '#0f172a',
  primary_text_color: '#ffffff',
  secondary_text_color: '#ffffff',
  version: 1,
};

export const INITIAL_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    title: 'Experience Living Jewels of the Aquatic World',
    subtitle: 'Pure-strain show Bettas, exotic guppy pairs, and planted aquarium essentials. Shipped safely across India with 100% Live Arrival Guarantee.',
    is_active: true,
    display_order: 1,
    config: {
      ctaPrimary: 'Explore Rare Strains',
      cta_text: 'Explore Rare Strains',
      ctaPrimaryLink: '/shop',
      cta_link: '/shop',
      ctaSecondary: 'Live Stock Video',
      secondary_cta_text: 'Live Stock Video',
      ctaSecondaryLink: '/live-stock',
      secondary_cta_link: '/live-stock',
      backgroundImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=85',
      background_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=85',
      badge: 'Certified Live Arrival Guarantee',
      badge_text: 'Certified Live Arrival Guarantee'
    }
  },
  {
    id: 'sec-categories',
    type: 'categories',
    title: 'Shop By Pure Strain Bloodline',
    subtitle: 'Certified healthy pedigree genetics with comprehensive live arrival warranty.',
    is_active: true,
    display_order: 2,
    config: {
      viewAllLink: '/shop',
    }
  },
  {
    id: 'sec-flash-deal',
    type: 'flash_deal',
    title: 'Show Specimen Flash Drops',
    subtitle: 'Strictly conditioned live specimens prepared for direct road courier dispatch.',
    is_active: true,
    display_order: 3,
    config: {
      endTimeHours: 12,
      bannerText: 'Direct Road Dispatch',
    }
  },
  {
    id: 'sec-specimen-showcase',
    type: 'specimen_showcase',
    title: 'Living Consignment Gallery',
    subtitle: 'Hand-picked champion lineage ready for immediate express booking across India.',
    is_active: true,
    display_order: 4,
    config: {
      ctaLink: '/shop',
      filterCategory: '9ebb7d17-8998-46b7-8e97-46a0812f7a80',
    }
  },
  {
    id: 'sec-guppies',
    type: 'curated_collection',
    title: 'Imported Guppy Trios & Breeding Pairs',
    subtitle: 'Vibrant genetics and conditioned pairs for hobbyists and breeders across India.',
    is_active: true,
    display_order: 5,
    config: {
      filterCategory: '9ebb7d17-8998-46b7-8e97-46a0812f7a80'
    }
  },
  {
    id: 'sec-breeder-story',
    type: 'breeder_story',
    title: 'Our Breeding & Quarantine Standards',
    subtitle: 'Three generations of selective breeding, 21-day quarantine protocols, and safe road dispatch.',
    is_active: true,
    display_order: 6,
    config: {
      quote: '"We are hobbyists first, breeders second, and sellers last."',
      breederName: 'Betta Aquatics Master Team',
      experienceYears: '9+ Years Experience',
      whatsapp: '+91 98765 43210',
      facilityImage: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80',
    }
  },
  {
    id: 'sec-care-guide',
    type: 'care_guide',
    title: 'Master Aquarium Care Guides',
    subtitle: 'Everything you need to know about water chemistry, acclimation, and feeding.',
    is_active: true,
    display_order: 7,
    config: {}
  },
  {
    id: 'sec-trust',
    type: 'trust_badges',
    title: 'Why Hobbyists Choose Betta Aquatics',
    subtitle: 'Built on trust, bio-security, and unmatched specimen quality.',
    is_active: true,
    display_order: 8,
    config: {}
  },
  {
    id: 'sec-testimonials',
    type: 'testimonials',
    title: 'Customer Feedback & Unboxing Stories',
    subtitle: 'Read genuine reviews from fishkeepers across India on our safe packaging and fish vitality.',
    is_active: true,
    display_order: 9,
    config: {}
  },
  {
    id: 'sec-newsletter',
    type: 'newsletter',
    title: 'Join The VIP Fish Club',
    subtitle: 'Be the first to know when rare wild hybrids and master show specimens are listed.',
    is_active: true,
    display_order: 10,
    config: {}
  }
];

export const INITIAL_CMS_PAGES: CMSPage[] = [
  {
    id: 'page-shipping',
    slug: 'shipping-acclimation',
    title: 'Live Fish Shipping & Acclimation Guide',
    meta_title: 'Live Fish Shipping & Acclimation Guide | Betta Aquatics',
    meta_description: 'Step-by-step float and drip acclimation guide and Live Arrival Guarantee policy for ornamental fish.',
    is_published: true,
    updated_at: '2026-03-20T10:00:00Z',
    content_html: `
      <h2>100% Live Arrival Guarantee (DOA Policy)</h2>
      <p>At Betta Aquatics, every fish is conditioned for 72 hours before dispatch. We pack using heavy-gauge medical bags with pure medical oxygen, insulated EPS thermal thermocol boxes, and heat/cooling packs calibrated to transit weather.</p>
      
      <h3>State-Wise Road Courier Delivery Rates:</h3>
      <ul>
        <li><strong>Kerala:</strong> ₹80 (Up to 10 pairs)</li>
        <li><strong>Tamil Nadu & Karnataka:</strong> ₹120 (Up to 10 pairs)</li>
        <li><strong>All Other Indian States:</strong> ₹200 (Up to 10 pairs)</li>
        <li><em>Orders over 10 pairs: 2X courier charge for heavy dual-crate packaging.</em></li>
      </ul>

      <h3>How Our Live Arrival Guarantee Works:</h3>
      <ul>
        <li>In the unlikely event of Dead-on-Arrival (DOA), notify our team within <strong>2 hours of package delivery</strong>.</li>
        <li>Provide an uncut 30-second unboxing video showing the shipping label and unopened bag.</li>
        <li>Once verified, we provide an immediate 100% store credit or free specimen replacement.</li>
      </ul>

      <h3>Step-by-Step Acclimation Instructions:</h3>
      <ol>
        <li><strong>Dim Tank Lights:</strong> Turn off bright aquarium lighting to reduce stress for your new fish.</li>
        <li><strong>Float the Bag (15-20 Minutes):</strong> Float the sealed bag on top of your aquarium water to equalize temperature gradually.</li>
        <li><strong>Water Mixing:</strong> Open the bag and gently add 1/4 cup of your aquarium water every 5 minutes for 20 minutes (or use a drip line).</li>
        <li><strong>Release Fish (Do Not Dump Bag Water):</strong> Net the fish gently out of the shipping water and release it into the tank. Discard the shipping bag water.</li>
        <li><strong>Feeding:</strong> Do not feed your new fish for the first 12 to 24 hours while it settles into its new environment.</li>
      </ol>
    `
  },
  {
    id: 'page-about',
    slug: 'about-us',
    title: 'About Betta Aquatics',
    meta_title: 'About Us | Betta Aquatics India',
    meta_description: 'Learn about India\'s premier specialized betta and guppy breeding sanctuary.',
    is_published: true,
    updated_at: '2026-03-20T10:00:00Z',
    content_html: `
      <h2>Ethical Aquaculture & Passion for Living Jewels</h2>
      <p>Founded by passionate aquatic breeders and biological researchers, <strong>Betta Aquatics</strong> was born out of a single mission: to provide the highest-grade pure strain Bettas, championship Guppies, and exotic freshwater specimens across India.</p>
      <p>Unlike commercial high-density wholesale farms, our indoor biosecure facility maintains individual high-filtration barracks and softwater conditioning for every specimen. Each fish receives balanced live feeds, pristine water conditions, and daily health checks.</p>
      <h3>Our Standards:</h3>
      <ul>
        <li><strong>True-to-Specimen Transparency:</strong> For unique specimens, the fish you view in our photos and videos is the exact fish you receive.</li>
        <li><strong>Medical Grade Packing:</strong> Medical oxygenated bags with stress-coat conditioners and temperature-controlled insulated shipping boxes.</li>
        <li><strong>Direct Surface Transport:</strong> Fast, safe road transit via The Professional Couriers.</li>
      </ul>
    `
  },
  {
    id: 'page-faq',
    slug: 'faq',
    title: 'Frequently Asked Questions',
    meta_title: 'Frequently Asked Questions | Betta Aquatics',
    meta_description: 'Answers to your common questions regarding orders, payment verification, shipping, and fish health.',
    is_published: true,
    updated_at: '2026-03-20T10:00:00Z',
    content_html: `
      <h2>Ordering & Delivery Questions</h2>
      <h4>How long does delivery take?</h4>
      <p>We ship live ornamental fish strictly across India using specialized surface road transport via The Professional Couriers. Shipments arrive safely within 2 to 4 days backed by our 100% Live Arrival Guarantee.</p>

      <h4>What are the delivery charges?</h4>
      <p>Kerala: ₹80 | Tamil Nadu & Karnataka: ₹120 | All other Indian states: ₹200. Orders above 10 pairs are charged 2X due to heavy dual-box packing.</p>

      <h4>What payment methods are supported?</h4>
      <p>We support all UPI Apps (Google Pay, PhonePe, Paytm, BHIM). You can simply scan the custom QR code or tap Pay at checkout and submit your 12-digit UTR reference ID.</p>
    `
  },
  {
    id: 'page-shipping-policy',
    slug: 'shipping-policy',
    title: 'Shipping Policy & Road Courier Rates',
    meta_title: 'Shipping Policy & Delivery Rates | Betta Aquatics',
    meta_description: 'State-wise road courier delivery charges by The Professional Couriers across India for live fish consignments.',
    is_published: true,
    updated_at: '2026-03-20T10:00:00Z',
    content_html: `
      <h2>Reliable Road Courier Logistics across India</h2>
      <p>Live fish are delicate living animals requiring specialized transit. Betta Aquatics partners exclusively with <strong>The Professional Couriers</strong> surface express road network to ensure safe, temperature-stable delivery across India.</p>
      <h3>State-Wise Delivery Rates:</h3>
      <ul>
        <li><strong>Kerala:</strong> ₹80 (Flat rate for up to 10 pairs)</li>
        <li><strong>Tamil Nadu & Karnataka:</strong> ₹120 (Flat rate for up to 10 pairs)</li>
        <li><strong>All Other Indian States:</strong> ₹200 (Flat rate for up to 10 pairs)</li>
        <li><em>Orders exceeding 10 pairs: 2X shipping rate for heavy double insulated packing.</em></li>
      </ul>
    `
  },
  {
    id: 'page-doa',
    slug: 'doa-policy',
    title: 'Live Arrival Guarantee & Dead-On-Arrival (DOA) Policy',
    meta_title: 'Live Arrival Guarantee & DOA Policy | Betta Aquatics',
    meta_description: 'Complete details on our 100% Live Arrival Guarantee and Dead-On-Arrival unboxing policy.',
    is_published: true,
    updated_at: '2026-03-20T10:00:00Z',
    content_html: `
      <h2>100% Live Arrival Guarantee</h2>
      <p>Every single consignment shipped via our road courier service is fully covered by our comprehensive Live Arrival Guarantee.</p>
      <h3>Claiming DOA Coverage:</h3>
      <ul>
        <li>Notification must be submitted via WhatsApp within 2 hours of package delivery timestamp from The Professional Couriers.</li>
        <li>Include a continuous, unedited 30-second unboxing video clearly displaying the intact shipping label and unbroken inner plastic seal.</li>
      </ul>
    `
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cp-01',
    code: 'AQUA10',
    description: 'Flat 10% discount on all fish and supplies',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 500,
    max_discount: 500,
    is_active: true,
  },
  {
    id: 'cp-02',
    code: 'FIRSTFISH',
    description: 'Flat ₹200 OFF on your first aquatic order',
    discount_type: 'fixed',
    discount_value: 200,
    min_order_amount: 1200,
    is_active: true,
  },
  {
    id: 'cp-03',
    code: 'VIPBETTA',
    description: 'Special 15% discount for orders above ₹3000',
    discount_type: 'percentage',
    discount_value: 15,
    min_order_amount: 3000,
    max_discount: 1000,
    is_active: true,
  },
  {
    id: 'cp-04',
    code: 'EXPIRED50',
    description: 'Expired test promotional discount',
    discount_type: 'percentage',
    discount_value: 50,
    min_order_amount: 500,
    expires_at: '2025-01-01T00:00:00Z',
    is_active: true,
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-01',
    slug: 'acclimating-show-grade-betta-fish',
    title: 'The Ultimate Acclimation Protocol: Protecting High-Grade Bettas After Courier Transit',
    excerpt: 'Step-by-step master protocol to transition sensitive show-grade Bettas from pressurized oxygen transit pouches into your home aquarium without osmotic shock or fin curl.',
    featured_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    category: 'Betta Care & Acclimation',
    tags: ['Acclimation', 'Water Parameters', 'Show Bettas', 'Road Courier'],
    author: {
      name: 'Dr. Anand Raman',
      role: 'Chief Marine Biologist & Founder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    read_time_minutes: 6,
    is_published: true,
    views_count: 1420,
    published_at: '2026-03-15T09:00:00Z',
    updated_at: '2026-03-20T11:30:00Z',
    meta_title: 'Acclimating Show-Grade Ornamental Fish After Shipping | Betta Aquatics',
    meta_description: 'Prevent temperature shock and fin clamp with our veterinarian-approved drip acclimation protocol for live Betta splendens shipments.',
    content_html: `
      <h2>The Critical First 120 Minutes</h2>
      <p>When your insulated thermocol crate arrives, your specimen has traveled under high-purity medical oxygen. While our double-walled bags maintain stable dissolved oxygen, the physical chemistry inside the bag changes gradually as the fish respires.</p>
      
      <p>Opening the bag introduces fresh atmospheric air, which causes ammonia in the water to convert quickly into toxic free ammonia (NH3) as pH rises. <strong>Therefore, speed and precision are critical once the shipping seal is broken.</strong></p>

      <h3>Phase 1: Temperature Float (20-25 Minutes)</h3>
      <p>Never open the shipping pouch immediately. Float the sealed bag intact in your dimmed quarantine or display tank for 20 to 25 minutes. This ensures thermal equilibrium between the shipping water (typically 24°C - 26°C) and your aquarium (ideal: 26.5°C - 27.5°C).</p>

      <h3>Phase 2: Slow Drip Acclimation (45 Minutes)</h3>
      <p>Pour the fish and transit water into a clean, dedicated 5-liter acclimation bucket. Using airline tubing with a plastic control valve, initiate a drip siphon from the destination tank into the bucket at a rate of <strong>2 to 3 drops per second</strong>.</p>
      
      <ul>
        <li>Double the initial water volume over 30 minutes.</li>
        <li>Discard half the water carefully, then drip-fill again for another 15 minutes.</li>
        <li>Add 2 drops of concentrated stress-guard or natural Indian almond leaf extract (tannins).</li>
      </ul>

      <h3>Phase 3: The Net Transfer (Zero Transit Water)</h3>
      <p><strong>Golden Rule: Never dump courier bag water into your established aquarium.</strong> Use a soft, knotless nylon specimen net to gently lift the Betta into the destination tank. Leave all tank lighting OFF for the first 12 hours to prevent disorientation and cortisol spikes.</p>

      <blockquote>
        "Patience during the first 6 hours post-arrival determines the longevity and vibrant fin flare of a champion show betta." — Dr. Anand Raman
      </blockquote>
    `
  },
  {
    id: 'post-02',
    slug: 'betta-fish-genetics-halfmoon-vs-alien-strains',
    title: 'Betta Genetics Breakdown: Understanding Dragon Scale, Halfmoon, and Alien Hybrid Strains',
    excerpt: 'An enthusiast breakdown of fin morphology, iridescent guanine pigment layers, and the fascinating hybridization behind modern wild-type Alien Bettas.',
    featured_image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80',
    category: 'Genetics & Strains',
    tags: ['Betta Genetics', 'Alien Betta', 'Halfmoon', 'Morphology'],
    author: {
      name: 'Rohan Mehra',
      role: 'Line Breeding Geneticist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    read_time_minutes: 8,
    is_published: true,
    views_count: 2180,
    published_at: '2026-03-22T14:00:00Z',
    updated_at: '2026-03-24T08:15:00Z',
    meta_title: 'Betta Genetics Explained: Halfmoon, Alien & Dragonscale | Betta Aquatics',
    meta_description: 'Explore the fascinating scientific genetics behind Betta splendens fin spreads, iridescent dragonscale layering, and complex Alien hybrids.',
    content_html: `
      <h2>The 180-Degree Halfmoon Standard</h2>
      <p>The iconic <em>Halfmoon (HM)</em> betta is defined by a caudal fin that expands to a full 180-degree semi-circle when flaring at a mirror or rival. This trait is controlled by polygenic ray-branching genetics (primary rays branching into secondary and tertiary rays).</p>

      <p>True show-grade halfmoons require crisp, straight outer fin edges (known as the 'D-shape'). Over-halfmoons (OHM) exceed 180 degrees, while Super Deltas typically reach 150 to 175 degrees.</p>

      <h3>The Phenomenon of Alien Bettas</h3>
      <p>Unlike standard captive domestic varieties derived solely from <em>Betta splendens</em>, <strong>Alien Bettas are complex inter-species hybrids</strong>. Modern bloodlines combine:</p>
      <ul>
        <li><strong>Betta mahachaiensis:</strong> Contributes the tight metallic grid-scale pattern and green/copper sheen.</li>
        <li><strong>Betta stiktos & imbellis:</strong> Provides peaceful temperament and distinctive facial mask streaks.</li>
        <li><strong>Betta smaragdina:</strong> Adds turquoise radiance and elongated pelvic fins.</li>
      </ul>

      <h3>Dragonscale Layering: Beauty & Caution</h3>
      <p>The metallic opacity in Dragonscale bettas is caused by an extraordinarily thick layer of guanine crystals in the top stratum of dermal cells. While visually striking, keepers must watch for diamond-eye (growth of guanine over the lens), making clean, unblocked lineages prized by connoisseurs.</p>
    `
  },
  {
    id: 'post-03',
    slug: 'top-aquarium-plants-for-betta-tanks',
    title: 'Top 7 Live Aquarium Plants for Small Betta Tanks & Nano Aquascapes',
    excerpt: 'Transform your nano tank into a biological paradise. Discover non-sharp live plants that absorb excess nitrates, provide resting hammocks, and thrive without CO2 injection.',
    featured_image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1200&q=80',
    category: 'Aquascaping & Plants',
    tags: ['Aquascaping', 'Live Plants', 'Nano Tanks', 'Water Quality'],
    author: {
      name: 'Pooja Varma',
      role: 'Aquascape Designer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    read_time_minutes: 5,
    is_published: true,
    views_count: 980,
    published_at: '2026-03-28T16:30:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    meta_title: 'Best Live Plants for Betta Fish Aquariums | Betta Aquatics Guide',
    meta_description: 'Anubias, Java Fern, and Amazon Swords: Learn which aquarium plants are best for Betta splendens tanks with low light and zero CO2.',
    content_html: `
      <h2>Why Real Plants Beat Artificial Decor</h2>
      <p>Plastic plants have sharp molding seams that easily shred delicate betta finnage. Real aquatic plants, on the other hand, produce oxygen, absorb toxic nitrates, and provide resting resting leaves near the water surface where bettas breathe atmospheric oxygen through their labyrinth organ.</p>

      <h3>1. Anubias Barteri var. Nana</h3>
      <p>The ultimate betta plant. Its broad, thick horizontal leaves serve as natural sleeping hammocks near the waterline. <em>Crucial Note:</em> Never bury the rhizome in gravel or substrate; attach it to driftwood or lava rock using aquarium-safe cyanoacrylate glue or cotton thread.</p>

      <h3>2. Java Fern (Microsorum Pteropus)</h3>
      <p>Virtually indestructible, Java Fern thrives in low-to-medium ambient light. Its ruffled upright foliage creates visual depth and shelter for resting bettas without demanding CO2 supplementation.</p>

      <h3>3. Amazon Frogbit & Red Root Floaters</h3>
      <p>Floating plants with dangling root systems replicate the natural rice-paddy environments of Southeast Asia. Bettas use floating root networks as anchor points for constructing bubble nests.</p>
    `
  },
  {
    id: 'post-04',
    slug: 'conditioning-betta-breeding-pairs',
    title: 'Conditioning Trophy Betta Breeding Pairs: Live Feed, Temperature Cycles & Bubble Nesting',
    excerpt: 'The professional breeder schedule for conditioning male and female Bettas. Learn live culture feeding regimes, barrier introduction protocols, and water chemistry triggers.',
    featured_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    category: 'Breeding & Conditioning',
    tags: ['Breeding', 'Live Food', 'Bubble Nest', 'Egg Conditioning'],
    author: {
      name: 'Dr. Anand Raman',
      role: 'Chief Marine Biologist & Founder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    read_time_minutes: 7,
    is_published: true,
    views_count: 1750,
    published_at: '2026-04-02T11:00:00Z',
    updated_at: '2026-04-04T12:00:00Z',
    meta_title: 'How to Condition Betta Breeding Pairs | Professional Breeder Guide',
    meta_description: 'Step-by-step master conditioning guide: live mosquito larvae feeding, Indian almond leaf conditioning, bubble nest triggers, and safe pair introduction.',
    content_html: `
      <h2>The 14-Day Conditioning Countdown</h2>
      <p>Successful Betta breeding is 80% conditioning and 20% spawning mechanics. A female without mature egg clutches will fail to trigger the male, while an undernourished male will exhaust his energy reserves before the fry become free-swimming.</p>

      <h3>Dietary Energy: Live Foods Only</h3>
      <p>During the two-week conditioning phase, suspend dry commercial pellets. Feed 3 to 4 micro-meals daily of:</p>
      <ul>
        <li>Freshly hatched Baby Brine Shrimp (Artemia nauplii) rich in unsaturated fatty acids.</li>
        <li>Live cultured white worms or blackworms for high lipid content.</li>
        <li>Frozen bloodworms supplemented with liquid marine multivitamins.</li>
      </ul>

      <h3>The Chimney Barrier Technique</h3>
      <p>Introduce the female inside a clear glass cylinder (the 'chimney') placed inside the male's shallow (15cm depth) breeding tank. The male will flare intensely, develop deep coloration, and begin constructing a foam bubble nest under floating styrofoam or almond leaves without physically harming the female.</p>
    `
  }
];

export const INITIAL_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'med-01',
    filename: 'hero-halfmoon-specimen.jpg',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
    alt_text: 'Show-class Royal Blue Halfmoon Betta swimming in planted display aquarium',
    file_size_bytes: 342100,
    mime_type: 'image/jpeg',
    category: 'banner',
    created_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'med-02',
    filename: 'bengaluru-facility-tanks.jpg',
    url: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Indoor climate-controlled individual Betta barrack system in Bengaluru facility',
    file_size_bytes: 412800,
    mime_type: 'image/jpeg',
    category: 'breeder',
    created_at: '2026-03-02T11:30:00Z',
  },
  {
    id: 'med-03',
    filename: 'galaxy-koi-plakat-detail.jpg',
    url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Candy marbled Galaxy Koi Plakat Betta with cyan iridescent dragon scales',
    file_size_bytes: 289400,
    mime_type: 'image/jpeg',
    category: 'specimen',
    created_at: '2026-03-05T09:15:00Z',
  },
  {
    id: 'med-04',
    filename: 'logo-fish.svg',
    url: '/logo-fish.svg',
    alt_text: 'Brand emblem with stylized fish icon',
    file_size_bytes: 4200,
    mime_type: 'image/svg+xml',
    category: 'ui',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'med-04b',
    filename: 'logo.jpeg',
    url: '/logo.jpeg',
    alt_text: 'Betta Aquatics custom primary logo',
    file_size_bytes: 111539,
    mime_type: 'image/jpeg',
    category: 'ui',
    created_at: '2026-10-18T13:53:48Z',
  },
  {
    id: 'med-05',
    filename: 'anubias-planted-aquascape.jpg',
    url: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Anubias and submerged tropical aquarium plants anchored on natural driftwood',
    file_size_bytes: 367900,
    mime_type: 'image/jpeg',
    category: 'banner',
    created_at: '2026-03-10T14:20:00Z',
  },
  {
    id: 'med-06',
    filename: 'alien-green-wild-hybrid.jpg',
    url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Alien Green wild hybrid Betta with full-body emerald metallic sheen',
    file_size_bytes: 312500,
    mime_type: 'image/jpeg',
    category: 'specimen',
    created_at: '2026-03-14T16:00:00Z',
  },
  {
    id: 'med-07',
    filename: 'royal-blue-halfmoon-swimming.mp4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-bright-red-betta-fish-swimming-41712-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    alt_text: 'High-definition 1080p swimming footage of Royal Blue Halfmoon Betta actively flaring in planted biotope',
    file_size_bytes: 14200000,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 14,
    dimensions: { width: 1920, height: 1080 },
    created_at: '2026-03-15T11:00:00Z',
  },
  {
    id: 'med-08',
    filename: 'planted-aquarium-ambient-showcase.mp4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-colorful-betta-fish-in-an-aquarium-41713-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Ambient planted aquarium tank loop with gentle water flow and schooling rasboras',
    file_size_bytes: 21500000,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 22,
    dimensions: { width: 1920, height: 1080 },
    created_at: '2026-03-16T15:30:00Z',
  },
  {
    id: 'med-vid-01',
    filename: 'betta-male-100.mp4',
    url: '/videos/betta-male-100.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Active Male Fighter Betta Swimming Video',
    file_size_bytes: 4706838,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 15,
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'med-vid-02',
    filename: 'betta-250.mp4',
    url: '/videos/betta-250.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Selected Crown & Plakat Betta Swimming Video',
    file_size_bytes: 915905,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 12,
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'med-vid-03',
    filename: 'betta-350.mp4',
    url: '/videos/betta-350.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Show Halfmoon Flaring Demonstration',
    file_size_bytes: 2446150,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 18,
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'med-vid-04',
    filename: 'green-tail-100.mp4',
    url: '/videos/green-tail-100.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Green Tail Pure Strain Guppy Swimming Video',
    file_size_bytes: 484407,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 10,
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'med-vid-05',
    filename: 'guppy-pair-120.mp4',
    url: '/videos/guppy-pair-120.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Guppy Pair Swimming & Courtship Video',
    file_size_bytes: 513572,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 12,
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'med-vid-06',
    filename: 'guppy-120.mp4',
    url: '/videos/guppy-120.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Delta Tail Guppy Active Swimming Video',
    file_size_bytes: 463988,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 11,
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'med-vid-07',
    filename: 'guppy-150.mp4',
    url: '/videos/guppy-150.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Select Grade Exotic Guppy Swimming Footage',
    file_size_bytes: 443294,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 10,
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'med-vid-08',
    filename: 'guppy-45.mp4',
    url: '/videos/guppy-45.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Community Tank Guppy Active Swimming Video',
    file_size_bytes: 570832,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 13,
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'med-vid-09',
    filename: 'guppy-800.mp4',
    url: '/videos/guppy-800.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Collector Champion Guppy Pair Swimming Video',
    file_size_bytes: 1513566,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 25,
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'med-vid-10',
    filename: 'zebra-5pair-150.mp4',
    url: '/videos/zebra-5pair-150.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1544943910-4c1dc44a0558?auto=format&fit=crop&w=800&q=80',
    alt_text: 'Zebra Danio Schooling Pack Active Swimming Video',
    file_size_bytes: 6753113,
    mime_type: 'video/mp4',
    category: 'video',
    duration_seconds: 40,
    created_at: '2026-10-18T14:30:00Z',
  }
];


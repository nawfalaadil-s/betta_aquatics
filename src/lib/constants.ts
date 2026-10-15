import { Category, Product, StoreSettings, HomepageSection, CMSPage, Coupon } from './types';

export const COURIER_PRESETS = [
  {
    name: 'Bluedart Air Express (Apex Live)',
    urlTemplate: 'https://www.bluedart.com/tracking?trackNumber={AWB}',
    description: 'Guaranteed 24-48h overnight airport-to-doorstep air transport for live fish.',
  },
  {
    name: 'DTDC Priority Air Cargo',
    urlTemplate: 'https://www.dtdc.in/tracking.asp?trNo={AWB}',
    description: 'Fast air transit with live animal temperature control notification.',
  },
  {
    name: 'Delhivery Surface / Direct',
    urlTemplate: 'https://www.delhivery.com/track/package/{AWB}',
    description: 'Reliable parcel delivery for aquarium accessories, plants and fish food.',
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
    id: 'cat-betta',
    name: 'Betta Fish',
    slug: 'betta-fish',
    description: 'Exquisite Halfmoon, Crowntail, Plakat & Rare Giant Bettas sourced from champion bloodlines.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'cat-guppy',
    name: 'Guppies & Livebearers',
    slug: 'guppies',
    description: 'Pure strain Albino Full Red, Dumbo Ear Mosaic, and Blue Dragon imported guppy pairs.',
    image_url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'cat-pairs',
    name: 'Breeding Pairs & Rare Strains',
    slug: 'breeding-pairs',
    description: 'Carefully conditioned, proven fertile breeding pairs with lineage certificates.',
    image_url: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=600&q=80',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'cat-plants',
    name: 'Aquatic Plants',
    slug: 'aquatic-plants',
    description: 'Snail-free, tissue-cultured and submerged aquatic plants for lush natural aquascapes.',
    image_url: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=600&q=80',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'cat-food',
    name: 'Fish Food & Nutrition',
    slug: 'fish-food',
    description: 'High-protein micro pellets, freeze-dried bloodworms, and color-enhancing spirulina feeds.',
    image_url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80',
    display_order: 5,
    is_active: true,
  },
  {
    id: 'cat-accessories',
    name: 'Aquarium Accessories',
    slug: 'accessories',
    description: 'Gentle sponge filters, Betta leaf hammocks, Indian almond leaves, and water conditioners.',
    image_url: 'https://images.unsplash.com/photo-1544943910-4c1dc44a0558?auto=format&fit=crop&w=600&q=80',
    display_order: 6,
    is_active: true,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Royal Blue Halfmoon Betta (Show Class Male)',
    slug: 'royal-blue-halfmoon-betta-show-class',
    sku: 'BA-HM-001',
    description: 'A breathtaking show-quality Royal Blue Halfmoon Betta with a complete 180-degree caudal spread. Hand-selected from top breeder tanks in Thailand, this specimen features iridescent royal blue scales transitioning into metallic cyan edges. Active, healthy, and flare-trained.',
    short_description: 'Pure Royal Blue iridescent show specimen with 180° caudal spread.',
    price: 1499,
    compare_at_price: 1899,
    category_id: 'cat-betta',
    category_name: 'Betta Fish',
    stock_quantity: 1,
    is_unique_specimen: true,
    is_featured: true,
    is_active: true,
    strain: 'Halfmoon',
    gender: 'Male',
    size: '4.2 cm (Body)',
    water_type: 'Freshwater (Tropical)',
    temperature_range: '24°C - 28°C',
    ph_range: '6.5 - 7.5',
    care_level: 'Moderate',
    diet: 'High-protein micro pellets & frozen bloodworms',
    shipping_restriction: 'Special Live Oxygen Packing required. Express Air Delivery only.',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    review_count: 28,
    tags: ['Bestseller', 'Show Class', 'Single Specimen'],
    created_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prod-002',
    name: 'Galaxy Koi Plakat Betta (Candy Marbled)',
    slug: 'galaxy-koi-plakat-betta-candy-marbled',
    sku: 'BA-PK-002',
    description: 'An eye-catching Galaxy Koi Plakat Betta sporting a rare mosaic of deep crimson, pure porcelain white, ink black spots, and shimmering blue galaxy scales across the dorsal fin. Short-fin active swimmer ideal for planted nano tanks.',
    short_description: 'Spectacular multi-color Koi Plakat with blue galaxy scales.',
    price: 1799,
    compare_at_price: 2200,
    category_id: 'cat-betta',
    category_name: 'Betta Fish',
    stock_quantity: 1,
    is_unique_specimen: true,
    is_featured: true,
    is_active: true,
    strain: 'Plakat (Shortfin)',
    gender: 'Male',
    size: '3.8 cm (Body)',
    water_type: 'Freshwater (Tropical)',
    temperature_range: '25°C - 28°C',
    ph_range: '6.8 - 7.4',
    care_level: 'Easy',
    diet: 'Carnivorous micro pellets, mosquito larvae, daphnia',
    shipping_restriction: 'Live Arrival Guarantee with thermal insulation.',
    images: [
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 5.0,
    review_count: 19,
    tags: ['Rare Koi', 'Single Specimen', 'High Demand'],
    created_at: '2026-03-05T12:00:00Z',
  },
  {
    id: 'prod-003',
    name: 'Black Orchid Crowntail Betta (Jet Black Crown)',
    slug: 'black-orchid-crowntail-betta',
    sku: 'BA-CT-003',
    description: 'True Black Orchid Crowntail with signature web reduction in rays creating a jagged, dramatic crown silhouette. Displays subtle steel blue highlights between web rays when illuminated under aquarium LED lighting.',
    short_description: 'Dramatic black Crowntail with razor fin rays and metallic undertones.',
    price: 1299,
    compare_at_price: 1599,
    category_id: 'cat-betta',
    category_name: 'Betta Fish',
    stock_quantity: 3,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    strain: 'Crowntail',
    gender: 'Male',
    size: '4.0 cm',
    water_type: 'Freshwater (Tropical)',
    temperature_range: '24°C - 29°C',
    ph_range: '6.5 - 7.2',
    care_level: 'Moderate',
    diet: 'Betta pro flakes, spirulina pellets',
    images: [
      'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    review_count: 34,
    tags: ['Crowntail', 'Popular'],
    created_at: '2026-03-08T09:30:00Z',
  },
  {
    id: 'prod-004',
    name: 'Super White Dumbo Ear Halfmoon Betta',
    slug: 'super-white-dumbo-ear-halfmoon-betta',
    sku: 'BA-DB-004',
    description: 'Pristine, solid snow-white Betta with enlarged "Big Ear" pectoral fins that flutter like delicate angel wings. Pure platinum genetics with no red wash or blemishes. Hand-conditioned for exhibition.',
    short_description: 'Solid snow-white coloration with majestic oversized pectoral fins.',
    price: 1999,
    compare_at_price: 2499,
    category_id: 'cat-betta',
    category_name: 'Betta Fish',
    stock_quantity: 1,
    is_unique_specimen: true,
    is_featured: true,
    is_active: true,
    strain: 'Dumbo Ear Halfmoon',
    gender: 'Male',
    size: '4.5 cm',
    water_type: 'Freshwater (Tropical)',
    temperature_range: '24°C - 28°C',
    ph_range: '6.5 - 7.0',
    care_level: 'Moderate',
    diet: 'Premium artemia, micropellets',
    images: [
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    review_count: 14,
    tags: ['Platinum White', 'Rare Specimen'],
    created_at: '2026-03-10T14:15:00Z',
  },
  {
    id: 'prod-005',
    name: 'Albino Full Red Guppy (Proven Breeding Pair)',
    slug: 'albino-full-red-guppy-breeding-pair',
    sku: 'BA-GP-005',
    description: 'Grade-A imported Albino Full Red (AFR) Guppy Pair. The male features a fiery red delta dorsal and delta tail with pink ruby eyes; the female is pre-conditioned and ready for gentle breeding in soft planted tanks.',
    short_description: '1 Male + 1 Female pure strain Albino Full Red breeding pair.',
    price: 1199,
    compare_at_price: 1499,
    category_id: 'cat-guppy',
    category_name: 'Guppies & Livebearers',
    stock_quantity: 8,
    is_unique_specimen: false,
    is_featured: true,
    is_active: true,
    strain: 'Albino Full Red',
    gender: 'Breeding Pair',
    size: '3.0 - 4.5 cm',
    water_type: 'Freshwater (Tropical)',
    temperature_range: '22°C - 26°C',
    ph_range: '7.0 - 8.0',
    care_level: 'Easy',
    diet: 'Baby brine shrimp, flake food, micro-worms',
    images: [
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    review_count: 42,
    tags: ['Breeding Pair', 'Pure Strain', 'Bestseller'],
    created_at: '2026-03-12T11:00:00Z',
  },
  {
    id: 'prod-006',
    name: 'Alien Green Betta (Wild Hybrid Strain)',
    slug: 'alien-green-betta-wild-hybrid',
    sku: 'BA-AL-006',
    description: 'An extraordinary wild-type hybrid developed by crossing Betta splendens with Betta smaragdina and Betta imbellis. Full-body metallic emerald green scales with mask coverage on the face. Extremely hardy and agile.',
    short_description: 'Exotic wild-hybrid metallic emerald green Betta.',
    price: 2199,
    compare_at_price: 2699,
    category_id: 'cat-betta',
    category_name: 'Betta Fish',
    stock_quantity: 1,
    is_unique_specimen: true,
    is_featured: true,
    is_active: true,
    strain: 'Alien (Wild Hybrid)',
    gender: 'Male',
    size: '4.0 cm',
    water_type: 'Freshwater (Blackwater / Tropical)',
    temperature_range: '24°C - 29°C',
    ph_range: '6.0 - 7.0',
    care_level: 'Moderate',
    diet: 'Carnivorous, mosquito larvae, bloodworms',
    images: [
      'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 5.0,
    review_count: 9,
    tags: ['Exotic Wild Hybrid', 'Exclusive Specimen'],
    created_at: '2026-03-14T16:00:00Z',
  },
  {
    id: 'prod-007',
    name: 'Anubias Barteri var. Nana (Attached on Driftwood)',
    slug: 'anubias-nana-on-driftwood',
    sku: 'BA-PL-007',
    description: 'A robust, slow-growing Anubias Nana plant pre-rooted on a selected piece of natural aquatic driftwood. Perfect natural resting perch for Betta fish. Low light requirement, no CO2 injection needed.',
    short_description: 'Lush hardy plant anchored on cured natural driftwood.',
    price: 449,
    compare_at_price: 599,
    category_id: 'cat-plants',
    category_name: 'Aquatic Plants',
    stock_quantity: 15,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    water_type: 'Freshwater',
    temperature_range: '22°C - 30°C',
    care_level: 'Easy',
    diet: 'Liquid fertilizer (trace elements)',
    images: [
      'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    review_count: 53,
    tags: ['Low Light', 'Natural Aquascape'],
    created_at: '2026-03-15T08:00:00Z',
  },
  {
    id: 'prod-008',
    name: 'Ultra-Color Betta Pro Pellets (50g)',
    slug: 'ultra-color-betta-pro-pellets-50g',
    sku: 'BA-FD-008',
    description: 'Specially formulated 1.0mm floating micro-pellets enriched with wild krill, astaxanthin, spirulina, and stabilized Vitamin C to enhance coloration and strengthen immune response.',
    short_description: 'High-protein 48% color-enhancing floating micro-pellets.',
    price: 299,
    compare_at_price: 380,
    category_id: 'cat-food',
    category_name: 'Fish Food & Nutrition',
    stock_quantity: 40,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    care_level: 'Easy',
    images: [
      'https://images.unsplash.com/photo-1544943910-4c1dc44a0558?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    review_count: 88,
    tags: ['Nutrition', 'Color Enhancing'],
    created_at: '2026-03-16T10:00:00Z',
  },
  {
    id: 'prod-009',
    name: 'Indian Almond Leaves (Catappa Leaves - 20 Pack)',
    slug: 'catappa-indian-almond-leaves-pack',
    sku: 'BA-AC-009',
    description: '100% natural dried Indian Almond leaves. Releases beneficial tannins, lowers pH gently, creates therapeutic blackwater conditions, and contains natural antibacterial properties for fin health.',
    short_description: 'Natural organic tannins and fin rot protection for Bettas.',
    price: 249,
    compare_at_price: 350,
    category_id: 'cat-accessories',
    category_name: 'Aquarium Accessories',
    stock_quantity: 50,
    is_unique_specimen: false,
    is_featured: false,
    is_active: true,
    care_level: 'Easy',
    images: [
      'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    review_count: 67,
    tags: ['Water Care', 'Essential'],
    created_at: '2026-03-18T10:00:00Z',
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  brand_name: 'Betta Aquatics',
  tagline: 'India’s Premier Ornamental Fish Sanctuary',
  contact_email: 'care@bettaaquatics.in',
  contact_phone: '+91 98765 43210',
  whatsapp_number: '919876543210',
  upi_id: 'bettaaquatics@icici',
  upi_payee_name: 'Betta Aquatics Pvt Ltd',
  bank_name: 'ICICI Bank',
  bank_account_no: '002405009988',
  bank_ifsc: 'ICIC0000024',
  bank_account_holder: 'Betta Aquatics Pvt Ltd',
  free_shipping_threshold: 1999,
  standard_shipping_rate: 199,
  live_packing_charge: 149,
  announcement_text: '✨ 10% OFF on all Show Bettas! Use coupon AQUA10 at checkout | Free Live Oxygen Packing on orders above ₹1999',
  announcement_code: 'AQUA10',
  announcement_active: true,
  announcement_link: '/shop?category=betta-fish',
  serviceable_pincodes: [
    '110001', '110020', '400001', '400050', '560001', '560034',
    '600001', '600028', '700001', '700029', '500001', '500081',
    '380001', '411001', '682001', '641001', '302001'
  ],
  maintenance_mode: false,
};

export const INITIAL_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    title: 'Experience Living Jewels of the Aquatic World',
    subtitle: 'Champion-lineage Halfmoons, rare Galaxy Plakats, and pure-strain livebearers. Shipped directly to your doorstep with guaranteed live arrival.',
    is_active: true,
    display_order: 1,
    config: {
      ctaPrimary: 'Shop Bettas',
      ctaPrimaryLink: '/shop?category=betta-fish',
      ctaSecondary: 'Explore All Collections',
      ctaSecondaryLink: '/shop',
      backgroundImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
      badge: 'Certified Live Arrival Guarantee'
    }
  },
  {
    id: 'sec-categories',
    type: 'categories',
    title: 'Explore By Category',
    subtitle: 'Browse through our specialized captive-bred varieties and planted tank supplies',
    is_active: true,
    display_order: 2,
    config: {}
  },
  {
    id: 'sec-flash-deal',
    type: 'flash_deal',
    title: 'Deal of the Day: Show Specimens',
    subtitle: 'Limited single-specimen drops ending soon. Exact fish pictured is what arrives.',
    is_active: true,
    display_order: 3,
    config: {
      endTimeHours: 18,
      bannerText: 'Limited Stock - 1 Piece Each'
    }
  },
  {
    id: 'sec-specimen-showcase',
    type: 'specimen_showcase',
    title: 'Featured Living Specimens',
    subtitle: 'Hand-picked champion line Bettas ready for immediate express dispatch',
    is_active: true,
    display_order: 4,
    config: {
      filterCategory: 'cat-betta'
    }
  },
  {
    id: 'sec-guppies',
    type: 'curated_collection',
    title: 'Imported Guppy Trios & Breeding Pairs',
    subtitle: 'Vibrant genetics and conditioned pairs for hobbyists and breeders',
    is_active: true,
    display_order: 5,
    config: {
      filterCategory: 'cat-guppy'
    }
  },
  {
    id: 'sec-care-guide',
    type: 'care_guide',
    title: 'Master Aquarium Care Guides',
    subtitle: 'Everything you need to know about water chemistry, acclimation, and feeding',
    is_active: true,
    display_order: 6,
    config: {}
  },
  {
    id: 'sec-trust',
    type: 'trust_badges',
    title: 'Why Shop With Betta Aquatics?',
    subtitle: 'Uncompromising dedication to fish welfare and safe transit',
    is_active: true,
    display_order: 7,
    config: {}
  },
  {
    id: 'sec-testimonials',
    type: 'testimonials',
    title: 'Loved By Over 12,000 Aquarists Across India',
    subtitle: 'See what our verified buyers say about our packing and fish vitality',
    is_active: true,
    display_order: 8,
    config: {}
  },
  {
    id: 'sec-newsletter',
    type: 'newsletter',
    title: 'Join The VIP Betta Club',
    subtitle: 'Be the first to know when rare wild hybrids and master show bettas are listed.',
    is_active: true,
    display_order: 9,
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
      
      <h3>How Our Live Arrival Guarantee Works:</h3>
      <ul>
        <li>In the unlikely event of Dead-on-Arrival (DOA), notify our team within <strong>2 hours of package delivery</strong>.</li>
        <li>Provide an uncut 30-second unboxing video showing the sealed shipping bag with fish inside.</li>
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
    meta_description: 'Learn about India\'s premier specialized betta breeding sanctuary and ornamental fish boutique.',
    is_published: true,
    updated_at: '2026-03-20T10:00:00Z',
    content_html: `
      <h2>Ethical Aquaculture & Passion for Living Jewels</h2>
      <p>Founded in 2021 by competitive aquascapers and biological researchers, <strong>Betta Aquatics</strong> was born out of a single mission: to revolutionize how ornamental fish are bred, conditioned, and transported in India.</p>
      <p>Unlike commercial high-density wholesale farms, our indoor biosecure facility maintains individual high-filtration barracks for every show Betta. Each fish receives balanced live and specialized feeds, pristine water conditions, and daily flare training to develop full 180-degree finnage.</p>
      <h3>Our Standards:</h3>
      <ul>
        <li><strong>True-to-Specimen Transparency:</strong> For unique specimens, the fish you view in our photos and high-resolution videos is the exact fish you receive.</li>
        <li><strong>Medical Grade Packing:</strong> Medical oxygenated bags with stress-coat conditioners and temperature-controlled insulated shipping boxes.</li>
        <li><strong>Post-Purchase Mentorship:</strong> Direct WhatsApp support with aquarium specialists for water parameters and health checks.</li>
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
      <p>We only use Express Overnight Air Cargo (Bluedart/DTDC Priority) for live fish. Most metro locations arrive within 24 to 36 hours from dispatch.</p>

      <h4>Why do you use Manual UPI and Bank Transfer verification?</h4>
      <p>Because live fish require individual health inspection before order approval, manual verification prevents accidental automated double-booking of single unique specimens and eliminates high gateway surcharge costs, allowing us to pass savings onto customers.</p>

      <h4>What payment methods are supported?</h4>
      <p>We support all UPI Apps (Google Pay, PhonePe, Paytm, BHIM) and Direct Bank Transfer (IMPS/NEFT). You can simply scan the custom QR code at checkout and submit your 12-digit UTR reference ID.</p>

      <h4>Can two male Bettas be housed together?</h4>
      <p>No. Male Betta splendens are territorial and must always be housed in separate individual aquariums (minimum recommended size: 3 to 5 gallons with gentle filtration and natural live plants).</p>
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
  }
];

import { 
  Product, Category, Order, StoreSettings, HomepageSection, 
  CMSPage, ProductReview, Coupon, AdminAuditLog, PaymentStatus, FulfillmentStatus, Address 
} from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_STORE_SETTINGS, 
  INITIAL_HOMEPAGE_SECTIONS, INITIAL_CMS_PAGES, INITIAL_COUPONS 
} from './constants';

const STORAGE_KEYS = {
  PRODUCTS: 'ba_products',
  CATEGORIES: 'ba_categories',
  ORDERS: 'ba_orders',
  STORE_SETTINGS: 'ba_store_settings',
  HOMEPAGE_SECTIONS: 'ba_homepage_sections',
  CMS_PAGES: 'ba_cms_pages',
  REVIEWS: 'ba_reviews',
  COUPONS: 'ba_coupons',
  AUDIT_LOGS: 'ba_audit_logs',
};

// Helper to safely read from localStorage
function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

// Helper to safely write to localStorage
function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Initial sample orders for demonstration
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'BA-2026-8812',
    user_id: 'usr-customer-demo',
    customer_name: 'Rahul Sharma',
    customer_email: 'customer@bettaaquatics.in',
    customer_phone: '+91 98450 12345',
    shipping_address: {
      id: 'addr-01',
      user_id: 'usr-customer-demo',
      full_name: 'Rahul Sharma',
      phone: '+91 98450 12345',
      street_address: '402, Aqua Green Apartments, 12th Main Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postal_code: '560038',
      is_default: true,
    },
    items: [
      {
        id: 'item-01',
        product_id: 'prod-001',
        product_name: 'Royal Blue Halfmoon Betta (Show Class Male)',
        product_sku: 'BA-HM-001',
        product_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        unit_price: 1499,
        quantity: 1,
        total_price: 1499,
      }
    ],
    subtotal: 1499,
    delivery_fee: 199,
    packing_charge: 149,
    discount_amount: 150,
    coupon_code: 'AQUA10',
    total_amount: 1697,
    payment_status: 'verified',
    fulfillment_status: 'shipped',
    payment_details: {
      method: 'upi',
      upi_reference: '407519823412',
      proof_image_url: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=400&q=80',
      submitted_at: '2026-03-22T10:15:00Z',
      verified_at: '2026-03-22T11:00:00Z',
      verified_by: 'Admin Office',
    },
    shipment_details: {
      courier_name: 'Bluedart Air Express (Apex Live)',
      tracking_number: 'BLUEDART-882947192',
      tracking_url: 'https://www.bluedart.com/tracking?trackNumber=BLUEDART-882947192',
      shipped_at: '2026-03-22T14:30:00Z',
      estimated_delivery: '2026-03-24',
      notes: 'Live fish in oxygen-pressurized insulated thermocol crate. Handle with extreme care.',
    },
    created_at: '2026-03-22T09:45:00Z',
    updated_at: '2026-03-22T14:30:00Z',
  }
];

export const mockDb = {
  // PRODUCTS
  getProducts: (): Product[] => {
    return getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  getProductBySlug: (slug: string): Product | undefined => {
    const products = mockDb.getProducts();
    return products.find(p => p.slug === slug);
  },

  getProductById: (id: string): Product | undefined => {
    const products = mockDb.getProducts();
    return products.find(p => p.id === id);
  },

  saveProduct: (product: Partial<Product> & { name: string; price: number }): Product => {
    const products = mockDb.getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);

    if (existingIndex >= 0) {
      const updated: Product = {
        ...products[existingIndex],
        ...product,
      };
      products[existingIndex] = updated;
      setStoredItem(STORAGE_KEYS.PRODUCTS, products);
      mockDb.addAuditLog('Updated product: ' + updated.name, 'product', updated.id);
      return updated;
    } else {
      const newProduct: Product = {
        id: product.id || 'prod-' + Date.now(),
        name: product.name,
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        sku: product.sku || 'BA-' + Math.floor(1000 + Math.random() * 9000),
        description: product.description || '',
        short_description: product.short_description || '',
        price: Number(product.price),
        compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : undefined,
        category_id: product.category_id || 'cat-betta',
        category_name: product.category_name,
        stock_quantity: Number(product.stock_quantity ?? 1),
        is_unique_specimen: Boolean(product.is_unique_specimen),
        is_featured: Boolean(product.is_featured),
        is_active: product.is_active !== undefined ? product.is_active : true,
        strain: product.strain || 'Halfmoon',
        gender: product.gender || 'Male',
        size: product.size || '3.5 - 4.5 cm',
        water_type: product.water_type || 'Freshwater (Tropical)',
        temperature_range: product.temperature_range || '24°C - 28°C',
        ph_range: product.ph_range || '6.5 - 7.5',
        care_level: product.care_level || 'Moderate',
        diet: product.diet || 'High-protein pellets & frozen worms',
        shipping_restriction: product.shipping_restriction,
        images: product.images && product.images.length > 0 
          ? product.images 
          : ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'],
        rating: 5.0,
        review_count: 0,
        tags: product.tags || [],
        created_at: new Date().toISOString(),
      };
      products.unshift(newProduct);
      setStoredItem(STORAGE_KEYS.PRODUCTS, products);
      mockDb.addAuditLog('Created product: ' + newProduct.name, 'product', newProduct.id);
      return newProduct;
    }
  },

  deleteProduct: (id: string): void => {
    const products = mockDb.getProducts();
    const filtered = products.filter(p => p.id !== id);
    setStoredItem(STORAGE_KEYS.PRODUCTS, filtered);
    mockDb.addAuditLog('Deleted product ID: ' + id, 'product', id);
  },

  // CATEGORIES
  getCategories: (): Category[] => {
    return getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  saveCategory: (category: Partial<Category> & { name: string }): Category => {
    const categories = mockDb.getCategories();
    const existingIndex = categories.findIndex(c => c.id === category.id);
    if (existingIndex >= 0) {
      const updated: Category = { ...categories[existingIndex], ...category };
      categories[existingIndex] = updated;
      setStoredItem(STORAGE_KEYS.CATEGORIES, categories);
      return updated;
    } else {
      const newCat: Category = {
        id: category.id || 'cat-' + Date.now(),
        name: category.name,
        slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: category.description || '',
        image_url: category.image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
        display_order: category.display_order || categories.length + 1,
        is_active: true,
      };
      categories.push(newCat);
      setStoredItem(STORAGE_KEYS.CATEGORIES, categories);
      return newCat;
    }
  },

  // ORDERS
  getOrders: (): Order[] => {
    return getStoredItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  getOrderById: (id: string): Order | undefined => {
    const orders = mockDb.getOrders();
    return orders.find(o => o.id === id || o.order_number === id);
  },

  getOrdersByUserId: (userId: string): Order[] => {
    const orders = mockDb.getOrders();
    return orders.filter(o => o.user_id === userId);
  },

  createOrder: (orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Order => {
    const orders = mockDb.getOrders();
    const newOrderNumber = 'BA-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      order_number: newOrderNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Decrement stock for ordered items
    const products = mockDb.getProducts();
    newOrder.items.forEach(item => {
      const pIndex = products.findIndex(p => p.id === item.product_id);
      if (pIndex >= 0) {
        products[pIndex].stock_quantity = Math.max(0, products[pIndex].stock_quantity - item.quantity);
      }
    });
    setStoredItem(STORAGE_KEYS.PRODUCTS, products);

    orders.unshift(newOrder);
    setStoredItem(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  updateOrderPayment: (
    orderId: string, 
    paymentStatus: PaymentStatus, 
    details?: {
      rejection_reason?: string;
      verified_by?: string;
      upi_reference?: string;
      proof_image_url?: string;
    }
  ): Order | undefined => {
    const orders = mockDb.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return undefined;

    const order = orders[index];
    order.payment_status = paymentStatus;
    order.updated_at = new Date().toISOString();

    if (!order.payment_details) {
      order.payment_details = {
        method: 'upi',
        submitted_at: new Date().toISOString(),
      };
    }

    if (details?.upi_reference) {
      order.payment_details.upi_reference = details.upi_reference;
    }
    if (details?.proof_image_url) {
      order.payment_details.proof_image_url = details.proof_image_url;
    }
    if (paymentStatus === 'verified') {
      order.payment_details.verified_at = new Date().toISOString();
      order.payment_details.verified_by = details?.verified_by || 'Admin Verifier';
      if (order.fulfillment_status === 'unfulfilled') {
        order.fulfillment_status = 'processing';
      }
    } else if (paymentStatus === 'rejected') {
      order.payment_details.rejection_reason = details?.rejection_reason || 'Invalid transaction reference or uncredited payment proof.';
    }

    orders[index] = order;
    setStoredItem(STORAGE_KEYS.ORDERS, orders);
    mockDb.addAuditLog(`Order ${order.order_number} payment ${paymentStatus}`, 'order', order.id);
    return order;
  },

  updateOrderShipment: (
    orderId: string, 
    courierName: string, 
    trackingNumber: string, 
    trackingUrl: string, 
    notes?: string,
    estimatedDelivery?: string
  ): Order | undefined => {
    const orders = mockDb.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return undefined;

    const order = orders[index];
    order.fulfillment_status = 'shipped';
    order.updated_at = new Date().toISOString();
    order.shipment_details = {
      courier_name: courierName,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
      shipped_at: new Date().toISOString(),
      notes: notes || '',
      estimated_delivery: estimatedDelivery,
    };

    orders[index] = order;
    setStoredItem(STORAGE_KEYS.ORDERS, orders);
    mockDb.addAuditLog(`Order ${order.order_number} dispatched via ${courierName} (${trackingNumber})`, 'shipment', order.id);
    return order;
  },

  updateFulfillmentStatus: (orderId: string, status: FulfillmentStatus): Order | undefined => {
    const orders = mockDb.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return undefined;

    orders[index].fulfillment_status = status;
    orders[index].updated_at = new Date().toISOString();
    setStoredItem(STORAGE_KEYS.ORDERS, orders);
    mockDb.addAuditLog(`Order ${orders[index].order_number} status set to ${status}`, 'order', orders[index].id);
    return orders[index];
  },

  // STORE SETTINGS
  getStoreSettings: (): StoreSettings => {
    return getStoredItem<StoreSettings>(STORAGE_KEYS.STORE_SETTINGS, INITIAL_STORE_SETTINGS);
  },

  updateStoreSettings: (newSettings: Partial<StoreSettings>): StoreSettings => {
    const current = mockDb.getStoreSettings();
    const updated = { ...current, ...newSettings };
    setStoredItem(STORAGE_KEYS.STORE_SETTINGS, updated);
    mockDb.addAuditLog('Store settings updated', 'settings', 'global');
    return updated;
  },

  // HOMEPAGE CMS SECTIONS
  getHomepageSections: (): HomepageSection[] => {
    return getStoredItem<HomepageSection[]>(STORAGE_KEYS.HOMEPAGE_SECTIONS, INITIAL_HOMEPAGE_SECTIONS);
  },

  updateHomepageSections: (sections: HomepageSection[]): void => {
    setStoredItem(STORAGE_KEYS.HOMEPAGE_SECTIONS, sections);
    mockDb.addAuditLog('Homepage sections modified and saved', 'cms', 'homepage');
  },

  // CMS PAGES
  getCMSPages: (): CMSPage[] => {
    return getStoredItem<CMSPage[]>(STORAGE_KEYS.CMS_PAGES, INITIAL_CMS_PAGES);
  },

  getCMSPageBySlug: (slug: string): CMSPage | undefined => {
    const pages = mockDb.getCMSPages();
    return pages.find(p => p.slug === slug);
  },

  saveCMSPage: (page: CMSPage): void => {
    const pages = mockDb.getCMSPages();
    const index = pages.findIndex(p => p.id === page.id);
    page.updated_at = new Date().toISOString();

    if (index >= 0) {
      pages[index] = page;
    } else {
      pages.push(page);
    }
    setStoredItem(STORAGE_KEYS.CMS_PAGES, pages);
    mockDb.addAuditLog(`Saved CMS page: ${page.title}`, 'cms', page.id);
  },

  // REVIEWS
  getReviews: (productId?: string): ProductReview[] => {
    const all = getStoredItem<ProductReview[]>(STORAGE_KEYS.REVIEWS, [
      {
        id: 'rev-01',
        product_id: 'prod-001',
        user_name: 'Aditya Sen',
        rating: 5,
        title: 'Arrived in peak health & stunning finnage!',
        comment: 'Received the Royal Blue Halfmoon in Kolkata within 28 hours. The oxygen packing and heat pack kept the water at perfect 26°C. The fish started swimming actively right after acclimation!',
        is_verified: true,
        status: 'approved',
        created_at: '2026-03-10T12:00:00Z',
      },
      {
        id: 'rev-02',
        product_id: 'prod-002',
        user_name: 'Priya Nambiar',
        rating: 5,
        title: 'True Galaxy Koi colours! Exactly as shown in photos',
        comment: 'I was hesitant about ordering live fish online, but Betta Aquatics delivered the EXACT specimen from the listing. Will definitely purchase again.',
        is_verified: true,
        status: 'approved',
        created_at: '2026-03-14T15:30:00Z',
      }
    ]);
    if (productId) {
      return all.filter(r => r.product_id === productId && r.status === 'approved');
    }
    return all;
  },

  submitReview: (review: Omit<ProductReview, 'id' | 'created_at' | 'status'>): ProductReview => {
    const all = mockDb.getReviews();
    const newRev: ProductReview = {
      ...review,
      id: 'rev-' + Date.now(),
      created_at: new Date().toISOString(),
      status: 'approved', // Auto-approved or pending moderation
    };
    all.unshift(newRev);
    setStoredItem(STORAGE_KEYS.REVIEWS, all);
    return newRev;
  },

  // COUPONS
  getCoupons: (): Coupon[] => {
    return getStoredItem<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },

  validateCoupon: (code: string, subtotal: number): { valid: boolean; discount: number; message: string } => {
    const coupons = mockDb.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or expired coupon code' };
    }

    if (subtotal < coupon.min_order_amount) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Coupon requires minimum order value of ₹${coupon.min_order_amount}` 
      };
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = Math.round((subtotal * coupon.discount_value) / 100);
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }

    return { 
      valid: true, 
      discount, 
      message: `Coupon ${coupon.code} applied successfully! Saved ₹${discount}` 
    };
  },

  // PINCODE SERVICEABILITY
  checkPincodeServiceability: (pincode: string): { serviceable: boolean; estimatedDays: string; expressAir: boolean } => {
    const trimmed = pincode.trim();
    if (trimmed.length !== 6 || isNaN(Number(trimmed))) {
      return { serviceable: false, estimatedDays: '', expressAir: false };
    }
    const settings = mockDb.getStoreSettings();
    // In demo, check if it matches prefix or list, default to true for Indian 6-digit pins for pleasant UX
    const isSpecialExpress = settings.serviceable_pincodes.includes(trimmed);
    return {
      serviceable: true,
      estimatedDays: isSpecialExpress ? '24 - 36 Hours (Overnight Air)' : '48 Hours (Priority Express)',
      expressAir: true,
    };
  },

  // AUDIT LOGS
  getAuditLogs: (): AdminAuditLog[] => {
    return getStoredItem<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log-01',
        admin_id: 'admin-primary',
        admin_email: 'admin@bettaaquatics.in',
        action: 'System Initialized',
        entity_type: 'system',
        entity_id: 'init',
        details: 'Store database loaded with high-grade Betta specimen inventory.',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      }
    ]);
  },

  addAuditLog: (action: string, entityType: string, entityId: string, details?: string): void => {
    const logs = mockDb.getAuditLogs();
    const newLog: AdminAuditLog = {
      id: 'log-' + Date.now(),
      admin_id: 'admin-primary',
      admin_email: 'admin@bettaaquatics.in',
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details || action,
      created_at: new Date().toISOString(),
    };
    logs.unshift(newLog);
    setStoredItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100)); // Keep last 100 logs
  }
};

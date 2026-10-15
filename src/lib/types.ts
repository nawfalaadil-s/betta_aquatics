export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  street_address: string;
  landmark?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

export type CareLevel = 'Easy' | 'Moderate' | 'Advanced';
export type FishGender = 'Male' | 'Female' | 'Breeding Pair' | 'Unsexed';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  category_id: string;
  category_name?: string;
  stock_quantity: number;
  is_unique_specimen: boolean; // True for 1-of-a-kind exact betta fish
  is_featured: boolean;
  is_active: boolean;
  strain?: string; // e.g. "Halfmoon", "Crowntail", "Plakat", "Koi Galaxy"
  gender?: FishGender;
  size?: string;
  water_type?: string;
  temperature_range?: string;
  ph_range?: string;
  care_level?: CareLevel;
  diet?: string;
  shipping_restriction?: string;
  images: string[];
  rating: number;
  review_count: number;
  tags?: string[];
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected_variant?: string;
}

export type PaymentStatus = 'pending' | 'verified' | 'rejected';
export type FulfillmentStatus = 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface PaymentDetails {
  method: 'upi' | 'bank_transfer';
  upi_reference?: string;
  proof_image_url?: string;
  proof_filename?: string;
  submitted_at: string;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
}

export interface ShipmentDetails {
  courier_name: string;
  tracking_number: string;
  tracking_url: string;
  shipped_at: string;
  estimated_delivery?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  product_image: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Address;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  packing_charge: number;
  discount_amount: number;
  coupon_code?: string;
  total_amount: number;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  payment_details?: PaymentDetails;
  shipment_details?: ShipmentDetails;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  brand_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  upi_id: string;
  upi_payee_name: string;
  bank_name: string;
  bank_account_no: string;
  bank_ifsc: string;
  bank_account_holder: string;
  free_shipping_threshold: number;
  standard_shipping_rate: number;
  live_packing_charge: number;
  announcement_text: string;
  announcement_code?: string;
  announcement_active: boolean;
  announcement_link?: string;
  serviceable_pincodes: string[];
  maintenance_mode: boolean;
}

export type SectionType = 
  | 'hero' 
  | 'categories' 
  | 'flash_deal' 
  | 'specimen_showcase' 
  | 'curated_collection' 
  | 'breeder_story' 
  | 'care_guide' 
  | 'testimonials' 
  | 'trust_badges' 
  | 'newsletter';

export interface HomepageSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  is_active: boolean;
  display_order: number;
  config?: Record<string, any>;
}

export interface CMSPageRevision {
  id: string;
  page_id: string;
  title: string;
  content_html: string;
  created_at: string;
  created_by?: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  content_html: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  updated_at: string;
  revisions?: CMSPageRevision[];
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  is_verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount?: number;
  expires_at?: string;
  is_active: boolean;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}

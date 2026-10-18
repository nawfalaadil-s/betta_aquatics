// Centralized Road Courier Shipping & Delivery Engine
// Logistics Partner: The Professional Couriers (Road Courier / Surface Transport)
// Strictly domestic delivery within India

export const COURIER_NAME = 'The Professional Couriers (Road Courier)';

export const INDIAN_STATES = [
  'Kerala',
  'Tamil Nadu',
  'Karnataka',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
] as const;

export interface ShippingCalculation {
  baseRate: number;
  multiplier: number;
  finalFee: number;
  state: string;
  totalQuantity: number;
  isBulkOrder: boolean;
  courierName: string;
  rateDescription: string;
  tierName: 'Kerala' | 'Tamil Nadu / Karnataka' | 'All Other States';
}

/**
 * Calculates road courier delivery charges across India based on state and pair/fish count:
 * - Kerala = ₹80
 * - Tamil Nadu, Karnataka = ₹120
 * - All other states = ₹200
 * - If order has more than 10 pairs (total quantity > 10), cost doubles to 2X
 */
export function calculateShipping(state: string | undefined, totalQuantity: number = 0): ShippingCalculation {
  const s = (state || '').toLowerCase().trim();

  let baseRate = 200;
  let tierName: 'Kerala' | 'Tamil Nadu / Karnataka' | 'All Other States' = 'All Other States';
  let rateDescription = 'All Other Indian States: ₹200';

  if (s.includes('kerala')) {
    baseRate = 80;
    tierName = 'Kerala';
    rateDescription = 'Kerala: ₹80';
  } else if (
    s.includes('tamil nadu') || 
    s.includes('tamilnadu') || 
    s.includes('karnataka')
  ) {
    baseRate = 120;
    tierName = 'Tamil Nadu / Karnataka';
    rateDescription = s.includes('tamil') ? 'Tamil Nadu: ₹120' : 'Karnataka: ₹120';
  } else if (!state || !state.trim()) {
    // Default fallback to Kerala when state is not yet specified
    baseRate = 80;
    tierName = 'Kerala';
    rateDescription = 'Kerala (Default Rate): ₹80';
  }

  // If order is more than 10 pairs (> 10 items), cost increases 2X for reinforced live packing
  const isBulkOrder = totalQuantity > 10;
  const multiplier = isBulkOrder ? 2 : 1;
  const finalFee = baseRate * multiplier;

  const desc = isBulkOrder
    ? `${rateDescription} • 2X Bulk Packaging applied (>10 pairs: ₹${finalFee})`
    : rateDescription;

  return {
    baseRate,
    multiplier,
    finalFee,
    state: state || 'Kerala',
    totalQuantity,
    isBulkOrder,
    courierName: COURIER_NAME,
    rateDescription: desc,
    tierName,
  };
}

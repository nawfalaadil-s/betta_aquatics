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
  isCalculated: boolean;
  baseRate: number;
  multiplier: number;
  finalFee: number;
  state: string;
  pincode?: string;
  district?: string;
  region?: string;
  estimatedDays?: string;
  totalQuantity: number;
  isBulkOrder: boolean;
  courierName: string;
  rateDescription: string;
  tierName?: 'Kerala' | 'Tamil Nadu / Karnataka' | 'All Other States';
  errorMessage?: string;
}

/**
 * Resolves Indian state, region, and estimated transit days from a 6-digit postal PIN code
 * Based on official Department of Posts PIN code zoning:
 */
export function getStateFromPincode(pincode: string): { 
  state: string; 
  region: string; 
  isValid: boolean; 
  estimatedDays: string;
} | null {
  const clean = pincode.replace(/\D/g, '').trim();
  if (clean.length !== 6 || clean.startsWith('0')) return null;

  const prefix2 = clean.substring(0, 2);
  const prefix3 = clean.substring(0, 3);

  // Kerala & Lakshadweep (Zone 6)
  if (prefix2 === '67' || prefix2 === '68' || prefix2 === '69') {
    if (prefix3 === '682' && (clean.startsWith('682555') || clean.startsWith('682551') || clean.startsWith('682552') || clean.startsWith('682553') || clean.startsWith('682554') || clean.startsWith('682556') || clean.startsWith('682557') || clean.startsWith('682558') || clean.startsWith('682559'))) {
      return { state: 'Lakshadweep', region: 'Lakshadweep Islands', isValid: true, estimatedDays: '3 - 5 Days' };
    }
    return { 
      state: 'Kerala', 
      region: prefix2 === '67' ? 'Northern Kerala (Malabar / Calicut)' : prefix2 === '68' ? 'Central Kerala (Cochin / Kottayam)' : 'Southern Kerala (Trivandrum / Kollam)',
      isValid: true, 
      estimatedDays: '1 - 2 Days (The Professional Couriers Priority Surface)' 
    };
  }

  // Tamil Nadu & Puducherry (Zone 6)
  if (prefix2 === '60' || prefix2 === '61' || prefix2 === '62' || prefix2 === '63' || prefix2 === '64') {
    if (prefix3 === '605') {
      return { state: 'Puducherry', region: 'Puducherry / Karaikal', isValid: true, estimatedDays: '2 - 3 Days' };
    }
    return { 
      state: 'Tamil Nadu', 
      region: prefix2 === '60' ? 'Chennai & Northern TN' : prefix2 === '64' ? 'Coimbatore & Western TN' : prefix2 === '62' ? 'Madurai & Southern TN' : 'Central Tamil Nadu',
      isValid: true, 
      estimatedDays: '2 - 3 Days (The Professional Couriers Express Road)' 
    };
  }

  // Karnataka (Zone 5)
  if (prefix2 === '56' || prefix2 === '57' || prefix2 === '58' || prefix2 === '59') {
    return { 
      state: 'Karnataka', 
      region: prefix2 === '56' ? 'Bengaluru Urban & Rural' : prefix2 === '57' ? 'Mysuru & Coastal Karnataka' : 'Northern Karnataka (Hubballi / Belagavi)',
      isValid: true, 
      estimatedDays: '2 - 3 Days (The Professional Couriers Express Road)' 
    };
  }

  // Andhra Pradesh & Telangana (Zone 5)
  if (prefix2 === '50') {
    return { state: 'Telangana', region: 'Hyderabad & Telangana', isValid: true, estimatedDays: '3 - 4 Days' };
  }
  if (prefix2 === '51' || prefix2 === '52' || prefix2 === '53') {
    return { state: 'Andhra Pradesh', region: 'Andhra Pradesh Coastal / Rayalaseema', isValid: true, estimatedDays: '3 - 4 Days' };
  }

  // Maharashtra & Goa (Zone 4)
  if (prefix3 === '403') {
    return { state: 'Goa', region: 'Goa (Panaji / Margao)', isValid: true, estimatedDays: '3 - 4 Days' };
  }
  if (prefix2 === '40' || prefix2 === '41' || prefix2 === '42' || prefix2 === '43' || prefix2 === '44') {
    return { state: 'Maharashtra', region: prefix2 === '40' ? 'Mumbai & Konkan' : prefix2 === '41' ? 'Pune & Western Maharashtra' : 'Vidarbha / Marathwada', isValid: true, estimatedDays: '3 - 5 Days' };
  }

  // Gujarat & UTs (Zone 3)
  if (prefix2 === '36' || prefix2 === '37' || prefix2 === '38' || prefix2 === '39') {
    if (prefix3 === '396') {
      return { state: 'Dadra and Nagar Haveli and Daman and Diu', region: 'Daman / Diu / Silvassa', isValid: true, estimatedDays: '3 - 5 Days' };
    }
    return { state: 'Gujarat', region: prefix2 === '38' ? 'Ahmedabad / Gandhinagar' : prefix2 === '39' ? 'Surat / South Gujarat' : 'Saurashtra / Kutch', isValid: true, estimatedDays: '3 - 5 Days' };
  }

  // Rajasthan (Zone 3)
  if (prefix2 === '30' || prefix2 === '31' || prefix2 === '32' || prefix2 === '33' || prefix2 === '34') {
    return { state: 'Rajasthan', region: prefix2 === '30' ? 'Jaipur Region' : 'Western / Southern Rajasthan', isValid: true, estimatedDays: '3 - 5 Days' };
  }

  // Madhya Pradesh & Chhattisgarh (Zone 4)
  if (prefix2 === '45' || prefix2 === '46' || prefix2 === '47' || prefix2 === '48') {
    return { state: 'Madhya Pradesh', region: prefix2 === '45' ? 'Indore Region' : prefix2 === '46' ? 'Bhopal Region' : 'Gwalior / Jabalpur', isValid: true, estimatedDays: '4 - 5 Days' };
  }
  if (prefix2 === '49') {
    return { state: 'Chhattisgarh', region: 'Raipur & Chhattisgarh', isValid: true, estimatedDays: '4 - 5 Days' };
  }

  // Delhi & Northern Plains (Zone 1)
  if (prefix2 === '11') {
    return { state: 'Delhi', region: 'National Capital Territory of Delhi', isValid: true, estimatedDays: '3 - 4 Days' };
  }
  if (prefix2 === '12' || prefix2 === '13') {
    return { state: 'Haryana', region: prefix2 === '12' ? 'Gurugram / Faridabad' : 'Northern Haryana', isValid: true, estimatedDays: '3 - 5 Days' };
  }
  if (prefix2 === '14' || prefix2 === '15') {
    return { state: 'Punjab', region: 'Punjab (Amritsar / Ludhiana)', isValid: true, estimatedDays: '4 - 5 Days' };
  }
  if (prefix2 === '16') {
    return { state: 'Chandigarh', region: 'Chandigarh Tricity', isValid: true, estimatedDays: '3 - 5 Days' };
  }
  if (prefix2 === '17') {
    return { state: 'Himachal Pradesh', region: 'Himachal Pradesh', isValid: true, estimatedDays: '4 - 6 Days' };
  }
  if (prefix2 === '18' || prefix2 === '19') {
    return { state: 'Jammu and Kashmir', region: prefix2 === '19' ? 'Kashmir & Ladakh' : 'Jammu Region', isValid: true, estimatedDays: '4 - 6 Days' };
  }

  // Uttar Pradesh & Uttarakhand (Zone 2)
  if (prefix3 === '248' || prefix3 === '249' || prefix3 === '263' || prefix3 === '262' || prefix3 === '246' || prefix3 === '247') {
    return { state: 'Uttarakhand', region: 'Dehradun / Haridwar / Kumaon', isValid: true, estimatedDays: '4 - 5 Days' };
  }
  if (prefix2 === '20' || prefix2 === '21' || prefix2 === '22' || prefix2 === '23' || prefix2 === '24' || prefix2 === '25' || prefix2 === '26' || prefix2 === '27' || prefix2 === '28') {
    return { state: 'Uttar Pradesh', region: prefix2 === '20' ? 'Noida / Ghaziabad' : prefix2 === '22' ? 'Lucknow / Central UP' : 'Uttar Pradesh', isValid: true, estimatedDays: '4 - 5 Days' };
  }

  // West Bengal, Odisha & Andaman (Zone 7)
  if (prefix3 === '744') {
    return { state: 'Andaman and Nicobar Islands', region: 'Port Blair & Islands', isValid: true, estimatedDays: '5 - 7 Days' };
  }
  if (prefix2 === '70' || prefix2 === '71' || prefix2 === '72' || prefix2 === '73' || prefix2 === '74') {
    return { state: 'West Bengal', region: prefix2 === '70' ? 'Kolkata Metropolitan' : 'West Bengal', isValid: true, estimatedDays: '4 - 5 Days' };
  }
  if (prefix2 === '75' || prefix2 === '76' || prefix2 === '77') {
    return { state: 'Odisha', region: 'Bhubaneswar & Odisha', isValid: true, estimatedDays: '4 - 5 Days' };
  }

  // Assam & North East (Zone 7)
  if (prefix2 === '78') {
    return { state: 'Assam', region: 'Guwahati & Assam Valley', isValid: true, estimatedDays: '4 - 6 Days' };
  }
  if (prefix2 === '79') {
    if (prefix3 === '790' || prefix3 === '791' || prefix3 === '792') return { state: 'Arunachal Pradesh', region: 'Arunachal Pradesh', isValid: true, estimatedDays: '5 - 7 Days' };
    if (prefix3 === '793' || prefix3 === '794') return { state: 'Meghalaya', region: 'Shillong & Meghalaya', isValid: true, estimatedDays: '5 - 7 Days' };
    if (prefix3 === '795') return { state: 'Manipur', region: 'Imphal & Manipur', isValid: true, estimatedDays: '5 - 7 Days' };
    if (prefix3 === '796') return { state: 'Mizoram', region: 'Aizawl & Mizoram', isValid: true, estimatedDays: '5 - 7 Days' };
    if (prefix3 === '797') return { state: 'Nagaland', region: 'Kohima & Dimapur', isValid: true, estimatedDays: '5 - 7 Days' };
    if (prefix3 === '799') return { state: 'Tripura', region: 'Agartala & Tripura', isValid: true, estimatedDays: '5 - 7 Days' };
    return { state: 'Sikkim', region: 'Sikkim / Gangtok', isValid: true, estimatedDays: '5 - 7 Days' };
  }

  // Bihar & Jharkhand (Zone 8)
  if (prefix2 === '81' || prefix2 === '82' || prefix2 === '83') {
    return { state: 'Jharkhand', region: 'Ranchi / Jamshedpur', isValid: true, estimatedDays: '4 - 5 Days' };
  }
  if (prefix2 === '80' || prefix2 === '84' || prefix2 === '85') {
    return { state: 'Bihar', region: 'Patna & Bihar', isValid: true, estimatedDays: '4 - 5 Days' };
  }

  // Any other prefix is unassigned/non-civilian in India
  return null;
}

/**
 * Asynchronously enriches PIN code details with exact city and district from India Post API
 */
export async function lookupPincode(pincode: string): Promise<{
  state: string;
  district?: string;
  city?: string;
  region: string;
  estimatedDays: string;
  isValid: boolean;
} | null> {
  const clean = pincode.replace(/\D/g, '').trim();
  if (clean.length !== 6 || clean.startsWith('0')) {
    return null;
  }

  const fallback = getStateFromPincode(clean);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`, {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const stateName = po.State || fallback?.state || 'Other State';
        return {
          state: stateName,
          district: po.District,
          city: po.Name || po.Block || po.District,
          region: `${po.District || ''}, ${stateName}`.trim(),
          estimatedDays: fallback?.estimatedDays || '3 - 5 Days',
          isValid: true,
        };
      }
    }
  } catch {
    // Graceful offline fallback
  }

  if (fallback) {
    return {
      state: fallback.state,
      region: fallback.region,
      estimatedDays: fallback.estimatedDays,
      isValid: true,
    };
  }

  return null;
}

/**
 * Calculates road courier delivery charges across India based on state/PIN code and pair/fish count:
 * - Kerala = ₹80
 * - Tamil Nadu, Karnataka = ₹120
 * - All other states = ₹200
 * - If order has more than 10 pairs (total quantity > 10), cost doubles to 2X
 */
export function calculateShipping(
  stateOrPincode: string | undefined | null, 
  totalQuantity: number = 0
): ShippingCalculation {
  const isBulkOrder = totalQuantity > 10;
  const multiplier = isBulkOrder ? 2 : 1;

  if (!stateOrPincode || !stateOrPincode.trim()) {
    return {
      isCalculated: false,
      baseRate: 0,
      multiplier,
      finalFee: 0,
      state: '',
      totalQuantity,
      isBulkOrder,
      courierName: COURIER_NAME,
      rateDescription: 'Enter your delivery address at checkout to calculate shipping.',
    };
  }

  let resolvedState = stateOrPincode.trim();
  let pincode: string | undefined = undefined;
  let region: string | undefined = undefined;
  let estimatedDays: string | undefined = undefined;

  // Check if an Indian PIN code was provided
  const digitsOnly = resolvedState.replace(/\D/g, '');
  if (digitsOnly.length === 6) {
    pincode = digitsOnly;
    const pinInfo = getStateFromPincode(digitsOnly);
    if (pinInfo) {
      resolvedState = pinInfo.state;
      region = pinInfo.region;
      estimatedDays = pinInfo.estimatedDays;
    } else {
      return {
        isCalculated: false,
        baseRate: 0,
        multiplier,
        finalFee: 0,
        state: '',
        pincode: digitsOnly,
        totalQuantity,
        isBulkOrder,
        courierName: COURIER_NAME,
        rateDescription: 'Unrecognized PIN code. Please verify your 6-digit postal code.',
        errorMessage: 'Invalid Indian PIN code. Please verify the 6-digit PIN code.',
      };
    }
  }

  const s = resolvedState.toLowerCase().trim();

  let baseRate = 200;
  let tierName: 'Kerala' | 'Tamil Nadu / Karnataka' | 'All Other States' = 'All Other States';
  let rateDescription = 'All Other Indian States: ₹200';

  if (s.includes('kerala')) {
    baseRate = 80;
    tierName = 'Kerala';
    rateDescription = 'Kerala: ₹80';
    if (!estimatedDays) estimatedDays = '1 - 2 Days';
  } else if (
    s.includes('tamil nadu') || 
    s.includes('tamilnadu') || 
    s.includes('puducherry') ||
    s.includes('karnataka')
  ) {
    baseRate = 120;
    tierName = 'Tamil Nadu / Karnataka';
    rateDescription = s.includes('tamil') || s.includes('puducherry') ? 'Tamil Nadu: ₹120' : 'Karnataka: ₹120';
    if (!estimatedDays) estimatedDays = '2 - 3 Days';
  } else {
    // Check if valid Indian state
    const isRecognizedState = INDIAN_STATES.some(st => 
      st.toLowerCase() === s || s.includes(st.toLowerCase())
    ) || s.includes('state') || s.includes('india');

    if (!isRecognizedState && !pincode) {
      return {
        isCalculated: false,
        baseRate: 0,
        multiplier,
        finalFee: 0,
        state: resolvedState,
        totalQuantity,
        isBulkOrder,
        courierName: COURIER_NAME,
        rateDescription: 'Please select a valid Indian delivery state.',
        errorMessage: 'Unrecognized delivery state. Please select a valid state from the list.',
      };
    }

    baseRate = 200;
    tierName = 'All Other States';
    rateDescription = `${resolvedState}: ₹200`;
    if (!estimatedDays) estimatedDays = '3 - 5 Days';
  }

  const finalFee = baseRate * multiplier;
  const desc = isBulkOrder
    ? `${rateDescription} • 2X Bulk Packaging applied (>10 pairs: ₹${finalFee})`
    : rateDescription;

  return {
    isCalculated: true,
    baseRate,
    multiplier,
    finalFee,
    state: resolvedState,
    pincode,
    region,
    estimatedDays,
    totalQuantity,
    isBulkOrder,
    courierName: COURIER_NAME,
    rateDescription: desc,
    tierName,
  };
}

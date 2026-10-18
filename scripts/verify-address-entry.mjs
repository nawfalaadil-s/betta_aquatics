import fs from 'fs';
import path from 'path';

console.log('======================================================');
console.log('BETTA AQUATICS — ADDRESS ENTRY & DEFAULT CHECK VERIFICATION');
console.log('======================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// 1. Check AuthContext.tsx
const authContextPath = path.resolve('src/contexts/AuthContext.tsx');
const authContextSrc = fs.readFileSync(authContextPath, 'utf-8');

console.log('Group 1: AuthContext Address Storage & Defaults');
assert(
  authContextSrc.includes('const INITIAL_ADDRESSES: Address[] = [];'),
  'INITIAL_ADDRESSES is an empty array with no seeded mock addresses'
);
assert(
  authContextSrc.includes("a.id !== 'addr-01'") && authContextSrc.includes("a.id !== 'addr-02'"),
  'Saved address initialization actively filters out legacy demo addresses'
);
assert(
  authContextSrc.includes('is_default: false'),
  'addAddress strictly sets is_default: false and does not auto-promote first address'
);

// 2. Check CheckoutPage.tsx
const checkoutPath = path.resolve('src/pages/CheckoutPage.tsx');
const checkoutSrc = fs.readFileSync(checkoutPath, 'utf-8');

console.log('\nGroup 2: CheckoutPage Address Inputs & Validation');
assert(
  !checkoutSrc.includes("newAddrCity, setNewAddrCity] = useState('Bengaluru')"),
  'newAddrCity is not defaulted to Bengaluru'
);
assert(
  checkoutSrc.includes("newAddrCity, setNewAddrCity] = useState('')"),
  'newAddrCity starts empty for customer entry'
);
assert(
  !checkoutSrc.includes("newAddrState, setNewAddrState] = useState('Karnataka')"),
  'newAddrState is not defaulted to Karnataka'
);
assert(
  checkoutSrc.includes("newAddrState, setNewAddrState] = useState('')"),
  'newAddrState starts empty for customer entry'
);
assert(
  !checkoutSrc.includes("newAddrPostalCode, setNewAddrPostalCode] = useState('560038')"),
  'newAddrPostalCode is not defaulted to 560038'
);
assert(
  checkoutSrc.includes("newAddrPostalCode, setNewAddrPostalCode] = useState('')"),
  'newAddrPostalCode starts empty for customer entry'
);
assert(
  !checkoutSrc.includes('addresses.find(a => a.is_default)'),
  'CheckoutPage does not auto-select a default address on load'
);
assert(
  checkoutSrc.includes("is_default: false"),
  'CheckoutPage saves new addresses with is_default: false'
);
assert(
  checkoutSrc.includes('Please enter all delivery address fields'),
  'CheckoutPage validates all required delivery address fields'
);

// 3. Check AccountPage.tsx
const accountPath = path.resolve('src/pages/AccountPage.tsx');
const accountSrc = fs.readFileSync(accountPath, 'utf-8');

console.log('\nGroup 3: AccountPage Address Management');
assert(
  !accountSrc.includes("city, setCity] = useState('Bengaluru')"),
  'AccountPage city is not defaulted to Bengaluru'
);
assert(
  accountSrc.includes("city, setCity] = useState('')"),
  'AccountPage city starts empty'
);
assert(
  !accountSrc.includes("state, setState] = useState('Karnataka')"),
  'AccountPage state is not defaulted to Karnataka'
);
assert(
  accountSrc.includes("state, setState] = useState('')"),
  'AccountPage state starts empty'
);
assert(
  !accountSrc.includes("pincode, setPincode] = useState('560038')"),
  'AccountPage pincode is not defaulted to 560038'
);
assert(
  accountSrc.includes("pincode, setPincode] = useState('')"),
  'AccountPage pincode starts empty'
);
assert(
  !accountSrc.includes('Set as Default'),
  'AccountPage has removed "Set as Default" button'
);
assert(
  !accountSrc.includes("addr.is_default && ("),
  'AccountPage has removed the "Default" badge from address cards'
);

console.log(`\n======================================================`);
console.log(`SUMMARY: ${passed} passed out of ${passed + failed} tests (${failed} failed)`);
console.log(`======================================================`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL CUSTOMER ADDRESS VERIFICATION CHECKS PASSED!');
  process.exit(0);
}

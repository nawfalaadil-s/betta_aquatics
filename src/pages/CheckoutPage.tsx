import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, MapPin, QrCode, CreditCard, 
  Upload, CheckCircle2, AlertCircle, ArrowRight, 
  Copy, Sparkles, Building, Lock, Check 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useStoreSettings } from '../contexts/StoreSettingsContext';
import { useToast } from '../contexts/ToastContext';
import { mockDb } from '../lib/mockDatabase';
import { Address } from '../lib/types';
import { formatCurrency } from '../lib/utils';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, addresses, addAddress } = useAuth();
  const { items, subtotal, deliveryFee, packingCharge, discountAmount, appliedCoupon, total, clearCart } = useCart();
  const { settings } = useStoreSettings();
  const { showToast } = useToast();

  // Selected address state
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find(a => a.is_default)?.id || addresses[0]?.id || 'new'
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(addresses.length === 0);

  // New address form state
  const [newAddrFullName, setNewAddrFullName] = useState(user?.full_name || '');
  const [newAddrPhone, setNewAddrPhone] = useState(user?.phone || '');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Bengaluru');
  const [newAddrState, setNewAddrState] = useState('Karnataka');
  const [newAddrPostalCode, setNewAddrPostalCode] = useState('560038');

  // Payment method selection & submission
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank_transfer'>('upi');
  const [upiReference, setUpiReference] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);

  if (items.length === 0 && !placedOrderNumber) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Items in Cart</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-4">Please add live fish or aquarium products to proceed with checkout.</p>
        <Link to="/shop" className="px-5 py-2.5 bg-ocean-900 text-white rounded-xl text-xs font-bold">
          Browse Store
        </Link>
      </div>
    );
  }

  // Generate UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(settings.upi_id)}&pn=${encodeURIComponent(settings.upi_payee_name)}&am=${total}&cu=INR&tn=${encodeURIComponent('Betta Aquatics Order')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUri)}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(settings.upi_id);
    showToast(`UPI ID ${settings.upi_id} copied to clipboard!`, 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
        showToast('Payment screenshot attached successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    let shippingAddress: Address;
    if (isAddingNewAddress || selectedAddressId === 'new') {
      if (!newAddrFullName || !newAddrPhone || !newAddrStreet || !newAddrPostalCode) {
        showToast('Please complete all delivery address fields', 'error');
        return;
      }
      shippingAddress = addAddress({
        full_name: newAddrFullName,
        phone: newAddrPhone,
        street_address: newAddrStreet,
        landmark: newAddrLandmark,
        city: newAddrCity,
        state: newAddrState,
        postal_code: newAddrPostalCode,
        is_default: addresses.length === 0,
      });
    } else {
      const existing = addresses.find(a => a.id === selectedAddressId);
      if (!existing) {
        showToast('Please select a valid delivery address', 'error');
        return;
      }
      shippingAddress = existing;
    }

    if (!upiReference.trim()) {
      showToast('Please enter your 12-digit UTR or Transaction Reference number', 'error');
      return;
    }

    setIsPlacingOrder(true);

    setTimeout(() => {
      const newOrder = mockDb.createOrder({
        user_id: user?.id || 'usr-customer-demo',
        customer_name: shippingAddress.full_name,
        customer_email: user?.email || 'customer@bettaaquatics.in',
        customer_phone: shippingAddress.phone,
        shipping_address: shippingAddress,
        items: items.map(item => ({
          id: 'item-' + Math.random().toString(36).substring(2, 9),
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.sku,
          product_image: item.product.images[0],
          unit_price: item.product.price,
          quantity: item.quantity,
          total_price: item.product.price * item.quantity,
        })),
        subtotal,
        delivery_fee: deliveryFee,
        packing_charge: packingCharge,
        discount_amount: discountAmount,
        coupon_code: appliedCoupon?.code,
        total_amount: total,
        payment_status: 'pending',
        fulfillment_status: 'unfulfilled',
        payment_details: {
          method: paymentMethod,
          upi_reference: upiReference.trim(),
          proof_image_url: proofImage || undefined,
          submitted_at: new Date().toISOString(),
        },
      });

      // Celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.log(err);
      }

      setPlacedOrderNumber(newOrder.order_number);
      clearCart();
      setIsPlacingOrder(false);
      showToast('Order placed successfully! Awaiting admin payment verification.', 'success');
    }, 800);
  };

  // SUCCESS SCREEN
  if (placedOrderNumber) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-aqua-700 bg-aqua-50 px-3 py-1 rounded-full border border-aqua-200 inline-block mb-3">
              Order Placed Successfully
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 font-display mb-2">
              Thank You For Your Order!
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Order Number: <strong className="text-ocean-950 font-mono text-base">{placedOrderNumber}</strong>
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 mb-8">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-aqua-600 shrink-0" />
                <span>Next Step: Admin Payment Verification</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Your payment submission (UTR: <strong>{upiReference}</strong>) has been routed to our verification desk. Once credited, your order will transition to <strong>Processing</strong> and our specialist packers will prepare your insulated oxygen crate.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/account/orders"
                className="px-6 py-3 bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>View Order & Tracking Status</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/"
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-aqua-700">Safe & Insulated Checkout</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 font-display">
              Finalize Your Consignment
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Order Processing</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Steps Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Contact Info */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2 font-bold text-sm text-ocean-950">
                    <span className="w-6 h-6 rounded-full bg-ocean-950 text-aqua-300 text-xs flex items-center justify-center font-bold">1</span>
                    <span>Customer Details</span>
                  </div>
                  {user && (
                    <span className="text-xs text-slate-500 font-medium">{user.email}</span>
                  )}
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  Consignment tracking updates and live dispatch notices will be sent to <strong>{user?.email || 'your registered email'}</strong>.
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2 font-bold text-sm text-ocean-950">
                    <span className="w-6 h-6 rounded-full bg-ocean-950 text-aqua-300 text-xs flex items-center justify-center font-bold">2</span>
                    <span>Delivery Address</span>
                  </div>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                      className="text-xs text-aqua-700 hover:underline font-semibold"
                    >
                      {isAddingNewAddress ? 'Choose Saved Address' : '+ Add New Address'}
                    </button>
                  )}
                </div>

                {!isAddingNewAddress && addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-aqua-500 bg-aqua-50/30 ring-1 ring-aqua-500'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 accent-aqua-600"
                        />
                        <div className="text-xs flex-1">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{addr.full_name}</span>
                            <span className="text-slate-500 font-normal">({addr.phone})</span>
                            {addr.is_default && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-slate-600 mt-1 leading-relaxed">
                            {addr.street_address}, {addr.landmark && `${addr.landmark}, `}{addr.city}, {addr.state} - <strong>{addr.postal_code}</strong>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newAddrFullName}
                          onChange={(e) => setNewAddrFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Mobile Phone (For Courier) *</label>
                        <input
                          type="tel"
                          required
                          value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value)}
                          placeholder="+91 98450 12345"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Door / Flat / Street Address *</label>
                      <input
                        type="text"
                        required
                        value={newAddrStreet}
                        onChange={(e) => setNewAddrStreet(e.target.value)}
                        placeholder="House / Apartment / Street Name"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={newAddrState}
                          onChange={(e) => setNewAddrState(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">PIN Code *</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={newAddrPostalCode}
                          onChange={(e) => setNewAddrPostalCode(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Manual Payment Verification Instructions */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2 font-bold text-sm text-ocean-950">
                    <span className="w-6 h-6 rounded-full bg-ocean-950 text-aqua-300 text-xs flex items-center justify-center font-bold">3</span>
                    <span>Manual Payment Verification</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Zero Gateway Fees
                  </span>
                </div>

                {/* Method Tabs */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-aqua-500 bg-aqua-50/50 text-ocean-950 shadow-sm ring-1 ring-aqua-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-aqua-600" />
                    <span>Instant UPI / QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-aqua-500 bg-aqua-50/50 text-ocean-950 shadow-sm ring-1 ring-aqua-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4 text-aqua-600" />
                    <span>Direct Bank Transfer</span>
                  </button>
                </div>

                {/* Payment Details Container */}
                {paymentMethod === 'upi' ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Dynamic QR Code */}
                      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md text-center shrink-0">
                        <img
                          src={qrCodeUrl}
                          alt="UPI QR Code"
                          className="w-36 h-36 mx-auto rounded-lg"
                        />
                        <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                          Exact Amount: {formatCurrency(total)}
                        </span>
                      </div>

                      <div className="space-y-2 flex-1">
                        <div className="text-slate-800 font-bold text-sm">
                          Scan to Pay via any UPI App
                        </div>
                        <p className="text-slate-600 leading-relaxed text-xs">
                          Open Google Pay, PhonePe, Paytm, or BHIM. Scan the QR code or copy the UPI ID below to transfer <strong>{formatCurrency(total)}</strong>.
                        </p>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          <span className="text-slate-500">UPI ID:</span>
                          <span className="font-mono font-bold text-ocean-950">{settings.upi_id}</span>
                          <button
                            type="button"
                            onClick={handleCopyUPI}
                            className="ml-auto text-aqua-700 hover:text-aqua-800 p-1"
                            title="Copy UPI ID"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Payee: <strong>{settings.upi_payee_name}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 mb-6">
                    <div className="font-bold text-sm text-slate-900 mb-2">NEFT / IMPS Bank Transfer Details</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-slate-400">Bank Name:</span> <strong>{settings.bank_name}</strong></div>
                      <div><span className="text-slate-400">Account No:</span> <strong className="font-mono">{settings.bank_account_no}</strong></div>
                      <div><span className="text-slate-400">IFSC Code:</span> <strong className="font-mono">{settings.bank_ifsc}</strong></div>
                      <div><span className="text-slate-400">Beneficiary:</span> <strong>{settings.bank_account_holder}</strong></div>
                    </div>
                  </div>
                )}

                {/* Proof & Reference Inputs */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      12-Digit UTR / Transaction Reference ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={upiReference}
                      onChange={(e) => setUpiReference(e.target.value)}
                      placeholder="e.g. 407519823412 or IMPS Reference"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-none focus:border-aqua-500"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Located in your payment receipt from Google Pay, PhonePe, or Banking App.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Upload Payment Screenshot (Optional for faster verification)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-colors">
                        <Upload className="w-4 h-4 text-aqua-600" />
                        <span>Select Screenshot</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {proofImage && (
                        <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Proof Attached</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
                  Consignment Items ({items.length})
                </h2>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.product.id} className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-800 line-clamp-1">{item.product.name}</div>
                          <div className="text-[10px] text-slate-400">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                  </div>

                  {packingCharge > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Medical Oxygen Packing</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(packingCharge)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Express Air Delivery</span>
                    <span>
                      {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(deliveryFee)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="font-bold text-sm text-slate-900">Total Payable</span>
                    <span className="font-extrabold text-2xl text-ocean-950 font-display">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="w-full py-4 bg-gradient-to-r from-aqua-500 to-aqua-600 hover:from-aqua-400 hover:to-aqua-500 text-ocean-950 font-black text-sm rounded-xl transition-all shadow-glow-aqua active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                  {isPlacingOrder ? (
                    <span>Confirming Order...</span>
                  ) : (
                    <>
                      <span>Submit Payment & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed">
                  <strong>Notice:</strong> As an ornamental fish sanctuary, we verify transactions manually before capturing bank credit to protect against specimen race conditions.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, QrCode, 
  Upload, CheckCircle2, ArrowRight, 
  Copy, Building, Lock, Check, MessageSquare,
  Smartphone, ExternalLink, X, FileText, Printer
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useStoreSettings } from '../contexts/StoreSettingsContext';
import { useToast } from '../contexts/ToastContext';
import { mockDb } from '../lib/mockDatabase';
import { Address, Order } from '../lib/types';
import { formatCurrency } from '../lib/utils';
import { SEO } from '../components/common/SEO';
import { TaxInvoiceModal } from '../components/common/TaxInvoiceModal';

export const CheckoutPage: React.FC = () => {
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
  const [hasClickedPayNow, setHasClickedPayNow] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  if (items.length === 0 && !placedOrderNumber) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <SEO title="Checkout | Betta Aquatics" description="Complete your live fish order securely." />
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

  const handleOpenUPIApp = () => {
    setHasClickedPayNow(true);
    window.location.href = upiUri;
    showToast('Opening UPI app... Complete the transfer and return here to upload your screenshot!', 'info');
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

    if (paymentMethod === 'upi') {
      if (!upiReference.trim()) {
        showToast('Please enter your 12-digit UTR or Transaction Reference number', 'error');
        return;
      }

      if (!proofImage) {
        showToast('Please upload a screenshot of your completed UPI payment', 'error');
        return;
      }
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
      setPlacedOrder(newOrder);
      clearCart();
      setIsPlacingOrder(false);
      showToast('Order placed successfully! Awaiting admin payment verification.', 'success');
    }, 800);
  };

  // SUCCESS SCREEN
  if (placedOrderNumber) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
        <SEO title={`Order ${placedOrderNumber} Confirmed | Betta Aquatics`} description="Thank you for your order. Our team will verify your payment and prepare your insulated live fish consignment." />
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

            {/* Uploaded Screenshot & UTR Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-3 mb-8">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Next Step: Admin Payment Verification</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Your payment submission (UTR: <strong className="font-mono text-ocean-950">{upiReference}</strong>) has been routed to our verification desk. Once credited, our team will prepare your insulated live oxygen crate.
              </p>

              {proofImage && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 mt-2">
                  <img
                    src={proofImage}
                    alt="Payment Proof"
                    className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Payment Screenshot Attached</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                      Ref: {upiReference}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/account/orders"
                className="px-6 py-3 bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>View Order & Tracking</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {placedOrder && (
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(true)}
                  className="px-5 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-aqua-600" />
                  <span>View Tax Invoice</span>
                </button>
              )}

              <Link
                to="/"
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        </div>

        {/* Tax Invoice Modal */}
        <TaxInvoiceModal
          isOpen={isInvoiceOpen}
          order={placedOrder}
          onClose={() => setIsInvoiceOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <SEO 
        title="Secure Checkout & Payment | Betta Aquatics" 
        description="Finalize your Betta Aquatics live fish order. Safe insulated packaging, verified manual UPI payment, and live arrival guarantee." 
      />
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
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nearby Landmark (Optional)</label>
                      <input
                        type="text"
                        value={newAddrLandmark}
                        onChange={(e) => setNewAddrLandmark(e.target.value)}
                        placeholder="e.g. Near Metro Station / Behind Temple"
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
                  <div className="space-y-4 mb-6">
                    {/* Step A: Direct Pay with UPI App */}
                    <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-cyan-50/30 rounded-2xl border border-emerald-200 text-xs space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                          <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Step 1: Open UPI App & Pay</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto">
                          Exact Amount: {formatCurrency(total)}
                        </span>
                      </div>

                      <p className="text-slate-600 leading-relaxed text-xs">
                        Tap the button below to directly launch your UPI app (Google Pay, PhonePe, Paytm, or BHIM) with amount <strong>{formatCurrency(total)}</strong> and verified payee <strong>{settings.upi_payee_name}</strong> pre-filled.
                      </p>

                      {/* Primary Direct UPI Button */}
                      <div>
                        <button
                          type="button"
                          onClick={handleOpenUPIApp}
                          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                          <Smartphone className="w-5 h-5 text-emerald-200" />
                          <span>Pay Now via UPI App ({formatCurrency(total)})</span>
                          <ExternalLink className="w-4 h-4 text-emerald-200" />
                        </button>
                      </div>

                      {/* Direct App Launch Shortcuts */}
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px]">
                        <span className="text-slate-400 font-medium">Or choose specific app:</span>
                        <a
                          href={upiUri}
                          onClick={() => setHasClickedPayNow(true)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-200 shadow-xs transition-colors inline-flex items-center gap-1"
                        >
                          <span>Google Pay</span>
                        </a>
                        <a
                          href={upiUri}
                          onClick={() => setHasClickedPayNow(true)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-200 shadow-xs transition-colors inline-flex items-center gap-1"
                        >
                          <span>PhonePe</span>
                        </a>
                        <a
                          href={upiUri}
                          onClick={() => setHasClickedPayNow(true)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-200 shadow-xs transition-colors inline-flex items-center gap-1"
                        >
                          <span>Paytm / BHIM</span>
                        </a>
                      </div>

                      {/* UPI ID copy pill */}
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-200 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">UPI ID:</span>
                          <span className="font-mono font-bold text-ocean-950">{settings.upi_id}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUPI}
                          className="text-aqua-700 hover:text-aqua-800 font-bold inline-flex items-center gap-1 p-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>

                      {/* Desktop QR Code Toggle */}
                      <div className="pt-2 border-t border-emerald-200/60">
                        <button
                          type="button"
                          onClick={() => setShowQRCode(!showQRCode)}
                          className="text-[11px] text-emerald-800 font-semibold hover:underline flex items-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{showQRCode ? 'Hide Desktop QR Code' : 'Paying from PC / Another Phone? Show QR Code'}</span>
                        </button>

                        {showQRCode && (
                          <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-center w-fit mx-auto shadow-sm">
                            <img src={qrCodeUrl} alt="UPI QR Code" className="w-32 h-32 mx-auto rounded-lg" />
                            <span className="block text-[10px] text-slate-400 mt-1 font-mono">Scan with any UPI App</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step B: Mandatory Confirmation & Proof Submission */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                        <div className="flex items-center gap-2 font-bold text-sm text-ocean-950">
                          <span className="w-6 h-6 rounded-full bg-ocean-950 text-aqua-300 text-xs flex items-center justify-center font-bold">2</span>
                          <span>Submit UTR & Payment Screenshot</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          Mandatory
                        </span>
                      </div>

                      {hasClickedPayNow && (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>UPI app triggered! Complete your transfer, then upload your screenshot and enter the 12-digit UTR below.</span>
                        </div>
                      )}

                      {/* 12-Digit UTR */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          12-Digit Transaction Reference (UTR Number) *
                        </label>
                        <input
                          type="text"
                          required
                          value={upiReference}
                          onChange={(e) => setUpiReference(e.target.value)}
                          placeholder="e.g. 407519823412 (Found in receipt)"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-none focus:border-aqua-500"
                        />
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Found in your Google Pay, PhonePe, or Paytm receipt (labeled 'UPI transaction ID' or 'UTR').
                        </span>
                      </div>

                      {/* Upload Payment Screenshot (Mandatory) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Payment Screenshot Proof *
                        </label>

                        {proofImage ? (
                          <div className="p-3 bg-white rounded-2xl border border-emerald-200 space-y-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={proofImage}
                                alt="Uploaded Screenshot"
                                className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-sm shrink-0"
                              />
                              <div className="text-xs space-y-0.5 flex-1">
                                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Screenshot Attached</span>
                                </div>
                                <div className="text-[11px] text-slate-500">Ready for instant admin verification</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setProofImage(null)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Remove Screenshot"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-aqua-500 hover:bg-white rounded-2xl text-xs transition-all text-center">
                              <Upload className="w-6 h-6 text-aqua-600 mb-1.5" />
                              <span className="font-bold text-slate-700">Tap to Upload Payment Screenshot</span>
                              <span className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG or WebP from your device</span>
                              <input
                                type="file"
                                required
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              Please attach a clear screenshot showing the successful payment confirmation screen and transfer amount.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-4 mb-6">
                    <div className="font-bold text-sm text-slate-900 mb-1">NEFT / IMPS Bank Transfer Details</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-slate-400">Bank Name:</span> <strong>{settings.bank_name}</strong></div>
                      <div><span className="text-slate-400">Account No:</span> <strong className="font-mono">{settings.bank_account_no}</strong></div>
                      <div><span className="text-slate-400">IFSC Code:</span> <strong className="font-mono">{settings.bank_ifsc}</strong></div>
                      <div><span className="text-slate-400">Beneficiary:</span> <strong>{settings.bank_account_holder}</strong></div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          IMPS / NEFT Reference Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={upiReference}
                          onChange={(e) => setUpiReference(e.target.value)}
                          placeholder="e.g. 407519823412 or Bank Ref"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Bank Transfer Receipt Screenshot (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                      <span>Submit Payment Proof & Confirm Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400 font-medium">
                  {paymentMethod === 'upi'
                    ? 'Payment screenshot & 12-digit UTR required for live specimen order approval'
                    : 'Bank IMPS/NEFT reference required for order approval'}
                </p>

                <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Why Manual Verification?</span>
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    Every ornamental fish in your order is a living 1-of-1 specimen. Our head breeder personally inspects fin integrity and vigor before approving cargo transit.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-800">Need help with payment?</div>
                    <div className="text-[11px] text-slate-500">Chat directly with breeder Anand</div>
                  </div>
                  <a
                    href="https://wa.me/919845012345?text=Hi%20Anand,%20I%20am%20at%20checkout%20and%20need%20assistance%20with%20payment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, ShoppingBag, ArrowRight, ShieldCheck, 
  Sparkles, Tag, Check, AlertCircle, ArrowLeft 
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useStoreSettings } from '../contexts/StoreSettingsContext';
import { formatCurrency } from '../lib/utils';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    subtotal, 
    deliveryFee, 
    packingCharge, 
    discountAmount, 
    appliedCoupon, 
    total, 
    freeShippingRemaining, 
    freeShippingProgress, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    applyCoupon, 
    removeCoupon 
  } = useCart();

  const { settings } = useStoreSettings();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 font-display mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Explore our collection of show-class Bettas, imported guppies, and natural aquatic flora.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors shadow-md"
        >
          <span>Discover Living Specimens</span>
          <ArrowRight className="w-4 h-4 text-red-400" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Shopping Cart ({items.length} {items.length === 1 ? 'Item' : 'Items'})
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline font-semibold"
          >
            Clear Cart
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span>
              {freeShippingRemaining > 0 ? (
                <span className="text-slate-700">
                  Add <strong className="text-blue-900">{formatCurrency(freeShippingRemaining)}</strong> more for <strong>FREE Live Air Delivery</strong>!
                </span>
              ) : (
                <span className="text-blue-700 flex items-center gap-1 font-bold">
                  <Check className="w-4 h-4 text-blue-600" />
                  Congratulations! You unlocked FREE Delivery.
                </span>
              )}
            </span>
            <span className="text-slate-400">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            {items.map((item) => {
              const { product, quantity } = item;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div>
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-700 transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{product.category_name}</span>
                        {product.strain && (
                          <span className="text-blue-700 font-semibold">• {product.strain}</span>
                        )}
                      </div>

                      {product.is_unique_specimen && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full mt-1 border border-blue-200">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          <span>Exact Unique Specimen</span>
                        </div>
                      )}

                      <div className="text-xs font-bold text-slate-900 mt-1 sm:hidden">
                        {formatCurrency(product.price * quantity)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {!product.is_unique_specimen ? (
                      <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50 h-9">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold text-slate-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium italic">
                        Qty: 1 (Specimen)
                      </span>
                    )}

                    <div className="text-right hidden sm:block">
                      <div className="font-bold text-sm text-blue-950 font-display">
                        {formatCurrency(product.price * quantity)}
                      </div>
                      {quantity > 1 && (
                        <div className="text-[10px] text-slate-400">
                          {formatCurrency(product.price)} each
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Promo Code Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>Apply Promo Code</span>
              </div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-2.5 rounded-xl">
                  <div>
                    <span className="font-mono font-bold text-xs text-blue-900">{appliedCoupon.code}</span>
                    <span className="text-[11px] text-blue-700 block">{appliedCoupon.description}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    id="cart-coupon-input"
                    type="text"
                    aria-label="Enter promotional coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter AQUA10 or FIRSTFISH"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 uppercase font-mono outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              {packingCharge > 0 && (
                <div className="flex justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Medical Oxygen Insulated Packing</span>
                    <span className="text-[10px] text-blue-800 font-bold bg-blue-50 px-1 rounded">Live Fish</span>
                  </span>
                  <span className="font-semibold text-slate-900">{formatCurrency(packingCharge)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-slate-600">
                <span>Express Air Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-blue-700 font-bold">FREE</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-red-600 font-semibold">
                  <span>Coupon Savings ({appliedCoupon?.code})</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-sm text-slate-900">Total Payable</span>
                <span className="font-extrabold text-xl text-blue-950 font-display">
                  {formatCurrency(total)}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs active:scale-98 flex items-center justify-center gap-2 mt-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-red-400" />
              </button>

              <div className="pt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Safe Manual UPI Verification on Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

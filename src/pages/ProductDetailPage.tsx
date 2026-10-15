import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingCart, ShieldCheck, Truck, 
  MapPin, Check, Sparkles, AlertTriangle, 
  Share2, ArrowLeft, Star, Send 
} from 'lucide-react';
import { mockDb } from '../lib/mockDatabase';
import { formatCurrency, calculateDiscount } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { StarRating } from '../components/common/StarRating';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = mockDb.getProductBySlug(slug || '');

  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    serviceable: boolean;
    days: string;
  } | null>(null);

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState(() => mockDb.getReviews(product?.id));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The specimen or item you are looking for has been adopted or moved.</p>
        <Link to="/shop" className="px-5 py-2.5 bg-ocean-900 text-white rounded-xl text-xs font-bold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.compare_at_price);
  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6) {
      showToast('Please enter a valid 6-digit PIN code', 'error');
      return;
    }
    const res = mockDb.checkPincodeServiceability(pincode);
    setPincodeStatus({
      checked: true,
      serviceable: res.serviceable,
      days: res.estimatedDays,
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewTitle || !reviewComment) {
      showToast('Please fill in all review fields', 'error');
      return;
    }
    const newRev = mockDb.submitReview({
      product_id: product.id,
      user_name: reviewName,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      is_verified: true,
    });
    setReviewsList([newRev, ...reviewsList]);
    showToast('Thank you! Your verified review has been published.', 'success');
    setReviewTitle('');
    setReviewComment('');
  };

  const relatedProducts = mockDb.getProducts()
    .filter(p => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-ocean-950">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-ocean-950">Catalog</Link>
            <span>/</span>
            <Link to={`/shop?cat=${product.category_id}`} className="hover:text-ocean-950 font-medium">
              {product.category_name}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-1 text-aqua-700 font-semibold hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: Gallery (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200 relative shadow-sm">
              <img
                src={product.images[selectedImg] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {/* Floating badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_unique_specimen && (
                  <span className="inline-flex items-center gap-1.5 bg-ocean-950/95 backdrop-blur-md text-aqua-300 border border-aqua-400/40 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-aqua-400" />
                    <span>Exact Specimen Shown</span>
                  </span>
                )}
                {discount > 0 && (
                  <span className="inline-flex items-center bg-coral-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-500 border border-rose-200'
                    : 'bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white transition-all shrink-0 ${
                      selectedImg === idx ? 'border-aqua-500 shadow-md ring-2 ring-aqua-500/20' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Specimen Transparency Note */}
            {product.is_unique_specimen && (
              <div className="bg-ocean-950 text-slate-200 p-4 rounded-2xl border border-ocean-800 text-xs flex items-start gap-3 shadow-md">
                <Sparkles className="w-5 h-5 text-aqua-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-aqua-300 block mb-0.5">True-To-Specimen Transparency</span>
                  <span>
                    Unlike commercial stores that show generic stock photography, this listing is for the <strong>exact living fish</strong> pictured. No substitutions are ever made.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-aqua-700 bg-aqua-50 px-2.5 py-0.5 rounded-full border border-aqua-200">
                  {product.category_name}
                </span>
                {product.strain && (
                  <span className="text-xs text-slate-500 font-medium">
                    Strain: <strong className="text-slate-800">{product.strain}</strong>
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono ml-auto">SKU: {product.sku}</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 font-display leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating} reviewCount={product.review_count} size="md" />
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  In Stock & Ready for Express Dispatch
                </span>
              </div>

              {/* Price Block */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-baseline gap-3 mb-6">
                <span className="text-3xl sm:text-4xl font-black text-ocean-950 font-display">
                  {formatCurrency(product.price)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <>
                    <span className="text-base sm:text-lg text-slate-400 line-through">
                      {formatCurrency(product.compare_at_price)}
                    </span>
                    <span className="text-xs font-bold text-coral-600 bg-coral-50 border border-coral-200 px-2 py-0.5 rounded-md">
                      Save {formatCurrency(product.compare_at_price - product.price)} ({discount}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Biological Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-white rounded-2xl border border-slate-200 text-xs mb-6">
                <div>
                  <span className="text-slate-400 block text-[11px]">Water Temp</span>
                  <span className="font-bold text-slate-900">{product.temperature_range || '24°C - 28°C'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Care Level</span>
                  <span className="font-bold text-slate-900">{product.care_level || 'Moderate'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Gender</span>
                  <span className="font-bold text-slate-900">{product.gender || 'Single Male'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Size</span>
                  <span className="font-bold text-slate-900">{product.size || '3.5 - 4.5 cm'}</span>
                </div>
              </div>

              {/* Pincode Delivery Checker */}
              <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200/90 mb-6">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <MapPin className="w-4 h-4 text-aqua-600" />
                  <span>Check Live Fish Express Transit Time</span>
                </div>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit PIN code (e.g. 560038)"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-aqua-500"
                  />
                  <button
                    type="submit"
                    className="bg-ocean-900 hover:bg-ocean-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                  >
                    Check
                  </button>
                </form>

                {pincodeStatus && (
                  <div className="mt-2.5 text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Eligible for Overnight Air Cargo: Arrives within <strong>{pincodeStatus.days}</strong></span>
                  </div>
                )}
              </div>

              {/* Purchase Action Strip */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {!product.is_unique_specimen && product.stock_quantity > 1 && (
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden h-12 bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-slate-100 text-slate-700 font-bold"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-2 font-bold text-sm text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        className="px-4 py-2 hover:bg-slate-100 text-slate-700 font-bold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 h-12 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-ocean-900 hover:bg-ocean-800 text-white active:scale-95'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 text-aqua-400" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex-1 h-12 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-aqua-500 to-aqua-600 hover:from-aqua-400 hover:to-aqua-500 text-ocean-950 transition-all shadow-glow-aqua active:scale-95"
                  >
                    <span>Instant Checkout</span>
                  </button>
                </div>
              </div>

              {/* Guarantees List */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Live Arrival Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-aqua-600 shrink-0" />
                  <span>Medical Oxygen Packing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specs and Acclimation Tabs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-16 space-y-6">
          <h2 className="text-xl font-bold text-ocean-950 font-display">
            Care Guidelines & Habitat Requirements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                Aquarium Setup & Water Chemistry
              </h3>
              <ul className="space-y-2 text-slate-600 list-disc list-inside">
                <li><strong>Recommended Minimum Tank:</strong> 15 Litres (3.5 Gallons) or larger with gentle sponge filter.</li>
                <li><strong>Ideal Temperature:</strong> 24°C to 28°C (Heater strongly recommended during monsoon and winter).</li>
                <li><strong>pH Range:</strong> 6.5 - 7.5 (Slightly soft water enriched with Indian Almond leaf tannins).</li>
                <li><strong>Substrate & Flora:</strong> Live natural plants like Anubias, Java Fern, or floating Salvinia to create resting spots.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                Acclimation & Live Arrival Protocol
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Float the sealed insulated bag on top of your aquarium water for 15-20 minutes to equalize temperatures. Gently open the bag, add small cup amounts of aquarium water every 5 minutes for 20 minutes, and net the fish in. Discard shipping water.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                <strong>DOA Coverage:</strong> In the rare event of transit fatality, record a continuous 30-second video of the unopened bag within 2 hours of delivery for full store credit or replacement.
              </div>
            </div>
          </div>
        </div>

        {/* Verified Customer Reviews */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-ocean-950 font-display">
                Customer Reviews ({reviewsList.length})
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={product.rating} size="md" />
                <span className="text-xs text-slate-500">Based on verified purchases</span>
              </div>
            </div>
          </div>

          {/* Review Submission Form */}
          <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mb-8 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Write A Verified Buyer Review</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                >
                  <option value={5}>5 Stars - Outstanding Health & Vitality</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Gorgeous Betta, arrived lively!"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Feedback Comments</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience regarding packing, water temperature, and acclimation..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-aqua-400" />
              <span>Submit Review</span>
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-900">{rev.user_name}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <h4 className="font-semibold text-xs text-slate-800 mb-1">"{rev.title}"</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ocean-950 font-display mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Purchase Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <div className="text-[10px] text-slate-400 font-medium">Price:</div>
          <div className="text-lg font-bold text-ocean-950 font-display leading-tight">
            {formatCurrency(product.price)}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="px-4 py-2.5 rounded-xl bg-ocean-900 text-white font-bold text-xs"
          >
            Add
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="px-5 py-2.5 rounded-xl bg-aqua-500 text-ocean-950 font-bold text-xs"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

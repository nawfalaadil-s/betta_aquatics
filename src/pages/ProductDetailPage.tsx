import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingBag, ShieldCheck, Truck, 
  MapPin, Check, Sparkles, ArrowLeft, Star, Send, 
  HeartHandshake, MessageCircle 
} from 'lucide-react';
import { mockDb } from '../lib/mockDatabase';
import { formatCurrency, calculateDiscount } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { StarRating } from '../components/common/StarRating';
import { ProductCard } from '../components/common/ProductCard';
import { SEO } from '../components/common/SEO';

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
        <SEO title="Specimen Not Found" description="The requested ornamental fish specimen has already found a home." />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Specimen Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">This unique fish has either been adopted or moved to a breeding project.</p>
        <Link to="/shop" className="px-5 py-2.5 bg-ocean-900 text-white rounded-xl text-xs font-bold">
          Explore Available Bettas
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.compare_at_price);
  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock_quantity <= 0;

  // JSON-LD Structured Data for Google Rich Results
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Betta Aquatics',
    },
    offers: {
      '@type': 'Offer',
      url: `https://bettaaquatics.in/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Betta Aquatics',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count || 1,
    },
  };

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
      showToast('Please enter a valid 6-digit Indian PIN code', 'error');
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
      showToast('Please fill in your name, rating, and feedback', 'error');
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
    showToast('Thank you! Your verified review is published.', 'success');
    setReviewTitle('');
    setReviewComment('');
  };

  const relatedProducts = mockDb.getProducts()
    .filter(p => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      {/* SEO Injection */}
      <SEO
        title={product.name}
        description={product.short_description || product.description}
        canonical={`https://bettaaquatics.in/product/${product.slug}`}
        ogImage={product.images[0]}
        ogType="product"
        jsonLd={productSchema}
        keywords={[
          product.name.toLowerCase(),
          product.strain?.toLowerCase() || 'betta fish',
          'buy betta fish india',
          'live ornamental fish',
          'betta splendens show class'
        ]}
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-slate-500 mb-6">
          <ol className="flex items-center gap-1.5 flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to="/" itemProp="item" className="hover:text-ocean-950">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <span>/</span>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to="/shop" itemProp="item" className="hover:text-ocean-950">
                <span itemProp="name">Shop</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <span>/</span>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to={`/shop?cat=${product.category_id}`} itemProp="item" className="hover:text-ocean-950 font-medium">
                <span itemProp="name">{product.category_name}</span>
              </Link>
              <meta itemProp="position" content="3" />
            </li>
            <span>/</span>
            <li className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </li>
          </ol>
          <Link to="/shop" className="hidden sm:flex items-center gap-1 text-aqua-700 font-semibold hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Fish</span>
          </Link>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Gallery Left (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200/80 relative shadow-sm">
              <img
                src={product.images[selectedImg] || product.images[0]}
                alt={`${product.name} - ${product.strain || 'Live Fish'} available at Betta Aquatics`}
                className="w-full h-full object-cover object-center"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_unique_specimen && (
                  <span className="inline-flex items-center gap-1.5 bg-ocean-950/90 backdrop-blur-md text-aqua-300 border border-aqua-400/40 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-aqua-400" />
                    <span>Exact Specimen Pictured</span>
                  </span>
                )}
                {discount > 0 && !product.is_unique_specimen && (
                  <span className="inline-flex items-center bg-coral-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-500 border border-rose-200'
                    : 'bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
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
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Reassuring Breeder Commitment */}
            <div className="bg-warm-50 text-warm-900 p-4 rounded-3xl border border-warm-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <HeartHandshake className="w-4 h-4 text-aqua-700 shrink-0" />
                <span>Conditioned with Care by Indian Aquascapers</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                This fish has completed a minimum 72-hour biosecure quarantine. Fed with live artemia and high-protein micro pellets to ensure active, vibrant behavior right out of the shipping bag.
              </p>
            </div>
          </div>

          {/* Details Right (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-aqua-700 bg-aqua-50 px-3 py-0.5 rounded-full border border-aqua-200">
                  {product.category_name}
                </span>
                {product.strain && (
                  <span className="text-xs text-slate-500">
                    Strain: <strong className="text-slate-800">{product.strain}</strong>
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono ml-auto">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 font-display leading-snug mb-3">
                {product.name}
              </h1>

              {/* Rating & Availability */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating} reviewCount={product.review_count} size="md" />
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Ready for Express Dispatch
                </span>
              </div>

              {/* Price Block */}
              <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-baseline gap-3 mb-6">
                <span className="text-3xl sm:text-4xl font-black text-ocean-950 font-display">
                  {formatCurrency(product.price)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <>
                    <span className="text-base sm:text-lg text-slate-400 line-through">
                      {formatCurrency(product.compare_at_price)}
                    </span>
                    <span className="text-xs font-bold text-coral-600 bg-coral-50 border border-coral-200 px-2.5 py-0.5 rounded-full">
                      Save {formatCurrency(product.compare_at_price - product.price)} ({discount}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Habitat & Care Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-white rounded-2xl border border-slate-200 text-xs mb-6">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Water Temp</span>
                  <span className="font-bold text-slate-900">{product.temperature_range || '24°C - 28°C'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Care Level</span>
                  <span className="font-bold text-slate-900">{product.care_level || 'Moderate'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Gender</span>
                  <span className="font-bold text-slate-900">{product.gender || 'Single Male'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Size</span>
                  <span className="font-bold text-slate-900">{product.size || '3.5 - 4.5 cm'}</span>
                </div>
              </div>

              {/* Humanized PIN Code Checker */}
              <div className="p-4 bg-slate-100/70 rounded-3xl border border-slate-200 mb-6">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <MapPin className="w-4 h-4 text-aqua-600" />
                  <span>Will this fish reach you safely? Check delivery time</span>
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
                    Check PIN
                  </button>
                </form>

                {pincodeStatus && (
                  <div className="mt-2.5 text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Eligible for Overnight Air Cargo: Arrives within <strong>{pincodeStatus.days}</strong></span>
                  </div>
                )}
              </div>

              {/* Purchase Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {!product.is_unique_specimen && product.stock_quantity > 1 && (
                    <div className="flex items-center border border-slate-300 rounded-2xl overflow-hidden h-12 bg-white">
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
                    className={`flex-1 h-12 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-ocean-900 hover:bg-ocean-800 text-white active:scale-95'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-aqua-400" />
                    <span>Add to Tank</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex-1 h-12 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-aqua-500 to-aqua-600 hover:from-aqua-400 hover:to-aqua-500 text-ocean-950 transition-all shadow-glow-aqua active:scale-95"
                  >
                    <span>Adopt Now</span>
                  </button>
                </div>
              </div>

              {/* WhatsApp direct consultation */}
              <div className="pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
                <span>Unsure about tank compatibility?</span>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-emerald-700 font-bold hover:underline"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Ask our breeder on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Care Guide Summary */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-16 space-y-6">
          <h2 className="text-xl font-bold text-ocean-950 font-display">
            Habitat & Floating Acclimation Guide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                Aquarium Setup Checklist
              </h3>
              <ul className="space-y-2 text-slate-600 list-disc list-inside">
                <li><strong>Tank Volume:</strong> Minimum 15 Litres (3.5 Gallons) with a gentle filter flow.</li>
                <li><strong>Temperature:</strong> Tropical 24°C to 28°C (Heater recommended).</li>
                <li><strong>pH Range:</strong> Soft, neutral water (pH 6.5 - 7.5).</li>
                <li><strong>Resting Leaves:</strong> Add Indian Almond leaves to replicate natural Amazonian tannins.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                Simple Acclimation Steps
              </h3>
              <p className="text-slate-600 leading-relaxed">
                1. Float the sealed shipping bag on your tank surface for 15-20 minutes to equalize temperature.
                <br />
                2. Add 1/4 cup of aquarium water every 5 minutes for 20 minutes.
                <br />
                3. Gently net your Betta into his new home. Do not dump the transit bag water.
              </p>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
                <strong>100% Live Arrival Guarantee:</strong> If anything happens in transit, simply record a 30-second video of the unopened shipping bag within 2 hours of delivery for an instant replacement or refund.
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-ocean-950 font-display">
                Aquarist Reviews ({reviewsList.length})
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={product.rating} size="md" />
                <span className="text-xs text-slate-500">Verified buyer community</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-5 rounded-3xl border border-slate-200/80 mb-8 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Share Your Experience with this Fish</h3>
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
                  <option value={5}>5 Stars - Pristine Health & Gorgeous Color</option>
                  <option value={4}>4 Stars - Very Healthy</option>
                  <option value={3}>3 Stars - Good</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Review Headline</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Arrived active, colors are breathtaking!"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-aqua-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Feedback</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How was the packaging, temperature, and fish behavior?"
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
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-ocean-950 font-display mb-6">
              Other Specimens You Might Adore
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Purchase Bar (Amazon / Flipkart-style Ergonomics) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3.5 pt-2.5 pb-[calc(env(safe-area-inset-bottom,8px)+8px)] flex items-center justify-between gap-2.5 shadow-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${
              isWishlisted
                ? 'bg-rose-50 text-rose-500 border-rose-200'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-rose-500'
            }`}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>
          <div>
            <div className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">Live Specimen:</div>
            <div className="text-base font-extrabold text-ocean-950 font-display leading-tight">
              {formatCurrency(product.price)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-ocean-950 hover:bg-ocean-900 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-aqua-400" />
            <span>Add to Tank</span>
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-aqua-500 to-aqua-600 hover:from-aqua-400 hover:to-aqua-500 active:scale-95 text-ocean-950 font-extrabold text-xs flex items-center justify-center gap-1 shadow-glow-aqua transition-all"
          >
            <span>Adopt Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

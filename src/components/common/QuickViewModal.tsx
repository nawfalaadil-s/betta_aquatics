import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingCart, Sparkles, Heart, ShieldCheck, Truck, ExternalLink } from 'lucide-react';
import { Product } from '../../lib/types';
import { formatCurrency, calculateDiscount } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { StarRating } from './StarRating';
import { Link } from 'react-router-dom';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.compare_at_price);
  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, quantity);
    if (success) {
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ocean-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 z-10 my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-600 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
            {/* Gallery Left */}
            <div className="p-4 sm:p-6 bg-slate-50 flex flex-col justify-between">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-slate-200/80 relative shadow-inner mb-3">
                <img
                  src={product.images[selectedImg] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.is_unique_specimen && (
                  <div className="absolute top-3 left-3 bg-ocean-950/90 text-aqua-300 border border-aqua-400/40 text-xs font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-aqua-400" />
                    <span>Exact Specimen Shown</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImg === idx ? 'border-aqua-500 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Right */}
            <div className="p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-aqua-700 bg-aqua-50 px-2.5 py-0.5 rounded-full">
                    {product.category_name || 'Ornamental Fish'}
                  </span>
                  {product.strain && (
                    <span className="text-xs text-slate-500 font-medium">
                      Strain: {product.strain}
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-2 font-display">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mb-3">
                  <StarRating rating={product.rating} reviewCount={product.review_count} size="md" />
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-mono">SKU: {product.sku}</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-ocean-950 font-display">
                    {formatCurrency(product.price)}
                  </span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <>
                      <span className="text-sm text-slate-400 line-through">
                        {formatCurrency(product.compare_at_price)}
                      </span>
                      <span className="text-xs font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-md">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {product.short_description || product.description}
                </p>

                {/* Spec Highlights */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60 mb-4">
                  <div>
                    <span className="text-slate-400 block">Care Level:</span>
                    <span className="font-semibold text-slate-800">{product.care_level || 'Moderate'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Water Temp:</span>
                    <span className="font-semibold text-slate-800">{product.temperature_range || '24°C - 28°C'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Gender:</span>
                    <span className="font-semibold text-slate-800">{product.gender || 'Single Male'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Availability:</span>
                    <span className={`font-semibold ${product.stock_quantity > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {product.stock_quantity > 0 ? `${product.stock_quantity} In Stock` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Trust mini pills */}
                <div className="flex flex-col gap-1.5 text-xs text-slate-600 mb-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-aqua-600 shrink-0" />
                    <span>100% Live Arrival Guarantee with thermal box</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-aqua-600 shrink-0" />
                    <span>Overnight Express Air Cargo direct to door</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  {!product.is_unique_specimen && product.stock_quantity > 1 && (
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden h-11 shrink-0">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-semibold text-sm text-slate-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                      isOutOfStock
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-ocean-900 hover:bg-ocean-800 text-white active:scale-[0.98]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-200" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-aqua-400" />
                        <span>Add to Cart ({formatCurrency(product.price * quantity)})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${
                      isWishlisted
                        ? 'bg-rose-50 text-rose-500 border-rose-200'
                        : 'border-slate-300 text-slate-600 hover:text-rose-500 hover:bg-slate-50'
                    }`}
                    aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-aqua-700 hover:text-aqua-800 py-1"
                >
                  <span>View Full Product Specifications & Care Guide</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

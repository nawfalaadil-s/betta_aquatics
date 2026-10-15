import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Sparkles, Check } from 'lucide-react';
import { Product } from '../../lib/types';
import { formatCurrency, calculateDiscount } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { StarRating } from './StarRating';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const discount = calculateDiscount(product.price, product.compare_at_price);
  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    const success = addToCart(product, 1);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <article className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-aqua-400/60 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-slate-50 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full" aria-label={`View details for ${product.name}`}>
          <img
            src={product.images[0]}
            alt={`${product.name} - ${product.strain || 'Ornamental Fish'} raised by Betta Aquatics`}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Floating Specimen Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.is_unique_specimen && (
            <span className="inline-flex items-center gap-1 bg-ocean-950/85 backdrop-blur-md text-aqua-300 border border-aqua-400/30 text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 text-aqua-400" />
              <span>Exact Specimen</span>
            </span>
          )}
          {discount > 0 && !product.is_unique_specimen && (
            <span className="inline-flex items-center bg-coral-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist & Quick View */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all shadow-sm backdrop-blur-md ${
              isWishlisted
                ? 'bg-rose-50 text-rose-500 border border-rose-200'
                : 'bg-white/90 hover:bg-white text-slate-500 hover:text-rose-500'
            }`}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>

          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-aqua-600 flex items-center justify-center transition-all shadow-sm backdrop-blur-md opacity-0 group-hover:opacity-100 hidden sm:flex"
              aria-label="Quick View specimen"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sold out badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-slate-900/90 text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700">
              Adopted / Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Strain */}
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1">
            <span className="truncate">{product.category_name || 'Ornamental Fish'}</span>
            {product.strain && (
              <span className="text-aqua-700 font-semibold truncate ml-1">{product.strain}</span>
            )}
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-aqua-700 transition-colors">
            <h3 className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug mb-1.5 font-sans">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mb-2">
            <StarRating rating={product.rating} reviewCount={product.review_count} size="sm" />
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2.5 border-t border-slate-100 mt-auto">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-base sm:text-lg font-bold text-ocean-950 font-display">
              {formatCurrency(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.compare_at_price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-3 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : isAdded
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-ocean-900 hover:bg-ocean-800 text-white shadow-sm active:scale-[0.98]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Added to Tank!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-aqua-400" />
                <span>Adopt / Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

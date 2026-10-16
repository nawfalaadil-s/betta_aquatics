import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
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
    <article className="group relative bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col overflow-hidden h-full">
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-slate-50 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full" aria-label={`View details for ${product.name}`}>
          <img
            src={product.images[0]}
            alt={`${product.name} - ${product.strain || 'Ornamental Fish'}`}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          />
        </Link>

        {/* Floating Specimen Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.is_unique_specimen && (
            <span className="inline-flex items-center gap-1 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-2xs">
              <span>WYSIWYG 1-of-1</span>
            </span>
          )}
          {discount > 0 && !product.is_unique_specimen && (
            <span className="inline-flex items-center bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist & Quick View */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-2xs ${
              isWishlisted
                ? 'bg-rose-50 text-rose-500 border border-rose-200'
                : 'bg-white/95 hover:bg-white text-slate-500 hover:text-rose-500 border border-slate-200'
            }`}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>

          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all shadow-2xs border border-slate-200 opacity-0 group-hover:opacity-100 hidden sm:flex"
              aria-label="Quick View specimen"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sold out badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center z-20">
            <span className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-700">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Strain */}
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1">
            <span className="truncate">{product.category_name || 'Ornamental Fish'}</span>
            {product.strain && (
              <span className="text-slate-600 font-semibold truncate ml-1">{product.strain}</span>
            )}
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-teal-700 transition-colors">
            <h3 className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug mb-1 font-sans">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mb-2">
            <StarRating rating={product.rating} reviewCount={product.review_count} size="sm" />
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 mt-auto">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-base sm:text-lg font-bold text-slate-900 font-display">
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
            className={`w-full min-h-[42px] py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors select-none ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : isAdded
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs active:scale-98'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                <span>Added to Tank!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add to Tank</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

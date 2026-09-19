import React, { useState } from 'react';
import { Shoe, ShoeColor } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoePlaceholderMockup } from './ShoePlaceholderMockup';
import { formatKSh } from '../utils/formatters';
import { Heart, Star, ShoppingCart, Check, Zap, Send } from 'lucide-react';

interface ShoeCardProps {
  shoe: Shoe;
}

export const ShoeCard: React.FC<ShoeCardProps> = ({ shoe }) => {
  const {
    toggleFavorite,
    isFavorite,
    addToCart,
    openShoeDetail,
    mockupWireframeMode,
    setIsCheckoutModalOpen,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState<ShoeColor>(shoe.colors[0]);
  const [selectedSize] = useState<number>(shoe.sizes[0]);
  const [imgError, setImgError] = useState(false);
  const [isJustAdded, setIsJustAdded] = useState(false);

  const favorited = isFavorite(shoe.id);
  const discountPercent = shoe.originalPriceKsh
    ? Math.round(((shoe.originalPriceKsh - shoe.priceKsh) / shoe.originalPriceKsh) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(shoe, selectedSize, selectedColor, 1);
    setIsJustAdded(true);
    setTimeout(() => {
      setIsJustAdded(false);
    }, 1600);
  };

  const handleQuickMpesaBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(shoe, selectedSize, selectedColor, 1);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div
      onClick={() => openShoeDetail(shoe)}
      className="group relative flex flex-col bg-white rounded-xl border border-slate-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden flex items-center justify-center">
        {shoe.imageUrl && !imgError && !mockupWireframeMode ? (
          <img
            src={shoe.imageUrl}
            alt={shoe.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <ShoePlaceholderMockup
            silhouette={shoe.silhouette}
            primaryColor={selectedColor}
            shoeName={shoe.name}
            aspectRatio="1:1"
            wireframeOnly={mockupWireframeMode}
            showTechnicalDetails={false}
          />
        )}

        {/* Top-Left Deal Badge (Orange Banner) */}
        {shoe.dealBadge && (
          <div className="absolute top-0 left-0 bg-amber-500 text-white font-bold text-[10px] tracking-wide px-2.5 py-1 rounded-br-md shadow-xs z-10 uppercase">
            {shoe.dealBadge}
          </div>
        )}

        {/* Top-Right Discount Pill (if no deal badge or as secondary) */}
        {discountPercent > 0 && !shoe.dealBadge && (
          <div className="absolute top-2 left-2 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] font-mono px-2 py-0.5 rounded shadow-xs z-10">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Heart Button on bottom-right of image */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(shoe.id);
          }}
          className={`absolute bottom-2.5 right-2.5 p-2 rounded-full backdrop-blur-md shadow-md transition-all active:scale-90 z-20 ${
            favorited
              ? 'bg-white text-rose-500 border border-rose-200'
              : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white border border-slate-200'
          }`}
          title={favorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current text-rose-500' : ''}`} />
        </button>

        {/* HOVER ACTION BAR: Primary "ADD TO CART" Button on Card Hover */}
        <div className="absolute inset-x-2 bottom-2 z-20 flex flex-col gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 ${
              isJustAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
            }`}
            title="Add to Cart"
          >
            {isJustAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 fill-current" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Secondary Quick M-Pesa Buy */}
          <button
            type="button"
            onClick={handleQuickMpesaBuy}
            className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-950 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
            title="Express M-Pesa Checkout"
          >
            <Zap className="w-3 h-3 text-emerald-400 fill-current" />
            <span>Buy via M-Pesa</span>
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 bg-white">
        <div>
          {/* Official Store Pill */}
          {shoe.isOfficialStore && (
            <div className="mb-1">
              <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                Official Store
              </span>
            </div>
          )}

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm text-slate-800 font-medium group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
            {shoe.name}
          </h3>
        </div>

        {/* Pricing & Discount */}
        <div className="pt-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight">
              {formatKSh(shoe.priceKsh)}
            </span>
          </div>

          {shoe.originalPriceKsh && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400 line-through font-mono">
                {formatKSh(shoe.originalPriceKsh)}
              </span>
              {discountPercent > 0 && (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                  -{discountPercent}%
                </span>
              )}
            </div>
          )}

          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(shoe.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : i < shoe.rating
                      ? 'fill-amber-400/50 text-amber-400'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-500 text-[11px] font-medium">({shoe.reviewCount})</span>
          </div>

          {/* Express Delivery Badge */}
          {shoe.expressDelivery && (
            <div className="flex items-center gap-1 mt-1.5 text-[11px] font-bold text-amber-600">
              <Send className="w-3 h-3 text-amber-600 fill-amber-600 -rotate-45" />
              <span className="tracking-wider uppercase text-[10px]">EXPRESS DELIVERY</span>
            </div>
          )}
        </div>

        {/* Fallback Mobile / Non-hover "Add to Cart" Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between sm:hidden">
          <span className="text-[11px] text-slate-500 capitalize">{shoe.category}</span>
          <button
            type="button"
            onClick={handleQuickAdd}
            className="p-2 rounded-lg bg-amber-500 active:bg-amber-600 text-white shadow-xs cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

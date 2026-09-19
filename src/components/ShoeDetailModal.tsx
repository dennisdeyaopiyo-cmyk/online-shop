import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoeColor } from '../types';
import { ShoePlaceholderMockup } from './ShoePlaceholderMockup';
import { formatKSh } from '../utils/formatters';
import { 
  X, 
  Heart, 
  Star, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  Smartphone, 
  Ruler, 
  ArrowRight,
  Zap
} from 'lucide-react';

export const ShoeDetailModal: React.FC = () => {
  const {
    selectedShoeForDetail,
    closeShoeDetail,
    addToCart,
    toggleFavorite,
    isFavorite,
    setIsCheckoutModalOpen,
    mockupWireframeMode,
  } = useStore();

  if (!selectedShoeForDetail) return null;

  const shoe = selectedShoeForDetail;
  const [selectedColor, setSelectedColor] = useState<ShoeColor>(shoe.colors[0]);
  const [selectedSize, setSelectedSize] = useState<number>(shoe.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const favorited = isFavorite(shoe.id);

  const handleAddToCart = () => {
    addToCart(shoe, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyWithMpesa = () => {
    addToCart(shoe, selectedSize, selectedColor, quantity);
    closeShoeDetail();
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeShoeDetail}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Mockup Placeholder Visual Asset */}
          <div className="md:col-span-6 p-6 bg-slate-900 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                SKU: {shoe.sku}
              </span>
              <button
                onClick={() => toggleFavorite(shoe.id)}
                className={`p-2 rounded-full border transition-colors ${
                  favorited
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Main Product Image / Mockup Rendering */}
            <div className="my-auto py-4">
              {shoe.imageUrl && !mockupWireframeMode ? (
                <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <img
                    src={shoe.imageUrl}
                    alt={shoe.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {shoe.dealBadge && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white font-bold text-[10px] tracking-wide px-2.5 py-1 rounded shadow-xs uppercase">
                      {shoe.dealBadge}
                    </div>
                  )}
                </div>
              ) : (
                <ShoePlaceholderMockup
                  silhouette={shoe.silhouette}
                  primaryColor={selectedColor}
                  aspectRatio="4:3"
                  shoeName={shoe.name}
                  wireframeOnly={mockupWireframeMode}
                  showTechnicalDetails={true}
                />
              )}
            </div>

            {/* Design Spec Note for Mockups */}
            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-slate-200">
                <span>MOCKUP SPECIFICATION:</span>
                <span className="text-emerald-400 font-bold">{shoe.silhouette}</span>
              </div>
              <p className="text-slate-400 text-[10px] leading-tight">
                Vector blueprint mockup render for Kenya Footwear catalog.
              </p>
            </div>
          </div>

          {/* Right Column: Information, Sizes, Prices in KSh, M-Pesa CTAs */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand & Category */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {shoe.brand}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold capitalize text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {shoe.category} ({shoe.gender})
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {shoe.name}
              </h2>

              {/* Price Display in Kenyan Shillings */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                  {formatKSh(shoe.priceKsh)}
                </span>
                {shoe.originalPriceKsh && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    {formatKSh(shoe.originalPriceKsh)}
                  </span>
                )}
                {shoe.originalPriceKsh && (
                  <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Save {formatKSh(shoe.originalPriceKsh - shoe.priceKsh)}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="font-bold text-slate-800">{shoe.rating}</span>
                <span className="text-slate-400 font-mono">({shoe.reviewCount} customer reviews)</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {shoe.description}
              </p>

              {/* Color Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">Colorway:</span>
                  <span className="font-mono text-slate-600 font-medium">{selectedColor.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {shoe.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                        selectedColor.name === c.name
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">EU Shoe Size:</span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-emerald-700 hover:text-emerald-800 underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{showSizeGuide ? 'Hide Size Chart' : 'Kenya Size Chart'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {shoe.sizes.map((s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        EU {s}
                      </button>
                    );
                  })}
                </div>

                {/* Size Chart Drawer */}
                {showSizeGuide && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono space-y-1">
                    <div className="font-bold text-slate-900 mb-1">STANDARD FOOTWEAR SIZING IN KENYA:</div>
                    <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-1 text-slate-500 font-semibold">
                      <span>EU Size</span>
                      <span>UK Size</span>
                      <span>Foot Length</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-slate-700">
                      <span>EU 40 / 41</span>
                      <span>UK 6.5 / 7</span>
                      <span>25.5 - 26 cm</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-slate-700">
                      <span>EU 42 / 43</span>
                      <span>UK 8 / 9</span>
                      <span>26.5 - 27.5 cm</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-slate-700">
                      <span>EU 44 / 45</span>
                      <span>UK 9.5 / 10.5</span>
                      <span>28.0 - 29.0 cm</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-semibold text-slate-900">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Materials & Features Pills */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-semibold text-slate-900 block">Craft &amp; Materials:</span>
                <div className="flex flex-wrap gap-1.5">
                  {shoe.materials.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs: Add to Cart and M-Pesa Buy Now */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl border-2 border-slate-900 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyWithMpesa}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy with M-Pesa</span>
                </button>
              </div>

              {/* Local Logistics Guarantee */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-700" />
                  <span>Same-Day Nairobi Dispatch</span>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>M-Pesa Verified Merchant</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

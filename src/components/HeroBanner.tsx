import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Heart, 
  ArrowRight, 
  Truck, 
  Smartphone, 
  Layers, 
  CheckCircle2, 
  ShoppingBag,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ShoePlaceholderMockup } from './ShoePlaceholderMockup';
import { formatKSh } from '../utils/formatters';

export const HeroBanner: React.FC = () => {
  const { 
    setActiveCategory, 
    shoes, 
    orders, 
    favorites, 
    toggleFavorite, 
    isFavorite,
    setIsProfileModalOpen, 
    setProfileModalTab,
    setIsCheckoutModalOpen,
    addToCart,
    openShoeDetail,
    loadDemoAccount,
  } = useStore();

  const featuredShoe = shoes.find(s => s.id === 'shoe-1') || shoes[0];
  const isFeaturedFavorited = isFavorite(featuredShoe.id);

  // Active order or fallback sample order for the preview
  const latestOrder = orders.length > 0 ? orders[0] : null;

  // Favorites shoes preview
  const favoritedShoesList = shoes.filter(s => favorites.includes(s.id));

  // Quick categories for the 4-card showcase
  const quickCategories = [
    {
      category: 'formal',
      collection: 'Leather Collection',
      name: 'Oxford Brogue Classic',
      price: 'KES 8,200',
      shoeId: 'shoe-3',
      silhouette: 'oxford' as const,
      color: { name: 'Cognac Brown', hex: '#8B4513' }
    },
    {
      category: 'boots',
      collection: 'Outdoor & Trekking',
      name: 'Alpine Trail King V2',
      price: 'KES 11,000',
      shoeId: 'shoe-6',
      silhouette: 'hiking_boot' as const,
      color: { name: 'Olive Green', hex: '#556B2F' }
    },
    {
      category: 'casual',
      collection: 'Everyday Streetwear',
      name: 'Urban Canvas Low',
      price: 'KES 5,500',
      shoeId: 'shoe-9',
      silhouette: 'canvas_low' as const,
      color: { name: 'Raw Natural', hex: '#E6DFD5' }
    }
  ];

  return (
    <div className="bg-slate-50 border-b border-slate-200 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Hero Section (Professional Polish Layout) */}
        <section className="flex flex-col lg:flex-row gap-6">
          {/* Left 2/3 Feature Card */}
          <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row relative group shadow-xs">
            <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
              <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-xs mb-3 font-mono">
                Performance Series • Kenya
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4 text-slate-900 tracking-tight">
                Velocity X1 <br />
                <span className="text-slate-400 font-normal">Elite Runner</span>
              </h1>
              <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
                Engineered for speed, built for the Kenyan terrain. Ultralight carbon mesh with high-rebound cushioning.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    addToCart(featuredShoe, 42, featuredShoe.colors[0], 1);
                    setIsCheckoutModalOpen(true);
                  }}
                  className="bg-slate-900 text-white px-7 py-3 rounded-full font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Buy Now: KES 8,499</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleFavorite(featuredShoe.id)}
                  className={`w-11 h-11 border rounded-full flex items-center justify-center transition-colors ${
                    isFeaturedFavorited
                      ? 'border-rose-200 bg-rose-50 text-rose-500'
                      : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                  }`}
                  title={isFeaturedFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isFeaturedFavorited ? 'fill-current text-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Right Card Hero Footwear Visual */}
            <div className="w-full md:w-1/2 bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden min-h-[260px]">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-200/60 opacity-60" />
              
              <div 
                onClick={() => openShoeDetail(featuredShoe)}
                className="w-full max-w-xs cursor-pointer transform group-hover:scale-105 transition-transform duration-500 relative z-10"
              >
                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border-4 border-white">
                  {featuredShoe.imageUrl ? (
                    <img
                      src={featuredShoe.imageUrl}
                      alt={featuredShoe.name}
                      referrerPolicy="no-referrer"
                      className="w-full aspect-16/9 object-cover"
                    />
                  ) : (
                    <ShoePlaceholderMockup
                      silhouette={featuredShoe.silhouette}
                      primaryColor={featuredShoe.colors[0]}
                      shoeName={featuredShoe.name}
                      aspectRatio="16:9"
                      wireframeOnly={false}
                      showTechnicalDetails={false}
                    />
                  )}
                </div>
              </div>

              {/* Color Swatch Dots */}
              <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
                <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-white shadow-xs" title="Carbon Black" />
                <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Safari Emerald" />
                <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white shadow-xs" title="Rift Orange" />
              </div>
            </div>
          </div>

          {/* Right 1/3 Side Cards Column */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {/* Top Active Order Card */}
            <div 
              onClick={() => {
                setProfileModalTab('orders');
                setIsProfileModalOpen(true);
              }}
              className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:border-emerald-300 transition-colors shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                    Active Order • M-Pesa
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">
                  {latestOrder ? latestOrder.orderNumber : 'Order #SK-29401'}
                </h3>
                <p className="text-sm text-emerald-700/80">
                  Status: {latestOrder ? latestOrder.status.toUpperCase() : 'Dispatched for delivery'}
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl flex items-center justify-between border border-emerald-200 shadow-xs mt-4">
                <span className="text-xs font-semibold text-slate-500 tracking-tight">ESTIMATED ARRIVAL</span>
                <span className="font-black text-slate-900 text-xs sm:text-sm font-mono">
                  {latestOrder ? latestOrder.estimatedDelivery.toUpperCase() : 'TODAY 4:00 PM'}
                </span>
              </div>
            </div>

            {/* Bottom Favorites Card */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900">Favorites</h3>
                <span className="text-slate-400 font-normal text-sm font-mono">
                  {favorites.length} Items
                </span>
              </div>

              {/* Thumbnails Preview */}
              <div className="flex gap-2 overflow-hidden py-1">
                {favoritedShoesList.slice(0, 3).map((fShoe) => (
                  <div
                    key={fShoe.id}
                    onClick={() => openShoeDetail(fShoe)}
                    className="w-14 h-14 bg-slate-900 rounded-lg shrink-0 border border-slate-200 overflow-hidden cursor-pointer hover:border-slate-400 transition-colors"
                  >
                    <ShoePlaceholderMockup
                      silhouette={fShoe.silhouette}
                      primaryColor={fShoe.colors[0]}
                      aspectRatio="1:1"
                      wireframeOnly={false}
                      showTechnicalDetails={false}
                    />
                  </div>
                ))}

                {favorites.length > 3 && (
                  <div 
                    onClick={() => {
                      setProfileModalTab('favorites');
                      setIsProfileModalOpen(true);
                    }}
                    className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0 cursor-pointer"
                  >
                    +{favorites.length - 3}
                  </div>
                )}

                {favorites.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-2">
                    Click the heart icon on any shoe to save it here.
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  setProfileModalTab('favorites');
                  setIsProfileModalOpen(true);
                }}
                className="w-full mt-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Manage Wishlist
              </button>
            </div>
          </div>
        </section>

        {/* Secondary 4-Card Highlight Row (Professional Polish Design) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickCategories.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                setActiveCategory(item.category as any);
                const catalogEl = document.getElementById('shoes-catalog-results') || document.getElementById('catalog-grid');
                if (catalogEl) {
                  const yOffset = -85;
                  const y = catalogEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="bg-white p-4 border border-slate-200 rounded-xl flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="h-28 bg-slate-900 rounded-lg mb-3 overflow-hidden">
                <ShoePlaceholderMockup
                  silhouette={item.silhouette}
                  primaryColor={item.color}
                  aspectRatio="16:9"
                  wireframeOnly={false}
                  showTechnicalDetails={false}
                />
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">
                    {item.collection}
                  </p>
                  <p className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </p>
                </div>
                <p className="font-black text-emerald-600 text-sm font-mono shrink-0 ml-2">
                  {item.price}
                </p>
              </div>
            </div>
          ))}

          {/* SoleClub M-Pesa Membership Card */}
          <div className="bg-slate-900 p-6 border border-slate-900 rounded-xl flex flex-col justify-center text-center shadow-xs">
            <p className="text-white font-bold text-xl mb-1">Join SoleClub</p>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Earn 10% back on every M-Pesa purchase in Kenya
            </p>
            <button
              onClick={() => {
                loadDemoAccount();
                setProfileModalTab('profile');
                setIsProfileModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Sign Up Free
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};


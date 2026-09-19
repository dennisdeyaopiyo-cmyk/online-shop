import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  ShoppingCart,
  Heart, 
  User, 
  Search, 
  Layers, 
  Check, 
  PhoneCall, 
  Sparkles,
  Zap,
  MapPin,
  Compass,
  ShieldCheck,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { FootwearCategory } from '../types';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    favorites,
    setIsProfileModalOpen,
    setProfileModalTab,
    user,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    mockupWireframeMode,
    setMockupWireframeMode,
    setIsSearchGroundingOpen,
    setIsMapsGroundingOpen,
    isFirestoreSynced,
  } = useStore();

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const categories: { label: string; value: FootwearCategory }[] = [
    { label: 'All Footwear', value: 'all' },
    { label: 'Sneakers', value: 'sneakers' },
    { label: 'Formal Shoes', value: 'formal' },
    { label: 'Boots', value: 'boots' },
    { label: 'Sandals & Slides', value: 'sandals' },
    { label: 'Heels', value: 'heels' },
    { label: 'Casual & Canvas', value: 'casual' },
    { label: 'Sports & Track', value: 'sports' },
  ];

  const scrollToShoes = () => {
    const catalogEl = document.getElementById('shoes-catalog-results') || document.getElementById('catalog-grid');
    if (catalogEl) {
      const yOffset = -85;
      const y = catalogEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToShoes();
  };

  const handleCategoryClick = (categoryVal: FootwearCategory) => {
    setActiveCategory(categoryVal);
    scrollToShoes();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Safaricom M-Pesa & Shipping Notice Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Lipa Na M-Pesa Checkout Partner
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-medium">Same-Day Nairobi Delivery &amp; Countrywide Courier in KES (KSh)</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1 font-mono">
              CURRENCY: <strong className="text-white">KES (KSh)</strong>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Support: 0712-SOLE-KNOT</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar Matching Screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 sm:h-20 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Logo */}
        <div className="shrink-0">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900">
              SOLE<span className="text-amber-500">&amp;</span>KNOTS
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
              KENYA
            </span>
          </a>
        </div>

        {/* Search Bar with Orange Search Button (Exact layout from Screenshot) */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-2 sm:mx-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, brands and categories"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-24 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder:text-slate-400 text-slate-900 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-24 text-slate-400 hover:text-slate-600 text-xs px-2"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 sm:px-5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right Section: Account, Help, Cart from Screenshot */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* User Account Dropdown */}
          <button
            onClick={() => {
              setProfileModalTab(user ? 'profile' : 'login');
              setIsProfileModalOpen(true);
            }}
            className="flex items-center gap-1.5 py-2 px-2 sm:px-3 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <User className="w-5 h-5 text-slate-700" />
            <span className="text-xs font-semibold hidden md:inline">
              {user ? user.name.split(' ')[0] : 'Account'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
          </button>

          {/* Help Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className="flex items-center gap-1.5 py-2 px-2 sm:px-3 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-5 h-5 text-slate-700" />
              <span className="text-xs font-semibold hidden md:inline">Help</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
            </button>

            {isHelpOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in">
                <div className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 mb-2">
                  Customer Assistance
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-2 rounded hover:bg-slate-50 cursor-pointer">
                    <strong className="block text-slate-800">Lipa Na M-Pesa Guide</strong>
                    <span>Paybill 400200 / Express STK Push</span>
                  </div>
                  <div className="p-2 rounded hover:bg-slate-50 cursor-pointer">
                    <strong className="block text-slate-800">Delivery &amp; Pickup</strong>
                    <span>Nairobi same-day &amp; countrywide delivery</span>
                  </div>
                  <div className="p-2 rounded hover:bg-slate-50 cursor-pointer">
                    <strong className="block text-slate-800">Hotline Support</strong>
                    <span className="text-emerald-700 font-mono font-bold">0712-SOLE-KNOT</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Favorites Wishlist */}
          <button
            onClick={() => {
              setProfileModalTab('favorites');
              setIsProfileModalOpen(true);
            }}
            className="relative p-2 text-slate-600 hover:text-rose-600 transition-colors hidden sm:flex cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full absolute top-0 right-0 font-bold">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 py-2 px-2.5 sm:px-3 text-slate-800 hover:text-amber-600 rounded-lg hover:bg-amber-50/60 transition-colors cursor-pointer relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-slate-800" />
              {cartCount > 0 && (
                <span className="w-4 h-4 bg-amber-500 text-white text-[10px] flex items-center justify-center rounded-full absolute -top-2 -right-2 font-bold shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold hidden md:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* Subcategory Pills Bar (Responsive) */}
      <div className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto scrollbar-none py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-max">
          <div className="flex items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryClick(cat.value)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setIsSearchGroundingOpen(true)}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask AI Trends</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setIsMapsGroundingOpen(true)}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nairobi &amp; Kenya Courier Stations</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


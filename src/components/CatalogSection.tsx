import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoeCard } from './ShoeCard';
import { CategoryVisualNav } from './CategoryVisualNav';
import { DealRowSection } from './DealRowSection';
import { SidebarFilter } from './SidebarFilter';
import { FootwearCategory } from '../types';
import { formatKSh } from '../utils/formatters';
import { 
  Search, 
  Send, 
  Check, 
  RotateCcw, 
  Star, 
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck
} from 'lucide-react';

export const CatalogSection: React.FC = () => {
  const {
    shoes,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    activeGender,
    setActiveGender,
  } = useStore();

  // Sidebar filter states matching the user's reference screenshots
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [onlyExpress, setOnlyExpress] = useState<boolean>(false);
  const [onlyOfficialStore, setOnlyOfficialStore] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<(string | number)[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [sellerScore, setSellerScore] = useState<number | null>(null);
  const [priceMin, setPriceMin] = useState<number>(337);
  const [priceMax, setPriceMax] = useState<number>(75000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Available brands in the inventory
  const allBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    shoes.forEach((s) => brandsSet.add(s.brand));
    return Array.from(brandsSet).sort();
  }, [shoes]);

  // Top Selling Deals & Under 600 Bob products
  const topSellingSneakers = useMemo(
    () => shoes.filter((s) => s.isTopSellerSneaker || (s.category === 'sneakers' && s.originalPriceKsh)),
    [shoes]
  );

  const under600BobShoes = useMemo(
    () => shoes.filter((s) => s.priceKsh <= 600 || s.isTopDealUnder600),
    [shoes]
  );

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Toggle size selection
  const toggleSize = (size: string | number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Toggle gender selection
  const toggleGender = (gender: string) => {
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  // Apply price filter
  const handleApplyPrice = (min: number, max: number) => {
    setPriceMin(min);
    setPriceMax(max);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setActiveCategory('all');
    setActiveGender('all');
    setSelectedBrands([]);
    setOnlyExpress(false);
    setOnlyOfficialStore(false);
    setMinRating(null);
    setSelectedSizes([]);
    setSelectedGenders([]);
    setSellerScore(null);
    setPriceMin(337);
    setPriceMax(75000);
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters =
    activeCategory !== 'all' ||
    activeGender !== 'all' ||
    selectedBrands.length > 0 ||
    onlyExpress ||
    onlyOfficialStore ||
    minRating !== null ||
    selectedSizes.length > 0 ||
    selectedGenders.length > 0 ||
    sellerScore !== null ||
    priceMin > 337 ||
    priceMax < 75000 ||
    searchQuery !== '';

  // Filter products
  const filteredShoes = useMemo(() => {
    return shoes.filter((shoe) => {
      // 0. Active Gender (from visual category cards)
      if (activeGender !== 'all' && shoe.gender !== activeGender && shoe.gender !== 'unisex') {
        return false;
      }

      // 1. Category
      if (activeCategory !== 'all' && shoe.category !== activeCategory) {
        return false;
      }

      // 2. Express Delivery
      if (onlyExpress && !shoe.expressDelivery) {
        return false;
      }

      // 3. Official Store
      if (onlyOfficialStore && !shoe.isOfficialStore) {
        return false;
      }

      // 4. Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(shoe.brand)) {
        return false;
      }

      // 5. Price
      if (shoe.priceKsh < priceMin || shoe.priceKsh > priceMax) {
        return false;
      }

      // 6. Rating
      if (minRating !== null && shoe.rating < minRating) {
        return false;
      }

      // 7. Sizes
      if (selectedSizes.length > 0) {
        const matchesSize = selectedSizes.some((sz) => {
          if (typeof sz === 'number') {
            return shoe.sizes.includes(sz);
          }
          // If string like 'XS' or 'S'
          return shoe.sizes.some((s) => s.toString() === sz);
        });
        if (!matchesSize) return false;
      }

      // 8. Gender
      if (selectedGenders.length > 0) {
        const matchesGender = selectedGenders.some((g) => {
          if (g === 'girls') return shoe.gender === 'kids';
          if (g === 'male' || g === 'men') return shoe.gender === 'men' || shoe.gender === 'unisex';
          if (g === 'women') return shoe.gender === 'women' || shoe.gender === 'unisex';
          if (g === 'unisex') return shoe.gender === 'unisex';
          return false;
        });
        if (!matchesGender) return false;
      }

      // 9. Seller Score
      if (sellerScore !== null) {
        const estimatedScore = shoe.rating >= 4.5 ? 95 : shoe.rating >= 4.0 ? 80 : 60;
        if (estimatedScore < sellerScore) return false;
      }

      // 10. Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = shoe.name.toLowerCase().includes(q);
        const matchBrand = shoe.brand.toLowerCase().includes(q);
        const matchCategory = shoe.category.toLowerCase().includes(q);
        const matchDesc = shoe.description.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchCategory && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [
    shoes,
    activeCategory,
    onlyExpress,
    onlyOfficialStore,
    selectedBrands,
    priceMin,
    priceMax,
    minRating,
    selectedSizes,
    selectedGenders,
    sellerScore,
    searchQuery,
  ]);

  // Sort products
  const sortedShoes = useMemo(() => {
    return [...filteredShoes].sort((a, b) => {
      if (sortBy === 'price-low') return a.priceKsh - b.priceKsh;
      if (sortBy === 'price-high') return b.priceKsh - a.priceKsh;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });
  }, [filteredShoes, sortBy]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeCategory,
    selectedBrands,
    onlyExpress,
    onlyOfficialStore,
    minRating,
    selectedSizes,
    selectedGenders,
    sellerScore,
    priceMin,
    priceMax,
    sortBy,
    searchQuery,
  ]);

  const totalPages = Math.max(1, Math.ceil(sortedShoes.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedShoes = useMemo(() => {
    const startIdx = (safeCurrentPage - 1) * itemsPerPage;
    return sortedShoes.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedShoes, safeCurrentPage, itemsPerPage]);

  const getCategoryTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    if (activeGender !== 'all' && activeCategory === 'all') {
      if (activeGender === 'men') return "Men's Footwear";
      if (activeGender === 'women') return "Women's Footwear";
      if (activeGender === 'kids') return "Kids & Youth Shoes";
    }
    switch (activeCategory) {
      case 'sneakers':
        return activeGender !== 'all' ? `${activeGender === 'men' ? "Men's" : "Women's"} Sneakers` : 'Sneakers & Athletic';
      case 'formal':
        return activeGender !== 'all' ? `${activeGender === 'men' ? "Men's" : "Women's"} Formal Shoes` : 'Formal Shoes';
      case 'boots':
        return activeGender !== 'all' ? `${activeGender === 'men' ? "Men's" : "Women's"} Boots` : 'Boots & Askari Footwear';
      case 'sandals':
        return 'Sandals & Slippers';
      case 'casual':
        return 'Casual Shoes';
      case 'sports':
        return 'Sports Footwear';
      default:
        return 'All Shoes & Footwear';
    }
  };

  const scrollToCatalogResults = () => {
    const el = document.getElementById('shoes-catalog-results') || document.getElementById('catalog-grid');
    if (el) {
      const yOffset = -85;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="catalog-grid" className="py-6 bg-slate-50 min-h-screen">
      {/* 1. Category Visual Cards: Men's, Women's, Boy's, Girl's */}
      <CategoryVisualNav />

      {/* 2. Top Selling Sneaker Deals Carousel */}
      <DealRowSection
        title="Top Selling Sneaker Deals"
        subtitle="Up to 55% off bestselling athletic and lifestyle footwear"
        badgeText="FESTIVAL DEALS"
        shoes={topSellingSneakers}
        iconType="flame"
        onViewAll={() => {
          setActiveCategory('sneakers');
          scrollToCatalogResults();
        }}
      />

      {/* 3. Top Deals | Under 600 Bob */}
      <DealRowSection
        title="Top Deals | Under 600 Bob"
        subtitle="Everyday affordable footwear priced strictly under KSh 600"
        badgeText="BUDGET FRIENDLY"
        shoes={under600BobShoes}
        iconType="tag"
        onViewAll={() => {
          setPriceMax(600);
          scrollToCatalogResults();
        }}
      />

      {/* 4. Main Footwear Catalog with Sidebar & Grid */}
      <div id="shoes-catalog-results" className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 scroll-mt-24">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Desktop Left Filter Sidebar matching screenshots */}
          <aside className="hidden lg:block w-[260px] shrink-0 sticky top-20">
            <SidebarFilter
              activeCategory={activeCategory}
              onSelectCategory={(c) => {
                setActiveCategory(c as FootwearCategory);
                scrollToCatalogResults();
              }}
              onlyExpress={onlyExpress}
              onToggleExpress={setOnlyExpress}
              allBrands={allBrands}
              selectedBrands={selectedBrands}
              onToggleBrand={toggleBrand}
              minPrice={priceMin}
              maxPrice={priceMax}
              onApplyPrice={handleApplyPrice}
              minRating={minRating}
              onSelectRating={setMinRating}
              selectedSizes={selectedSizes}
              onToggleSize={toggleSize}
              selectedGenders={selectedGenders}
              onToggleGender={toggleGender}
              sellerScore={sellerScore}
              onSelectSellerScore={setSellerScore}
              onlyOfficialStore={onlyOfficialStore}
              onToggleOfficialStore={setOnlyOfficialStore}
              hasActiveFilters={hasActiveFilters}
              onResetAll={resetAllFilters}
            />
          </aside>

          {/* Mobile Filter Drawer Modal */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-4 overflow-y-auto z-10">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                    Filters
                  </h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full text-slate-500 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <SidebarFilter
                  activeCategory={activeCategory}
                  onSelectCategory={(c) => {
                    setActiveCategory(c as FootwearCategory);
                    setIsMobileFilterOpen(false);
                    scrollToCatalogResults();
                  }}
                  onlyExpress={onlyExpress}
                  onToggleExpress={setOnlyExpress}
                  allBrands={allBrands}
                  selectedBrands={selectedBrands}
                  onToggleBrand={toggleBrand}
                  minPrice={priceMin}
                  maxPrice={priceMax}
                  onApplyPrice={handleApplyPrice}
                  minRating={minRating}
                  onSelectRating={setMinRating}
                  selectedSizes={selectedSizes}
                  onToggleSize={toggleSize}
                  selectedGenders={selectedGenders}
                  onToggleGender={toggleGender}
                  sellerScore={sellerScore}
                  onSelectSellerScore={setSellerScore}
                  onlyOfficialStore={onlyOfficialStore}
                  onToggleOfficialStore={setOnlyOfficialStore}
                  hasActiveFilters={hasActiveFilters}
                  onResetAll={resetAllFilters}
                />
                <div className="pt-4 sticky bottom-0 bg-white border-t border-slate-200 mt-4">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs tracking-wider uppercase shadow-md cursor-pointer"
                  >
                    Show {sortedShoes.length} Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 w-full">
            {/* Catalog Top Bar */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 mb-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{getCategoryTitle()}</span>
                    <span className="text-xs sm:text-sm font-normal text-slate-500">
                      ({sortedShoes.length} products found)
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authentic footwear with M-Pesa instant payment and fast delivery in Kenya
                  </p>
                </div>

                {/* Mobile Filter Button & Sort Selector */}
                <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center">
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 hover:bg-slate-100 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                    <span>Filter</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                      Sort by:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="featured">Popularity</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Customer Rating</option>
                      <option value="newest">Newest Arrivals</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filter Pills Bar */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400">Active filters:</span>
                  {activeCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs capitalize">
                      <span>Category: {activeCategory}</span>
                      <button onClick={() => setActiveCategory('all')} className="cursor-pointer">
                        <X className="w-3 h-3 text-white hover:text-slate-200" />
                      </button>
                    </span>
                  )}
                  {activeGender !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold capitalize">
                      <span>Gender: {activeGender}</span>
                      <button onClick={() => setActiveGender('all')} className="cursor-pointer">
                        <X className="w-3 h-3 hover:text-amber-950" />
                      </button>
                    </span>
                  )}
                  {onlyExpress && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      <Send className="w-3 h-3 fill-amber-600 -rotate-45" />
                      <span>EXPRESS</span>
                      <button onClick={() => setOnlyExpress(false)}>
                        <X className="w-3 h-3 hover:text-amber-900" />
                      </button>
                    </span>
                  )}
                  {onlyOfficialStore && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      <span>Official Store</span>
                      <button onClick={() => setOnlyOfficialStore(false)}>
                        <X className="w-3 h-3 hover:text-blue-900" />
                      </button>
                    </span>
                  )}
                  {selectedBrands.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-0.5 rounded-full font-medium"
                    >
                      <span>{b}</span>
                      <button onClick={() => toggleBrand(b)}>
                        <X className="w-3 h-3 hover:text-slate-950" />
                      </button>
                    </span>
                  ))}
                  {selectedSizes.map((sz) => (
                    <span
                      key={sz}
                      className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-0.5 rounded-full font-medium"
                    >
                      <span>Size: {sz}</span>
                      <button onClick={() => toggleSize(sz)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedGenders.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-0.5 rounded-full font-medium capitalize"
                    >
                      <span>{g}</span>
                      <button onClick={() => toggleGender(g)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {minRating !== null && (
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      <span>{minRating}★ & above</span>
                      <button onClick={() => setMinRating(null)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {sellerScore !== null && (
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      <span>Seller: {sellerScore}%+</span>
                      <button onClick={() => setSellerScore(null)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={resetAllFilters}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold ml-auto cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {sortedShoes.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No footwear matched your active filters
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try broadening your price range, clearing brand selections, or resetting search filters.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                  {paginatedShoes.map((shoe) => (
                    <ShoeCard key={shoe.id} shoe={shoe} />
                  ))}
                </div>

                {/* Pagination Controls matching screenshot: |<  <  1  2  3  >  >| */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10 pt-6 border-t border-slate-200 select-none">
                    <button
                      onClick={() => {
                        setCurrentPage(1);
                        document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      disabled={safeCurrentPage === 1}
                      className={`min-w-9 h-9 px-2.5 rounded-md border flex items-center justify-center text-xs font-semibold transition-colors ${
                        safeCurrentPage === 1
                          ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 cursor-pointer bg-white'
                      }`}
                      title="First Page"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(1, prev - 1));
                        document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      disabled={safeCurrentPage === 1}
                      className={`min-w-9 h-9 px-2.5 rounded-md border flex items-center justify-center text-xs font-semibold transition-colors ${
                        safeCurrentPage === 1
                          ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 cursor-pointer bg-white'
                      }`}
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isCurrent = pageNum === safeCurrentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`min-w-9 h-9 px-3 rounded-md border text-xs font-bold transition-all cursor-pointer ${
                            isCurrent
                              ? 'border-amber-500 text-amber-600 bg-amber-50/70 shadow-xs'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 bg-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                        document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      disabled={safeCurrentPage === totalPages}
                      className={`min-w-9 h-9 px-2.5 rounded-md border flex items-center justify-center text-xs font-semibold transition-colors ${
                        safeCurrentPage === totalPages
                          ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 cursor-pointer bg-white'
                      }`}
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage(totalPages);
                        document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      disabled={safeCurrentPage === totalPages}
                      className={`min-w-9 h-9 px-2.5 rounded-md border flex items-center justify-center text-xs font-semibold transition-colors ${
                        safeCurrentPage === totalPages
                          ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 cursor-pointer bg-white'
                      }`}
                      title="Last Page"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

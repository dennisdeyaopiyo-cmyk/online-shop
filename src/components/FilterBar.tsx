import React from 'react';
import { useStore } from '../context/StoreContext';
import { FootwearGender } from '../types';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { formatKSh } from '../utils/formatters';

export const FilterBar: React.FC = () => {
  const {
    activeGender,
    setActiveGender,
    selectedSize,
    setSelectedSize,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const genders: { label: string; value: FootwearGender }[] = [
    { label: 'All Footwear', value: 'all' },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex', value: 'unisex' },
    { label: 'Kids', value: 'kids' },
  ];

  const commonSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

  const hasActiveFilters = 
    activeCategory !== 'all' || 
    activeGender !== 'all' || 
    selectedSize !== null || 
    priceRange[1] < 15000 || 
    searchQuery !== '';

  const resetFilters = () => {
    setActiveCategory('all');
    setActiveGender('all');
    setSelectedSize(null);
    setPriceRange([0, 15000]);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="bg-white border-y border-slate-200 py-3 px-4 sm:px-8 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Gender / Audience Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline-block">
            Target:
          </span>
          {genders.map((g) => (
            <button
              key={g.value}
              onClick={() => setActiveGender(g.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                activeGender === g.value
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Sizes Quick Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline-block">
            EU Size:
          </span>
          {commonSizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(isSelected ? null : size)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* Sort & Price Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
              Max Price:
            </span>
            <input
              type="range"
              min="3000"
              max="15000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-24 sm:w-28 accent-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
              {formatKSh(priceRange[1])}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400 font-medium"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

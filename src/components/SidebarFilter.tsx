import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Star, 
  Info, 
  Send, 
  Check, 
  ChevronUp, 
  ChevronDown,
  RotateCcw
} from 'lucide-react';

export interface SidebarFilterProps {
  // Category
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  // Express Delivery
  onlyExpress: boolean;
  onToggleExpress: (val: boolean) => void;
  // Brands
  allBrands: string[];
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  // Price Range
  minPrice: number;
  maxPrice: number;
  onApplyPrice: (min: number, max: number) => void;
  // Rating
  minRating: number | null;
  onSelectRating: (rating: number | null) => void;
  // Size
  selectedSizes: (string | number)[];
  onToggleSize: (size: string | number) => void;
  // Gender
  selectedGenders: string[];
  onToggleGender: (gender: string) => void;
  // Seller Score
  sellerScore: number | null;
  onSelectSellerScore: (score: number | null) => void;
  // Official Stores
  onlyOfficialStore: boolean;
  onToggleOfficialStore: (val: boolean) => void;
  // Reset
  hasActiveFilters: boolean;
  onResetAll: () => void;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  activeCategory,
  onSelectCategory,
  onlyExpress,
  onToggleExpress,
  allBrands,
  selectedBrands,
  onToggleBrand,
  minPrice,
  maxPrice,
  onApplyPrice,
  minRating,
  onSelectRating,
  selectedSizes,
  onToggleSize,
  selectedGenders,
  onToggleGender,
  sellerScore,
  onSelectSellerScore,
  onlyOfficialStore,
  onToggleOfficialStore,
  hasActiveFilters,
  onResetAll,
}) => {
  // Brand search
  const [brandSearch, setBrandSearch] = useState('');
  // Size search
  const [sizeSearch, setSizeSearch] = useState('');

  // Local price input state matching screenshot (default min 337, max 75000)
  const [tempMin, setTempMin] = useState<number>(minPrice || 337);
  const [tempMax, setTempMax] = useState<number>(maxPrice || 75000);

  // List of all popular brands matching user screenshots
  const brandList = useMemo(() => {
    const defaultBrands = [
      'City Sneakers',
      'Classic',
      'Conver',
      'Converse',
      'Creative Casuals',
      'D&C',
      '247 Shoes',
      'AB new fashion 520',
      'ADIDAS',
      'ALagzi',
      'BLWOENS',
      'CFZIYOU',
      'FUXING FASHION',
      'SXCHEN',
      'UMOJA',
      'VANHUHU',
      'Waanzilish',
      'AeroKicks',
    ];
    const combined = Array.from(new Set([...defaultBrands, ...allBrands]));
    if (!brandSearch.trim()) return combined;
    return combined.filter((b) =>
      b.toLowerCase().includes(brandSearch.toLowerCase().trim())
    );
  }, [allBrands, brandSearch]);

  // Sizes matching screenshots: XS, S, 30, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45
  const sizeList: (string | number)[] = useMemo(() => {
    const defaultSizes: (string | number)[] = [
      'XS',
      'S',
      30,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
    ];
    if (!sizeSearch.trim()) return defaultSizes;
    return defaultSizes.filter((s) =>
      s.toString().toLowerCase().includes(sizeSearch.toLowerCase().trim())
    );
  }, [sizeSearch]);

  // Gender options matching screenshots
  const genderOptions = [
    { id: 'girls', label: 'Girls' },
    { id: 'male', label: 'Male' },
    { id: 'men', label: 'Men' },
    { id: 'unisex', label: 'Unisex' },
    { id: 'women', label: 'Women' },
  ];

  // Seller score options matching screenshot
  const sellerScoreOptions = [
    { id: 80, label: '80% or more' },
    { id: 60, label: '60% or more' },
    { id: 40, label: '40% or more' },
    { id: 20, label: '20% or more' },
  ];

  const handleApplyClick = () => {
    onApplyPrice(tempMin, tempMax);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 text-slate-900 font-sans shadow-xs p-4 sm:p-5 select-none">
      {/* 1. CATEGORY */}
      <div className="pb-4 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          CATEGORY
        </h3>
        <div className="pl-2 space-y-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`text-sm hover:underline cursor-pointer block w-full text-left py-0.5 ${
              activeCategory === 'all'
                ? 'font-bold text-amber-600'
                : 'text-slate-800'
            }`}
          >
            Fashion
          </button>
          <div className="pl-3 border-l-2 border-slate-200 ml-1.5 space-y-1 mt-1">
            <button
              type="button"
              onClick={() => onSelectCategory('boots')}
              className={`text-xs hover:underline cursor-pointer flex items-center justify-between w-full py-0.5 transition-colors ${
                activeCategory === 'boots'
                  ? 'font-bold text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Boots</span>
              {activeCategory === 'boots' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('sneakers')}
              className={`text-xs hover:underline cursor-pointer flex items-center justify-between w-full py-0.5 transition-colors ${
                activeCategory === 'sneakers'
                  ? 'font-bold text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Sneakers</span>
              {activeCategory === 'sneakers' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('formal')}
              className={`text-xs hover:underline cursor-pointer flex items-center justify-between w-full py-0.5 transition-colors ${
                activeCategory === 'formal'
                  ? 'font-bold text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Formal Shoes</span>
              {activeCategory === 'formal' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('sandals')}
              className={`text-xs hover:underline cursor-pointer flex items-center justify-between w-full py-0.5 transition-colors ${
                activeCategory === 'sandals'
                  ? 'font-bold text-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Sandals & Slides</span>
              {activeCategory === 'sandals' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXPRESS DELIVERY (Strictly NO Jumia word, with info circle icon) */}
      <div className="py-4 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          EXPRESS DELIVERY
        </h3>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            {/* Square checkbox matching screenshot */}
            <div
              className={`w-[18px] h-[18px] rounded-[3px] border-2 flex items-center justify-center transition-colors ${
                onlyExpress
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-slate-800 bg-white group-hover:border-slate-900'
              }`}
            >
              {onlyExpress && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <input
              type="checkbox"
              checked={onlyExpress}
              onChange={(e) => onToggleExpress(e.target.checked)}
              className="sr-only"
            />
            {/* EXPRESS logo styling */}
            <div className="flex items-center gap-1 font-black text-sm tracking-tight text-amber-600">
              <Send className="w-3.5 h-3.5 fill-amber-600 -rotate-45" />
              <span className="italic font-extrabold tracking-normal">EXPRESS</span>
            </div>
          </label>

          <div
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
            title="Fast dispatch and priority delivery across Kenya"
          >
            <Info className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. BRAND (Search pill + checkboxes with scroll) */}
      <div className="py-4 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          BRAND
        </h3>
        {/* Pill Search Input matching screenshot */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5 pointer-events-none stroke-[2.2]" />
          <input
            type="text"
            placeholder="Search"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-full focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Checkbox List with Scrollbar */}
        <div className="relative">
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin">
            {brandList.map((brand) => {
              const checked = selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 cursor-pointer group select-none py-0.5"
                >
                  <div
                    className={`w-[18px] h-[18px] shrink-0 rounded-[3px] border-2 flex items-center justify-center transition-colors ${
                      checked
                        ? 'border-amber-500 bg-amber-500 text-white'
                        : 'border-slate-800 bg-white group-hover:border-slate-900'
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleBrand(brand)}
                    className="sr-only"
                  />
                  <span className="text-xs sm:text-[13px] text-slate-800 group-hover:text-slate-900 font-normal truncate">
                    {brand}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. PRICE (KSH) with orange Apply button and dual slider track */}
      <div className="py-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            PRICE (KSH)
          </h3>
          <button
            type="button"
            onClick={handleApplyClick}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
          >
            Apply
          </button>
        </div>

        {/* Dual circular thumbs orange slider track */}
        <div className="relative py-2 px-1">
          <div className="relative h-1.5 bg-amber-500 rounded-full flex items-center justify-between">
            <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-xs -ml-1 cursor-grab" />
            <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-xs -mr-1 cursor-grab" />
          </div>
        </div>

        {/* Two inputs with hyphen in between matching screenshot: [ 337 ] - [ 75000 ] */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            value={tempMin}
            onChange={(e) => setTempMin(Number(e.target.value))}
            className="w-full text-center py-1.5 px-2 border border-slate-300 rounded-md text-xs text-slate-800 font-sans focus:outline-none focus:border-amber-500"
            placeholder="337"
          />
          <span className="text-slate-500 font-medium">-</span>
          <input
            type="number"
            value={tempMax}
            onChange={(e) => setTempMax(Number(e.target.value))}
            className="w-full text-center py-1.5 px-2 border border-slate-300 rounded-md text-xs text-slate-800 font-sans focus:outline-none focus:border-amber-500"
            placeholder="75000"
          />
        </div>
      </div>

      {/* 5. PRODUCT RATING (Circular radio buttons with stars & above) */}
      <div className="py-4 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          PRODUCT RATING
        </h3>
        <div className="space-y-2.5">
          {[4, 3, 2, 1].map((r) => {
            const isSelected = minRating === r;
            return (
              <label
                key={r}
                onClick={() => onSelectRating(isSelected ? null : r)}
                className="flex items-center gap-2.5 cursor-pointer group py-0.5"
              >
                {/* Round radio circle matching screenshot */}
                <div
                  className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-slate-900 bg-white'
                      : 'border-slate-800 bg-white group-hover:border-slate-900'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                  )}
                </div>

                {/* Stars and text matching screenshot */}
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-800 ml-1">& above</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. SIZE (Search pill + Checkboxes list) */}
      <div className="py-4 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          SIZE
        </h3>
        {/* Pill Search Input matching screenshot */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5 pointer-events-none stroke-[2.2]" />
          <input
            type="text"
            placeholder="Search"
            value={sizeSearch}
            onChange={(e) => setSizeSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-full focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Checkbox List with Scrollbar */}
        <div className="max-h-48 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin">
          {sizeList.map((sz) => {
            const checked = selectedSizes.includes(sz);
            return (
              <label
                key={sz}
                className="flex items-center gap-2.5 cursor-pointer group select-none py-0.5"
              >
                <div
                  className={`w-[18px] h-[18px] shrink-0 rounded-[3px] border-2 flex items-center justify-center transition-colors ${
                    checked
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-slate-800 bg-white group-hover:border-slate-900'
                  }`}
                >
                  {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleSize(sz)}
                  className="sr-only"
                />
                <span className="text-xs sm:text-[13px] text-slate-800 group-hover:text-slate-900 font-normal">
                  {sz}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 7. GENDER (Checkboxes: Girls, Male, Men, Unisex, Women) */}
      <div className="py-4 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          GENDER
        </h3>
        <div className="space-y-2">
          {genderOptions.map((g) => {
            const checked = selectedGenders.includes(g.id);
            return (
              <label
                key={g.id}
                className="flex items-center gap-2.5 cursor-pointer group select-none py-0.5"
              >
                <div
                  className={`w-[18px] h-[18px] shrink-0 rounded-[3px] border-2 flex items-center justify-center transition-colors ${
                    checked
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-slate-800 bg-white group-hover:border-slate-900'
                  }`}
                >
                  {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleGender(g.id)}
                  className="sr-only"
                />
                <span className="text-xs sm:text-[13px] text-slate-800 group-hover:text-slate-900 font-normal">
                  {g.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 8. SELLER SCORE (Radio buttons: 80% or more, 60% or more, etc.) */}
      <div className="py-4 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          SELLER SCORE
        </h3>
        <div className="space-y-2.5">
          {sellerScoreOptions.map((opt) => {
            const isSelected = sellerScore === opt.id;
            return (
              <label
                key={opt.id}
                onClick={() => onSelectSellerScore(isSelected ? null : opt.id)}
                className="flex items-center gap-2.5 cursor-pointer group py-0.5"
              >
                <div
                  className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-slate-900 bg-white'
                      : 'border-slate-800 bg-white group-hover:border-slate-900'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                  )}
                </div>
                <span className="text-xs sm:text-[13px] text-slate-800 group-hover:text-slate-900 font-normal">
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 9. OFFICIAL STORES ([ ] Only Official Store) */}
      <div className="pt-4 pb-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          OFFICIAL STORES
        </h3>
        <label className="flex items-center gap-2.5 cursor-pointer group select-none py-0.5">
          <div
            className={`w-[18px] h-[18px] shrink-0 rounded-[3px] border-2 flex items-center justify-center transition-colors ${
              onlyOfficialStore
                ? 'border-amber-500 bg-amber-500 text-white'
                : 'border-slate-800 bg-white group-hover:border-slate-900'
            }`}
          >
            {onlyOfficialStore && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <input
            type="checkbox"
            checked={onlyOfficialStore}
            onChange={(e) => onToggleOfficialStore(e.target.checked)}
            className="sr-only"
          />
          <span className="text-xs sm:text-[13px] text-slate-800 group-hover:text-slate-900 font-normal">
            Only Official Store
          </span>
        </label>
      </div>

      {/* Reset all button if any filters are active */}
      {hasActiveFilters && (
        <div className="pt-4 mt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onResetAll}
            className="w-full py-2 px-3 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useStore } from '../context/StoreContext';
import { FootwearGender, FootwearCategory } from '../types';

interface CategoryItem {
  label: string;
  category?: FootwearCategory;
  gender?: FootwearGender;
  imageUrl: string;
  itemCount: string;
}

export const CategoryVisualNav: React.FC = () => {
  const { setActiveGender, activeGender, setActiveCategory, activeCategory } = useStore();

  const categories: CategoryItem[] = [
    {
      label: "Boots",
      category: 'boots',
      imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&auto=format&fit=crop&q=80',
      itemCount: '25+ styles',
    },
    {
      label: "Sneakers",
      category: 'sneakers',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
      itemCount: '120+ styles',
    },
    {
      label: "Men's",
      gender: 'men',
      imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400&auto=format&fit=crop&q=80',
      itemCount: '180+ styles',
    },
    {
      label: "Women's",
      gender: 'women',
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=80',
      itemCount: '140+ styles',
    },
    {
      label: "Boy's",
      gender: 'kids',
      imageUrl: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&auto=format&fit=crop&q=80',
      itemCount: '45+ styles',
    },
    {
      label: "Girl's",
      gender: 'kids',
      imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&auto=format&fit=crop&q=80',
      itemCount: '50+ styles',
    },
  ];

  const handleSelect = (item: CategoryItem) => {
    if (item.category) {
      setActiveCategory(item.category);
      setActiveGender('all');
    } else if (item.gender) {
      setActiveGender(activeGender === item.gender ? 'all' : item.gender);
      setActiveCategory('all');
    }

    // Smooth scroll directly to the shoes catalog results with sticky header offset
    const catalogElem = document.getElementById('shoes-catalog-results') || document.getElementById('catalog-grid');
    if (catalogElem) {
      const yOffset = -85;
      const y = catalogElem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = 
            (cat.category && activeCategory === cat.category) ||
            (cat.gender && !cat.category && activeGender === cat.gender && activeCategory === 'all');

          return (
            <button
              type="button"
              key={cat.label}
              onClick={() => handleSelect(cat)}
              className={`group flex flex-col items-center bg-white rounded-2xl p-3 sm:p-4 border transition-all duration-300 cursor-pointer text-left w-full ${
                isSelected
                  ? 'border-amber-500 shadow-md ring-2 ring-amber-400/30'
                  : 'border-slate-200/80 hover:border-slate-300 hover:shadow-lg'
              }`}
            >
              {/* Product Visual */}
              <div className="w-full aspect-4/3 sm:aspect-square rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center p-2 mb-2">
                <img
                  src={cat.imageUrl}
                  alt={cat.label}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Title & Count */}
              <div className="text-center w-full">
                <h4 className={`text-xs sm:text-sm font-bold transition-colors ${
                  isSelected ? 'text-amber-600' : 'text-slate-900 group-hover:text-amber-600'
                }`}>
                  {cat.label}
                </h4>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block">
                  {cat.itemCount}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

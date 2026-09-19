import React, { useRef } from 'react';
import { Shoe } from '../types';
import { ShoeCard } from './ShoeCard';
import { ChevronLeft, ChevronRight, Flame, Tag } from 'lucide-react';

interface DealRowSectionProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  shoes: Shoe[];
  iconType?: 'flame' | 'tag';
  onViewAll?: () => void;
}

export const DealRowSection: React.FC<DealRowSectionProps> = ({
  title,
  subtitle,
  badgeText,
  shoes,
  iconType = 'flame',
  onViewAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (shoes.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              {iconType === 'flame' ? (
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              ) : (
                <Tag className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {title}
                </h3>
                {badgeText && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {badgeText}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Carousel Arrow Controls & View All */}
          <div className="flex items-center gap-3">
            {onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>View All In Shoes</span>
                <span className="text-sm">→</span>
              </button>
            )}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Products Strip */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pt-5 pb-2 scrollbar-none scroll-smooth"
        >
          {shoes.map((shoe) => (
            <div
              key={shoe.id}
              className="w-[220px] sm:w-[250px] shrink-0 flex flex-col"
            >
              <ShoeCard shoe={shoe} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

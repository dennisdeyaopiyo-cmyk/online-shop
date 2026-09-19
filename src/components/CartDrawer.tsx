import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatKSh } from '../utils/formatters';
import { ShoePlaceholderMockup } from './ShoePlaceholderMockup';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Zap,
  Sparkles 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalKsh,
    deliveryFeeKsh,
    cartTotalKsh,
    cartCount,
    setIsCheckoutModalOpen,
    mockupWireframeMode,
  } = useStore();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 6000;
  const distanceToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotalKsh);
  const freeShippingProgress = Math.min(100, (cartSubtotalKsh / FREE_SHIPPING_THRESHOLD) * 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-900" />
            <h2 className="font-bold text-slate-900 text-base">
              Your Bag ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator for Kenya */}
        <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100 text-xs">
          <div className="flex items-center justify-between text-emerald-950 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-700" />
              {distanceToFreeShipping === 0 ? (
                <strong className="text-emerald-800">You unlocked FREE Nairobi Express Delivery!</strong>
              ) : (
                <span>
                  Add <strong>{formatKSh(distanceToFreeShipping)}</strong> for Free Nairobi Delivery
                </span>
              )}
            </span>
            <span className="font-mono font-bold text-emerald-800">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-emerald-200 overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Your shopping bag is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Browse our collection of sneakers, formal shoes, boots, and sandals to get started.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all"
              >
                {/* Thumbnail Mockup */}
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-900">
                  <ShoePlaceholderMockup
                    silhouette={item.shoe.silhouette}
                    primaryColor={item.selectedColor}
                    aspectRatio="1:1"
                    wireframeOnly={mockupWireframeMode}
                    showTechnicalDetails={false}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.shoe.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                      <span>Size: EU {item.selectedSize}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full border border-slate-300"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span>{item.selectedColor.name}</span>
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1 text-slate-600 hover:bg-slate-200 rounded-l cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1 text-slate-600 hover:bg-slate-200 rounded-r cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-black text-xs text-emerald-600">
                      {formatKSh(item.shoe.priceKsh * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartCount} items):</span>
                <span className="font-mono font-semibold">{formatKSh(cartSubtotalKsh)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery (Kenya):</span>
                <span className="font-mono font-semibold">
                  {deliveryFeeKsh === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatKSh(deliveryFeeKsh)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="font-mono text-base font-black text-emerald-600">
                  {formatKSh(cartTotalKsh)}
                </span>
              </div>
            </div>

            {/* M-Pesa Express Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Checkout with M-Pesa ({formatKSh(cartTotalKsh)})</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <p className="text-[10px] text-center text-slate-500 font-mono">
              🔒 Instant Safaricom M-Pesa STK Push • Safe &amp; Direct
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

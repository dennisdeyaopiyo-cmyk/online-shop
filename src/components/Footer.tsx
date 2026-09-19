import React from 'react';
import { ShieldCheck, Truck, Smartphone, Heart, ArrowUp, PhoneCall, Mail, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveCategory } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Upper Features Bar */}
      <div className="border-b border-slate-850 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">M-Pesa STK Push</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Seamless mobile authorization prompt on your Safaricom line. Fast and secure.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Kenya-Wide Express</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Same-day rider dispatch across Nairobi &amp; 24-48h parcel transit countrywide.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Kenyan Shillings (KSh)</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                All prices transparent in KSh with zero hidden forex exchange fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Profile Wishlist &amp; Tracking</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Login, track your order receipts, and save your favorites in real time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black font-mono flex items-center justify-center text-sm shadow-xs">
                KF
              </div>
              <span className="text-white font-extrabold text-base tracking-tight">
                KICKS KENYA
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Kenya's premier destination for all types of footwear: running sneakers, bespoke leather brogues, Chelsea boots, ergonomic slides, and durable children shoes.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1 font-mono">
              <div className="text-white font-bold">LIPA NA M-PESA OFFICIAL:</div>
              <div className="text-emerald-400 font-semibold">Buy Goods Till No: 938210</div>
              <div className="text-slate-400">Paybill Business No: 400200</div>
            </div>
          </div>

          {/* Quick Category Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Footwear Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveCategory('sneakers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Marathon &amp; Lifestyle Sneakers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('formal')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Goodyear-Welted Oxford Brogues
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('boots')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All-Weather Chelsea &amp; Alpine Boots
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('sandals')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Natural Cork Bed Slides
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('heels')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Architectural Block Heels &amp; Pumps
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('sports')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Carbon-Plate Track &amp; Trail Kicks
                </button>
              </li>
            </ul>
          </div>

          {/* Delivery Hubs in Kenya */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Kenya Dispatch Locations
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Nairobi CBD &amp; Westlands Hub</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Mombasa Coastal Delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Kisumu &amp; Lake Region Courier</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Nakuru &amp; Rift Valley Express</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Eldoret &amp; North Rift Center</span>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Help &amp; Orders
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+254 712 000 888</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>orders@kickskenya.co.ke</span>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-mono border border-slate-800 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Copyright & Design Mockup Notice */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} Footwear Store Kenya (Kicks Kenya). All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>DESIGN MOCKUP ASSETS ENGINE • KES / KSH CURRENCY ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

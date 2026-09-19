/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { ShoeDetailModal } from './components/ShoeDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { MpesaCheckoutModal } from './components/MpesaCheckoutModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SearchGroundingModal } from './components/SearchGroundingModal';
import { MapsGroundingModal } from './components/MapsGroundingModal';

export default function App() {
  return (
    <StoreProvider>
      <div id="top" className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
        {/* Navigation Bar */}
        <Navbar />

        {/* Hero Section */}
        <HeroBanner />

        {/* Footwear Catalog & Filtering */}
        <main className="flex-1">
          <CatalogSection />
        </main>

        {/* Store Footer */}
        <Footer />

        {/* Global Drawers & Modals */}
        <ShoeDetailModal />
        <CartDrawer />
        <MpesaCheckoutModal />
        <UserProfileModal />
        <SearchGroundingModal />
        <MapsGroundingModal />
      </div>
    </StoreProvider>
  );
}


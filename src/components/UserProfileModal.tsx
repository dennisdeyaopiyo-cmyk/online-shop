import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatKSh, formatDate } from '../utils/formatters';
import { ShoePlaceholderMockup } from './ShoePlaceholderMockup';
import { 
  X, 
  User, 
  Package, 
  Heart, 
  LogOut, 
  MapPin, 
  Phone, 
  Mail, 
  ShoppingBag, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Receipt,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    profileModalTab,
    setProfileModalTab,
    user,
    orders,
    favorites,
    shoes,
    login,
    register,
    logout,
    updateProfile,
    loadDemoAccount,
    signInWithGoogle,
    signOutFirebase,
    isAuthLoading,
    isFirestoreSynced,
    addToCart,
    toggleFavorite,
    openShoeDetail,
    mockupWireframeMode,
  } = useStore();

  if (!isProfileModalOpen) return null;

  // Edit Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [county, setCounty] = useState(user?.county || 'Nairobi');
  const [town, setTown] = useState(user?.town || 'Westlands');
  const [defaultAddress, setDefaultAddress] = useState(user?.defaultAddress || '');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Login/Register Form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authCounty, setAuthCounty] = useState('Nairobi');

  const favoritedShoes = shoes.filter((s) => favorites.includes(s.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      county,
      town,
      defaultAddress,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      login(authEmail, authEmail.split('@')[0]);
    } else {
      register(authName, authEmail, authPhone, authCounty, 'Nairobi');
    }
    setProfileModalTab('profile');
  };

  const kenyaCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 
    'Machakos', 'Uasin Gishu (Eldoret)', 'Kajiado', 'Kilifi', 'Nyeri'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border border-emerald-500 object-cover" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-sm">
                {user ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  {user ? user.name : 'Customer Account'}
                </h3>
                {isFirestoreSynced && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Firestore Synced
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {user ? `${user.email} • Kenya` : 'Login or Create an Account'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-semibold overflow-x-auto scrollbar-none">
          {user ? (
            <>
              <button
                onClick={() => setProfileModalTab('profile')}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  profileModalTab === 'profile'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => setProfileModalTab('orders')}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  profileModalTab === 'orders'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Order History ({orders.length})</span>
              </button>

              <button
                onClick={() => setProfileModalTab('favorites')}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  profileModalTab === 'favorites'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Saved Favorites ({favorites.length})</span>
              </button>
            </>
          ) : (
            <div className="py-3 text-slate-900 font-bold">Authentication Required</div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: PROFILE MANAGEMENT */}
          {user && profileModalTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Personal Information</h4>
                  <p className="text-xs text-slate-500">
                    Saved shipping address and Safaricom phone for quick M-Pesa STK prompts.
                  </p>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => {
                      setName(user.name);
                      setEmail(user.email);
                      setPhone(user.phone);
                      setCounty(user.county);
                      setTown(user.town);
                      setDefaultAddress(user.defaultAddress);
                      setIsEditing(true);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-500 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Phone (M-Pesa)</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">County</label>
                      <select
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none bg-white font-medium"
                      >
                        {kenyaCounties.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Default Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={defaultAddress}
                      onChange={(e) => setDefaultAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> Email Address
                    </span>
                    <strong className="text-slate-900 block">{user.email}</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> Safaricom Phone (M-Pesa)
                    </span>
                    <strong className="text-slate-900 font-mono block">{user.phone}</strong>
                  </div>

                  <div className="col-span-1 sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> Default Delivery Location
                    </span>
                    <strong className="text-slate-900 block">{user.defaultAddress}</strong>
                    <span className="text-slate-500 text-[11px]">
                      {user.town}, {user.county} County, Kenya
                    </span>
                  </div>
                </div>
              )}

              {/* Cloud Account Status Banner */}
              {user.isFirebaseAuth && (
                <div className="p-3 bg-emerald-50 text-emerald-900 text-xs rounded-xl flex items-center justify-between border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold">Firebase Cloud Database Active</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-mono">
                    Firestore Real-Time
                  </span>
                </div>
              )}

              {/* Account Switcher / Demo Profile Option */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={loadDemoAccount}
                  className="text-xs text-slate-600 hover:text-slate-950 underline font-mono cursor-pointer"
                >
                  Switch to Demo Customer (Dennis Opiyo • Nairobi)
                </button>

                <button
                  onClick={() => {
                    if (user.isFirebaseAuth) {
                      signOutFirebase();
                    } else {
                      logout();
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{user.isFirebaseAuth ? 'Sign Out of Firebase' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {user && profileModalTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Your Order History &amp; Tracking</h4>
                <p className="text-xs text-slate-500">
                  Track dispatch status, M-Pesa receipts, and items for all your footwear purchases.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2 border border-dashed border-slate-300 rounded-xl">
                  <Package className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="text-xs font-semibold">No orders recorded yet.</p>
                  <p className="text-[11px] text-slate-400">
                    Add footwear to your bag and pay with M-Pesa to see your live order tracking here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3 shadow-2xs"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-mono text-slate-900">
                              {order.orderNumber}
                            </strong>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              PAID VIA M-PESA
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Placed on {formatDate(order.date)}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-black text-sm text-emerald-600 block">
                            {formatKSh(order.totalKsh)}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Receipt: <strong className="text-emerald-700">{order.mpesaDetails.receiptNumber}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Items in this Order */}
                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-700 py-1">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded bg-slate-100 text-slate-600 font-mono font-bold flex items-center justify-center text-[10px]">
                                {item.quantity}x
                              </span>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-slate-400 font-mono text-[11px]">
                                (EU {item.size}, {item.color})
                              </span>
                            </div>
                            <span className="font-mono font-semibold">
                              {formatKSh(item.priceKsh * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking Progress Timeline */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Delivery Status: {order.status.toUpperCase()}</span>
                          </span>
                          <span className="text-slate-500 font-mono text-[10px]">
                            {order.estimatedDelivery}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500">
                          Destination:{' '}
                          <strong className="text-slate-800">
                            {order.shippingAddress.deliveryAddress}, {order.shippingAddress.town}, {order.shippingAddress.county} County
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED FAVORITES */}
          {user && profileModalTab === 'favorites' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Saved Favorites ({favorites.length})</h4>
                <p className="text-xs text-slate-500">
                  Your curated wishlist of footwear. Move them directly to your bag for M-Pesa checkout.
                </p>
              </div>

              {favoritedShoes.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2 border border-dashed border-slate-300 rounded-xl">
                  <Heart className="w-8 h-8 mx-auto text-rose-400" />
                  <p className="text-xs font-semibold">No favorites saved yet.</p>
                  <p className="text-[11px] text-slate-400">
                    Click the heart icon on any shoe to save it to your profile wishlist.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoritedShoes.map((shoe) => (
                    <div
                      key={shoe.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex gap-3 items-center"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-900">
                        <ShoePlaceholderMockup
                          silhouette={shoe.silhouette}
                          primaryColor={shoe.colors[0]}
                          aspectRatio="1:1"
                          wireframeOnly={mockupWireframeMode}
                          showTechnicalDetails={false}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {shoe.name}
                        </h5>
                        <div className="text-xs font-black font-mono text-emerald-600">
                          {formatKSh(shoe.priceKsh)}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => {
                              addToCart(shoe, shoe.sizes[0], shoe.colors[0], 1);
                              setIsProfileModalOpen(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add to Bag</span>
                          </button>
                          <button
                            onClick={() => toggleFavorite(shoe.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LOGIN / REGISTER (WHEN NOT LOGGED IN) */}
          {!user && (
            <div className="space-y-5">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                    authMode === 'login' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                    authMode === 'register' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400'
                  }`}
                >
                  Create New Profile
                </button>
              </div>

              {/* Google Sign In with Firebase Auth */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isAuthLoading}
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                      setProfileModalTab('profile');
                    } catch (err: any) {
                      console.error('Sign-in failed:', err);
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{isAuthLoading ? 'Connecting to Google...' : 'Continue with Google (Firebase Auth)'}</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full"></div>
                  <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider relative">Or with Email</span>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Dennis Opiyo"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Phone Number (M-Pesa)</label>
                      <input
                        type="text"
                        required
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="0712 345 678"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">County</label>
                      <select
                        value={authCounty}
                        onChange={(e) => setAuthCounty(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none bg-white font-medium"
                      >
                        {kenyaCounties.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="dennis@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  {authMode === 'login' ? 'Sign In to Profile' : 'Create Profile & Start Shopping'}
                </button>
              </form>

              {/* Quick Demo Login Shortcut */}
              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    loadDemoAccount();
                    setProfileModalTab('profile');
                  }}
                  className="w-full py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>One-Click Login as Demo Customer (Dennis Opiyo • Nairobi)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

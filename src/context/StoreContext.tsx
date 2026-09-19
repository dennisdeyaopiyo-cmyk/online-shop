import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shoe, CartItem, UserProfile, Order, FootwearCategory, FootwearGender, ShoeColor, ShippingAddress, MpesaDetails } from '../types';
import { INITIAL_SHOES } from '../data/footwear';
import { generateOrderNumber, generateMpesaReceiptCode } from '../utils/formatters';
import { auth, googleProvider, db } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase/firestoreErrors';

interface StoreContextType {
  shoes: Shoe[];
  cart: CartItem[];
  favorites: string[];
  user: UserProfile | null;
  orders: Order[];
  
  // Filtering & Sorting
  activeCategory: FootwearCategory;
  setActiveCategory: (cat: FootwearCategory) => void;
  activeGender: FootwearGender;
  setActiveGender: (gender: FootwearGender) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSize: number | null;
  setSelectedSize: (size: number | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  setSortBy: (sort: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest') => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  profileModalTab: 'profile' | 'orders' | 'favorites' | 'login';
  setProfileModalTab: (tab: 'profile' | 'orders' | 'favorites' | 'login') => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  selectedShoeForDetail: Shoe | null;
  openShoeDetail: (shoe: Shoe) => void;
  closeShoeDetail: () => void;

  // AI Grounding Tools
  isSearchGroundingOpen: boolean;
  setIsSearchGroundingOpen: (open: boolean) => void;
  isMapsGroundingOpen: boolean;
  setIsMapsGroundingOpen: (open: boolean) => void;
  
  // Design Mockup Mode (toggle between wireframe and visual design assets)
  mockupWireframeMode: boolean;
  setMockupWireframeMode: (val: boolean) => void;

  // Actions
  addToCart: (shoe: Shoe, size: number, color: ShoeColor, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  toggleFavorite: (shoeId: string) => void;
  isFavorite: (shoeId: string) => boolean;
  
  // Auth & Orders
  signInWithGoogle: () => Promise<void>;
  signOutFirebase: () => Promise<void>;
  isAuthLoading: boolean;
  isFirestoreSynced: boolean;
  login: (email: string, name?: string) => void;
  register: (name: string, email: string, phone: string, county: string, town: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  loadDemoAccount: () => void;
  placeMpesaOrder: (shipping: ShippingAddress, mpesa: Omit<MpesaDetails, 'receiptNumber' | 'timestamp' | 'transactionStatus'>) => Order;
  
  // Cart totals
  cartSubtotalKsh: number;
  deliveryFeeKsh: number;
  cartTotalKsh: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: 'usr_ke_dennis_891',
  name: 'Dennis Opiyo',
  email: 'dennisdeyaopiyo@gmail.com',
  phone: '+254 712 984 532',
  county: 'Nairobi',
  town: 'Westlands',
  defaultAddress: 'Rhapta Road, Apartment 4B, Westlands, Nairobi',
  favorites: ['shoe-1', 'shoe-2', 'shoe-3'],
  orders: [
    {
      id: 'ord_init_01',
      orderNumber: 'FW-KE-98214',
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
      items: [
        {
          shoeId: 'shoe-1',
          name: 'Velocity Surge Runner Pro',
          brand: 'AeroKicks',
          priceKsh: 6499,
          size: 42,
          color: 'Obsidian Black',
          quantity: 1,
          category: 'sneakers'
        },
        {
          shoeId: 'shoe-4',
          name: 'Diani Dune Cork Bed Slide',
          brand: 'Coast & Craft',
          priceKsh: 3200,
          size: 42,
          color: 'Raw Honey Tan',
          quantity: 1,
          category: 'sandals'
        }
      ],
      subtotalKsh: 9699,
      deliveryFeeKsh: 0, // Free Nairobi delivery threshold
      discountKsh: 0,
      totalKsh: 9699,
      shippingAddress: {
        fullName: 'Dennis Opiyo',
        phone: '+254 712 984 532',
        county: 'Nairobi',
        town: 'Westlands',
        deliveryAddress: 'Rhapta Road, Apartment 4B, Westlands, Nairobi',
        deliveryMethod: 'nairobi_express'
      },
      mpesaDetails: {
        method: 'stk_push',
        phoneNumber: '254712984532',
        receiptNumber: 'QK89XD712A',
        amountKsh: 9699,
        timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
        transactionStatus: 'success'
      },
      status: 'delivered',
      estimatedDelivery: 'Delivered safely via Express Rider'
    }
  ],
  memberSince: 'January 2026'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shoes] = useState<Shoe[]>(INITIAL_SHOES);
  
  // Persisted cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fw_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persisted favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fw_favorites');
      return saved ? JSON.parse(saved) : ['shoe-1', 'shoe-2', 'shoe-3'];
    } catch {
      return ['shoe-1', 'shoe-2', 'shoe-3'];
    }
  });

  // Persisted user profile (default to demo user so the user can immediately test profiles & order history!)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('fw_user');
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  // Persisted orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('fw_orders');
      return saved ? JSON.parse(saved) : DEMO_USER.orders;
    } catch {
      return DEMO_USER.orders;
    }
  });

  // Filter and sort states
  const [activeCategory, setActiveCategory] = useState<FootwearCategory>('all');
  const [activeGender, setActiveGender] = useState<FootwearGender>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'profile' | 'orders' | 'favorites' | 'login'>('profile');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedShoeForDetail, setSelectedShoeForDetail] = useState<Shoe | null>(null);

  // AI Grounding Tools Modals
  const [isSearchGroundingOpen, setIsSearchGroundingOpen] = useState(false);
  const [isMapsGroundingOpen, setIsMapsGroundingOpen] = useState(false);

  // Firebase Auth & Firestore status
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isFirestoreSynced, setIsFirestoreSynced] = useState(false);

  // Mockup mode
  const [mockupWireframeMode, setMockupWireframeMode] = useState(false);

  // Firebase Auth State Listener & Firestore Data Sync
  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;
    let unsubscribeFavs: (() => void) | undefined;
    let unsubscribeOrders: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setIsAuthLoading(true);
        const uid = fbUser.uid;
        const userDocRef = doc(db, 'users', uid);

        try {
          const userSnap = await getDoc(userDocRef);
          if (!userSnap.exists()) {
            // Bootstrap initial user profile in Firestore
            const initialProfile = {
              uid,
              name: fbUser.displayName || 'Footwear Connoisseur',
              email: fbUser.email || '',
              phone: '+254 700 000000',
              county: 'Nairobi',
              town: 'CBD',
              deliveryAddress: 'CBD Pickup Station, Nairobi',
              avatar: fbUser.photoURL || '',
              updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, initialProfile);
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, `users/${uid}`);
        }

        // Real-time listener for user profile document
        unsubscribeProfile = onSnapshot(
          userDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              setUser(prev => ({
                id: uid,
                name: data.name || fbUser.displayName || 'Valued Customer',
                email: data.email || fbUser.email || '',
                phone: data.phone || '+254 700 000000',
                county: data.county || 'Nairobi',
                town: data.town || 'CBD',
                defaultAddress: data.deliveryAddress || `${data.town || 'CBD'}, ${data.county || 'Nairobi'}`,
                favorites: prev?.favorites || [],
                orders: prev?.orders || [],
                avatarUrl: data.avatar || fbUser.photoURL || undefined,
                memberSince: 'Firebase Verified Account',
                isFirebaseAuth: true,
              }));
              setIsFirestoreSynced(true);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${uid}`);
          }
        );

        // Real-time listener for user favorites subcollection
        const favsColRef = collection(db, 'users', uid, 'favorites');
        unsubscribeFavs = onSnapshot(
          favsColRef,
          (snapshot) => {
            const favIds = snapshot.docs.map(d => d.id);
            if (favIds.length > 0) {
              setFavorites(favIds);
              setUser(prev => prev ? { ...prev, favorites: favIds } : null);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${uid}/favorites`);
          }
        );

        // Real-time listener for user orders subcollection
        const ordersColRef = collection(db, 'users', uid, 'orders');
        unsubscribeOrders = onSnapshot(
          ordersColRef,
          (snapshot) => {
            const loadedOrders: Order[] = snapshot.docs.map(docSnap => {
              const d = docSnap.data();
              let parsedItems = [];
              try {
                parsedItems = d.items ? JSON.parse(d.items) : [];
              } catch {
                parsedItems = [];
              }
              return {
                id: d.orderId || docSnap.id,
                orderNumber: d.orderId || docSnap.id,
                date: d.placedAt || new Date().toISOString(),
                items: parsedItems,
                subtotalKsh: d.totalAmountKSh || 0,
                deliveryFeeKsh: d.shippingCostKSh || 0,
                discountKsh: 0,
                totalKsh: d.totalAmountKSh || 0,
                shippingAddress: {
                  fullName: d.deliveryAddress || 'Valued Customer',
                  phone: d.mpesaPhone || '',
                  county: d.deliveryCounty || 'Nairobi',
                  town: 'Central',
                  deliveryAddress: d.deliveryAddress || '',
                  deliveryMethod: 'nairobi_express'
                },
                mpesaDetails: {
                  method: 'stk_push',
                  phoneNumber: d.mpesaPhone || '',
                  receiptNumber: d.mpesaReceiptNumber || '',
                  amountKsh: d.totalAmountKSh || 0,
                  timestamp: d.placedAt || new Date().toISOString(),
                  transactionStatus: 'success'
                },
                status: 'confirmed',
                estimatedDelivery: 'Dispatched via Courier'
              };
            });
            if (loadedOrders.length > 0) {
              setOrders(loadedOrders);
              setUser(prev => prev ? { ...prev, orders: loadedOrders } : null);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${uid}/orders`);
          }
        );

        setIsAuthLoading(false);
      } else {
        // Clean up listeners when user logs out
        unsubscribeProfile?.();
        unsubscribeFavs?.();
        unsubscribeOrders?.();
        setIsFirestoreSynced(false);
        setIsAuthLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile?.();
      unsubscribeFavs?.();
      unsubscribeOrders?.();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fw_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('fw_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('fw_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('fw_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('fw_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Cart operations
  const addToCart = (shoe: Shoe, size: number, color: ShoeColor, quantity = 1) => {
    setCart(prevCart => {
      const itemId = `${shoe.id}_size${size}_${color.name.replace(/\s+/g, '')}`;
      const existingIndex = prevCart.findIndex(item => item.id === itemId);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: itemId,
            shoe,
            selectedSize: size,
            selectedColor: color,
            quantity
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Favorites operations
  const toggleFavorite = async (shoeId: string) => {
    const isCurrentlyFav = favorites.includes(shoeId);
    const next = isCurrentlyFav
      ? favorites.filter(id => id !== shoeId)
      : [...favorites, shoeId];
    
    setFavorites(next);
    if (user) {
      setUser({ ...user, favorites: next });
    }

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const favDocRef = doc(db, 'users', uid, 'favorites', shoeId);
      try {
        if (isCurrentlyFav) {
          await deleteDoc(favDocRef);
        } else {
          const shoeObj = shoes.find(s => s.id === shoeId);
          await setDoc(favDocRef, {
            shoeId,
            shoeName: shoeObj?.name || 'Footwear',
            price: shoeObj?.priceKsh || 0,
            category: shoeObj?.category || 'casual',
            silhouette: shoeObj?.silhouette || 'sneaker-running',
            addedAt: new Date().toISOString()
          });
        }
      } catch (e) {
        handleFirestoreError(e, isCurrentlyFav ? OperationType.DELETE : OperationType.WRITE, `users/${uid}/favorites/${shoeId}`);
      }
    }
  };

  const isFavorite = (shoeId: string) => favorites.includes(shoeId);

  // User auth operations
  const signInWithGoogle = async () => {
    try {
      setIsAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signOutFirebase = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  const login = (email: string, name = 'Valued Customer') => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone: '+254 700 000000',
      county: 'Nairobi',
      town: 'CBD',
      defaultAddress: 'Kenyatta Avenue, Nairobi',
      favorites: [...favorites],
      orders: [...orders],
      memberSince: new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })
    };
    setUser(newUser);
  };

  const register = (name: string, email: string, phone: string, county: string, town: string) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      county,
      town,
      defaultAddress: `${town}, ${county} County`,
      favorites: [...favorites],
      orders: [],
      memberSince: new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })
    };
    setUser(newUser);
  };

  const logout = () => {
    if (auth.currentUser) {
      signOut(auth).catch(console.error);
    }
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...data } : null);

    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', uid);
      setDoc(userDocRef, {
        uid,
        name: data.name || user?.name || '',
        email: data.email || user?.email || '',
        phone: data.phone || user?.phone || '',
        county: data.county || user?.county || '',
        town: data.town || user?.town || '',
        deliveryAddress: data.defaultAddress || user?.defaultAddress || '',
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      });
    }
  };

  const loadDemoAccount = () => {
    setUser(DEMO_USER);
    setOrders(DEMO_USER.orders);
    setFavorites(DEMO_USER.favorites);
  };

  // Create & track M-Pesa order
  const placeMpesaOrder = (
    shipping: ShippingAddress,
    mpesaInput: Omit<MpesaDetails, 'receiptNumber' | 'timestamp' | 'transactionStatus'>
  ): Order => {
    const subtotal = cart.reduce((sum, item) => sum + item.shoe.priceKsh * item.quantity, 0);
    const deliveryFee = subtotal >= 6000 ? 0 : 250;
    const total = subtotal + deliveryFee;

    const receiptNumber = generateMpesaReceiptCode();
    const orderNumber = generateOrderNumber();

    const mpesaFullDetails: MpesaDetails = {
      ...mpesaInput,
      receiptNumber,
      amountKsh: total,
      timestamp: new Date().toISOString(),
      transactionStatus: 'success'
    };

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      date: new Date().toISOString(),
      items: cart.map(item => ({
        shoeId: item.shoe.id,
        name: item.shoe.name,
        brand: item.shoe.brand,
        priceKsh: item.shoe.priceKsh,
        size: item.selectedSize,
        color: item.selectedColor.name,
        quantity: item.quantity,
        category: item.shoe.category
      })),
      subtotalKsh: subtotal,
      deliveryFeeKsh: deliveryFee,
      discountKsh: 0,
      totalKsh: total,
      shippingAddress: shipping,
      mpesaDetails: mpesaFullDetails,
      status: 'confirmed',
      estimatedDelivery: shipping.deliveryMethod === 'nairobi_express'
        ? 'Same-Day Dispatch (Within 2-4 Hours in Nairobi)'
        : '1-2 Days Countrywide via Courier'
    };

    setOrders(prev => [newOrder, ...prev]);

    if (user) {
      setUser(prev => prev ? { ...prev, orders: [newOrder, ...(prev.orders || [])] } : null);
    }

    // Persist to Firestore if user is logged into Firebase
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const orderDocRef = doc(db, 'users', uid, 'orders', newOrder.id);
      setDoc(orderDocRef, {
        orderId: newOrder.orderNumber,
        userId: uid,
        mpesaReceiptNumber: newOrder.mpesaDetails.receiptNumber,
        mpesaPhone: newOrder.mpesaDetails.phoneNumber,
        totalAmountKSh: newOrder.totalKsh,
        shippingCostKSh: newOrder.deliveryFeeKsh,
        deliveryAddress: newOrder.shippingAddress.deliveryAddress,
        deliveryCounty: newOrder.shippingAddress.county,
        status: 'paid_mpesa',
        items: JSON.stringify(newOrder.items),
        placedAt: newOrder.date
      }).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `users/${uid}/orders/${newOrder.id}`);
      });
    }

    clearCart();
    return newOrder;
  };

  const openShoeDetail = (shoe: Shoe) => {
    setSelectedShoeForDetail(shoe);
  };

  const closeShoeDetail = () => {
    setSelectedShoeForDetail(null);
  };

  // Calculations
  const cartSubtotalKsh = cart.reduce((sum, item) => sum + item.shoe.priceKsh * item.quantity, 0);
  const deliveryFeeKsh = cart.length === 0 ? 0 : (cartSubtotalKsh >= 6000 ? 0 : 250);
  const cartTotalKsh = cartSubtotalKsh + deliveryFeeKsh;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        shoes,
        cart,
        favorites,
        user,
        orders,
        activeCategory,
        setActiveCategory,
        activeGender,
        setActiveGender,
        searchQuery,
        setSearchQuery,
        selectedSize,
        setSelectedSize,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        isCartOpen,
        setIsCartOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        profileModalTab,
        setProfileModalTab,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        selectedShoeForDetail,
        openShoeDetail,
        closeShoeDetail,
        isSearchGroundingOpen,
        setIsSearchGroundingOpen,
        isMapsGroundingOpen,
        setIsMapsGroundingOpen,
        mockupWireframeMode,
        setMockupWireframeMode,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        signInWithGoogle,
        signOutFirebase,
        isAuthLoading,
        isFirestoreSynced,
        login,
        register,
        logout,
        updateProfile,
        loadDemoAccount,
        placeMpesaOrder,
        cartSubtotalKsh,
        deliveryFeeKsh,
        cartTotalKsh,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

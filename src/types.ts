export type FootwearCategory = 
  | 'all' 
  | 'sneakers' 
  | 'formal' 
  | 'boots' 
  | 'sandals' 
  | 'heels' 
  | 'casual' 
  | 'sports';

export type FootwearGender = 'all' | 'men' | 'women' | 'unisex' | 'kids';

export type SilhouetteType = 
  | 'sneaker-running'
  | 'sneaker-high'
  | 'oxford-brogue'
  | 'loafer-leather'
  | 'chelsea-boot'
  | 'hiking-boot'
  | 'slide-sandal'
  | 'strappy-sandal'
  | 'pump-heel'
  | 'canvas-casual'
  | 'kids-trainer';

export interface ShoeColor {
  name: string;
  hex: string;
}

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  category: FootwearCategory;
  gender: FootwearGender;
  priceKsh: number;
  originalPriceKsh?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  sizes: number[]; // EU sizes e.g. [38, 39, 40, 41, 42, 43, 44, 45]
  colors: ShoeColor[];
  description: string;
  materials: string[];
  features: string[];
  silhouette: SilhouetteType;
  placeholderBg: string;
  placeholderAccent: string;
  inStock: boolean;
  sku: string;
  imageUrl?: string;
  dealBadge?: string;
  isOfficialStore?: boolean;
  expressDelivery?: boolean;
  isTopDealUnder600?: boolean;
  isTopSellerSneaker?: boolean;
}

export interface CartItem {
  id: string; // unique item id = shoeId_size_color
  shoe: Shoe;
  selectedSize: number;
  selectedColor: ShoeColor;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  county: string;
  town: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  deliveryMethod: 'nairobi_express' | 'countrywide_courier' | 'cbd_pickup';
}

export type MpesaMethod = 'stk_push' | 'till_number' | 'paybill';

export interface MpesaDetails {
  method: MpesaMethod;
  phoneNumber: string;
  receiptNumber: string;
  amountKsh: number;
  timestamp: string;
  transactionStatus: 'success' | 'pending' | 'failed';
}

export type OrderStatus = 'placed' | 'confirmed' | 'processing' | 'dispatched' | 'delivered';

export interface OrderItemSummary {
  shoeId: string;
  name: string;
  brand: string;
  priceKsh: number;
  size: number;
  color: string;
  quantity: number;
  category: FootwearCategory;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItemSummary[];
  subtotalKsh: number;
  deliveryFeeKsh: number;
  discountKsh: number;
  totalKsh: number;
  shippingAddress: ShippingAddress;
  mpesaDetails: MpesaDetails;
  status: OrderStatus;
  estimatedDelivery: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  county: string;
  town: string;
  defaultAddress: string;
  favorites: string[]; // array of shoe IDs
  orders: Order[];
  avatarUrl?: string;
  memberSince: string;
  isFirebaseAuth?: boolean;
}

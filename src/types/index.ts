export type ArtworkCategory =
  | "all"
  | "calligraphy"
  | "canvas"
  | "mini-easels"
  | "bookmarks"
  | "custom-orders";

export interface Artwork {
  id: string;
  title: string;
  titleBangla?: string;
  category: ArtworkCategory;
  price: number;
  originalPrice?: number;
  description: string;
  spiritualMessage?: string;
  dimensions: string;
  medium: string;
  finish?: string;
  image: string;
  isFeatured?: boolean;
  inStock: boolean;
  badge?: string;
  tags?: string[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "painting"
  | "framing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "bkash" | "nagad";

export interface CartItem {
  artwork: Artwork;
  quantity: number;
  selectedFrame?: string;
  customText?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  deliveryZone: "inside_dhaka" | "outside_dhaka";
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentTrxId?: string;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export interface CustomInquiry {
  id: string;
  customerName: string;
  phone: string;
  artType: string;
  customVerseOrText: string;
  canvasSize: string;
  frameType: string;
  estimatedPrice: number;
  notes?: string;
  status: "new" | "contacted" | "confirmed" | "completed";
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  artworkTitle?: string;
  verified: boolean;
}

export interface SiteSettings {
  announcementText: string;
  isAnnouncementActive: boolean;
  phone1: string;
  phone2: string;
  whatsapp: string;
  facebookUrl: string;
  studioAddress: string;
  insideDhakaDeliveryFee: number;
  outsideDhakaDeliveryFee: number;
  freeDeliveryThreshold: number;
  adminPin: string;
  // Editable site images
  siteLogo: string;
  heroImage: string;
  storyImage: string;
  bannerImage: string;
}

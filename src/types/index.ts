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
  images?: string[];
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

export interface NavMenuItem {
  id: string;
  label: string;
  labelBangla?: string;
  url: string;
  isActive: boolean;
  isExternal?: boolean;
}

export interface SectionVisibilitySettings {
  announcementBar: boolean;
  navbar: boolean;
  hero: boolean;
  collections: boolean;
  customConfigurator: boolean;
  gallery: boolean;
  brandStory: boolean;
  testimonials: boolean;
  faq: boolean;
  footer: boolean;
}

export interface NavbarCMSSettings {
  brandName: string;
  brandNameBangla?: string;
  tagline: string;
  taglineBangla?: string;
  showLogo: boolean;
  showLanguageSwitcher: boolean;
  showCartButton: boolean;
  menuItems: NavMenuItem[];
}

export interface HeroCMSSettings {
  eyebrow: string;
  eyebrowBangla?: string;
  showEyebrow: boolean;
  headline1: string;
  headline1Bangla?: string;
  headline2: string;
  headline2Bangla?: string;
  description: string;
  descriptionBangla?: string;
  primaryBtnText: string;
  primaryBtnTextBangla?: string;
  primaryBtnUrl: string;
  showPrimaryBtn: boolean;
  secondaryBtnText: string;
  secondaryBtnTextBangla?: string;
  secondaryBtnUrl: string;
  showSecondaryBtn: boolean;
  showCarousel: boolean;
}

export interface CollectionsCMSSettings {
  title: string;
  titleBangla?: string;
  subtitle: string;
  subtitleBangla?: string;
  showCategoryFilters: boolean;
  showSearchBar: boolean;
}

export interface CustomConfiguratorCMSSettings {
  title: string;
  titleBangla?: string;
  subtitle: string;
  subtitleBangla?: string;
}

export interface GalleryCMSSettings {
  title: string;
  titleBangla?: string;
  subtitle: string;
  subtitleBangla?: string;
  showTabs: boolean;
}

export interface BrandPillarItem {
  id: string;
  iconName?: string;
  title: string;
  titleBangla?: string;
  desc: string;
  descBangla?: string;
}

export interface BrandStoryCMSSettings {
  title: string;
  titleBangla?: string;
  subtitle: string;
  subtitleBangla?: string;
  paragraph1: string;
  paragraph1Bangla?: string;
  paragraph2: string;
  paragraph2Bangla?: string;
  badgeText?: string;
  badgeTextBangla?: string;
  pillars: BrandPillarItem[];
}

export interface FAQItemCMS {
  id: string;
  question: string;
  questionBangla?: string;
  answer: string;
  answerBangla?: string;
  isActive: boolean;
}

export interface FAQCMSSettings {
  title: string;
  titleBangla?: string;
  subtitle: string;
  subtitleBangla?: string;
  items: FAQItemCMS[];
}

export interface TestimonialsCMSSettings {
  title: string;
  titleBangla?: string;
  subtitle: string;
  subtitleBangla?: string;
  showVerifiedBadge: boolean;
}

export interface FooterQuickLink {
  id: string;
  label: string;
  labelBangla?: string;
  url: string;
  isActive: boolean;
}

export interface FooterCMSSettings {
  aboutText: string;
  aboutTextBangla?: string;
  copyrightText: string;
  showFacebookButton: boolean;
  showWhatsAppButton: boolean;
  quickLinks?: FooterQuickLink[];
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
  // Custom ordering
  artworkOrderIds?: string[];
  // Hero Carousel Selected Artwork IDs
  heroCarouselArtworkIds?: string[];
  // Editable site images
  siteLogo: string;
  heroImage: string;
  storyImage: string;
  bannerImage: string;
  // Product Card Customizer Controls
  cardShowItemCode?: boolean;
  cardShowDimensions?: boolean;
  cardShowTitle?: boolean;
  cardShowBanglaTitle?: boolean;
  cardShowPrice?: boolean;
  cardShowOriginalPrice?: boolean;
  cardShowBadge?: boolean;
  cardButtonMode?: "both" | "cart_only" | "buynow_only";
  // Full Website Page & Sections CMS Controls
  sectionVisibility?: SectionVisibilitySettings;
  navbarCMS?: NavbarCMSSettings;
  heroCMS?: HeroCMSSettings;
  collectionsCMS?: CollectionsCMSSettings;
  customConfiguratorCMS?: CustomConfiguratorCMSSettings;
  galleryCMS?: GalleryCMSSettings;
  brandStoryCMS?: BrandStoryCMSSettings;
  faqCMS?: FAQCMSSettings;
  testimonialsCMS?: TestimonialsCMSSettings;
  footerCMS?: FooterCMSSettings;
}

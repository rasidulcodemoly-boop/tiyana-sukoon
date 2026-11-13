"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreProvider, useStore } from "../../context/StoreContext";
import { ImageSourceControl } from "../../components/ImageSourceControl";
import { MultiGalleryImageControl } from "../../components/MultiGalleryImageControl";
import { CustomSelect, CustomSelectOption } from "../../components/CustomSelect";
import { SiteCMSControl } from "../../components/admin/SiteCMSControl";
import {
  Artwork,
  Order,
  OrderStatus,
  CustomInquiry,
  ArtworkCategory,
} from "../../types";
import {
  ShieldCheck,
  LayoutDashboard,
  Palette,
  ShoppingBag,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  MessageCircle,
  PhoneCall,
  MapPin,
  Printer,
  X,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Image as ImageIcon,
  Upload,
  Check,
  Copy,
  Save,
  Database,
  Cloud,
  RefreshCw,
  Server,
  Zap,
  CheckCircle,
  Key,
  Mail,
  Lock,
  EyeOff,
  LogOut,
  LayoutGrid,
  List,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  CheckSquare,
  Square,
  Hash,
  Layers,
} from "lucide-react";
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  signInAdminUser,
  signOutAdminUser,
  getCurrentAdminSession,
} from "../../lib/supabase";

// Category options for custom dropdowns (Bookmarks removed per request)
const CATEGORY_OPTIONS: CustomSelectOption[] = [
  { value: "calligraphy", label: "Arabic Calligraphy" },
  { value: "canvas", label: "Canvas Paintings" },
  { value: "mini-easels", label: "Mini Easels" },
  { value: "custom-orders", label: "Custom Orders" },
];

const CAROUSEL_CATEGORY_OPTIONS: CustomSelectOption[] = [
  { value: "calligraphy", label: "Arabic Calligraphy" },
  { value: "canvas", label: "Canvas Paintings" },
  { value: "mini-easels", label: "Mini Easels & Desk Canvas" },
  { value: "custom-orders", label: "Custom Orders" },
];

const ORDER_STATUS_OPTIONS: CustomSelectOption[] = [
  { value: "pending", label: "PENDING" },
  { value: "confirmed", label: "CONFIRMED" },
  { value: "painting", label: "IN PAINTING" },
  { value: "framing", label: "IN FRAMING" },
  { value: "shipped", label: "SHIPPED" },
  { value: "delivered", label: "DELIVERED" },
  { value: "cancelled", label: "CANCELLED" },
];

const INQUIRY_STATUS_OPTIONS: CustomSelectOption[] = [
  { value: "new", label: "NEW INQUIRY" },
  { value: "contacted", label: "CONTACTED" },
  { value: "confirmed", label: "CONFIRMED" },
  { value: "completed", label: "COMPLETED" },
];

// List of available authentic FB artwork image paths
const GALLERY_IMAGE_PRESETS = [
  { id: 1, path: "/artwork/artwork_1.jpg", label: "Studio Logo & Emblem (720x720)" },
  { id: 2, path: "/artwork/artwork_2.jpg", label: "Exhibition Banner (960x540)" },
  { id: 3, path: "/artwork/artwork_3.jpg", label: "Desert Sunset Calligraphy Panorama (960x540)" },
  { id: 4, path: "/artwork/artwork_4.jpg", label: "Surah Al-Falaq Desert Art (941x1672)" },
  { id: 5, path: "/artwork/artwork_5.jpg", label: "Ayat al-Kursi Royal Emerald (1086x1448)" },
  { id: 6, path: "/artwork/artwork_6.jpg", label: "Desert Dunes & Palm Flora Detail (672x768)" },
  { id: 7, path: "/artwork/artwork_7.jpg", label: "Al-Falaq Pen & Golden Stroke (851x768)" },
  { id: 8, path: "/artwork/artwork_8.jpg", label: "Surah Ar-Rahman Canvas (900x1600)" },
  { id: 9, path: "/artwork/artwork_9.jpg", label: "Floral Arabesque & Geometry (900x1600)" },
  { id: 10, path: "/artwork/artwork_10.jpg", label: "Dhikr Twin Set SubhanAllah (1199x1312)" },
  { id: 11, path: "/artwork/artwork_11.jpg", label: "Kun Faya Kun Mini Easel (736x1308)" },
  { id: 12, path: "/artwork/artwork_12.jpg", label: "Custom Keepsake Wooden Frame (735x1105)" },
  { id: 13, path: "/artwork/artwork_13.jpg", label: "Surah Al-Ikhlas Solitude (590x532)" },
  { id: 14, path: "/artwork/artwork_14.jpg", label: "Artisan Bookmark Trio (516x590)" },
  { id: 15, path: "/artwork/artwork_15.jpg", label: "Bismillah Over-Sofa Statement (443x590)" },
  { id: 16, path: "/artwork/artwork_16.jpg", label: "Vertical Pillar Ayat al-Kursi (332x590)" },
  { id: 17, path: "/artwork/artwork_17.jpg", label: "Celestial Emerald Abstract (851x768)" },
  { id: 18, path: "/artwork/artwork_18.jpg", label: "Desert Twilight Sky & Cactus (672x768)" },
  { id: 19, path: "/artwork/artwork_19.jpg", label: "Ramadan & Eid Gift Box (1086x1448)" },
  { id: 20, path: "/artwork/artwork_20.jpg", label: "Hasbunallahu Wa Ni'mal Wakeel (941x1672)" },
  { id: 21, path: "/artwork/artwork_21.jpg", label: "Studio Gallery Wall Exhibition (960x540)" },
];

const SUPABASE_SQL_SCHEMA = `-- ====================================================================
-- TIYANA'S SUKOON - SUPABASE DATABASE SCHEMA
-- Handmade Art, Craft & Islamic Calligraphy E-Commerce Platform
-- ====================================================================

-- 1. ARTWORKS TABLE
CREATE TABLE IF NOT EXISTS public.artworks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_bangla TEXT,
    category TEXT NOT NULL DEFAULT 'calligraphy',
    price NUMERIC NOT NULL DEFAULT 0,
    original_price NUMERIC,
    description TEXT,
    spiritual_message TEXT,
    dimensions TEXT NOT NULL DEFAULT '12x12 inch',
    medium TEXT NOT NULL DEFAULT 'Heavy Textured Acrylic on Canvas',
    finish TEXT DEFAULT 'Varnished Semi-Gloss',
    image TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    in_stock BOOLEAN DEFAULT true,
    badge TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artworks_category ON public.artworks(category);
CREATE INDEX IF NOT EXISTS idx_artworks_featured ON public.artworks(is_featured);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    delivery_zone TEXT NOT NULL DEFAULT 'inside_dhaka',
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    delivery_fee NUMERIC NOT NULL DEFAULT 70,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'cod',
    payment_trx_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 3. CUSTOM COMMISSIONS & INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    art_type TEXT NOT NULL,
    custom_verse_or_text TEXT,
    canvas_size TEXT,
    frame_type TEXT,
    estimated_price NUMERIC DEFAULT 0,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SITE SETTINGS & BRAND MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'current',
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES (Allow public storefront read and admin operations with anon key)
DROP POLICY IF EXISTS "Public can view artworks" ON public.artworks;
CREATE POLICY "Public can view artworks" ON public.artworks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon manage artworks" ON public.artworks;
CREATE POLICY "Allow anon manage artworks" ON public.artworks FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon manage orders" ON public.orders;
CREATE POLICY "Allow anon manage orders" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon manage inquiries" ON public.inquiries;
CREATE POLICY "Allow anon manage inquiries" ON public.inquiries FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon manage site settings" ON public.site_settings;
CREATE POLICY "Allow anon manage site settings" ON public.site_settings FOR ALL USING (true);

-- 7. CLOUD STORAGE BUCKET FOR PERMANENT ARTWORK & MEDIA UPLOADS
INSERT INTO storage.buckets (id, name, public)
VALUES ('artwork-uploads', 'artwork-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view uploaded artworks" ON storage.objects;
CREATE POLICY "Public can view uploaded artworks" ON storage.objects
    FOR SELECT USING (bucket_id = 'artwork-uploads');

DROP POLICY IF EXISTS "Allow anon upload artworks" ON storage.objects;
CREATE POLICY "Allow anon upload artworks" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'artwork-uploads');

DROP POLICY IF EXISTS "Allow anon update artworks" ON storage.objects;
CREATE POLICY "Allow anon update artworks" ON storage.objects
    FOR UPDATE USING (bucket_id = 'artwork-uploads');`;

const AdminDashboardInner: React.FC = () => {
  const {
    artworks,
    orders,
    inquiries,
    settings,
    updateOrderStatus,
    updateOrderNotes,
    deleteOrder,
    clearAllOrders,
    updateInquiryStatus,
    deleteInquiry,
    clearAllInquiries,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    deleteArtworks,
    reorderArtworks,
    toggleHeroCarouselArtwork,
    setHeroCarouselArtworkIds,
    updateSettings,
    showToast,
    isSupabaseActive,
    supabaseStatus,
    syncWithSupabase,
    seedSupabaseArtworks,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("rasidulcodemoly@gmail.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentAdminUser, setCurrentAdminUser] = useState<{ email?: string; id?: string } | null>(null);

  // Auto-restore Supabase session on page load
  useEffect(() => {
    getCurrentAdminSession().then((session) => {
      if (session?.user) {
        setCurrentAdminUser(session.user);
        setIsAuthenticated(true);
      }
    });
  }, []);

  // Navigation tabs
  type AdminTab = "dashboard" | "artworks" | "media" | "cms" | "orders" | "inquiries" | "settings" | "supabase";
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  // Filtering states
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [artworkCategoryFilter, setArtworkCategoryFilter] = useState<string>("all");
  const [artworkSearch, setArtworkSearch] = useState("");

  // Modals
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [isAddingArtwork, setIsAddingArtwork] = useState(false);

  // Custom Confirmation Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemName?: string;
    confirmLabel?: string;
    onConfirm: () => void;
  } | null>(null);

  const requestConfirm = ({
    title,
    message,
    itemName,
    confirmLabel = "মুছে ফেলুন (Delete)",
    onConfirm,
  }: {
    title: string;
    message: string;
    itemName?: string;
    confirmLabel?: string;
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      itemName,
      confirmLabel,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(null);
      },
    });
  };

  // Artwork Catalog View & Bulk selection states
  const [artworkViewMode, setArtworkViewMode] = useState<"grid" | "table">("grid");
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedView = localStorage.getItem("tiyana_art_view");
      if (savedView === "grid" || savedView === "table") {
        setArtworkViewMode(savedView);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const changeArtworkViewMode = (mode: "grid" | "table") => {
    setArtworkViewMode(mode);
    try {
      localStorage.setItem("tiyana_art_view", mode);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSelectArtwork = (id: string) => {
    setSelectedArtworkIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFilteredArtworks = (items: Artwork[]) => {
    const allFilteredSelected = items.length > 0 && items.every((a) => selectedArtworkIds.includes(a.id));
    if (allFilteredSelected) {
      const filteredIds = new Set(items.map((a) => a.id));
      setSelectedArtworkIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const combined = new Set([...selectedArtworkIds, ...items.map((a) => a.id)]);
      setSelectedArtworkIds(Array.from(combined));
    }
  };

  const handleBulkDeleteArtworks = () => {
    if (selectedArtworkIds.length === 0) return;
    requestConfirm({
      title: "সিলেক্ট করা আর্টওয়ার্ক মুছে ফেলুন (Delete Selected Artworks)",
      message: `আপনি কি নিশ্চিত সিলেক্ট করা ${selectedArtworkIds.length}টি আর্টওয়ার্ক ক্যাটালগ ও ক্লাউড ডাটাবেস থেকে স্থায়ীভাবে মুছে ফেলতে চান?`,
      itemName: `${selectedArtworkIds.length}টি আইটেম সিলেক্টেড`,
      confirmLabel: `সবগুলো মুছুন (${selectedArtworkIds.length})`,
      onConfirm: () => {
        deleteArtworks(selectedArtworkIds);
        setSelectedArtworkIds([]);
      },
    });
  };

  const handleMoveArtwork = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= artworks.length) return;
    const nextList = [...artworks];
    const [moved] = nextList.splice(fromIdx, 1);
    nextList.splice(toIdx, 0, moved);
    reorderArtworks(nextList);
  };

  const handleSetArtworkSerial = (artId: string, targetSerial: number) => {
    if (isNaN(targetSerial) || targetSerial < 1) return;
    const currentIdx = artworks.findIndex((a) => a.id === artId);
    if (currentIdx === -1) return;
    const targetIdx = Math.max(0, Math.min(artworks.length - 1, targetSerial - 1));
    if (currentIdx === targetIdx) return;
    handleMoveArtwork(currentIdx, targetIdx);
  };

  // Media tab states & functions
  const [mediaSearchQuery, setMediaSearchQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState<"all" | "in-carousel" | "available">("all");
  const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState(false);
  const [activeCoreImageModal, setActiveCoreImageModal] = useState<"logo" | "hero" | "story" | null>(null);
  const [newSlideData, setNewSlideData] = useState<{
    title: string;
    titleBangla: string;
    image: string;
    category: ArtworkCategory;
    price: number;
    dimensions: string;
  }>({
    title: "",
    titleBangla: "",
    image: "",
    category: "calligraphy",
    price: 4500,
    dimensions: '20" x 28" inches',
  });

  const handleMoveHeroSlide = (currentIndex: number, newIndex: number) => {
    const rawIds = settings.heroCarouselArtworkIds || artworks.slice(0, 8).map((a) => a.id);
    const validArtIds = new Set(artworks.map((a) => a.id));
    const heroIds = rawIds.filter((id) => validArtIds.has(id));
    if (newIndex < 0 || newIndex >= heroIds.length) return;
    const [movedId] = heroIds.splice(currentIndex, 1);
    heroIds.splice(newIndex, 0, movedId);
    setHeroCarouselArtworkIds(heroIds);
    showToast(`স্লাইড ক্রমানুসারে সাজানো হয়েছে! (Slide #${currentIndex + 1} → #${newIndex + 1})`, "success");
  };

  const handleAddPresetToHeroCarousel = (preset: { id: number; path: string; label: string }) => {
    // Check if an artwork with this image already exists
    const existing = artworks.find((a) => a.image === preset.path);
    if (existing) {
      toggleHeroCarouselArtwork(existing.id);
      return;
    }

    // Otherwise create a new Artwork from this preset and add to carousel!
    const newArt = addArtwork({
      title: preset.label,
      titleBangla: preset.label,
      category: "calligraphy",
      price: 4500,
      dimensions: '20" x 28" inches',
      image: preset.path,
      description: `Tiyana's Sukoon Authentic Studio Artwork - ${preset.label}`,
      medium: "Mixed Media on Canvas with 24K Gold Leaf",
      inStock: true,
      isFeatured: true,
    });

    const rawIds = settings.heroCarouselArtworkIds || artworks.slice(0, 8).map((a) => a.id);
    const validArtIds = new Set(artworks.map((a) => a.id));
    const current = rawIds.filter((id) => validArtIds.has(id));
    if (!current.includes(newArt.id)) {
      setHeroCarouselArtworkIds([...current, newArt.id]);
    }
    showToast(`"${preset.label}" আর্টওয়ার্ক হিসেবে সেভ করে হিরো ক্যারোজেলে যুক্ত করা হয়েছে! ✓`, "success");
  };

  const handleCreateNewSlide = () => {
    if (!newSlideData.image) {
      showToast("দয়া করে স্লাইডের জন্য একটি ছবি নির্বাচন বা আপলোড করুন!", "error");
      return;
    }
    const title = newSlideData.title.trim() || "Tiyana's Sukoon Studio Piece";
    const newArt = addArtwork({
      title,
      titleBangla: newSlideData.titleBangla.trim() || undefined,
      category: newSlideData.category,
      price: Number(newSlideData.price) || 4500,
      dimensions: newSlideData.dimensions.trim() || '20" x 28" inches',
      image: newSlideData.image,
      description: `Tiyana's Sukoon Studio Islamic Artwork: ${title}`,
      medium: "Mixed Media on Canvas with Gold Leaf",
      inStock: true,
      isFeatured: true,
    });

    const rawIds = settings.heroCarouselArtworkIds || artworks.slice(0, 8).map((a) => a.id);
    const validArtIds = new Set(artworks.map((a) => a.id));
    const current = rawIds.filter((id) => validArtIds.has(id));
    if (!current.includes(newArt.id)) {
      setHeroCarouselArtworkIds([...current, newArt.id]);
    }
    setIsAddSlideModalOpen(false);
    setNewSlideData({
      title: "",
      titleBangla: "",
      image: "",
      category: "calligraphy",
      price: 4500,
      dimensions: '20" x 28" inches',
    });
    showToast(`নতুন স্লাইড "${title}" সফলভাবে তৈরি ও হিরো ক্যারোজেলে যুক্ত হয়েছে! ✓`, "success");
  };

  // Supabase management states
  const [supabaseUrlInput, setSupabaseUrlInput] = useState("");
  const [supabaseKeyInput, setSupabaseKeyInput] = useState("");
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{
    success: boolean;
    message: string;
    artworksCount?: number;
    tablesMissing?: boolean;
  } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Store Configuration form state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleSaveStoreSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    updateSettings(settingsForm, true);
    setIsSavingSettings(false);
    setSettingsSavedSuccess(true);
    showToast("স্টোর সেটিংস সফলভাবে ক্লাউড ডাটাবেস ও লাইভ সাইটে সেভ হয়েছে! ✓", "success");
    setTimeout(() => setSettingsSavedSuccess(false), 3500);
  };

  // Load configured Supabase credentials
  useEffect(() => {
    if (isAuthenticated) {
      const cfg = getSupabaseConfig();
      if (cfg.url) setSupabaseUrlInput(cfg.url);
      if (cfg.anonKey) setSupabaseKeyInput(cfg.anonKey);
    }
  }, [isAuthenticated]);

  const handleSaveSupabaseConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
      showToast("Please provide both Supabase Project URL and Anon Public Key", "error");
      return;
    }
    setSupabaseLoading(true);
    saveSupabaseConfig(supabaseUrlInput.trim(), supabaseKeyInput.trim());
    const res = await testSupabaseConnection();
    setSupabaseTestResult(res);
    setSupabaseLoading(false);
    if (res.success) {
      showToast("Supabase connected successfully!", "success");
      await syncWithSupabase();
    } else {
      showToast(res.message, "error");
    }
  };

  const handleTestSupabase = async () => {
    setSupabaseLoading(true);
    const res = await testSupabaseConnection();
    setSupabaseTestResult(res);
    setSupabaseLoading(false);
    if (res.success) {
      showToast(`Connected! Found ${res.artworksCount ?? 0} artworks in Supabase.`, "success");
      await syncWithSupabase();
    } else {
      showToast(res.message, "error");
    }
  };

  const handleDisconnectSupabase = () => {
    clearSupabaseConfig();
    setSupabaseUrlInput("");
    setSupabaseKeyInput("");
    setSupabaseTestResult(null);
    showToast("Supabase disconnected. Switched to offline LocalStorage mode.", "info");
    window.location.reload();
  };

  const handleSeedArtworks = async () => {
    setIsSeeding(true);
    const res = await seedSupabaseArtworks();
    setIsSeeding(false);
    if (res.success) {
      showToast(`Successfully seeded ${res.count} artworks to Supabase!`, "success");
      await handleTestSupabase();
    } else {
      showToast(`Seeding failed: ${res.error}`, "error");
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setSqlCopied(true);
    showToast("SQL Schema copied to clipboard!", "success");
    setTimeout(() => setSqlCopied(false), 3000);
  };

  // New artwork form state
  const [newArtForm, setNewArtForm] = useState({
    title: "",
    titleBangla: "",
    category: "calligraphy" as ArtworkCategory,
    price: 3400,
    originalPrice: 4000,
    dimensions: '16" x 20" inches',
    medium: "Custom Desert Sand Texture Art, Acrylic Colours & Arabic Calligraphy",
    finish: "✨ Gloss Varnished Finish",
    spiritualMessage: "সৃষ্টির অনিষ্ট থেকে মহান আল্লাহর আশ্রয় প্রার্থনার শিক্ষা দেয় এই সূরা।",
    image: "/artwork/artwork_4.jpg",
    images: [] as string[],
    description: "মরুভূমির সোনালি গোধূলি, খেজুরগাছ ও ক্যাকটাসের আবহে ফুটে উঠেছে পবিত্র ক্যালিগ্রাফি।",
    badge: "New Arrival",
    inStock: true,
    isFeatured: true,
  });

  // Supabase Auth Login
  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword) {
      setAuthError("Please provide both email and password.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);

    // Fallback: If studio emergency PIN is entered
    if (adminPassword === settings.adminPin || adminPassword === "sukoon2026") {
      setAuthLoading(false);
      setIsAuthenticated(true);
      showToast("Admin session unlocked", "success");
      return;
    }

    const res = await signInAdminUser(adminEmail, adminPassword);
    setAuthLoading(false);

    if (res.error) {
      setAuthError(
        res.error.message ||
          "Authentication failed. Please check your email and password."
      );
      showToast(res.error.message || "Login failed.", "error");
    } else if (res.data?.user) {
      setCurrentAdminUser(res.data.user);
      setIsAuthenticated(true);
      showToast(`Welcome back, ${res.data.user.email}!`, "success");
    }
  };

  // Sign out / Lock Session
  const handleLogout = async () => {
    await signOutAdminUser();
    setIsAuthenticated(false);
    setCurrentAdminUser(null);
    setAdminPassword("");
    showToast("Session locked. Signed out securely.", "info");
  };

  // Auth Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050e08] flex items-center justify-center p-4 linear-grid-gold">
        <div className="w-full max-w-lg linear-card p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-6 text-center animate-fadeIn">
          {/* Emblem Brand Logo */}
          <div className="relative w-16 h-16 mx-auto rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#f5d77f] to-[#10b981] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#06110a]">
              <Image
                src={settings.siteLogo || "/brand/logo.jpg"}
                alt="Tiyana's Sukoon Logo"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0d2218] border border-[#d4af37]/40 text-xs font-mono text-[#f4dc8a] mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Studio Portal Access</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Tiyana&apos;s Sukoon Admin
            </h2>
            <p className="text-xs text-[#8fa89a] mt-1">
              Secure administrative access for managing artworks, customer orders, and media.
            </p>
          </div>

          {/* SUPABASE AUTH FORM */}
          <form onSubmit={handleSupabaseLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#c4d7cc]">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8fa89a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="rasidulcodemoly@gmail.com"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#08170f] text-xs text-white border border-white/10 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#c4d7cc]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8fa89a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#08170f] text-xs text-white border border-white/10 focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fa89a] hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <p className="font-semibold">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full btn-3d-gold py-3 text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{authLoading ? "Verifying..." : "Sign In to Admin Portal"}</span>
            </button>
          </form>

          <div className="pt-2 border-t border-white/5 flex items-center justify-center text-xs text-[#758a7e]">
            <Link href="/" className="hover:text-white flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Key Dashboard Stats
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  ).length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status === "new").length;

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderFilter === "all" || o.status === orderFilter;
    const matchesQuery =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    return matchesStatus && matchesQuery;
  });

  const filteredArtworks = artworks.filter((a) => {
    const matchesCategory =
      artworkCategoryFilter === "all" || a.category === artworkCategoryFilter;
    const matchesQuery =
      a.title.toLowerCase().includes(artworkSearch.toLowerCase()) ||
      (a.titleBangla &&
        a.titleBangla.toLowerCase().includes(artworkSearch.toLowerCase())) ||
      a.description.toLowerCase().includes(artworkSearch.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // WhatsApp Order Update Sender
  const sendWhatsAppUpdate = (order: Order) => {
    const statusMessages: Record<OrderStatus, string> = {
      pending: "Your order is received and queued for review.",
      confirmed: "Your order has been confirmed by our master artist.",
      painting:
        "Your artwork is currently on the easel! Our artist is applying hand-lettering and 24K gold foil.",
      framing:
        "Your canvas painting has finished drying and is now in custom framing & corner inspection.",
      shipped: `Your package has been dispatched via courier! Tracking details will be provided shortly.`,
      delivered:
        "Your artwork has been marked as delivered. May it bring immense peace (Sukoon) to your home!",
      cancelled: "Your order has been cancelled.",
    };

    const text = `Assalamu Alaikum ${order.customerName}!
Update from Tiyana's Sukoon regarding Order #${order.orderNumber}:

Status: *${order.status.toUpperCase()}*
${statusMessages[order.status]}

Total Payable: ৳${order.totalAmount.toLocaleString()} BDT
Payment Mode: ${order.paymentMethod.toUpperCase()}

If you have any questions or would like preview photos of your canvas, reply to this chat!`;

    window.open(
      `https://wa.me/88${order.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        text
      )}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-[#050e08] text-[#f4f8f5] flex flex-col">
      {/* Top Admin App Header (Linear Style) */}
      <header className="bg-[#07160f] border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d4af37]/40">
              <Image
                src={settings.siteLogo || "/brand/logo.jpg"}
                alt="Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white group-hover:text-[#f4dc8a]">
                  Tiyana&apos;s Sukoon
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Admin System
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3">
          {/* Supabase status indicator pill */}
          <button
            onClick={() => setActiveTab("supabase")}
            className={`px-2.5 py-1 text-xs rounded-lg border flex items-center gap-2 transition-all ${
              supabaseStatus === "connected"
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40"
                : "bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/40"
            }`}
            title="Click to configure Supabase Cloud Database"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[11px]">
              {supabaseStatus === "connected" ? "Supabase: Live Cloud" : "Supabase: Offline / Setup"}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                supabaseStatus === "connected"
                  ? "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
                  : "bg-amber-400"
              }`}
            />
          </button>

          <Link
            href="/"
            className="btn-3d-dark px-3 py-1.5 text-xs text-[#c4d7cc] flex items-center gap-1.5"
            target="_blank"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          {currentAdminUser?.email && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-xs text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] truncate max-w-[170px]">
                {currentAdminUser.email}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="btn-3d-danger px-3 py-1.5 text-xs flex items-center gap-1.5"
            title="Lock session & sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Session</span>
          </button>
        </div>
      </header>

      {/* Admin Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#07150e] border-r border-white/5 p-4 space-y-1 shrink-0">
          <div className="pb-3 px-2 text-[10px] uppercase font-mono tracking-wider text-[#8fa89a]">
            Studio Operations
          </div>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "dashboard"
                ? "bg-[#102d1d] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
                : "text-[#9cb5a6] hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("artworks")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "artworks"
                ? "bg-[#102d1d] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
                : "text-[#9cb5a6] hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4" />
              <span>Artwork Catalog ({artworks.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("media")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "media"
                ? "bg-[#102d1d] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
                : "text-[#9cb5a6] hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4" />
              <span>Site Images &amp; Media</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#d4af37]/20 text-[#f4dc8a]">
              Edit All
            </span>
          </button>

          <button
            onClick={() => setActiveTab("cms")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "cms"
                ? "bg-[#102d1d] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
                : "text-[#9cb5a6] hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-[#d4af37]" />
              <span>Pages &amp; Sections CMS</span>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#d4af37]/25 text-[#f4dc8a] border border-[#d4af37]/30">
              CMS
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "orders"
                ? "bg-[#102d1d] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
                : "text-[#9cb5a6] hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Studio Orders</span>
            </div>
            {activeOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#d4af37] text-[#06110a] font-bold">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "inquiries"
                ? "bg-[#102d1d] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
                : "text-[#9cb5a6] hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4" />
              <span>Custom Inquiries</span>
            </div>
            {pendingInquiriesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                {pendingInquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "settings"
                ? "bg-[#102d1d] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
                : "text-[#9cb5a6] hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Configuration</span>
          </button>

          <div className="pt-2">
            <div className="pb-2 px-2 text-[10px] uppercase font-mono tracking-wider text-[#8fa89a]">
              Cloud Database
            </div>
            <button
              onClick={() => setActiveTab("supabase")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "supabase"
                  ? "bg-[#102d1d] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
                  : "text-[#9cb5a6] hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-[#d4af37]" />
                <span>Supabase Cloud DB</span>
              </div>
              {supabaseStatus === "connected" ? (
                <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Offline
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Studio Operations Dashboard
                </h2>
                <p className="text-xs text-[#8fa89a] mt-0.5">
                  Live metrics, active orders, and sales activity for Tiyana&apos;s Sukoon.
                </p>
              </div>

              {/* 4 Linear Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="linear-card p-5 rounded-2xl space-y-2 border border-[#d4af37]/30">
                  <div className="flex items-center justify-between text-[#8fa89a]">
                    <span className="text-xs font-medium">Total Orders Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <p className="text-2xl font-extrabold text-[#fceb9e]">
                    ৳{totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Calculated from {orders.length} orders</span>
                  </p>
                </div>

                <div className="linear-card p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[#8fa89a]">
                    <span className="text-xs font-medium">Active In-Studio Orders</span>
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">
                    {activeOrdersCount}
                  </p>
                  <p className="text-[11px] text-[#8fa89a]">
                    Painting, framing or ready to ship
                  </p>
                </div>

                <div className="linear-card p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[#8fa89a]">
                    <span className="text-xs font-medium">Published Artworks</span>
                    <Palette className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">
                    {artworks.length}
                  </p>
                  <p className="text-[11px] text-[#8fa89a]">
                    All {artworks.length} items fully editable
                  </p>
                </div>

                <div className="linear-card p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[#8fa89a]">
                    <span className="text-xs font-medium">Custom Inquiries</span>
                    <Sparkles className="w-4 h-4 text-[#34d399]" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">
                    {inquiries.length}
                  </p>
                  <p className="text-[11px] text-emerald-400">
                    {pendingInquiriesCount} pending response
                  </p>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="linear-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">
                    Recent Studio Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-[#f4dc8a] hover:underline"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[#8fa89a]">
                        <th className="pb-3 font-mono">Order #</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Items</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#8fa89a]">
                            No studio orders yet. Orders placed by customers will appear here.
                          </td>
                        </tr>
                      ) : (
                        orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/5">
                          <td className="py-3 font-mono font-bold text-[#f4dc8a]">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3">
                            <p className="font-semibold text-white">
                              {ord.customerName}
                            </p>
                            <p className="text-[11px] text-[#8fa89a]">
                              {ord.phone}
                            </p>
                          </td>
                          <td className="py-3 max-w-[200px] truncate text-[#c4d7cc]">
                            {ord.items.map((i) => i.artwork.title).join(", ")}
                          </td>
                          <td className="py-3 font-bold text-[#fceb9e]">
                            ৳{ord.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                ord.status === "delivered"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : ord.status === "shipped"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : ord.status === "painting" ||
                                    ord.status === "framing"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => setSelectedOrderForInvoice(ord)}
                              className="p-1.5 rounded-lg bg-[#0b1f14] text-[#8fa89a] hover:text-white"
                              title="Print Invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => sendWhatsAppUpdate(ord)}
                              className="p-1.5 rounded-lg bg-[#0b1f14] text-emerald-400 hover:text-emerald-300"
                              title="Send WhatsApp Update"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARTWORK CATALOG CRUD (WITH FULL IMAGE EDITING, TABLE/GRID VIEW, REORDERING & BULK ACTIONS) */}
          {activeTab === "artworks" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Artwork &amp; Product Catalog ({artworks.length} items)
                  </h2>
                  <p className="text-xs text-[#8fa89a]">
                    Manage artworks, reorder serial numbers, switch between grid/table view, or bulk delete.
                  </p>
                </div>

                <div className="flex items-center flex-wrap gap-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#8fa89a] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search artworks..."
                      value={artworkSearch}
                      onChange={(e) => setArtworkSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-[#091d12] border border-white/10 text-xs text-white placeholder-[#6b8275] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  {/* View Mode Switcher */}
                  <div className="flex items-center bg-[#07160f] p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => changeArtworkViewMode("grid")}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        artworkViewMode === "grid"
                          ? "bg-[#d4af37] text-[#06110a] shadow-sm"
                          : "text-[#8fa89a] hover:text-white"
                      }`}
                      title="গ্রিড ভিউ (Grid View)"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => changeArtworkViewMode("table")}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        artworkViewMode === "table"
                          ? "bg-[#d4af37] text-[#06110a] shadow-sm"
                          : "text-[#8fa89a] hover:text-white"
                      }`}
                      title="টেবিল / লিস্ট ভিউ (Table / List View)"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Table</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsAddingArtwork(true)}
                    className="btn-3d-gold px-3.5 py-1.5 text-xs flex items-center gap-1.5 font-bold whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 text-[#0f1811]" />
                    <span>Add New</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills & Selection Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: "all", label: "All Items" },
                    { id: "calligraphy", label: "Arabic Calligraphy" },
                    { id: "canvas", label: "Canvas Paintings" },
                    { id: "mini-easels", label: "Mini Easels" },
                    { id: "custom-orders", label: "Custom Orders" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setArtworkCategoryFilter(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        artworkCategoryFilter === c.id
                          ? "bg-[#d4af37] text-[#06110a]"
                          : "bg-[#091d12] text-[#8fa89a] hover:text-white"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => selectAllFilteredArtworks(filteredArtworks)}
                    className="text-xs text-[#d4af37] hover:underline flex items-center gap-1.5 bg-[#091d12] px-2.5 py-1.5 rounded-lg border border-white/10"
                  >
                    {filteredArtworks.length > 0 &&
                    filteredArtworks.every((a) => selectedArtworkIds.includes(a.id)) ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Deselect All</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-3.5 h-3.5" />
                        <span>Select All ({filteredArtworks.length})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bulk Action Bar */}
              {selectedArtworkIds.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/50 via-[#0d2218] to-[#091d12] border border-rose-500/30 text-white animate-fadeIn shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center">
                      {selectedArtworkIds.length}
                    </span>
                    <span className="text-xs font-semibold text-rose-100">
                      {selectedArtworkIds.length}টি আর্টওয়ার্ক সিলেক্ট করা হয়েছে
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedArtworkIds([])}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#c4d7cc] text-xs font-medium transition-all"
                    >
                      Cancel Selection
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkDeleteArtworks}
                      className="px-4 py-1.5 rounded-xl border border-rose-500/40 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-950/50 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Selected ({selectedArtworkIds.length})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TABLE / LIST VIEW */}
              {artworkViewMode === "table" ? (
                <div className="linear-card rounded-2xl overflow-hidden border border-white/10">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#091b11] border-b border-white/10 text-[#8fa89a]">
                        <tr>
                          <th className="p-3 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={
                                filteredArtworks.length > 0 &&
                                filteredArtworks.every((a) =>
                                  selectedArtworkIds.includes(a.id)
                                )
                              }
                              onChange={() => selectAllFilteredArtworks(filteredArtworks)}
                              className="rounded bg-[#07160f] border-white/20 text-[#d4af37] w-4 h-4 cursor-pointer"
                              title="Select All Filtered"
                            />
                          </th>
                          <th className="p-3 font-mono text-center w-28">সিরিয়াল #</th>
                          <th className="p-3 w-16">ছবি</th>
                          <th className="p-3 min-w-[200px]">ক্যালিগ্রাফি / টাইটেল</th>
                          <th className="p-3">ক্যাটাগরি</th>
                          <th className="p-3">মূল্য (৳)</th>
                          <th className="p-3">স্টক স্ট্যাটাস</th>
                          <th className="p-3 text-center">হিরো ক্যারোজেল</th>
                          <th className="p-3 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredArtworks.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-[#8fa89a]">
                              No artworks matching your criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredArtworks.map((art) => {
                            const globalIdx = artworks.findIndex((a) => a.id === art.id);
                            const serialNo = globalIdx + 1;
                            const isSelected = selectedArtworkIds.includes(art.id);

                            return (
                              <tr
                                key={art.id}
                                className={`transition-colors ${
                                  isSelected
                                    ? "bg-rose-500/10 hover:bg-rose-500/15"
                                    : "hover:bg-white/5"
                                }`}
                              >
                                {/* Checkbox */}
                                <td className="p-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelectArtwork(art.id)}
                                    className="rounded bg-[#07160f] border-white/20 text-[#d4af37] w-4 h-4 cursor-pointer"
                                  />
                                </td>

                                {/* Serial Reordering Stepper & Direct Input */}
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <div className="flex flex-col gap-0.5">
                                      <button
                                        type="button"
                                        disabled={globalIdx === 0}
                                        onClick={() => handleMoveArtwork(globalIdx, globalIdx - 1)}
                                        className="p-0.5 rounded hover:bg-white/10 text-[#8fa89a] hover:text-[#d4af37] disabled:opacity-20 disabled:hover:text-[#8fa89a]"
                                        title="Move Up (১ ধাপ উপরে)"
                                      >
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={globalIdx === artworks.length - 1}
                                        onClick={() => handleMoveArtwork(globalIdx, globalIdx + 1)}
                                        className="p-0.5 rounded hover:bg-white/10 text-[#8fa89a] hover:text-[#d4af37] disabled:opacity-20 disabled:hover:text-[#8fa89a]"
                                        title="Move Down (১ ধাপ নিচে)"
                                      >
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    <input
                                      type="number"
                                      min={1}
                                      max={artworks.length}
                                      defaultValue={serialNo}
                                      key={serialNo}
                                      onBlur={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        if (!isNaN(val) && val !== serialNo) {
                                          handleSetArtworkSerial(art.id, val);
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          const val = parseInt((e.target as HTMLInputElement).value, 10);
                                          if (!isNaN(val) && val !== serialNo) {
                                            handleSetArtworkSerial(art.id, val);
                                          }
                                        }
                                      }}
                                      className="w-11 px-1.5 py-1 text-center font-mono font-bold text-xs bg-[#07160f] border border-white/15 rounded-lg text-[#f4dc8a] focus:outline-none focus:border-[#d4af37]"
                                      title="যেকোনো সিরিয়াল নম্বর লিখে Enter চাপুন"
                                    />
                                  </div>
                                </td>

                                {/* Thumbnail */}
                                <td className="p-3">
                                  <div
                                    onClick={() => setEditingArtwork(art)}
                                    className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#07160f] border border-white/10 cursor-pointer group"
                                    title="Click to edit image"
                                  >
                                    <Image
                                      src={art.image}
                                      alt={art.title}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform"
                                    />
                                  </div>
                                </td>

                                {/* Title & Bangla Title */}
                                <td className="p-3">
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-white text-xs line-clamp-1">
                                      {art.title}
                                    </p>
                                    {art.titleBangla && (
                                      <p className="text-[11px] text-[#8fa89a] line-clamp-1 font-serif">
                                        {art.titleBangla}
                                      </p>
                                    )}
                                    <p className="text-[10px] text-[#6b8275]">{art.dimensions}</p>
                                  </div>
                                </td>

                                {/* Category & Badge */}
                                <td className="p-3 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#06110a] text-[#f4dc8a] border border-[#d4af37]/30">
                                    {art.category}
                                  </span>
                                  {art.badge && (
                                    <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                      {art.badge}
                                    </span>
                                  )}
                                </td>

                                {/* Price */}
                                <td className="p-3 whitespace-nowrap">
                                  <p className="font-bold text-sm text-[#fceb9e]">
                                    ৳{art.price.toLocaleString()}
                                  </p>
                                  {art.originalPrice && (
                                    <p className="text-[10px] text-[#8fa89a] line-through">
                                      ৳{art.originalPrice.toLocaleString()}
                                    </p>
                                  )}
                                </td>

                                {/* In Stock toggle */}
                                <td className="p-3 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateArtwork(art.id, { inStock: !art.inStock })
                                    }
                                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                                      art.inStock
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
                                    }`}
                                    title="Click to toggle stock"
                                  >
                                    ● {art.inStock ? "In Stock" : "Out of Stock"}
                                  </button>
                                </td>

                                {/* Hero Carousel Toggle */}
                                <td className="p-3 text-center whitespace-nowrap">
                                  {(() => {
                                    const heroIds =
                                      settings.heroCarouselArtworkIds ||
                                      artworks.slice(0, 8).map((a) => a.id);
                                    const inHero = heroIds.includes(art.id);
                                    const heroSlideIndex = heroIds.indexOf(art.id);
                                    return (
                                      <button
                                        type="button"
                                        onClick={() => toggleHeroCarouselArtwork(art.id)}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 mx-auto transition-all ${
                                          inHero
                                            ? "bg-[#d4af37]/25 text-[#f4dc8a] border border-[#d4af37]/50 shadow-sm"
                                            : "bg-[#07160f] text-[#6b8275] border border-white/10 hover:text-white hover:border-white/20"
                                        }`}
                                        title={
                                          inHero
                                            ? "হিরো ক্যারোজেল থেকে বাদ দিতে ক্লিক করুন"
                                            : "হিরো ক্যারোজেলে যুক্ত করতে ক্লিক করুন"
                                        }
                                      >
                                        <Sparkles className="w-3 h-3 text-[#d4af37]" />
                                        <span>
                                          {inHero
                                            ? `In Slide #${heroSlideIndex + 1}`
                                            : "+ Add to Hero"}
                                        </span>
                                      </button>
                                    );
                                  })()}
                                </td>

                                {/* Actions */}
                                <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                                  <button
                                    onClick={() => setEditingArtwork(art)}
                                    className="p-1.5 rounded-lg bg-[#07160f] text-[#f4dc8a] hover:bg-[#d4af37]/20 border border-white/10"
                                    title="Edit Artwork & Image"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      requestConfirm({
                                        title: "আর্টওয়ার্ক মুছে ফেলুন (Delete Artwork)",
                                        message: "আপনি কি নিশ্চিত এই আর্টওয়ার্কটি ক্যাটালগ ও ক্লাউড ডাটাবেস থেকে স্থায়ীভাবে মুছে ফেলতে চান?",
                                        itemName: art.title,
                                        confirmLabel: "হ্যাঁ, মুছে ফেলুন",
                                        onConfirm: () => deleteArtwork(art.id),
                                      });
                                    }}
                                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                                    title="Delete Artwork"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* GRID VIEW WITH CHECKBOX & SERIAL STEPPER */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArtworks.map((art) => {
                    const globalIdx = artworks.findIndex((a) => a.id === art.id);
                    const serialNo = globalIdx + 1;
                    const isSelected = selectedArtworkIds.includes(art.id);

                    return (
                      <div
                        key={art.id}
                        className={`linear-card rounded-2xl overflow-hidden flex flex-col justify-between border transition-all group ${
                          isSelected
                            ? "border-rose-500/60 ring-2 ring-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.2)]"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div>
                          {/* Image Preview with quick replace, selection checkbox & serial controls */}
                          <div className="relative aspect-[16/10] w-full bg-[#08170f] overflow-hidden">
                            <Image
                              src={art.image}
                              alt={art.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Top Left: Checkbox & Category */}
                            <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                              <label
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded-lg bg-[#06110a]/90 backdrop-blur-sm border border-white/20 hover:border-[#d4af37] cursor-pointer flex items-center justify-center transition-all shadow-md"
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectArtwork(art.id)}
                                  className="rounded bg-[#07160f] border-white/20 text-[#d4af37] w-4 h-4 cursor-pointer"
                                />
                              </label>

                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#06110a]/90 text-[#f4dc8a] border border-[#d4af37]/30 backdrop-blur-sm">
                                {art.category}
                              </span>
                              {art.badge && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/80 text-white backdrop-blur-sm">
                                  {art.badge}
                                </span>
                              )}
                            </div>

                            {/* Top Right: Serial Stepper & Direct Serial Input */}
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute top-2 right-2 flex items-center gap-1 p-1 rounded-xl bg-[#06110a]/90 backdrop-blur-sm border border-white/15 z-10 shadow-md"
                            >
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  disabled={globalIdx === 0}
                                  onClick={() => handleMoveArtwork(globalIdx, globalIdx - 1)}
                                  className="text-[#8fa89a] hover:text-[#d4af37] disabled:opacity-20 leading-none"
                                  title="Move Up (১ ধাপ উপরে)"
                                >
                                  <ChevronUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={globalIdx === artworks.length - 1}
                                  onClick={() => handleMoveArtwork(globalIdx, globalIdx + 1)}
                                  className="text-[#8fa89a] hover:text-[#d4af37] disabled:opacity-20 leading-none"
                                  title="Move Down (১ ধাপ নিচে)"
                                >
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                              </div>

                              <input
                                type="number"
                                min={1}
                                max={artworks.length}
                                defaultValue={serialNo}
                                key={serialNo}
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val !== serialNo) {
                                    handleSetArtworkSerial(art.id, val);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    const val = parseInt((e.target as HTMLInputElement).value, 10);
                                    if (!isNaN(val) && val !== serialNo) {
                                      handleSetArtworkSerial(art.id, val);
                                    }
                                  }
                                }}
                                className="w-10 px-1 py-0.5 text-center font-mono font-bold text-[11px] bg-[#07160f] border border-white/10 rounded text-[#f4dc8a] focus:outline-none focus:border-[#d4af37]"
                                title="সিরিয়াল নম্বর লিখে Enter চাপুন"
                              />
                            </div>

                            {/* Bottom Left: Hero Carousel Slide Toggle */}
                            {(() => {
                              const heroIds =
                                settings.heroCarouselArtworkIds ||
                                artworks.slice(0, 8).map((a) => a.id);
                              const inHero = heroIds.includes(art.id);
                              const heroSlideIndex = heroIds.indexOf(art.id);
                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleHeroCarouselArtwork(art.id);
                                  }}
                                  className={`absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 backdrop-blur-md transition-all shadow-md ${
                                    inHero
                                      ? "bg-[#d4af37]/90 text-[#07160f] border border-[#f4dc8a] shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                                      : "bg-[#06110a]/85 text-[#8fa89a] border border-white/15 hover:text-white hover:border-white/30"
                                  }`}
                                  title={
                                    inHero
                                      ? "হিরো ক্যারোজেল থেকে বাদ দিন"
                                      : "হিরো ক্যারোজেল স্লাইডারে যুক্ত করুন"
                                  }
                                >
                                  <Sparkles
                                    className={`w-3 h-3 ${
                                      inHero ? "text-[#07160f]" : "text-[#d4af37]"
                                    }`}
                                  />
                                  <span>
                                    {inHero
                                      ? `In Hero #${heroSlideIndex + 1}`
                                      : "+ Hero Slide"}
                                  </span>
                                </button>
                              );
                            })()}

                            <button
                              onClick={() => setEditingArtwork(art)}
                              className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-[#06110a]/85 text-[#f4dc8a] border border-white/10 hover:border-[#d4af37] flex items-center gap-1 text-[11px] font-medium backdrop-blur-sm"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Image</span>
                            </button>
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-[#8fa89a]">
                              <span>{art.dimensions}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateArtwork(art.id, { inStock: !art.inStock })
                                }
                                className={`text-[11px] font-semibold transition-colors ${
                                  art.inStock
                                    ? "text-emerald-400 hover:text-emerald-300"
                                    : "text-rose-400 hover:text-rose-300"
                                }`}
                                title="Click to toggle stock status"
                              >
                                ● {art.inStock ? "In Stock" : "Out of Stock"}
                              </button>
                            </div>

                            <h4 className="font-bold text-sm text-white line-clamp-1">
                              {art.title}
                            </h4>

                            {art.titleBangla && (
                              <p className="text-xs text-[#8fa89a] line-clamp-1 font-serif">
                                {art.titleBangla}
                              </p>
                            )}

                            <p className="text-xs text-[#9cb5a6] line-clamp-2">
                              {art.description}
                            </p>

                            {art.spiritualMessage && (
                              <p className="text-[10px] text-[#fceb9e] bg-[#07160f] p-1.5 rounded border border-white/5 line-clamp-1">
                                {art.spiritualMessage}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="p-4 pt-2 border-t border-white/5 space-y-3">
                          <div className="flex items-baseline justify-between">
                            <span className="text-lg font-bold text-[#fceb9e]">
                              ৳{art.price.toLocaleString()}
                            </span>
                            {art.originalPrice && (
                              <span className="text-xs text-[#8fa89a] line-through">
                                ৳{art.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingArtwork(art)}
                              className="flex-1 btn-3d-dark py-2 text-xs flex items-center justify-center gap-1.5 font-semibold text-[#f4dc8a]"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Artwork &amp; Image</span>
                            </button>
                            <button
                              onClick={() => {
                                requestConfirm({
                                  title: "আর্টওয়ার্ক মুছে ফেলুন (Delete Artwork)",
                                  message: "আপনি কি নিশ্চিত এই আর্টওয়ার্কটি ক্যাটালগ ও ক্লাউড ডাটাবেস থেকে স্থায়ীভাবে মুছে ফেলতে চান?",
                                  itemName: art.title,
                                  confirmLabel: "হ্যাঁ, মুছে ফেলুন",
                                  onConfirm: () => deleteArtwork(art.id),
                                });
                              }}
                              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                              title="Delete Artwork"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SITE MEDIA & IMAGES MANAGER */}
          {activeTab === "media" && (() => {
            const heroIds = (
              settings.heroCarouselArtworkIds ||
              artworks.slice(0, 8).map((a) => a.id)
            ).filter((id) => artworks.some((a) => a.id === id));

            const activeHeroArtworks = heroIds
              .map((id) => artworks.find((a) => a.id === id))
              .filter((a): a is Artwork => Boolean(a));

            const unselectedArtworks = artworks.filter(
              (art) => !heroIds.includes(art.id)
            );

            const filteredPresets = GALLERY_IMAGE_PRESETS.filter((preset) => {
              const query = mediaSearchQuery.toLowerCase().trim();
              const matchesSearch =
                query === "" ||
                preset.label.toLowerCase().includes(query) ||
                preset.id.toString() === query;

              if (!matchesSearch) return false;

              const isPresetInHero = artworks.some(
                (art) => art.image === preset.path && heroIds.includes(art.id)
              );

              if (mediaFilter === "in-carousel") return isPresetInHero;
              if (mediaFilter === "available") return !isPresetInHero;
              return true;
            });

            return (
              <div className="space-y-10 animate-fadeIn pb-12">
                {/* STUDIO MEDIA HEADER BANNER */}
                <div className="linear-card p-6 rounded-3xl border border-[#d4af37]/30 bg-gradient-to-r from-[#0d2719] via-[#091e13] to-[#07160f] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d4af37]/20 text-[#f4dc8a] border border-[#d4af37]/40 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-[#d4af37]" />
                          Studio Media Hub
                        </span>
                        <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                          <Cloud className="w-3 h-3" />
                          Live Cloud Sync
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Website Images &amp; Media Control Center
                      </h2>
                      <p className="text-xs sm:text-sm text-[#9cb5a6] leading-relaxed">
                        হোমপেজ হিরো স্লাইডার, ব্র্যান্ড লোগো, ৩ডি আর্ট ফ্রেম এবং ২১টি আসল ফেসবুক ফটো লাইব্রেরি এক জায়গা থেকে পরিচালনা করুন।
                      </p>
                    </div>

                    {/* Quick Section Anchor Pills */}
                    <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                      <a
                        href="#hero-carousel-section"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#113121] text-[#f4dc8a] border border-[#d4af37]/30 hover:border-[#d4af37] flex items-center justify-between gap-3 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                          হিরো ক্যারোজেল স্লাইডার
                        </span>
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#06110a] text-white">
                          {activeHeroArtworks.length}
                        </span>
                      </a>
                      <a
                        href="#core-images-section"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0d2418] text-[#c4d7cc] border border-white/10 hover:border-white/20 flex items-center justify-between gap-3 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                          কোর ব্র্যান্ড ইমেজেস
                        </span>
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#06110a] text-white">
                          3
                        </span>
                      </a>
                      <a
                        href="#gallery-assets-section"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0d2418] text-[#c4d7cc] border border-white/10 hover:border-white/20 flex items-center justify-between gap-3 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <LayoutGrid className="w-3.5 h-3.5 text-[#8fa89a]" />
                          ফেসবুক ফটো কালেকশন
                        </span>
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#06110a] text-white">
                          21
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 1. HERO CAROUSEL SLIDES CONTROL */}
                <div
                  id="hero-carousel-section"
                  className="linear-card p-6 rounded-3xl border border-[#d4af37]/30 bg-gradient-to-br from-[#0c2417] via-[#091d12] to-[#07160f] space-y-6 shadow-xl relative"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-white">
                            হিরো ক্যারোজেল স্লাইডার
                          </h3>
                          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f4dc8a] border border-[#d4af37]/35">
                            {activeHeroArtworks.length} টি সক্রিয়
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Header Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddSlideModalOpen(true)}
                        className="btn-3d-gold px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>নতুন স্লাইড যোগ করুন</span>
                      </button>

                      {/* Show Clear All ONLY when there are active slides */}
                      {activeHeroArtworks.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setHeroCarouselArtworkIds([]);
                            showToast("হিরো স্লাইডার খালি করা হয়েছে!");
                          }}
                          className="px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/15 border border-rose-500/20 transition-all"
                        >
                          সব বাদ দিন
                        </button>
                      )}
                    </div>
                  </div>

                  {/* BODY: If 0 slides, show clean Empty State. If > 0 slides, show active slides grid */}
                  {activeHeroArtworks.length === 0 ? (
                    <div className="py-10 px-6 rounded-2xl bg-[#06110a]/50 border border-white/5 text-center space-y-4">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center text-[#d4af37]">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="max-w-md mx-auto space-y-1">
                        <h4 className="font-bold text-sm text-white">
                          বর্তমানে হিরো ক্যারোজেলে কোনো ছবি যোগ করা নেই
                        </h4>
                        <p className="text-xs text-[#8fa89a]">
                          হোমপেজে ঘুরার জন্য আপনার পছন্দের ছবি আপলোড করুন অথবা নিচের ফেসবুক গ্যালারি থেকে ১-ক্লিকেই যুক্ত করুন।
                        </p>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsAddSlideModalOpen(true)}
                          className="btn-3d-gold px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-md"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>নতুন ছবি আপলোড করুন</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const candidates = GALLERY_IMAGE_PRESETS.slice(0, 4);
                            const newIds: string[] = [];
                            candidates.forEach((preset) => {
                              let art = artworks.find((a) => a.image === preset.path);
                              if (!art) {
                                art = addArtwork({
                                  title: preset.label,
                                  titleBangla: preset.label,
                                  category: "calligraphy",
                                  price: 4500,
                                  dimensions: '20" x 28" inches',
                                  image: preset.path,
                                  description: `Tiyana's Sukoon Authentic Studio Artwork - ${preset.label}`,
                                  medium: "Mixed Media on Canvas with 24K Gold Leaf",
                                  inStock: true,
                                  isFeatured: true,
                                });
                              }
                              if (!newIds.includes(art.id)) {
                                newIds.push(art.id);
                              }
                            });
                            setHeroCarouselArtworkIds(newIds);
                            showToast("গ্যালারি থেকে ৪টি ছবি হিরো স্লাইডারে যুক্ত হয়েছে! ✓", "success");
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#112d1d] text-[#f4dc8a] border border-[#d4af37]/35 hover:bg-[#d4af37]/20 transition-all flex items-center gap-2"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>গ্যালারি থেকে ৪টি ছবি অটো যোগ করুন</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* When active slides exist, show the clean grid with arrows & add card */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {activeHeroArtworks.map((art, idx) => (
                        <div
                          key={art.id}
                          className="relative rounded-2xl overflow-hidden border border-[#d4af37]/50 bg-[#102d1d] p-2.5 flex flex-col justify-between shadow-lg ring-1 ring-[#d4af37]/20 transition-all group"
                        >
                          <div>
                            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#06110a] mb-2 border border-white/10">
                              <Image
                                src={art.image}
                                alt={art.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#d4af37] text-[#07160f] flex items-center gap-1 shadow-md">
                                <Sparkles className="w-2.5 h-2.5 fill-current" />
                                <span>#{idx + 1}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleHeroCarouselArtwork(art.id)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-black/75 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-md"
                                title="Remove from Carousel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="font-bold text-white text-xs line-clamp-1 group-hover:text-[#f4dc8a] transition-colors">
                              {art.title}
                            </p>
                          </div>

                          <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
                            <span className="font-mono text-[#f4dc8a] font-bold text-[11px]">
                              ৳{art.price.toLocaleString()}
                            </span>

                            {/* Move Left / Right Buttons */}
                            <div className="flex items-center gap-1 bg-[#07160f] p-0.5 rounded-lg border border-white/10">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveHeroSlide(idx, idx - 1)}
                                className="p-1 rounded text-[#8fa89a] hover:text-[#d4af37] disabled:opacity-20 hover:bg-white/5 transition-all"
                                title="Move Earlier"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === activeHeroArtworks.length - 1}
                                onClick={() => handleMoveHeroSlide(idx, idx + 1)}
                                className="p-1 rounded text-[#8fa89a] hover:text-[#d4af37] disabled:opacity-20 hover:bg-white/5 transition-all"
                                title="Move Later"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Slide Card at the end of the active list */}
                      <button
                        type="button"
                        onClick={() => setIsAddSlideModalOpen(true)}
                        className="rounded-2xl border-2 border-dashed border-[#d4af37]/35 hover:border-[#d4af37] bg-[#0c2718]/40 hover:bg-[#0c2718]/80 p-4 flex flex-col items-center justify-center text-center space-y-2 transition-all group min-h-[170px]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <p className="font-bold text-xs text-white group-hover:text-[#f4dc8a]">
                          + নতুন স্লাইড
                        </p>
                      </button>
                    </div>
                  )}

                  {/* UNSELECTED CATALOG ARTWORKS SECTION (SHOW ONLY IF ARTWORKS EXIST IN CATALOG THAT ARE NOT IN HERO) */}
                  {unselectedArtworks.length > 0 && activeHeroArtworks.length > 0 && (
                    <div className="pt-3 border-t border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#8fa89a]">
                          ক্যাটালগের অন্যান্য আর্টওয়ার্ক (যুক্ত করতে ক্লিক করুন):
                        </span>
                        <span className="text-[11px] font-mono text-[#8fa89a]">
                          {unselectedArtworks.length} টি বাকি
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                        {unselectedArtworks.map((art) => (
                          <div
                            key={art.id}
                            onClick={() => toggleHeroCarouselArtwork(art.id)}
                            className="p-2 rounded-xl bg-[#07160f]/80 border border-white/10 hover:border-[#d4af37]/60 cursor-pointer transition-all flex items-center gap-2.5 group"
                          >
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-[#06110a] shrink-0 border border-white/10">
                              <Image src={art.image} alt={art.title} fill className="object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-semibold text-white truncate group-hover:text-[#f4dc8a]">
                                {art.title}
                              </p>
                              <p className="text-[10px] text-emerald-400 font-mono">
                                + Add
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. CORE SITE BRAND IMAGES */}
                <div id="core-images-section" className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-emerald-400" />
                        Core Storefront Theme Assets (ব্র্যান্ড কোর থিম ইমেজেস)
                      </h3>
                      <p className="text-xs text-[#8fa89a]">
                        ওয়েবসাইটের ৩টি মূল ভিজ্যুয়াল উপাদান: ব্র্যান্ড লোগো, হোমপেজ হিরোর ৩ডি ভাসমান ফ্রেম এবং ফিলোসফি স্টোরি ব্যানার।
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[#f4dc8a] bg-[#0d2218] px-3.5 py-1 rounded-full border border-[#d4af37]/30 self-start sm:self-center">
                      3 Core Assets Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 1. Brand Logo Card */}
                    <div className="linear-card rounded-3xl border border-white/10 hover:border-[#d4af37]/40 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl group">
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white">
                              Brand Identity Logo
                            </h4>
                          </div>
                          <span className="text-[10px] text-[#f4dc8a] font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30">
                            Navbar &amp; Footer
                          </span>
                        </div>

                        {/* Visual Live Preview Frame */}
                        <div
                          onClick={() => setActiveCoreImageModal("logo")}
                          className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#040d07] border border-white/15 flex items-center justify-center p-4 cursor-pointer group-hover:border-[#d4af37]/60 transition-all shadow-inner"
                        >
                          <div className="relative w-28 h-28 max-w-full max-h-full">
                            <Image
                              src={settings.siteLogo || "/brand/logo.jpg"}
                              alt="Brand Logo"
                              fill
                              className="object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-[#06110a]/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-200">
                            <div className="w-9 h-9 rounded-xl bg-[#d4af37] text-[#07160f] flex items-center justify-center shadow-lg">
                              <Edit3 className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-white">লোগো পরিবর্তন করুন</span>
                            <span className="text-[10px] text-[#f4dc8a]">Click to Replace</span>
                          </div>
                        </div>

                        {/* Path Info Pill */}
                        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#06110a] border border-white/5 text-[11px]">
                          <span className="text-[#8fa89a] truncate max-w-[200px] font-mono">
                            {settings.siteLogo || "/brand/logo.jpg"}
                          </span>
                          <span className="text-emerald-400 text-[10px] font-mono font-bold shrink-0">
                            ● Live
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveCoreImageModal("logo")}
                          className="btn-3d-gold py-2 px-3 text-xs font-bold flex-1 flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Logo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateSettings({ siteLogo: "/brand/logo.jpg" });
                            showToast("লোগো ডিফল্ট ফেসবুক লোগোতে রিসেট করা হয়েছে!");
                          }}
                          className="btn-3d-dark py-2 px-3 text-xs text-[#8fa89a] hover:text-white"
                          title="Reset to default FB logo"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* 2. Hero 3D Highlight Canvas Card */}
                    <div className="linear-card rounded-3xl border border-white/10 hover:border-[#d4af37]/40 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl group">
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white">
                              Hero 3D Highlight Canvas
                            </h4>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                            Homepage Top 3D
                          </span>
                        </div>

                        {/* Visual Live Preview Frame */}
                        <div
                          onClick={() => setActiveCoreImageModal("hero")}
                          className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#040d07] border border-white/15 flex items-center justify-center cursor-pointer group-hover:border-[#d4af37]/60 transition-all shadow-inner"
                        >
                          <Image
                            src={settings.heroImage || "/artwork/artwork_4.jpg"}
                            alt="Hero 3D Canvas"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-[#06110a]/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-200">
                            <div className="w-9 h-9 rounded-xl bg-[#d4af37] text-[#07160f] flex items-center justify-center shadow-lg">
                              <Edit3 className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-white">৩ডি ফ্রেম ইমেজ পরিবর্তন</span>
                            <span className="text-[10px] text-[#f4dc8a]">Click to Replace</span>
                          </div>
                        </div>

                        {/* Path Info Pill */}
                        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#06110a] border border-white/5 text-[11px]">
                          <span className="text-[#8fa89a] truncate max-w-[200px] font-mono">
                            {settings.heroImage || "/artwork/artwork_4.jpg"}
                          </span>
                          <span className="text-emerald-400 text-[10px] font-mono font-bold shrink-0">
                            ● 3D Active
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveCoreImageModal("hero")}
                          className="btn-3d-gold py-2 px-3 text-xs font-bold flex-1 flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change 3D Canvas</span>
                        </button>
                      </div>
                    </div>

                    {/* 3. Story Feature Banner Card */}
                    <div className="linear-card rounded-3xl border border-white/10 hover:border-[#d4af37]/40 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl group">
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#f4dc8a]">
                              <Palette className="w-4 h-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white">
                              Brand Story Feature
                            </h4>
                          </div>
                          <span className="text-[10px] text-[#f4dc8a] font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30">
                            Philosophy Section
                          </span>
                        </div>

                        {/* Visual Live Preview Frame */}
                        <div
                          onClick={() => setActiveCoreImageModal("story")}
                          className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#040d07] border border-white/15 flex items-center justify-center cursor-pointer group-hover:border-[#d4af37]/60 transition-all shadow-inner"
                        >
                          <Image
                            src={settings.storyImage || "/artwork/artwork_1.jpg"}
                            alt="Story Feature Banner"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-[#06110a]/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-200">
                            <div className="w-9 h-9 rounded-xl bg-[#d4af37] text-[#07160f] flex items-center justify-center shadow-lg">
                              <Edit3 className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-white">স্টোরি ব্যানার পরিবর্তন</span>
                            <span className="text-[10px] text-[#f4dc8a]">Click to Replace</span>
                          </div>
                        </div>

                        {/* Path Info Pill */}
                        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#06110a] border border-white/5 text-[11px]">
                          <span className="text-[#8fa89a] truncate max-w-[200px] font-mono">
                            {settings.storyImage || "/artwork/artwork_1.jpg"}
                          </span>
                          <span className="text-emerald-400 text-[10px] font-mono font-bold shrink-0">
                            ● Story Active
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveCoreImageModal("story")}
                          className="btn-3d-gold py-2 px-3 text-xs font-bold flex-1 flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Story Image</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. ALL 21 AUTHENTIC FACEBOOK PHOTO ASSETS */}
                <div
                  id="gallery-assets-section"
                  className="linear-card p-6 sm:p-7 rounded-3xl border border-white/10 space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-[#d4af37]" />
                        All 21 Authentic Facebook Photo Assets
                      </h3>
                      <p className="text-xs text-[#8fa89a]">
                        ১-ক্লিকেই যেকোনো ছবি হিরো ক্যারোজেল, ৩ডি ফ্রেম বা স্টোরিতে যুক্ত করুন।
                      </p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8fa89a]" />
                        <input
                          type="text"
                          placeholder="Search photos..."
                          value={mediaSearchQuery}
                          onChange={(e) => setMediaSearchQuery(e.target.value)}
                          className="pl-9 pr-3 py-1.5 rounded-xl bg-[#07160f] border border-white/15 text-xs text-white focus:outline-none focus:border-[#d4af37] w-48"
                        />
                      </div>

                      {/* Filter Pills */}
                      <div className="flex items-center gap-1 bg-[#07160f] p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => setMediaFilter("all")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            mediaFilter === "all"
                              ? "bg-[#d4af37] text-[#07160f] font-bold"
                              : "text-[#8fa89a] hover:text-white"
                          }`}
                        >
                          All ({GALLERY_IMAGE_PRESETS.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaFilter("in-carousel")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            mediaFilter === "in-carousel"
                              ? "bg-[#d4af37] text-[#07160f] font-bold"
                              : "text-[#8fa89a] hover:text-white"
                          }`}
                        >
                          In Carousel
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaFilter("available")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            mediaFilter === "available"
                              ? "bg-[#d4af37] text-[#07160f] font-bold"
                              : "text-[#8fa89a] hover:text-white"
                          }`}
                        >
                          Available
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Photo Assets Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                    {filteredPresets.map((preset) => {
                      const linkedArtwork = artworks.find((a) => a.image === preset.path);
                      const isInCarousel = linkedArtwork ? heroIds.includes(linkedArtwork.id) : false;
                      const carouselSlideNo =
                        linkedArtwork && isInCarousel ? heroIds.indexOf(linkedArtwork.id) + 1 : null;
                      const isHeroFrame = settings.heroImage === preset.path;
                      const isStoryImage = settings.storyImage === preset.path;

                      return (
                        <div
                          key={preset.id}
                          className={`p-3 rounded-2xl border transition-all duration-200 space-y-2.5 flex flex-col justify-between group ${
                            isInCarousel
                              ? "bg-[#0f291a] border-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.15)] ring-1 ring-[#d4af37]/30"
                              : "bg-[#091d12] border-white/10 hover:border-white/25"
                          }`}
                        >
                          <div>
                            {/* Photo Thumbnail */}
                            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#06110a] border border-white/5">
                              <Image
                                src={preset.path}
                                alt={preset.label}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Number Badge */}
                              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#06110a]/90 text-white backdrop-blur-sm border border-white/10">
                                #{preset.id.toString().padStart(2, "0")}
                              </span>

                              {/* Status Badges */}
                              <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 items-end pointer-events-none">
                                {isInCarousel && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#d4af37] text-[#07160f] flex items-center gap-1 shadow-md">
                                    <Sparkles className="w-2.5 h-2.5 fill-current" />
                                    Slide #{carouselSlideNo}
                                  </span>
                                )}
                                {isHeroFrame && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500 text-white shadow-md">
                                    Hero Frame
                                  </span>
                                )}
                                {isStoryImage && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#d4af37]/80 text-[#07160f] shadow-md">
                                    Story Image
                                  </span>
                                )}
                              </div>
                            </div>

                            <p
                              className="text-xs font-bold text-white truncate mt-1 group-hover:text-[#f4dc8a] transition-colors"
                              title={preset.label}
                            >
                              {preset.label}
                            </p>
                          </div>

                          {/* 3 Action Buttons */}
                          <div className="flex flex-col gap-1.5 pt-1">
                            {/* 1. Add / Remove from Hero Carousel */}
                            <button
                              type="button"
                              onClick={() => handleAddPresetToHeroCarousel(preset)}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                                isInCarousel
                                  ? "bg-[#d4af37] text-[#07160f] hover:bg-[#e6bc42]"
                                  : "bg-[#133221] text-[#f4dc8a] border border-[#d4af37]/40 hover:bg-[#d4af37]/20"
                              }`}
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>{isInCarousel ? `In Carousel #${carouselSlideNo}` : "+ Add to Carousel"}</span>
                            </button>

                            {/* 2 & 3. Set as Hero / Set as Story */}
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  updateSettings({ heroImage: preset.path });
                                  showToast(`Set Photo #${preset.id} as Hero Canvas!`);
                                }}
                                className={`py-1 rounded-lg text-[10px] font-medium transition-all ${
                                  isHeroFrame
                                    ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50"
                                    : "bg-[#06110a] text-[#8fa89a] border border-white/10 hover:text-white hover:border-white/20"
                                }`}
                              >
                                {isHeroFrame ? "✓ Hero 3D" : "Set Hero 3D"}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  updateSettings({ storyImage: preset.path });
                                  showToast(`Set Photo #${preset.id} as Story Image!`);
                                }}
                                className={`py-1 rounded-lg text-[10px] font-medium transition-all ${
                                  isStoryImage
                                    ? "bg-[#d4af37]/30 text-[#f4dc8a] border border-[#d4af37]/50"
                                    : "bg-[#06110a] text-[#8fa89a] border border-white/10 hover:text-white hover:border-white/20"
                                }`}
                              >
                                {isStoryImage ? "✓ Story" : "Set Story"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB: WEBSITE PAGES & SECTIONS CMS */}
          {activeTab === "cms" && (
            <SiteCMSControl
              settings={settingsForm}
              onUpdateSettings={setSettingsForm}
              onSave={handleSaveStoreSettings}
              isSaving={isSavingSettings}
            />
          )}

          {/* TAB 4: STUDIO ORDERS MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Order Processing Center
                  </h2>
                  <p className="text-xs text-[#8fa89a]">
                    Track status, update customers via WhatsApp, and print delivery slips.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#8fa89a] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-[#091d12] border border-white/10 text-xs text-white placeholder-[#6b8275] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  {orders.length > 0 && (
                    <button
                      onClick={() => {
                        requestConfirm({
                          title: "সব অর্ডার মুছে ফেলুন (Clear All Orders)",
                          message: "আপনি কি নিশ্চিত সমস্ত ডেমো ও বর্তমান অর্ডার মুছে ফেলতে চান? এটি ড্যাশবোর্ড এবং ক্লাউড ডাটাবেস থেকেও সম্পূর্ণ মুছে যাবে।",
                          confirmLabel: "সবগুলো মুছুন (Clear All)",
                          onConfirm: () => clearAllOrders(),
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Clear all orders"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {[
                  "all",
                  "pending",
                  "confirmed",
                  "painting",
                  "framing",
                  "shipped",
                  "delivered",
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                      orderFilter === st
                        ? "bg-[#d4af37] text-[#06110a]"
                        : "bg-[#091d12] text-[#8fa89a] hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="linear-card rounded-2xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#091b11] border-b border-white/10 text-[#8fa89a]">
                      <tr>
                        <th className="p-4 font-mono">Order #</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Items &amp; Customization</th>
                        <th className="p-4">Delivery Zone</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status &amp; Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center p-8 text-[#8fa89a]">
                            No orders matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-white/5">
                            <td className="p-4 align-top font-mono font-bold text-[#f4dc8a]">
                              {ord.orderNumber}
                              <p className="text-[10px] text-[#8fa89a] font-sans font-normal mt-1">
                                {new Date(ord.createdAt).toLocaleDateString()}
                              </p>
                            </td>

                            <td className="p-4 align-top">
                              <p className="font-bold text-white text-sm">
                                {ord.customerName}
                              </p>
                              <p className="text-[#8fa89a]">{ord.phone}</p>
                              <p className="text-[11px] text-[#6b8275] max-w-[220px] truncate mt-1">
                                {ord.address}
                              </p>
                            </td>

                            <td className="p-4 align-top">
                              <div className="space-y-1">
                                {ord.items.map((it, idx) => (
                                  <div key={idx} className="text-[#c4d7cc]">
                                    <span className="font-medium">
                                      {it.quantity}x {it.artwork.title}
                                    </span>
                                    {it.selectedFrame && (
                                      <p className="text-[10px] text-[#8fa89a]">
                                        Frame: {it.selectedFrame}
                                      </p>
                                    )}
                                    {it.customText && (
                                      <p className="text-[10px] text-[#f4dc8a] italic">
                                        &quot;{it.customText}&quot;
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>

                            <td className="p-4 align-top">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  ord.deliveryZone === "inside_dhaka"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-blue-500/20 text-blue-400"
                                }`}
                              >
                                {ord.deliveryZone === "inside_dhaka"
                                  ? "Inside Dhaka"
                                  : "Outside Dhaka"}
                              </span>
                              <p className="text-[10px] text-[#8fa89a] mt-1">
                                Pay: {ord.paymentMethod.toUpperCase()}
                                {ord.paymentTrxId && ` (${ord.paymentTrxId})`}
                              </p>
                            </td>

                            <td className="p-4 align-top">
                              <p className="font-bold text-sm text-[#fceb9e]">
                                ৳{ord.totalAmount.toLocaleString()}
                              </p>
                              <p className="text-[10px] text-[#8fa89a]">
                                Sub: ৳{ord.subtotal} + Del: ৳{ord.deliveryFee}
                              </p>
                            </td>

                            <td className="p-4 align-top space-y-2">
                              {/* Status Dropdown */}
                              <CustomSelect
                                value={ord.status}
                                onChange={(val) =>
                                  updateOrderStatus(
                                    ord.id,
                                    val as OrderStatus
                                  )
                                }
                                options={ORDER_STATUS_OPTIONS}
                                buttonClassName="py-1.5 text-xs font-semibold"
                              />

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1.5 pt-1">
                                <button
                                  onClick={() => sendWhatsAppUpdate(ord)}
                                  className="flex-1 btn-3d-emerald py-1 px-2 text-[11px] flex items-center justify-center gap-1"
                                  title="Send WhatsApp notification"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </button>
                                <button
                                  onClick={() => setSelectedOrderForInvoice(ord)}
                                  className="p-1.5 rounded-lg bg-[#091d12] text-[#8fa89a] hover:text-white"
                                  title="Print invoice slip"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    requestConfirm({
                                      title: "অর্ডার মুছে ফেলুন (Delete Order)",
                                      message: `আপনি কি নিশ্চিত অর্ডার #${ord.orderNumber} মুছে ফেলতে চান?`,
                                      itemName: `${ord.customerName} (৳${ord.totalAmount.toLocaleString()})`,
                                      confirmLabel: "মুছে ফেলুন",
                                      onConfirm: () => deleteOrder(ord.id),
                                    });
                                  }}
                                  className="p-1.5 rounded-lg bg-[#091d12] text-rose-400 hover:text-rose-300"
                                  title="Delete order"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOM INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Custom Commission Requests
                  </h2>
                  <p className="text-xs text-[#8fa89a]">
                    Leads and custom art specifications submitted from the website estimator.
                  </p>
                </div>

                {inquiries.length > 0 && (
                  <button
                    onClick={() => {
                      requestConfirm({
                        title: "সব ইনকোয়ারি মুছে ফেলুন (Clear All Inquiries)",
                        message: "আপনি কি নিশ্চিত সমস্ত কাস্টম কমিশন রিকোয়েস্ট ও ইনকোয়ারি মুছে ফেলতে চান?",
                        confirmLabel: "সবগুলো মুছুন (Clear All)",
                        onConfirm: () => clearAllInquiries(),
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
                    title="Clear all inquiries"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {inquiries.length === 0 ? (
                  <div className="linear-card p-12 text-center rounded-2xl border border-white/10 text-[#8fa89a]">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold">No custom inquiries yet</p>
                    <p className="text-xs text-[#6b8275] mt-1">
                      New inquiries submitted via the Custom Art Configurator will appear here.
                    </p>
                  </div>
                ) : (
                  inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="linear-card p-5 rounded-2xl border border-white/10 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#d4af37] font-bold">
                            {inq.artType}
                          </span>
                          <span className="text-[10px] text-[#8fa89a]">
                            {new Date(inq.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-base mt-0.5">
                          {inq.customerName}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <CustomSelect
                          value={inq.status}
                          onChange={(val) =>
                            updateInquiryStatus(
                              inq.id,
                              val as CustomInquiry["status"]
                            )
                          }
                          options={INQUIRY_STATUS_OPTIONS}
                          buttonClassName="py-1.5 text-xs font-semibold text-[#f4dc8a]"
                          className="w-36"
                        />

                        <a
                          href={`tel:${inq.phone}`}
                          className="p-2 rounded-lg bg-[#0b1f14] text-emerald-400"
                          title="Call client"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>

                        <a
                          href={`https://wa.me/88${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Assalamu Alaikum ${inq.customerName}! Thank you for your custom commission inquiry on Tiyana's Sukoon for "${inq.artType}". We would love to discuss your design!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-3d-emerald px-3 py-1.5 text-xs flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => {
                            requestConfirm({
                              title: "ইনকোয়ারি মুছে ফেলুন (Delete Inquiry)",
                              message: `আপনি কি নিশ্চিত ${inq.customerName}-এর কাস্টম আর্ট রিকোয়েস্টটি মুছে ফেলতে চান?`,
                              itemName: `${inq.customerName} - ${inq.artType}`,
                              confirmLabel: "মুছে ফেলুন",
                              onConfirm: () => deleteInquiry(inq.id),
                            });
                          }}
                          className="p-2 rounded-lg bg-[#0b1f14] text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 border border-white/5 transition-all"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-[#8fa89a]">Phone</span>
                        <p className="font-semibold text-white">{inq.phone}</p>
                      </div>
                      <div>
                        <span className="text-[#8fa89a]">Canvas Size</span>
                        <p className="font-semibold text-white">{inq.canvasSize}</p>
                      </div>
                      <div>
                        <span className="text-[#8fa89a]">Frame Choice</span>
                        <p className="font-semibold text-white">{inq.frameType}</p>
                      </div>
                      <div>
                        <span className="text-[#8fa89a]">Estimated Total</span>
                        <p className="font-bold text-[#fceb9e]">
                          ৳{inq.estimatedPrice.toLocaleString()} BDT
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#07150e] p-3 rounded-xl border border-white/5 text-xs">
                      <span className="text-[#8fa89a]">Requested Ayah / Names:</span>
                      <p className="font-medium text-white mt-0.5">
                        {inq.customVerseOrText}
                      </p>
                      {inq.notes && (
                        <p className="text-[#9cb5a6] italic mt-1">
                          Note: {inq.notes}
                        </p>
                      )}
                    </div>
                  </div>
                )))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & CONFIGURATION */}
          {activeTab === "settings" && (
            <div className="max-w-4xl space-y-6 animate-fadeIn pb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Store &amp; Studio Configuration
                  </h2>
                  <p className="text-xs text-[#8fa89a]">
                    Modify announcement banner, studio phone contacts, delivery fees, and order card layout.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveStoreSettings}
                  disabled={isSavingSettings}
                  className="btn-3d-gold px-5 py-2.5 text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-lg"
                >
                  {settingsSavedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                      <span>Saved to Supabase!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-[#0f1811]" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

              {/* 1. PRODUCT CARD DESIGN & DISPLAY CONTROLS */}
              <div className="linear-card p-5 sm:p-6 rounded-2xl border border-[#d4af37]/35 space-y-5 bg-gradient-to-br from-[#071a11] via-[#05130b] to-[#040e08] shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#d4af37]" />
                      <h3 className="text-base font-bold text-white tracking-tight">
                        প্রোডাক্ট ও অর্ডার কার্ড ডিজাইন কন্ট্রোল (Product Card Customizer)
                      </h3>
                    </div>
                    <p className="text-xs text-[#8fa89a] mt-1">
                      ওয়েবসাইটের প্রতিটি আর্টওয়ার্ক কার্ডে কোন তথ্য বা বাটন প্রদর্শিত হবে বা হাইড থাকবে তা এখান থেকে নির্ধারণ করুন।
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#d4af37] bg-[#0c2417] px-2.5 py-1 rounded-full border border-[#d4af37]/30 self-start sm:self-auto">
                    ● লাইভ সিংক্রোনাইজড
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Toggles Column */}
                  <div className="lg:col-span-7 space-y-3.5">
                    {/* 1. Unique Item Code */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#07160f] border border-white/5 hover:border-[#d4af37]/30 transition-all">
                      <div className="pr-3">
                        <p className="text-xs font-bold text-white">ইউনিক আইটেম নাম্বার / SKU (#TS-01)</p>
                        <p className="text-[11px] text-[#8fa89a]">প্রতিটি আর্টওয়ার্কের সুনির্দিষ্ট সিরিয়াল বা ইউনিক আইটেম কোড</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = settingsForm.cardShowItemCode === false ? true : false;
                          setSettingsForm((prev) => ({ ...prev, cardShowItemCode: nextVal }));
                          updateSettings({ cardShowItemCode: nextVal }, true);
                        }}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settingsForm.cardShowItemCode !== false ? "bg-[#d4af37]" : "bg-[#163825]"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#0a150e] shadow ring-0 transition duration-200 ease-in-out ${
                            settingsForm.cardShowItemCode !== false ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* 2. Dimensions / Size */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#07160f] border border-white/5 hover:border-[#d4af37]/30 transition-all">
                      <div className="pr-3">
                        <p className="text-xs font-bold text-white">ইমেজের সাইজ / মাপ (Dimensions)</p>
                        <p className="text-[11px] text-[#8fa89a]">ক্যানভাস সাইজ যেমন: 20&quot; x 24&quot; INCHES</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = settingsForm.cardShowDimensions === false ? true : false;
                          setSettingsForm((prev) => ({ ...prev, cardShowDimensions: nextVal }));
                          updateSettings({ cardShowDimensions: nextVal }, true);
                        }}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settingsForm.cardShowDimensions !== false ? "bg-[#d4af37]" : "bg-[#163825]"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#0a150e] shadow ring-0 transition duration-200 ease-in-out ${
                            settingsForm.cardShowDimensions !== false ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* 3. Regular Price / Strikethrough */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#07160f] border border-white/5 hover:border-[#d4af37]/30 transition-all">
                      <div className="pr-3">
                        <p className="text-xs font-bold text-white">রেগুলার প্রাইস / ডিসকাউন্ট স্ট্রাইকথ্রু</p>
                        <p className="text-[11px] text-[#8fa89a]">আগের দাম কেটে ডিসকাউন্ট অফার দেখানো (যেমন: ৳3,200)</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = settingsForm.cardShowOriginalPrice === false ? true : false;
                          setSettingsForm((prev) => ({ ...prev, cardShowOriginalPrice: nextVal }));
                          updateSettings({ cardShowOriginalPrice: nextVal }, true);
                        }}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settingsForm.cardShowOriginalPrice !== false ? "bg-[#d4af37]" : "bg-[#163825]"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#0a150e] shadow ring-0 transition duration-200 ease-in-out ${
                            settingsForm.cardShowOriginalPrice !== false ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* 4. Action Buttons Mode */}
                    <div className="p-3.5 rounded-xl bg-[#07160f] border border-white/5 space-y-2.5">
                      <div>
                        <p className="text-xs font-bold text-white">অ্যাকশন বাটন প্রদর্শন সিস্টেম (Buttons System)</p>
                        <p className="text-[11px] text-[#8fa89a]">কার্ডে কয়টি ও কোন বাটনগুলো প্রদর্শন করা হবে তা নির্বাচন করুন:</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSettingsForm((prev) => ({ ...prev, cardButtonMode: "both" }));
                            updateSettings({ cardButtonMode: "both" }, true);
                          }}
                          className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                            (settingsForm.cardButtonMode || "both") === "both"
                              ? "bg-[#163825] text-[#f4dc8a] border-[#d4af37] shadow-sm"
                              : "bg-[#05110b] text-[#8fa89a] border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="font-bold flex items-center justify-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>উভয় বাটন (Both)</span>
                          </div>
                          <div className="text-[10px] text-[#8fa89a] mt-0.5">Add to Cart + Buy Now</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSettingsForm((prev) => ({ ...prev, cardButtonMode: "cart_only" }));
                            updateSettings({ cardButtonMode: "cart_only" }, true);
                          }}
                          className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                            settingsForm.cardButtonMode === "cart_only"
                              ? "bg-[#163825] text-[#f4dc8a] border-[#d4af37] shadow-sm"
                              : "bg-[#05110b] text-[#8fa89a] border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="font-bold flex items-center justify-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>শুধু Cart বাটন</span>
                          </div>
                          <div className="text-[10px] text-[#8fa89a] mt-0.5">Add to Cart Only</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSettingsForm((prev) => ({ ...prev, cardButtonMode: "buynow_only" }));
                            updateSettings({ cardButtonMode: "buynow_only" }, true);
                          }}
                          className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                            settingsForm.cardButtonMode === "buynow_only"
                              ? "bg-[#163825] text-[#f4dc8a] border-[#d4af37] shadow-sm"
                              : "bg-[#05110b] text-[#8fa89a] border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="font-bold flex items-center justify-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>শুধু Buy Now বাটন</span>
                          </div>
                          <div className="text-[10px] text-[#8fa89a] mt-0.5">Instant Checkout Only</div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Live Interactive Preview Column */}
                  <div className="lg:col-span-5 flex flex-col items-center p-4 rounded-xl bg-[#040e08] border border-[#d4af37]/30 shadow-inner">
                    <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] font-bold">
                        ● লাইভ কার্ড প্রিভিউ (Live Preview)
                      </span>
                      <span className="text-[10px] text-[#8fa89a]">রিয়েল-টাইম নমুনা</span>
                    </div>

                    {/* Mock Minimalist Card */}
                    <div className="w-full max-w-[270px] linear-card rounded-xl overflow-hidden flex flex-col justify-between border border-white/15 shadow-xl">
                      <div>
                        {/* Image container: 3:4 portrait ratio */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#07150d]">
                          <Image
                            src={artworks[0]?.image || "/artwork/artwork_4.jpg"}
                            alt="Card Preview"
                            fill
                            sizes="270px"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#06110a]/50 via-transparent to-transparent pointer-events-none" />

                          {/* Quick view icon */}
                          <div className="absolute bottom-2 right-2 z-10 p-1.5 rounded-lg bg-[#06110a]/80 text-[#e5ede7] border border-white/10">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Minimalist Details */}
                        <div className="p-3 space-y-1.5">
                          {(settingsForm.cardShowItemCode !== false || settingsForm.cardShowDimensions !== false) && (
                            <div className="flex items-center justify-between gap-2 text-[10px] pb-0.5">
                              {settingsForm.cardShowItemCode !== false && (
                                <span className="font-mono font-bold text-[#f4dc8a] bg-[#0c2417] border border-[#d4af37]/35 px-1.5 py-0.5 rounded text-[9px] shadow-sm tracking-wider">
                                  #TS-01
                                </span>
                              )}
                              {settingsForm.cardShowDimensions !== false && (
                                <span className="font-mono text-[#8fa89a] uppercase tracking-wider ml-auto">
                                  20&quot; x 24&quot; INCHES
                                </span>
                              )}
                            </div>
                          )}

                          <h4 className="font-bold text-xs text-white line-clamp-1">
                            Floral Arabesque &amp; Sacred Geometry
                          </h4>

                          <p className="text-[10px] text-[#8fa89a] line-clamp-1 font-serif">
                            ইসলামিক জ্যামিতিক নকশা ও ফুলেল ক্যানভাস
                          </p>
                        </div>
                      </div>

                      {/* Price & Buttons */}
                      <div className="p-3 pt-2 border-t border-white/5 space-y-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-extrabold text-[#fceb9e]">
                            ৳2,800
                          </span>
                          {settingsForm.cardShowOriginalPrice !== false && (
                            <span className="text-[10px] text-[#8fa89a] line-through">
                              ৳3,200
                            </span>
                          )}
                        </div>

                        {/* Action Buttons based on admin buttonMode */}
                        {(settingsForm.cardButtonMode || "both") === "both" && (
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="py-1.5 px-1 rounded-lg text-[10px] font-semibold bg-[#0b2416] text-[#f4dc8a] border border-[#d4af37]/40 flex items-center justify-center gap-1">
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add to Cart</span>
                            </div>
                            <div className="btn-3d-gold py-1.5 px-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm">
                              <Zap className="w-3 h-3 text-[#0f1811] fill-[#0f1811]" />
                              <span>Buy Now</span>
                            </div>
                          </div>
                        )}

                        {settingsForm.cardButtonMode === "cart_only" && (
                          <div className="w-full btn-3d-gold py-1.5 text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm">
                            <ShoppingBag className="w-3 h-3 text-[#0f1811]" />
                            <span>Add to Cart</span>
                          </div>
                        )}

                        {settingsForm.cardButtonMode === "buynow_only" && (
                          <div className="w-full btn-3d-gold py-1.5 text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm">
                            <Zap className="w-3 h-3 text-[#0f1811] fill-[#0f1811]" />
                            <span>Buy Now</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[10px] text-[#8fa89a] text-center mt-3 leading-relaxed">
                      💡 বাম পাশের টগল বা বাটন মোড পরিবর্তন করলে লাইভ প্রিভিউ এবং ওয়েবসাইটে তাৎক্ষণিকভাবে কার্ডটি আপডেট হবে।
                    </p>
                  </div>
                </div>
              </div>

              <div className="linear-card p-6 rounded-2xl border border-white/10 space-y-5">
                {/* 1. Announcement Banner */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#c4d7cc]">
                    Top Announcement Bar Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, announcementText: e.target.value }))
                    }
                    placeholder="e.g. Ramadan & Eid 2026 Calligraphy Slots Open..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07160f] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="annActive"
                      checked={settingsForm.isAnnouncementActive}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({ ...prev, isAnnouncementActive: e.target.checked }))
                      }
                      className="rounded bg-[#07160f] border-white/20 text-[#d4af37] w-4 h-4"
                    />
                    <label htmlFor="annActive" className="text-xs text-white cursor-pointer select-none">
                      Show Announcement Banner on Storefront
                    </label>
                  </div>
                </div>

                <div className="h-px bg-white/5 my-2" />

                {/* 2. Contact Numbers & Social */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#c4d7cc] mb-1">
                      Primary Phone (WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone1}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({ ...prev, phone1: e.target.value, whatsapp: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#07160f] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#c4d7cc] mb-1">
                      Secondary Contact Phone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone2}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({ ...prev, phone2: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#07160f] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Facebook Page URL */}
                <div>
                  <label className="block text-xs font-semibold text-[#c4d7cc] mb-1">
                    Facebook Page URL (ফেসবুক পেজ লিঙ্ক)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.facebookUrl || ""}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, facebookUrl: e.target.value }))
                    }
                    placeholder="https://www.facebook.com/your-page-id"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07160f] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Studio Physical Address - Prominent Card */}
                <div className="p-4 rounded-xl bg-[#05130b] border border-[#d4af37]/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                    <label className="block text-xs font-bold text-[#f4dc8a]">
                      স্টুডিওর ঠিকানা (Studio Physical Address / পিকআপ পয়েন্ট)
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={settingsForm.studioAddress || ""}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, studioAddress: e.target.value }))
                    }
                    placeholder="যেমন: বাড়ি #১২, রোড #৪, ব্লক #বি, ধানমন্ডি / উত্তরা, ঢাকা - ১২০৫"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07160f] border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-[#d4af37] resize-y"
                  />
                  <p className="text-[11px] text-[#8fa89a] leading-relaxed">
                    💡 এখানে আপনার স্টুডিও বা শোরুমের আসল ঠিকানাটি লিখুন। এটি ওয়েবসাইটের ফুটার (Footer) এবং কন্টাক্ট ইনফোতে কাস্টমারদের দেখানো হবে।
                  </p>
                </div>

                <div className="h-px bg-white/5 my-2" />

                {/* 3. Delivery Fees */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#c4d7cc] mb-1">
                      Inside Dhaka Delivery Charge (৳)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.insideDhakaDeliveryFee}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          insideDhakaDeliveryFee: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#07160f] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#c4d7cc] mb-1">
                      Outside Dhaka Delivery Charge (৳)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.outsideDhakaDeliveryFee}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          outsideDhakaDeliveryFee: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#07160f] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c4d7cc] mb-1">
                    Free Delivery Threshold (৳)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryThreshold}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        freeDeliveryThreshold: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07160f] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                  <p className="text-[11px] text-[#8fa89a] mt-1">
                    Orders with subtotal above this amount get free delivery automatically.
                  </p>
                </div>

                <div className="h-px bg-white/5 my-2" />

                {/* 4. Emergency Backup Master PIN */}
                <div className="p-4 rounded-xl bg-[#05130b] border border-[#d4af37]/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#d4af37]" />
                    <label className="block text-xs font-bold text-[#f4dc8a]">
                      Emergency Master Backup PIN (জরুরী ব্যাকআপ পিন)
                    </label>
                  </div>
                  <input
                    type="text"
                    value={settingsForm.adminPin}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, adminPin: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07160f] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#d4af37]"
                  />
                  <div className="text-[11px] text-[#8fa89a] space-y-1 pt-1 leading-relaxed">
                    <p>
                      💡 <span className="text-white font-medium">পাসওয়ার্ড বনাম ব্যাকআপ পিন:</span> আপনি স্বাভাবিকভাবে লগইন করার সময় আপনার জিমেইল (<code className="text-[#f4dc8a]">{adminEmail}</code>) এবং জিমেইলের পাসওয়ার্ড ব্যবহার করছেন।
                    </p>
                    <p>
                      এই মাস্টার পিনটি একটি <strong>ইমার্জেন্সি মাস্টার কি (Emergency Key)</strong>। কখনো যদি ক্লাউড ডাটাবেস ডাউন থাকে বা পাসওয়ার্ড ভুলে যান, তখন জরুরি অবস্থায় এই পিনটি পাসওয়ার্ডের ঘরে দিলেই অ্যাডমিন আনলক হয়ে যাবে। আপনি চাইলে এটি পরিবর্তন করতে পারেন।
                    </p>
                  </div>
                </div>

                {/* Bottom Save Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleSaveStoreSettings}
                    disabled={isSavingSettings}
                    className="w-full btn-3d-gold py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
                  >
                    {settingsSavedSuccess ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-950" />
                        <span>Settings Saved to Supabase &amp; Live Site!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 text-[#0f1811]" />
                        <span>Save Store Configuration</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SUPABASE CLOUD DATABASE MANAGER */}
          {activeTab === "supabase" && (
            <div className="max-w-4xl space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Database className="w-6 h-6 text-[#d4af37]" />
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      Supabase Cloud Database
                    </h2>
                  </div>
                  <p className="text-xs text-[#8fa89a] mt-1">
                    Real-time cloud database synchronization for artworks, customer orders, custom commission inquiries, and brand media.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestSupabase}
                    disabled={supabaseLoading}
                    className="btn-3d-dark px-3 py-2 text-xs flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${supabaseLoading ? "animate-spin" : ""}`} />
                    <span>{supabaseLoading ? "Testing..." : "Test Connection"}</span>
                  </button>
                  <button
                    onClick={handleCopySql}
                    className="btn-3d-gold px-3.5 py-2 text-xs flex items-center gap-2 font-semibold"
                  >
                    {sqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{sqlCopied ? "Copied SQL!" : "Copy SQL Schema"}</span>
                  </button>
                </div>
              </div>

              {/* Live Status Card */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  supabaseStatus === "connected"
                    ? "bg-[#0b2416]/70 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    : "bg-[#1f1a0a]/70 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        supabaseStatus === "connected"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {supabaseStatus === "connected"
                            ? "Supabase Cloud Database Connected & Active"
                            : "Offline / Local Storage Mode Active"}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase ${
                            supabaseStatus === "connected"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {supabaseStatus === "connected" ? "Live Cloud Sync" : "Fallback Local"}
                        </span>
                      </div>
                      <p className="text-xs text-[#8fa89a] mt-0.5">
                        {supabaseStatus === "connected"
                          ? "All artwork edits, new orders, and inquiry submissions are automatically synced to your Supabase PostgreSQL cluster in real time."
                          : "Changes are currently stored in browser LocalStorage. Connect your Supabase project below to enable cross-device cloud persistence."}
                      </p>
                    </div>
                  </div>

                  {supabaseStatus === "connected" && (
                    <button
                      onClick={handleDisconnectSupabase}
                      className="px-3 py-1.5 rounded-lg text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-all shrink-0"
                    >
                      Disconnect Cloud
                    </button>
                  )}
                </div>

                {/* Metrics ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10">
                  <div className="bg-[#07160f]/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-mono text-[#8fa89a] block">Artworks in Catalog</span>
                    <span className="text-base font-bold text-white">{artworks.length} Items</span>
                  </div>
                  <div className="bg-[#07160f]/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-mono text-[#8fa89a] block">Customer Orders</span>
                    <span className="text-base font-bold text-[#fceb9e]">{orders.length} Orders</span>
                  </div>
                  <div className="bg-[#07160f]/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-mono text-[#8fa89a] block">Custom Inquiries</span>
                    <span className="text-base font-bold text-emerald-400">{inquiries.length} Inquiries</span>
                  </div>
                  <div className="bg-[#07160f]/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-mono text-[#8fa89a] block">Database Status</span>
                    <span className={`text-xs font-mono font-bold flex items-center gap-1.5 mt-0.5 ${
                      supabaseStatus === "connected" ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        supabaseStatus === "connected" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                      }`} />
                      {supabaseStatus === "connected" ? "Synchronized" : "Local Fallback"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supabase Credentials Configuration */}
              <div className="linear-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Key className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-bold text-sm text-white">
                    Supabase Project Credentials
                  </h3>
                </div>

                <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#c4d7cc]">
                      Supabase Project URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://xyzabcdefghijklm.supabase.co"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#07160f] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#d4af37]"
                    />
                    <p className="text-[11px] text-[#8fa89a]">
                      Found in Supabase: <span className="text-white font-mono">Project Settings &gt; API &gt; Project URL</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#c4d7cc]">
                      Supabase Anon Public API Key
                    </label>
                    <input
                      type="text"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#07160f] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#d4af37]"
                    />
                    <p className="text-[11px] text-[#8fa89a]">
                      Found in Supabase: <span className="text-white font-mono">Project Settings &gt; API &gt; Project API keys &gt; anon public</span>
                    </p>
                  </div>

                  {/* Feedback Message */}
                  {supabaseTestResult && (
                    <div
                      className={`p-3.5 rounded-xl text-xs border flex items-start gap-2.5 ${
                        supabaseTestResult.success
                          ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                          : "bg-rose-950/40 border-rose-500/30 text-rose-300"
                      }`}
                    >
                      {supabaseTestResult.success ? (
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      )}
                      <div>
                        <p className="font-medium">{supabaseTestResult.message}</p>
                        {supabaseTestResult.tablesMissing && (
                          <p className="text-[11px] text-amber-300/90 mt-1">
                            Tip: Copy the SQL schema below, open your Supabase SQL Editor, paste it, and click &quot;Run&quot;. Then click &quot;Test Connection&quot; again.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={supabaseLoading}
                      className="btn-3d-gold px-5 py-2.5 text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4" />
                      <span>{supabaseLoading ? "Saving & Connecting..." : "Save Credentials & Connect"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleTestSupabase}
                      disabled={supabaseLoading}
                      className="btn-3d-dark px-4 py-2.5 text-xs text-[#c4d7cc] flex items-center gap-2 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${supabaseLoading ? "animate-spin" : ""}`} />
                      <span>Test Connection</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 1-Click Database Seeding */}
              <div className="linear-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-bold text-sm text-white">
                    1-Click Seed: Populate Supabase with 21 Authentic Facebook Artworks
                  </h3>
                </div>

                <p className="text-xs text-[#c4d7cc]">
                  Once you have created your Supabase tables using the SQL Schema below, click this button to upload all 21 authentic Facebook artworks (including Surah Al-Falaq, Ayat al-Kursi, Surah Ar-Rahman, authentic Bangla captions, dimensions, and prices) directly into your Supabase database.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSeedArtworks}
                    disabled={isSeeding || supabaseStatus !== "connected"}
                    className="btn-3d-emerald px-5 py-2.5 text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    <Upload className={`w-4 h-4 ${isSeeding ? "animate-bounce" : ""}`} />
                    <span>{isSeeding ? "Seeding 21 Artworks to Cloud..." : "Seed All 21 Artworks to Supabase"}</span>
                  </button>

                  {supabaseStatus !== "connected" && (
                    <span className="text-[11px] text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Connect Supabase above first to enable 1-click seeding
                    </span>
                  )}
                </div>
              </div>

              {/* Step-by-Step Setup Guide (Bangla & English) */}
              <div className="linear-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Server className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-bold text-sm text-white">
                    Supabase Setup Guide &bull; কিভাবে Supabase সেটআপ করবেন
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-[#c4d7cc]">
                  <div className="flex items-start gap-3 bg-[#07160f] p-3 rounded-xl border border-white/5">
                    <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#f4dc8a] font-bold flex items-center justify-center shrink-0 text-xs">
                      ১
                    </span>
                    <div>
                      <p className="font-semibold text-white">
                        Supabase ড্যাশবোর্ডে নতুন প্রোজেক্ট তৈরি করুন
                      </p>
                      <p className="text-[#8fa89a] text-[11px] mt-0.5">
                        আপনার Supabase একাউন্টে লগইন করে (<span className="text-white">supabase.com/dashboard</span>) &quot;New project&quot; এ ক্লিক করুন। নাম দিন <span className="text-[#f4dc8a] font-mono">tiyana-sukoon</span>, একটি শক্তিশালী ডাটাবেজ পাসওয়ার্ড সেট করুন এবং নিকটস্থ Region নির্বাচন করুন (যেমন Singapore ap-southeast-1)।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#07160f] p-3 rounded-xl border border-white/5">
                    <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#f4dc8a] font-bold flex items-center justify-center shrink-0 text-xs">
                      ২
                    </span>
                    <div>
                      <p className="font-semibold text-white">
                        SQL Editor-এ Schema রান করুন
                      </p>
                      <p className="text-[#8fa89a] text-[11px] mt-0.5">
                        বামপাশের মেনু থেকে <span className="text-white font-semibold">SQL Editor</span> এ ক্লিক করুন। নিচের &quot;Copy SQL Schema&quot; বাটনে ক্লিক করে পুরো কোডটি কপি করুন এবং Supabase SQL Editor-এ পেস্ট করে <span className="text-emerald-400 font-semibold">Run</span> বাটনে ক্লিক করুন। এতে <span className="font-mono text-white">artworks, orders, inquiries, site_settings</span> টেবিল তৈরি হয়ে যাবে।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#07160f] p-3 rounded-xl border border-white/5">
                    <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#f4dc8a] font-bold flex items-center justify-center shrink-0 text-xs">
                      ৩
                    </span>
                    <div>
                      <p className="font-semibold text-white">
                        Project URL এবং Anon Key কপি করে কানেক্ট করুন
                      </p>
                      <p className="text-[#8fa89a] text-[11px] mt-0.5">
                        Supabase এর <span className="text-white font-semibold">Project Settings (গিয়ার আইকন) &gt; API</span> অপশনে যান। সেখান থেকে <span className="font-mono text-white">Project URL</span> এবং <span className="font-mono text-white">anon / public</span> কি কপি করে উপরের ইনপুট বক্সে বসিয়ে <span className="text-[#f4dc8a] font-semibold">&quot;Save Credentials &amp; Connect&quot;</span> বাটনে চাপুন।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#07160f] p-3 rounded-xl border border-white/5">
                    <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#f4dc8a] font-bold flex items-center justify-center shrink-0 text-xs">
                      ৪
                    </span>
                    <div>
                      <p className="font-semibold text-white">
                        &quot;Seed All 21 Artworks&quot; এ ১-ক্লিক করুন
                      </p>
                      <p className="text-[#8fa89a] text-[11px] mt-0.5">
                        কানেক্ট হয়ে গেলে উপরের &quot;Seed All 21 Artworks to Supabase&quot; বাটনে ক্লিক করলেই ফেসবুক পেজের ২১টি অরিজিনাল ক্যালিগ্রাফি আর্টওয়ার্ক স্বয়ংক্রিয়ভাবে আপনার সুপাবেস ডাটাবেজে আপলোড হয়ে যাবে!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete SQL Schema Viewer */}
              <div className="linear-card p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#d4af37]" />
                    <h3 className="font-bold text-sm text-white">
                      Complete PostgreSQL Database Schema (SQL)
                    </h3>
                  </div>
                  <button
                    onClick={handleCopySql}
                    className="btn-3d-dark px-3 py-1.5 text-xs flex items-center gap-1.5 text-[#f4dc8a]"
                  >
                    {sqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{sqlCopied ? "Copied!" : "Copy SQL"}</span>
                  </button>
                </div>

                <p className="text-xs text-[#8fa89a]">
                  This schema creates the 4 necessary tables with indexes and Row Level Security (RLS) policies allowing public browsing and client updates.
                </p>

                <div className="relative">
                  <pre className="p-4 rounded-xl bg-[#030906] border border-white/10 text-[11px] font-mono text-[#a5c4b2] overflow-x-auto max-h-80 overflow-y-auto leading-relaxed">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1e13] border border-[#d4af37]/40 rounded-2xl max-w-xl w-full p-6 text-xs space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-bold text-base text-white">
                  Tiyana&apos;s Sukoon Studio Invoice
                </h3>
                <p className="text-[11px] text-[#8fa89a]">
                  Dhaka, Bangladesh &bull; {settings.phone1}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="p-1 rounded-lg bg-[#07160f] text-[#8fa89a] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#07160f] p-3.5 rounded-xl border border-white/5">
              <div>
                <span className="text-[#8fa89a]">Billed To:</span>
                <p className="font-bold text-white mt-0.5">
                  {selectedOrderForInvoice.customerName}
                </p>
                <p className="text-[#c4d7cc]">{selectedOrderForInvoice.phone}</p>
                <p className="text-[#8fa89a] text-[11px] mt-1">
                  {selectedOrderForInvoice.address}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[#8fa89a]">Invoice No:</span>
                <p className="font-mono font-bold text-[#f4dc8a] text-sm mt-0.5">
                  {selectedOrderForInvoice.orderNumber}
                </p>
                <p className="text-[#8fa89a] text-[11px]">
                  Date:{" "}
                  {new Date(
                    selectedOrderForInvoice.createdAt
                  ).toLocaleDateString()}
                </p>
                <p className="text-emerald-400 font-semibold uppercase mt-1">
                  Status: {selectedOrderForInvoice.status}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[#8fa89a] font-semibold">Ordered Artwork:</span>
              {selectedOrderForInvoice.items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#07160f] flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {it.quantity}x {it.artwork.title}
                    </p>
                    <p className="text-[10px] text-[#8fa89a]">
                      Frame: {it.selectedFrame || it.artwork.dimensions}
                    </p>
                  </div>
                  <span className="font-bold text-[#fceb9e]">
                    ৳{(it.artwork.price * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-3 space-y-1.5 text-right">
              <div className="flex justify-between text-[#8fa89a]">
                <span>Artwork Subtotal</span>
                <span>৳{selectedOrderForInvoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#8fa89a]">
                <span>Packaging &amp; Delivery</span>
                <span>৳{selectedOrderForInvoice.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white border-t border-white/5 pt-1">
                <span>Total Amount Payable</span>
                <span className="text-[#fceb9e]">
                  ৳{selectedOrderForInvoice.totalAmount.toLocaleString()} BDT
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="btn-3d-gold px-4 py-2 text-xs flex items-center gap-1.5 font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Artwork Modal (With Image Selection & All Details) */}
      {isAddingArtwork && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1e13] border border-[#d4af37]/40 rounded-2xl max-w-2xl w-full p-6 text-xs space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white">Add New Artwork &amp; Image</h3>
              <button
                onClick={() => setIsAddingArtwork(false)}
                className="p-1 rounded-lg bg-[#07160f] text-[#8fa89a] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Dual-Mode Image Upload (Local File + URL + Presets) */}
              <ImageSourceControl
                label="Primary Cover Image (মূল কভার ছবি)"
                currentValue={newArtForm.image}
                onChange={(newUrl) => setNewArtForm({ ...newArtForm, image: newUrl })}
                presets={GALLERY_IMAGE_PRESETS}
              />

              {/* Multiple Gallery Images with Full Local Multi-File Drag-and-Drop, URL & Presets */}
              <MultiGalleryImageControl
                images={newArtForm.images || []}
                onChange={(updatedImages) =>
                  setNewArtForm({ ...newArtForm, images: updatedImages })
                }
                presets={GALLERY_IMAGE_PRESETS}
              />

              {/* Title & Bangla Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Artwork Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Surah Al-Falaq Desert Art"
                    value={newArtForm.title}
                    onChange={(e) =>
                      setNewArtForm({ ...newArtForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Bangla Title (বাংলা শিরোনাম)</label>
                  <input
                    type="text"
                    placeholder="e.g. সূরা আল-ফালাক টেক্সচার আর্ট"
                    value={newArtForm.titleBangla}
                    onChange={(e) =>
                      setNewArtForm({ ...newArtForm, titleBangla: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Category</label>
                  <CustomSelect
                    value={newArtForm.category}
                    onChange={(val) =>
                      setNewArtForm({
                        ...newArtForm,
                        category: val as ArtworkCategory,
                      })
                    }
                    options={CATEGORY_OPTIONS}
                  />
                </div>
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Price (৳ BDT) *</label>
                  <input
                    type="number"
                    value={newArtForm.price}
                    onChange={(e) =>
                      setNewArtForm({
                        ...newArtForm,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    value={newArtForm.originalPrice}
                    onChange={(e) =>
                      setNewArtForm({
                        ...newArtForm,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Dimensions, Finish, Badge */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={newArtForm.dimensions}
                    onChange={(e) =>
                      setNewArtForm({ ...newArtForm, dimensions: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Finish (ফিনিশ)</label>
                  <input
                    type="text"
                    placeholder="e.g. ✨ Gloss Varnished Finish"
                    value={newArtForm.finish}
                    onChange={(e) =>
                      setNewArtForm({ ...newArtForm, finish: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Badge</label>
                  <input
                    type="text"
                    value={newArtForm.badge}
                    onChange={(e) =>
                      setNewArtForm({ ...newArtForm, badge: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Medium */}
              <div>
                <label className="block text-[#c4d7cc] mb-1">Medium &amp; Materials</label>
                <input
                  type="text"
                  value={newArtForm.medium}
                  onChange={(e) =>
                    setNewArtForm({ ...newArtForm, medium: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-[#c4d7cc] mb-1">Detailed Description (ফেসবুক পোস্টের মূল টেক্সট)</label>
                <textarea
                  rows={3}
                  value={newArtForm.description}
                  onChange={(e) =>
                    setNewArtForm({ ...newArtForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingArtwork(false)}
                  className="btn-3d-dark px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newArtForm.title.trim()) {
                      alert("Please provide an artwork title.");
                      return;
                    }
                    addArtwork(newArtForm);
                    setIsAddingArtwork(false);
                  }}
                  className="btn-3d-gold px-5 py-2 font-bold"
                >
                  Publish to Store
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Artwork Modal (Full Image Swap & Details) */}
      {editingArtwork && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1e13] border border-[#d4af37]/40 rounded-2xl max-w-2xl w-full p-6 text-xs space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Edit Artwork &amp; Image</h3>
                <p className="text-[11px] text-[#8fa89a]">
                  Modify image source, Bengali details, dimensions, and prices.
                </p>
              </div>
              <button
                onClick={() => setEditingArtwork(null)}
                className="p-1 rounded-lg bg-[#07160f] text-[#8fa89a] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Dual-Mode Image Upload (Local File + URL + Presets) */}
              <ImageSourceControl
                label="Primary Cover Image (মূল কভার ছবি)"
                currentValue={editingArtwork.image}
                onChange={(newUrl) =>
                  setEditingArtwork({ ...editingArtwork, image: newUrl })
                }
                presets={GALLERY_IMAGE_PRESETS}
              />

              {/* Multiple Gallery Images with Full Local Multi-File Drag-and-Drop, URL & Presets */}
              <MultiGalleryImageControl
                images={editingArtwork.images || []}
                onChange={(updatedImages) =>
                  setEditingArtwork({ ...editingArtwork, images: updatedImages })
                }
                presets={GALLERY_IMAGE_PRESETS}
              />

              {/* Title & Bangla Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Artwork Title (English) *</label>
                  <input
                    type="text"
                    value={editingArtwork.title}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Bangla Title (বাংলা শিরোনাম)</label>
                  <input
                    type="text"
                    value={editingArtwork.titleBangla || ""}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, titleBangla: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white font-serif"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Category</label>
                  <CustomSelect
                    value={editingArtwork.category}
                    onChange={(val) =>
                      setEditingArtwork({
                        ...editingArtwork,
                        category: val as ArtworkCategory,
                      })
                    }
                    options={CATEGORY_OPTIONS}
                  />
                </div>
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Price (৳ BDT) *</label>
                  <input
                    type="number"
                    value={editingArtwork.price}
                    onChange={(e) =>
                      setEditingArtwork({
                        ...editingArtwork,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    value={editingArtwork.originalPrice || ""}
                    onChange={(e) =>
                      setEditingArtwork({
                        ...editingArtwork,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Dimensions, Finish, Badge */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={editingArtwork.dimensions}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, dimensions: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Finish (ফিনিশ)</label>
                  <input
                    type="text"
                    value={editingArtwork.finish || ""}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, finish: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#c4d7cc] mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingArtwork.badge || ""}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, badge: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Medium */}
              <div>
                <label className="block text-[#c4d7cc] mb-1">Medium &amp; Materials</label>
                <input
                  type="text"
                  value={editingArtwork.medium}
                  onChange={(e) =>
                    setEditingArtwork({ ...editingArtwork, medium: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#c4d7cc] mb-1">Detailed Description (ফেসবুক পোস্টের মূল বিবরণ)</label>
                <textarea
                  rows={3}
                  value={editingArtwork.description}
                  onChange={(e) =>
                    setEditingArtwork({ ...editingArtwork, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white leading-relaxed"
                />
              </div>

              {/* Status toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingArtwork.inStock}
                    onChange={(e) =>
                      setEditingArtwork({
                        ...editingArtwork,
                        inStock: e.target.checked,
                      })
                    }
                    className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                  />
                  <span className="text-white font-medium">In Stock (স্টকে প্রস্তুত)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingArtwork.isFeatured}
                    onChange={(e) =>
                      setEditingArtwork({
                        ...editingArtwork,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                  />
                  <span className="text-white font-medium">Featured on Homepage</span>
                </label>

                {/* Hero Carousel Toggle */}
                {(() => {
                  const heroIds =
                    settings.heroCarouselArtworkIds ||
                    artworks.slice(0, 8).map((a) => a.id);
                  const inHero = heroIds.includes(editingArtwork.id);
                  return (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inHero}
                        onChange={() => toggleHeroCarouselArtwork(editingArtwork.id)}
                        className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                      />
                      <span className="text-white font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Hero Carousel Slide (হিরো স্লাইডার)</span>
                      </span>
                    </label>
                  );
                })()}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingArtwork(null)}
                  className="btn-3d-dark px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateArtwork(editingArtwork.id, editingArtwork);
                    setEditingArtwork(null);
                  }}
                  className="btn-3d-gold px-5 py-2 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED CORE THEME ASSET IMAGE SWITCHER MODAL */}
      {activeCoreImageModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn pointer-events-auto"
          onClick={() => setActiveCoreImageModal(null)}
        >
          <div
            className="w-full max-w-2xl linear-card p-6 sm:p-7 rounded-3xl border border-[#d4af37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.25)] space-y-5 animate-scaleUp max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner">
                  {activeCoreImageModal === "logo" && <ShieldCheck className="w-6 h-6" />}
                  {activeCoreImageModal === "hero" && <Sparkles className="w-6 h-6" />}
                  {activeCoreImageModal === "story" && <Palette className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {activeCoreImageModal === "logo" && "Change Brand Identity Logo (লোগো পরিবর্তন)"}
                    {activeCoreImageModal === "hero" && "Change Hero 3D Highlight Canvas (৩ডি ফ্রেম আর্টপিস পরিবর্তন)"}
                    {activeCoreImageModal === "story" && "Change Philosophy Story Image (ব্র্যান্ড দর্শন ইমেজ পরিবর্তন)"}
                  </h3>
                  <p className="text-xs text-[#8fa89a]">
                    {activeCoreImageModal === "logo" && "কম্পিউটার/মোবাইল থেকে নতুন লোগো আপলোড করুন অথবা স্টুডিও কালেকশন থেকে নির্বাচন করুন।"}
                    {activeCoreImageModal === "hero" && "হোমপেজের টপে ৩ডি ভাসমান ফ্রেমের প্রধান আর্টপিস নির্বাচন করুন।"}
                    {activeCoreImageModal === "story" && "আওয়ার ফিলোসফি (Story) সেকশনের প্রধান ভিজ্যুয়াল ছবি নির্বাচন করুন।"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCoreImageModal(null)}
                className="p-1.5 rounded-xl bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Generous, Full-Width ImageSourceControl */}
            <div className="space-y-4">
              {activeCoreImageModal === "logo" && (
                <ImageSourceControl
                  label="Select Brand Logo Source"
                  currentValue={settings.siteLogo || "/brand/logo.jpg"}
                  onChange={(newUrl) => {
                    updateSettings({ siteLogo: newUrl });
                    showToast("ব্র্যান্ড লোগো সফলভাবে পরিবর্তন করা হয়েছে! ✓", "success");
                  }}
                  presets={GALLERY_IMAGE_PRESETS.slice(0, 5)}
                />
              )}

              {activeCoreImageModal === "hero" && (
                <ImageSourceControl
                  label="Select Hero 3D Highlight Canvas Source"
                  currentValue={settings.heroImage || "/artwork/artwork_4.jpg"}
                  onChange={(newUrl) => {
                    updateSettings({ heroImage: newUrl });
                    showToast("হিরো ৩ডি আর্টপিস সফলভাবে পরিবর্তন করা হয়েছে! ✓", "success");
                  }}
                  presets={GALLERY_IMAGE_PRESETS}
                />
              )}

              {activeCoreImageModal === "story" && (
                <ImageSourceControl
                  label="Select Philosophy Story Image Source"
                  currentValue={settings.storyImage || "/artwork/artwork_1.jpg"}
                  onChange={(newUrl) => {
                    updateSettings({ storyImage: newUrl });
                    showToast("ব্র্যান্ড স্টোরি ব্যানার সফলভাবে পরিবর্তন করা হয়েছে! ✓", "success");
                  }}
                  presets={GALLERY_IMAGE_PRESETS}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>পরিবর্তন স্বয়ংক্রিয়ভাবে লাইভ স্টোরে সেভ হয়</span>
              </span>

              <button
                type="button"
                onClick={() => setActiveCoreImageModal(null)}
                className="btn-3d-gold px-6 py-2 text-xs font-bold"
              >
                সম্পন্ন (Done)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD NEW HERO CAROUSEL SLIDE MODAL */}
      {isAddSlideModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn pointer-events-auto"
          onClick={() => setIsAddSlideModalOpen(false)}
        >
          <div
            className="w-full max-w-xl linear-card p-6 sm:p-7 rounded-3xl border border-[#d4af37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(212,175,55,0.2)] space-y-5 animate-scaleUp max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    নতুন হিরো স্লাইড তৈরি ও যুক্ত করুন (Add Hero Slide)
                  </h3>
                  <p className="text-[11px] text-[#8fa89a]">
                    ছবি আপলোড করুন অথবা গ্যালারি ও লিঙ্ক থেকে ছবি নির্বাচন করুন।
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSlideModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Image Source Control */}
              <ImageSourceControl
                label="স্লাইডের ছবি (Image Source)"
                currentValue={newSlideData.image}
                onChange={(url) => {
                  setNewSlideData((prev) => ({ ...prev, image: url }));
                  // Auto-fill title if preset matches
                  const matchedPreset = GALLERY_IMAGE_PRESETS.find((p) => p.path === url);
                  if (matchedPreset && !newSlideData.title) {
                    setNewSlideData((prev) => ({
                      ...prev,
                      title: matchedPreset.label,
                      titleBangla: matchedPreset.label,
                    }));
                  }
                }}
                presets={GALLERY_IMAGE_PRESETS}
              />

              {/* Title Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#c4d7cc] mb-1">
                    Title (ইংরেজি নাম) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ayat al-Kursi Gold Leaf"
                    value={newSlideData.title}
                    onChange={(e) =>
                      setNewSlideData({ ...newSlideData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#07160f] border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#c4d7cc] mb-1">
                    বাংলা নাম (Bangla Title)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. আয়াতুল কুরসি গোল্ডেন ক্যানভাস"
                    value={newSlideData.titleBangla}
                    onChange={(e) =>
                      setNewSlideData({ ...newSlideData, titleBangla: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#07160f] border border-white/15 text-white font-serif focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Price, Category & Dimensions */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#c4d7cc] mb-1">
                    মূল্য (৳ Price)
                  </label>
                  <input
                    type="number"
                    value={newSlideData.price}
                    onChange={(e) =>
                      setNewSlideData({
                        ...newSlideData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#07160f] border border-white/15 text-white font-bold font-mono focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#c4d7cc] mb-1">
                    ক্যাটাগরি
                  </label>
                  <CustomSelect
                    value={newSlideData.category}
                    onChange={(val) =>
                      setNewSlideData({
                        ...newSlideData,
                        category: val as ArtworkCategory,
                      })
                    }
                    options={CAROUSEL_CATEGORY_OPTIONS}
                    buttonClassName="py-2 text-xs rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#c4d7cc] mb-1">
                    সাইজ (Dimensions)
                  </label>
                  <input
                    type="text"
                    value={newSlideData.dimensions}
                    onChange={(e) =>
                      setNewSlideData({
                        ...newSlideData,
                        dimensions: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#07160f] border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddSlideModalOpen(false)}
                className="btn-3d-dark px-4 py-2 text-xs"
              >
                বাতিল (Cancel)
              </button>

              <button
                type="button"
                onClick={handleCreateNewSlide}
                className="btn-3d-gold px-5 py-2 text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>সেভ করুন ও ক্যারোজেলে যোগ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM LUXURY CONFIRMATION DIALOG */}
      {confirmModal && confirmModal.isOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn pointer-events-auto"
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="w-full max-w-md linear-card p-6 sm:p-7 rounded-3xl border border-rose-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(244,63,94,0.18)] space-y-5 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Glowing Warning Icon */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-[#8fa89a] leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            {/* Target Item Name Box (if provided) */}
            {confirmModal.itemName && (
              <div className="p-3.5 rounded-2xl bg-[#06140b] border border-white/10 flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0 shadow-[0_0_8px_#fb7185]" />
                <p className="text-xs font-mono font-semibold text-[#fceb9e] truncate">
                  &quot;{confirmModal.itemName}&quot;
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="btn-3d-dark px-4 py-2.5 text-xs font-semibold rounded-xl"
              >
                বাতিল করুন (Cancel)
              </button>

              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-5 py-2.5 rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/60 flex items-center gap-2 transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>{confirmModal.confirmLabel || "হ্যাঁ, মুছে ফেলুন"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminPage() {
  return (
    <StoreProvider>
      <AdminDashboardInner />
    </StoreProvider>
  );
}

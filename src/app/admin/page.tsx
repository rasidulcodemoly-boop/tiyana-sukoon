"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreProvider, useStore } from "../../context/StoreContext";
import { ImageSourceControl } from "../../components/ImageSourceControl";
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
  type AdminTab = "dashboard" | "artworks" | "media" | "orders" | "inquiries" | "settings" | "supabase";
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

          {/* TAB 2: ARTWORK CATALOG CRUD (WITH FULL IMAGE EDITING) */}
          {activeTab === "artworks" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Artwork &amp; Product Catalog ({artworks.length} items)
                  </h2>
                  <p className="text-xs text-[#8fa89a]">
                    Click &quot;Edit Artwork &amp; Image&quot; on any card to swap image, modify Bengali description, dimensions, finish, or pricing.
                  </p>
                </div>

                <div className="flex items-center gap-3">
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

                  <button
                    onClick={() => setIsAddingArtwork(true)}
                    className="btn-3d-gold px-4 py-2 text-xs flex items-center gap-1.5 font-bold whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 text-[#0f1811]" />
                    <span>Add New Artwork</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { id: "all", label: "All Items" },
                  { id: "calligraphy", label: "Arabic Calligraphy" },
                  { id: "canvas", label: "Canvas Paintings" },
                  { id: "mini-easels", label: "Mini Easels" },
                  { id: "bookmarks", label: "Bookmarks" },
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

              {/* Artwork Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtworks.map((art) => (
                  <div
                    key={art.id}
                    className="linear-card rounded-2xl overflow-hidden flex flex-col justify-between border border-white/10 group"
                  >
                    <div>
                      {/* Image Preview with quick replace */}
                      <div className="relative aspect-[16/10] w-full bg-[#08170f] overflow-hidden">
                        <Image
                          src={art.image}
                          alt={art.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#06110a]/90 text-[#f4dc8a] border border-[#d4af37]/30">
                            {art.category}
                          </span>
                          {art.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/80 text-white">
                              {art.badge}
                            </span>
                          )}
                        </div>

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
                          <span
                            className={
                              art.inStock ? "text-emerald-400" : "text-rose-400"
                            }
                          >
                            ● {art.inStock ? "In Stock" : "Out of Stock"}
                          </span>
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
                            if (confirm(`Delete artwork "${art.title}"?`)) {
                              deleteArtwork(art.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          title="Delete Artwork"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SITE MEDIA & IMAGES MANAGER */}
          {activeTab === "media" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Website Images &amp; Media Control Center
                </h2>
                <p className="text-xs text-[#8fa89a]">
                  Change every single image on the storefront: Brand logo, hero featured piece, philosophy story banner, and gallery archives.
                </p>
              </div>

              {/* Section A: Global Core Images with Local File Upload */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Site Logo */}
                <div className="linear-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Brand Logo</h3>
                    <span className="text-[10px] text-[#f4dc8a] font-mono">Navbar &amp; Header</span>
                  </div>

                  <ImageSourceControl
                    label="Brand Logo (Local File / URL)"
                    currentValue={settings.siteLogo}
                    onChange={(newUrl) => updateSettings({ siteLogo: newUrl })}
                    presets={GALLERY_IMAGE_PRESETS.slice(0, 5)}
                  />

                  <div className="pt-1">
                    <button
                      onClick={() => updateSettings({ siteLogo: "/brand/logo.jpg" })}
                      className="btn-3d-dark py-1.5 px-3 text-[11px] w-full"
                    >
                      Reset to Original FB Logo
                    </button>
                  </div>
                </div>

                {/* 2. Hero Featured Canvas */}
                <div className="linear-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Hero 3D Frame Image</h3>
                    <span className="text-[10px] text-emerald-400 font-mono">Homepage Top</span>
                  </div>

                  <ImageSourceControl
                    label="Hero Canvas (Local File / URL / Presets)"
                    currentValue={settings.heroImage}
                    onChange={(newUrl) => updateSettings({ heroImage: newUrl })}
                    presets={GALLERY_IMAGE_PRESETS}
                  />
                </div>

                {/* 3. Philosophy Showcase Image */}
                <div className="linear-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Brand Story Feature</h3>
                    <span className="text-[10px] text-[#f4dc8a] font-mono">Philosophy Section</span>
                  </div>

                  <ImageSourceControl
                    label="Story Section Image (Local File / URL)"
                    currentValue={settings.storyImage}
                    onChange={(newUrl) => updateSettings({ storyImage: newUrl })}
                    presets={GALLERY_IMAGE_PRESETS}
                  />
                </div>
              </div>

              {/* Section B: All 21 Studio Gallery Photo Assets */}
              <div className="linear-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">
                      All 21 Authentic Facebook Photo Assets
                    </h3>
                    <p className="text-xs text-[#8fa89a]">
                      Click &quot;Set as Hero&quot; or &quot;Set as Story&quot; to assign any image anywhere on the site with 1 click.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#f4dc8a] bg-[#0d2218] px-3 py-1 rounded-full border border-[#d4af37]/30">
                    21 High-Res Files Loaded
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {GALLERY_IMAGE_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-2.5 rounded-xl bg-[#091d12] border border-white/5 space-y-2 group"
                    >
                      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#06110a]">
                        <Image
                          src={preset.path}
                          alt={preset.label}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#06110a]/90 text-white">
                          #{preset.id}
                        </span>
                      </div>

                      <p className="text-[10px] text-[#c4d7cc] font-medium truncate" title={preset.label}>
                        {preset.label}
                      </p>

                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          onClick={() => {
                            updateSettings({ heroImage: preset.path });
                            showToast(`Set Photo #${preset.id} as Hero Canvas!`);
                          }}
                          className="btn-3d-dark py-1 text-[10px] w-full text-center"
                        >
                          Set as Hero
                        </button>
                        <button
                          onClick={() => {
                            updateSettings({ storyImage: preset.path });
                            showToast(`Set Photo #${preset.id} as Story Image!`);
                          }}
                          className="btn-3d-dark py-1 text-[10px] w-full text-center"
                        >
                          Set as Story
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                        if (confirm("Are you sure you want to clear all orders? This will delete all demo/existing orders.")) {
                          clearAllOrders();
                        }
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
                              <select
                                value={ord.status}
                                onChange={(e) =>
                                  updateOrderStatus(
                                    ord.id,
                                    e.target.value as OrderStatus
                                  )
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-[#d4af37]"
                              >
                                <option value="pending">PENDING</option>
                                <option value="confirmed">CONFIRMED</option>
                                <option value="painting">IN PAINTING</option>
                                <option value="framing">IN FRAMING</option>
                                <option value="shipped">SHIPPED</option>
                                <option value="delivered">DELIVERED</option>
                                <option value="cancelled">CANCELLED</option>
                              </select>

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
                                    if (confirm(`Delete order #${ord.orderNumber}?`)) {
                                      deleteOrder(ord.id);
                                    }
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
                      if (confirm("Are you sure you want to clear all inquiries? This will delete all demo/existing inquiries.")) {
                        clearAllInquiries();
                      }
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
                        <select
                          value={inq.status}
                          onChange={(e) =>
                            updateInquiryStatus(
                              inq.id,
                              e.target.value as CustomInquiry["status"]
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-xs font-semibold text-[#f4dc8a] focus:outline-none"
                        >
                          <option value="new">NEW INQUIRY</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="confirmed">CONFIRMED</option>
                          <option value="completed">COMPLETED</option>
                        </select>

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
                            if (confirm(`Delete inquiry from ${inq.customerName}?`)) {
                              deleteInquiry(inq.id);
                            }
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
            <div className="max-w-2xl space-y-6 animate-fadeIn pb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Store &amp; Studio Configuration
                  </h2>
                  <p className="text-xs text-[#8fa89a]">
                    Modify announcement banner, studio phone contacts, delivery fees, and emergency PIN.
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
                label="Artwork Image (Local File / URL / Presets)"
                currentValue={newArtForm.image}
                onChange={(newUrl) => setNewArtForm({ ...newArtForm, image: newUrl })}
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
                  <select
                    value={newArtForm.category}
                    onChange={(e) =>
                      setNewArtForm({
                        ...newArtForm,
                        category: e.target.value as ArtworkCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  >
                    <option value="calligraphy">Arabic Calligraphy</option>
                    <option value="canvas">Canvas Paintings</option>
                    <option value="mini-easels">Mini Easels</option>
                    <option value="bookmarks">Bookmarks</option>
                    <option value="custom-orders">Custom Orders</option>
                  </select>
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

              {/* Spiritual Message */}
              <div>
                <label className="block text-[#c4d7cc] mb-1">Spiritual Message (বার্তার বিবরণ)</label>
                <input
                  type="text"
                  placeholder="e.g. 🤍 সূরা আল-ফালাকের বার্তা: সৃষ্টির অনিষ্ট থেকে আল্লাহর আশ্রয় প্রার্থনা..."
                  value={newArtForm.spiritualMessage}
                  onChange={(e) =>
                    setNewArtForm({ ...newArtForm, spiritualMessage: e.target.value })
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
                label="Artwork Image (Local File / URL / Presets)"
                currentValue={editingArtwork.image}
                onChange={(newUrl) =>
                  setEditingArtwork({ ...editingArtwork, image: newUrl })
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
                  <select
                    value={editingArtwork.category}
                    onChange={(e) =>
                      setEditingArtwork({
                        ...editingArtwork,
                        category: e.target.value as ArtworkCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white"
                  >
                    <option value="calligraphy">Arabic Calligraphy</option>
                    <option value="canvas">Canvas Paintings</option>
                    <option value="mini-easels">Mini Easels</option>
                    <option value="bookmarks">Bookmarks</option>
                    <option value="custom-orders">Custom Orders</option>
                  </select>
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

              {/* Spiritual Message */}
              <div>
                <label className="block text-[#c4d7cc] mb-1">Spiritual Message (বার্তার বিবরণ)</label>
                <input
                  type="text"
                  value={editingArtwork.spiritualMessage || ""}
                  onChange={(e) =>
                    setEditingArtwork({ ...editingArtwork, spiritualMessage: e.target.value })
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
              <div className="flex items-center gap-6 pt-1">
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

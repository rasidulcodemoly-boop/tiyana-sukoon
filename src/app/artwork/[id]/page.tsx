"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { StoreProvider, useStore } from "../../../context/StoreContext";
import { initialArtworks, initialReviews } from "../../../data/initialData";
import { Artwork } from "../../../types";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { CartDrawer } from "../../../components/CartDrawer";
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  Check,
  Star,
  MessageCircle,
  Truck,
  ShieldCheck,
  Ruler,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Heart,
  FileText,
  BadgeCheck,
  Eye,
  Share2,
  Copy,
} from "lucide-react";

// Internal Artwork Detail Content Component
const ArtworkDetailContent: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const artworkId = params?.id as string;

  const {
    artworks,
    addToCart,
    setIsCartOpen,
    settings,
    language,
    t,
    showToast,
  } = useStore();

  // Find target artwork
  const item = useMemo(() => {
    return (
      artworks.find((a) => a.id === artworkId) ||
      initialArtworks.find((a) => a.id === artworkId) ||
      null
    );
  }, [artworks, artworkId]);

  // Master map for guaranteed globally unique serial codes (#TS-01, #TS-02...)
  const artworkCodeMap = useMemo(() => {
    const map = new Map<string, string>();
    artworks.forEach((art, idx) => {
      map.set(art.id, `#TS-${String(idx + 1).padStart(2, "0")}`);
    });
    return map;
  }, [artworks]);

  const itemCode = item
    ? artworkCodeMap.get(item.id) ||
      `#TS-${String(artworks.findIndex((a) => a.id === item?.id) + 1 || 1).padStart(2, "0")}`
    : "#TS-01";

  // Gallery images list (primary + gallery images deduplicated)
  const galleryList = useMemo(() => {
    if (!item) return [];
    const list: string[] = [item.image, ...(item.images || [])].filter(
      (url, idx, self) => Boolean(url) && self.indexOf(url) === idx
    );
    return list.length > 1
      ? list
      : [
          item.image,
          "/artwork/artwork_4.jpg",
          "/artwork/artwork_5.jpg",
          "/artwork/artwork_6.jpg",
        ].filter((url, idx, self) => Boolean(url) && self.indexOf(url) === idx);
  }, [item]);

  const [activeImage, setActiveImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [added, setAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (item) {
      setActiveImage(item.image);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [item]);

  if (!item) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">আর্টওয়ার্ক খুঁজে পাওয়া যায়নি</h2>
        <p className="text-sm text-[#8fa89a] mb-6">
          অনুরোধকৃত আর্টওয়ার্কটি বর্তমানে উপলব্ধ নেই বা রিমুভ করা হয়েছে।
        </p>
        <Link
          href="/#collections"
          className="btn-3d-gold px-6 py-2.5 text-xs font-bold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল আর্ট কালেকশনে ফিরে যান</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(item, 1, "Floating Gold Leaf Frame");
    setAdded(true);
    showToast(`"${item.title}" কার্টে যুক্ত হয়েছে! ✓`, "success");
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    addToCart(item, 1, "Floating Gold Leaf Frame");
    setIsCartOpen(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast("আর্টওয়ার্ক লিঙ্ক কপি হয়েছে! ✓", "info");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // WhatsApp Message Link
  const getWhatsAppLink = () => {
    const cleanPhone = (settings.whatsapp || "8801752317851").replace(/[^0-9]/g, "");
    const text = `আসসালামু আলাইকুম! আমি Tiyana's Sukoon থেকে "${item.title}" (${itemCode}, সাইজ: ${item.dimensions}, মূল্য: ৳${item.price.toLocaleString()}) আর্টওয়ার্কটি অর্ডার করতে চাই।`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Facebook Messenger Direct Link
  const getMessengerLink = () => {
    const match = settings.facebookUrl?.match(/id=(\d+)/);
    if (match && match[1]) {
      return `https://m.me/${match[1]}`;
    }
    return `https://m.me/61594949745258`;
  };

  // Facebook Page Direct Link
  const getFacebookPageLink = () => {
    return (
      settings.facebookUrl ||
      "https://www.facebook.com/profile.php?id=61594949745258"
    );
  };

  // Related artworks
  const relatedArtworks = artworks
    .filter((a) => a.id !== item.id)
    .slice(0, 4);

  return (
    <div className="relative min-h-screen bg-[#06110a] text-[#f4f8f5] selection:bg-[#d4af37]/30 selection:text-[#f4dc8a]">
      {/* Navigation Bar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10 mb-8">
          <div className="flex items-center gap-2 text-xs text-[#8fa89a] overflow-x-auto scrollbar-none py-1">
            <Link
              href="/"
              className="hover:text-[#f4dc8a] transition-colors whitespace-nowrap"
            >
              হোম (Home)
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#526a5c] flex-shrink-0" />
            <Link
              href="/#collections"
              className="hover:text-[#f4dc8a] transition-colors whitespace-nowrap"
            >
              কালেকশন (Collections)
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#526a5c] flex-shrink-0" />
            <span className="text-[#f4dc8a] font-medium truncate max-w-[200px] sm:max-w-xs">
              {item.title}
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleCopyLink}
              className="py-1.5 px-3 rounded-xl bg-[#091f14] hover:bg-[#102d1d] text-[#c4d7cc] hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Share Link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>লিঙ্ক শেয়ার</span>
                </>
              )}
            </button>

            <Link
              href="/#collections"
              className="py-1.5 px-3 rounded-xl bg-[#091f14] hover:bg-[#102d1d] text-[#c4d7cc] hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>কালেকশনে ফিরে যান</span>
            </Link>
          </div>
        </div>

        {/* Product Showcase Stage: Left (Gallery) & Right (Purchase Hub) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: MULTI-IMAGE GALLERY (3:4 Ratio) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Large Main Display Image (3:4 ratio) */}
            <div className="relative aspect-[3/4] w-full max-w-lg mx-auto lg:max-w-none rounded-2xl sm:rounded-3xl overflow-hidden bg-[#05110a] border border-[#d4af37]/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group">
              <Image
                src={activeImage || item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 580px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Status pill on image */}
              <div className="absolute bottom-4 left-4 z-10">
                <span className="text-xs text-emerald-400 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2 font-medium shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>In Studio (ঢাকা স্টুডিও থেকে প্রস্তুত)</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Row Below Main Image */}
            <div className="max-w-lg mx-auto lg:max-w-none space-y-2">
              <p className="text-[11px] text-[#8fa89a] font-mono uppercase tracking-wider">
                গ্যালারি ফটো ({galleryList.length}টি অ্যাঙ্গেল ভিউ — ক্লিক করে দেখুন):
              </p>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryList.map((imgUrl, idx) => {
                  const isActive = (activeImage || item.image) === imgUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative flex-shrink-0 w-20 h-24 sm:w-22 sm:h-26 rounded-xl overflow-hidden transition-all duration-200 ${
                        isActive
                          ? "border-2 border-[#d4af37] ring-2 ring-[#d4af37]/40 scale-105 shadow-lg"
                          : "border border-white/15 opacity-70 hover:opacity-100 hover:border-white/30"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="90px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MINIMAL DECISION & DIRECT ORDER HUB */}
          <div className="lg:col-span-6 space-y-6">
            {/* Unique Code & Dimensions Row */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#8fa89a]">
                <span className="font-mono font-bold text-xs text-[#f4dc8a] bg-[#0c2417] px-3 py-1 rounded-lg border border-[#d4af37]/40 shadow-sm tracking-wider">
                  {itemCode}
                </span>

                <span className="font-mono text-[#c4d7cc] font-semibold bg-[#0c2417] px-3 py-1 rounded-lg border border-white/10">
                  সাইজ: {item.dimensions}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight pt-1">
                {language === "bn" && item.titleBangla ? item.titleBangla : item.title}
              </h1>

              {item.titleBangla && language !== "bn" && (
                <p className="text-sm sm:text-base text-[#9cb5a6] font-serif">
                  {item.titleBangla}
                </p>
              )}
              {language === "bn" && (
                <p className="text-sm text-[#8fa89a] font-mono">
                  {item.title}
                </p>
              )}
            </div>

            {/* Price Showcase Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#071910] via-[#05130b] to-[#040e08] border border-[#d4af37]/30 flex items-baseline justify-between shadow-xl">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#fceb9e]">
                    ৳{item.price.toLocaleString()}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm sm:text-base text-[#8fa89a] line-through">
                      ৳{item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-400 mt-1 font-medium">
                  ✓ ক্যাশ অন ডেলিভারি ও সারাদেশে নিরাপদ কুরিয়ার সুবিধা
                </p>
              </div>

              {item.originalPrice && item.originalPrice > item.price && (
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#143d26] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm">
                  ৳{(item.originalPrice - item.price).toLocaleString()} সাশ্রয়
                </span>
              )}
            </div>

            {/* Concise Value Hook */}
            <p className="text-sm text-[#9cb5a6] leading-relaxed">
              {item.description}
            </p>

            {/* Primary Action Buttons (Website Checkout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3.5 px-4 rounded-xl text-sm font-semibold bg-[#0b2416] hover:bg-[#123823] text-[#f4dc8a] border border-[#d4af37]/40 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">কার্টে যুক্ত হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#f4dc8a]" />
                    <span>{t("colAddToCart")}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="btn-3d-gold py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95"
              >
                <Zap className="w-4 h-4 text-[#0f1811] fill-[#0f1811]" />
                <span>এখনই কিনুন (Buy Now)</span>
              </button>
            </div>

            {/* MULTI-CHANNEL SOCIAL ORDERING (WhatsApp, Messenger, Facebook) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#040e08] border border-white/10 space-y-3 shadow-inner">
              <p className="text-xs font-semibold text-[#c4d7cc] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#d4af37]" />
                <span>বা সরাসরি সোশ্যাল মিডিয়ায় মেসেজ দিয়ে অর্ডার করুন:</span>
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                {/* WhatsApp */}
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 rounded-xl text-xs font-bold text-white bg-[#128C7E] hover:bg-[#075E54] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  title="Order via WhatsApp"
                >
                  <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.18-.544-1.782-.738-2.923-2.548-3.011-2.668-.088-.119-.72-1.002-.72-1.913 0-.911.458-1.359.621-1.543.163-.184.356-.23.475-.23.119 0 .237.001.341.006.111.005.259-.042.404.308.148.356.505 1.233.548 1.323.044.09.073.195.015.311-.059.117-.089.19-.176.294-.088.104-.185.233-.264.313-.089.09-.181.188-.078.365.103.177.458.756.984 1.226.677.604 1.248.791 1.425.88.178.089.281.074.385-.045.104-.118.444-.518.563-.696.119-.177.237-.148.399-.089.163.059 1.037.489 1.215.578.178.089.296.133.34.208.045.074.045.43-.099.835z"/>
                  </svg>
                  <span className="truncate">WhatsApp</span>
                </a>

                {/* Messenger */}
                <a
                  href={getMessengerLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0084FF] to-[#00C6FF] hover:opacity-95 flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  title="Order via Facebook Messenger"
                >
                  <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.455 5.518 3.735 7.152V22l3.438-1.89c.895.248 1.84.384 2.827.384 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.055 12.443l-2.616-2.793-5.105 2.793 5.61-5.955 2.68 2.793 5.042-2.793-5.611 5.955z"/>
                  </svg>
                  <span className="truncate">Messenger</span>
                </a>

                {/* Facebook Page */}
                <a
                  href={getFacebookPageLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 rounded-xl text-xs font-bold text-white bg-[#1877F2] hover:bg-[#166fe5] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  title="Order via Facebook Page"
                >
                  <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="truncate">Facebook</span>
                </a>
              </div>
            </div>

            {/* Reassurance Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs text-[#8fa89a]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#d4af37]" />
                <span>সারাদেশে হোম ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>১০০% প্রটেক্টেড উডেন ফ্রেম</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: TABS (Description vs Customer Reviews) */}
        <div className="mt-14 pt-8 border-t border-white/10 space-y-6">
          {/* Tab Switcher */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "description"
                  ? "bg-[#112d1e] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
                  : "text-[#8fa89a] hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4 text-[#d4af37]" />
              <span>ডেসক্রিপশন ও আধ্যাত্মিক তাৎপর্য (Story &amp; Specs)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "reviews"
                  ? "bg-[#112d1e] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
                  : "text-[#8fa89a] hover:text-white hover:bg-white/5"
              }`}
            >
              <Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
              <span>কাস্টমার রিভিউ ({initialReviews.length})</span>
            </button>
          </div>

          {/* TAB 1: DESCRIPTION & STORY */}
          {activeTab === "description" && (
            <div className="space-y-6 animate-fadeIn max-w-4xl">
              {/* Spiritual Message Highlight */}
              {item.spiritualMessage && (
                <div className="p-5 rounded-2xl bg-[#0a2315] border border-[#d4af37]/35 text-xs sm:text-sm text-[#fceb9e] leading-relaxed font-serif shadow-md">
                  <div className="flex items-center gap-2 text-[#d4af37] mb-2 font-sans font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>পবিত্র আয়াত ও আধ্যাত্মিক তাৎপর্য</span>
                  </div>
                  {item.spiritualMessage}
                </div>
              )}

              {/* Full Description */}
              <div className="text-xs sm:text-sm text-[#c4d7cc] leading-relaxed space-y-3">
                <p>{item.description}</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#07160f] border border-white/5 space-y-1">
                  <p className="text-[10px] uppercase font-mono text-[#8fa89a]">মিডিয়াম ও টেক্সচার</p>
                  <p className="text-xs font-semibold text-white">{item.medium}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#07160f] border border-white/5 space-y-1">
                  <p className="text-[10px] uppercase font-mono text-[#8fa89a]">ফ্রেম ও ফিনিশিং</p>
                  <p className="text-xs font-semibold text-white">
                    {item.finish || "Floating Gold Leaf Archival Frame"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#07160f] border border-white/5 space-y-1">
                  <p className="text-[10px] uppercase font-mono text-[#8fa89a]">ক্যানভাস সাইজ</p>
                  <p className="text-xs font-semibold text-[#f4dc8a] font-mono">{item.dimensions}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#07160f] border border-white/5 space-y-1">
                  <p className="text-[10px] uppercase font-mono text-[#8fa89a]">প্যাকেজিং ও সেফটি</p>
                  <p className="text-xs font-semibold text-emerald-400">
                    ৩-লেয়ার বাবল ও উডেন ক্র্যাকিং প্রোটেকশন
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMER REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-6 animate-fadeIn max-w-4xl">
              {/* Rating Banner */}
              <div className="p-5 rounded-2xl bg-[#07160f] border border-[#d4af37]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-extrabold text-[#fceb9e]">5.0</div>
                  <div>
                    <div className="flex items-center gap-1 text-[#d4af37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#d4af37]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#8fa89a] mt-1">
                      ১০০% ভেরিফায়েড ক্রেতাদের ইতিবাচক রিভিউ
                    </p>
                  </div>
                </div>

                <span className="text-xs font-medium text-emerald-400 bg-[#0d2a1b] px-3.5 py-1.5 rounded-full border border-emerald-500/30 self-start sm:self-auto">
                  ✓ Verified Sukoon Collectors
                </span>
              </div>

              {/* Reviews List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-[#07160f] border border-white/5 hover:border-[#d4af37]/30 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{rev.author}</span>
                          {rev.verified && (
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </p>
                        <p className="text-[10px] text-[#8fa89a]">{rev.location}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-[#d4af37]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#d4af37]" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#c4d7cc] leading-relaxed italic">
                      &quot;{rev.comment}&quot;
                    </p>

                    <div className="text-[10px] text-[#6b8275] pt-1.5 border-t border-white/5 flex items-center justify-between">
                      <span>{rev.artworkTitle}</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RELATED ARTWORKS SECTION */}
        {relatedArtworks.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  সম্পর্কিত অন্যান্য ক্যালিগ্রাফি আর্ট (More Handcrafted Art)
                </h3>
                <p className="text-xs text-[#8fa89a] mt-0.5">
                  স্টুডিওর অন্যান্য জনপ্রিয় ক্যালিগ্রাফি ও ক্যানভাস কালেকশন ঘুরে দেখুন
                </p>
              </div>

              <Link
                href="/#collections"
                className="text-xs font-bold text-[#f4dc8a] hover:underline flex items-center gap-1"
              >
                <span>সব দেখুন</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {relatedArtworks.map((relArt) => {
                const relCode = artworkCodeMap.get(relArt.id) || "#TS-XX";
                return (
                  <Link
                    key={relArt.id}
                    href={`/artwork/${relArt.id}`}
                    className="group linear-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 border border-white/10 hover:border-[#d4af37]/40"
                  >
                    <div>
                      {/* 3:4 ratio container */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#07150d]">
                        <Image
                          src={relArt.image}
                          alt={relArt.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-3 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-[#8fa89a]">
                          <span className="font-mono font-bold text-[#f4dc8a] bg-[#0c2417] px-1.5 py-0.5 rounded text-[9px]">
                            {relCode}
                          </span>
                          <span className="font-mono">{relArt.dimensions}</span>
                        </div>

                        <h4 className="font-bold text-xs text-white group-hover:text-[#f4dc8a] transition-colors line-clamp-1">
                          {relArt.title}
                        </h4>

                        <span className="text-xs font-bold text-[#fceb9e]">
                          ৳{relArt.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer & Global Cart Drawer */}
      <Footer />
      <CartDrawer />
    </div>
  );
};

// Root Page Export wrapped with StoreProvider
export default function ArtworkDetailPage() {
  return (
    <StoreProvider>
      <ArtworkDetailContent />
    </StoreProvider>
  );
}
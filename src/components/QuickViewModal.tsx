"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useStore } from "../context/StoreContext";
import { initialReviews } from "../data/initialData";
import {
  X,
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
} from "lucide-react";

export const QuickViewModal: React.FC = () => {
  const {
    selectedArtworkForModal,
    setSelectedArtworkForModal,
    addToCart,
    setIsCartOpen,
    settings,
    language,
    t,
  } = useStore();

  const [activeImage, setActiveImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (selectedArtworkForModal) {
      setActiveImage(selectedArtworkForModal.image);
      setActiveTab("description");
      setAdded(false);
    }
  }, [selectedArtworkForModal]);

  if (!selectedArtworkForModal) return null;

  const item = selectedArtworkForModal;

  // Extract unique code or format #TS-XX
  const numMatch = item.id.match(/\d+/);
  const itemCode = numMatch ? `#TS-${numMatch[0].padStart(2, "0")}` : "#TS-01";

  // Build gallery images list (primary image + gallery images deduplicated)
  const galleryList: string[] = [
    item.image,
    ...(item.images || []),
  ].filter((url, idx, self) => Boolean(url) && self.indexOf(url) === idx);

  // If only 1 image exists, provide authentic studio companion shots for visual variety
  const displayGallery =
    galleryList.length > 1
      ? galleryList
      : [
          item.image,
          "/artwork/artwork_4.jpg",
          "/artwork/artwork_5.jpg",
          "/artwork/artwork_6.jpg",
        ].filter((url, idx, self) => Boolean(url) && self.indexOf(url) === idx);

  const handleAdd = () => {
    addToCart(item, 1, "Floating Gold Leaf Frame");
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    addToCart(item, 1, "Floating Gold Leaf Frame");
    setSelectedArtworkForModal(null);
    setIsCartOpen(true);
  };

  // WhatsApp Message Link
  const getWhatsAppLink = () => {
    const cleanPhone = (settings.whatsapp || "8801752317851").replace(/[^0-9]/g, "");
    const text = `আসসালামু আলাইকুম! আমি Tiyana's Sukoon থেকে "${item.title}" (${itemCode}, সাইজ: ${item.dimensions}, মূল্য: ৳${item.price.toLocaleString()}) আর্টওয়ার্কটি অর্ডার করতে চাই।`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Facebook Messenger Direct Link
  const getMessengerLink = () => {
    // If facebookUrl contains an ID or page slug, construct m.me link
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop with smooth blur */}
      <div
        onClick={() => setSelectedArtworkForModal(null)}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#091f14] via-[#07160f] to-[#040e08] border border-[#d4af37]/35 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden z-10 animate-fadeIn my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Header with Title & Close Button */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-white/10 bg-[#06140d]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-xs text-[#f4dc8a] bg-[#102a1b] px-2.5 py-0.5 rounded-md border border-[#d4af37]/35 shadow-sm">
              {itemCode}
            </span>
            <span className="text-xs text-[#8fa89a] hidden sm:inline">
              আর্টওয়ার্ক ডিটেইল ও ইনস্ট্যান্ট অর্ডার
            </span>
          </div>

          <button
            onClick={() => setSelectedArtworkForModal(null)}
            className="p-1.5 sm:p-2 rounded-full bg-[#0a2315] text-[#8fa89a] hover:text-white hover:bg-[#123822] border border-white/10 transition-all shadow-sm"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-7 custom-scrollbar">
          {/* Top Section: Left (Multi-image Gallery) & Right (Minimal Decision Hub) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* LEFT COLUMN: MULTI-IMAGE SHOWCASE */}
            <div className="md:col-span-6 space-y-3.5">
              {/* Large Main Display Image */}
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-[#05110a] border border-[#d4af37]/30 shadow-2xl group">
                <Image
                  src={activeImage || item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Badge */}
                {item.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#0a1b12]/90 text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm backdrop-blur-md">
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Status pill on image */}
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="text-[10px] text-emerald-400 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>In Studio (রেডি টু ডেলিভারি)</span>
                  </span>
                </div>
              </div>

              {/* Thumbnails Row (Small Images) */}
              <div>
                <p className="text-[10px] text-[#8fa89a] mb-2 font-mono uppercase tracking-wider">
                  গ্যালারি ফটো ({displayGallery.length}টি অ্যাঙ্গেল ভিউ)
                </p>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {displayGallery.map((imgUrl, idx) => {
                    const isActive = (activeImage || item.image) === imgUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(imgUrl)}
                        className={`relative flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden transition-all duration-200 ${
                          isActive
                            ? "border-2 border-[#d4af37] ring-2 ring-[#d4af37]/40 scale-105 shadow-md"
                            : "border border-white/15 opacity-70 hover:opacity-100 hover:border-white/30"
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: MINIMAL PURCHASE DECISION HUB */}
            <div className="md:col-span-6 space-y-4">
              {/* Category & Dimensions */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#8fa89a]">
                  <span className="font-mono text-[#d4af37] uppercase tracking-wider">
                    {item.category === "calligraphy"
                      ? "পবিত্র আরবি ক্যালিগ্রাফি"
                      : "হ্যান্ডমেড ক্যানভাস আর্ট"}
                  </span>
                  <span className="font-mono text-[#c4d7cc] font-semibold bg-[#0c2417] px-2 py-0.5 rounded border border-white/10">
                    সাইজ: {item.dimensions}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  {language === "bn" && item.titleBangla ? item.titleBangla : item.title}
                </h2>

                {item.titleBangla && language !== "bn" && (
                  <p className="text-xs text-[#9cb5a6] font-serif">
                    {item.titleBangla}
                  </p>
                )}
                {language === "bn" && (
                  <p className="text-xs text-[#8fa89a] font-mono">
                    {item.title}
                  </p>
                )}
              </div>

              {/* Price Box */}
              <div className="p-3.5 rounded-xl bg-[#07160f] border border-[#d4af37]/25 flex items-baseline justify-between shadow-inner">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#fceb9e]">
                      ৳{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs sm:text-sm text-[#8fa89a] line-through">
                        ৳{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-emerald-400 mt-0.5">
                    ✓ ক্যাশ অন ডেলিভারি ও সারাদেশে নিরাপদ কুরিয়ার
                  </p>
                </div>

                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-[#143d26] text-[#f4dc8a] border border-[#d4af37]/35 shadow-sm">
                    ৳{(item.originalPrice - item.price).toLocaleString()} সাশ্রয়
                  </span>
                )}
              </div>

              {/* Short Hook Description (Low Cognitive Load) */}
              <p className="text-xs text-[#9cb5a6] leading-relaxed line-clamp-2">
                {item.description}
              </p>

              {/* Primary Direct Order CTAs (Website) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="py-3 px-3 rounded-xl text-xs font-semibold bg-[#0b2416] hover:bg-[#123823] text-[#f4dc8a] border border-[#d4af37]/40 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
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
                  className="btn-3d-gold py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
                >
                  <Zap className="w-4 h-4 text-[#0f1811] fill-[#0f1811]" />
                  <span>এখনই কিনুন (Buy Now)</span>
                </button>
              </div>

              {/* SOCIAL / CHAT DIRECT ORDERING (WhatsApp, Messenger, Facebook) */}
              <div className="p-3.5 rounded-xl bg-[#040e08] border border-white/10 space-y-2.5">
                <p className="text-[11px] font-semibold text-[#c4d7cc] flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>বা সরাসরি সোশ্যাল মিডিয়ায় মেসেজ দিয়ে অর্ডার করুন:</span>
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp Order */}
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-xl text-[11px] font-bold text-white bg-[#128C7E] hover:bg-[#075E54] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                    title="Order via WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.18-.544-1.782-.738-2.923-2.548-3.011-2.668-.088-.119-.72-1.002-.72-1.913 0-.911.458-1.359.621-1.543.163-.184.356-.23.475-.23.119 0 .237.001.341.006.111.005.259-.042.404.308.148.356.505 1.233.548 1.323.044.09.073.195.015.311-.059.117-.089.19-.176.294-.088.104-.185.233-.264.313-.089.09-.181.188-.078.365.103.177.458.756.984 1.226.677.604 1.248.791 1.425.88.178.089.281.074.385-.045.104-.118.444-.518.563-.696.119-.177.237-.148.399-.089.163.059 1.037.489 1.215.578.178.089.296.133.34.208.045.074.045.43-.099.835z"/>
                    </svg>
                    <span className="truncate">WhatsApp</span>
                  </a>

                  {/* Messenger Order */}
                  <a
                    href={getMessengerLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-xl text-[11px] font-bold text-white bg-gradient-to-r from-[#0084FF] to-[#00C6FF] hover:opacity-95 flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
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
                    className="py-2.5 px-2 rounded-xl text-[11px] font-bold text-white bg-[#1877F2] hover:bg-[#166fe5] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                    title="Order via Facebook Page"
                  >
                    <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="truncate">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: PROGRESSIVE DISCLOSURE TABS (Description & Reviews) */}
          <div className="pt-2 border-t border-white/10 space-y-4">
            {/* Tab Buttons */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
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
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "reviews"
                    ? "bg-[#112d1e] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
                    : "text-[#8fa89a] hover:text-white hover:bg-white/5"
                }`}
              >
                <Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                <span>কাস্টমার রিভিউ ({initialReviews.length})</span>
              </button>
            </div>

            {/* TAB 1: DESCRIPTION & SPIRITUAL STORY */}
            {activeTab === "description" && (
              <div className="space-y-4 animate-fadeIn">
                {/* Spiritual Message Highlight */}
                {item.spiritualMessage && (
                  <div className="p-4 rounded-xl bg-[#0a2315] border border-[#d4af37]/30 text-xs text-[#fceb9e] leading-relaxed font-serif shadow-sm">
                    {item.spiritualMessage}
                  </div>
                )}

                {/* Full Description */}
                <div className="text-xs text-[#c4d7cc] leading-relaxed space-y-2">
                  <p>{item.description}</p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#07160f] border border-white/5 space-y-1">
                    <p className="text-[10px] uppercase font-mono text-[#8fa89a]">মিডিয়াম ও টেক্সচার (Medium)</p>
                    <p className="text-xs font-semibold text-white">{item.medium}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#07160f] border border-white/5 space-y-1">
                    <p className="text-[10px] uppercase font-mono text-[#8fa89a]">ফ্রেম ও ফিনিশিং (Finish)</p>
                    <p className="text-xs font-semibold text-white">
                      {item.finish || "Floating Gold Leaf Archival Frame"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#07160f] border border-white/5 space-y-1">
                    <p className="text-[10px] uppercase font-mono text-[#8fa89a]">ক্যানভাস সাইজ (Dimensions)</p>
                    <p className="text-xs font-semibold text-[#f4dc8a] font-mono">{item.dimensions}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#07160f] border border-white/5 space-y-1">
                    <p className="text-[10px] uppercase font-mono text-[#8fa89a]">প্যাকেজিং ও ডেলিভারি (Safety)</p>
                    <p className="text-xs font-semibold text-emerald-400">
                      ৩-লেয়ার বাবল ও উডেন ক্র্যাকিং প্রোটেকশন
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOMER REVIEWS & RATINGS */}
            {activeTab === "reviews" && (
              <div className="space-y-4 animate-fadeIn">
                {/* Rating Banner */}
                <div className="p-4 rounded-xl bg-[#07160f] border border-[#d4af37]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-extrabold text-[#fceb9e]">5.0</div>
                    <div>
                      <div className="flex items-center gap-1 text-[#d4af37]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#d4af37]" />
                        ))}
                      </div>
                      <p className="text-[11px] text-[#8fa89a] mt-0.5">
                        ১০০% ভেরিফায়েড ক্রেতাদের ইতিবাচক রিভিউ
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-emerald-400 bg-[#0d2a1b] px-3 py-1.5 rounded-full border border-emerald-500/30 self-start sm:self-auto">
                    ✓ Verified Sukoon Collectors
                  </span>
                </div>

                {/* Reviews List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {initialReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl bg-[#07160f] border border-white/5 hover:border-[#d4af37]/30 transition-all space-y-2"
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

                      <p className="text-[11px] text-[#c4d7cc] leading-relaxed italic">
                        &quot;{rev.comment}&quot;
                      </p>

                      <div className="text-[9px] text-[#6b8275] pt-1 border-t border-white/5 flex items-center justify-between">
                        <span>{rev.artworkTitle}</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
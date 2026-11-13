"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "../context/StoreContext";
import { Artwork, ArtworkCategory } from "../types";
import {
  ShoppingBag,
  Eye,
  Check,
  Search,
  Zap,
} from "lucide-react";

export const FeaturedCollection: React.FC = () => {
  const {
    artworks,
    addToCart,
    setSelectedArtworkForModal,
    language,
    t,
    settings,
    setIsCartOpen,
  } = useStore();
  const [activeCategory, setActiveCategory] = useState<ArtworkCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categories: { label: string; value: ArtworkCategory }[] = [
    { label: t("colCatAll"), value: "all" },
    { label: t("colCatCalligraphy"), value: "calligraphy" },
    { label: t("colCatCanvas"), value: "canvas" },
    { label: t("colCatMiniEasels"), value: "mini-easels" },
    { label: t("colCatCustom"), value: "custom-orders" },
  ];

  // Master map for guaranteed globally unique serial codes (#TS-01, #TS-02...)
  const artworkCodeMap = React.useMemo(() => {
    const map = new Map<string, string>();
    artworks.forEach((art, idx) => {
      map.set(art.id, `#TS-${String(idx + 1).padStart(2, "0")}`);
    });
    return map;
  }, [artworks]);

  const filteredArtworks = artworks.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.titleBangla &&
        item.titleBangla.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags &&
        item.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    return matchesCategory && matchesQuery;
  });

  const getItemCode = (artwork: Artwork, index: number) => {
    const match = artwork.id.match(/\d+/);
    if (match) {
      return `#TS-${match[0].padStart(2, "0")}`;
    }
    return `#TS-${String(index + 1).padStart(2, "0")}`;
  };

  const handleAddToCart = (artwork: Artwork, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    addToCart(artwork, 1, "Floating Gold Leaf Frame");
    setJustAddedId(artwork.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1500);
  };

  const handleBuyNow = (artwork: Artwork, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    addToCart(artwork, 1, "Floating Gold Leaf Frame");
    setIsCartOpen(true);
  };

  // Card visibility settings from admin controls
  const showItemCode = settings.cardShowItemCode !== false;
  const showDimensions = settings.cardShowDimensions !== false;
  const showTitle = settings.cardShowTitle !== false;
  const showBanglaTitle = settings.cardShowBanglaTitle !== false;
  const showPrice = settings.cardShowPrice !== false;
  const showOriginalPrice = settings.cardShowOriginalPrice !== false;
  const buttonMode = settings.cardButtonMode || "both";

  // Dynamic Collections CMS Settings from Store
  const colCMS = settings.collectionsCMS;
  const colHeading =
    language === "bn"
      ? (colCMS?.titleBangla || colCMS?.title || t("colHeading"))
      : (colCMS?.title || t("colHeading"));

  const colDesc =
    language === "bn"
      ? (colCMS?.subtitleBangla || colCMS?.subtitle || t("colDesc"))
      : (colCMS?.subtitle || t("colDesc"));

  return (
    <section id="collections" className="py-20 bg-[#06110a] relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section (Linear Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {colHeading}
            </h2>
            <p className="text-[#9cb5a6] text-sm max-w-xl">
              {colDesc}
            </p>
          </div>

          {/* Search Box */}
          {colCMS?.showSearchBar !== false && (
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#8fa89a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t("colSearchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#0b1f14] border border-white/10 text-white placeholder-[#6b8275] focus:outline-none focus:border-[#d4af37] transition-all"
              />
            </div>
          )}
        </div>

        {/* Category Filter Tabs (Linear Pill Switcher) */}
        {colCMS?.showCategoryFilters !== false && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.value
                    ? "bg-gradient-to-r from-[#d4af37] to-[#f4dc8a] text-[#0a150e] shadow-[0_4px_12px_rgba(212,175,55,0.25)] border border-[#ffd86b]"
                    : "bg-[#0b1f14]/80 text-[#9cb5a6] hover:text-white border border-white/5 hover:border-white/15"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Artwork Grid */}
        {filteredArtworks.length === 0 ? (
          <div className="text-center py-16 linear-card rounded-2xl p-8 border border-white/10">
            <p className="text-base text-[#c4d7cc] font-medium">
              No artworks found matching &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-[#8fa89a] mt-1">
              Try searching with another keyword or reset the category filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 btn-3d-gold px-4 py-2 text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredArtworks.map((item, index) => {
              const itemCode = artworkCodeMap.get(item.id) || `#TS-${String(index + 1).padStart(2, "0")}`;
              return (
                <Link
                  key={item.id}
                  href={`/artwork/${item.id}`}
                  className="group linear-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 border border-white/10 hover:border-[#d4af37]/40 cursor-pointer block"
                >
                  <div>
                    {/* Image container: 3:4 portrait ratio */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#07150d]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Gradient shadow for subtle aesthetic depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#06110a]/50 via-transparent to-transparent pointer-events-none" />

                      {/* Inspect Indicator on Image */}
                      <div
                        className="absolute bottom-2.5 right-2.5 z-10 p-1.5 sm:p-2 rounded-lg bg-[#06110a]/80 text-[#e5ede7] border border-white/10 opacity-90 group-hover:opacity-100 hover:text-[#f4dc8a] hover:border-[#d4af37] transition-all backdrop-blur-sm"
                        title="আর্টওয়ার্ক বিস্তারিত দেখুন"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>

                    {/* Minimalist Artwork Information */}
                    <div className="p-2.5 sm:p-4 space-y-1.5">
                      {/* Unique Code & Dimensions Row BELOW Image */}
                      {(showItemCode || showDimensions) && (
                        <div className="flex items-center justify-between gap-2 text-[9px] sm:text-[11px] pb-0.5">
                          {showItemCode && (
                            <span className="font-mono font-bold text-[#f4dc8a] bg-[#0c2417] border border-[#d4af37]/35 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] shadow-sm tracking-wider">
                              {itemCode}
                            </span>
                          )}
                          {showDimensions && (
                            <span className="font-mono text-[#8fa89a] uppercase tracking-wider ml-auto">
                              {item.dimensions}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Title */}
                      {showTitle && (
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#f4dc8a] transition-colors line-clamp-1">
                          {language === "bn" && item.titleBangla ? item.titleBangla : item.title}
                        </h3>
                      )}

                      {/* Subtitle */}
                      {showBanglaTitle && (
                        <>
                          {language === "en" && item.titleBangla && (
                            <p className="text-[10px] sm:text-xs text-[#8fa89a] line-clamp-1 font-serif">
                              {item.titleBangla}
                            </p>
                          )}
                          {language === "bn" && (
                            <p className="text-[10px] sm:text-xs text-[#8fa89a] line-clamp-1 font-mono">
                              {item.title}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Area: Price & Buttons */}
                  <div className="p-2.5 sm:p-4 pt-2 border-t border-white/5 space-y-2 sm:space-y-2.5">
                    {/* Price Row */}
                    {showPrice && (
                      <div className="flex items-baseline gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-lg font-extrabold text-[#fceb9e]">
                          ৳{item.price.toLocaleString()}
                        </span>
                        {showOriginalPrice && item.originalPrice && (
                          <span className="text-[10px] sm:text-xs text-[#8fa89a] line-through">
                            ৳{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons based on admin buttonMode */}
                    {buttonMode === "both" && (
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(item, e)}
                          className="py-2 sm:py-2.5 px-1.5 rounded-xl text-[10px] sm:text-xs font-semibold bg-[#0b2416] hover:bg-[#123823] text-[#f4dc8a] border border-[#d4af37]/40 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
                          title="Add to Cart"
                        >
                          {justAddedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300 font-bold">{t("colAdded")}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span className="truncate">{t("colAddToCart")}</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(item, e)}
                          className="btn-3d-gold py-2 sm:py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 shadow-md active:scale-95"
                          title="Buy Now - Instant Checkout"
                        >
                          <Zap className="w-3.5 h-3.5 text-[#0f1811] fill-[#0f1811]" />
                          <span className="truncate">{t("colBuyNow")}</span>
                        </button>
                      </div>
                    )}

                    {buttonMode === "cart_only" && (
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(item, e)}
                        className="w-full btn-3d-gold py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-md"
                      >
                        {justAddedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#0f1811]" />
                            <span>{t("colAdded")}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-[#0f1811]" />
                            <span>{t("colAddToCart")}</span>
                          </>
                        )}
                      </button>
                    )}

                    {buttonMode === "buynow_only" && (
                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(item, e)}
                        className="w-full btn-3d-gold py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-md"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#0f1811] fill-[#0f1811]" />
                        <span>{t("colBuyNow")}</span>
                      </button>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

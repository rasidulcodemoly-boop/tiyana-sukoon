"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "../context/StoreContext";
import { Artwork, ArtworkCategory } from "../types";
import {
  ShoppingBag,
  Eye,
  Check,
  Search,
  Sparkles,
} from "lucide-react";

export const FeaturedCollection: React.FC = () => {
  const { artworks, addToCart, setSelectedArtworkForModal } = useStore();
  const [activeCategory, setActiveCategory] = useState<ArtworkCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categories: { label: string; value: ArtworkCategory }[] = [
    { label: "All Artworks", value: "all" },
    { label: "Arabic Calligraphy", value: "calligraphy" },
    { label: "Canvas Paintings", value: "canvas" },
    { label: "Mini Easels", value: "mini-easels" },
    { label: "Artisan Bookmarks", value: "bookmarks" },
    { label: "Custom Gifts & Hampers", value: "custom-orders" },
  ];

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

  const handleAddToCart = (artwork: Artwork) => {
    addToCart(artwork, 1, "Floating Gold Leaf Frame");
    setJustAddedId(artwork.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1500);
  };

  return (
    <section id="collections" className="py-20 bg-[#06110a] relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section (Linear Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d2218] border border-[#d4af37]/30 text-xs font-medium text-[#f4dc8a]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Studio Collection • হস্তনির্মিত শিল্পকর্ম</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Artwork & Calligraphy
            </h2>
            <p className="text-[#9cb5a6] text-sm max-w-xl">
              Each piece is individually handcrafted in our Dhaka studio using 
              traditional Arabic calligraphy techniques, genuine gold foil, and archival grade canvas.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8fa89a] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search verses, sizes, gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#0b1f14] border border-white/10 text-white placeholder-[#6b8275] focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>
        </div>

        {/* Category Filter Tabs (Linear Pill Switcher) */}
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
            {filteredArtworks.map((item) => (
              <div
                key={item.id}
                className="group linear-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#07150d]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Gradient shadow for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06110a] via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex items-center gap-1.5 z-10">
                      {item.badge && (
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#0a1b12]/90 text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm backdrop-blur-md">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Quick View Button on Image */}
                    <button
                      onClick={() => setSelectedArtworkForModal(item)}
                      className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 z-10 p-1.5 sm:p-2 rounded-lg bg-[#06110a]/80 text-[#e5ede7] border border-white/10 opacity-90 group-hover:opacity-100 hover:text-[#f4dc8a] hover:border-[#d4af37] transition-all backdrop-blur-sm"
                      title="Inspect Artwork Details"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Artwork Information */}
                  <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-[#8fa89a]">
                      <span className="font-mono uppercase">{item.dimensions}</span>
                      <span className="text-emerald-400 font-medium">● In Studio</span>
                    </div>

                    <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#f4dc8a] transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    {item.titleBangla && (
                      <p className="text-[10px] sm:text-xs text-[#8fa89a] line-clamp-1 font-serif">
                        {item.titleBangla}
                      </p>
                    )}

                    <p className="hidden sm:block text-[12px] text-[#9cb5a6] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.finish && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-[#0a1f14] text-[#f4dc8a] border border-white/5">
                        {item.finish}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Area: Price & 3D Button */}
                <div className="p-2.5 sm:p-4 pt-1.5 sm:pt-2 border-t border-white/5 space-y-2 sm:space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-sm sm:text-lg font-extrabold text-[#fceb9e]">
                        ৳{item.price.toLocaleString()}
                      </span>
                      {item.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-[#8fa89a] line-through ml-1 sm:ml-2">
                          ৳{item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:inline text-[10px] text-[#8fa89a]">Framed & Ready</span>
                  </div>

                  {/* 3D Action Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full btn-3d-gold py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5"
                  >
                    {justAddedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#0f1811]" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-[#0f1811]" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

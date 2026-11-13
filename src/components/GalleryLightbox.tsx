"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "../context/StoreContext";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Eye,
  ShoppingBag,
} from "lucide-react";

export const GalleryLightbox: React.FC = () => {
  const router = useRouter();
  const { artworks, addToCart, setSelectedArtworkForModal, language, t } = useStore();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );

  const filteredArtworks =
    activeTab === "all"
      ? artworks
      : artworks.filter((a) => a.category === activeTab);

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const nextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev + 1) % filteredArtworks.length : 0
    );
  };

  const prevPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredArtworks.length) % filteredArtworks.length
        : 0
    );
  };

  const currentArt =
    selectedPhotoIndex !== null ? filteredArtworks[selectedPhotoIndex] : null;

  return (
    <section id="gallery" className="py-20 bg-[#06110a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t("galHeading")}
            </h2>
            <p className="text-[#9cb5a6] text-sm max-w-xl">
              {t("galDesc")}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: `${t("galTabAll")} (${artworks.length})` },
              { id: "calligraphy", label: t("galTabCalligraphy") },
              { id: "canvas", label: t("galTabCanvas") },
              { id: "mini-easels", label: t("colCatMiniEasels") || "Mini Easels" },
              { id: "custom-orders", label: t("galTabCustom") },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#d4af37] text-[#06110a] font-bold shadow-md"
                    : "bg-[#0b1f14] text-[#8fa89a] hover:text-white border border-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredArtworks.map((art, idx) => (
            <div
              key={art.id}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#08170f] border border-white/5 hover:border-[#d4af37]/40 cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src={art.image}
                alt={art.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover Overlay with Real Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06110a]/95 via-[#06110a]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#d4af37] uppercase tracking-wider">
                    {art.category}
                  </span>
                  <span className="text-[10px] font-bold text-[#fceb9e]">
                    ৳{art.price}
                  </span>
                </div>
                <p className="text-xs font-bold text-white line-clamp-1">
                  {language === "bn" && art.titleBangla ? art.titleBangla : art.title}
                </p>
                {art.titleBangla && (
                  <p className="text-[11px] text-[#8fa89a] line-clamp-1 font-serif">
                    {art.titleBangla}
                  </p>
                )}
                <div className="pt-1 flex items-center justify-between text-[10px] text-[#9cb5a6]">
                  <span>{art.dimensions}</span>
                  <div className="flex items-center gap-1 text-[#f4dc8a]">
                    <ZoomIn className="w-3 h-3" />
                    <span>Zoom</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentArt && selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-[#050d07]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-[#0a1e13] border border-white/10 text-white hover:text-[#d4af37] transition-all"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          <button
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#0a1e13]/80 border border-white/10 text-white hover:bg-[#d4af37] hover:text-[#06110a] transition-all"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#0a1e13]/80 border border-white/10 text-white hover:bg-[#d4af37] hover:text-[#06110a] transition-all"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Modal Content */}
          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center overflow-y-auto">
            <div className="relative w-full max-w-2xl aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl bg-[#08170f]">
              <Image
                src={currentArt.image}
                alt={currentArt.title}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Lightbox Detailed Information from Facebook */}
            <div className="mt-4 text-center space-y-2 max-w-2xl px-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-mono text-[#d4af37] uppercase tracking-wider">
                  Photo {selectedPhotoIndex + 1} of {filteredArtworks.length} &bull; {currentArt.dimensions}
                </span>
                {currentArt.badge && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {currentArt.badge}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white">
                {currentArt.title}
              </h3>

              {currentArt.titleBangla && (
                <p className="text-sm text-[#f4dc8a] font-serif">
                  {currentArt.titleBangla}
                </p>
              )}

              <p className="text-xs text-[#9cb5a6] leading-relaxed max-w-xl mx-auto">
                {currentArt.description}
              </p>

              {currentArt.spiritualMessage && (
                <div className="p-2.5 rounded-xl bg-[#0a1e13] border border-[#d4af37]/20 text-xs text-[#fceb9e] max-w-lg mx-auto">
                  {currentArt.spiritualMessage}
                </div>
              )}

              <div className="pt-2 flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    addToCart(currentArt, 1, "Floating Gold Leaf Frame");
                    closeLightbox();
                  }}
                  className="btn-3d-gold px-5 py-2.5 text-xs font-bold"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order This Piece • ৳{currentArt.price.toLocaleString()}</span>
                </button>

                <button
                  onClick={() => {
                    closeLightbox();
                    router.push(`/artwork/${currentArt.id}`);
                  }}
                  className="btn-3d-dark px-4 py-2.5 text-xs text-[#c4d7cc]"
                >
                  Full Specifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

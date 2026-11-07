"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "../context/StoreContext";
import {
  X,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Check,
  Layers,
  MessageCircle,
} from "lucide-react";

const FRAME_OPTIONS = [
  "Floating Gold Leaf Frame",
  "Sleek Obsidian Black Frame",
  "Natural Teak Wood Frame",
  "Frameless Stretched Canvas",
];

export const QuickViewModal: React.FC = () => {
  const {
    selectedArtworkForModal,
    setSelectedArtworkForModal,
    addToCart,
    settings,
    language,
    t,
  } = useStore();

  const [selectedFrame, setSelectedFrame] = useState(FRAME_OPTIONS[0]);
  const [customInscription, setCustomInscription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!selectedArtworkForModal) return null;

  const item = selectedArtworkForModal;

  const handleAdd = () => {
    addToCart(item, quantity, selectedFrame, customInscription || undefined);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelectedArtworkForModal(null);
    }, 1200);
  };

  const getWhatsAppQuickLink = () => {
    const text = `Assalamu Alaikum! I would like to inquire about "${item.title}" (৳${item.price.toLocaleString()} BDT).
Frame preference: ${selectedFrame}
Dimensions: ${item.dimensions}`;
    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setSelectedArtworkForModal(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog (Linear Glass Card) */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#07160f] border border-[#d4af37]/30 shadow-2xl overflow-hidden z-10 animate-fadeIn my-auto">
        {/* Close Button */}
        <button
          onClick={() => setSelectedArtworkForModal(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#0a1e13] text-[#8fa89a] hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Showcase */}
          <div className="relative aspect-square md:aspect-auto md:h-full min-h-[320px] bg-[#091b11] overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06110a] via-transparent to-transparent opacity-60 pointer-events-none" />
            {item.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#0a1b12]/90 text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm backdrop-blur-md">
                {item.badge}
              </span>
            )}
          </div>

          {/* Details & Actions */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider">
                  Arabic Fine Art &bull; {item.dimensions}
                </span>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {language === "bn" && item.titleBangla ? item.titleBangla : item.title}
                </h3>
                {language === "en" && item.titleBangla && (
                  <p className="text-xs text-[#8fa89a] font-serif mt-0.5">
                    {item.titleBangla}
                  </p>
                )}
                {language === "bn" && (
                  <p className="text-xs text-[#8fa89a] font-mono mt-0.5">
                    {item.title}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-[#fceb9e]">
                  ৳{item.price.toLocaleString()} BDT
                </span>
                {item.originalPrice && (
                  <span className="text-xs text-[#8fa89a] line-through">
                    ৳{item.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-[10px] text-emerald-400 font-medium">
                  ● Ready in Dhaka Studio
                </span>
              </div>

              {/* Description & Medium */}
              <div className="space-y-2">
                <p className="text-xs text-[#9cb5a6] leading-relaxed">
                  {item.description}
                </p>

                {item.spiritualMessage && (
                  <div className="p-2.5 rounded-lg bg-[#0a1e13] border border-[#d4af37]/20 text-[11px] text-[#fceb9e] leading-relaxed">
                    {item.spiritualMessage}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#091d12] border border-white/5 text-[11px] space-y-1 text-[#8fa89a]">
                <p>
                  <strong className="text-white">Medium:</strong> {item.medium}
                </p>
                <p>
                  <strong className="text-white">Dimensions:</strong> {item.dimensions}
                </p>
                {item.finish && (
                  <p>
                    <strong className="text-white">Finish:</strong> {item.finish}
                  </p>
                )}
              </div>

              {/* Frame selection */}
              <div>
                <label className="block text-xs font-medium text-[#c4d7cc] mb-1.5">
                  Select Frame Finish:
                </label>
                <select
                  value={selectedFrame}
                  onChange={(e) => setSelectedFrame(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#091d12] border border-white/10 text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {FRAME_OPTIONS.map((f) => (
                    <option key={f} value={f} className="bg-[#07160f] text-white">
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Inscription */}
              <div>
                <label className="block text-xs font-medium text-[#c4d7cc] mb-1.5">
                  Gift Dedication or Inscription on Back (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g., Happy Wedding Anniversary Farhan & Sadia"
                  value={customInscription}
                  onChange={(e) => setCustomInscription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#091d12] border border-white/10 text-white placeholder-[#687f71] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* 3D Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleAdd}
                className="w-full btn-3d-gold py-3 text-xs tracking-wider uppercase font-bold"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-[#0f1811]" />
                    <span>{t("colAdded")}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#0f1811]" />
                    <span>{t("modalAddToCart")}</span>
                  </>
                )}
              </button>

              <a
                href={getWhatsAppQuickLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-3d-emerald py-2.5 text-xs text-center justify-center flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "../context/StoreContext";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  MessageCircle,
  Eye,
} from "lucide-react";

export const HeroSection: React.FC = () => {
  const { setSelectedArtworkForModal, artworks, settings } = useStore();
  // Find hero artwork matching settings.heroImage or default to the Surah Al-Falaq / Ayat al-Kursi
  const heroArtwork =
    artworks.find((a) => a.image === settings.heroImage) || artworks[3] || artworks[0];
  const [isLiked, setIsLiked] = useState(false);

  return (
    <section className="relative pt-6 pb-20 md:pt-14 md:pb-28 overflow-hidden linear-grid">
      {/* Ambient background glow orbs (Linear style) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#d4af37]/15 via-[#10b981]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & 3D CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Linear Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0e271a] border border-[#d4af37]/30 text-xs font-medium text-[#f4dc8a] shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide">Handmade in Dhaka, Bangladesh</span>
              <span className="text-white/30">•</span>
              <span className="text-[#8fa89a]">Bespoke Islamic Art</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Art for your peace. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fceb9e] via-[#d4af37] to-[#e6bc42] drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]">
                Peace for your soul.
              </span>
            </h1>

            {/* Bangla Tagline & Description */}
            <p className="text-base sm:text-lg text-[#9cb5a6] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              যেখানে রং মিশে অনুভবে, আর প্রতিটি সোনালী আঁচড়ে জেগে ওঠে প্রশান্তি।{" "}
              <span className="text-white/90 font-medium">Tiyana&apos;s Sukoon</span>{" "}
              specializes in hand-painted Arabic calligraphy, textured canvas artwork,
              and customized Islamic keepsakes made with genuine 24K imitation gold leaf.
            </p>

            {/* Core Value Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-1 text-xs text-[#c4d7cc]">
              <div className="flex items-center gap-1.5 bg-[#0b1f14] px-3 py-1.5 rounded-lg border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>100% Hand-Painted (No Prints)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0b1f14] px-3 py-1.5 rounded-lg border border-white/5">
                <Sparkles className="w-4 h-4 text-[#34d399]" />
                <span>Genuine 24K Gold Leafing</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0b1f14] px-3 py-1.5 rounded-lg border border-white/5">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Breakage-Safe Wooden Packaging</span>
              </div>
            </div>

            {/* 3D Action Buttons (Primary Gold, Emerald, WhatsApp) */}
            <div className="pt-3 flex flex-wrap justify-center lg:justify-start items-center gap-4">
              <a
                href="#collections"
                className="btn-3d-gold px-6 py-3.5 text-sm tracking-wide"
              >
                <span>Explore Featured Pieces</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#custom-commission"
                className="btn-3d-emerald px-6 py-3.5 text-sm tracking-wide"
              >
                <Sparkles className="w-4 h-4" />
                <span>Custom Order Estimator</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                  "Assalamu Alaikum! I would like to order a custom calligraphy piece from Tiyana's Sukoon."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-dark px-4 py-3 text-xs tracking-wide flex items-center gap-2"
                title="Direct WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {settings.phone1}</span>
              </a>
            </div>

            {/* Social Proof Counter */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">500+</p>
                <p className="text-xs text-[#8fa89a]">Pieces Delivered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#f4dc8a] tracking-tight">4.9 / 5.0</p>
                <p className="text-xs text-[#8fa89a]">Customer Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">64 Districts</p>
                <p className="text-xs text-[#8fa89a]">Nationwide Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Canvas Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              {/* Decorative Linear Corner Elements */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-[#d4af37]/60 rounded-tl-lg pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-[#d4af37]/60 rounded-br-lg pointer-events-none" />

              {/* Glowing Aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/20 via-[#10b981]/15 to-transparent blur-2xl rounded-3xl -z-10 group-hover:scale-105 transition-transform duration-500" />

              {/* 3D Elevated Frame Container */}
              <div className="linear-card p-3 rounded-2xl relative overflow-hidden transition-all duration-500 group-hover:translate-y-[-4px]">
                {/* Visual Glass Sheen Overlay */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10 rounded-t-xl" />

                {/* Artwork Image Container */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#09180f] shadow-2xl border border-[#d4af37]/25">
                  <Image
                    src={heroArtwork.image}
                    alt={heroArtwork.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-[#0a1b12]/90 text-[#f4dc8a] border border-[#d4af37]/40 backdrop-blur-md shadow-md">
                      Signature Piece
                    </span>
                    <span className="px-2 py-0.5 text-[10px] rounded-md bg-emerald-500/80 text-white font-medium">
                      In Studio
                    </span>
                  </div>

                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-[#06110a]/80 backdrop-blur-md text-white border border-white/10 hover:border-[#d4af37] transition-all"
                    aria-label="Add to favorites"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isLiked ? "fill-rose-500 text-rose-500" : "text-white"
                      }`}
                    />
                  </button>

                  {/* Bottom Information Card Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#06110a] via-[#06110a]/90 to-transparent z-20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono text-[#f4dc8a] uppercase tracking-wider">
                          Arabic Thuluth Script
                        </p>
                        <h3 className="text-sm font-bold text-white line-clamp-1">
                          {heroArtwork.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-[#fceb9e]">
                          ৳{heroArtwork.price.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-[#8fa89a] line-through">
                          ৳{heroArtwork.originalPrice?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedArtworkForModal(heroArtwork)}
                        className="flex-1 btn-3d-gold py-2 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Details</span>
                      </button>
                      <a
                        href="#custom-commission"
                        className="btn-3d-dark px-3 py-2 text-xs text-[#c4d7cc]"
                        title="Customize size or frame"
                      >
                        Customize
                      </a>
                    </div>
                  </div>
                </div>

                {/* Sub-label under frame */}
                <div className="pt-3 px-2 flex items-center justify-between text-[11px] text-[#8fa89a]">
                  <span>Dimensions: 24&quot; x 36&quot;</span>
                  <span>100% Hand-Gilded 24K Leaf</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

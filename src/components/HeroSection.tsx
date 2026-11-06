"use client";

import React from "react";
import Image from "next/image";
import { useStore } from "../context/StoreContext";
import { ArrowRight, Sparkles } from "lucide-react";

export const HeroSection: React.FC = () => {
  const { setSelectedArtworkForModal, artworks, settings } = useStore();
  // Find hero artwork matching settings.heroImage or default to the Surah Al-Falaq / Ayat al-Kursi
  const heroArtwork =
    artworks.find((a) => a.image === settings.heroImage) || artworks[3] || artworks[0];

  return (
    <section className="relative pt-8 pb-14 md:pt-16 md:pb-24 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-b from-[#d4af37]/10 via-[#10b981]/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Minimalist Typography & Exactly 2 Action Buttons */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Minimalist Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b1f14] border border-[#d4af37]/25 text-xs text-[#f4dc8a]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="tracking-wide">হস্তনির্মিত ইসলামিক ক্যালিগ্রাফি স্টুডিও</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Art for your peace. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fceb9e] via-[#d4af37] to-[#e6bc42]">
                Peace for your soul.
              </span>
            </h1>

            {/* Short Minimalist Description */}
            <p className="text-base sm:text-lg text-[#9cb5a6] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              যেখানে ক্যালিগ্রাফির প্রতিটি সোনালী আঁচড়ে জেগে ওঠে প্রশান্তি।
            </p>

            {/* Exactly 2 Buttons */}
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start items-center gap-3.5">
              <a
                href="#collections"
                className="btn-3d-gold px-6 py-3 text-xs sm:text-sm tracking-wide font-bold flex items-center gap-2"
              >
                <span>কালেকশন দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#custom-commission"
                className="btn-3d-dark px-6 py-3 text-xs sm:text-sm tracking-wide text-[#e5ede7] border border-white/10 hover:border-[#d4af37]/40 flex items-center gap-2"
              >
                <span>কাস্টম আর্ট অর্ডার</span>
              </a>
            </div>
          </div>

          {/* Right Column: Clean, Minimal Framed Artwork Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              onClick={() => setSelectedArtworkForModal(heroArtwork)}
              className="relative w-full max-w-sm sm:max-w-md cursor-pointer group"
              title="Click to view details"
            >
              {/* Subtle ambient aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/15 to-transparent blur-xl rounded-2xl -z-10 group-hover:scale-105 transition-transform duration-500" />

              {/* Minimal Canvas Frame */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#07170f] border border-[#d4af37]/30 shadow-2xl transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#d4af37]/60">
                <Image
                  src={heroArtwork.image}
                  alt={heroArtwork.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Clean Bottom Caption */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#06110a]/95 via-[#06110a]/60 to-transparent flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-mono text-[#d4af37] tracking-wider">
                      Signature Artwork
                    </p>
                    <h3 className="text-sm font-bold text-white truncate">
                      {heroArtwork.title}
                    </h3>
                  </div>
                  <span className="text-sm font-extrabold text-[#fceb9e] shrink-0 font-mono">
                    ৳{heroArtwork.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

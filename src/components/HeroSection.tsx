"use client";

import React from "react";
import Image from "next/image";
import { useStore } from "../context/StoreContext";
import { ArrowRight, ZoomIn } from "lucide-react";

export const HeroSection: React.FC = () => {
  const { setSelectedArtworkForModal, artworks } = useStore();

  // Pick top 10 signature artworks and duplicate for infinite continuous horizontal marquee loop
  const carouselArtworks = artworks.slice(0, 10);
  const displayArtworks = [...carouselArtworks, ...carouselArtworks];

  return (
    <section className="relative pt-8 pb-14 md:pt-16 md:pb-24 overflow-hidden">
      {/* Subtle ambient lighting orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-b from-[#d4af37]/10 via-[#10b981]/5 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[450px] h-[250px] bg-gradient-to-b from-[#10b981]/10 via-[#d4af37]/5 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Top Container: Left (Eyebrow + Headline) and Right (Sub-headline + 2 Buttons) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          {/* Left Side: Eyebrow + Headline */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            {/* Eyebrow Text (Clean - No Icon, No Outline) */}
            <p className="text-xs sm:text-sm font-semibold text-[#d4af37] tracking-wider uppercase">
              হস্তনির্মিত ইসলামিক ক্যালিগ্রাফি স্টুডিও
            </p>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Art for your peace. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fceb9e] via-[#d4af37] to-[#e6bc42] drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]">
                Peace for your soul.
              </span>
            </h1>
          </div>

          {/* Right Side: Sub-headline + 2 Buttons */}
          <div className="lg:col-span-5 space-y-5 text-center lg:text-left lg:pb-1">
            {/* Sub-headline Text */}
            <p className="text-base sm:text-lg text-[#9cb5a6] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              যেখানে ক্যালিগ্রাফির প্রতিটি সোনালী আঁচড়ে জেগে ওঠে প্রশান্তি। খাঁটি ইসলামিক ক্যালিগ্রাফি ও প্রিমিয়াম টেক্সচার্ড ক্যানভাস আর্ট।
            </p>

            {/* Exactly 2 Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3.5 pt-1">
              <a
                href="#collections"
                className="btn-3d-gold px-6 py-3.5 text-xs sm:text-sm tracking-wide font-bold flex items-center gap-2"
              >
                <span>কালেকশন দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#custom-commission"
                className="btn-3d-dark px-6 py-3.5 text-xs sm:text-sm tracking-wide text-[#e5ede7] border border-white/10 hover:border-[#d4af37]/40 flex items-center gap-2"
              >
                <span>কাস্টম আর্ট অর্ডার</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Animated Horizontal Infinite Carousel Slide Animation */}
      <div className="mt-12 sm:mt-16 pt-2 relative w-full overflow-hidden">
        {/* Left & Right Smooth Edge Fade Masks */}
        <div className="absolute left-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-r from-[#06110a] via-[#06110a]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-l from-[#06110a] via-[#06110a]/80 to-transparent z-10 pointer-events-none" />

        {/* Continuous Horizontal Marquee Carousel */}
        <div className="animate-marquee gap-4 sm:gap-6 py-2">
          {displayArtworks.map((art, idx) => (
            <div
              key={`${art.id}-${idx}`}
              onClick={() => setSelectedArtworkForModal(art)}
              className="group relative w-[220px] sm:w-[270px] md:w-[310px] aspect-[4/5] shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-[#08180f] shadow-xl hover:border-[#d4af37]/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(212,175,55,0.2)]"
              title="Click to view full piece"
            >
              {/* Artwork Image */}
              <Image
                src={art.image}
                alt={art.title}
                fill
                sizes="(max-width: 640px) 220px, 310px"
                className="object-cover transition-transform duration-700 group-hover:scale-108"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06110a]/95 via-[#06110a]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Category Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2 py-0.5 rounded-md text-[9px] uppercase font-mono font-bold tracking-wider bg-[#06110a]/80 text-[#f4dc8a] border border-[#d4af37]/30 backdrop-blur-md">
                  {art.category}
                </span>
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-[#06110a]/70 text-[#f4dc8a] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <ZoomIn className="w-3.5 h-3.5" />
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 z-10 space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-[#f4dc8a] transition-colors">
                  {art.title}
                </h3>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8fa89a] font-mono">{art.dimensions}</span>
                  <span className="font-extrabold text-[#fceb9e] font-mono">
                    ৳{art.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

"use client";

import React from "react";
import Image from "next/image";
import {
  Sparkles,
  Heart,
  Feather,
  Shield,
  Layers,
  PhoneCall,
  CheckCircle,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

export const BrandStory: React.FC = () => {
  const { settings } = useStore();

  const PILLARS = [
    {
      icon: Feather,
      title: "Sacred Hand Lettering",
      desc: "Every curve of Thuluth, Diwani, and Naskh script is crafted by hand using traditional calligraphy pens, not printed or automated.",
    },
    {
      icon: Sparkles,
      title: "24K Gold Leaf Gilding",
      desc: "Genuine imitation 24K gold foil meticulously laid with gilding size, sealed with UV protection so the gold never tarnishes.",
    },
    {
      icon: Layers,
      title: "Archival Linen Canvases",
      desc: "Heavyweight 380gsm primed linen canvases wrapped tightly around kiln-dried pine wood stretcher bars for lifetime longevity.",
    },
    {
      icon: Shield,
      title: "Reinforced Safe Shipping",
      desc: "Each framed canvas is packed in triple-wall corrugated carton, foam edge bumpers, and wooden corner guards for damage-free transit.",
    },
  ];

  return (
    <section id="philosophy" className="py-20 bg-[#07150e] relative linear-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Brand Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Main Artwork Highlight */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl bg-[#091a11]">
                <Image
                  src={settings.storyImage || "/artwork/artwork_1.jpg"}
                  alt="Tiyana's Sukoon Emblem & Artwork"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06110a] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-[#0a1e13]/85 backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      Crafted with Love &amp; Devotion
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9cb5a6]">
                    &quot;Where colors meet emotions, and every stroke tells a story of peace.&quot;
                  </p>
                </div>
              </div>

              {/* Floating Mini Overlay Card */}
              <div className="absolute -bottom-6 -right-6 hidden sm:block p-4 rounded-xl linear-card border border-[#d4af37]/40 shadow-2xl max-w-[210px] bg-[#0b2115]/90 backdrop-blur-md">
                <span className="text-[10px] font-mono text-[#d4af37] uppercase">
                  Studio Location
                </span>
                <p className="text-xs font-bold text-white mt-0.5">Dhaka, Bangladesh</p>
                <p className="text-[10px] text-[#8fa89a] mt-1">
                  Private commissions available nationwide via courier.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Story Copy & Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d2218] border border-[#d4af37]/30 text-xs font-semibold text-[#f4dc8a]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>The Sukoon Philosophy • সুকূনের কথা</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Art Designed to Bring Serenity to Modern Homes
            </h2>

            <div className="space-y-4 text-sm text-[#9cb5a6] leading-relaxed">
              <p>
                In an increasingly noisy and chaotic world,{" "}
                <span className="text-white font-semibold">Tiyana&apos;s Sukoon</span> was
                founded with a simple yet profound vision: to bring{" "}
                <span className="text-[#f4dc8a] italic">Sukoon</span> (tranquility,
                spiritual calm, peace of soul) into your daily living spaces.
              </p>
              <p>
                We believe sacred Islamic verses and Arabic calligraphy shouldn&apos;t just
                be words on a wall; they should be an intimate reminder of divine grace,
                warmth, and stillness. By pairing deep obsidian emerald greens with
                luminous gold leaf, each painting reacts dynamically to morning sunlight
                and warm evening lamps.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {PILLARS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[#0b1f14] border border-white/5 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#d4af37]/15 text-[#f4dc8a] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-white">{p.title}</h4>
                    </div>
                    <p className="text-[11px] text-[#8fa89a] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#custom-commission"
                className="btn-3d-gold px-5 py-3 text-xs font-bold"
              >
                <span>Commission Your Bespoke Piece</span>
              </a>
              <a
                href={`tel:${settings.phone1}`}
                className="btn-3d-dark px-4 py-2.5 text-xs flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Artist: {settings.phone1}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

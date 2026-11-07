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
  const { settings, language, t } = useStore();

  const PILLARS = [
    {
      icon: Feather,
      title: t("pillar1Title"),
      desc: t("pillar1Desc"),
    },
    {
      icon: Sparkles,
      title: t("pillar2Title"),
      desc: t("pillar2Desc"),
    },
    {
      icon: Layers,
      title: t("pillar3Title"),
      desc: t("pillar3Desc"),
    },
    {
      icon: Shield,
      title: t("pillar4Title"),
      desc: t("pillar4Desc"),
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
                  {t("storyLocationTitle")}
                </span>
                <p className="text-xs font-bold text-white mt-0.5">{t("storyLocationCity")}</p>
                <p className="text-[10px] text-[#8fa89a] mt-1">
                  {t("storyLocationDesc")}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Story Copy & Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t("storyHeading")}
            </h2>

            <div className="space-y-4 text-sm text-[#9cb5a6] leading-relaxed">
              <p>
                {t("storyP1")}
              </p>
              <p>
                {t("storyP2")}
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

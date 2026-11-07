"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { initialReviews } from "../data/initialData";
import { useStore } from "../context/StoreContext";

export const Testimonials: React.FC = () => {
  const { t } = useStore();

  return (
    <section id="reviews" className="py-20 bg-[#06110a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t("revHeading")}
          </h2>
          <p className="text-[#9cb5a6] text-sm">
            {t("revDesc")}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialReviews.map((rev) => (
            <div
              key={rev.id}
              className="linear-card p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-white/5 hover:border-[#d4af37]/40 transition-all duration-300"
            >
              <div className="space-y-3">
                {/* 5 Stars Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#d4af37] text-[#d4af37]"
                    />
                  ))}
                </div>

                <p className="text-xs text-[#d1e0d7] leading-relaxed italic">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              {/* Author & Verification */}
              <div className="pt-3 border-t border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white">{rev.author}</h4>
                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{t("revVerified")}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8fa89a]">
                  <span>{rev.location}</span>
                  <span className="font-mono">{rev.date}</span>
                </div>
                {rev.artworkTitle && (
                  <p className="text-[10px] text-[#f4dc8a] truncate pt-0.5">
                    Art: {rev.artworkTitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Banner Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-[#091e13] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">
              Want custom size or color matching for your interior?
            </h4>
            <p className="text-xs text-[#8fa89a]">
              Send us a photo of your living room wall on WhatsApp for free frame size recommendations.
            </p>
          </div>
          <a
            href="https://www.facebook.com/profile.php?id=61594949745258"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-gold px-4 py-2.5 text-xs whitespace-nowrap"
          >
            Visit Our Facebook Page
          </a>
        </div>
      </div>
    </section>
  );
};

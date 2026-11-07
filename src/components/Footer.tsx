"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "../context/StoreContext";
import {
  PhoneCall,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Heart,
  Palette,
  MapPin,
  Clock,
} from "lucide-react";

export const Footer: React.FC = () => {
  const { settings, language, t } = useStore();

  return (
    <footer className="bg-[#050e08] border-t border-white/10 pt-16 pb-12 relative text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] to-[#10b981]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#06110a]">
                  <Image
                    src="/brand/logo.jpg"
                    alt="Tiyana's Sukoon Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="font-bold text-base text-white tracking-tight">
                  {language === "bn" ? "তিয়ানা'স সুকূন" : "Tiyana's Sukoon"}
                </span>
                <p className="text-[11px] text-[#8fa89a]">
                  {t("brandTagline")}
                </p>
              </div>
            </Link>

            <p className="text-[#9cb5a6] leading-relaxed max-w-sm">
              {t("footDesc")}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-dark px-3 py-1.5 text-xs text-[#f4dc8a] flex items-center gap-1.5"
              >
                <span>Facebook Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                  "Assalamu Alaikum! Inquiring from Tiyana's Sukoon website."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-emerald px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-mono">
              {t("footExplore")}
            </h4>
            <ul className="space-y-2 text-[#9cb5a6]">
              <li>
                <a href="#collections" className="hover:text-[#f4dc8a] transition-colors">
                  {t("navCollections")}
                </a>
              </li>
              <li>
                <a href="#custom-commission" className="hover:text-[#f4dc8a] transition-colors">
                  {t("navCustomArt")}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#f4dc8a] transition-colors">
                  {t("navGallery")}
                </a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-[#f4dc8a] transition-colors">
                  {t("navPhilosophy")}
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#f4dc8a] transition-colors">
                  {t("navReviews")}
                </a>
              </li>
            </ul>
          </div>

          {/* Islamic Art Types */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-mono">
              {t("footCategories")}
            </h4>
            <ul className="space-y-2 text-[#9cb5a6]">
              <li>Ayat al-Kursi Gilded Canvas</li>
              <li>4 Qul Sacred Protection Set</li>
              <li>Surah Ar-Rahman Masterpieces</li>
              <li>Custom Couple Names with Dua</li>
              <li>Mini Wooden Easel Keepsakes</li>
              <li>Artisan Bookmarks &amp; Hampers</li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-mono">
              {t("footStudio")}
            </h4>
            <div className="space-y-2.5 text-[#9cb5a6]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{settings.studioAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phone1}`} className="hover:text-white">
                  {settings.phone1} / {settings.phone2}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{t("footHours")}</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e271a] border border-[#d4af37]/30 text-[#f4dc8a] hover:bg-[#d4af37]/20 transition-all font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t("footAdmin")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#758a7e]">
          <p>
            &copy; {new Date().getFullYear()} {t("footCopyright")}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{t("footBadge1")}</span>
            <span>&bull;</span>
            <span>{t("footBadge2")}</span>
            <span>&bull;</span>
            <span>{t("footBadge3")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

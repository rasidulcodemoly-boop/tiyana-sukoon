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
  const { settings } = useStore();

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
                  Tiyana&apos;s Sukoon
                </span>
                <p className="text-[11px] text-[#8fa89a]">
                  Art for your peace &bull; Dhaka
                </p>
              </div>
            </Link>

            <p className="text-[#9cb5a6] leading-relaxed max-w-sm">
              &quot;Where colors meet emotions, and every stroke tells a story.&quot;{" "}
              Bespoke Arabic calligraphy, textured modern canvases, and Islamic keepsakes
              handcrafted with devotion in Dhaka, Bangladesh.
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
              Explore
            </h4>
            <ul className="space-y-2 text-[#9cb5a6]">
              <li>
                <a href="#collections" className="hover:text-[#f4dc8a] transition-colors">
                  Featured Artworks
                </a>
              </li>
              <li>
                <a href="#custom-commission" className="hover:text-[#f4dc8a] transition-colors">
                  Custom Commission Builder
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#f4dc8a] transition-colors">
                  Studio Photo Archives
                </a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-[#f4dc8a] transition-colors">
                  The Sukoon Philosophy
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#f4dc8a] transition-colors">
                  Customer Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Islamic Art Types */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-mono">
              Art Categories
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
              Studio &amp; Inquiries
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
                <span>Sat - Thu: 10:00 AM - 10:00 PM</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e271a] border border-[#d4af37]/30 text-[#f4dc8a] hover:bg-[#d4af37]/20 transition-all font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Management Panel</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#758a7e]">
          <p>
            &copy; {new Date().getFullYear()} Tiyana&apos;s Sukoon. All Rights Reserved.
            Handcrafted with devotion in Dhaka.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Authentic Hand-Lettering</span>
            <span>&bull;</span>
            <span>Secure Cash on Delivery</span>
            <span>&bull;</span>
            <span>Breakage-Safe Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

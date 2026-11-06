"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "../context/StoreContext";
import {
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  Palette,
  PhoneCall,
  ExternalLink,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen, settings } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      {settings.isAnnouncementActive && (
        <div className="bg-gradient-to-r from-[#08180f] via-[#102d1d] to-[#08180f] border-b border-[#d4af37]/20 py-2 px-4 text-xs font-medium text-center text-[#e5ede7] flex items-center justify-center gap-2 relative z-50">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="tracking-wide">{settings.announcementText}</p>
          <a
            href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
              "Assalamu Alaikum! I would like to inquire about Tiyana's Sukoon artwork."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[#f3db83] hover:underline font-semibold ml-2"
          >
            <span>Direct WhatsApp</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#06110a]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#f5d77f] to-[#0e2a1b] shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#06110a]">
                <Image
                  src={settings.siteLogo || "/brand/logo.jpg"}
                  alt="Tiyana's Sukoon Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-[#f4dc8a] transition-colors">
                  Tiyana&apos;s Sukoon
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#d4af37]/15 text-[#f4dc8a] border border-[#d4af37]/30">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-[#8fa89a] font-normal tracking-wide">
                Art for your peace • Dhaka
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Linear Pill Style) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0b1f14]/80 p-1.5 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
            <a
              href="#collections"
              className="px-4 py-1.5 text-xs font-medium text-[#c4d7cc] hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              Collections
            </a>
            <a
              href="#custom-commission"
              className="px-4 py-1.5 text-xs font-medium text-[#c4d7cc] hover:text-white hover:bg-white/5 rounded-full transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f4dc8a]" />
              <span>Custom Art</span>
            </a>
            <a
              href="#gallery"
              className="px-4 py-1.5 text-xs font-medium text-[#c4d7cc] hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              Gallery
            </a>
            <a
              href="#philosophy"
              className="px-4 py-1.5 text-xs font-medium text-[#c4d7cc] hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              Philosophy
            </a>
            <a
              href="#reviews"
              className="px-4 py-1.5 text-xs font-medium text-[#c4d7cc] hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              Reviews
            </a>
            <Link
              href="/admin"
              className="px-3.5 py-1.5 text-xs font-medium text-[#f4dc8a] hover:bg-[#d4af37]/20 rounded-full transition-all flex items-center gap-1"
              title="Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#f4dc8a]" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Action Area: 3D Buttons & Cart */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger Button (3D Dark Bevel) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl btn-3d-dark text-[#e5ede7]"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#f4dc8a]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#d4af37] to-[#f4dc8a] text-[#06110a] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary 3D CTA Button (Gold) */}
            <a
              href="#custom-commission"
              className="hidden sm:inline-flex btn-3d-gold px-4 py-2.5 text-xs tracking-wide"
            >
              <Palette className="w-3.5 h-3.5 text-[#0f1811]" />
              <span>Commission Piece</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#0e2418] border border-white/10 text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#08170f]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 mt-2">
            <a
              href="#collections"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-[#d1e0d7] hover:bg-white/5 rounded-lg"
            >
              Collections
            </a>
            <a
              href="#custom-commission"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-[#f4dc8a] font-medium hover:bg-white/5 rounded-lg"
            >
              Custom Art Commission
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-[#d1e0d7] hover:bg-white/5 rounded-lg"
            >
              Gallery
            </a>
            <a
              href="#philosophy"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-[#d1e0d7] hover:bg-white/5 rounded-lg"
            >
              The Sukoon Story
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-[#d1e0d7] hover:bg-white/5 rounded-lg"
            >
              Client Reviews
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#f4dc8a] hover:bg-white/5 rounded-lg font-medium"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="#custom-commission"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full btn-3d-gold py-2.5 text-xs text-center justify-center"
              >
                Commission Piece
              </a>
              <a
                href={`tel:${settings.phone1}`}
                className="w-full btn-3d-dark py-2 text-xs text-center justify-center flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#34d399]" />
                <span>Call Studio: {settings.phone1}</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

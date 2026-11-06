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
  MessageCircle,
  Star,
  Image as ImageIcon,
  Heart,
  ChevronRight,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen, settings } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    "Assalamu Alaikum! I would like to inquire about Tiyana's Sukoon custom artwork."
  )}`;

  return (
    <>
      {/* Top Announcement Bar */}
      {settings.isAnnouncementActive && (
        <div className="bg-gradient-to-r from-[#06150d] via-[#0d2a1b] to-[#06150d] border-b border-[#d4af37]/25 py-1.5 sm:py-2 px-3 sm:px-6 text-[11px] sm:text-xs font-medium text-[#e5ede7] relative z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <p className="tracking-wide text-[#d6e5dc] truncate sm:whitespace-normal">
                {settings.announcementText}
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 text-[#f3db83] hover:text-white font-semibold text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 transition-all hover:bg-[#d4af37]/25"
            >
              <MessageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#34d399]" />
              <span>WhatsApp</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </div>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? "bg-[#06110a]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-2.5 sm:py-3"
            : "bg-[#06110a]/85 backdrop-blur-sm sm:bg-transparent border-b border-white/5 sm:border-transparent py-2.5 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          {/* Brand Logo & Title */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 sm:gap-3 group min-w-0"
          >
            {/* Studio Logo Emblem */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#f5d77f] to-[#0e2a1b] shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#06110a]">
                <Image
                  src={settings.siteLogo || "/brand/logo.jpg"}
                  alt="Tiyana's Sukoon Logo"
                  width={44}
                  height={44}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Brand Title and Tagline (Desktop Only - Strictly Hidden on Mobile & Tablet) */}
            <div className="hidden md:flex min-w-0 flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base md:text-lg tracking-tight text-white group-hover:text-[#f4dc8a] transition-colors truncate">
                  Tiyana&apos;s Sukoon
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.2 sm:py-0.5 rounded bg-[#d4af37]/15 text-[#f4dc8a] border border-[#d4af37]/30 shrink-0">
                  Studio
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#8fa89a] font-normal tracking-wide truncate">
                Art for your peace <span className="hidden xs:inline">• Dhaka</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Linear Pill Style) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0b1f14]/85 p-1.5 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
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

          {/* Right Action Area: Cart, Commission CTA & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cart Trigger Button (3D Dark Bevel) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl btn-3d-dark text-[#e5ede7] flex items-center justify-center transition-all hover:scale-105"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#f4dc8a]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#d4af37] to-[#f4dc8a] text-[#06110a] text-[10px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop Commission Piece CTA (Gold 3D - Strictly Hidden on Mobile & Tablet) */}
            <a
              href="#custom-commission"
              className="hidden lg:inline-flex btn-3d-gold px-4 py-2.5 text-xs tracking-wide"
            >
              <Palette className="w-3.5 h-3.5 text-[#0f1811]" />
              <span>Commission Piece</span>
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl border transition-all flex items-center justify-center ${
                mobileMenuOpen
                  ? "bg-[#102d1d] border-[#d4af37]/50 text-[#f4dc8a] shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                  : "bg-[#0b1f14] border-white/10 text-white hover:border-[#d4af37]/40"
              }`}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#f4dc8a]" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#d4af37]/20 bg-[#06110a]/98 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-[calc(100vh-70px)] overflow-y-auto animate-fadeIn">
            <div className="px-4 py-5 space-y-4">
              {/* Navigation Links Grid */}
              <div className="space-y-1">
                <a
                  href="#collections"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#dce7e1] hover:text-[#f4dc8a] hover:bg-[#0c2417] transition-all border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-[#d4af37]" />
                    <span>Artwork Collections</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6e8578]" />
                </a>

                <a
                  href="#custom-commission"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#fceb9e] bg-[#0c2619]/60 hover:bg-[#0c2619] transition-all border border-[#d4af37]/25"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span>Custom Art</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#fceb9e] border border-[#d4af37]/40">
                    Bespoke
                  </span>
                </a>

                <a
                  href="#gallery"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#dce7e1] hover:text-[#f4dc8a] hover:bg-[#0c2417] transition-all border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-4 h-4 text-[#d4af37]" />
                    <span>Visual Archives & Gallery</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6e8578]" />
                </a>

                <a
                  href="#philosophy"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#dce7e1] hover:text-[#f4dc8a] hover:bg-[#0c2417] transition-all border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-[#d4af37]" />
                    <span>The Sukoon Story & Craft</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6e8578]" />
                </a>

                <a
                  href="#reviews"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#dce7e1] hover:text-[#f4dc8a] hover:bg-[#0c2417] transition-all border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                    <span>Client Reviews & Rating</span>
                  </div>
                  <span className="text-xs text-[#fceb9e] font-bold">5.0 ★</span>
                </a>

                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#f4dc8a] hover:bg-[#0c2417] transition-all border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    <span>Admin Studio Portal</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6e8578]" />
                </Link>
              </div>

              {/* Action Buttons Section */}
              <div className="pt-2 border-t border-white/10 space-y-2.5">
                {/* 1-Tap WhatsApp Direct */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0d3320] to-[#12422a] border border-[#25d366]/40 text-[#a7f3d0] font-semibold text-xs flex items-center justify-center gap-2 shadow-lg hover:border-[#25d366] transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#25d366]" />
                  <span>Order via WhatsApp Chat</span>
                </a>

                {/* Direct Phone Call */}
                <a
                  href={`tel:${settings.phone1}`}
                  className="w-full btn-3d-dark py-2 text-xs text-center justify-center flex items-center gap-2 text-[#c4d7cc]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>Call Studio: {settings.phone1}</span>
                </a>
              </div>

              {/* Studio Guarantee Badge */}
              <div className="pt-2 text-center text-[10px] text-[#8fa89a]">
                <p>✨ 100% Hand-painted in Dhaka Studio • Nationwide Delivery</p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}
    </>
  );
};

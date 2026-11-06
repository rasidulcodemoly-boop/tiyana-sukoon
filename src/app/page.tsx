"use client";

import React from "react";
import { StoreProvider } from "../context/StoreContext";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { FeaturedCollection } from "../components/FeaturedCollection";
import { CustomConfigurator } from "../components/CustomConfigurator";
import { GalleryLightbox } from "../components/GalleryLightbox";
import { BrandStory } from "../components/BrandStory";
import { Testimonials } from "../components/Testimonials";
import { FAQSection } from "../components/FAQSection";
import { Footer } from "../components/Footer";
import { CartDrawer } from "../components/CartDrawer";
import { QuickViewModal } from "../components/QuickViewModal";

export default function HomePage() {
  return (
    <StoreProvider>
      <div className="relative min-h-screen bg-[#06110a] text-[#f4f8f5] selection:bg-[#d4af37]/30 selection:text-[#f4dc8a]">
        {/* Navigation Bar */}
        <Navbar />

        {/* Hero Section */}
        <main>
          <HeroSection />

          {/* Featured Artworks Collection with Category Filters */}
          <FeaturedCollection />

          {/* Interactive Bespoke Commission Builder */}
          <CustomConfigurator />

          {/* Authentic Facebook Archives & Lightbox Gallery */}
          <GalleryLightbox />

          {/* The Story & Meaning Behind Sukoon */}
          <BrandStory />

          {/* Verified Customer Testimonials */}
          <Testimonials />

          {/* Care Guide & FAQ */}
          <FAQSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Modals & Drawers */}
        <CartDrawer />
        <QuickViewModal />
      </div>
    </StoreProvider>
  );
}

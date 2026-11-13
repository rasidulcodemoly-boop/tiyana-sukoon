"use client";

import React from "react";
import { StoreProvider, useStore } from "../context/StoreContext";
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

const HomeContent: React.FC = () => {
  const { settings } = useStore();
  const visibility = settings.sectionVisibility;

  return (
    <div className="relative min-h-screen bg-[#06110a] text-[#f4f8f5] selection:bg-[#d4af37]/30 selection:text-[#f4dc8a]">
      {/* Navigation Bar */}
      {visibility?.navbar !== false && <Navbar />}

      {/* Main Sections (Each Section fully controllable from Admin CMS) */}
      <main>
        {/* 1. Hero Section */}
        {visibility?.hero !== false && <HeroSection />}

        {/* 2. Featured Artworks Collection with Category Filters */}
        {visibility?.collections !== false && <FeaturedCollection />}

        {/* 3. Interactive Bespoke Commission Builder */}
        {visibility?.customConfigurator !== false && <CustomConfigurator />}

        {/* 4. Authentic Visual Archives & Lightbox Gallery */}
        {visibility?.gallery !== false && <GalleryLightbox />}

        {/* 5. The Story & Meaning Behind Sukoon */}
        {visibility?.brandStory !== false && <BrandStory />}

        {/* 6. Verified Customer Testimonials */}
        {visibility?.testimonials !== false && <Testimonials />}

        {/* 7. Care Guide & FAQ */}
        {visibility?.faq !== false && <FAQSection />}
      </main>

      {/* Footer */}
      {visibility?.footer !== false && <Footer />}

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <QuickViewModal />
    </div>
  );
};

export default function HomePage() {
  return (
    <StoreProvider>
      <HomeContent />
    </StoreProvider>
  );
}

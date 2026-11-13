"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "../context/StoreContext";
import { Artwork } from "../types";
import { ArrowRight, ZoomIn } from "lucide-react";

export const HeroSection: React.FC = () => {
  const { setSelectedArtworkForModal, artworks, settings, language, t } = useStore();

  // Desktop & Mobile Carousel: Artworks selected from Admin Panel
  const carouselArtworks = useMemo(() => {
    const selectedIds = settings.heroCarouselArtworkIds;
    // If the admin has configured the carousel (even if empty []):
    if (selectedIds !== undefined && Array.isArray(selectedIds)) {
      return selectedIds
        .map((id) => artworks.find((a) => a.id === id))
        .filter((a): a is Artwork => Boolean(a));
    }
    // Only if settings.heroCarouselArtworkIds has never been defined at all:
    return artworks.length > 0 ? artworks.slice(0, 8) : [];
  }, [artworks, settings.heroCarouselArtworkIds]);

  const displayArtworks = [...carouselArtworks, ...carouselArtworks];

  // Mobile View: 2 images displayed simultaneously, cycling 1-by-1 every 3 seconds
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Cloned items to ensure seamless infinite looping for 2-column view
  const mobileDisplayArtworks =
    carouselArtworks.length >= 2
      ? [...carouselArtworks, carouselArtworks[0], carouselArtworks[1]]
      : carouselArtworks;

  // Auto-advance by 1 image every 3 seconds
  useEffect(() => {
    if (carouselArtworks.length < 2 || isPaused) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setMobileIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, [carouselArtworks.length, isPaused]);

  // Seamless reset when looping past the last item
  const handleTransitionEnd = () => {
    if (mobileIndex >= carouselArtworks.length) {
      setIsTransitioning(false);
      setMobileIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  // Dynamic Hero CMS Settings from Store
  const heroCMS = settings.heroCMS;

  const eyebrow =
    language === "bn"
      ? (heroCMS?.eyebrowBangla || heroCMS?.eyebrow || t("heroEyebrow"))
      : (heroCMS?.eyebrow || t("heroEyebrow"));

  const headline1 =
    language === "bn"
      ? (heroCMS?.headline1Bangla || heroCMS?.headline1 || t("heroHeadline1"))
      : (heroCMS?.headline1 || t("heroHeadline1"));

  const headline2 =
    language === "bn"
      ? (heroCMS?.headline2Bangla || heroCMS?.headline2 || t("heroHeadline2"))
      : (heroCMS?.headline2 || t("heroHeadline2"));

  const description =
    language === "bn"
      ? (heroCMS?.descriptionBangla || heroCMS?.description || t("heroSubheadline"))
      : (heroCMS?.description || t("heroSubheadline"));

  const primaryBtnText =
    language === "bn"
      ? (heroCMS?.primaryBtnTextBangla || heroCMS?.primaryBtnText || t("heroBtnCollections"))
      : (heroCMS?.primaryBtnText || t("heroBtnCollections"));

  const secondaryBtnText =
    language === "bn"
      ? (heroCMS?.secondaryBtnTextBangla || heroCMS?.secondaryBtnText || t("heroBtnCustom"))
      : (heroCMS?.secondaryBtnText || t("heroBtnCustom"));

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;
      if (diff > 40) {
        // Swiped left -> next
        setIsTransitioning(true);
        setMobileIndex((prev) => (prev >= carouselArtworks.length ? 0 : prev + 1));
      } else if (diff < -40) {
        // Swiped right -> prev
        setIsTransitioning(true);
        setMobileIndex((prev) => (prev <= 0 ? carouselArtworks.length - 1 : prev - 1));
      }
      touchStartX.current = null;
    }
    // Resume auto-slide after brief delay
    setTimeout(() => setIsPaused(false), 1500);
  };

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
            {heroCMS?.showEyebrow !== false && (
              <p className="text-xs sm:text-sm font-semibold text-[#d4af37] tracking-wider uppercase">
                {eyebrow}
              </p>
            )}

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {headline1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fceb9e] via-[#d4af37] to-[#e6bc42] drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]">
                {headline2}
              </span>
            </h1>
          </div>

          {/* Right Side: Sub-headline + 2 Buttons */}
          <div className="lg:col-span-5 space-y-5 text-center lg:text-left lg:pb-1">
            {/* Sub-headline Text */}
            <p className="text-base sm:text-lg text-[#9cb5a6] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              {description}
            </p>

            {/* Action Buttons (Configurable in Hero CMS) */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3.5 pt-1">
              {heroCMS?.showPrimaryBtn !== false && (
                <a
                  href={heroCMS?.primaryBtnUrl || "#collections"}
                  className="btn-3d-gold px-6 py-3.5 text-xs sm:text-sm tracking-wide font-bold flex items-center gap-2"
                >
                  <span>{primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}

              {heroCMS?.showSecondaryBtn !== false && (
                <a
                  href={heroCMS?.secondaryBtnUrl || "#custom-commission"}
                  className="btn-3d-dark px-6 py-3.5 text-xs sm:text-sm tracking-wide text-[#e5ede7] border border-white/10 hover:border-[#d4af37]/40 flex items-center gap-2"
                >
                  <span>{secondaryBtnText}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CAROUSEL SECTION (ONLY RENDER IF SLIDES ARE CONFIGURED & ENABLED) */}
      {heroCMS?.showCarousel !== false && carouselArtworks.length > 0 && (
        <>
          {/* MOBILE VIEW ONLY: 2 Images displayed side-by-side, changing 1-by-1 every 3 seconds */}
          <div className="block md:hidden mt-8 px-4 w-full max-w-md mx-auto">
            {/* 2-Card Slider Viewport */}
            <div
              className="relative overflow-hidden rounded-2xl p-1"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className="flex gap-3 will-change-transform"
                style={{
                  transform: `translateX(calc(-${mobileIndex} * (50% + 6px)))`,
                  transition: isTransitioning
                    ? "transform 600ms cubic-bezier(0.25, 1, 0.5, 1)"
                    : "none",
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {mobileDisplayArtworks.map((art, idx) => (
                  <Link
                    key={`mob-${art.id}-${idx}`}
                    href={`/artwork/${art.id}`}
                    className="relative w-[calc(50%-6px)] shrink-0 aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-[#d4af37]/35 bg-[#08180f] shadow-[0_10px_25px_rgba(0,0,0,0.7)] active:scale-[0.98] transition-all block"
                    title="Click to view full piece"
                  >
                    {/* Artwork Image */}
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 250px"
                      className="object-cover"
                      priority={idx < 4}
                    />

                    {/* Subtle dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06110a]/95 via-[#06110a]/25 to-transparent pointer-events-none" />

                    {/* Top Category Badge */}
                    <div className="absolute top-2 left-2 z-10 pointer-events-none">
                      <span className="px-1.5 py-0.5 rounded text-[8px] uppercase font-mono font-bold bg-[#06110a]/85 text-[#f4dc8a] border border-[#d4af37]/30 backdrop-blur-xs">
                        {art.category}
                      </span>
                    </div>

                    {/* Bottom Title & Price */}
                    <div className="absolute bottom-0 inset-x-0 p-2.5 z-10 space-y-0.5 pointer-events-none">
                      <h3 className="text-[11px] font-bold text-white truncate">
                        {language === "bn" && art.titleBangla ? art.titleBangla : art.title}
                      </h3>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#8fa89a] font-mono text-[9px]">
                          {art.dimensions}
                        </span>
                        <span className="font-extrabold text-[#fceb9e] font-mono text-[11px]">
                          ৳{art.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Carousel Indicators for Mobile */}
            {carouselArtworks.length > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-3.5">
                {carouselArtworks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIsTransitioning(true);
                      setMobileIndex(i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      mobileIndex % carouselArtworks.length === i
                        ? "w-6 bg-gradient-to-r from-[#d4af37] to-[#f4dc8a] shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                        : "w-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* DESKTOP VIEW ONLY: Animated Horizontal Infinite Continuous Marquee Loop */}
          <div className="hidden md:block mt-12 sm:mt-16 pt-2 relative w-full overflow-hidden">
            {/* Left & Right Smooth Edge Fade Masks */}
            <div className="absolute left-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-r from-[#06110a] via-[#06110a]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-l from-[#06110a] via-[#06110a]/80 to-transparent z-10 pointer-events-none" />

            {/* Continuous Horizontal Marquee Carousel */}
            <div className="animate-marquee gap-4 sm:gap-6 py-2">
              {displayArtworks.map((art, idx) => (
                <Link
                  key={`desk-${art.id}-${idx}`}
                  href={`/artwork/${art.id}`}
                  className="group relative w-[220px] sm:w-[270px] md:w-[310px] aspect-[4/5] shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-[#08180f] shadow-xl hover:border-[#d4af37]/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(212,175,55,0.2)] block"
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
                      {language === "bn" && art.titleBangla ? art.titleBangla : art.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8fa89a] font-mono">{art.dimensions}</span>
                      <span className="font-extrabold text-[#fceb9e] font-mono">
                        ৳{art.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

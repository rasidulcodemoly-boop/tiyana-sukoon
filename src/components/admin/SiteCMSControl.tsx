"use client";

import React, { useState } from "react";
import {
  SiteSettings,
  SectionVisibilitySettings,
  NavbarCMSSettings,
  HeroCMSSettings,
  CollectionsCMSSettings,
  CustomConfiguratorCMSSettings,
  GalleryCMSSettings,
  BrandStoryCMSSettings,
  FAQCMSSettings,
  TestimonialsCMSSettings,
  FooterCMSSettings,
  NavMenuItem,
  FAQItemCMS,
} from "../../types";
import {
  Layers,
  Eye,
  EyeOff,
  Save,
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Compass,
  Layout,
  MessageSquare,
  HelpCircle,
  Star,
  Info,
  Sliders,
  Type,
  Link as LinkIcon,
  ShoppingBag,
  Globe,
} from "lucide-react";

interface SiteCMSControlProps {
  settings: SiteSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  onSave: () => void;
  isSaving: boolean;
}

export const SiteCMSControl: React.FC<SiteCMSControlProps> = ({
  settings,
  onUpdateSettings,
  onSave,
  isSaving,
}) => {
  // Sub-tab selection for organized editing
  const [activeSubTab, setActiveSubTab] = useState<
    | "visibility"
    | "navbar"
    | "hero"
    | "collections"
    | "configurator"
    | "gallery"
    | "story"
    | "faq"
    | "testimonials"
    | "footer"
  >("visibility");

  // Defaults fallback helpers
  const visibility: SectionVisibilitySettings = settings.sectionVisibility || {
    announcementBar: settings.isAnnouncementActive !== false,
    navbar: true,
    hero: true,
    collections: true,
    customConfigurator: true,
    gallery: true,
    brandStory: true,
    testimonials: true,
    faq: true,
    footer: true,
  };

  const navbarCMS: NavbarCMSSettings = settings.navbarCMS || {
    brandName: "Tiyana's Sukoon",
    brandNameBangla: "তিয়ানা'স সুকূন",
    tagline: "Art for your peace • Dhaka",
    taglineBangla: "শান্তির পরশ • ঢাকা স্টুডিও",
    showLogo: true,
    showLanguageSwitcher: true,
    showCartButton: true,
    menuItems: [
      { id: "1", label: "Collections", labelBangla: "কালেকশন", url: "#collections", isActive: true },
      { id: "2", label: "Custom Art", labelBangla: "কাস্টম আর্ট", url: "#custom-commission", isActive: true },
      { id: "3", label: "Gallery", labelBangla: "গ্যালারি", url: "#gallery", isActive: true },
      { id: "4", label: "Philosophy", labelBangla: "দর্শন", url: "#philosophy", isActive: true },
      { id: "5", label: "Reviews", labelBangla: "রিভিউ", url: "#reviews", isActive: true },
    ],
  };

  const heroCMS: HeroCMSSettings = settings.heroCMS || {
    eyebrow: "HANDCRAFTED ISLAMIC CALLIGRAPHY STUDIO",
    eyebrowBangla: "হস্তনির্মিত খাঁটি ইসলামিক ক্যালিগ্রাফি স্টুডিও",
    showEyebrow: true,
    headline1: "Art for your peace.",
    headline1Bangla: "আপনার ঘরের শান্তির পরশ,",
    headline2: "Peace for your soul.",
    headline2Bangla: "হৃদয়ের আত্মিক প্রশান্তি।",
    description: "Where every golden stroke of calligraphy awakens serenity. Pure Islamic calligraphy & premium textured canvas art.",
    descriptionBangla: "যেখানে সোনালী তুলির প্রতিটি আঁচড় মনের ভেতর প্রশান্তি জাগায়। খাঁটি ইসলামিক ক্যালিগ্রাফি ও প্রিমিয়াম টেক্সচার ক্যানভাস আর্ট।",
    primaryBtnText: "View Collections",
    primaryBtnTextBangla: "কালেকশন দেখুন",
    primaryBtnUrl: "#collections",
    showPrimaryBtn: true,
    secondaryBtnText: "Custom Art Order",
    secondaryBtnTextBangla: "কাস্টম অর্ডার করুন",
    secondaryBtnUrl: "#custom-commission",
    showSecondaryBtn: true,
    showCarousel: true,
  };

  const collectionsCMS: CollectionsCMSSettings = settings.collectionsCMS || {
    title: "Handcrafted Artworks & Calligraphies",
    titleBangla: "হস্তনির্মিত ক্যালিগ্রাফি ও ক্যানভাস আর্ট সংগ্রহ",
    subtitle: "Explore our signature collection of original Islamic calligraphy canvases, each treated with archival gold leaf and protective clear glaze.",
    subtitleBangla: "আর্কাইভাল গোল্ড লিফ ও প্রিমিয়াম প্রটেক্টিভ কোটিংযুক্ত আমাদের এক্সক্লুসিভ ইসলামিক ক্যালিগ্রাফি ফ্রেমগুলো ঘুরে দেখুন।",
    showCategoryFilters: true,
    showSearchBar: true,
  };

  const configuratorCMS: CustomConfiguratorCMSSettings = settings.customConfiguratorCMS || {
    title: "Design Your Custom Islamic Canvas",
    titleBangla: "আপনার মনমতো কাস্টম ইসলামিক ক্যানভাস তৈরি করুন",
    subtitle: "Select your preferred Quranic verse, canvas size, and frame type for a tailored masterpiece crafted exclusively for your sanctuary.",
    subtitleBangla: "আপনার প্রিয় আয়াত বা নাম, ক্যানভাস সাইজ এবং ফ্রেম নির্বাচন করে অর্ডার করুন আপনার পছন্দের কাস্টম মাস্টারপিস।",
  };

  const galleryCMS: GalleryCMSSettings = settings.galleryCMS || {
    title: "Tiyana's Sukoon Visual Archives",
    titleBangla: "তিয়ানা'স সুকূন ভিজ্যুয়াল ফটো আর্কাইভ",
    subtitle: "Authentic photographs from our Dhaka studio and collector homes across Bangladesh.",
    subtitleBangla: "আমাদের ঢাকা স্টুডিও এবং দেশের বিভিন্ন প্রান্তে গ্রাহকদের ঘরে শোভা পাওয়া আসল আর্টওয়ার্কের ফটো গ্যালারি।",
    showTabs: true,
  };

  const storyCMS: BrandStoryCMSSettings = settings.brandStoryCMS || {
    title: "Art Designed to Bring Serenity to Modern Homes",
    titleBangla: "আধুনিক গৃহকোণে আধ্যাত্মিক প্রশান্তি ছড়িয়ে দেওয়ার শিল্প",
    subtitle: "The Philosophy Behind Tiyana's Sukoon",
    subtitleBangla: "তিয়ানা'স সুকূন-এর পেছনের গল্প ও দর্শন",
    paragraph1: "Tiyana's Sukoon was born out of a desire to bring timeless sacred art into modern living spaces. Every piece is an intimate fusion of traditional Arabic script, tactile sand-infused textures, and radiant 24K gilding.",
    paragraph1Bangla: "পবিত্র আয়াত ও ধ্রুপদী আরবি ক্যালিগ্রাফিকে আধুনিক ড্রয়িংরুমের নান্দনিকতায় রূপ দিতে তিয়ানা'স সুকূনের জন্ম। প্রতিটি ক্যানভাসে ঐতিহ্যবাহী ক্যালিগ্রাফি, বালুকাময় জীবন্ত টেক্সচার ও ২৪K গোল্ড ফিনিশিংয়ের অনন্য মিলন ঘটে।",
    paragraph2: "We believe a home should be a sanctuary of peace (سكون) — an environment that constantly gently reminds you of the Divine beauty and tranquility.",
    paragraph2Bangla: "আমরা বিশ্বাস করি একটি বাড়ি কেবল ইট-পাথরের দেয়াল নয়, এটি শান্তির এক অভয়ারণ্য (سكون) — যা সর্বদা মহান রবের সৌন্দর্য ও আত্মিক প্রশান্তির কথা স্মরণ করিয়ে দেয়।",
    badgeText: "Handcrafted in Dhaka Studio",
    badgeTextBangla: "ঢাকা স্টুডিওতে সম্পূর্ণ স্বহস্তে তৈরি",
    pillars: [
      {
        id: "p1",
        iconName: "Feather",
        title: "Authentic Thuluth & Diwani",
        titleBangla: "ধ্রুপদী সুলুস ও দিওয়ানি",
        desc: "Strictly adhering to classical Islamic calligraphic proportions and spiritual beauty.",
        descBangla: "শাস্ত্রীয় আরবি ক্যালিগ্রাফির সঠিক অনুপাত ও নান্দনিকতা বজায় রেখে প্রতিটি অক্ষর আঁকা।",
      },
      {
        id: "p2",
        iconName: "Sparkles",
        title: "24K Archival Gilding",
        titleBangla: "২৪K গোল্ড লিফ কোটিং",
        desc: "German metallic pigments and hand-applied imitation gold leaf for a luminous golden shine.",
        descBangla: "উচ্চমানের জার্মান মেটালিক কালার ও খাঁটি গোল্ড লিফ যা বছরের পর বছর দ্যুতি ছড়ায়।",
      },
      {
        id: "p3",
        iconName: "Layers",
        title: "Tactile 3D Texturing",
        titleBangla: "জীবন্ত ৩D স্যান্ড টেক্সচার",
        desc: "Fine granulated desert sand medium and heavy body acrylics for touchable depth.",
        descBangla: "বিশেষ প্রাকৃতিক বালুকা পেস্ট ও হেভি বডি অ্যাক্রিলিক যা ক্যানভাসে দেয় অপূর্ব ত্রিমাত্রিক টেক্সচার।",
      },
      {
        id: "p4",
        iconName: "Shield",
        title: "Museum UV Glaze Protection",
        titleBangla: "মিউজিয়াম ইউভি প্রোটেকশন",
        desc: "Sealed with double-layer archival varnish protecting against moisture, dust, and fading.",
        descBangla: "ডাবল-লেয়ার আর্চাইভাল বার্নিশ কোটিং যা ধুলাবালি, আর্দ্রতা ও রোদ থেকে সম্পূর্ণ সুরক্ষিত রাখে।",
      },
    ],
  };

  const faqCMS: FAQCMSSettings = settings.faqCMS || {
    title: "Frequently Asked Questions",
    titleBangla: "সাধারণ জিজ্ঞাসা ও উত্তর (FAQ)",
    subtitle: "Everything you need to know about our handcrafted artworks, materials, and delivery.",
    subtitleBangla: "আমাদের ক্যালিগ্রাফি ক্যানভাস, তৈরির উপকরণ ও ডেলিভারি সংক্রান্ত প্রয়োজনীয় সকল তথ্য।",
    items: [
      {
        id: "faq-1",
        question: "How long does custom calligraphy take to complete?",
        questionBangla: "কাস্টম ক্যালিগ্রাফি তৈরি হতে কতদিন সময় লাগে?",
        answer: "Standard ready-in-studio pieces ship within 24–48 hours. Custom calligraphy commissions typically take 5 to 8 business days for sketching, hand-painting, gold foil application, and precision framing.",
        answerBangla: "স্টুডিওতে রেডি থাকা আর্টওয়ার্কগুলো সাধারণত ২৪–৪৮ ঘণ্টার মধ্যে ডেলিভারি দেওয়া হয়। আর কাস্টম সাইজ বা নামের ক্যালিগ্রাফির ক্ষেত্রে স্কেচিং, রঙ, ২৪K গোল্ড ফয়েল ও ফ্রেম করতে ৫ থেকে ৮ কর্মদিবস সময় লাগে।",
        isActive: true,
      },
      {
        id: "faq-2",
        question: "Is the gold real, and will it tarnish or fade over time?",
        questionBangla: "গোল্ড কি খাঁটি এবং সময়ের সাথে রং নষ্ট হবে কি?",
        answer: "We use premium 24K genuine imitation gilding leaf and German metallic pigments. Every completed artwork is treated with an archival UV-filtering gloss varnish that protects the gold leaf from oxidation, moisture, and sunlight fading for decades.",
        answerBangla: "আমরা প্রিমিয়াম ২৪K ইমিটেশন গোল্ড লিফ ও জার্মানির তৈরি মেটালিক কালার ব্যবহার করি। পেইন্টিং শেষে আর্টওয়ার্কের উপর ইউভি-প্রোটেক্টিভ গ্লস বার্নিশ কোটিং দেওয়া হয়, ফলে এটি রোদ, ধুলাবালি বা বাতাসে নষ্ট হয় না।",
        isActive: true,
      },
      {
        id: "faq-3",
        question: "How do you package artworks for delivery outside Dhaka?",
        questionBangla: "ঢাকার বাইরে ডেলিভারির জন্য কেমন প্যাকেজিং করা হয়?",
        answer: "We understand that framed canvases are delicate. Each piece is wrapped in bubble film, fitted with hard compressed foam corner protectors, and encased in rigid reinforced cardboard boxes. For large panoramic canvases over 36 inches, we utilize wooden framing crates.",
        answerBangla: "ফ্রেম করা ক্যানভাস সুরক্ষিত রাখতে বাবল র‍্যাপ, হার্ড ফোম কর্নার প্রোটেক্টর এবং শক্ত ডাবল-ওয়াল কার্টন বক্সে প্যাক করা হয়। বড় প্যানোরামিক ক্যানভাসে কাঠের ফ্রেম ক্রেইট ব্যবহার করা হয়।",
        isActive: true,
      },
    ],
  };

  const testimonialsCMS: TestimonialsCMSSettings = settings.testimonialsCMS || {
    title: "Loved in Homes Across Bangladesh",
    titleBangla: "সারা দেশের শতাধিক গৃহকোণে সমাদৃত",
    subtitle: "Heartfelt feedback from our verified art collectors and interior connoisseurs.",
    subtitleBangla: "আমাদের সম্মানিত সংগ্রাহক ও গ্রাহকদের হৃদয়ের উষ্ণ অনুভূতি ও মন্তব্য।",
    showVerifiedBadge: true,
  };

  const footerCMS: FooterCMSSettings = settings.footerCMS || {
    aboutText: "Handcrafted Islamic calligraphy and bespoke textured canvas art designed to awaken deep tranquility in modern homes. Made with devotion in Dhaka, Bangladesh.",
    aboutTextBangla: "আধুনিক ঘরের আঙিনায় আত্মিক প্রশান্তি ও পবিত্রতার ছোঁয়া ছড়িয়ে দিতে খাঁটি হস্তনির্মিত ইসলামিক ক্যালিগ্রাফি আর্ট স্টুডিও। সম্পূর্ণ স্বহস্তে তৈরি, ঢাকা, বাংলাদেশ।",
    copyrightText: "© 2026 Tiyana's Sukoon. All Rights Reserved. Crafted with Barakah in Dhaka.",
    showFacebookButton: true,
    showWhatsAppButton: true,
  };

  // Visibility toggle handler
  const toggleSection = (key: keyof SectionVisibilitySettings) => {
    onUpdateSettings((prev) => ({
      ...prev,
      sectionVisibility: {
        ...visibility,
        [key]: !visibility[key],
      },
      // Keep isAnnouncementActive synced with announcementBar toggle
      ...(key === "announcementBar" ? { isAnnouncementActive: !visibility.announcementBar } : {}),
    }));
  };

  // Helper update functions
  const updateNavbarCMS = (updates: Partial<NavbarCMSSettings>) => {
    onUpdateSettings((prev) => ({
      ...prev,
      navbarCMS: { ...navbarCMS, ...updates },
    }));
  };

  const updateHeroCMS = (updates: Partial<HeroCMSSettings>) => {
    onUpdateSettings((prev) => ({
      ...prev,
      heroCMS: { ...heroCMS, ...updates },
    }));
  };

  const updateCollectionsCMS = (updates: Partial<CollectionsCMSSettings>) => {
    onUpdateSettings((prev) => ({
      ...prev,
      collectionsCMS: { ...collectionsCMS, ...updates },
    }));
  };

  const updateConfiguratorCMS = (updates: Partial<CustomConfiguratorCMSSettings>) => {
    onUpdateSettings((prev) => ({
      ...prev,
      customConfiguratorCMS: { ...configuratorCMS, ...updates },
    }));
  };

  const updateGalleryCMS = (updates: Partial<GalleryCMSSettings>) => {
    onUpdateSettings((prev) => ({
      ...prev,
      galleryCMS: { ...galleryCMS, ...updates },
    }));
  };

  const updateStoryCMS = (updates: Partial<BrandStoryCMSSettings>) => {
    onUpdateSettings((prev) => ({
      ...prev,
      brandStoryCMS: { ...storyCMS, ...updates },
    }));
  };

  const updateFaqCMS = (updates: Partial<FAQCMSSettings>) => {
    onUpdateSettings((prev) => ({
      ...prev,
      faqCMS: { ...faqCMS, ...updates },
    }));
  };

  const updateTestimonialsCMS = (updates: Partial<TestimonialsCMSSettings>) => {
    onUpdateSettings((prev) => ({
      ...prev,
      testimonialsCMS: { ...testimonialsCMS, ...updates },
    }));
  };

  const updateFooterCMS = (updates: Partial<FooterCMSSettings>) => {
    onUpdateSettings((prev) => ({
      ...prev,
      footerCMS: { ...footerCMS, ...updates },
    }));
  };

  // Section items list for master switchboard
  const SECTION_REGISTRY = [
    {
      key: "announcementBar" as const,
      name: "Announcement Notice Bar",
      nameBn: "টপ নোটিশ বার",
      desc: "হোমপেজের একদম উপরে স্ক্রলিং নোটিশ ও অফার বার",
      icon: Sparkles,
      subTab: "visibility" as const,
    },
    {
      key: "navbar" as const,
      name: "Header Navigation Bar",
      nameBn: "নেভবার ও হেডার মেনু",
      desc: "স্টুডিও লোগো, ব্র্যান্ড নেম, মেনু লিঙ্ক ও কার্ট বাটন",
      icon: Compass,
      subTab: "navbar" as const,
    },
    {
      key: "hero" as const,
      name: "Hero Showcase & Carousel",
      nameBn: "হিরো ব্যানার ও স্লাইডার",
      desc: "মূল আকর্ষণীয় শিরোনাম, ডেসক্রিপশন ও স্লাইডার",
      icon: Layout,
      subTab: "hero" as const,
    },
    {
      key: "collections" as const,
      name: "Featured Collections",
      nameBn: "আর্ট কালেকশন সেকশন",
      desc: "৩:৪ রেশিও প্রোডাক্ট কার্ড, ফিল্টার বার ও সার্চ বক্স",
      icon: Layers,
      subTab: "collections" as const,
    },
    {
      key: "customConfigurator" as const,
      name: "Custom Canvas Configurator",
      nameBn: "কাস্টম ফ্রেম বিল্ডার",
      desc: "৩-স্টেপ কাস্টম আর্ট অর্ডার ও দাম ক্যালকুলেটর",
      icon: Sliders,
      subTab: "configurator" as const,
    },
    {
      key: "gallery" as const,
      name: "Visual Archives Lightbox",
      nameBn: "ফটো গ্যালারি ও লাইটবক্স",
      desc: "স্টুডিও ফটো লাইব্রেরি ও ফুল-স্ক্রিন প্রিভিউ",
      icon: Eye,
      subTab: "gallery" as const,
    },
    {
      key: "brandStory" as const,
      name: "Brand Philosophy & Story",
      nameBn: "ব্র্যান্ড দর্শন ও তাৎপর্য",
      desc: "সুকূন দর্শন, স্টোরি প্যারাগ্রাফ ও ৪টি ভ্যালু পিলার",
      icon: Info,
      subTab: "story" as const,
    },
    {
      key: "testimonials" as const,
      name: "Customer Reviews",
      nameBn: "কাস্টমার রিভিউ সেকশন",
      desc: "ভেরিফায়েড ক্রেতাদের ৫-স্টার রেটিং ও প্রশংসা",
      icon: Star,
      subTab: "testimonials" as const,
    },
    {
      key: "faq" as const,
      name: "FAQ & Care Guide",
      nameBn: "সাধারণ জিজ্ঞাসা ও উত্তর",
      desc: "ক্যানভাস যত্ন, ডেলিভারি ও গোল্ড লিফ সম্পর্কিত প্রশ্নাবলি",
      icon: HelpCircle,
      subTab: "faq" as const,
    },
    {
      key: "footer" as const,
      name: "Footer & Copyright",
      nameBn: "ফুটার ও সোশ্যাল লিঙ্ক",
      desc: "স্টুডিওর ঠিকানা, বায়ো, কপিরাইট ও ডিরেক্ট বাটন",
      icon: Globe,
      subTab: "footer" as const,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Master Action Bar */}
      <div className="linear-card p-5 sm:p-6 rounded-2xl border border-[#d4af37]/35 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#f4dc8a] uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4 text-[#d4af37]" />
            <span>Full Storefront Page &amp; Section CMS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Website Pages &amp; Sections Control Hub
          </h2>
          <p className="text-xs text-[#8fa89a] mt-0.5">
            ওয়েবসাইটের প্রতিটা সেকশন অন/অফ করুন এবং প্রতিটি সেকশনের কন্টেন্ট, মেনু, টেক্সট ও বাটন সরাসরি পরিবর্তন করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="btn-3d-gold px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-2 self-start md:self-auto shrink-0 shadow-lg"
        >
          {isSaving ? (
            <span>সংরক্ষণ হচ্ছে...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All CMS Changes (সব পরিবর্তন সেভ করুন)</span>
            </>
          )}
        </button>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveSubTab("visibility")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "visibility"
              ? "bg-[#d4af37] text-[#06110a] shadow-md"
              : "bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/5"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>১. মাস্টার সেকশন অন/অফ (Master Switch)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("navbar")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "navbar"
              ? "bg-[#d4af37] text-[#06110a] shadow-md"
              : "bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/5"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>২. নেভবার ও মেনু (Navbar)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("hero")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "hero"
              ? "bg-[#d4af37] text-[#06110a] shadow-md"
              : "bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/5"
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>৩. হিরো সেকশন (Hero Banner)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("collections")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "collections"
              ? "bg-[#d4af37] text-[#06110a] shadow-md"
              : "bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/5"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>৪. কালেকশন (Collections)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("configurator")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "configurator"
              ? "bg-[#d4af37] text-[#06110a] shadow-md"
              : "bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/5"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>৫. কাস্টম ফ্রেম বিল্ডার</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("gallery")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "gallery"
              ? "bg-[#d4af37] text-[#06110a] shadow-md"
              : "bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/5"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>৬. ফটো গ্যালারি</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("story")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "story"
              ? "bg-[#d4af37] text-[#06110a] shadow-md"
              : "bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/5"
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>৭. ব্র্যান্ড দর্শন (Story)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("faq")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "faq"
              ? "bg-[#d4af37] text-[#06110a] shadow-md"
              : "bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/5"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>৮. FAQ প্রশ্ন-উত্তর</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("testimonials")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "testimonials"
              ? "bg-[#d4af37] text-[#06110a] shadow-md"
              : "bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/5"
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>৯. কাস্টমার রিভিউ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("footer")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeSubTab === "footer"
              ? "bg-[#d4af37] text-[#06110a] shadow-md"
              : "bg-[#07160f] text-[#8fa89a] hover:text-white border border-white/5"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>১০. ফুটার ও কপিরাইট</span>
        </button>
      </div>

      {/* SUB-TAB 1: MASTER SECTION ON/OFF SWITCHBOARD */}
      {activeSubTab === "visibility" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#07160f] border border-white/10 text-xs text-[#9cb5a6] flex items-center justify-between">
            <p>
              💡 <strong>মাস্টার অন/অফ সুইচ:</strong> কোনো সেকশন বন্ধ (Hidden) করে দিলে হোমপেজে সেটি সম্পূর্ণ অদৃশ্য হয়ে যাবে। আবার অন করলেই সাথে সাথে স্বয়ংক্রিয়ভাবে লাইভ হবে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECTION_REGISTRY.map((sec) => {
              const isSectionActive = visibility[sec.key] !== false;
              const Icon = sec.icon;

              return (
                <div
                  key={sec.key}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                    isSectionActive
                      ? "bg-[#081f14] border-[#d4af37]/40 shadow-md"
                      : "bg-[#07160f]/60 border-white/5 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSectionActive
                          ? "bg-[#d4af37]/20 text-[#f4dc8a] border border-[#d4af37]/40"
                          : "bg-white/5 text-[#8fa89a]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                          {sec.nameBn}
                        </h4>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                            isSectionActive
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-white/10 text-[#8fa89a]"
                          }`}
                        >
                          {isSectionActive ? "Live সক্রিয়" : "Hidden লুকানো"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8fa89a] truncate mt-0.5">
                        {sec.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleSection(sec.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        isSectionActive ? "bg-[#d4af37]" : "bg-[#183625]"
                      }`}
                      title={isSectionActive ? "হাইড করুন" : "সক্রিয় করুন"}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isSectionActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>

                    {/* Quick jump to content editor */}
                    {sec.subTab !== "visibility" && (
                      <button
                        type="button"
                        onClick={() => setActiveSubTab(sec.subTab)}
                        className="p-1.5 rounded-lg bg-[#07160f] hover:bg-[#123623] text-[#8fa89a] hover:text-[#f4dc8a] border border-white/10 text-[10px]"
                        title="কন্টেন্ট এডিট করুন"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: NAVBAR CMS EDITOR */}
      {activeSubTab === "navbar" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#d4af37]" />
              <span>নেভবার টেক্সট ও ব্র্যান্ডিং সেটিংস</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#c4d7cc] mb-1">Brand Name (English)</label>
                <input
                  type="text"
                  value={navbarCMS.brandName}
                  onChange={(e) => updateNavbarCMS({ brandName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs text-[#c4d7cc] mb-1">Brand Name (বাংলা)</label>
                <input
                  type="text"
                  value={navbarCMS.brandNameBangla || ""}
                  onChange={(e) => updateNavbarCMS({ brandNameBangla: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs text-[#c4d7cc] mb-1">Tagline / Subtitle (English)</label>
                <input
                  type="text"
                  value={navbarCMS.tagline}
                  onChange={(e) => updateNavbarCMS({ tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-[#c4d7cc] mb-1">Tagline / Subtitle (বাংলা)</label>
                <input
                  type="text"
                  value={navbarCMS.taglineBangla || ""}
                  onChange={(e) => updateNavbarCMS({ taglineBangla: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            {/* Navbar Feature Toggles */}
            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-6 text-xs text-[#c4d7cc]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={navbarCMS.showLogo !== false}
                  onChange={(e) => updateNavbarCMS({ showLogo: e.target.checked })}
                  className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                />
                <span>নেভবারে লোগো দেখান (Show Logo)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={navbarCMS.showLanguageSwitcher !== false}
                  onChange={(e) => updateNavbarCMS({ showLanguageSwitcher: e.target.checked })}
                  className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                />
                <span>ভাষা সুইচ বাটন (EN / বাং) দেখান</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={navbarCMS.showCartButton !== false}
                  onChange={(e) => updateNavbarCMS({ showCartButton: e.target.checked })}
                  className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                />
                <span>শপিং কার্ট আইকন বাটন দেখান</span>
              </label>
            </div>
          </div>

          {/* Navigation Menu Items Manager */}
          <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-[#d4af37]" />
                  <span>নেভবার মেনু আইটেম ম্যানেজার (Navigation Links)</span>
                </h3>
                <p className="text-[11px] text-[#8fa89a]">
                  মেনু আইটেম যুক্ত করুন, নাম পরিবর্তন করুন বা যেকোনো লিঙ্কের দৃশ্যমানতা বন্ধ করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = `menu-${Date.now()}`;
                  const newItems: NavMenuItem[] = [
                    ...navbarCMS.menuItems,
                    {
                      id: newId,
                      label: "New Link",
                      labelBangla: "নতুন লিঙ্ক",
                      url: "#",
                      isActive: true,
                    },
                  ];
                  updateNavbarCMS({ menuItems: newItems });
                }}
                className="btn-3d-gold px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ মেনু লিঙ্ক যোগ করুন</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {navbarCMS.menuItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#0a1e14] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1">
                    <div>
                      <label className="block text-[10px] text-[#8fa89a] mb-0.5">Label (English)</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...navbarCMS.menuItems];
                          updated[idx].label = e.target.value;
                          updateNavbarCMS({ menuItems: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#8fa89a] mb-0.5">Label (বাংলা)</label>
                      <input
                        type="text"
                        value={item.labelBangla || ""}
                        onChange={(e) => {
                          const updated = [...navbarCMS.menuItems];
                          updated[idx].labelBangla = e.target.value;
                          updateNavbarCMS({ menuItems: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#8fa89a] mb-0.5">Link URL (#section বা /page)</label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => {
                          const updated = [...navbarCMS.menuItems];
                          updated[idx].url = e.target.value;
                          updateNavbarCMS({ menuItems: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                    <label className="flex items-center gap-1.5 text-xs text-[#c4d7cc] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(e) => {
                          const updated = [...navbarCMS.menuItems];
                          updated[idx].isActive = e.target.checked;
                          updateNavbarCMS({ menuItems: updated });
                        }}
                        className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                      />
                      <span>Active</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = navbarCMS.menuItems.filter((m) => m.id !== item.id);
                        updateNavbarCMS({ menuItems: updated });
                      }}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/20"
                      title="ডিলিট করুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: HERO SECTION CMS EDITOR */}
      {activeSubTab === "hero" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layout className="w-4 h-4 text-[#d4af37]" />
              <span>হিরো ব্যানার হেডলাইন ও টেক্সট কন্টেন্ট</span>
            </h3>

            {/* Eyebrow */}
            <div className="p-4 rounded-xl bg-[#0b1f14] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">উপরে ছোট সাবটাইটেল (Eyebrow Badge)</span>
                <label className="flex items-center gap-1.5 text-xs text-[#c4d7cc] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={heroCMS.showEyebrow !== false}
                    onChange={(e) => updateHeroCMS({ showEyebrow: e.target.checked })}
                    className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                  />
                  <span>Show Badge</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="English Eyebrow"
                  value={heroCMS.eyebrow}
                  onChange={(e) => updateHeroCMS({ eyebrow: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs font-semibold"
                />
                <input
                  type="text"
                  placeholder="বাংলা সাবটাইটেল"
                  value={heroCMS.eyebrowBangla || ""}
                  onChange={(e) => updateHeroCMS({ eyebrowBangla: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            {/* Headline 1 & 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs text-[#c4d7cc] font-semibold">
                  Headline Line 1 (মূল শিরোনাম প্রথম লাইন)
                </label>
                <input
                  type="text"
                  placeholder="English"
                  value={heroCMS.headline1}
                  onChange={(e) => updateHeroCMS({ headline1: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="বাংলা"
                  value={heroCMS.headline1Bangla || ""}
                  onChange={(e) => updateHeroCMS({ headline1Bangla: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-[#c4d7cc] font-semibold">
                  Headline Line 2 (সোনালী গ্লো অংশ)
                </label>
                <input
                  type="text"
                  placeholder="English"
                  value={heroCMS.headline2}
                  onChange={(e) => updateHeroCMS({ headline2: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold text-[#fceb9e]"
                />
                <input
                  type="text"
                  placeholder="বাংলা"
                  value={heroCMS.headline2Bangla || ""}
                  onChange={(e) => updateHeroCMS({ headline2Bangla: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-xs text-[#c4d7cc] font-semibold">
                Hero Sub-headline / Description Paragraph
              </label>
              <textarea
                rows={2}
                placeholder="English Description"
                value={heroCMS.description}
                onChange={(e) => updateHeroCMS({ description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs leading-relaxed"
              />
              <textarea
                rows={2}
                placeholder="বাংলা বিবরণ"
                value={heroCMS.descriptionBangla || ""}
                onChange={(e) => updateHeroCMS({ descriptionBangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Action Buttons Editor */}
          <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>হিরো সেকশনের অ্যাকশন বাটন কন্ট্রোল</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Button */}
              <div className="p-4 rounded-xl bg-[#0b1f14] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f4dc8a]">প্রাইমারি বাটন (Gold Button)</span>
                  <label className="flex items-center gap-1.5 text-xs text-[#c4d7cc] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroCMS.showPrimaryBtn !== false}
                      onChange={(e) => updateHeroCMS({ showPrimaryBtn: e.target.checked })}
                      className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                    />
                    <span>Show</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Button Text (EN)"
                    value={heroCMS.primaryBtnText}
                    onChange={(e) => updateHeroCMS({ primaryBtnText: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs font-bold"
                  />
                  <input
                    type="text"
                    placeholder="বাটন টেক্সট (বাংলা)"
                    value={heroCMS.primaryBtnTextBangla || ""}
                    onChange={(e) => updateHeroCMS({ primaryBtnTextBangla: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Link URL (e.g. #collections)"
                    value={heroCMS.primaryBtnUrl}
                    onChange={(e) => updateHeroCMS({ primaryBtnUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Secondary Button */}
              <div className="p-4 rounded-xl bg-[#0b1f14] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#c4d7cc]">সেকেন্ডারি বাটন (Dark Bevel Button)</span>
                  <label className="flex items-center gap-1.5 text-xs text-[#c4d7cc] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroCMS.showSecondaryBtn !== false}
                      onChange={(e) => updateHeroCMS({ showSecondaryBtn: e.target.checked })}
                      className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                    />
                    <span>Show</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Button Text (EN)"
                    value={heroCMS.secondaryBtnText}
                    onChange={(e) => updateHeroCMS({ secondaryBtnText: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs font-bold"
                  />
                  <input
                    type="text"
                    placeholder="বাটন টেক্সট (বাংলা)"
                    value={heroCMS.secondaryBtnTextBangla || ""}
                    onChange={(e) => updateHeroCMS({ secondaryBtnTextBangla: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Link URL (e.g. #custom-commission)"
                    value={heroCMS.secondaryBtnUrl}
                    onChange={(e) => updateHeroCMS({ secondaryBtnUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Hero Carousel Toggle */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#c4d7cc]">
              <span>হিরো সেকশনের আর্টওয়ার্ক স্লাইডার / মার্কি ক্যারোজেল দেখান:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={heroCMS.showCarousel !== false}
                  onChange={(e) => updateHeroCMS({ showCarousel: e.target.checked })}
                  className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                />
                <span>স্লাইডার সক্রিয় (Show Carousel)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: COLLECTIONS CMS EDITOR */}
      {activeSubTab === "collections" && (
        <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#d4af37]" />
            <span>আর্ট কালেকশন সেকশন হেডার ও কন্ট্রোল</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Section Title (English)</label>
              <input
                type="text"
                value={collectionsCMS.title}
                onChange={(e) => updateCollectionsCMS({ title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Section Title (বাংলা)</label>
              <input
                type="text"
                value={collectionsCMS.titleBangla || ""}
                onChange={(e) => updateCollectionsCMS({ titleBangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Subtitle / Description (English)</label>
              <textarea
                rows={2}
                value={collectionsCMS.subtitle}
                onChange={(e) => updateCollectionsCMS({ subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Subtitle / Description (বাংলা)</label>
              <textarea
                rows={2}
                value={collectionsCMS.subtitleBangla || ""}
                onChange={(e) => updateCollectionsCMS({ subtitleBangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-6 text-xs text-[#c4d7cc]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={collectionsCMS.showCategoryFilters !== false}
                onChange={(e) => updateCollectionsCMS({ showCategoryFilters: e.target.checked })}
                className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
              />
              <span>ক্যাটাগরি ফিল্টার ট্যাব দেখান (All, Calligraphy, Canvas...)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={collectionsCMS.showSearchBar !== false}
                onChange={(e) => updateCollectionsCMS({ showSearchBar: e.target.checked })}
                className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
              />
              <span>আর্টওয়ার্ক সার্চ বক্স দেখান</span>
            </label>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CUSTOM CONFIGURATOR CMS EDITOR */}
      {activeSubTab === "configurator" && (
        <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#d4af37]" />
            <span>কাস্টম ইসলামিক ক্যানভাস বিল্ডার হেডার</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Section Title (English)</label>
              <input
                type="text"
                value={configuratorCMS.title}
                onChange={(e) => updateConfiguratorCMS({ title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Section Title (বাংলা)</label>
              <input
                type="text"
                value={configuratorCMS.titleBangla || ""}
                onChange={(e) => updateConfiguratorCMS({ titleBangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Subtitle / Description (English)</label>
              <textarea
                rows={2}
                value={configuratorCMS.subtitle}
                onChange={(e) => updateConfiguratorCMS({ subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Subtitle / Description (বাংলা)</label>
              <textarea
                rows={2}
                value={configuratorCMS.subtitleBangla || ""}
                onChange={(e) => updateConfiguratorCMS({ subtitleBangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: GALLERY LIGHTBOX CMS EDITOR */}
      {activeSubTab === "gallery" && (
        <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#d4af37]" />
            <span>ফটো গ্যালারি ও লাইটবক্স হেডার</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Section Title (English)</label>
              <input
                type="text"
                value={galleryCMS.title}
                onChange={(e) => updateGalleryCMS({ title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Section Title (বাংলা)</label>
              <input
                type="text"
                value={galleryCMS.titleBangla || ""}
                onChange={(e) => updateGalleryCMS({ titleBangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Subtitle / Description (English)</label>
              <textarea
                rows={2}
                value={galleryCMS.subtitle}
                onChange={(e) => updateGalleryCMS({ subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Subtitle / Description (বাংলা)</label>
              <textarea
                rows={2}
                value={galleryCMS.subtitleBangla || ""}
                onChange={(e) => updateGalleryCMS({ subtitleBangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center gap-6 text-xs text-[#c4d7cc]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={galleryCMS.showTabs !== false}
                onChange={(e) => updateGalleryCMS({ showTabs: e.target.checked })}
                className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
              />
              <span>গ্যালারি ক্যাটাগরি ফিল্টার ট্যাব দেখান</span>
            </label>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: BRAND STORY CMS EDITOR */}
      {activeSubTab === "story" && (
        <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-[#d4af37]" />
            <span>ব্র্যান্ড দর্শন ও তাৎপর্য (Philosophy &amp; Story)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Story Main Heading (English)</label>
              <input
                type="text"
                value={storyCMS.title}
                onChange={(e) => updateStoryCMS({ title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Story Main Heading (বাংলা)</label>
              <input
                type="text"
                value={storyCMS.titleBangla || ""}
                onChange={(e) => updateStoryCMS({ titleBangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Paragraph 1 (English)</label>
              <textarea
                rows={3}
                value={storyCMS.paragraph1}
                onChange={(e) => updateStoryCMS({ paragraph1: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Paragraph 1 (বাংলা)</label>
              <textarea
                rows={3}
                value={storyCMS.paragraph1Bangla || ""}
                onChange={(e) => updateStoryCMS({ paragraph1Bangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Paragraph 2 (English)</label>
              <textarea
                rows={3}
                value={storyCMS.paragraph2}
                onChange={(e) => updateStoryCMS({ paragraph2: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Paragraph 2 (বাংলা)</label>
              <textarea
                rows={3}
                value={storyCMS.paragraph2Bangla || ""}
                onChange={(e) => updateStoryCMS({ paragraph2Bangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: FAQ CMS EDITOR */}
      {activeSubTab === "faq" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#d4af37]" />
              <span>FAQ সেকশন শিরোনাম ও সাবটাইটেল</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#c4d7cc] mb-1">FAQ Section Title (English)</label>
                <input
                  type="text"
                  value={faqCMS.title}
                  onChange={(e) => updateFaqCMS({ title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs text-[#c4d7cc] mb-1">FAQ Section Title (বাংলা)</label>
                <input
                  type="text"
                  value={faqCMS.titleBangla || ""}
                  onChange={(e) => updateFaqCMS({ titleBangla: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs text-[#c4d7cc] mb-1">FAQ Subtitle (English)</label>
                <input
                  type="text"
                  value={faqCMS.subtitle}
                  onChange={(e) => updateFaqCMS({ subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-[#c4d7cc] mb-1">FAQ Subtitle (বাংলা)</label>
                <input
                  type="text"
                  value={faqCMS.subtitleBangla || ""}
                  onChange={(e) => updateFaqCMS({ subtitleBangla: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Q&A Items List Manager */}
          <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                  <span>প্রশ্ন ও উত্তর তালিকা ({faqCMS.items.length} টি)</span>
                </h3>
                <p className="text-[11px] text-[#8fa89a]">
                  সরাসরি নতুন প্রশ্ন-উত্তর যোগ করুন, এডিট করুন বা অপ্রয়োজনীয় প্রশ্ন মুছে ফেলুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newFaq: FAQItemCMS = {
                    id: `faq-${Date.now()}`,
                    question: "New Question?",
                    questionBangla: "নতুন প্রশ্ন?",
                    answer: "Answer details here...",
                    answerBangla: "উত্তর এখানে লিখুন...",
                    isActive: true,
                  };
                  updateFaqCMS({ items: [newFaq, ...faqCMS.items] });
                }}
                className="btn-3d-gold px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন প্রশ্ন-উত্তর যোগ করুন</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqCMS.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#0a1e14] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-[#f4dc8a]">প্রশ্ন #{idx + 1}</span>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-[#c4d7cc] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={(e) => {
                            const updated = [...faqCMS.items];
                            updated[idx].isActive = e.target.checked;
                            updateFaqCMS({ items: updated });
                          }}
                          className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
                        />
                        <span>Active</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = faqCMS.items.filter((f) => f.id !== item.id);
                          updateFaqCMS({ items: updated });
                        }}
                        className="p-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/20"
                        title="ডিলিট"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#8fa89a] mb-0.5">Question (English)</label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => {
                          const updated = [...faqCMS.items];
                          updated[idx].question = e.target.value;
                          updateFaqCMS({ items: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#8fa89a] mb-0.5">প্রশ্ন (বাংলা)</label>
                      <input
                        type="text"
                        value={item.questionBangla || ""}
                        onChange={(e) => {
                          const updated = [...faqCMS.items];
                          updated[idx].questionBangla = e.target.value;
                          updateFaqCMS({ items: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#8fa89a] mb-0.5">Answer (English)</label>
                      <textarea
                        rows={2}
                        value={item.answer}
                        onChange={(e) => {
                          const updated = [...faqCMS.items];
                          updated[idx].answer = e.target.value;
                          updateFaqCMS({ items: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#8fa89a] mb-0.5">উত্তর (বাংলা)</label>
                      <textarea
                        rows={2}
                        value={item.answerBangla || ""}
                        onChange={(e) => {
                          const updated = [...faqCMS.items];
                          updated[idx].answerBangla = e.target.value;
                          updateFaqCMS({ items: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#07160f] border border-white/10 text-white text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 9: TESTIMONIALS CMS EDITOR */}
      {activeSubTab === "testimonials" && (
        <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-[#d4af37]" />
            <span>কাস্টমার রিভিউ সেকশন হেডার</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Section Title (English)</label>
              <input
                type="text"
                value={testimonialsCMS.title}
                onChange={(e) => updateTestimonialsCMS({ title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Section Title (বাংলা)</label>
              <input
                type="text"
                value={testimonialsCMS.titleBangla || ""}
                onChange={(e) => updateTestimonialsCMS({ titleBangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Subtitle / Description (English)</label>
              <input
                type="text"
                value={testimonialsCMS.subtitle}
                onChange={(e) => updateTestimonialsCMS({ subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">Subtitle / Description (বাংলা)</label>
              <input
                type="text"
                value={testimonialsCMS.subtitleBangla || ""}
                onChange={(e) => updateTestimonialsCMS({ subtitleBangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 10: FOOTER CMS EDITOR */}
      {activeSubTab === "footer" && (
        <div className="p-5 rounded-2xl bg-[#07160f] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#d4af37]" />
            <span>ফুটার ডেসক্রিপশন, কপিরাইট ও বাটন</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">About Bio / Description (English)</label>
              <textarea
                rows={3}
                value={footerCMS.aboutText}
                onChange={(e) => updateFooterCMS({ aboutText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs text-[#c4d7cc] mb-1">About Bio / Description (বাংলা)</label>
              <textarea
                rows={3}
                value={footerCMS.aboutTextBangla || ""}
                onChange={(e) => updateFooterCMS({ aboutTextBangla: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs leading-relaxed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#c4d7cc] mb-1">Copyright Line Text</label>
            <input
              type="text"
              value={footerCMS.copyrightText}
              onChange={(e) => updateFooterCMS({ copyrightText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0b1f14] border border-white/10 text-white text-xs font-mono"
            />
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center gap-6 text-xs text-[#c4d7cc]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={footerCMS.showFacebookButton !== false}
                onChange={(e) => updateFooterCMS({ showFacebookButton: e.target.checked })}
                className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
              />
              <span>Facebook Page বাটন দেখান</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={footerCMS.showWhatsAppButton !== false}
                onChange={(e) => updateFooterCMS({ showWhatsAppButton: e.target.checked })}
                className="rounded bg-[#07160f] border-white/20 text-[#d4af37]"
              />
              <span>WhatsApp বাটন দেখান</span>
            </label>
          </div>
        </div>
      )}

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-end pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="btn-3d-gold px-8 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xl"
        >
          {isSaving ? (
            <span>সংরক্ষণ হচ্ছে...</span>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save All CMS Changes (সব পরিবর্তন সেভ করুন)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

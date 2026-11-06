"use client";

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  Sparkles,
  Palette,
  Check,
  Send,
  MessageCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Layers,
} from "lucide-react";

interface SizeOption {
  label: string;
  dimensions: string;
  basePrice: number;
  popular?: boolean;
}

const SIZE_OPTIONS: SizeOption[] = [
  { label: "Intimate / Tabletop", dimensions: '12" x 16"', basePrice: 1800 },
  { label: "Standard Living", dimensions: '18" x 24"', basePrice: 2800, popular: true },
  { label: "Grand Living", dimensions: '24" x 36"', basePrice: 4200, popular: true },
  { label: "Panoramic Statement", dimensions: '30" x 40"', basePrice: 5900 },
  { label: "Royal Over-Sofa", dimensions: '36" x 48"', basePrice: 7800 },
];

const FRAME_OPTIONS = [
  {
    id: "gold-floating",
    name: "Floating Antique Gold Frame",
    extra: 800,
    desc: "Luxury floating shadow-box frame with antique brushed gold edge",
  },
  {
    id: "black-sleek",
    name: "Sleek Obsidian Black Frame",
    extra: 600,
    desc: "Minimalist modern matte black frame (Linear style)",
  },
  {
    id: "natural-teak",
    name: "Natural Teak / Walnut Wood",
    extra: 750,
    desc: "Warm organic hardwood frame with clear satin finish",
  },
  {
    id: "frameless",
    name: "Frameless Gallery Wrap",
    extra: 0,
    desc: "1.5-inch deep painted borders ready to hang directly",
  },
];

const ART_STYLES = [
  {
    id: "ayatul-kursi",
    name: "Ayat al-Kursi (Master Verse)",
    desc: "Classical Thuluth or modern Jali script with 24K imitation gold leaf",
  },
  {
    id: "4-qul",
    name: "4 Qul Sacred Protection Set",
    desc: "Surah Al-Ikhlas, Al-Falaq, An-Nas & Al-Kafirun in harmonious geometry",
  },
  {
    id: "surah-rahman",
    name: "Surah Ar-Rahman Key Verses",
    desc: "Fabiayyi Ala-i Rabbikuma Tukaththiban with radiant gold textures",
  },
  {
    id: "custom-names",
    name: "Couple / Family Names & Dua",
    desc: "Custom Arabic lettering of your names with anniversary/wedding dua",
  },
  {
    id: "custom-verse",
    name: "Client's Choice Quranic Verse",
    desc: "Any ayah, hadith, or spiritual poetry of your preference",
  },
];

export const CustomConfigurator: React.FC = () => {
  const { createInquiry, showToast, settings } = useStore();

  const [selectedStyle, setSelectedStyle] = useState(ART_STYLES[0].name);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(SIZE_OPTIONS[1]);
  const [selectedFrame, setSelectedFrame] = useState(FRAME_OPTIONS[0]);
  const [customText, setCustomText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculate dynamic price
  const estimatedTotal = selectedSize.basePrice + selectedFrame.extra;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      showToast("Please provide your name and phone number.", "error");
      return;
    }

    setIsSubmitting(true);
    createInquiry({
      customerName,
      phone: customerPhone,
      artType: selectedStyle,
      customVerseOrText: customText || selectedStyle,
      canvasSize: selectedSize.dimensions,
      frameType: selectedFrame.name,
      estimatedPrice: estimatedTotal,
      notes: customerNotes,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    showToast(
      "Your custom commission inquiry has been received! We will reach out shortly."
    );
  };

  const getWhatsAppLink = () => {
    const text = `Assalamu Alaikum! I would like to commission custom artwork from Tiyana's Sukoon:
- Art Style: ${selectedStyle}
- Verse / Names: ${customText || selectedStyle}
- Dimensions: ${selectedSize.dimensions} (${selectedSize.label})
- Frame Choice: ${selectedFrame.name}
- Estimated Total: ৳${estimatedTotal.toLocaleString()} BDT
- Name: ${customerName || "Customer"}
- Phone: ${customerPhone || "N/A"}
${customerNotes ? `- Notes: ${customerNotes}` : ""}`;

    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="custom-commission" className="py-20 bg-[#07150e] relative linear-grid-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d2218] border border-[#d4af37]/40 text-xs font-semibold text-[#f4dc8a]">
            <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Interactive Bespoke Commission Builder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Design Your Custom Islamic Canvas
          </h2>
          <p className="text-[#9cb5a6] text-sm">
            Select your preferred verse, canvas dimensions, and framing finish.
            Get an instant estimate and commission our master calligrapher directly.
          </p>
        </div>

        {/* Configurator Box (Linear Card Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: 3 Interactive Steps */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Artwork Theme */}
            <div className="linear-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#08150d] text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-bold text-white text-base">
                    Choose Art Type &amp; Script Theme
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#f4dc8a]">Step 1 of 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {ART_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.name)}
                    className={`text-left p-3.5 rounded-xl border transition-all text-xs ${
                      selectedStyle === style.name
                        ? "bg-[#10291c] border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                        : "bg-[#091910] border-white/5 text-[#9cb5a6] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm mb-1 text-white">
                      <span>{style.name}</span>
                      {selectedStyle === style.name && (
                        <Check className="w-4 h-4 text-[#d4af37]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#8fa89a] leading-relaxed">
                      {style.desc}
                    </p>
                  </button>
                ))}
              </div>

              {/* Custom text input */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-[#c4d7cc] mb-1.5">
                  Specific Ayah, Names, or Translation to Include (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g., Ayatul Kursi, or 'Farhan & Sadia - 12.11.2024'"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08170f] border border-white/10 text-white placeholder-[#687f71] text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Step 2: Canvas Size */}
            <div className="linear-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#08150d] text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-white text-base">
                    Select Canvas Dimensions
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#f4dc8a]">Step 2 of 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size.dimensions}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`text-left p-3.5 rounded-xl border transition-all text-xs relative ${
                      selectedSize.dimensions === size.dimensions
                        ? "bg-[#10291c] border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                        : "bg-[#091910] border-white/5 text-[#9cb5a6] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {size.popular && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#d4af37] text-[#08150d]">
                        POPULAR
                      </span>
                    )}
                    <p className="font-bold text-sm text-white">{size.dimensions}</p>
                    <p className="text-[11px] text-[#8fa89a]">{size.label}</p>
                    <p className="mt-2 text-xs font-bold text-[#fceb9e]">
                      ৳{size.basePrice.toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Framing Option */}
            <div className="linear-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#08150d] text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-bold text-white text-base">
                    Choose Luxury Framing Style
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#f4dc8a]">Step 3 of 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {FRAME_OPTIONS.map((frame) => (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => setSelectedFrame(frame)}
                    className={`text-left p-3.5 rounded-xl border transition-all text-xs ${
                      selectedFrame.id === frame.id
                        ? "bg-[#10291c] border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                        : "bg-[#091910] border-white/5 text-[#9cb5a6] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm mb-1 text-white">
                      <span>{frame.name}</span>
                      <span className="text-xs text-[#fceb9e]">
                        {frame.extra > 0 ? `+৳${frame.extra}` : "Included"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8fa89a] leading-relaxed">
                      {frame.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary & Checkout Box */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="linear-card p-6 rounded-2xl space-y-6 border border-[#d4af37]/30 shadow-2xl">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#d4af37]">
                  Instant Live Quotation
                </span>
                <h3 className="text-xl font-bold text-white">Commission Summary</h3>
              </div>

              {/* Selected Options Breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#8fa89a]">Art Script Theme</span>
                  <span className="font-semibold text-white text-right max-w-[200px] truncate">
                    {selectedStyle}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#8fa89a]">Canvas Size</span>
                  <span className="font-semibold text-white">
                    {selectedSize.dimensions} ({selectedSize.label})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#8fa89a]">Frame Finish</span>
                  <span className="font-semibold text-white">
                    {selectedFrame.name}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#8fa89a]">Gold Leaf Quality</span>
                  <span className="font-semibold text-[#f4dc8a]">
                    24K Genuine Imitation Leaf
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#8fa89a]">Estimated Completion</span>
                  <span className="font-semibold text-emerald-400">
                    5 - 8 Business Days
                  </span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-[#091b11] p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-[#c4d7cc]">
                    Estimated Total:
                  </span>
                  <span className="text-2xl font-extrabold text-[#fceb9e]">
                    ৳{estimatedTotal.toLocaleString()} BDT
                  </span>
                </div>
                <p className="text-[10px] text-[#8fa89a]">
                  Includes hand-painting, gold gilding, framing, and bubble packaging.
                </p>
              </div>

              {/* Client Contact Inputs */}
              {isSubmitted ? (
                <div className="bg-[#0a2315] p-5 rounded-xl border border-emerald-500/40 text-center space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    Inquiry Received by Studio!
                  </h4>
                  <p className="text-xs text-[#9cb5a6]">
                    Our artist will call you at{" "}
                    <span className="text-white font-mono">{customerPhone}</span> to
                    confirm calligraphy script details and sample layout.
                  </p>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-3d-emerald py-2.5 text-xs inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send details to WhatsApp</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#9cb5a6] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanzila Rahman"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#08170f] border border-white/10 text-white text-xs placeholder-[#687f71] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9cb5a6] mb-1">
                      Phone Number (for WhatsApp/Confirmation) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#08170f] border border-white/10 text-white text-xs placeholder-[#687f71] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9cb5a6] mb-1">
                      Special Requests / Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Anniversary gift needed before 15th, please add couple names in gold..."
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#08170f] border border-white/10 text-white text-xs placeholder-[#687f71] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  {/* 3D Action Buttons */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-3d-gold py-3 text-xs tracking-wider uppercase font-bold"
                    >
                      <Send className="w-3.5 h-3.5 text-[#0f1811]" />
                      <span>{isSubmitting ? "Submitting..." : "Submit Custom Commission"}</span>
                    </button>

                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-3d-emerald py-2.5 text-xs text-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Instant WhatsApp Discussion</span>
                    </a>
                  </div>
                </form>
              )}

              {/* Guarantees */}
              <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] text-[#8fa89a]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Breakage Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>On-time Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

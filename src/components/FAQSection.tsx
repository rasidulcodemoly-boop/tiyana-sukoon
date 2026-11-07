"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "How long does custom calligraphy take to complete?",
    a: "Standard ready-in-studio pieces ship within 24–48 hours. Custom calligraphy commissions (such as personalized names or specific Quranic surahs) typically take 5 to 8 business days for layout sketching, hand-painting, gold foil application, and precision framing.",
  },
  {
    q: "Is the gold real, and will it tarnish or fade over time?",
    a: "We use premium 24K genuine imitation gilding leaf and German metallic pigments. Every completed artwork is treated with an archival UV-filtering gloss varnish that protects the gold leaf from oxidation, moisture, and sunlight fading for decades.",
  },
  {
    q: "How do you package artworks for delivery outside Dhaka?",
    a: "We understand that framed canvases are delicate. Each piece is wrapped in bubble film, fitted with hard compressed foam corner protectors, and encased in rigid reinforced cardboard boxes. For large panoramic canvases over 36 inches, we utilize wooden framing crates.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery (COD) inside Dhaka for ready artworks. For custom commissioned pieces and deliveries outside Dhaka, we accept bKash (Merchant / Personal), Nagad, and direct bank transfers. A 30% advance is required to initiate custom hand-lettered orders.",
  },
  {
    q: "How should I clean and care for my canvas painting?",
    a: "Never use wet cloths or chemical cleaning solutions. Simply use a soft, dry micro-fiber cloth or a natural feather duster to gently wipe dust off the canvas surface and frame edges.",
  },
  {
    q: "Can I request specific Arabic fonts like Thuluth, Diwani, or Kufic?",
    a: "Yes! Our calligrapher is trained in classical Thuluth, elegant flowing Diwani, modern Jali Diwani, and geometric square Kufic. You can mention your desired script in the Custom Commission Builder or via WhatsApp.",
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-20 bg-[#07150e] relative linear-grid">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[#9cb5a6] text-sm">
            Everything you need to know about commissions, framing, delivery safety, and artwork preservation.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="linear-card rounded-xl overflow-hidden border border-white/5 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-white hover:text-[#f4dc8a] transition-colors"
                >
                  <span className="font-bold text-sm tracking-wide">
                    {faq.q}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full bg-[#0b1f14] flex items-center justify-center shrink-0 border border-white/10 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#d4af37] text-[#06110a]" : "text-[#8fa89a]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#9cb5a6] leading-relaxed border-t border-white/5 bg-[#06120b]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

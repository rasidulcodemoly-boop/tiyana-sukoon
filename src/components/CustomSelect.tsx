"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button with Luxury Theme Styling */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 rounded-lg bg-[#07160f] border text-left flex items-center justify-between transition-all duration-200 outline-none select-none ${
          isOpen
            ? "border-[#d4af37] ring-1 ring-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            : "border-white/10 hover:border-[#d4af37]/40"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 text-[#d4af37]">
              {selectedOption.icon}
            </span>
          )}
          <span
            className={`truncate text-xs sm:text-sm font-medium ${
              selectedOption ? "text-[#f4f8f5]" : "text-[#6b8275]"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#0c2417] text-[#f4dc8a] border border-[#d4af37]/30">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#d4af37] shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#f4dc8a]" : "opacity-80"
          }`}
        />
      </button>

      {/* Floating Dropdown Menu with Emerald-Gold Luxury Glass Theme */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[#06150e] border border-[#d4af37]/40 shadow-[0_15px_35px_rgba(0,0,0,0.9)] backdrop-blur-md overflow-hidden py-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#d4af37]/30 animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-3 py-2 text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-colors duration-150 select-none ${
                  isSelected
                    ? "bg-[#0f2e1e] text-[#f4dc8a] font-bold"
                    : "text-[#c4d7cc] hover:bg-[#0b2417] hover:text-[#fceb9e]"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && (
                    <span className="shrink-0 text-[#d4af37]">{opt.icon}</span>
                  )}
                  <span className="truncate">{opt.label}</span>
                  {opt.badge && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#07160f] text-[#8fa89a] border border-white/10">
                      {opt.badge}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-[#d4af37] shrink-0 ml-2 animate-in fade-in" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

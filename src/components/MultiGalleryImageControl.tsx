"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { getSupabase } from "../lib/supabase";
import {
  Upload,
  Link as LinkIcon,
  Grid,
  Check,
  Loader2,
  FileImage,
  Sparkles,
  X,
  Trash2,
  FolderUp,
} from "lucide-react";

export interface PresetItem {
  id: number;
  path: string;
  label: string;
}

export interface MultiGalleryImageControlProps {
  images: string[];
  onChange: (updatedImages: string[]) => void;
  presets?: PresetItem[];
  label?: string;
}

export const MultiGalleryImageControl: React.FC<MultiGalleryImageControlProps> = ({
  images = [],
  onChange,
  presets = [],
  label = "গ্যালারি অতিরিক্ত ইমেজসমূহ (Multiple Gallery Images)",
}) => {
  type Mode = "upload" | "url" | "presets";
  const [activeMode, setActiveMode] = useState<Mode>("upload");
  const [inputUrl, setInputUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Single file uploader with triple-tier redundancy
  const uploadSingleFile = async (file: File): Promise<string> => {
    // 1. Supabase Cloud Storage
    const supabase = getSupabase();
    if (supabase) {
      const cleanName = file.name
        ? file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        : "gallery_art.jpg";
      const cloudFileName = `gallery_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}_${cleanName}`;
      try {
        const { data, error } = await supabase.storage
          .from("artwork-uploads")
          .upload(cloudFileName, file, { cacheControl: "3600", upsert: true });

        if (!error && data) {
          const { data: pubData } = supabase.storage
            .from("artwork-uploads")
            .getPublicUrl(cloudFileName);
          if (pubData?.publicUrl) return pubData.publicUrl;
        }
      } catch (err) {
        console.warn("Supabase storage upload failed, trying local API:", err);
      }
    }

    // 2. Local Next.js API upload
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) return data.url;
      }
    } catch (err) {
      console.warn("Local API upload failed, using FileReader fallback:", err);
    }

    // 3. Guaranteed FileReader Base64 fallback
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle batch of multiple files from drop or file dialog
  const handleBatchFiles = async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );
    if (filesArray.length === 0) {
      alert("অনুগ্রহ করে ইমেজ ফাইল (JPG, PNG, WebP) সিলেক্ট করুন।");
      return;
    }

    setIsUploading(true);
    setUploadStatus(`আপলোড শুরু হচ্ছে (${filesArray.length}টি ছবি)...`);

    const newUrls: string[] = [];
    for (let i = 0; i < filesArray.length; i++) {
      setUploadStatus(
        `আপলোড হচ্ছে: ${i + 1} / ${filesArray.length} (${filesArray[i].name})...`
      );
      try {
        const url = await uploadSingleFile(filesArray[i]);
        if (url) newUrls.push(url);
      } catch (err) {
        console.error("Failed to upload file:", filesArray[i].name, err);
      }
    }

    const updated = [...images, ...newUrls];
    onChange(updated);
    setIsUploading(false);
    setUploadStatus(`সফলভাবে ${newUrls.length}টি ছবি গ্যালারিতে যোগ হয়েছে! ✓`);
    setTimeout(() => setUploadStatus(null), 3500);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleBatchFiles(e.dataTransfer.files);
    }
  };

  // Remove single image
  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  // Add from URL input
  const handleAddUrl = () => {
    if (!inputUrl.trim()) return;
    onChange([...images, inputUrl.trim()]);
    setInputUrl("");
  };

  // Add from Preset
  const handleAddPreset = (presetPath: string) => {
    if (!images.includes(presetPath)) {
      onChange([...images, presetPath]);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-[#07160f] border border-[#d4af37]/30 space-y-4 shadow-lg">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <h4 className="text-xs font-bold text-[#f4dc8a]">{label}</h4>
          </div>
          <p className="text-[11px] text-[#8fa89a] mt-0.5">
            ডিটেইল পেজে বড় ছবির নিচে থাম্বনেইল হিসেবে শো হবে। বিভিন্ন অ্যাঙ্গেল বা রুম ডেকোর ফটো যোগ করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] font-mono text-[#d4af37] bg-[#11271b] px-2.5 py-1 rounded-md border border-[#d4af37]/35 shadow-sm">
            {images.length} টি ছবি যুক্ত আছে
          </span>

          {images.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="px-2 py-1 rounded-md bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-500/30 text-[10px] flex items-center gap-1 transition-all"
              title="সব গ্যালারি ছবি মুছে ফেলুন"
            >
              <Trash2 className="w-3 h-3" />
              <span>সব মুছুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Gallery Thumbnails Strip */}
      {images.length > 0 && (
        <div className="p-3 rounded-xl bg-[#040e08] border border-white/10 space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#8fa89a]">
            বর্তমান গ্যালারি স্লাইডসমূহ ({images.length}):
          </p>
          <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto custom-scrollbar p-1">
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-white/20 hover:border-[#d4af37] transition-all bg-[#07150d] shadow-md"
              >
                <Image
                  src={imgUrl}
                  alt={`Gallery Image ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />

                {/* Index tag */}
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-black/75 text-[#f4dc8a]">
                  #{idx + 1}
                </span>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-sm"
                  title="Remove this photo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode Switcher Buttons */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#040e08] border border-white/10">
        <button
          type="button"
          onClick={() => setActiveMode("upload")}
          className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeMode === "upload"
              ? "bg-[#163825] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
              : "text-[#8fa89a] hover:text-white"
          }`}
        >
          <FolderUp className="w-3.5 h-3.5" />
          <span>লোকাল ফাইল ড্রাগ / আপলোড</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("url")}
          className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeMode === "url"
              ? "bg-[#163825] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
              : "text-[#8fa89a] hover:text-white"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>ছবির লিঙ্ক (URL)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("presets")}
          className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeMode === "presets"
              ? "bg-[#163825] text-[#f4dc8a] border border-[#d4af37]/40 shadow-sm"
              : "text-[#8fa89a] hover:text-white"
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>স্টুডিও ফটো ({presets.length})</span>
        </button>
      </div>

      {/* MODE 1: LOCAL MULTI-FILE DRAG & DROP ZONE */}
      {activeMode === "upload" && (
        <div className="space-y-2.5">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleBatchFiles(e.target.files);
                e.target.value = "";
              }
            }}
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
              dragActive
                ? "border-[#d4af37] bg-[#112a1b] scale-[1.01] shadow-xl"
                : "border-white/20 bg-[#05110a] hover:border-[#d4af37]/60 hover:bg-[#07160f]"
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div
                className={`p-3 rounded-full transition-transform ${
                  dragActive
                    ? "bg-[#d4af37] text-emerald-950 scale-110"
                    : "bg-[#0c2417] text-[#f4dc8a]"
                }`}
              >
                <Upload className="w-5 h-5" />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  একসাথে একাধিক ছবি টেনে এনে এখানে ড্রপ করুন অথবা ক্লিক করুন
                </p>
                <p className="text-[11px] text-[#8fa89a] mt-0.5">
                  লোকাল ফোল্ডার থেকে একসাথে একাধিক ছবি সিলেক্ট করতে <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-[#f4dc8a] border border-white/10 font-mono text-[10px]">Ctrl</kbd> বা <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-[#f4dc8a] border border-white/10 font-mono text-[10px]">Shift</kbd> চেপে সিলেক্ট করুন
                </p>
              </div>

              <span className="text-[10px] text-emerald-400 bg-[#0d2a1b] px-3 py-1 rounded-full border border-emerald-500/30">
                JPG, PNG, WebP সাপোর্টেড
              </span>
            </div>
          </div>

          {/* Upload Status Alert */}
          {uploadStatus && (
            <div className="p-3 rounded-xl bg-[#0a2315] border border-[#d4af37]/30 text-xs text-[#fceb9e] flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-400" />
                )}
                <span>{uploadStatus}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: IMAGE URL */}
      {activeMode === "url" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="ছবির সরাসরি লিঙ্ক বা URL দিন (e.g. https://...)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-[#05110a] border border-white/15 text-white placeholder-[#687f71] focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              disabled={!inputUrl.trim()}
              className="btn-3d-gold px-4 py-2.5 text-xs font-bold whitespace-nowrap disabled:opacity-50"
            >
              + Add to Gallery
            </button>
          </div>
          <p className="text-[10px] text-[#8fa89a]">
            💡 ইন্টারনেটের যেকোনো ছবি বা ক্লাউড ইমেজের সরাসরি লিঙ্ক পেস্ট করে গ্যালারিতে যোগ করতে পারেন।
          </p>
        </div>
      )}

      {/* MODE 3: STUDIO PRESETS (21) */}
      {activeMode === "presets" && (
        <div className="space-y-2">
          <p className="text-[11px] text-[#8fa89a]">
            নিচের যেকোনো ছবিতে ক্লিক করলেই তা তাৎক্ষণিকভাবে অতিরিক্ত গ্যালারি ছবি হিসেবে যুক্ত হবে:
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-52 overflow-y-auto custom-scrollbar p-1">
            {presets.map((preset) => {
              const isAdded = images.includes(preset.path);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleAddPreset(preset.path)}
                  className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                    isAdded
                      ? "border-emerald-500 ring-2 ring-emerald-500/40 opacity-70"
                      : "border-white/15 hover:border-[#d4af37] hover:scale-105"
                  }`}
                  title={isAdded ? "ইতিমধ্যেই যুক্ত আছে" : `Add ${preset.label}`}
                >
                  <Image
                    src={preset.path}
                    alt={preset.label}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  {isAdded && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                  <span className="absolute bottom-0.5 inset-x-0 text-center text-[8px] bg-black/75 text-white truncate px-0.5">
                    #{preset.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
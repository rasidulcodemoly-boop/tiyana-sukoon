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
} from "lucide-react";

export interface PresetItem {
  id: number;
  path: string;
  label: string;
}

interface ImageSourceControlProps {
  currentValue: string;
  onChange: (newUrl: string) => void;
  presets?: PresetItem[];
  label?: string;
}

export const ImageSourceControl: React.FC<ImageSourceControlProps> = ({
  currentValue,
  onChange,
  presets = [],
  label = "Artwork Image Source",
}) => {
  type UploadMode = "local" | "url" | "presets";
  const [activeMode, setActiveMode] = useState<UploadMode>("local");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection and upload
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, WebP, etc.)");
      return;
    }

    setIsUploading(true);
    setUploadProgress("Uploading file...");

    try {
      // 1. If Supabase is connected, upload directly to Supabase Cloud Storage bucket
      const supabase = getSupabase();
      if (supabase) {
        setUploadProgress("Uploading to Supabase Cloud Storage...");
        const cleanName = file.name
          ? file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
          : "artwork.jpg";
        const cloudFileName = `${Date.now()}_${cleanName}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("artwork-uploads")
          .upload(cloudFileName, file, { cacheControl: "3600", upsert: true });

        if (!uploadErr && uploadData) {
          const { data: publicData } = supabase.storage
            .from("artwork-uploads")
            .getPublicUrl(cloudFileName);

          if (publicData?.publicUrl) {
            onChange(publicData.publicUrl);
            setUploadProgress(`☁️ Saved to Supabase Cloud: ${file.name}`);
            setIsUploading(false);
            return;
          }
        } else {
          console.warn(
            "Supabase storage upload notice, falling back to local server:",
            uploadErr
          );
        }
      }

      // 2. Otherwise upload to local server route
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
          setUploadProgress(`Uploaded: ${file.name}`);
        }
      } else {
        // Fallback: Read as Base64 Data URL so local upload never fails!
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange(e.target.result as string);
            setUploadProgress(`Loaded: ${file.name}`);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn("Upload endpoint error, using FileReader fallback:", err);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
          setUploadProgress(`Loaded: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-[#07160f] p-4 rounded-xl border border-white/10 space-y-3">
      {/* Header and Source Mode Tabs */}
      <div className="space-y-2 border-b border-white/5 pb-2.5">
        <div className="flex items-center justify-between">
          <label className="block text-[#f4dc8a] font-semibold text-xs">
            {label}
          </label>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#050e08] p-1 rounded-lg border border-white/10 w-full">
          <button
            type="button"
            onClick={() => setActiveMode("local")}
            className={`flex-1 py-1.5 px-2 text-[10px] sm:text-[11px] rounded font-medium flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
              activeMode === "local"
                ? "bg-[#d4af37] text-[#06110a] font-bold shadow-sm"
                : "text-[#8fa89a] hover:text-white"
            }`}
          >
            <Upload className="w-3 h-3 shrink-0" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("url")}
            className={`flex-1 py-1.5 px-2 text-[10px] sm:text-[11px] rounded font-medium flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
              activeMode === "url"
                ? "bg-[#d4af37] text-[#06110a] font-bold shadow-sm"
                : "text-[#8fa89a] hover:text-white"
            }`}
          >
            <LinkIcon className="w-3 h-3 shrink-0" />
            <span>Image URL</span>
          </button>

          {presets.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveMode("presets")}
              className={`flex-1 py-1.5 px-2 text-[10px] sm:text-[11px] rounded font-medium flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
                activeMode === "presets"
                  ? "bg-[#d4af37] text-[#06110a] font-bold shadow-sm"
                  : "text-[#8fa89a] hover:text-white"
              }`}
            >
              <Grid className="w-3 h-3 shrink-0" />
              <span>Presets ({presets.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected Image Thumbnail Preview Row */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 border-[#d4af37]/40 bg-[#040c06] shadow-md">
          {currentValue ? (
            <Image
              src={currentValue}
              alt="Selected Preview"
              fill
              className="object-cover"
              unoptimized={currentValue.startsWith("data:")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8fa89a]">
              <FileImage className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-[#8fa89a]">Active Image Path:</p>
          <p className="text-xs font-mono text-white truncate max-w-full">
            {currentValue || "No image selected"}
          </p>
          {uploadProgress && (
            <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>{uploadProgress}</span>
            </p>
          )}
        </div>
      </div>

      {/* MODE 1: LOCAL FILE UPLOAD */}
      {activeMode === "local" && (
        <div className="space-y-2 pt-1 animate-fadeIn">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-5 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
              dragActive
                ? "border-[#d4af37] bg-[#d4af37]/10"
                : "border-white/20 bg-[#091f14]/60 hover:border-[#d4af37]/60 hover:bg-[#091f14]"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" />
                <p className="text-xs text-[#c4d7cc]">Uploading image...</p>
              </div>
            ) : (
              <div className="space-y-1.5 py-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#0e2a1b] text-[#f4dc8a] flex items-center justify-center border border-[#d4af37]/30">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-white">
                  Click to Browse or Drag Image Here
                </p>
                <p className="text-[10px] text-[#8fa89a]">
                  JPG, PNG, WebP from device or gallery
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: DIRECT IMAGE URL */}
      {activeMode === "url" && (
        <div className="space-y-1.5 pt-1 animate-fadeIn">
          <label className="block text-[11px] text-[#c4d7cc]">
            Enter Image Web URL (HTTP / HTTPS / Relative Path):
          </label>
          <input
            type="text"
            value={currentValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. https://images.unsplash.com/... or /artwork/artwork_4.jpg"
            className="w-full px-3 py-2 text-xs rounded-lg bg-[#091d12] border border-white/10 text-white font-mono focus:outline-none focus:border-[#d4af37]"
          />
          <p className="text-[10px] text-[#8fa89a]">
            Paste image links from Cloudinary, Imgur, Facebook, Google Drive, or any image host.
          </p>
        </div>
      )}

      {/* MODE 3: PRESETS GRID */}
      {activeMode === "presets" && presets.length > 0 && (
        <div className="space-y-2 pt-1 animate-fadeIn">
          <span className="block text-[10px] uppercase font-mono text-[#8fa89a]">
            Click to Select from Studio Archive:
          </span>
          <div className="grid grid-cols-7 gap-2 max-h-40 overflow-y-auto p-1.5 bg-[#050e08] rounded-lg border border-white/5">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange(p.path);
                  setUploadProgress(`Selected Preset #${p.id}`);
                }}
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                  currentValue === p.path
                    ? "border-[#d4af37] scale-105 shadow-md"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                title={p.label}
              >
                <Image src={p.path} alt={p.label} fill className="object-cover" />
                {currentValue === p.path && (
                  <div className="absolute inset-0 bg-[#d4af37]/30 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

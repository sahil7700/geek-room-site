"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange, folder = "events" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onChange(publicUrlData.publicUrl);
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const clearImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-3 w-full">
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-zinc-700 bg-black aspect-video max-h-48 w-full">
          <img 
            src={value} 
            alt="Uploaded Preview" 
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-full backdrop-blur transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer text-center"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          ) : (
            <Upload className="w-8 h-8 text-zinc-500 mb-2" />
          )}
          <p className="text-sm text-zinc-400">
            {isUploading ? "Uploading..." : "Click to upload an image"}
          </p>
          <p className="text-xs text-zinc-600 mt-1">JPEG, PNG, GIF up to 5MB</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Hidden file input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Fallback to URL input if they want to paste a URL manually, optional but useful */}
      <div className="flex items-center gap-2 mt-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className="h-4 w-4 text-zinc-500" />
          </div>
          <input
            type="url"
            placeholder="Or paste an image URL..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

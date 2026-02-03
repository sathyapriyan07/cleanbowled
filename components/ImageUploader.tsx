"use client";

import { useState } from "react";
import { upload } from "@/utils/upload";

type ImageUploaderProps = {
  bucket: string;
  label: string;
  onUploaded: (url: string) => void;
};

export default function ImageUploader({ bucket, label, onUploaded }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const url = await upload(file, bucket);
    onUploaded(url);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-xl bg-cardAlt">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <label className="cursor-pointer rounded-full border border-white/10 px-4 py-2 text-xs text-ink">
          {uploading ? "Uploading..." : "Choose image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </label>
      </div>
    </div>
  );
}

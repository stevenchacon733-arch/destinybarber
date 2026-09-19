"use client";

import { useRef, useState } from "react";

export default function ImageUploader({
  label,
  folder,
  currentUrl,
  aspect = "aspect-video",
  onUploaded,
}: {
  label: string;
  folder: string;
  currentUrl: string | null | undefined;
  aspect?: string;
  onUploaded: (url: string) => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null | undefined>(currentUrl);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error ?? "No se pudo subir la imagen.");
      return;
    }
    setPreview(data.url);
    await onUploaded(data.url);
  }

  return (
    <div>
      <p className="font-mono text-[0.7rem] uppercase tracking-wide text-cream-dim mb-2">{label}</p>
      <div className={`relative border border-white/15 ${aspect} overflow-hidden bg-coffee/40`}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cream-dim text-xs">Sin imagen</div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-ink/70 flex items-center justify-center text-xs text-gold-bright">
            Subiendo…
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="focus-gold text-xs uppercase tracking-wide px-3 py-2 border border-white/15 text-cream-dim hover:border-gold hover:text-gold-bright disabled:opacity-50"
        >
          {preview ? "Cambiar imagen" : "Subir imagen"}
        </button>
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}

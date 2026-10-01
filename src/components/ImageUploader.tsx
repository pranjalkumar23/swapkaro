"use client";

import { useState } from "react";

const MAX_IMAGES = 5;
const MAX_DIMENSION = 900;
const JPEG_QUALITY = 0.72;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({ name, defaultImages = [] }: { name: string; defaultImages?: string[] }) {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [busy, setBusy] = useState(false);
  const [warning, setWarning] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setWarning("");

    const room = MAX_IMAGES - images.length;
    const toProcess = Array.from(files).slice(0, room);
    if (files.length > room) {
      setWarning(`Up to ${MAX_IMAGES} images per listing — added the first ${room === 1 ? "one" : room}.`);
    }

    setBusy(true);
    try {
      const compressed = await Promise.all(toProcess.map(compressImage));
      setImages((prev) => [...prev, ...compressed]);
    } catch {
      setWarning("Couldn't process one of those images — try a different file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="label">Photos (up to {MAX_IMAGES})</label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
          {images.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--color-border)]">
              {/* Local data-URL previews — no backend storage in this demo. */}
              <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
              <input type="hidden" name={name} value={src} />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < MAX_IMAGES && (
        <label className="card flex flex-col items-center justify-center gap-1 p-4 text-sm text-[var(--color-ink-muted)] cursor-pointer hover:bg-[var(--color-primary-light)]/40">
          <span>{busy ? "Processing…" : "📷 Add photos"}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      )}

      {warning && <p className="text-xs text-[var(--color-danger)] mt-2">{warning}</p>}
      <p className="text-xs text-[var(--color-ink-muted)] mt-2">
        Photos are compressed and kept in your browser for this demo — nothing is uploaded to a server.
      </p>
    </div>
  );
}

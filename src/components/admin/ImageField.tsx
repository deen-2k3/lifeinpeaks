"use client";

import { useRef, useState } from "react";
import { imageUrl, type ImageAsset } from "@/lib/images";
import { uploadFile } from "./ImageUploader";

/** Single-image picker for covers / profile / memories. Stores the uploaded image id in a hidden input. */
export function ImageField({ name, label, initial, required }: { name: string; label: string; initial?: (ImageAsset & { id: string }) | null; required?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(initial ?? null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file?: File) {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      const { image } = await uploadFile(file, { mode: "image" }, setProgress);
      setImage(image);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProgress(null);
    }
  }

  return (
    <div>
      <span className="text-sm text-fog">{label}{required && " *"}</span>
      <input type="hidden" name={name} value={image?.id ?? ""} />
      <div className="mt-2 flex items-center gap-4">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="relative grid h-28 w-44 shrink-0 place-items-center overflow-hidden rounded-sm border border-dashed border-line/15 bg-coal text-xs text-stone hover:border-sand"
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl(image, 480)} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            "Choose image"
          )}
          {progress !== null && <span className="absolute inset-0 grid place-items-center bg-black/60 text-mist">{progress < 1 ? `${Math.round(progress * 100)}%` : "Optimising…"}</span>}
        </button>
        <div className="space-y-1 text-xs">
          {image && <p className="text-stone">{image.width} × {image.height}px</p>}
          <button type="button" onClick={() => input.current?.click()} className="block text-sand hover:underline">{image ? "Replace" : "Upload"}</button>
          {image && !required && <button type="button" onClick={() => setImage(null)} className="block text-stone hover:text-ember">Remove</button>}
          {error && <p className="text-ember">{error}</p>}
        </div>
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}

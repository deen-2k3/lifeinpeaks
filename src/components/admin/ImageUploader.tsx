"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Item = { name: string; progress: number; status: "queued" | "uploading" | "processing" | "done" | "error"; error?: string };
export type UploadedImage = { id: string; key: string; provider: string; width: number; height: number; variants: number[]; blurDataUrl: string | null; color: string | null };

export function uploadFile(file: File, fields: Record<string, string | string[]>, onProgress: (p: number) => void) {
  return new Promise<{ image: UploadedImage; photo?: { id: string } }>((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    for (const [k, v] of Object.entries(fields)) (Array.isArray(v) ? v : [v]).forEach((x) => fd.append(k, x));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      let body: { error?: string } & Record<string, unknown> = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300) resolve(body as never);
      else reject(new Error(body.error ?? `Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(fd);
  });
}

/** Drag-and-drop bulk photo uploader. Files upload two at a time; the server optimises each one. */
export function ImageUploader({ tripId, categoryIds = [] }: { tripId?: string; categoryIds?: string[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [drag, setDrag] = useState(false);
  const busy = items.some((i) => i.status === "uploading" || i.status === "processing" || i.status === "queued");

  async function start(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    const offset = items.length;
    setItems((cur) => [...cur, ...images.map((f) => ({ name: f.name, progress: 0, status: "queued" as const }))]);
    const update = (i: number, patch: Partial<Item>) => setItems((cur) => cur.map((it, j) => (j === offset + i ? { ...it, ...patch } : it)));

    let next = 0;
    const worker = async () => {
      while (next < images.length) {
        const i = next++;
        update(i, { status: "uploading" });
        try {
          await uploadFile(images[i], { mode: "photo", ...(tripId ? { tripId } : {}), categoryIds }, (p) => update(i, { progress: p, status: p >= 1 ? "processing" : "uploading" }));
          update(i, { status: "done", progress: 1 });
        } catch (e) {
          update(i, { status: "error", error: (e as Error).message });
        }
      }
    };
    await Promise.all([worker(), worker()]);
    router.refresh();
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          start([...e.dataTransfer.files]);
        }}
        onClick={() => input.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        className={cn("grid cursor-pointer place-items-center rounded-md border border-dashed px-6 py-10 text-center transition", drag ? "border-sand bg-sand/5" : "border-line/15 hover:border-line/30")}
      >
        <div>
          <p className="font-display text-2xl text-mist">Drop photographs here</p>
          <p className="mt-1 text-sm text-stone">or click to choose · JPEG, PNG, WebP, AVIF, TIFF · up to 60 MB each · originals are preserved</p>
        </div>
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && start([...e.target.files])} />
      </div>
      {items.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((it, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-48 truncate text-fog">{it.name}</span>
              <span className="relative h-1 flex-1 overflow-hidden rounded bg-line/10">
                <span className={cn("absolute inset-y-0 left-0 transition-all", it.status === "error" ? "bg-ember" : "bg-forest")} style={{ width: `${Math.round(it.progress * 100)}%` }} />
              </span>
              <span className={cn("w-40 text-right text-xs", it.status === "error" ? "text-ember" : "text-stone")}>
                {it.status === "processing" ? "Optimising…" : it.status === "error" ? it.error : it.status}
              </span>
            </li>
          ))}
        </ul>
      )}
      {!busy && items.some((i) => i.status === "done") && (
        <button type="button" onClick={() => setItems([])} className="mt-3 text-xs text-stone hover:text-mist">Clear list</button>
      )}
    </div>
  );
}

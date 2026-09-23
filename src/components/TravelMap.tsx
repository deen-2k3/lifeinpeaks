"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

export type MapTrip = {
  slug: string;
  title: string;
  region: string;
  date: string;
  label: string;
  photos: number;
  lat: number;
  lng: number;
  cover: string | null;
};

const TILES = process.env.NEXT_PUBLIC_MAP_TILES ?? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function popupHtml(t: MapTrip) {
  return `
    <a href="/trips/${esc(t.slug)}" style="display:block;color:inherit;text-decoration:none">
      ${t.cover ? `<img src="${esc(t.cover)}" alt="" style="display:block;width:100%;height:140px;object-fit:cover;border-radius:4px 4px 0 0"/>` : ""}
      <div style="padding:14px 16px 16px">
        <div style="font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#8d918a">${esc(t.region)} · ${esc(t.label)}</div>
        <div style="font-family:var(--font-display);font-size:26px;line-height:1.1;margin-top:6px">${esc(t.title)}</div>
        <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:12px;color:#b9bbb4">
          <span>${t.photos} photos</span><span style="color:#dcc7a6">Open journey →</span>
        </div>
      </div>
    </a>`;
}

/**
 * Interactive dark travel map. Leaflet is only downloaded once the map scrolls into view.
 * A dashed route joins the journeys in chronological order.
 */
export function TravelMap({ trips, className, compact }: { trips: MapTrip[]; className?: string; compact?: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<Record<string, Marker>>({});
  const [active, setActive] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    let cancelled = false;

    const init = async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || map.current) return;
      const m = L.map(node, { zoomControl: !compact, scrollWheelZoom: false, attributionControl: true, worldCopyJump: true });
      L.tileLayer(TILES, { attribution: ATTRIBUTION, subdomains: "abcd", maxZoom: 18, detectRetina: true }).addTo(m);

      const pts = trips.map((t) => L.latLng(t.lat, t.lng));
      const chronological = [...trips].sort((a, b) => a.date.localeCompare(b.date)).map((t) => [t.lat, t.lng] as [number, number]);
      L.polyline(chronological, { color: "#dcc7a6", weight: 1.2, opacity: 0.45, dashArray: "4 8" }).addTo(m);

      trips.forEach((t) => {
        const icon = L.divIcon({ className: "", html: '<div class="map-pin"><span></span></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
        const mk = L.marker([t.lat, t.lng], { icon, title: t.title, keyboard: true })
          .addTo(m)
          .bindPopup(popupHtml(t), { closeButton: true, offset: [0, -4], maxWidth: 260, minWidth: 260 });
        mk.on("popupopen", () => setActive(t.slug));
        mk.on("popupclose", () => setActive((a) => (a === t.slug ? null : a)));
        markers.current[t.slug] = mk;
      });

      if (pts.length) m.fitBounds(L.latLngBounds(pts).pad(compact ? 0.35 : 0.25), { maxZoom: 6 });
      else m.setView([23.5, 80], 4);
      m.on("focus", () => m.scrollWheelZoom.enable());
      m.on("blur", () => m.scrollWheelZoom.disable());
      map.current = m;
      setReady(true);
    };

    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          io.disconnect();
          init();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(node);
    return () => {
      cancelled = true;
      io.disconnect();
      map.current?.remove();
      map.current = null;
      markers.current = {};
    };
  }, [trips, compact]);

  function focusTrip(t: MapTrip) {
    const m = map.current;
    if (!m) return;
    m.flyTo([t.lat, t.lng], Math.max(m.getZoom(), 6), { duration: 1.2 });
    setTimeout(() => markers.current[t.slug]?.openPopup(), 900);
  }

  return (
    <div className={cn("surface-dark relative grid overflow-hidden rounded-sm border border-line/5 bg-ink lg:grid-cols-[1fr_320px]", className)}>
      <div className={cn("relative", compact ? "h-[60svh] min-h-[420px]" : "h-[70svh] min-h-[480px] lg:h-[78svh]")}>
        <div ref={el} className="absolute inset-0" aria-label="Map of places visited" />
        {!ready && <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.3em] text-stone">Loading map…</div>}
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_40px_rgba(11,12,10,.85)]" />
      </div>
      <ol className="max-h-[70svh] divide-y divide-line/5 overflow-y-auto border-t border-line/5 lg:max-h-none lg:border-l lg:border-t-0">
        {trips.map((t, i) => (
          <li key={t.slug}>
            <div className={cn("flex items-center gap-4 px-5 py-4 transition", active === t.slug ? "bg-line/[.04]" : "hover:bg-line/[.02]")}>
              <span className="w-6 text-xs tabular-nums text-stone">{String(i + 1).padStart(2, "0")}</span>
              <button type="button" onClick={() => focusTrip(t)} className="min-w-0 flex-1 text-left">
                <span className={cn("block font-display text-2xl leading-tight", active === t.slug ? "text-sand" : "text-mist")}>{t.title}</span>
                <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-stone">{t.label} · {t.photos} photos</span>
              </button>
              <Link href={`/trips/${t.slug}`} className="text-xs text-fog hover:text-sand" aria-label={`Open ${t.title}`}>→</Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

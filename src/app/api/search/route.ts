import { NextResponse, type NextRequest } from "next/server";
import { searchAll } from "@/lib/queries";
import { formatMonthYear } from "@/lib/utils";

// Compact results for the header search dialog.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  try {
    const r = await searchAll(q);
    const hits = [
      ...r.trips.map((t) => ({ kind: "Journey", href: `/trips/${t.slug}`, title: t.title, meta: `${t.region} · ${formatMonthYear(t.startDate)}`, image: t.coverImage })),
      ...r.stories.map((s) => ({ kind: "Story", href: `/stories/${s.slug}`, title: s.title, meta: s.location ?? undefined, image: s.coverImage })),
      ...r.categories.map((c) => ({ kind: "Category", href: `/${c.group === "MOUNTAIN" ? "mountains" : "photography"}?category=${c.slug}`, title: c.name, meta: c.group === "MOUNTAIN" ? "Mountains" : "Portfolio", image: null })),
      ...r.photos.slice(0, 6).map((p) => ({ kind: "Photo", href: `/search?q=${encodeURIComponent(q)}`, title: p.title ?? "Photograph", meta: p.location ?? undefined, image: p.image })),
      ...r.memories.slice(0, 4).map((m) => ({ kind: "Memory", href: "/memories", title: m.caption, meta: m.location ?? undefined, image: m.image })),
    ];
    return NextResponse.json({ hits }, { headers: { "Cache-Control": "public, s-maxage=60" } });
  } catch (e) {
    console.error("[api/search]", e);
    return NextResponse.json({ hits: [] }, { status: 500 });
  }
}

import { NextResponse, type NextRequest } from "next/server";
import { getPhotos } from "@/lib/queries";

// Public, paginated photo feed used by galleries ("load more") and the favourites page.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const group = sp.get("group");
  const ids = sp.get("ids")?.split(",").filter(Boolean).slice(0, 200);
  try {
    const data = await getPhotos({
      category: sp.get("category") ?? undefined,
      group: group === "MOUNTAIN" || group === "PORTFOLIO" ? group : undefined,
      tripId: sp.get("trip") ?? undefined,
      cursor: sp.get("cursor") ?? undefined,
      ids,
      take: ids ? ids.length : Number(sp.get("take")) || 30,
    });
    return NextResponse.json(data, { headers: { "Cache-Control": ids ? "private, no-store" : "public, s-maxage=60, stale-while-revalidate=600" } });
  } catch (e) {
    console.error("[api/photos]", e);
    return NextResponse.json({ error: "Could not load photos" }, { status: 500 });
  }
}

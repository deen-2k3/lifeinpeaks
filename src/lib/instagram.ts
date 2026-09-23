import { getPhotos } from "@/lib/queries";
import { imageUrl } from "@/lib/images";

export type InstaPost = { id: string; src: string; href: string; caption: string };

/**
 * Recent Instagram posts. With INSTAGRAM_ACCESS_TOKEN (Instagram API with Instagram Login,
 * long-lived token) posts come from Instagram, cached for an hour. Without it, the section
 * falls back to the latest featured photographs from this site, linking to the profile.
 */
export async function getInstagramPosts(profileUrl: string, limit = 8): Promise<InstaPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (token) {
    try {
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption&limit=${limit}&access_token=${token}`,
        { next: { revalidate: 3600 } },
      );
      if (res.ok) {
        const json = (await res.json()) as { data: { id: string; media_type: string; media_url: string; thumbnail_url?: string; permalink: string; caption?: string }[] };
        return json.data.map((p) => ({
          id: p.id,
          src: p.media_type === "VIDEO" ? (p.thumbnail_url ?? p.media_url) : p.media_url,
          href: p.permalink,
          caption: p.caption?.slice(0, 120) ?? "",
        }));
      }
      console.error("[instagram] API responded", res.status);
    } catch (e) {
      console.error("[instagram] fetch failed", e);
    }
  }
  const { items } = await getPhotos({ take: limit, featured: true });
  return items.map((p) => ({ id: p.id, src: imageUrl(p.image, 480), href: profileUrl || "#", caption: p.title ?? "" }));
}

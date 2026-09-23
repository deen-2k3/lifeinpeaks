import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { FavoritesGallery } from "./FavoritesGallery";

export const metadata: Metadata = { title: "My Favourite Photos", robots: { index: false } };

export default function FavoritesPage() {
  return (
    <>
      <PageIntro eyebrow="Saved on this device" title="My Favourite Photos">
        Tap the heart on any photograph to keep it here. No account needed — favourites live in your browser.
      </PageIntro>
      <section className="container-page pb-32">
        <FavoritesGallery />
      </section>
    </>
  );
}

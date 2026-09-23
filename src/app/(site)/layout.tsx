import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings, instagramUrl } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <div className="grain">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-mist focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Header siteName={settings.siteName} instagram={instagramUrl(settings.instagramUsername)} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}

import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Mr_Dafoe } from "next/font/google";
import { getSettings } from "@/lib/settings";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const script = Mr_Dafoe({ subsets: ["latin"], weight: "400", variable: "--font-mrdafoe", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => null);
  const name = s?.siteName ?? "Lifeinpeaks";
  const description = s?.seoDescription;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${name} — ${s?.tagline ?? "Mountain & travel photography"}`, template: `%s · ${name}` },
    description,
    applicationName: name,
    openGraph: { type: "website", siteName: name, locale: "en_IN" },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  themeColor: "#12372a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${script.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}

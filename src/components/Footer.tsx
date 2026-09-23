import Link from "next/link";
import { siteConfig } from "@/config/site";
import { instagramUrl, type SiteSettings } from "@/lib/settings";
import { FacebookIcon, InstagramIcon, PinterestIcon, XIcon, YoutubeIcon } from "./icons";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: instagramUrl(settings.instagramUsername), label: "Instagram", Icon: InstagramIcon },
    { href: settings.youtubeUrl, label: "YouTube", Icon: YoutubeIcon },
    { href: settings.facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { href: settings.twitterUrl, label: "X", Icon: XIcon },
    { href: settings.pinterestUrl, label: "Pinterest", Icon: PinterestIcon },
  ].filter((s) => s.href);
  const [first, ...rest] = settings.tagline.split(/,\s*/);

  return (
    <footer className="surface-dark relative overflow-hidden bg-ink pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16">
      {/* “Keep Exploring” watermark */}
      <div aria-hidden className="pointer-events-none absolute -right-4 bottom-24 hidden w-64 rotate-[-4deg] opacity-[0.12] lg:block">
        <Logo variant="mark" alt="" className="w-full" />
        <p className="-mt-2 pl-10 font-script text-6xl leading-[0.9] text-snow">Keep<br />&nbsp;&nbsp;Exploring</p>
      </div>

      <div className="container-page relative grid gap-12 md:grid-cols-2 lg:grid-cols-[1.1fr_1.2fr_0.9fr_1.4fr]">
        <Link href="/" aria-label={`${settings.siteName} — home`} className="inline-block self-start">
          <Logo alt={settings.siteName} className="w-56 sm:w-64" />
        </Link>

        <div>
          <p className="font-display text-2xl leading-snug text-mist">
            {first}
            {rest.length > 0 && ","}
            {rest.length > 0 && <br />}
            {rest.join(", ")}
          </p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-1">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full text-fog transition hover:bg-line/10 hover:text-mist">
                  <Icon width={18} height={18} />
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="Footer">
          <p className="text-[0.95rem] font-medium text-mist">Quick Links</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm lg:grid-cols-1">
            {siteConfig.footerNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-fog transition hover:text-mist">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-[0.95rem] font-medium text-mist">Newsletter</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-fog">Get travel inspiration, stories and updates straight to your inbox.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="container-page relative mt-14 flex flex-col gap-3 border-t border-line/15 pt-6 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
        <p className="flex flex-wrap gap-x-3">
          {siteConfig.pillars.map((p, i) => (
            <span key={p} className="flex gap-3">
              {i > 0 && <span className="opacity-50">|</span>}
              {p}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}

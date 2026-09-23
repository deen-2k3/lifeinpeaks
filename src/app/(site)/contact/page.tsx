import type { Metadata } from "next";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/icons";
import { PageIntro } from "@/components/ui";
import { getSettings, instagramUrl } from "@/lib/settings";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about travel, photography, collaborations or prints.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const s = await getSettings();
  const socials = [
    { href: instagramUrl(s.instagramUsername), label: s.instagramUsername ? `@${s.instagramUsername.replace(/^@/, "")}` : "Instagram", Icon: InstagramIcon },
    { href: s.facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { href: s.youtubeUrl, label: "YouTube", Icon: YoutubeIcon },
  ].filter((x) => x.href);

  return (
    <>
      <PageIntro eyebrow="Contact" title="Let's talk about travel.">
        Planning a trip to the mountains, want a print, or just want to swap stories? Write to me.
      </PageIntro>
      <section className="container-page grid gap-16 pb-32 md:grid-cols-[1.3fr_1fr] md:gap-24">
        <ContactForm />
        <aside className="space-y-10">
          {s.contactEmail && (
            <div>
              <p className="eyebrow">Email</p>
              <a href={`mailto:${s.contactEmail}`} className="mt-2 block break-all font-display text-2xl hover:text-sand">{s.contactEmail}</a>
            </div>
          )}
          {socials.length > 0 && (
            <div>
              <p className="eyebrow">Elsewhere</p>
              <ul className="mt-4 space-y-3">
                {socials.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-fog transition hover:text-mist">
                      <Icon /> {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>
    </>
  );
}

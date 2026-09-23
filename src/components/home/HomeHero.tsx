import Link from "next/link";
import type { ImageAsset } from "@/lib/images";
import { tornPhotoMask } from "@/lib/torn";
import { Picture } from "../Picture";
import { TornEdge } from "../TornEdge";
import { ArrowRight, PeaksIcon, PlayIcon } from "../icons";

type Props = {
  image: ImageAsset | null;
  eyebrow: string;
  title: string;
  text: string;
  aside: string;
  pillars?: string[];
};

const mask = tornPhotoMask(11);

/** Split hero: script headline on parchment, photograph on a torn-paper edge. */
export function HomeHero({ image, eyebrow, title, text, aside, pillars = ["Travel", "Photography", "Adventure", "Memories"] }: Props) {
  const asideLines = aside.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);

  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-ink pb-10 pt-[var(--header-h)] lg:block lg:pb-0">
      {/* Photograph – right side on desktop, below the text on mobile */}
      {image && (
        <div
          className="relative mx-4 mt-2 aspect-[4/3] sm:mx-8 lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:mt-0 lg:aspect-auto lg:w-[60%]"
          style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
        >
          <Picture image={image} alt="A hiker looking out over the mountains" fill priority sizes="(min-width: 1024px) 60vw, 100vw" objectPosition="35% 45%" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent" />
          {asideLines.length > 0 && (
            <p className="rise absolute bottom-[14%] right-[5%] -rotate-6 text-right font-script text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.05] text-snow drop-shadow-[0_2px_12px_rgba(0,0,0,.45)]" style={{ animationDelay: "900ms" }}>
              {asideLines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
              <span className="ml-auto mt-3 block h-px w-16 bg-snow/80" />
            </p>
          )}
        </div>
      )}

      {/* Copy */}
      <div className="container-page relative order-first py-12 lg:flex lg:min-h-[calc(100svh-var(--header-h))] lg:max-h-[860px] lg:items-center lg:py-20">
        <div className="max-w-xl lg:w-[46%] lg:max-w-none">
          <p className="rise text-[0.8rem] uppercase tracking-[0.45em] text-mist/80">{eyebrow}</p>
          <h1 className="rise mt-3 font-script text-[clamp(3.6rem,8.5vw,7.4rem)] leading-[0.95] text-forest" style={{ animationDelay: "150ms" }}>
            {title}
          </h1>
          {text && (
            <div className="rise mt-6 max-w-md space-y-1 text-[1.02rem] leading-relaxed text-mist/85" style={{ animationDelay: "300ms" }}>
              {text.split(/\n+/).map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          )}
          <div className="rise mt-9 flex flex-wrap items-center gap-6" style={{ animationDelay: "450ms" }}>
            <Link href="/journeys" className="group inline-flex min-h-12 items-center gap-3 rounded-md bg-cta px-6 text-[0.95rem] font-medium text-cta-fg shadow-[0_10px_30px_-12px_rgba(18,55,42,.6)] transition hover:bg-cta-hover">
              Explore Destinations <ArrowRight width={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/about" className="group inline-flex items-center gap-3 text-sm text-mist">
              <span className="grid size-11 place-items-center rounded-full border-[1.5px] border-mist/80 transition group-hover:bg-forest group-hover:text-snow">
                <PlayIcon width={18} />
              </span>
              Watch Our Story
            </Link>
          </div>
          <div className="rise mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.66rem] uppercase tracking-[0.24em] text-stone" style={{ animationDelay: "600ms" }}>
            <PeaksIcon width={44} height={26} className="text-mist" />
            {pillars.map((p, i) => (
              <span key={p} className="flex items-center gap-3">
                {i > 0 && <span className="text-stone/50">|</span>}
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <TornEdge seed={21} className="text-coal" />
    </section>
  );
}

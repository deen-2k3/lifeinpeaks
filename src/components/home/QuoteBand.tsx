import type { ImageAsset } from "@/lib/images";
import { Picture } from "../Picture";
import { Reveal } from "../Reveal";
import { TornEdge } from "../TornEdge";

export function QuoteBand({ quote, image, signature }: { quote: string; image: ImageAsset | null; signature: string }) {
  if (!quote) return null;
  return (
    <section className="relative isolate overflow-hidden bg-ash py-24 sm:py-32">
      <TornEdge position="top" seed={5} className="text-ink" />
      {image && <Picture image={image} alt="" fill sizes="100vw" className="-z-10" objectPosition="center 60%" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/25" />
      <Reveal className="container-page text-center">
        <blockquote className="font-script text-[clamp(2.4rem,6vw,4.6rem)] leading-tight text-forest">“{quote}”</blockquote>
        <span className="mx-auto mt-6 block h-px w-24 bg-forest/50" />
        <p className="mt-4 text-[0.7rem] uppercase tracking-[0.5em] text-mist/70">{signature}</p>
      </Reveal>
      <TornEdge seed={9} className="text-coal" />
    </section>
  );
}

"use client";

import { useRef } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ImageAsset } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Picture } from "./Picture";

type Props = {
  image: ImageAsset | null;
  alt: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  /** full = 100svh cinematic hero, tall = 85svh page hero */
  size?: "full" | "tall" | "medium";
  align?: "center" | "bottom";
  scrollHint?: boolean;
};

/** Full-bleed photographic hero with gentle parallax and staged text entrance. */
export function Hero({ image, alt, eyebrow, title, subtitle, children, size = "full", align = "center", scrollHint }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, reduce ? 1.04 : 1.14]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={ref}
        className={cn(
          "surface-dark relative isolate flex overflow-hidden bg-ink",
          size === "full" && "h-[100svh] min-h-[560px]",
          size === "tall" && "h-[85svh] min-h-[520px]",
          size === "medium" && "h-[62svh] min-h-[440px]",
          align === "center" ? "items-center justify-center text-center" : "items-end",
        )}
      >
        <m.div className="absolute inset-0 -z-10 will-change-transform" style={{ y, scale }}>
          {image && <Picture image={image} alt={alt} fill priority sizes="100vw" />}
        </m.div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/10 to-ink" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,.45))]" />

        <m.div style={{ opacity: fade }} className={cn("container-page relative", align === "bottom" && "pb-14 sm:pb-20")}>
          {eyebrow && (
            <div className="eyebrow rise !text-fog" style={{ animationDelay: "200ms" }}>
              {eyebrow}
            </div>
          )}
          <h1
            className={cn(
              "rise font-display font-medium leading-[0.95] tracking-tight text-mist drop-shadow-[0_2px_24px_rgba(0,0,0,.35)]",
              size === "full" ? "mt-4 text-[clamp(3.2rem,11vw,9.5rem)]" : "mt-3 text-[clamp(2.8rem,8vw,6.5rem)]",
            )}
            style={{ animationDelay: "350ms" }}
          >
            {title}
          </h1>
          {subtitle && (
            <div
              style={{ animationDelay: "600ms" }}
              className={cn("rise mt-5 font-display text-xl italic text-mist/85 sm:text-2xl", align === "center" && "mx-auto max-w-2xl")}
            >
              {subtitle}
            </div>
          )}
          {children && (
            <div className="rise" style={{ animationDelay: "850ms" }}>
              {children}
            </div>
          )}
        </m.div>

        {scrollHint && (
          <a href="#intro" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-fog [@media(max-height:700px)]:hidden" aria-label="Scroll down">
            <span className="text-[0.62rem] uppercase tracking-[0.4em]">Scroll</span>
            <span className="relative h-12 w-px overflow-hidden bg-line/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-hint bg-mist" />
            </span>
          </a>
        )}
      </section>
    </LazyMotion>
  );
}

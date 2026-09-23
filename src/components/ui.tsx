import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "./icons";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  children,
  action,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  action?: { href: string; label: string };
  className?: string;
  /** kept for compatibility – headings are always centred */
  center?: boolean;
}) {
  return (
    <Reveal className={cn("relative mb-10 text-center sm:mb-12", className)}>
      {eyebrow && <p className="text-[0.7rem] uppercase tracking-[0.42em] text-mist/70">{eyebrow}</p>}
      <h2 className="mx-auto mt-3 max-w-3xl font-display text-[clamp(2.1rem,4.6vw,3.3rem)] font-semibold leading-[1.08] text-heading">{title}</h2>
      <span className="mx-auto mt-4 block h-[3px] w-10 rounded-full bg-heading" />
      {children && <div className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-fog">{children}</div>}
      {action && (
        <div className="mt-6 md:absolute md:bottom-[calc(1rem+3px)] md:right-0 md:mt-0">
          <TextLink href={action.href}>{action.label}</TextLink>
        </div>
      )}
    </Reveal>
  );
}

export function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex shrink-0 items-center gap-2 text-sm text-mist", className)}>
      <span className="border-b border-line/40 pb-1 transition group-hover:border-sand group-hover:text-sand">{children}</span>
      <ArrowRight width={16} className="transition-transform duration-500 group-hover:translate-x-1" />
    </Link>
  );
}

export function ButtonLink({ href, children, variant = "solid", className }: { href: string; children: React.ReactNode; variant?: "solid" | "ghost"; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-[0.8rem] font-medium uppercase tracking-[0.16em] transition duration-500",
        variant === "solid" ? "bg-cta text-cta-fg hover:bg-cta-hover" : "border border-line/35 text-mist backdrop-blur-sm hover:border-mist hover:bg-line/10",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function PageIntro({ eyebrow, title, children }: { eyebrow?: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="surface-dark relative mb-12 overflow-hidden bg-ink sm:mb-16">
      {/* faint ridge line along the bottom of the band */}
      <svg aria-hidden viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-16 w-full text-line/[.04] sm:h-24">
        <path fill="currentColor" d="M0 120V78l120-30 110 38 150-58 130 44 120-26 170 52 140-60 160 40 130-22 210 48v16Z" />
      </svg>
      <div className="container-page relative pb-14 pt-[calc(var(--header-h)+4rem)] sm:pb-20 sm:pt-[calc(var(--header-h)+6rem)]">
      {eyebrow && <p className="eyebrow rise">{eyebrow}</p>}
      <h1 className="rise mt-4 max-w-4xl font-display text-[clamp(3rem,9vw,7rem)] font-medium leading-[0.95] text-mist" style={{ animationDelay: "120ms" }}>
        {title}
      </h1>
      {children && (
        <div className="rise mt-6 max-w-2xl text-lg leading-relaxed text-fog" style={{ animationDelay: "240ms" }}>
          {children}
        </div>
      )}
      </div>
    </header>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-sm border border-dashed border-line/10 px-6 py-16 text-center text-stone">{children}</p>;
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

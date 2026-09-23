import type { Stat } from "@/lib/settings";
import { Reveal } from "./Reveal";

export function Statistics({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;
  return (
    <dl className="grid grid-cols-2 border-y border-line/10 sm:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="border-line/10 px-2 py-8 text-center odd:border-r sm:border-r sm:last:border-r-0">
          <dd className={s.value.length > 6 ? "font-display text-3xl leading-[1.35] text-mist sm:text-4xl" : "font-display text-5xl text-mist sm:text-6xl"}>{s.value}</dd>
          <dt className="eyebrow mt-3">{s.label}</dt>
        </Reveal>
      ))}
    </dl>
  );
}

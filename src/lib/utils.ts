export { clsx as cn } from "clsx";

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

type D = Date | string | null | undefined;
const toDate = (d: D) => (d ? (d instanceof Date ? d : new Date(d)) : null);

export const formatMonthYear = (d: D) => (toDate(d) ? monthYear.format(toDate(d)!) : "");
export const formatDate = (d: D) => (toDate(d) ? fullDate.format(toDate(d)!) : "");
export const formatShortDate = (d: D) => (toDate(d) ? shortDate.format(toDate(d)!) : "");

export function tripDays(start: D, end: D) {
  const s = toDate(start), e = toDate(end);
  if (!s || !e) return null;
  return Math.max(1, Math.round((e.getTime() - s.getTime()) / 86_400_000) + 1);
}

export function readingTime(markdown: string) {
  const words = markdown.replace(/[#>*_`\-!\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function plural(n: number, word: string, pluralWord = `${word}s`) {
  return `${n.toLocaleString("en-IN")} ${n === 1 ? word : pluralWord}`;
}

export function siteUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path}`;
}

export function excerptOf(markdown: string, len = 160) {
  const text = markdown.replace(/[#>*_`]/g, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\s+/g, " ").trim();
  return text.length > len ? text.slice(0, len - 1).replace(/\s+\S*$/, "") + "…" : text;
}

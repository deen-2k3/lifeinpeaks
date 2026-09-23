"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";
import { ArrowRight, CloseIcon, HeartIcon, InstagramIcon, MenuIcon, SearchIcon } from "./icons";
import { SearchDialog } from "./SearchDialog";
import { Logo } from "./Logo";

export function Header({ siteName, instagram }: { siteName: string; instagram?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const { ids } = useFavorites();
  const closeSearch = useCallback(() => setSearch(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isActive = (href: string) => (href === "/" ? pathname === "/" : active(href) || (href === "/journeys" && pathname.startsWith("/trips/")));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 bg-ink/95 backdrop-blur-lg transition-[box-shadow,border-color] duration-500",
          scrolled ? "border-b border-line/10 shadow-[0_8px_30px_-20px_rgba(23,34,29,.45)]" : "border-b border-transparent",
        )}
      >
        <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-6 pt-[env(safe-area-inset-top)]">
          <Link href="/" className="shrink-0" aria-label={`${siteName} — home`}>
            <Logo alt={siteName} tone="forest" priority className="h-[68px] w-auto sm:h-20 lg:h-[92px]" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {siteConfig.nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn("relative py-2 text-[0.92rem] transition-colors", isActive(l.href) ? "text-mist" : "text-mist/75 hover:text-mist")}
              >
                {l.label}
                {isActive(l.href) && <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-forest" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setSearch(true)} className="grid size-11 place-items-center rounded-full text-mist hover:text-forest" aria-label="Search (Ctrl+K)">
              <SearchIcon />
            </button>
            <Link href="/favorites" className="relative grid size-11 place-items-center rounded-full text-mist hover:text-forest" aria-label={`My favourite photos (${ids.length})`}>
              <HeartIcon />
              {ids.length > 0 && (
                <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-ember px-1 text-[0.6rem] font-semibold text-snow">{ids.length}</span>
              )}
            </Link>
            <Link href={siteConfig.cta.href} className="group ml-3 hidden min-h-11 items-center gap-2 rounded-md bg-forest px-5 text-[0.9rem] font-medium text-snow transition hover:bg-cta sm:inline-flex">
              {siteConfig.cta.label} <ArrowRight width={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button onClick={() => setMenu(true)} className="grid size-11 place-items-center rounded-full text-mist lg:hidden" aria-label="Open menu" aria-expanded={menu}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {menu && (
            <m.div
              className="surface-dark fixed inset-0 z-[65] flex flex-col bg-ink/97 backdrop-blur-xl lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="container-page flex h-[var(--header-h)] items-center justify-between pt-[env(safe-area-inset-top)]">
                <Logo alt={siteName} className="h-[68px] w-auto" />
                <button onClick={() => setMenu(false)} className="grid size-11 place-items-center" aria-label="Close menu">
                  <CloseIcon />
                </button>
              </div>
              <nav className="container-page flex flex-1 flex-col justify-center gap-1 pb-16" aria-label="Mobile">
                {[...siteConfig.nav, ...siteConfig.moreNav].map((l, i) => (
                  <m.div key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04, duration: 0.5 }}>
                    <Link href={l.href} className={cn("block py-1.5 font-display text-4xl", isActive(l.href) ? "text-sand" : "text-mist")}>
                      {l.label}
                    </Link>
                  </m.div>
                ))}
              </nav>
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="container-page flex items-center gap-2 pb-[max(2rem,env(safe-area-inset-bottom))] text-sm text-fog">
                  <InstagramIcon /> Follow on Instagram
                </a>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>

      <SearchDialog open={search} onClose={closeSearch} />
    </>
  );
}

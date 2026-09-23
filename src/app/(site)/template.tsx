"use client";

import { useEffect } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";

// Only animate client-side navigations — the first paint must not be hidden (LCP).
let hasNavigated = false;

/** Soft cross-fade between pages. */
export default function Template({ children }: { children: React.ReactNode }) {
  const animate = hasNavigated;
  useEffect(() => {
    hasNavigated = true;
  }, []);
  return (
    <LazyMotion features={domAnimation}>
      <m.div initial={animate ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </m.div>
    </LazyMotion>
  );
}

"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "article";
};

/** Fades and lifts content into view once, as it scrolls into the viewport. */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Tag = m[as];
  return (
    <LazyMotion features={domAnimation} strict>
      <Tag
        className={className}
        initial={reduce ? false : { opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </Tag>
    </LazyMotion>
  );
}

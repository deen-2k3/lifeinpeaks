"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-6 text-center">
      <div>
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-4 font-display text-5xl text-mist sm:text-7xl">A rockfall on the road.</h1>
        <p className="mx-auto mt-5 max-w-md text-fog">This page couldn't load. Please try again in a moment.</p>
        <button onClick={reset} className="mt-10 inline-flex min-h-12 items-center rounded-full bg-cta px-8 text-[0.8rem] uppercase tracking-[0.16em] text-cta-fg hover:bg-cta-hover">
          Try again
        </button>
      </div>
    </main>
  );
}

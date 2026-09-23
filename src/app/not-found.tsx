import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-6 text-center">
      <div>
        <p className="eyebrow">404 · Off the map</p>
        <h1 className="mt-4 font-display text-6xl text-mist sm:text-8xl">Lost in the clouds.</h1>
        <p className="mx-auto mt-5 max-w-md text-fog">The trail you followed doesn't lead anywhere. It happens to the best of us.</p>
        <Link href="/" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-cta px-8 text-[0.8rem] uppercase tracking-[0.16em] text-cta-fg hover:bg-cta-hover">
          Back to base camp
        </Link>
      </div>
    </main>
  );
}

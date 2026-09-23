import { getInstagramPosts } from "@/lib/instagram";
import { instagramUrl } from "@/lib/settings";
import { InstagramIcon } from "./icons";
import { Reveal } from "./Reveal";

export async function InstagramSection({ username }: { username: string }) {
  const profile = instagramUrl(username);
  const posts = await getInstagramPosts(profile);
  if (!posts.length) return null;

  return (
    <section className="py-24 sm:py-32" aria-labelledby="insta-heading">
      <div className="container-page">
        <Reveal className="mb-10 flex flex-col items-center text-center">
          <InstagramIcon width={28} height={28} className="text-ember" />
          <h2 id="insta-heading" className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-none text-heading">Follow the Journey</h2>
          {username && <p className="mt-3 text-fog">@{username.replace(/^@/, "")}</p>}
        </Reveal>
      </div>
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 no-scrollbar sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-8 lg:grid-cols-8 lg:px-12">
        {posts.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.04} className="w-[42vw] shrink-0 snap-start sm:w-auto">
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-[2px] bg-ash" aria-label={p.caption || "Instagram post"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.caption} loading="lazy" decoding="async" className="size-full object-cover transition duration-[1.2s] group-hover:scale-110" />
              <span className="surface-dark absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition duration-500 group-hover:opacity-100">
                <InstagramIcon className="text-mist" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
      {profile && (
        <div className="mt-12 text-center">
          <a href={profile} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-mist">
            <span className="border-b border-line/20 pb-1 transition group-hover:border-sand">Follow me on Instagram</span>
            <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
          </a>
        </div>
      )}
    </section>
  );
}

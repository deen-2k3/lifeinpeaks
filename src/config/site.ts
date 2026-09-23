// Defaults used before the database is seeded. Everything here can be overridden
// from Admin → Settings; the name can also be changed with NEXT_PUBLIC_SITE_NAME.
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Lifeinpeaks",
  tagline: "Collecting moments, chasing mountains.",
  description:
    "Mountain photography, Himalayan travel stories and little moments from the road — a personal travel journal from India.",
  nav: [
    { href: "/", label: "Home" },
    { href: "/journeys", label: "Destinations" },
    { href: "/stories", label: "Stories" },
    { href: "/photography", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  /** Extra links shown in the mobile menu */
  moreNav: [
    { href: "/mountains", label: "Mountains" },
    { href: "/memories", label: "Little Moments" },
    { href: "/map", label: "Travel Map" },
    { href: "/timeline", label: "Timeline" },
  ],
  pillars: ["Travel", "Photography", "Adventure", "Memories"],
  cta: { href: "/contact", label: "Plan Your Trip" },
  footerNav: [
    { href: "/", label: "Home" },
    { href: "/journeys", label: "Destinations" },
    { href: "/stories", label: "Stories" },
    { href: "/photography", label: "Gallery" },
    { href: "/mountains", label: "Mountains" },
    { href: "/memories", label: "Memories" },
    { href: "/map", label: "Travel Map" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
};

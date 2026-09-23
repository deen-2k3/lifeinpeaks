# Lifeinpeaks

*Collecting moments, chasing mountains.*

A personal travel & photography journal: cinematic trip pages, a justified photo gallery with lightbox, little-moment memories, a mountain gallery, an interactive travel map, a timeline, stories, search, favourites, and an admin dashboard to manage everything without touching code.

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS 4 · Framer Motion · PostgreSQL + Prisma · sharp (image pipeline) · Leaflet (map) · jose/bcrypt (admin auth) · local disk or Cloudinary storage.

---

## 1. Local development

Requirements: **Node 20+** and **PostgreSQL 14+**.

```bash
npm install
cp .env.example .env        # then edit .env (see below)
npm run db:migrate          # creates the database schema
npm run db:seed             # sample trips, photos, stories, memories + admin user
npm run dev                 # http://localhost:3000   ·   admin: http://localhost:3000/admin
```

The seed downloads ~70 placeholder photos from Unsplash once (cached in `.seed-cache/`) and runs them through the real upload pipeline, so it takes a couple of minutes the first time.

`npm run db:seed -- --reset` wipes **all** content and image files and re-seeds.

## 2. Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | ✔ | `postgresql://USER:PASSWORD@HOST:5432/lifeinpeaks?schema=public` |
| `NEXT_PUBLIC_SITE_URL` | ✔ in prod | Public URL – canonical URLs, sitemap, Open Graph |
| `AUTH_SECRET` | ✔ in prod | 32+ random chars for signing admin sessions. `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | seed only | First admin account created by `db:seed` |
| `STORAGE_PROVIDER` | | `local` (default) or `cloudinary` |
| `UPLOAD_DIR` | | Local storage folder (default `./storage`) – must be persistent |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | | Optional CDN origin in front of `/media` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER` | cloudinary | Cloudinary credentials |
| `INSTAGRAM_ACCESS_TOKEN` | | Shows real Instagram posts; otherwise featured photos are shown |
| `NEXT_PUBLIC_MAP_TILES` | | Custom map tile URL (default CARTO dark) |
| `NEXT_PUBLIC_SITE_NAME` | | Fallback name before the DB is seeded |

## 3. Database setup

Any PostgreSQL works (local, Neon, Supabase, Railway, RDS…).

```sql
-- optional: a dedicated user
CREATE USER lifeinpeaks WITH PASSWORD 'change-me';
CREATE DATABASE lifeinpeaks OWNER lifeinpeaks;
```

- Development: `npm run db:migrate` (creates/updates schema and migration files)
- Production: `npm run db:deploy` (applies committed migrations only)
- Browse data: `npm run db:studio`

## 4. Image storage

Every upload is analysed with sharp: orientation fixed, **EXIF camera data** (camera, lens, focal length, aperture, ISO, shutter, date) auto-filled, a tiny blurred placeholder and dominant colour stored for progressive loading.

**Local (default)** – originals are kept untouched in `storage/originals/` (never public). AVIF + WebP renditions at 480/960/1600/2400px go to `storage/variants/` and are served by `/media/...` with `Cache-Control: immutable` – put Cloudflare/CloudFront in front and set `NEXT_PUBLIC_MEDIA_BASE_URL`. On a VPS or Docker, mount `UPLOAD_DIR` as a persistent volume. *(Serverless hosts like Vercel have no persistent disk – use Cloudinary there.)*

**Cloudinary** – set `STORAGE_PROVIDER=cloudinary` and the three Cloudinary vars. Originals are uploaded to Cloudinary; resizing and AVIF/WebP happen on Cloudinary's CDN via URL transforms. Images uploaded before a switch keep working because each image records its provider.

Adding another provider (S3/R2): implement `StorageProvider` in `src/lib/storage/providers.ts` and a URL builder in `src/lib/images.ts`.

## 5. Admin account

- The seed creates one from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Create or reset any time:
  ```bash
  npm run admin:create -- --email you@example.com --password "a-long-password"
  ```
- Change your password in **Admin → Site & About**.

Security: bcrypt (cost 12) password hashes, signed HTTP-only `SameSite=Lax` session cookie (7 days), middleware + per-action checks on every admin page, server action and upload, login throttling (5 attempts / 15 min), `noindex` on admin.

## 6. Managing content

| Admin section | What you can do |
| --- | --- |
| **Trips** | Create/edit/delete, cover image, dates, places, map coordinates, Markdown story, featured, SEO, and bulk-upload photos straight into a trip |
| **Photos** | Drag-and-drop bulk upload, filter, bulk-assign trip/category/location, publish, feature, delete; edit captions, alt text, location, date, camera metadata, categories and stories |
| **Stories** | Markdown editor, cover, tags, related trip, publish date (future = scheduled), SEO |
| **Memories** | Photo, caption, date, location, trip |
| **Categories** | Portfolio & Mountains filter categories |
| **Site & About** | Site name, tagline, hero image, intro, profile photo, bio, statistics, Instagram username, social links, contact email, default SEO description, password |
| **Messages** | Contact-form inbox |

Every change revalidates the public site immediately.

## 7. Production deployment

### Option R – Render (Blueprint, Cloudinary storage) — recommended
1. Create a free [Cloudinary](https://cloudinary.com) account; note *cloud name*, *API key*, *API secret*.
2. Push this repo to GitHub, then in Render: **New → Blueprint** → select the repo. `render.yaml` creates a Postgres database and the web service (Singapore region).
3. Fill in the prompted values: `NEXT_PUBLIC_SITE_URL` (e.g. `https://lifeinpeaks.onrender.com`), `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. `AUTH_SECRET` is generated automatically.
4. Every deploy runs `prisma migrate deploy` then `next build`.
5. Create your admin (and optionally load the sample content) from your computer using the database's **External Database URL** (Render → database → Connect):
   ```bash
   # PowerShell: $env:DATABASE_URL="<external url>"; $env:STORAGE_PROVIDER="cloudinary"; …
   DATABASE_URL="<external url>" npm run admin:create -- --email you@example.com --password "long-password"
   DATABASE_URL="<external url>" STORAGE_PROVIDER=cloudinary NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=… CLOUDINARY_API_KEY=… CLOUDINARY_API_SECRET=… npm run db:seed
   ```
6. After changing `NEXT_PUBLIC_*` values, trigger a new deploy (they are baked in at build time).

Notes: the free web service sleeps after 15 min idle (first visit takes ~50 s to wake); Render's free Postgres expires after 30 days — upgrade the database plan to keep your data.

### Option A – VPS / Docker (local storage)
```bash
npm ci
npm run db:deploy
NEXT_OUTPUT=standalone npm run build
node .next/standalone/server.js     # copy .next/static and public next to it, or just use `npm start`
```
Run behind Nginx/Caddy with HTTPS; keep `UPLOAD_DIR` on a persistent disk and back it up with the database.

### Option B – Vercel / Netlify (Cloudinary storage)
1. Create a Postgres database (Neon, Supabase…) and a Cloudinary account.
2. Set all environment variables in the dashboard (`STORAGE_PROVIDER=cloudinary`).
3. Build command: `npm run db:deploy && npm run build`.
4. Create your admin: run `npm run admin:create` locally with the production `DATABASE_URL`.

The build needs database access (pages are pre-rendered and revalidated every 5 minutes or on admin changes).

## 8. Changing the name or look

- Name, tagline and all text: **Admin → Site & About** (fallback in `src/config/site.ts`).
- Colours: `src/app/globals.css` – brand palette and the light / `.surface-dark` token sets.
- Fonts: `src/app/layout.tsx` (Cormorant Garamond + Inter).

## 9. Project structure

```
prisma/            schema, seed script and sample data
scripts/           create-admin
src/app/(site)/    public pages (home, journeys, trips/[slug], photography, mountains, memories,
                   stories, map, timeline, about, contact, search, favorites)
src/app/admin/     login, dashboard and server actions
src/app/api/       photos feed, search, admin upload
src/app/media/     local image server
src/components/    Header, Footer, Hero, TripCard, PhotoGallery, PhotoLightbox, MemoryCard,
                   StoryCard, TravelMap, Timeline, SearchDialog, Statistics, InstagramSection, admin/*
src/lib/           queries, auth, settings, SEO, storage pipeline, favourites
```

## 10. SEO & performance notes

- Per-page titles, meta descriptions, canonical URLs, Open Graph/Twitter images, JSON-LD (WebSite, TouristTrip, BlogPosting, Person, BreadcrumbList), `sitemap.xml`, `robots.txt`, alt text on every image.
- Responsive AVIF/WebP `srcset`, lazy loading, blur-up placeholders, justified gallery that never crops, infinite "load more" pagination (30 per page), Leaflet loaded only when the map scrolls into view, CSS-only hero text animation, ISR caching.

Placeholder photos: [Unsplash](https://unsplash.com/license) – replace with your own before launch.

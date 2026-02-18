# Smart Bookmark

>A small Next.js app demonstrating a 3D reading view and a bookmark dashboard backed by Supabase.

This repository contains a landing site with interactive 3D book scenes (React Three Fiber), a dashboard for saving bookmarks (Supabase), and a compact UI built with Tailwind + Radix primitives.

**Quick summary:**
- Framework: Next.js (App Router) + TypeScript
- UI: Tailwind CSS + Radix-based UI primitives
- 3D: react-three-fiber + @react-three/drei
- Backend: Supabase (Auth + Postgres)

---

**Table of contents**
- [Features](#features)
- [Tech stack](#tech-stack)
- [Files of interest](#files-of-interest)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [Database schema (bookmarks)](#database-schema-bookmarks)
- [Run and build](#run-and-build)
- [3D models and performance](#3d-models-and-performance)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Features

- Interactive 3D hero and reading view (open book)
- Google sign-in via Supabase OAuth
- Save, favorite, and delete bookmarks persisted in Supabase
- Responsive dashboard with search, sort, and favorites filter
- Small UX / performance improvements: reduced-motion respect, visibility-aware rendering tweaks, and hover animations

## Tech stack

- Next.js 13 (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase JS client (auth + db)
- @react-three/fiber & @react-three/drei for 3D
- Radix UI primitives (dialog/sheet, scroll area, form building blocks)

## Files of interest

- `app/` — top-level Next app routes/layouts
- `components/` — UI components (hero, landing, dashboard, bookmarks)
  - `components/BookModel.tsx`, `OpenBookModel.tsx` — 3D scenes
  - `components/Hero.tsx` — landing hero and Sign in button
  - `components/landing/HowItWorksSection.tsx` — landing section with callout
  - `components/dashboard/DashboardClient.tsx` — dashboard client logic (fetch/update/delete)
  - `components/bookmarks/*` — bookmark form, list, and cards
- `lib/supabaseClient.ts` — creates Supabase client (reads env vars)
- `lib/auth.ts` — small wrappers for sign in/out
- `hooks/useUser.ts` — client hook that subscribes to Supabase auth state
- `public/models/` — 3D GLB assets referenced by the scenes

## Local setup

Prerequisites:

- Node.js 18+ and npm
- A Supabase project (free tier ok)

Steps:

1. Copy the repository locally and change into the `project` folder:

```bash
cd project
npm install
```

2. Create a `.env.local` in the `project` folder with the required variables (see below).

3. Start the dev server:

```bash
npm run dev
```

The app runs on the default Next.js port (3000). The dev server or Next may choose a different port if 3000 is in use — check the terminal output.

## Environment variables

Create `project/.env.local` with at least:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Notes:

- If you need server-side service-role access (not used by the app currently), keep the key secret and do NOT commit it.
- For OAuth (Google) sign-in, add your dev redirect URL(s) in the Supabase dashboard (e.g. `http://localhost:3000` and any other host/port you use).

## Database schema (bookmarks)

The app expects a `bookmarks` table with at least these columns:

- `id` (uuid or text) — primary key
- `user_id` (uuid/text) — references Supabase user id
- `title` (text)
- `url` (text)
- `notes` (text, nullable)
- `tags` (jsonb or text array)
- `favorite` (boolean, default false)
- `created_at` (timestamp, default now())

SQL (Postgres) example to create the table:

```sql
create table public.bookmarks (
  id uuid primary key,
  user_id uuid not null,
  title text not null,
  url text not null,
  notes text,
  tags jsonb,
  favorite boolean default false,
  created_at timestamp with time zone default now()
);
```

If `tags` is stored as a text column (CSV or JSON string), the client will try to parse it — `components/dashboard/DashboardClient.tsx` maps DB rows into the internal Bookmark type.

## Run and build

- Dev server:

```bash
npm run dev
```

- Build for production:

```bash
npm run build
npm run start
```

## 3D models and performance notes

- The 3D scenes load GLB files from `public/models/`. Ensure the `.glb` assets are present there.
- The components include performance considerations:
  - Reduced particle counts / disabled float when `prefers-reduced-motion` is enabled.
  - Canvas frameloop adjustments to reduce GPU usage when appropriate.
  - Subtle mouse-tilt/parallax interactions for UX.

If you need even more performance, consider lazy-loading `three` and `drei` with dynamic imports and unmounting canvases that are off-screen.

## Behavior notes (auth & UI)

- Signing: the hero's primary CTA calls `lib/auth.signInWithGoogle()` (Supabase OAuth). After signing in you'll be redirected by Supabase to the app URL — make sure redirect URLs are configured.
- When signed in, the header's **Get started** link converts to a logout action.
- Bookmark create/update/remove operations use the Supabase client in `lib/supabaseClient.ts` and persist to the `bookmarks` table.

## Troubleshooting

- TypeScript path alias errors for `@/lib/auth` or similar: ensure `tsconfig.json` has `baseUrl` and `paths` configured, or use relative imports.
- If 3D models do not appear, verify `public/models/*.glb` exist and the browser console shows no 404 requests.
- If OAuth redirects fail, ensure the Supabase project's OAuth redirect URLs include your local dev origin.
- If the dev server fails to start with a syntax error, check the terminal error location and re-open the file to inspect braces/exports.

## Contributing

- Keep UI changes small and consistent with Tailwind utility patterns used across the repo.
- When adding features that change DB columns, update the README schema and migration scripts (if you use them).

## License

This project doesn’t include a license file. Add one (`LICENSE`) if you plan to publish or share the project.

---

If you'd like, I can add a setup script to initialize the Supabase table, or create a small migration SQL file for the `bookmarks` table. Which would you prefer next?

# SDA - Sustainable Development Advocates
* Latest Deployment for Next JS Migration: 22 Oct 2026 | 3:57 PM

This website showcases the mission, events, team members, and joining information of the Sustainable Development Advocates organization at the University of Lagos.

## Technologies Used

- **Next.js 15** (App Router)
- **React 19** and **TypeScript**
- **Tailwind CSS** (utilities; legacy layout CSS kept, Preflight off to avoid double resets)
- **Theme** — colors and font stacks defined only in `tailwind.config.ts` (no `:root` CSS variables)
- **JSON** data in `data/` for events and team members
- **Supabase** for homepage CMS content and media

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.13+ (recommended for tooling compatibility)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm start
```

## Homepage content

The homepage CMS blocks are loaded from Supabase by the slug `home`. Team members, Join Us events, and the hardcoded homepage sections stay in this repo.

Set these in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

On a new Supabase project, run these in the SQL editor in order:

- `supabase/sql/001_schema.sql`
- `supabase/sql/002_rls.sql`
- `supabase/sql/003_storage.sql`
- `supabase/sql/004_get_page.sql`

## Project layout

- `app/` — App Router pages (`/`, `/join-us`, etc.) and global styles entry
- `components/` — Header, footer, homepage sections, team carousel, join-us events
- `lib/` — Supabase server client and homepage loader
- `supabase/sql/` — schema, access policies, storage, and the page loader
- `data/` — `team-members.json` and `events.json`
- `public/` — Static assets (images and fonts)
- `tailwind.config.ts` — **Colors and fonts** (`theme.extend`)
- `app/globals.css` — Tailwind entry, Satoshi import, base reset, and `.section` horizontal padding utility; page UI lives in components with Tailwind

## Customization

### Colors and fonts

1. Edit **`tailwind.config.ts`** — `theme.extend.colors`, `theme.extend.fontFamily`, and the `fontSans` array at the top.

Use Tailwind utilities in `app/` and `components/` (for example `text-primary-600`, `bg-gray-50`, `font-sans`). The root layout uses `font-sans bg-white text-gray-800`.

Layout chrome (header, footer, home page, team carousel) uses Tailwind utility classes in `components/` and `app/page.tsx`. The join-us route is styled the same way.

### Fonts (files)

Satoshi is loaded from `public/fonts/satoshi/css/satoshi.css`. Add the font files under `public/fonts/satoshi/fonts/` if they are not already present.

---

**Built with love for Sustainable Development Advocates - SDA Unilag**

- Instagram: [@sdaunilag](https://instagram.com/sdaunilag)
- Twitter: [@sdaunilag](https://twitter.com/sdaunilag)
- LinkedIn: [SDA Unilag](https://www.linkedin.com/company/sdaunilag)
- YouTube: [Sustainable Development Advocates](https://www.youtube.com/@sustainabledevelopmentadvo7259)

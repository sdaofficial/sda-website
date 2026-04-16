# SDA - Sustainable Development Advocate

This website showcases the mission, events, team members, and joining information of the Sustainable Development Advocate organization at the University of Lagos.

## Technologies Used

- **Next.js 15** (App Router)
- **React 19** and **TypeScript**
- **Tailwind CSS** (utilities; legacy layout CSS kept, Preflight off to avoid double resets)
- **Theme** — colors and font stacks defined only in `tailwind.config.ts` (no `:root` CSS variables)
- **JSON** data in `data/` for events and team members

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

## Project layout

- `app/` — App Router pages (`/`, `/join-us`, etc.) and global styles entry
- `components/` — Header, footer, team carousel, join-us events and modal
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
- YouTube: [Sustainable Development Advocate](https://www.youtube.com/@sustainabledevelopmentadvo7259)

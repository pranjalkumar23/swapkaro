# SwapKaro

A barter marketplace — list what you have, browse what others want, propose a swap, and track it
through to a match.

## What it does

- **List items** you want to trade, with category, condition, and photos.
- **Post a "wanted"** listing for things you're looking for.
- **Propose swaps** between your items and someone else's, including optional cash top-ups.
- **Match and track** proposals through a dashboard, with city-proximity-aware matching so nearby
  trades surface first.
- Session-based auth (signup/login) scoped per user.

## Stack

- Next.js 16 (App Router, Server Actions)
- Zod for input validation
- Cookie-based sessions (`src/lib/session.ts`)
- In-memory data store (`src/lib/store.ts`) — intentionally no external database; data resets on
  server restart. This is a prototype/demo data layer, not a production persistence choice.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Why no live demo

This runs as a server (Next.js Server Actions need a Node runtime), so it can't be hosted as a
static GitHub Pages site. It also doesn't persist data across restarts, by design. The source here
is the full, real implementation; wiring it to a database and deploying to something like Vercel
would be the next step if this became a real product.

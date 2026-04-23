# Refreshed By Revved

Mobile car detailing website for a Miami-based business.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **UI**: React 19, shadcn/ui, Tailwind CSS v4
- **Database**: Neon (PostgreSQL) + Drizzle ORM
- **Auth**: NextAuth v5 (credentials provider)
- **Payments**: Multi-provider (Stripe, Square, Authorize.net) via env vars
- **Rate Limiting**: Upstash Redis
- **Testing**: Vitest (unit), Playwright (E2E)
- **Hosting**: Vercel

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public pages (home, booking, services)
│   ├── (admin)/admin/      # Admin dashboard (protected)
│   ├── api/                # API routes
│   │   ├── products/
│   │   ├── bookings/
│   │   ├── leads/
│   │   └── checkout/
│   └── layout.tsx
├── components/
│   ├── ui/                 # shadcn components
│   └── ...                 # App components
├── lib/
│   ├── db/                 # Drizzle schema & client
│   ├── auth/               # NextAuth config
│   ├── payments/           # Payment provider abstractions
│   └── utils.ts
└── styles/
```

## Key Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm test         # Run Vitest unit tests
pnpm test:e2e     # Run Playwright E2E tests
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```

## Design System

Reference designs in `docs/` folder:
- `stitch-homepage.html` - Homepage design
- `booking-system.html` - Booking flow design

**Theme**: Dark mode, cyan accents (#00f0ff)
**Fonts**: Space Grotesk (headlines), Inter (body)
**Style**: Aggressive, performance-inspired, chamfered shapes

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/products` | GET | - | List products/services |
| `/api/products` | POST/PUT/DELETE | Admin | Manage products |
| `/api/bookings` | POST | - | Create booking (rate-limited) |
| `/api/bookings` | GET/PUT/DELETE | Admin | Manage bookings |
| `/api/leads` | POST | - | Submit contact form |
| `/api/checkout/[id]` | GET | - | Redirect to payment |

## Environment Variables

See `.env.example` for required variables.

## Code Guidelines

1. Follow existing patterns in codebase
2. Keep components simple, avoid over-engineering
3. Use server components by default, client only when needed
4. Validate all inputs with Zod
5. Test critical paths with Playwright

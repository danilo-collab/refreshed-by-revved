# Refreshed By Revved

Premium mobile car detailing service in Miami, FL.

## Features

- **Homepage**: Premium landing page with services, pricing, and booking CTA
- **Booking System**: Multi-step booking flow with calendar scheduling
- **Services**: Detailed service packages (Essential, Full Detail, VIP Showroom)
- **Monthly Subscription**: Recurring detailing plans
- **Admin Dashboard**: Manage products, bookings, and leads
- **Multi-Provider Payments**: Stripe, Square, or Authorize.net

## Tech Stack

- Next.js 16+ (App Router)
- React 19, TypeScript
- Tailwind CSS v4, shadcn/ui
- Neon PostgreSQL, Drizzle ORM
- NextAuth v5
- Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Neon database (or Docker for local PostgreSQL)

### Installation

```bash
# Clone the repo
git clone https://github.com/danilo-collab/refreshed-by-revved.git
cd refreshed-by-revved

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
DATABASE_URL=           # Neon PostgreSQL connection string
NEXTAUTH_SECRET=        # Random secret for NextAuth
NEXTAUTH_URL=           # http://localhost:3000 for dev

# Payment providers (enable at least one)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
SQUARE_ACCESS_TOKEN=
SQUARE_LOCATION_ID=
AUTHORIZENET_API_LOGIN=
AUTHORIZENET_TRANSACTION_KEY=

# Rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run unit tests
pnpm test:e2e     # Run E2E tests
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
pnpm db:generate  # Generate migrations
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages
│   ├── (admin)/admin/     # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   └── ui/               # shadcn components
├── lib/                   # Utilities
│   ├── db/               # Database schema
│   ├── auth/             # Auth config
│   └── payments/         # Payment providers
└── types/                 # TypeScript types
```

## License

Private - All rights reserved.

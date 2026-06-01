# Touchstone Builders — Project Memory

> **Last updated:** June 1, 2026
> **Project directory:** `C:\Touchstone Builders\touchstone-builders`
> **GitHub:** https://github.com/aasccorporation-netizen/TouchstoneBuilders
> **Latest commit:** `9eb73d2` — "Phase 1 foundation: Next.js + Supabase + auth + dashboard"

---

## 1. Project Overview

A full-featured inventory management, sales, and reporting system for **Touchstone Builders Supply** — a hardware and construction supply store. Designed to be intuitive enough for a high school student to use.

### Architecture
- **Frontend/Backend:** Next.js 16.2.6 (App Router)
- **Database:** Supabase (PostgreSQL) — project ref: `nfqzvfizcjpqphulemnl`
- **Auth:** Supabase Auth (email/password)
- **UI:** shadcn/ui v4 (base-nova style) + Tailwind CSS v4
- **Hosting:** Vercel (via GitHub, not yet deployed — testing locally first)
- **GitHub:** https://github.com/aasccorporation-netizen/TouchstoneBuilders
- **Language:** TypeScript (strict mode)

---

## 2. Supabase Credentials

Stored in `.env.local` (gitignored) and `supabase.txt` (project root).

| Key | Value |
|---|---|
| Project URL | `https://nfqzvfizcjpqphulemnl.supabase.co` |
| Project Ref | `nfqzvfizcjpqphulemnl` |
| Anon Public Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcXp2Zml6Y2pwcXBodWxlbW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTQ2OTUsImV4cCI6MjA5NTg5MDY5NX0.qXRABEJedhfa7i4I7Uop3q0CpjEq2HYWnAa7BGllOu4` |
| Service Role Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcXp2Zml6Y2pwcXBodWxlbW5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDMxNDY5NSwiZXhwIjoyMDk1ODkwNjk1fQ.-RWV5x4Ke40ju-NlF0nHdEm7-5bpioHikcxKLQJOrX4` |
| Publishable API Key | `sb_publishable_S9SWon8lhNXYgYyURYXlSw_npfc4S9A` |

---

## 3. Tech Stack & Dependencies

### Production Dependencies
| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.6 | Framework |
| `react` / `react-dom` | 19.2.4 | UI library |
| `@supabase/supabase-js` | ^2.106.2 | Supabase core SDK |
| `@supabase/ssr` | ^0.10.3 | Next.js SSR auth helpers |
| `@base-ui/react` | ^1.5.0 | shadcn/ui base primitives |
| `lucide-react` | ^1.17.0 | Icons |
| `recharts` | ^3.8.1 | Charts (for reports) |
| `react-hook-form` | ^7.77.0 | Form handling |
| `zod` | ^4.4.3 | Validation |
| `class-variance-authority` | ^0.7.1 | Component variants |
| `tailwind-merge` / `clsx` | — | Class utilities |
| `tw-animate-css` | ^1.4.0 | CSS animations |

### Dev Dependencies
| Package | Version | Purpose |
|---|---|---|
| `typescript` | ^5 | Type checking |
| `tailwindcss` | ^4 | CSS framework |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin |
| `eslint` | ^9 | Linting |
| `eslint-config-next` | 16.2.6 | Next.js ESLint config |

---

## 4. Project File Structure

```
touchstone-builders/
├── .env.local                          # Supabase credentials (gitignored)
├── .env.local.example                  # Template for env vars
├── .gitignore                          # Ignores node_modules, .env.local, .next, etc.
├── supabase.txt                        # All Supabase keys (DO NOT COMMIT)
├── package.json                        # Dependencies & scripts
├── next.config.ts                      # Next.js config (empty)
├── tsconfig.json                       # TypeScript config with @/ alias
├── components.json                     # shadcn/ui config
├── postcss.config.mjs                  # PostCSS with Tailwind
├── eslint.config.mjs                   # ESLint flat config
├── db/
│   ├── schema.sql                      # Full PostgreSQL schema (10 tables + RLS + triggers)
│   └── seed.ts                         # Seed script: 10 categories, 56 products, 8 customers, 8 suppliers
├── public/                             # Static assets (favicon, images)
├── src/
│   ├── middleware.ts                   # Session refresh via Supabase SSR middleware
│   ├── lib/
│   │   ├── utils.ts                    # cn() utility (clsx + tailwind-merge)
│   │   └── supabase/
│   │       ├── client.ts               # Browser client (createBrowserClient)
│   │       ├── server.ts               # Server component client (createServerClient + cookies)
│   │       └── middleware.ts           # Middleware client (createServerClient + request cookies)
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (Geist fonts, metadata)
│   │   ├── globals.css                 # Tailwind v4 + shadcn theme variables
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx              # Dashboard layout (Sidebar + Header + Sheet for mobile)
│   │   │   ├── page.tsx                # Dashboard homepage (stats cards, low stock, recent sales)
│   │   │   ├── inventory/page.tsx      # Placeholder
│   │   │   ├── sales/page.tsx          # Placeholder
│   │   │   ├── customers/page.tsx      # Placeholder
│   │   │   ├── suppliers/page.tsx      # Placeholder
│   │   │   ├── reports/page.tsx        # Placeholder
│   │   │   └── settings/page.tsx       # Placeholder
│   │   ├── auth/
│   │   │   ├── login/page.tsx          # Login page (HardHat icon, email/password form)
│   │   │   ├── callback/route.ts       # OAuth callback handler
│   │   │   └── auth-code-error/page.tsx # Error page for auth failures
│   │   └── actions/
│   │       └── auth.ts                 # Server actions: login, signup, logout, getUser
│   └── components/
│       ├── shared/
│       │   ├── Sidebar.tsx             # Sidebar nav (7 items, responsive, mobile sheet)
│       │   └── Header.tsx              # Top header (user avatar dropdown, mobile menu toggle)
│       └── ui/                         # shadcn/ui components (13 total)
│           ├── button.tsx              # @base-ui/react button with variants
│           ├── card.tsx
│           ├── input.tsx
│           ├── label.tsx
│           ├── badge.tsx
│           ├── separator.tsx
│           ├── avatar.tsx
│           ├── dropdown-menu.tsx
│           ├── table.tsx
│           ├── select.tsx
│           ├── dialog.tsx
│           └── sheet.tsx
```

---

## 5. Database Schema (10 Tables)

All tables are in the `public` schema with Row Level Security (RLS) enabled.

### Tables

| # | Table | Key Columns | Indexes |
|---|---|---|---|
| 1 | `users` | `id` (FK to auth.users), `name`, `role` (admin/cashier), `phone`, `active` | — |
| 2 | `categories` | `id`, `name`, `slug` (UNIQUE), `description`, `parent_id` (self-ref FK) | — |
| 3 | `products` | `id`, `sku` (UNIQUE), `name`, `category_id`, `unit`, `cost_price`, `selling_price`, `stock_quantity`, `reorder_level`, `image_url`, `active` | `category_id`, `sku`, `low_stock` (partial) |
| 4 | `customers` | `id`, `name`, `phone`, `email`, `address`, `notes` | `name`, `phone` |
| 5 | `suppliers` | `id`, `name`, `contact_person`, `phone`, `email`, `address`, `notes` | — |
| 6 | `sales` | `id`, `receipt_number` (UNIQUE), `customer_id`, `total_amount`, `discount`, `tax`, `grand_total`, `payment_method`, `payment_status`, `user_id` | `created_at`, `customer_id` |
| 7 | `sale_items` | `id`, `sale_id` (FK CASCADE), `product_id`, `quantity`, `unit_price`, `subtotal` | `sale_id` |
| 8 | `purchase_orders` | `id`, `po_number` (UNIQUE), `supplier_id`, `status`, `total_cost`, `notes`, `user_id` | — |
| 9 | `purchase_order_items` | `id`, `po_id` (FK CASCADE), `product_id`, `quantity`, `unit_cost`, `subtotal`, `received_quantity` | — |
| 10 | `inventory_transactions` | `id`, `product_id`, `type` (sale/purchase/adjustment/return/transfer), `quantity`, `reference_type`, `reference_id`, `note`, `user_id` | `product_id`, `created_at` |

### Unit Options (products table)
`piece`, `box`, `bundle`, `roll`, `bag`, `cubic_meter`, `linear_foot`, `square_foot`, `gallon`, `liter`, `kg`, `lb`

### Payment Methods
`cash`, `card`, `credit`, `transfer`

### RLS Policies
- **Users** can read/update their own profile; admins can manage all users
- **Products/Categories/Customers/Suppliers** — all authenticated users can read; only admins can write (insert/update/delete)
- **Sales/Sale_items** — all authenticated users can create and read
- **Inventory_transactions** — all authenticated users can create and read

### Triggers
1. `on_auth_user_created` — Auto-creates a `public.users` record when a new Supabase Auth user signs up (sets role to 'cashier' by default)
2. `update_products_updated_at` — Auto-updates `updated_at` on product changes
3. `update_purchase_orders_updated_at` — Auto-updates `updated_at` on PO changes

---

## 6. Seed Data

Run with: `npx tsx db/seed.ts`

### Categories (10)
Lumber & Plywood, Plumbing, Electrical, Tools, Paint & Coatings, Hardware, Concrete & Masonry, Roofing & Gutters, Flooring, Doors & Windows

### Products (56)
Spread across all 10 categories with realistic hardware store data:
- **Lumber (7):** Plywood sheets, dimensional lumber (2x4, 2x6), PT posts, OSB, deck boards
- **Plumbing (7):** PVC pipes & fittings, brass valves, copper pipe, frost-free faucet
- **Electrical (6):** Romex wire, switches, outlets, GFCI, circuit breakers
- **Tools (8):** Hammer, drill, tape measure, level, screwdriver, circular saw, wrench, utility knife
- **Paint (6):** Interior/exterior paint, primer, wood stain, brushes, roller
- **Hardware (6):** Nails (8d, 16d), deck screws, hex bolts, hinges
- **Concrete (4):** Cement bags, concrete mix, rebar, bricks
- **Roofing (4):** Shingles, step flashing, gutters, ridge vent
- **Flooring (3):** Ceramic tile, vinyl plank, laminate
- **Doors/Windows (5):** Interior and exterior doors, windows

### Customers (8)
Mix of contractors (Acme Construction, Walker Renovations, Pioneer Homes, GreenLeaf Contracting, Summit Builders) and individuals (David Thompson, Maria Santos, Robert Chen)

### Suppliers (8)
Builders Supply Co, National Lumber Inc, Pipe & Fittings Direct, Power Tools Warehouse, Paint Mart Distributors, Fastener World, Concrete Solutions Inc, Roofing Supply Depot

---

## 7. Auth System

### Flow
1. User visits any page → `middleware.ts` runs session refresh via `@supabase/ssr`
2. If not authenticated and not on `/auth/*`, redirected to `/auth/login`
3. If authenticated and on `/auth/*`, redirected to `/` (dashboard)
4. Login via email/password on `/auth/login` using Supabase Auth
5. On successful login, redirected to dashboard `/`
6. Logout via dropdown menu in header → clears session → redirects to login

### Files
- `src/middleware.ts` — Session refresh (NOTE: currently only refreshes, does NOT redirect unauthenticated users — needs route protection logic added)
- `src/app/auth/login/page.tsx` — Login form with branding (HardHat icon)
- `src/app/auth/callback/route.ts` — Handles OAuth code exchange
- `src/app/auth/auth-code-error/page.tsx` — Error page for auth failures
- `src/app/actions/auth.ts` — Server actions (login, signup, logout, getUser)

---

## 8. UI Components

### Layout
- **Root layout** (`src/app/layout.tsx`): Geist sans + mono fonts, full-height HTML
- **Dashboard layout** (`src/app/(dashboard)/layout.tsx`): Client component with Sidebar + Header + mobile Sheet drawer
- **Sidebar** (`src/components/shared/Sidebar.tsx`): Fixed width (256px), hidden on mobile, 7 nav items with active state, HardHat logo
- **Header** (`src/components/shared/Header.tsx`): User avatar dropdown with email display and sign-out, hamburger menu for mobile

### Dashboard Page
- 4 stat cards (Total Products, Today's Sales, Active Customers, Revenue This Month) — currently mock data
- Low Stock Alerts card with badge indicators
- Recent Sales card with customer/time/total
- "New Sale" button linking to `/sales`
- Responsive grid layout (1 column mobile → 2 columns tablet → 4 columns stat cards desktop)

### Login Page
- Centered card with gradient background
- HardHat brand icon (amber-500)
- Email/password form with validation
- Error state display with AlertCircle icon
- Loading state on submit

---

## 9. Build Status

✅ Build passes cleanly — `npm run build` succeeds with zero TypeScript errors.
✅ 13 pages compiled (dashboard + 6 section placeholders + login + callback + error page + layout files)
✅ Lint passes cleanly — `npm run lint` reports zero errors, zero warnings.
⚠️ Warning: Next.js middleware file convention is deprecated — should migrate to `proxy` convention in future.

---

## 10. Git Status

- Initialized as a git repo on `master` branch
- First commit: `9eb73d2` — 51 files, 13,452 insertions
- Git user configured locally (not global): Touchstone Admin <admin@touchstonebuilders.com>
- `.gitignore` excludes: `node_modules/`, `.next/`, `.env.local`, `.env*.local`, `next-env.d.ts`

---

## 11. Known Issues & TODOs

### Issues
1. **Middleware does not redirect unauthenticated users** — `src/middleware.ts` only refreshes session cookies but doesn't redirect to `/auth/login` if no user found. Need to add route protection logic.
2. **No admin user created yet** — Need to create a Supabase Auth user via the dashboard or API to actually log in.
3. **shadcn/ui uses `@base-ui/react`** — Components like `Button` and `DropdownMenuTrigger` do NOT support the `asChild` prop (Radix Slot pattern). Instead use `render` prop or direct styling.

### TODO for Phase 2
- Build Product Catalog (CRUD for products & categories)
- Build Inventory Management (stock levels, adjustments)
- Build Point of Sale interface
- Replace mock dashboard data with real Supabase queries
- Create admin user in Supabase Auth
- Deploy to Vercel (after local testing)
- Add proper route protection in middleware (redirect unauthenticated users)
- Create admin user in Supabase Auth

---

## 12. Recent Changes (June 1, 2026)

### Lint & Key Prop Fixes
- **Sidebar.tsx** — Added missing `key={item.href}` prop to `<Link>` in `navItems.map()` (resolved "each child in a list should have a unique key" console warning)
- **db/seed.ts** — Removed unused `conflictColumn` parameter from `upsert()`, changed `let` to `const` for `categoryMap`, replaced `any` with generic `<T>` type, cleaned up all `upsert()` call sites
- **categories/page.tsx** — Removed unused imports (`Edit`, `Link`, `useCallback`), refactored `fetchData` from `useCallback` to plain async function with async IIFE in `useEffect` to fix `set-state-in-effect` lint error, fixed `supabase` scoping in event handlers (now creates client locally)
- **inventory/page.tsx** — Removed unused `useRouter` import and `router` variable

### Browser Testing
- Tested via browser-use agent: login page, auth routes, private route redirections, favicon, responsiveness all working correctly
- No console errors found after key prop fix

---

## 13. Useful Commands

```bash
# Development
npm run dev           # Start dev server on localhost:3000

# Build
npm run build          # TypeScript check + production build

# Seed Database
npx tsx db/seed.ts     # Insert seed data (idempotent, uses upsert)

# Lint
npm run lint           # Run ESLint

# TypeScript Check (no build)
npx tsc --noEmit       # Quick type check without building
```

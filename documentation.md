You are a senior full-stack engineer and UI/UX designer.

Build a high-quality, production-ready expense tracker web application using Next.js with a modern fintech-style UI, inspired by the provided reference image.

The app should be:

Extremely easy to track expenses

Highly readable

Clean, minimal, and premium

Backed by a real database (Neon PostgreSQL)

🧱 Tech Stack
Frontend


Next.js (latest, App Router)

TypeScript

Tailwind CSS

shadcn/ui

Recharts or Chart.js

Fully responsive (mobile-first)

Backend / Database

Neon PostgreSQL

Prisma ORM

Server Actions (preferred) or API Routes

Secure environment variable usage

⚠️ Do NOT use localStorage for expenses

🗄 Database Setup (Very Important)
Use Neon PostgreSQL

I will provide the Neon database connection string

Use it via DATABASE_URL in .env

Prisma Schema (Expected)

Design tables such as:

User

Category

Expense

Wallet (optional)

MonthlySummary

Include:

UUID primary keys

Proper relations

Indexes for date & category queries

🎨 UI / Design Requirements
Design Style

Modern

Minimal

Fintech-grade

Rounded cards

Soft shadows

High contrast for readability

Smooth transitions

Color System

Light background (off-white)

Category accent colors:

Groceries → Purple

Transport → Blue

Entertainment → Green

Rent & Utilities → Orange

📱 Pages & Features
1️⃣ Dashboard

Total balance / total spending

Quick action buttons (Add / Move / Send / Details)

Category cards with totals (fetched from DB)

Latest transactions list (real DB data)

Sticky bottom action bar (mobile)

2️⃣ Wallet / Category Details

Category total

Monthly expense line graph (DB driven)

Month navigation

Transaction search

Paginated transaction list

3️⃣ Spend Analysis

Total spending summary

Category-wise spending chart

Smart category suggestions

Filters by month / date range

4️⃣ Add Expense Flow

Modal or bottom sheet

Amount input (primary focus)

Category selector (icons + colors)

Date picker

Notes

Save to PostgreSQL

🧠 UX & Product Quality

Minimal clicks to add expense

Loading skeletons

Empty states

Error handling (DB + network)

Optimistic UI updates

Accessible font sizes

Smooth micro-interactions

🗂 Folder Structure
app/
 ├─ dashboard/
 ├─ wallet/
 ├─ analysis/
 ├─ actions/        // server actions
 ├─ components/
 ├─ db/
 ├─ lib/
 ├─ types/
 └─ styles/

🔐 Security & Best Practices

Use server-only DB access

No DB logic in client components

Validate inputs

Protect environment variables

Clean Prisma migrations

📦 Optional Advanced Features

Authentication (NextAuth / Clerk)

Multi-wallet support

Monthly budget limits

Dark / Neon theme

CSV / Excel export

Offline read caching

📌 Output Expectation

Clean, scalable Next.js code

Prisma schema & migrations

Neon PostgreSQL integration

Beautiful, production-quality UI

Clear comments where required

Focus on real-world app quality
# RESQID Dashboard — Next.js (Plain JS + Shadcn/ui)

A B2B SaaS school safety platform dashboard by coreZ Technologies.

---

## Tech Stack
- Next.js 14 (App Router)
- Plain JavaScript (no TypeScript)
- Tailwind CSS
- Shadcn/ui components
- JWT auth via httpOnly cookies (connects to existing Node.js backend)

## Two Roles
- Super Admin — /superadmin/* (coreZ internal, sees all schools)
- School Admin — /school/* (per-school, plan-gated modules)

## Plan Gating
- Basic       → Attendance only
- Standard    → Attendance + Timetable
- Professional → Attendance + Timetable + Emergency
- Enterprise  → All 4 modules

## Getting Started
1. cp .env.example .env.local
2. Fill in NEXT_PUBLIC_API_URL and JWT_SECRET
3. npm install
4. npx shadcn@latest init
5. npm run dev

## Environment Variables (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=your_secret_here
NEXT_PUBLIC_APP_NAME=RESQID
NEXT_PUBLIC_COMPANY=coreZ Technologies

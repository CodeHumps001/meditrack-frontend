# MediTrack Frontend

Next.js 14 (App Router) + TypeScript + Tailwind frontend for the MediTrack hospital attendance API.

## Setup

```bash
npm install
cp .env.local.example .env.local
# edit .env.local if your API isn't on localhost:5000
npm run dev
```

## Structure

- `src/app/(auth)` — login, register (admin bootstrap)
- `src/app/(employee)` — employee dashboard, attendance, leave, profile
- `src/app/(admin)` — admin/HR dashboard, employees, departments, leave requests, reports, backups
- `src/lib/api.ts` — fetch wrapper with automatic access-token refresh on 401
- `src/context/AuthContext.tsx` — login/register/logout, persists session to localStorage

## Routing model

Both `(employee)` and `(admin)` layouts are client-side guards (`useAuth()` + redirect), since the backend issues Bearer tokens, not cookies — a `middleware.ts` edge guard won't have access to the token. `ADMINISTRATOR`, `HR_MANAGER`, and `DEPARTMENT_HEAD` roles land in `/admin/*`; `EMPLOYEE` lands in `/dashboard`.

## Known backend issues worth fixing (not blocking, but flagged)

1. **`logger.error()` prints `{}` for real Error objects.** `JSON.stringify(error)` on a native `Error` returns `{}` because its properties aren't enumerable. Fix: log `error.message` and `error.stack` explicitly. Until fixed, your server logs won't show the actual cause of failures — worth prioritizing since it makes all future debugging harder.
2. **Recurring `PrismaClientValidationError`** in `Complete profile`, `Get my attendance`, and `Apply leave` (per your `error-2026-07-01.log`) — likely a field/type mismatch between what the frontend sends and what Prisma expects. I've matched the frontend payload shapes to your validators/services as closely as possible, but worth testing each of those three flows first since they were already failing before the frontend existed.
3. **`POST /auth/register` accepts an optional `role` field** with no restriction on who can call it — meaning anyone could self-register as `ADMINISTRATOR` today. The frontend here only exposes it as an "admin bootstrap" screen and never sends a `role`, but the backend itself should probably lock this down (e.g. only allow public registration for the very first user, then require an existing admin to create further admins).

## Not implemented

- Backend has no endpoint to invite additional Admin/HR/Dept Head users after the first `/auth/register` — only Employees can be created via the Employees page. Worth adding an "Invite admin" backend route if you need multiple admin accounts.

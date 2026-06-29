# Free Deployment Guide

This deploys the whole system on free tiers:

| Part | Service | Notes |
|------|---------|-------|
| Database | **Neon** (Postgres) | Free serverless Postgres |
| Backend (`/backend`) | **Render** (Web Service) | Free; sleeps after ~15 min idle (first request after sleep is slow) |
| Frontend (`/frontend`) | **Vercel** | Free Hobby tier |

> Make sure the project is pushed to a GitHub repo first — Render and Vercel deploy from GitHub.

---

## 1. Database — Neon

1. Sign up at https://neon.tech and create a project (pick a region near your users).
2. Copy the **connection string** (looks like `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`).
3. Keep it for the backend's `DATABASE_URL`.

---

## 2. Backend — Render

1. Sign up at https://render.com → **New → Web Service** → connect your GitHub repo.
2. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
3. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | the Neon connection string |
   | `JWT_SECRET` | a long random string |
   | `EMAIL_USER` | your Gmail address |
   | `EMAIL_PASS` | your 16-char Google App Password |
   | `FRONTEND_URL` | your Vercel URL (add after step 3, e.g. `https://xxx.vercel.app`) |
4. Create the service and wait for the first deploy.
5. **Create the database schema** (one-time). From your machine, with `DATABASE_URL` pointing at Neon:
   ```bash
   cd backend
   # put the Neon URL in backend/.env as DATABASE_URL, then:
   npx prisma db push
   ```
   (Use `db push`, not `migrate deploy` — the migration history is not in sync with the schema.)
6. On startup the server auto-creates the admin account: `admin@gmail.com` / `123456`. **Change this password immediately after first login.**
7. Note your backend URL, e.g. `https://rahula-backend.onrender.com`.

---

## 3. Frontend — Vercel

1. Sign up at https://vercel.com → **Add New → Project** → import the same GitHub repo.
2. Configure:
   - **Root Directory:** `frontend`
   - Framework preset: **Next.js** (auto-detected)
3. Add **Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | your Render backend URL **without** a trailing slash or `/api`, e.g. `https://rahula-backend.onrender.com` |
4. Deploy.
5. Go back to **Render** and set `FRONTEND_URL` to your new Vercel URL, then redeploy the backend (locks CORS to your site).

---

## Known limitations on the free tier

- **Uploaded files are not persistent.** Student photos, gallery media, and past papers are saved to the backend's local disk, which Render wipes on every restart/redeploy. They will disappear. For permanent storage, move uploads to a free object store (e.g. Cloudinary) — ask and this can be wired into `backend/src/middlewares/upload.ts`.
- **Cold starts.** The free Render backend sleeps after ~15 minutes of inactivity; the next request takes ~30–60s to wake it.

---

## Local development

Unchanged. Backend: `cd backend && npm run dev`. Frontend: `cd frontend && npm run dev`.
Without `NEXT_PUBLIC_API_URL`, the frontend defaults to `http://localhost:5000`.

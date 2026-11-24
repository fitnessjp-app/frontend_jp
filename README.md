# FitZone Admin — Frontend (React + Vite, installable PWA)

Admin-only panel. Phone = app-style (bottom tab bar, install to home screen). Computer = website with sidebar.
No public landing page: `/` goes to login (or dashboard if signed in).

## Pages
Login (welcome animation) → **Analytics** · **Admission** · **Plans** (add / edit / enable-disable / delete) ·
**Members** (search name / mobile, sort, status chips, advanced filters) · **Profile** (own ID/password, owner manages admins, install app).

## Run
```bash
npm install
cp .env.example .env      # VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
npm run build
```

## Deploy (Vercel / Netlify)
- Build: `npm run build` · Output: `dist`
- Env var: `VITE_API_BASE_URL=https://<your-backend>/api`
- SPA rewrites are included (`vercel.json`, `public/_redirects`).
- HTTPS is required for "Install app" — Vercel/Netlify give it automatically.
# frontend_jp
# frontend_jp
# frontend_jp

# Paperfold Hosting Plan

## Goal
Deploy the Paperfold frontend to Vercel and build a Supabase backend for persistent storage, authentication, and file hosting.

## Current status
- The current project is a client-side React + Vite application in `Paperfold/`.
- There is no production backend implemented yet.
- Local persistence is currently handled with `localStorage`.
- Image and audio upload already work in-browser using `FileReader` / `URL.createObjectURL`.
- The app branding has been updated to `Paperfold`.

## Desired architecture
- **Frontend:** Vercel
- **Backend / API:** Supabase Functions or Supabase edge functions
- **Database:** Supabase PostgreSQL
- **File storage:** Supabase Storage
- **Authentication:** Supabase Auth (optional, if user accounts are needed)

## Recommended workflow

### 1. Prepare the frontend for deployment
- Keep the current `Paperfold/` app as a Vite React project.
- Ensure `package.json` only includes required dependencies.
- Add or update the Vercel config if needed, but Vercel can auto-detect the Vite app.
- Add environment variables in Vercel:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_SUPABASE_SERVICE_ROLE_KEY` (only for server-side functions, not frontend)

### 2. Add a backend layer using Supabase
- Use Supabase Functions or edge functions for any server-side logic.
- Backend responsibilities:
  - Save card drafts and archives to PostgreSQL.
  - Store uploaded photos/audio in Supabase Storage.
  - Serve private resource URLs with signed URLs if necessary.
  - Optionally implement user profiles and authentication.

### 3. Define the database schema
Create tables such as:
- `users` (if auth is used)
- `cards`
  - `id`
  - `user_id`
  - `title`
  - `occasion`
  - `photo_url`
  - `headline`
  - `message`
  - `sender_name`
  - `song_title`
  - `song_artist`
  - `song_audio_url`
  - `created_at`
  - `updated_at`
- `card_stickers` (optional)
- `card_events` / `history` (optional)

### 4. Use Supabase Storage for uploaded files
- Create a bucket like `media`.
- Use `supabase.storage.from('media').upload(...)` in the frontend or backend.
- Store file paths or public URLs in PostgreSQL.
- Use signed URLs for secure access if media should not be public.

### 5. Integrate the frontend with Supabase
- Replace `localStorage` persistence with backend API calls.
- Example flows:
  - Save draft: POST `/api/cards`
  - Update draft: PUT `/api/cards/:id`
  - Load drafts: GET `/api/cards?user_id=...`
  - Upload file: POST `/api/media` or direct client upload via Supabase Storage
- Keep the existing local app flow while adding backend sync.

### 6. Deploy frontend to Vercel
- Connect the GitHub repo to Vercel.
- Set the root to `Paperfold/`.
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel secrets.

### 7. Deploy backend to Supabase
- Create a Supabase project.
- Use Supabase Functions for endpoints.
- Add database tables and storage buckets.
- Add service role keys to Vercel for server-side calls if needed.

## Suggested next steps
1. Add a minimal backend API directory like `supabase/functions/` or `src/api/`.
2. Separate the `Paperfold` frontend state from backend persistence in `src/App.tsx`.
3. Keep `localStorage` as an offline fallback, but prioritize Supabase for production storage.
4. Add `README` sections describing deployment to Vercel and Supabase.
5. Add a `project-docs/roadmap.md` for feature rollout and production readiness.

## Notes
- Since the app is currently all frontend, the first hosting step is frontend deployment to Vercel.
- A Supabase backend is recommended once you want persistence beyond the browser.
- The app can work locally without Supabase, but cloud storage and DB will make it production-ready.

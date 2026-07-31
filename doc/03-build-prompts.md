# Build-Prompt Doc — Sequential Stages for Antigravity

*Paste one stage at a time. Each prompt below assumes Antigravity has (or you've pasted) `01-product-spec.md` and `02-data-model.md` for reference — mention that explicitly in your first message of each session if it's a fresh chat.*

---

## Stage 1 — Project Scaffold + Data Model + Backend Setup

> Set up a new Next.js project (App Router) hosted on Vercel, with Supabase as the backend (Postgres + Storage). Create the database schema exactly as described in the attached data model doc: a `cards` table, a `templates` table, and reference tables for `fonts`, `colors`, and `stickers`. Set up two Supabase Storage buckets: `card-photos` and `card-audio`. Add a scheduled cleanup job (Supabase Edge Function or `pg_cron`) that deletes any card row (and its associated storage files) once `expires_at` has passed. No authentication system is needed — this app has no accounts or login. Confirm the schema and folder structure before building any UI.

## Stage 2 — Template Selection + Free-Layout Canvas

> Build the template picker screen (grid of available templates, tagged by occasion) and the core free-layout canvas that later stages will populate. The canvas needs to support a photo box and a note box that can each be moved, resized, and rotated by the user, plus a song icon that can be moved but not resized. Use a simple, consistent coordinate system that maps directly to the `x`, `y`, `width`, `height`, `rotation` fields in the `cards` table from the data model doc. Don't wire up real photo/note/song content yet — placeholder boxes are fine at this stage.

## Stage 3 — Photo Upload / Capture Flow

> Add the photo step: let the user either upload a photo from their device or capture one live via the camera (getUserMedia). Once selected, the photo should populate the photo box on the canvas from Stage 2, inheriting its movable/resizable/rotatable behavior. On save, upload the photo to the `card-photos` Supabase Storage bucket and store the resulting path in `photo_url`.

## Stage 4 — Song Feature (Own Audio + YouTube)

> Add the song step with two options: (1) upload an audio file, capped at ~5MB / ~2 minutes — enforce this both client-side (before upload starts) and server-side (reject oversized files); or (2) search YouTube and embed a chosen video by ID. Store `song_type` and `song_source` accordingly. Add the song icon to the canvas at a default position, movable but fixed-size, writing its position to `song_icon_x` / `song_icon_y`. The song should auto-play when the finished card is later opened by a recipient (Stage 6).

## Stage 5 — Note Styling (Fonts / Colors / Stickers)

> Add the note-writing step: a text input capped at 300 characters (enforce this limit in the UI with a live counter, and again as a DB check constraint), plus a picker for the fixed starter set of fonts, colors, and stickers (seed a small reasonable set into the `fonts`, `colors`, and `stickers` tables if not already seeded in Stage 1). Stickers can be placed anywhere within the note box. The note box itself uses the same movable/resizable/rotatable behavior as the photo box.

## Stage 6 — Preview → Confirmation → Shareable Link + Expiry Logic

> Build the preview screen that renders the finished card exactly as a recipient would see it, including the song auto-playing. For occasions tagged `apology` or `ask_out`, add an explicit confirmation step on this screen (e.g. "This will create a link you can send — ready?") before the card is actually saved. On confirmation, insert the row into `cards` with `created_at = now()` and `expires_at = now() + 7 days`, then generate and display the unique shareable link (using the card's `id`). Build the public card-viewing page at that link: it should render the card and auto-play the song, and show a friendly "this card has expired" state if `expires_at` has passed.

## Stage 7 — Download-Copy-Before-Expiry Feature

> On the sender's side (right after the link is generated, and optionally reachable again before expiry), add a "download a copy" action that flattens the photo and note (with styling/stickers) into a single static image and downloads it to the user's device. Make clear in the UI that this download does not include the song, since a static image can't carry a live audio link. This should be generated on demand — no need to persist the generated image anywhere.

## Stage 8 — Branding / Polish Pass

> Add a small, unobtrusive "made by [pseudonym]" credit (footer or corner) — use a placeholder pseudonym for now, easy to swap later. Do a full pass across all screens for visual consistency: consistent spacing, typography, and color use across the template picker, canvas, preview, and public card page. Avoid a generic "AI-generated SaaS" look — aim for a warm, hand-crafted, greeting-card feel throughout, matching whatever visual direction was set in the design phase.

---

**Reminder:** if you generate first-draft visuals in Google Stitch before Stage 2, feed it `01-product-spec.md` plus a short mood description (e.g. "warm, romantic, hand-drawn, physical-greeting-card feel — not a typical SaaS app") so the output doesn't default to generic styling.

# Data Model Doc

*Defines what Supabase (Postgres + Storage) needs to hold. Field names are suggestions — keep them if nothing forces a change, so this doc stays the reference truth for later stages.*

## `cards` table

| Field | Type | Notes |
|---|---|---|
| `id` | uuid, PK | Also used as the public share-link slug |
| `template_id` | uuid, FK → `templates.id` | Which visual template was chosen |
| `occasion` | enum/text | `birthday`, `apology`, `ask_out`, `anniversary`, `general`, ... |
| `created_at` | timestamptz | Set on creation |
| `expires_at` | timestamptz | `created_at + 7 days` |
| `note_text` | text | Max 300 chars — enforce both client-side and DB-side (`check` constraint) |
| `note_font_id` | uuid, FK → `fonts.id` | |
| `note_color_id` | uuid, FK → `colors.id` | |
| `note_stickers` | jsonb | Array of `{ sticker_id, x, y, rotation }` |
| `note_x`, `note_y` | float | Note box position on canvas |
| `note_width`, `note_height` | float | Note box size |
| `note_rotation` | float | Degrees |
| `photo_url` | text | Path in Supabase Storage |
| `photo_x`, `photo_y` | float | Photo position on canvas |
| `photo_width`, `photo_height` | float | Photo size |
| `photo_rotation` | float | Degrees |
| `song_type` | enum | `uploaded` \| `youtube` |
| `song_source` | text | Storage path if uploaded, or YouTube video ID |
| `song_icon_x`, `song_icon_y` | float | Icon position only — size is fixed in UI, not stored |
| `download_copy_generated` | boolean | Defaults false; true once sender downloads a static copy |
| `view_count` | int | Optional — nice-to-have, not required for v1 |

## `templates` table

| Field | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `name` | text | |
| `style_assets` | jsonb | Background/frame asset references |
| `occasion_tags` | text[] | Which occasions this template suits |

## `fonts`, `colors`, `stickers` (reference tables — fixed sets for v1)

| Field | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `name` | text | Display name |
| `value` | text | Font-family string / hex code / sticker asset path, depending on table |

These are seed data, not user-editable in v1.

## Storage buckets

- `card-photos` — uploaded/captured photos
- `card-audio` — uploaded song files (enforce ~5MB / ~2 min limit at upload time, both client-side check and server-side re-check)

## Expiry & Cleanup

- A Supabase scheduled Edge Function (or `pg_cron` job) runs daily:
  - Finds all `cards` where `expires_at < now()`
  - Deletes the row
  - Deletes the associated files from `card-photos` / `card-audio`
- The downloadable "copy before expiry" (flattened photo+note image) is generated **on demand** when the sender requests it — not stored persistently, so it doesn't need its own cleanup job.

## Notes for the preview/safety step (Stage 6 build)

No new table needed — this is a client-side UI gate before the `INSERT` into `cards` happens. For `occasion` values in `apology` / `ask_out`, show the extra confirmation copy on the preview screen before the create/share action fires.

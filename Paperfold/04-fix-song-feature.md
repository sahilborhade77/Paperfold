# Fix Prompt — Song Feature
### For Antigravity: brings the existing music option up to spec

---

## Problem

The current deployed song feature only supports: uploading your own audio file, or picking from a small hardcoded list of preset songs. It's missing the intended **search-based YouTube selection**, which was meant to be the second option instead of (or alongside) a fixed preset list.

## Target Behavior (per spec)

Two song sources only:
1. **Upload your own audio** (existing — keep as-is, ~5MB / ~2 min limit)
2. **Search for a song** — a search box where the user types a song/artist name, the app queries the YouTube Data API, shows a results list (thumbnail, title, channel), and selecting one embeds that video's official YouTube player on the card. No fixed preset list.

---

## Fix Prompt

```
Update Paperfold's song selection step to replace the current small
hardcoded preset-song list with a real YouTube search feature.

1. Add a server-side API route (e.g. /api/youtube-search) that calls
   the YouTube Data API v3 "search" endpoint using a server-stored API
   key (never expose the key client-side). Accept a `query` param and
   return a small list of results: video ID, title, channel name, and
   thumbnail URL.

2. Set up a YouTube Data API key:
   - Create/use a Google Cloud project
   - Enable the "YouTube Data API v3"
   - Generate an API key, restrict it to server-side use if possible
   - Store it as an environment variable (e.g. YOUTUBE_API_KEY) in
     Vercel's project settings — never commit it to the repo

3. In the song step UI, replace the current preset-list picker with:
   - A search input
   - A results list below it (thumbnail + title + channel) populated
     from /api/youtube-search as the user types (debounce the requests,
     e.g. 300-500ms, to avoid hitting API quota on every keystroke)
   - Selecting a result stores that video's ID as youtube_video_id on
     the card (per the existing `cards` table schema) and shows an
     embedded YouTube player as a preview so the creator can confirm
     before saving

4. Keep the existing "upload your own audio" path unchanged.

5. Remove the old hardcoded preset-song list entirely — it's replaced
   by search, not supplemented by it.

6. On the recipient-facing card page, make sure playback already
   handles both song_type values (`upload` → audio tag, `youtube` →
   embedded player) per the original data model — if the preset list
   was using a different mechanism, update the recipient page to match
   the `upload` / `youtube` song_type distinction.
```

---

## Notes

- YouTube Data API v3 has a free daily quota; a basic search costs 100 quota units per call out of a default 10,000/day, so debounced search input is important to avoid burning through it quickly during testing.
- The YouTube branding/logo on the embedded player must stay visible and unmodified — this is a hard requirement of YouTube's Terms of Service, not just a style choice.
- If Antigravity asks where to get the API key: it's created in Google Cloud Console under "APIs & Services" → enable "YouTube Data API v3" → "Credentials" → "Create API Key."

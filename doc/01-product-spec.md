# Product & Spec Doc — [App Name TBD]

*Source of truth. Every build-prompt doc should defer to this file if anything conflicts.*

## 1. One-liner
A no-login, anonymous web app for sending someone a personalized card: a photo, a short note, and a song that auto-plays when they open the link. Skews love/relationship-leaning (birthdays, apologies, asking someone out) but also supports general/non-romantic occasions.

## 2. Core Flow
1. Sender picks an occasion / template style
2. Uploads a photo (device upload or live camera capture)
3. Writes a note (picks font, color, optional stickers — character-limited)
4. Adds a song — uploads own audio file, or searches/embeds a YouTube track
5. Freely arranges the layout: photo box and note box can be moved/resized/rotated; song icon can be moved (fixed size, no resize)
6. Previews the finished card — for sensitive occasions (apology, asking someone out), this preview step doubles as a deliberate "are you sure" checkpoint before the link is generated
7. Gets a unique shareable link (no account created)
8. Recipient opens the link → card renders, song auto-plays
9. Card is live for 7 days, then expires; sender can download a static copy (image only) any time before it expires

## 3. Occasions / Templates
- Primary lean: love/relationship — birthday, apology, asking someone out, anniversary
- Also supported: general/non-romantic occasions (congrats, thank you, etc.)
- Ship with a small fixed set of template styles at v1 (visual direction TBD — see Section 6)

## 4. Feature Detail

### Photo
- Input: device file upload + live camera capture
- On canvas: movable, resizable, rotatable

### Note
- Fixed starter set of fonts, colors, and stickers for v1 (expandable in a later version)
- Character limit: **300 characters**
- On canvas: movable, resizable, rotatable

### Song
- Two source options: upload own audio file, or YouTube search/embed
- Upload limit: **~5MB / ~2 minutes** (default, not yet user-configurable)
- Auto-plays the moment the recipient opens the card
- Each card has its own independent song
- Song icon on the card: position is user-adjustable; size is fixed (no resize)

### Sharing & Lifetime
- No login, no accounts — fully anonymous on both sender and recipient side
- One unique shareable link per card
- Card and all associated data expire **7 days** after creation
- Before expiry, sender can generate a **downloadable static copy** (flattened image of photo + note). The song does not carry over into this downloaded copy, since a static file can't auto-fetch/stream audio the way the live link does.

### Branding
- Small "made by [pseudonym]" credit somewhere unobtrusive (footer or corner)
- Pseudonym: TBD — use a placeholder in early builds, swap in later

### Preview / Safety Step
- Before the shareable link is generated, the sender sees a full preview of the finished card
- For emotionally sensitive occasions (apology, asking someone out), this preview screen includes an explicit confirmation step (e.g. "This will create a link you can send — ready?") so nothing goes out by accident

## 5. Explicitly Out of Scope (v1)
- Accounts / login of any kind
- Extending a card's life beyond the one-time downloadable copy
- Custom (user-uploaded) fonts or stickers — fixed set only

## 6. Design Direction
- Avoid a generic, obviously-AI-generated "SaaS template" look
- Aim: warm, romantic, hand-crafted feel — closer to a physical greeting card than an app
- Inspiration sources: Mobbin, Land-book, Awwwards, Dribbble, Pinterest
- Consider generating first-draft screens with Google Stitch (stitch.withgoogle.com), feeding it this spec doc plus a mood description, rather than asking it to "design the whole app" cold

## 7. Tech / Hosting (confirmed)
- Frontend: Next.js, hosted on Vercel (free tier, good DX, pairs well with Antigravity's typical scaffolding)
- Backend/DB/storage: Supabase (Postgres + object storage + a scheduled function for expiry cleanup) — free tier covers a v1 comfortably

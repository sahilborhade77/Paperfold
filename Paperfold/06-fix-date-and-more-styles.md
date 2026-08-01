# Fix Prompt — Note Date Default & More Fonts/Colors
### For Antigravity

---

## Problem 1: Date requires manual entry every time

The note's date field (e.g. "October 24th, 2023") currently has to be
typed in by the user each time, instead of defaulting to today's date
automatically.

### Fix

```
Update the note editor's date field in Paperfold:

1. Default the date field to the current date (today) automatically
   when the editor loads, formatted consistently with the existing
   style (e.g. "October 24th, 2025").
2. Still allow the user to manually edit/change the date if they want
   a different one (e.g. backdating a card, or a specific meaningful
   date) — this should remain an editable field, just pre-filled
   rather than empty.
3. Make sure the default uses the client's local date/time, not a
   server UTC date, so it matches what the user actually sees "today"
   as.
```

---

## Problem 2: Too few font and color options

Currently only 3 fonts (Serif / Hand / Script) and 3 colors are
available for the note. Wants this expanded.

### Fix

```
Expand the note styling options in Paperfold:

1. Add additional font options beyond the current Serif / Hand /
   Script set — aim for a small but distinct set (e.g. 5-6 total)
   covering a range of moods (elegant serif, casual handwriting,
   playful script, clean sans-serif, etc.) rather than near-duplicates
   of what already exists.
2. Add additional color options beyond the current 3 (currently a dark
   red, a dark gray/charcoal, and an olive green) — expand to a small
   curated palette (e.g. 6-8 total) that still feels cohesive with the
   app's warm, hand-crafted aesthetic rather than a generic full color
   picker.
3. Keep the same UI pattern already in place (pill-style selector row
   for fonts, colored dot selector row for colors) — just extend the
   option lists, no need to change the interaction pattern itself.
4. Confirm the note_font and note_color fields in the `cards` table
   can store any of the newly added option values (these are currently
   free-text fields per the data model, so no schema change needed —
   just make sure any validation/allow-list in the code is updated to
   include the new options).
```

---

## Notes

- Keep the curated/limited-choice approach rather than switching to a
  full custom color picker or font upload — matches the existing v1
  scope decision (fixed starter set, expandable later) rather than
  opening up unlimited customization.
- If you want, share the specific new fonts/colors you'd like and I
  can fold the exact list into this prompt instead of leaving it to
  Antigravity's judgment.

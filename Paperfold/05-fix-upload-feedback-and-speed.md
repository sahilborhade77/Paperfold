# Fix Prompt — Upload Feedback & Link Generation Speed
### For Antigravity

---

## Problem 1: No immediate feedback after photo upload

The user has no way to confirm a photo uploaded successfully until they
navigate two steps further into the flow. This makes the app feel broken
even when the upload actually succeeded.

### Fix

```
After a photo upload/capture completes in the Paperfold editor:

1. Show a clear success state immediately at the point of upload —
   a thumbnail preview of the uploaded photo, plus a small checkmark
   or "Photo added" confirmation, right on the same screen.
2. Show a visible progress indicator (spinner or progress bar) WHILE
   the upload is in flight, not just before/after.
3. If the upload fails, show an explicit error state on the same
   screen (e.g. "Upload failed — try again") rather than silently
   moving forward or leaving the user unsure.
4. Do the same for audio uploads in the song step — visible
   uploading/success/failure states at the point of action.
```

---

## Problem 2: Broken preset audio sources causing errors + slowness

Console shows repeated 403 Forbidden errors from cdn.pixabay.com audio
URLs, and "Autoplay blocked" following from missing valid sources. This
suggests a leftover hardcoded preset-song list (Pixabay demo tracks)
still exists somewhere in the app, separate from the main song picker
already flagged for replacement with YouTube search.

### Fix

```
1. Search the entire codebase for any references to pixabay.com or
   other hardcoded external audio URLs (check components beyond the
   main song-selection screen — e.g. this appears on a
   "Whisper Memory Expiry" screen too).
2. Remove all hardcoded preset audio sources entirely. Replace with the
   upload + YouTube search flow already specified (see
   04-fix-song-feature.md).
3. Confirm no component still attempts to autoplay or preload an audio
   source that doesn't exist/isn't set yet — guard playback so it only
   triggers once a valid song_url or youtube_video_id is actually set.
```

---

## Problem 3: Link generation is slow

### Likely causes to check

```
1. Are photo and audio uploads happening sequentially (one after the
   other) instead of in parallel? If so, run them concurrently
   (e.g. Promise.all) before generating the shareable link.
2. Is the app waiting on a failed/retrying network request (like the
   broken pixabay URLs above) before it can finish saving the card?
   Fixing Problem 2 may resolve part of this slowness on its own.
3. Is there a reasonable timeout set on upload/save requests? Add one
   (e.g. 15-20s) so a stalled request fails visibly instead of hanging
   indefinitely.
4. Is the final "save card + generate link" step doing more work than
   necessary (e.g. re-uploading files that were already uploaded
   earlier in the flow)? Files should be uploaded once, as soon as
   they're added, not re-uploaded at final save time.
```

### Fix Prompt

```
Investigate and fix slow shareable-link generation in Paperfold:

1. Confirm photo and audio uploads happen as soon as the user adds
   them (not deferred to save time), and that final save only writes
   the resulting URLs/references to the `cards` table — it should not
   re-upload files.
2. Ensure any uploads/save operations that can run independently run
   concurrently (Promise.all), not sequentially.
3. Add reasonable timeouts to upload and save network calls so a
   stalled request fails with a visible error instead of hanging.
4. Re-test link generation time after fixing Problem 2's broken audio
   sources, since a hanging/retrying failed request may be a
   significant contributor to the current slowness.
```

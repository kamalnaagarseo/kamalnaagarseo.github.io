# Kamal Naagar SEO — Record Only Preview

## What is included

- `video-review-preview.html`: standalone noindex page, deliberately not linked from public navigation.
- `video-review.css`: scoped styles consistent with the existing navy/orange site.
- `video-review.js`: browser-only camera + microphone recording, 90-second maximum, playback and re-record.
- Existing pages, images, 4 YouTube testimonials, written-review feed, and sitewide structured data are preserved.

## Test on GitHub Pages

1. Upload the entire flat ZIP to the root of `kamalnaagarseo/kamalnaagarseo.github.io`, replacing matching files.
2. Test `https://kamalnaagarseo.github.io/video-review-preview.html` (requires HTTPS).
3. Allow camera/microphone, record a short sample, stop, replay, re-record.
4. The page is noindex and unlinked but not access-protected; do not record anything sensitive.
5. Nothing is uploaded, saved to your Sheet, or publicly shown. Recording exists only in the browser and is discarded when the page closes.

## What remains before public launch

- Turnstile site verification integrated into the *final upload request*. A standalone successful challenge cannot authorize arbitrary later uploads.
- Cloudflare Worker: signed, narrowly scoped upload credentials; controlled rate and duration/size limits, short validity, content type validation, and replay/abuse safeguards. Do not expose Cloudinary API Secret.
- Upload recordings to Cloudinary as authenticated assets. Confirm moderation and access restrictions with a real test.
- A separate, authenticated Google Apps Script bridge (or equivalent) that records verified upload metadata and moderation state to `VideoTestimonials` sheet. Do not trust client-submitted asset URLs/IDs without server-side Cloudinary validation.
- Moderator preview workflow; only consented, approved assets should receive expiring playback URLs.
- Final browser verification on mobile and desktop; link the recording page publicly only after all backend tests pass.

Cloudflare Worker currently provides `/health` and `/test-turnstile`. Those endpoints do NOT accept videos. No public video upload is available in this package.

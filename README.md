# Rahul & Twinkle Mokaria — A Blessed Beginning

Primary guest link: https://mokaria-invite.vercel.app/

GitHub Pages mirror: https://akaup-iitnj.github.io/twinkle-invite/

A photographic carved-wood doorway opens with one click. The invitation sits immediately behind the solid doors and becomes visible as they swing open, with no corridor. The reading view includes slow marigold petals, a pause/resume control, and reduced-motion support.

## Editing and hosting

This is a static website with no build step. All site files are in the repository root. Serve this directory over HTTP to preview. Edit `config.js` for event details and the Google Forms responder link. RSVP responses stay in Google Forms and its connected spreadsheet, outside this repository.

GitHub Pages serves the root of `main`. Vercel currently uses a direct upload of the site files; pushes to this repository do not automatically update Vercel until the repository is connected there. To update Vercel manually, upload the root site files and `assets/` to the existing `mokaria-invite` project, excluding `.git/`.

## Sharing images

- `preview.jpg`: 1200 × 630 JPEG, approximately 94 KB, used by the Open Graph tags.
- `door-portrait.jpg`: 1080 × 1350 JPEG to send as a photo with the guest link in its caption.

The Open Graph URL and image URL point to the primary Vercel address. The preview image preserves the full opening screenshot with blurred side fill.

## Door animation

`assets/carved-door.png` textures the fronts of solid Three.js door slabs with timber edges, rear faces, hinges, and perspective camera motion. All runtime asset paths are relative, so the same files work on Vercel and GitHub Pages.

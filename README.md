# Mukaria Housewarming Invitation

A mobile-friendly invitation for Rahul and Twinkle Mukaria’s Satyanarayan Katha and housewarming, with a slow approach to the house and opening doors. Guests can skip the animation or replay it. The RSVP button opens the connected Google Form in the same tab.

## Publish with GitHub Pages

This is a static website. No build command, package installation, or server is required.

1. Put these files at the root of the repository on the `main` branch.
2. Open the repository’s **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select `main` and `/(root)`, then save.

Keep `.nojekyll` in the repository root. All local asset paths are relative, so the invitation works at a GitHub Pages project URL as well as at a domain root. See [GitHub’s publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Update the invitation

Edit `config.js`:

- Set `date` to the confirmed event date. It currently reads `Date to be confirmed`.
- Adjust `time` and `dinner` if the schedule changes.
- Set `googleFormUrl` to a published Google Form’s responder URL, not its editing URL. The existing working URL is already configured.

Google Forms collects the RSVPs and sends them to its linked Google Sheet. Configure that destination in Google Forms; no response records or Google account credentials belong in this repository.

The existing `assets/house.png` and `door` coordinates in `config.js` work together. Preserve both to retain the current artwork and door animation.

## Files

`index.html`, `app.js`, `config.js`, `site.css`, `scene.css`, `assets/house.png`, `.nojekyll`, and this README.

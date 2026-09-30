# samuelgabor.com

Static personal site: one `index.html`, plain CSS and JavaScript, no build step. Hosted on GitHub Pages.
Every project card links straight to its GitHub repository.

## Files

- `index.html` is the whole site.
- `assets/css/site.css` holds the styles, `assets/js/console.js` the hero animation, `assets/js/site.js` the theme toggle and scroll reveal.
- `assets/img/` holds the card images as WebP.
- `CNAME` points GitHub Pages at `www.samuelgabor.com`.

## Add or change a project

Intune projects (the `#work` section) are grouped into Windows 11, iOS and Android tracks.

1. In `index.html`, find the track (`<h3 id="track-windows11">`, `track-ios` or `track-android`).
2. Copy one `<li class="pcard">...</li>` block inside it and edit:
   - the number (`W-07`, `I-04`, ...),
   - the GitHub link and title inside `<h4>`,
   - the one or two sentence description,
   - the tags in `<ul class="tags">`.
3. Update the project count in the track's `<p class="label">` and in the section intro ("11 projects").
4. Commit and push. GitHub Pages updates in about a minute.

Radio / hardware work lives in the `#research` section as `<li class="step">` blocks with an image in `assets/img/`.

## Deploy to GitHub Pages

1. Push this folder to the root of a GitHub repository.
2. **Settings > Pages**: Source *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. **Custom domain**: `www.samuelgabor.com`, then tick **Enforce HTTPS**.
4. DNS (only if not already set): `CNAME` record for `www` to `<your-github-username>.github.io`; for the bare domain, `A` records to 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153.

## Preview locally

    python -m http.server 8080

Then open http://localhost:8080.

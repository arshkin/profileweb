# Arshbir Bhamra · Portfolio

Plain HTML/CSS/JS with no build step. To preview it locally, serve the folder with any static server (for example `npx serve .`).
Ready to host on GitHub Pages from the `main` branch. Scroll animations use the MIT-licensed scroll-craft engine in `assets/sc/`.

```
index.html                     Home: hero, about, projects, experience, skills, contact
projects/ground-station.html   Flagship case study
projects/sounding-rocket.html  Case study
projects/hometern.html         Case study
assets/css/style.css           All styling
assets/js/main.js              Nav, reveal animations, gallery filter and lightbox, image loading
```

## Adding photos and videos

Each image slot is a `<div class="media" data-src="...">`. Put a file at that exact path and it shows up
automatically. Until then, the slot shows a labelled "Photo needed" placeholder.
For a video, change the `data-src` to a `.mp4` file. Add `data-autoplay` to make it loop silently.

| File | Where it appears |
|---|---|
| `assets/img/hero.jpg` | Homepage hero background (optional: hidden if missing) |
| `assets/img/headshot.jpg` | About section (optional) |
| `assets/img/gs-cover.jpg`, `rocket-cover.jpg`, `hometern-cover.jpg` | Homepage project cards |
| `assets/img/ground-station/` | `cover`, `original-exterior`, `original-interior`, `cad-assembly`, `cad-internal`, `cad-mounts`, `wiring`, `assembly`, `bench-test` (.jpg) |
| `assets/img/rocket/` | `cover`, `avionics-bay`, `launch-prep`, `launch` (.jpg) (all filled) |
| `assets/img/hometern/` | `cover.jpg`, `onboarding.png`, `search.png`, `tracking.png` |

Keep images under about 500 KB each. Export them as JPG at around 2000 px wide.

## Still needed
- GitHub URL: search `GitHub URL needed` in `index.html`
- Test results for the ground station: search `PLACEHOLDER` in `projects/ground-station.html`
- HomeTern timeline or demo video: search `PLACEHOLDER` in `projects/hometern.html`

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A SvelteKit 2 / Svelte 5 template for semi-automated ("robo-journalism") area articles on ons.gov.uk. A Pug template and a wide CSV (one row per area) are rendered ahead of time into one JSON file per area, and the app is prerendered into a static site with one page per area. Templates are usually written in [robo-editor](https://onsdigital.github.io/robo-editor/); the sibling [robo-embed](https://github.com/ONSvisual/robo-embed) does the same for iframes.

## Commands

```bash
npm run build:data      # render demo-data/ (or the source in app.config.js) into static/data/
npm run dev             # dev server at localhost:5173
npm run build           # production build to build/, then js-fix and gen-sitemap
npm run build:preview   # build with base_preview (no js-fix or sitemap)
npm run lint            # prettier --check
npm run format          # prettier --write
```

There are no tests. `static/data/` is generated and gitignored, so run `build:data` before `dev` or `build` on a fresh checkout. `package-lock.json` is also gitignored, so a clean install can pick up newer `@onsvisual/svelte-components` / `svelte-charts` within their semver ranges.

Formatting (`.prettierrc`): tabs (width 4), print width 100, no trailing commas, matching robo-utils.

## Architecture

**Data build (Node, `scripts/build-data.js`).** Reads the CSV and Pug template named in `src/app.config.js`, keeps rows whose code prefix is in `filter`, and for each area (plus `null`, meaning no area selected) calls robo-utils' `renderJSON`. It writes `static/data/json/<areacd>.json` (and `default.json`), plus `static/data/places.csv` with only the `cols` columns, which powers the area dropdown and area links. The Pug runs in Node with the real `pug` package, so template changes need a `build:data` rerun, not just a page reload.

**Section types.** The rendered JSON is `{ sections, ... }`, where each top-level Pug `section` has its class as `type`. `src/routes/[...code]/+page.svelte` switches on that type: `Meta` (head tags and analytics), `Header`, `Highlight`, `Chart` (needs a `chartType` prop; drawn by `@onsvisual/svelte-charts`' `Chart`), `Summary` (nested sections become `SummaryItem`s), `Warning`, and anything else as a plain `Section` with HTML content. A new section style in a template needs a branch here.

**Routes.**

- `[...code]`: the article. `+page.js` loads `/data/json/<code>.json` (or `default.json` for `/`). The area select calls `goto()`.
- `embed`: one chart for pym.js iframes, chosen at runtime with `?area=<areacd>&chart=<section id>`. `ChartActions.svelte` builds the embed code that points here.
- `landing`: an embeddable area picker that navigates `window.top` to the article.
- `+layout.js` loads `places.csv` for every route and sets `prerender = true` and `trailingSlash = "always"`. `svelte.config.js` prerenders `/`, `/landing` and `/embed`, and the crawler finds every area page through `AreaLinks`.

**Base paths.** `base_prod` and `base_preview` in `src/app.config.js` set `paths.base` (absolute, not relative), because the app builds absolute `https://www.ons.gov.uk/...` URLs for og tags, embed codes and the sitemap. In dev there's no base. Use `asset()` for files in `static/` and `resolve()` for routes, from `$app/paths` (not the deprecated `base`).

**Post-build scripts.** `scripts/js-fix.js` prepends `//js` to every JS file in `build/_app` to avoid MIME type errors on the ONS servers, and `scripts/gen-sitemap.js` writes `build/sitemap.xml` from the prerendered area pages, using `base_prod`.

**Components.** The UI comes from `@onsvisual/svelte-components`, which is still written in Svelte 4 syntax. Its components dispatch events, so listen with `on:click` / `on:change` on them, while the app's own components and DOM elements use runes and `onclick`. Analytics settings, themes and demo-specific config (eg. the region list used by `AreaLinks` and the landing page) are in `src/lib/config.js`.

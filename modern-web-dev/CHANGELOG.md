# Changelog

**0.1.0 — Preact baseline**

- Initial project implemented with Preact + HTM under the `preact/` folder.
- Key files: `preact/App.js`, `preact/Components/*`, `preact/Services/getMusic/getMusic.js`, and `preact/music.json`.

Changes since 0.1.0

- Migrated UI components from Preact to React (JSX + hooks) and added them to the React app's `src/Components/`:
  - `src/Components/addSong/addSongChild.jsx`
  - `src/Components/addSong/addSongParent.jsx`
  - `src/Components/musicList/musicListChild.jsx`
  - `src/Components/musicList/musicListParent.jsx`
  - `src/Components/pieChart/pieChartChild.jsx`
  - `src/Components/pieChart/pieChartParent.jsx`

- Added React service and data files:
  - `src/Services/getMusic/getMusic.js` — switched to `fetch` and fetches `/music.json`.
  - `public/music.json` — moved/copy of the dataset so the React app can fetch it.

- Replaced Vite scaffold in `src/App.jsx` with the migrated components so the React app renders the same UI as the original Preact app.

- Added Parse integration services under `src/Services/parseServices/`:
  - `parseFetch.js` (existing) — fetch helper using `parse` SDK
  - `parseCreate.js` — `createParseData(className, data)` helper
  - `parseUpdate.js` — `updateParseData(className, id, data)` helper
  - `parseDelete.js` — `deleteParseData(className, id)` helper

- Minor:
  - Converted HTM/`html` usage to standard React JSX and `useState`/`useEffect` hooks.
  - Kept the original `preact/` directory for reference; no destructive changes were made to that folder.


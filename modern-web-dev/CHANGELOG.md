# Changelog

**0.1.0 — Preact baseline**

- Initial project implemented with Preact + HTM under the `preact/` folder.
- Key files: `preact/App.js`, `preact/Components/*`, `preact/Services/getMusic/getMusic.js`, and `preact/music.json`.

Major changes since 0.1.0

- Migrated UI from Preact to React and added core components under `src/Components/`.
- Wired the React app to use the migrated components via `src/App.jsx`.
- Added data and service support:
  - `public/music.json` and `src/Services/getMusic/getMusic.js` for the music dataset.
  - Parse integration (`src/Services/parseServices/`) with unified helpers to create, fetch, update, and delete `post` and `comment` objects.
- Comments support: UI for creating and displaying comments, stored as `comment` objects that point to `post` objects in Parse.

- Routing: added client-side routing between pages and components.
- Footer: added a site footer component present across pages.

Notes:
- Parse class names used: `post` and `comment`. Ensure your Parse schema matches and that CLP/ACLs allow the intended operations.


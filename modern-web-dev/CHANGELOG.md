# Changelog
**0.4.0 - Feature 6**

- Pie chart: replaced placeholder text list with a real interactive pie chart using Recharts
- Pie chart: genre/artist breakdown renders as a labeled pie with percentage annotations, tooltip, and legend
- Pie chart: added a border around the chart container

**0.3.0 - Feature 5**

- Debugged comment-adding functionality
- Authentication: added authentication and authorization privileges to `addSong` and `pieChart` pages via `src/Components/Auth/AuthService` 
- Navbar: added a site-wide nav bar

**0.2.0 - Feature 4**

- Migrated UI from Preact to React and added core components under `src/Components/`.
- Wired the React app to use the migrated components via `src/App.jsx`.
- Added data and service support:
  - `public/music.json` and `src/Services/getMusic/getMusic.js` for the music dataset.
  - Parse integration (`src/Services/parseServices/`) with unified helpers to create, fetch, update, and delete `post` and `comment` objects.
- Comments support: UI for creating and displaying comments, stored as `comment` objects that point to `post` objects in Parse.

- Routing: added client-side routing between pages and components.
- Footer: added a site footer component present across pages.
- 

Notes:
- Parse class names used: `post` and `comment`. Ensure your Parse schema matches and that CLP/ACLs allow the intended operations.


**0.1.0 — Preact baseline**

- Initial project implemented with Preact + HTM under the `preact/` folder.
- Key files: `preact/App.js`, `preact/Components/*`, `preact/Services/getMusic/getMusic.js`, and `preact/music.json`.


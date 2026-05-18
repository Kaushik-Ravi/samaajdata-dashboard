# SamaajData: Top 1% Agent Handoff Context

## 1. Project Objective
We are overhauling the **SamaajData** platform from a functional, basic prototype into a **Top 1% Enterprise-Grade Civic Action Dashboard**. The goal is to build an interface that rivals top-tier consumer apps (e.g., Strava, Duolingo, Google Cloud Console) in fluidity, precision, and dopamine-driven engagement. 

## 2. User Persona & Expected AI Behavior
The User demands the absolute highest tier of software engineering and UX design. 
When interacting with the User, you MUST adopt the following persona and working style:
- **Top 1% Expertise:** You are a master-level UX Engineer and Systems Architect. You created Google's Material Design principles. 
- **Brutally Honest:** If an idea or design looks clunky, "hacker-ish", or cognitively overloading, you must call it out and engineer a better solution.
- **Surgically Precise:** Do not alter unrelated code. When modifying components, ensure pixel-perfect alignment (e.g., using `pt-[1px]` for absolute flex centering).
- **Proactive Engineering:** Do not wait to be told to add micro-interactions or smooth transitions. Bake them into your code natively.

## 3. The "SamaajData" Design Philosophy
Do **NOT** use a "cyberpunk" or "hacker" aesthetic (e.g., heavy box shadows, neon borders, terminal-style text, clunky progress bars).
We are strictly following a **Hyper-Premium Google Enterprise Dark Mode** aesthetic:
- **Colors:** Deep, clean backgrounds (`bg-[#0A0A0A]`, `bg-zinc-900`), ultra-subtle borders (`border-zinc-800`), and strategic accents (e.g., `emerald-400` for positive ranking metrics, `amber/orange` for active threats).
- **Typography:** Rely on font-weights and tracking (`tracking-tight`, `tracking-widest`) rather than colors or icons to establish hierarchy. Keep text concise. Remove all "dead space".
- **Micro-interactions:** Everything clickable must have hover states. Use `framer-motion` for smooth layout transitions. 
- **Organic Triggers:** Avoid large, clunky buttons. Use organic links (e.g., text with `hover:underline underline-offset-4`) for secondary actions.
- **Architecture:** We do not use pop-up modals over maps. We use "Nested Slide" architectures (sliding panels left and right using `<AnimatePresence>`) to manage cognitive load.
- **Map Overlay UI Rule (NEW — CRITICAL):** All floating UI elements placed over maps (badges, dividers, icons) MUST use solid, high-contrast `bg-white text-black` styling — NOT colored, glowing elements that blend into the dark map base layer.

## 4. Current State & Completed Milestones
We have successfully modularized and overhauled the **Area Intelligence** module.
- **File Location:** `src/components/AreaIntelligence.js` and `src/App.js`
- **Neighborhood Health & Praise:** Dynamic calculation of how many issues are left to resolve, offering positive reinforcement text based on the best performing category.
- **The Nested Leaderboard:** 
  - Clicking "Top 10" triggers a nested framer-motion slide revealing the "City Grid Rankings".
  - Implemented a glass-morphic dropdown menu to switch between categories (Safety, Greenery, Cleanliness).
  - Wrote a robust rendering logic engine. If the "Current Map View" organically lands in the Top 5 (e.g., Rank 3 in Cleanliness), it injects seamlessly into the list and hides the bottom anchor. If it is lower (Rank 14), it displays an ellipsis (`...`) and docks the current view at the bottom.
- **Geospatial Map Sync (First-Class Feature):** 
  - The Leaderboard is wired to the Leaflet Map Engine. 
  - `App.js` passes down a `panToRegion(lat, lng)` function. 
  - Clicking a top-ranked sector (e.g., Indiranagar) closes the leaderboard and performs a cinematic `flyTo` animation on the map.
  - We injected hardcoded mock `ISSUES` and `NINJAS` (avatars) at these exact coordinates so the map organically populates with data when the user arrives, creating a "Living City" illusion.

## 5. Next Steps for the Incoming Agent
1. **The "People/Ninja" Tab:** The right-side "Avatars" logic needs the same Top 1% UI/UX overhaul. It must integrate seamlessly with the map state.
2. **Action Engine (Verify/Resolve):** The "Verify Issues" button in the left panel needs to trigger actual state updates, moving issues from "pending" to "resolved" to artificially push the User's Area Rank higher in real-time.
3. **Data Persistence:** Transition the hardcoded `ISSUES`, `NINJAS`, and `MOCK_LEADERBOARDS` arrays into `useEffect` API calls connecting to the backend context layer. 

*Read this document thoroughly before proposing any code changes to ensure you maintain the established architectural integrity and Top 1% quality standard.*

## 6. Recent Overhauls: The Gamified Action Loop & Impact Engine
We completely decoupled the `ActionEngine.js` from the main `App.js` file and transformed it into a standalone, enterprise-grade civic action component. 
- **Top 1% UI/UX:** We removed all "cyberpunk" elements. Implemented a horizontal swipeable operations pipeline, tactile effort sliders (Verification -> Escalation -> Operations) using Material 3 tonal styling, and integrated `react-confetti` for dopamine-driven gamification.
- **The Civic Impact Certificate:** We gutted the standard thumbnail preview. We engineered a high-fidelity "Impact Certificate" containing metrics, geo-coordinates, dates, and an XP earned badge.
- **Native Image Sharing Engine:** We bypassed standard text-based sharing links. Using `html2canvas` and the Web Share API (`navigator.share`), the user can now click "Share Impact Certificate", the system will synchronously generate a high-res `.png` of the DOM, and open the OS-level native share sheet. This attaches the actual image directly to WhatsApp/Instagram Stories. We also engineered a cache-busting solution (`?t=${Date.now()}`) to permanently solve the Unsplash CORS cache trap during canvas generation.
- **The Intelligence-to-Action Loop:** We linked `AreaIntelligence.js` directly to `ActionEngine.js` via global state in `App.js`. Clicking "Verify Issues" dynamically finds the nearest unresolved issue and teleports the user into the Action Engine. When an action is completed, the system instantly updates the `Neighborhood Health` progress bar, increases the `Issues Resolved` count, and erases the active pin from the Leaflet map in real time.

## 7. Immediate Next Steps for the Incoming Agent
1. **The "People/Ninja" Tab:** The right-side "Avatars" logic needs the same Top 1% UI/UX overhaul. It must integrate seamlessly with the map state and allow users to view other citizens' actions.
2. **Data Persistence:** Transition the hardcoded `ISSUES`, `NINJAS`, and `MOCK_LEADERBOARDS` arrays into `useEffect` API calls connecting to the backend context layer.

---

## 8. Production Deployment: Backend → Railway.app *(Session: May 11, 2026)*

This section documents the complete infrastructure lift that moved the backend from `localhost:5000` to a live cloud environment for team sharing and stakeholder demos.

### 8.1 Why Railway.app (Decision Rationale)

The architecture has a hard constraint: `tileEngine.js` loads **1,168,552 GeoJSON features into an in-memory Supercluster R-Tree** at startup (~1.5s build). This eliminates all serverless options (AWS Lambda, Vercel Functions, Cloudflare Workers — all have cold start penalties and 256MB RAM limits). Railway was chosen because:
- **Persistent containers** — Supercluster stays warm in memory 24/7. No cold start tax.
- **PostGIS template** — one-click PostgreSQL deployment (we ended up not needing PostGIS extensions, see §8.4)
- **Private internal networking** — Node.js → DB latency is ~0.5ms within the same Railway project
- **GitHub auto-deploy** — push to `main` = automatic redeploy
- **Pro plan ($20/month)** — $20 in credits covers ~1.5GB RAM + CPU 24/7 for the demo phase

Rejected alternatives:
- **Render free tier** — spins down after 15 min inactivity; kills Supercluster on every request
- **Fly.io** — superior for global scale but steep ops learning curve for now
- **Vercel/Netlify** — serverless only; cannot run stateful Node.js

### 8.2 Infrastructure Deployed

| Component | Platform | Detail |
|---|---|---|
| **Node.js Backend** | Railway (Node service) | `samaajdata-backend` GitHub repo → auto-deploys |
| **PostgreSQL DB** | Railway (PostgreSQL service) | Managed PostgreSQL, same project, private network |
| **Frontend** | GitHub Pages + Vercel | `samaajdata-dashboard` repo, auto-deploys on push |

**Public URLs:**
- Backend API: `https://samaajdata-backend-production.up.railway.app`
- Frontend (GH Pages): `https://kaushik-ravi.github.io/samaajdata-dashboard`

**Railway DB Credentials** *(stored in `Rama Sir backend/.env` — gitignored, never commit):*
- Host (public/restore): `viaduct.proxy.rlwy.net:37018`
- Host (internal/runtime): `${{Postgres.RAILWAY_PRIVATE_DOMAIN}}:5432`
- User: `postgres` | DB: `railway`
- Password: stored in `.env` local file only

### 8.3 New Files Created / Modified

| File | Change | Purpose |
|---|---|---|
| `src/config.js` | **CREATED** | Single source of truth for `API_BASE` URL. Reads `REACT_APP_API_URL` env var in production, falls back to `http://localhost:5000` for local dev. **AGENTS.md Rule: use this everywhere — never hardcode localhost.** |
| `src/App.js` | **MODIFIED** | 7 surgical replacements: all `http://localhost:5000` → `${API_BASE}`. Import `API_BASE` from `./config`. |
| `.env.production` | **CREATED** | `REACT_APP_API_URL=https://samaajdata-backend-production.up.railway.app`. CRA reads at build time. Safe to commit (public URL, not a secret). |
| `Rama Sir backend/package.json` | **MODIFIED** | Added `"start": "node --max-old-space-size=2048 server.js"`. Railway requires a start script. `--max-old-space-size=2048` gives Node.js a 2GB heap for the Supercluster. |
| `Rama Sir backend/.gitignore` | **CREATED** | Protects: `.env`, `*.xlsx` (raw data, already ingested), `ingest.js`, `inject_mock.js`, `add_spatial_index.js`, `create.sql`, `fix_view.sql`, `docker-compose.yml`, test files, `node_modules/`. |
| `Rama Sir backend/.env.example` | **CREATED** | Safe reference showing env var structure. Goes to GitHub. Real values go into Railway's Variables dashboard. |
| `.gitignore` (frontend) | **MODIFIED** | Added `/pg_data`, `/Temp`, `old_app_diff.txt`. The `pg_data/` directory contains 1975+ raw PostgreSQL binary files from the Docker volume — must never be tracked or committed. |

### 8.4 The PostGIS Non-Issue (Important for Future Agents)

During `pg_restore`, Railway's managed PostgreSQL reported 16 errors like `extension "postgis" is not available`. **These errors are completely harmless and expected.** Here's why:

Our backend (`tileEngine.js`, `db.js`) uses **zero PostGIS functions**. All queries use plain `latitude DOUBLE PRECISION` and `longitude DOUBLE PRECISION` columns. The Supercluster spatial index is built entirely in Node.js memory. The PostGIS extension in the local Docker DB was a relic of the old `pg_tileserv` pipeline that was **eliminated** (per AGENTS.md §5: "We ruthlessly eliminated the Go-based `pg_tileserv` Docker container"). The `spatial_datapoints` view and `idx_spatial_datapoints_fast` GiST index that failed to restore were for that old pipeline — we don't use them.

**Verification:** After restore, `SELECT COUNT(*) FROM public.datapoints;` returned `1168552`. ✅

### 8.5 Data Migration Method

**The pg_dump PowerShell Trap:** The original `pg_dump` used PowerShell's `>` redirect operator, which corrupts binary data by converting output to UTF-16 text encoding. The `-Fc` custom format dump is binary — PowerShell's `>` destroyed it.

**The Fix:** Dump directly inside the Docker container using `--file` flag (no redirect), then restore from inside the container:
```bash
# Correct approach — no PowerShell redirect
docker exec samaajdata_db pg_dump -U samaajdata --no-owner --no-acl -Fc --file=/tmp/dump_clean.dump samaajdata
docker exec -e PGPASSWORD=... samaajdata_db pg_restore --no-owner --no-acl -h [host] -p [port] -U postgres -d railway /tmp/dump_clean.dump
```

### 8.6 Backend GitHub Repo

A separate private GitHub repo was created for the backend: `github.com/Kaushik-Ravi/samaajdata-backend`

**Files committed to backend repo (only these 4 + 2 new):**
- `server.js`, `tileEngine.js`, `db.js`, `package.json` — production runtime
- `.gitignore`, `.env.example` — safety and reference

**Files NOT in backend repo (by design):**
- All `*.xlsx` raw data files (already ingested into DB)
- `ingest.js`, `inject_mock.js`, `add_spatial_index.js` — one-time setup scripts, done
- `docker-compose.yml` — local only
- `.env` — secrets, Railway dashboard only
- `node_modules/`, test files

### 8.7 Railway Environment Variables (Node.js Service)

Set in Railway dashboard → Node.js service → Variables tab using Railway's internal reference syntax:
```
DB_HOST=${{Postgres.RAILWAY_PRIVATE_DOMAIN}}
DB_PORT=5432
DB_USER=${{Postgres.POSTGRES_USER}}
DB_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}
DB_NAME=${{Postgres.POSTGRES_DB}}
NODE_OPTIONS=--max-old-space-size=2048
```
The `${{Postgres.VAR}}` syntax tells Railway to pull values from the sibling PostgreSQL service at runtime via private networking — zero hardcoded credentials.

### 8.8 Local Development (Unchanged)

Local dev is completely unaffected. The `src/config.js` fallback ensures:
- `REACT_APP_API_URL` not set → uses `http://localhost:5000` automatically
- Docker PostGIS still runs on port 7262 as always
- `START_BACKEND.bat` still works

### 8.9 Updated Next Steps for the Incoming Agent

1. **Smoke Test First:** Before any code work, verify `https://samaajdata-backend-production.up.railway.app/get_datasets` returns JSON and `/api/point/1` responds in <50ms.

2. **GitHub Pages gh-pages deploy:** The `npm run deploy` command has a Windows-specific bug with the `gh-pages` npm package and temp directory git spawning. Workaround:
   ```bash
   # From react-lm4j8tjk/ after npm run build:
   cd build
   git init
   git remote add origin https://github.com/Kaushik-Ravi/samaajdata-dashboard.git
   git add .
   git commit -m "Deploy"
   git push -f origin HEAD:gh-pages
   cd ..
   ```
   Vercel auto-deploys on `git push origin main` and is the primary sharing URL.

3. **People/Ninja Tab overhaul** — see §7 above.

4. **Data Persistence** — transition mock arrays to API calls — see §7 above.

5. **CRITICAL — NEVER push `pg_data/` to git.** It contains raw PostgreSQL binary files. The frontend `.gitignore` now excludes it, but always verify before any `git add .`.

---

## 9. Dual-Map Geospatial Comparison Engine *(Session: May 16, 2026)*

This section documents the complete architecture for the Side-by-Side Region Comparison feature built in the May 16 session.

### 9.1 Feature Overview
Users can toggle "Compare" mode from the Neighborhood Health panel. The map splits 50/50 into two independent WebGL viewports (Region A on the left, Region B on the right), each fully interactive. Active Ninja telemetry in the top bar updates dynamically based on which map the user is hovering over.

### 9.2 Key State Variables (App.js)
| Variable | Type | Purpose |
|---|---|---|
| `isComparing` | Boolean | Triggers the split-screen layout via framer-motion |
| `activeViewport` | `'A'` \| `'B'` | Tracks which map the user is hovering. Drives Ninja telemetry. |
| `mapInstance` | useRef | Map 1 / Region A — always initialized |
| `mapInstance2` | useRef | Map 2 / Region B — initialized only when `isComparing=true`, destroyed on exit |

### 9.3 Interaction Engine (CRITICAL)
Both Map 1 and Map 2 have **100% identical interaction engines**:
- **Cluster Click:** Queries `/api/tiles/cluster/:id/expansionZoom` → cinematic `easeTo`. Falls back to Vogel Spiral Spiderfy at max zoom (capped at 30 leaves).
- **Unclustered Point Click:** Optimistic UI — opens `problem` tab instantly with skeleton, then fills from `/api/point/:id`.
- **Spider Point Click:** Same point-click handler routed through Spiderfy screen-space projections.
- **Cursor Feedback:** `pointer` cursor on `mouseenter`, restored on `mouseleave` for all interactive layers.

> ⚠️ **Layer Name Conflict Warning:** Map 2 uses suffixed layer IDs (`clusters-2`, `cluster-count-2`, `clusters-shadow-2`) to avoid MapLibre conflicts. However, `unclustered-point` and `spider-points-layer` are used by both maps inside their own GL contexts — this is safe because each map is a separate WebGL context.

### 9.4 Shared Texture Engine
`generateTextures(map)` is defined at **module scope** (outside the React component). It accepts the map instance as a parameter. Both `mapInstance` and `mapInstance2` call it on their respective `load` events. This ensures both maps have identical icon atlases without duplication.

### 9.5 Deliberate Pan-to-Update UX Design
The "crosshair auto-select" pattern was explicitly **rejected** as low-quality. The implemented pattern:
1. Region A/B search inputs show `"Search area or click update..."` placeholder.
2. When the user pans a map, an **"Update" button** will appear (wired next) to deliberately lock the new location.
3. Clicking "Update" triggers reverse geocoding of the map center and refreshes comparison data.

### 9.6 UI Standards for Comparison Mode
- **Region A/B Badges on Map:** `bg-white px-5 py-2 rounded-full shadow-2xl` with `text-black font-black tracking-widest uppercase text-xs`. Zero glow. Zero transparency.
- **Center Divider:** 2px solid white line. 32px solid white circle icon (black compare SVG inside). Matches badge language exactly.
- **Left Panel Inputs:** `bg-zinc-900 border-zinc-800` with search SVG icon. Muted `text-zinc-400` labels. No neon borders.
- **Top Bar Text:** Animated via `framer-motion` `<AnimatePresence mode="wait">`. Reads `"In Region A"` or `"In Region B"` dynamically.
- **OmniSearch:** Hidden (`display: none`) when `isComparing` is active.

### 9.7 Remaining Work (Next Agent Priorities)
1. **Comparison Matrix Data:** Populate the Region A Data / Region B Data cards with real stats (Ninja count, unresolved issue count, health score) fetched from the viewport bounds of each map.
2. **Mobile Stress Test:** Dual GL contexts are GPU-intensive. Verify memory does not exceed thresholds on mid-range mobile devices.

---

## 10. Dual-Map Interaction Parity Fix & Live Geocoding System *(Session: May 16, 2026 — Afternoon)*

This section documents two surgical engineering sessions that completed the Dual-Map engine and upgraded all geocoding surfaces.

### 10.1 Critical Bug Fix: Map B Dead Viewport

**Root Cause:** When `mapInstance2` was initialized, its cluster rendering layers were given unique suffixed IDs (`clusters-2`, `clusters-shadow-2`) to prevent MapLibre context conflicts. However, all the WebGL click interceptors and pointer events (`on('click')`, `on('mouseenter')`, `queryRenderedFeatures`) were copy-pasted from Map A and still targeted the `'clusters'` layer name — which doesn't exist in Map B's GL context. Map B rendered correctly but was entirely non-interactive.

**Fix Applied:** Surgical rename of all Map B interaction listeners to correctly target `'clusters-2'`:
- `mapInstance2.on('click', 'clusters-2', mapClickHandler)`
- `queryRenderedFeatures(e.point, { layers: ['clusters-2'] })`
- `on('mouseenter', 'clusters-2', ...)` / `on('mouseleave', 'clusters-2', ...)`

### 10.2 Critical Fix: Centralized Context Sync Engine

**Root Cause:** The `updateContext` function (responsible for updating Active Ninjas and Area Issues) was defined inside Map A's initialization `useEffect` closure. This meant it captured a stale snapshot of `activeViewport` and `isComparing` at initialization time (always `'A'` and `false`). Map B's `moveend` events were completely ignored.

**Fix Applied:** Ripped `updateContext` out of Map A's closure entirely. Replaced with a dedicated `useEffect` keyed on `[isComparing, activeViewport, activeFilters]`:
- Attaches `moveend` listeners to **both** `mapInstance` and `mapInstance2`.
- Reads the correct map based on live `activeViewport` state on every fire.
- Returns a cleanup function that removes listeners on dependency change to prevent memory leaks.
- Also populates the new `mapCenters: { A: LngLat, B: LngLat }` state for the geocoder.

### 10.3 Live Geocoding System for Comparison Mode

**Architecture Decision:** Instead of bolting geocoding logic onto existing components, a dedicated `RegionSearchInput` component was abstracted inside `AreaIntelligence.js`. It is self-contained and fully reusable.

**`RegionSearchInput` Props:**
| Prop | Type | Purpose |
|---|---|---|
| `region` | `'A'` \| `'B'` | Identifies which viewport to target |
| `panToRegion` | `function(lat, lng, target)` | Target-aware teleportation function |
| `getMapCenter` | `function(target)` | Imperative center read (fallback) |
| `mapCenter` | `{ lat, lng }` \| `null` | Live reactive center from `mapCenters` state |

**UX State Machine (The "Dirty State"):**
1. **Idle:** Input shows last resolved place name. Update button is white.
2. **Panning:** `mapCenter` prop updates. If user is not focused on input, coordinates auto-fill. Input border turns emerald. Update button glows emerald. (`isDirty = true`).
3. **On Update Click:** Hits Nominatim reverse geocode. Resolves to a clean place name. `isDirty = false`, everything resets to idle.
4. **User Types:** `isDirty = false`. Nominatim forward geocode fires after 500ms debounce. Dropdown appears with results. Selecting a result fires `panToRegion` and resets state.

**`panToRegion` is now target-aware:**
```js
const panToRegion = (lat, lng, target = 'A') => {
  const map = target === 'B' ? mapInstance2.current : mapInstance.current;
  if (map) map.flyTo({ center: [lng, lat], zoom: 16, duration: 1500 });
};
```

### 10.4 Google-Tier Spinner Upgrade

All raw CSS spinner divs (`<div class="border-t-transparent animate-spin">`) were replaced app-wide with the `Loader2` icon from `lucide-react` with `strokeWidth={3} animate-spin`. This affects:
- Main header search bar
- Region A geocoder
- Region B geocoder

### 10.5 Next Agent Priorities
1. **Comparison Matrix Data Cards:** Populate the Region A Data / Region B Data cards in the left panel with real, live stats derived from each viewport's bounds: Ninja count in view, unresolved issue count, and a computed Health Score.
2. **Mobile Stress Test:** Two WebGL contexts are GPU-intensive. Profile memory on mid-range devices and implement a graceful degradation strategy if needed.

---

## 11. High-Fidelity Area Intelligence Engine *(Session: May 16, 2026 — Evening)*

This section documents the complete engineering of the real-time, data-driven Area Intelligence dashboard.

### 11.1 The Root Problem (Why It Was Broken)

The map engine uses an R-Tree `supercluster` to group thousands of data points into single visual clusters (e.g., `1.4k`, `791`). The previous frontend used `queryRenderedFeatures({ layers: ['unclustered-point'] })` to gather data — this only captures points *not* inside any cluster. Since 99% of the 1.1M data points are hidden inside clusters at standard zoom levels, the left panel consistently showed `0 assets` and only a handful of challenges (the 6 mock incidents that happen to be unclustered).

### 11.2 The Failed Approach (Supercluster Map/Reduce)

**Do NOT attempt this again.** We tested injecting a `map` and `reduce` function into `superclusterOpts` in `tileEngine.js` to natively aggregate `count_*` properties inside cluster nodes. This caused **catastrophic V8 heap exhaustion**: allocating custom count properties on 1.1M points across all 20 zoom levels multiplied memory usage beyond the 2GB Node.js limit, silently crashing the server. The server appearing to "randomly shut down" was caused by this OOM crash.

```js
// ❌ NEVER DO THIS — crashes the server with OOM on 1.1M points
const superclusterOpts = {
  map: (props) => ({ [`count_${props.filterCategory}`]: 1 }),
  reduce: (acc, props) => { acc[key] = (acc[key] || 0) + props[key]; }
};
```

### 11.3 The Correct Architecture: `/api/tiles/bounds`

A new GET endpoint was added to `tileEngine.js`. It performs a direct O(N) scan of the `globalFeatures` array already loaded in Node.js process memory — **no additional database calls**.

```
GET /api/tiles/bounds?west=77.58&south=12.90&east=77.60&north=12.92
Response: { "total": 20990, "counts": { "Trees": 20940, "Toilets": 24, "Air": 3, ... } }
Latency: ~54ms for 1.1M points
```

**Why this is correct:** The `globalFeatures` array is the same dataset the Supercluster R-Tree is built from. Scanning it is a pure in-memory loop — V8's JIT compiler handles 1.1M iterations in ~50-60ms with zero heap bloat.

### 11.4 Frontend Hybrid Data Pipeline

`updateGlobalContext` in `App.js` now runs a **two-track** sync on every map `moveend` and `idle` event:

**Track 1 — Interactivity (MapLibre):**
```js
const pointFeatures = activeMap.queryRenderedFeatures({ layers: ['unclustered-point'] });
```
Captures individually visible, clickable point IDs. This ensures the "Verify Top Issue" button always has a real `dp_id` to pass to the Action Engine.

**Track 2 — Intelligence (Backend API):**
```js
fetch(`${API_BASE}/api/tiles/bounds?west=${w}&south=${s}&east=${e}&north=${n}`)
```
Fetches authoritative category counts. To prevent double-counting, the unclustered count per category is subtracted before the cluster aggregate is added to state.

**`idle` Binding:** Previously the sync only fired on `moveend`. The map's `idle` event now also triggers it, which means the panel populates **instantly on first page load** without requiring the user to pan.

### 11.5 AreaIntelligence.js Logic Rules

**Asset vs Challenge Classification:**
| Bucket | Condition | Color |
|---|---|---|
| **Verified Assets** | `category ∈ ['Climate', 'Public Infra', 'Water']` OR `type ∈ ['Trees', 'Toilets']` | `emerald-400` |
| **Active Challenges** | Everything else (Air, Safety, Garbage, Lake Polluted, Incidents, etc.) | `red-400` |

**Count-Weighted Reducer:** Each issue entry carries a `count` field. The reducer uses `issue.count || 1` — individual unclustered points have `count: 1`, while cluster aggregates carry their full count (e.g., `count: 20940`).

**No Slice Cap:** `.slice(0, 4)` was removed from both `sortedAssets` and `sortedChallenges`. Every category is shown. The sum of displayed items now mathematically equals the `TOTAL` badge — no more mismatch.

### 11.6 Data Flow Summary (On Map Pan)

```
User pans map
    → MapLibre fires 'moveend' → 'idle'
        → Track 1: queryRenderedFeatures(['unclustered-point'])
            → Collects clickable point IDs into visibleIssuesMap
        → Track 2: fetch('/api/tiles/bounds?west=...&north=...')
            → tileEngine.js iterates globalFeatures[] in memory (~54ms)
            → Returns { total, counts } by filterCategory
            → Subtracts unclustered per-category counts (prevent double count)
            → Merges cluster aggregates into visibleIssuesMap
        → setActiveAreaIssues(Array.from(visibleIssuesMap.values()))
            → AreaIntelligence.js receives array
            → Classifies each issue as Asset or Challenge
            → Renders totals + scrollable list — sums always match
```

### 11.7 Next Agent Priorities (Updated)

1. **Comparison Matrix Data Cards:** Wire the Area Intelligence `/bounds` API to populate the Region A / Region B data cards in Comparison Mode with live stats.
2. **Backend Stability (Local):** When running locally, use `node --max-old-space-size=2048 server.js` (already set in `package.json start` script) to ensure the 2GB heap cap is always in effect.
3. **Mobile Stress Test:** Profile dual GL contexts on mid-range Android devices.

---

## 12. Area Intelligence UX Audit & Google-Tier Overhaul *(Session: May 16, 2026 — Evening Session 2)*

This section documents the complete UX audit and re-engineering of the `AreaIntelligence.js` component to meet the Google Top 1% enterprise standard.

### 12.1 Root Problems Identified (Brutally Honest Audit)

The previous design violated core enterprise UX principles across multiple dimensions:

1. **Jargon Overload:** The word "viewport" is an internal engineering term. End users (civic workers, city admins, citizens) do not understand it. Other offenders: "Resolution required", "Assets in View".
2. **False Affordance on Challenge List:** The Active Challenges list was rendered as `<button>` elements with hover effects. However, the list is purely informational — it mirrors the map's own filter bar. Making it appear clickable created cognitive friction and user confusion about the panel's purpose.
3. **Fragmented Primary CTA:** The page had two competing calls-to-action (`Compare` cramped in the header, `Verify Top Issue` separately below) with no clear visual hierarchy. A user's eye had no clear entry point.
4. **Cyberpunk Neon Styling:** Tinted card backgrounds (`bg-emerald-500/5`, `bg-red-500/5`) and glowing CSS box shadows (`shadow-[0_0_15px_rgba(255,255,255,0.1)]`, `shadow-[0_0_10px_rgba(239,68,68,0.5)]`) created a hacker-aesthetic inconsistent with the Google Enterprise Dark Mode standard.

### 12.2 Changes Applied (`AreaIntelligence.js`)

| Element | Before | After |
|---|---|---|
| Subtitle | "Viewport analysis & metrics" | "Metrics for the currently visible map area" |
| Asset metric label | "Assets in View" | "Visible Assets" |
| Status text | "Resolution required" / "Optimal area health" | "Status: **Attention Needed**" / "Status: **Healthy**" with semantic color |
| Primary CTA | Small `Compare` button in header + `Verify Top Issue` button | Single full-width `+ Compare Areas` white button as the sole dominant action |
| Challenge list items | `<button>` with hover states, cursor-pointer | Pure `<div>` — read-only informational nodes, no interactivity |
| Asset card backgrounds | `bg-emerald-500/5 border border-emerald-500/10` | `bg-zinc-900/30 border border-zinc-800/80` (neutral surface) |
| Challenge card backgrounds | `bg-red-500/5 border border-red-500/10` | `bg-zinc-900/30 border border-zinc-800/80` (neutral surface) |
| Progress bar glow | `shadow-[0_0_10px_rgba(239,68,68,0.5)]` | Removed. Pure `bg-red-500/80` fill only. |

### 12.3 Design Principle: Read-Only Intelligence Panel

**The Area Intelligence panel is NOT an action surface.** It is a live analytical mirror of the map state. This is the same philosophy Google Maps uses in its "Explore" sidebar — it informs, it does not command. The single action it exposes is comparison, which requires going deeper into a dedicated mode.

**Rule for all incoming agents:** Do NOT add interactive list items to the Assets or Challenges lists. If an action is needed, it belongs in the `ActionEngine.js` component, not here.

### 12.4 Bug Fix: Mismatched JSX Tag
During the `<button>` → `<div>` conversion, a stale `</button>` closing tag was left in the Active Challenges mapping loop, causing a React JSX syntax error. Fixed surgically by replacing `</button>` with `</div>` at the correct nesting level.

### 12.5 Updated Next Agent Priorities

1. **Comparison Matrix Data Cards:** Wire `/api/tiles/bounds` to the Region A/B data cards in Compare Mode with live: Ninja count, challenge count, computed health score.
2. **People/Ninja Tab Overhaul:** Apply the same Top 1% design audit to the Ninja/People tab — read-only intelligence + single CTA architecture.
3. **Generative Ninja Avatars:** Implement a deterministic, hash-based generative avatar system for each Ninja using their name. The avatar should be visually unique per person without requiring image assets.
4. **Data Persistence:** Transition mock `ISSUES`, `NINJAS`, `MOCK_LEADERBOARDS` arrays to real API calls from the backend context layer.
5. **Mobile Stress Test:** Dual GL contexts on mid-range Android devices. Profile and implement graceful degradation if needed.

---

## 13. Bengaluru Actions LLM Ingestion Pipeline *(Session: May 16, 2026 — Evening Session 3)*

This section documents the complete engineering of the Civic Data Action Pipeline — transforming 4,795 rows of raw, unstructured Ninja field reports into structured, LLM-enriched intelligence rendered on the map as living "Data Stories".

### 13.1 Dataset Context

| Dataset | Source File | Records | Status |
|---|---|---|---|
| **Bengaluru Actions** | `Bengaluru-actionsv3.xlsx` (Sheet: Datapoints) | ~4,795 rows | ⏳ Ingestion in progress (parallel, fault-tolerant) |
| **Ninja Field Workers** | `Bengaluru-actionsv3.xlsx` (Sheet 2) | 707 records | ✅ Fully ingested |

**Decision:** Actions are classified as a distinct data type (`type: 'Action'`), separate from Assets (Trees, Toilets) and Challenges (Incidents). They appear in the Area Intelligence panel as "Data Stories" — not as map markers that compete with standard civic data. This maintains cognitive clarity in the UI.

### 13.2 Critical Data Cleaning (Irreversible Fixes Applied)

1. **Ninja Lat/Lng Column Swap:** All 707 Ninja records had `latitude` and `longitude` inverted in the raw Excel. All coordinates would have pointed to the ocean without this fix. Corrected at ingestion time by swapping the two values before DB insert.
2. **JSON Double-Comma Sanitization:** Raw `details_2` strings contained `,,` (double-comma) malformed JSON syntax. Regex `str.replace(/,,+/g, ',')` was applied before `JSON.parse()` to prevent silent `undefined` data corruption.

### 13.3 LLM Enrichment Architecture

**Model:** Groq `llama-3.1-8b-instant`  
**Keys:** 3 API keys (rotating, one per worker)  
**System Prompt Design (Finalized — Do NOT change):**
```
You are a Google Top 1% Tier Civic Data Architect.
Analyze the unstructured civic action report and output a strict JSON object.
Output Schema:
{
  "headline": "A concise 40-50 char summary",
  "actionIntent": "Enum: ['Resolution', 'Reporting', 'Awareness', 'Data Collection', 'Other']",
  "sentiment": "Enum: ['Positive', 'Urgent', 'Neutral']",
  "keyTags": ["up to 3 concise tags"]
}
```

**Quality Audit (5 Samples Verified):**
The model correctly strips conversational filler from raw Ninja text and extracts clean, scannable intelligence. Example:
- Raw: *"Discussed street drain problems with local people in groups to understand the issues and reasons for not complaining to BBMP..."*
- `headline`: `"Residents discuss street drain issues"` — ✅ Perfect length, zero jargon
- `sentiment`: `"Neutral"` — ✅ Correct (it's exploratory, not resolved or urgent)
- `actionIntent`: `"Awareness"` — ✅ Accurate classification
- `keyTags`: `["Community Engagement", "Public Awareness", "BBMP"]` — ✅ Precise, reusable

**Conclusion: Schema is production-ready. Do NOT modify the system prompt.**

### 13.4 Parallel Ingestion Engine (`ingest_actions_parallel.js`)

The original sequential script (`ingest_actions_master.js`) processed at ~80 RPM but using only 1 key at a time. The parallel version (`ingest_actions_parallel.js`) is the definitive, production-grade script.

**Architecture:**
- **3 concurrent async workers** spawned via `Promise.all()` — each assigned one unique Groq API key
- **Shared queue pattern** — all 3 workers drain from a single `queue[]` array. No row is ever processed twice
- **Per-worker throttle:** Each worker enforces exactly 2050ms between its own requests → 30 RPM per key → **90 RPM total**
- **Auto-resume / deduplication:** Queries DB for all existing `'S No'` values before starting. Only unprocessed rows enter the queue. **Kill and restart anytime** without data duplication.
- **Exponential backoff:** On 429 rate-limit response, the affected worker sleeps `5000ms * retries` before retrying on the same key.
- **Live telemetry:** A real-time progress line is printed to stdout every 5 rows showing `processed/total`, `✅ successes`, `⏭️ skipped`, `❌ errors`, and elapsed time.

**To run:**
```bash
# From: E:\D_Drive_Migration\SamaajData\new\react-lm4j8tjk\Rama Sir backend
node ingest_actions_parallel.js
```

### 13.5 DB Storage Schema for Actions

All enriched data is stored in `public.datapoints.details_1` (JSONB). The raw field is preserved alongside the LLM output block. `details_2` is always NULL.
```json
{
  "S No": 1,
  "Dataset ID": 7,
  "latitude": 12.9716,
  "longitude": 77.5946,
  "description": "Original raw text from Ninja field report...",
  "llm_enriched": {
    "headline": "Residents discuss street drain issues",
    "actionIntent": "Awareness",
    "sentiment": "Neutral",
    "keyTags": ["Community Engagement", "BBMP", "Drainage"]
  }
}
```

### 13.6 Backend Changes (`tileEngine.js` + `db.js`)

**`db.js`:** `getAllSpatialDatapoints` query now `SELECT`s `ds.type` from the `datasets` table. This is how the tile engine knows to treat a point as an `'Action'` vs. a `'Toilet'`.

**`tileEngine.js` — `initTileEngine()`:**  
When building the in-memory feature array, for any point where `row.type === 'Action'` and `details_1.llm_enriched` exists, the engine extracts and stores `{ headline, sentiment, intent }` into `properties.actionData`. This costs a single JSON parse at startup but enables O(1) retrieval during the bounds scan — zero additional DB queries at runtime.

**`tileEngine.js` — `/api/tiles/bounds`:**  
The bounds route now returns a third field: `actions[]`. For every Action point within the bounding box, it pushes `{ id, category, lat, lng, headline, sentiment, intent }` into this array (capped at 15 per viewport to prevent UI lag). The response shape is now:
```json
{
  "total": 21034,
  "counts": { "Trees": 20940, "Toilets": 24, "Action": 50, "Air": 3 },
  "actions": [
    { "id": 1168601, "headline": "Residents discuss drain issues", "sentiment": "Neutral", "lat": 12.97, "lng": 77.59 }
  ]
}
```

### 13.7 Frontend Changes (`App.js` + `AreaIntelligence.js`)

**`App.js`:**
- New `activeAreaActions` state (`useState([])`). Populated from `data.actions` in the bounds API `.then()` handler.
- `AreaIntelligence` now receives `activeAreaActions` as a prop alongside `activeAreaIssues`.
- Action points are excluded from the standard `unclustered-point` MapLibre symbol layer via an explicit `['!=', ['get', 'type'], 'Action']` filter.
- Two new WebGL paint layers added for Actions:
  - `unclustered-action-pulse` — larger, semi-transparent emerald circle (animates via WebGL)
  - `unclustered-action-point` — smaller, solid emerald inner dot
- `handleUnclusteredClick` handler also attached to `unclustered-action-point` layer so clicking Action pulses opens the Action Engine panel.
- **Critical Bug Fixed:** The `handleUnclusteredClick` async function block was accidentally truncated during a previous layer injection. Restored with the full try/catch/finally block and Optimistic UI pattern.

**`AreaIntelligence.js`:**
- Accepts `activeAreaActions = []` as a new prop (default-safe).
- Renders a new **"Area Impact / Data Stories"** section below "Active Challenges".
- Each card shows: `headline` (large), `sentiment` badge (emerald), `category/intent` label (muted zinc).
- Clicking a card triggers `panToRegion(action.lat, action.lng)` — cinematic `flyTo` to the action coordinates.
- **Bug Fixed:** Two stray `</div>` closing tags from a prior injection left the JSX tree unbalanced, causing a React compile error at line 404. Removed.

### 13.8 Process Killed: Rogue Background Node Server

A background `node server.js` process (PID 10780) from a previous agent session was occupying port 5000, preventing the user from starting a fresh server instance. Identified via `netstat -ano | findstr :5000` and terminated via `taskkill /F /PID 10780`. Port 5000 is now clean for user-controlled server starts.

### 13.9 Next Agent Priorities (Updated after Session 3)

1. **Complete Full Batch Ingestion:** The parallel ingestion script (`ingest_actions_parallel.js`) is actively running. Monitor it. Once complete, restart `server.js` so the new Action records are loaded into the Supercluster memory tree.
2. **Generative Ninja Avatars:** Implement a deterministic, name-hash-based SVG avatar generator for each of the 707 Ninja records. No external image assets required.
3. **Comparison Matrix Data Cards:** Populate the Region A/B cards in Compare Mode with live data from `/api/tiles/bounds` for each viewport.
4. **Push to Railway:** Once local testing is confirmed clean, push the updated `tileEngine.js`, `db.js`, and `server.js` to the `samaajdata-backend` GitHub repo for Railway auto-deploy.
5. **Mobile Stress Test:** Profile dual GL contexts + Action pulse layers on mid-range Android devices.

---

## 14. Area Intelligence UX: Google Top 1% Overhaul *(Session: May 17, 2026)*

This section documents the surgical, comprehensive UX re-engineering of the Area Intelligence module — elevating it from a functional MVP prototype to a genuine Google/Palantir-grade enterprise intelligence surface.

### 14.1 Brutal Audit: 4 Disqualifying Failures

A thorough review of the previous implementation identified the following critical gaps:

| # | Problem | Root Cause |
|---|---|---|
| 1 | **"ACTIVE ISSU..." metric truncation** | `grid-cols-3` with labels like "Active Issues" — too wide for the column |
| 2 | **All feed cards showing "Civic Action Recorded"** | `tileEngine.js` only extracted `actionData` when `llm_enriched` existed; raw `description` was never used as fallback |
| 3 | **Pill-shaped filter buttons (prototype aesthetic)** | `rounded-full bg-emerald-500` pills look like a 2020 SaaS toy, not enterprise software |
| 4 | **Boxed card timeline (heavy, disconnected)** | Each action item was a fully bordered `rounded-xl` card, creating visual weight |

### 14.2 Backend Fix: `tileEngine.js` — Defensive `actionData` Fallback

The `initTileEngine()` function in `tileEngine.js` was patched to ensure **every Action-type point** always gets a meaningful `actionData` block, even if LLM enrichment was not yet completed:

```js
// BEFORE — only works for LLM-enriched rows
if (row.type === 'Action' && parsed.llm_enriched) {
  actionData = { headline: parsed.llm_enriched.headline, ... };
}

// AFTER — works for ALL Action rows with a 3-tier fallback
if (row.type === 'Action') {
  const enriched = parsed.llm_enriched || {};
  actionData = {
    headline: enriched.headline || parsed.description || parsed.subcategory || 'Civic Action',
    sentiment: enriched.sentiment || 'Positive',
    intent: enriched.actionIntent || parsed.subcategory || 'General'
  };
}
```

> ⚠️ **Critical:** `node server.js` MUST be restarted after this fix — the in-memory GeoJSON feature array is only built once at boot.

### 14.3 Frontend: Vercel-Style Metric Card

The status summary card was completely re-architected from a fragile `grid-cols-3` layout to a premium `flex`-row layout with explicit vertical `w-px` dividers. The label-to-value ratio is now mathematically guaranteed to never truncate:

- **Label tokens:** `ASSETS`, `ISSUES`, `ACTIONS` — max 7 characters, always fit
- **Card surface:** `bg-[#121212] border border-[#27272a] rounded-[16px]` — Vercel/Linear dark mode baseline
- **Numbers:** `text-2xl font-bold tracking-tight` — crisp, scannable at a glance
- **Status line:** `SYSTEM: NOMINAL` / `SYSTEM: ATTENTION` — enterprise observability language (matches Datadog, Grafana patterns)
- **Chevron hints on Assets and Issues:** Subtle `ChevronDown` icons signal clickability; clicking scrolls to the relevant section via `useRef` anchors + `scrollIntoView({ behavior: 'smooth' })`
- **Civic Actions column:** Clicking opens the nested feed; features a pulsating live indicator dot

### 14.4 Frontend: Linear-Style Tab Filters (Impact Feed)

Replaced all pill buttons with border-bottom tab selectors — the universal enterprise navigation pattern:

```
BEFORE: rounded-full bg-emerald-500 text-black    (prototype, pill)
AFTER:  border-b-2 border-emerald-500 text-white  (enterprise, tab)
```

The filter bar is flush against a full-width `border-b border-zinc-800/80` line that bleeds edge-to-edge with `-mx-8 px-8`, identical to Linear's issue filter bar pattern.

### 14.5 Frontend: Open-Spine Timeline (Impact Feed)

The bordered action card list was replaced with a continuous, open-spine vertical timeline — the canonical pattern used by GitHub Timeline, Linear Activity, and Vercel Deployment Logs:

| Design Token | Before | After |
|---|---|---|
| Row gap | `gap-6` (explicit gap) | `py-4` per row (self-spacing) |
| Spine line | `w-[2px]` thick, dark line | `w-px` hairline, `bg-zinc-800/80` |
| Dot/node | `w-8 h-8` bordered circle + Sparkles icon | `w-[26px] h-[26px]` bg container + `w-[8px] h-[8px]` inner dot |
| Dot hover | Entire circle color change | Only inner dot transitions: `bg-zinc-700` → `bg-emerald-500` |
| Action card | `rounded-xl border bg-zinc-900/30` full box | Flat open content, no borders, breathes naturally |
| Headline | `text-[13px] font-medium` | `text-[14px] font-medium leading-relaxed` |
| User identity | Borderless box with SVG avatar | Clean `User` icon with `bg-emerald-500/10 border border-emerald-500/20` halo |

### 14.6 App.js: `onIssueSelect` Deep-Link Integration

A new `onIssueSelect` async callback was threaded from `App.js` down into `<AreaIntelligence />`. When a user taps any action in the Impact Feed, it simultaneously:
1. Fires `panToRegion(action.lat, action.lng)` — cinematic map `flyTo`.
2. Fires `onIssueSelect(action.id)` — switches to the `problem` tab and fetches the full detail from `/api/point/:id`.

This completes the **Intelligence → Map → Action Engine** deep-link flow.

### 14.7 Established Design Rules (Inviolable for Future Sessions)

> These rules are permanent architectural standards. Any future agent must comply.

1. **Metric labels ≤ 10 chars.** Never use "Active Issues" — use "ISSUES". Never "Visible Assets" — use "ASSETS".
2. **Filter navigation = border-bottom tabs only.** Never pill buttons in an intelligence panel.
3. **Timeline = open-spine only.** Never individually-bordered cards for feed items.
4. **No generative SVG avatars.** Use the `User` icon from `lucide-react` inside a styled container.
5. **Any `tileEngine.js` edit requires a server restart.** Memory is loaded once at boot — there is no hot-reload.
6. **The Area Intelligence panel is read-only.** Do NOT make Assets or Challenges list items interactive buttons. If an action is needed, it belongs in `ActionEngine.js`.

### 14.8 Updated Next Agent Priorities

1. **Verify server restart reflects new data:** After restarting `node server.js`, confirm the Impact Feed shows real Ninja action descriptions (not "Civic Action Recorded") using a Bengaluru-area viewport.
2. **Comparison Matrix Data Cards:** Populate Region A/B stat cards in Compare Mode with live data from `/api/tiles/bounds` for each respective viewport.
3. **People/Ninja Tab Overhaul:** Apply the same read-only intelligence + open-spine architecture to the Ninja/People tab.
4. **Push to Railway:** After local validation, sync `tileEngine.js`, `server.js`, and `AreaIntelligence.js` to the `samaajdata-backend` GitHub repo for Railway auto-deploy.
5. **Mobile Stress Test:** Profile the dual GL contexts + Action pulse WebGL layers on mid-range Android hardware.

---

## 15. Action Intelligence UI: Rich Data Panel & Google Maps Marker Overhaul *(Session: May 17, 2026 — Late Night)*

### 15.1 Session Goals & Outcomes

The user provided a screenshot showing the detail panel for an Action point. It showed generic placeholders like "Investigation & Audit Facility", "Data Story Action", "Date: On Record", and "Status: Active Facility" — none of which reflect the incredibly rich JSONB data stored in the database. This session overhauled the full data pipeline from raw source to rendered UI.

### 15.2 Dataset Audit: `Bengaluru-actionsv3.xlsx`

A `read_excel.js` diagnostic script was run to confirm the exact schema of the Action source file:

**Sheet 1 — Datapoints (4,795 rows):**
| Column | Description |
|---|---|
| `S No` | Row identifier (used for de-duplication during ingestion) |
| `Dataset ID` | Foreign key mapping to Sheet 2 |
| `latitude` / `longitude` | GPS coordinates |
| `details_2` | Raw JSON string: `{ "action_added_on": "45502.79", "subcategory": "Dengue Hotspot", "description": "...", "hours_invested": 0.15 }` |
| `full_name` | Citizen who took the action |
| `org_id` | Organization (e.g., "Reap Benefit Team", "deccan", "OASIS") |
| `gender` | Citizen gender |
| `user_city` | City of citizen |

**Sheet 2 — Datasets (34 rows):** Maps `Dataset ID` → `Category` (e.g., "Civic & Infrastructure") + `Action Type` (e.g., "Community & Engagement", "Hands-on Action", "Investigation & Audit").

### 15.3 Layer Overhaul: Pulsating Circles → Google Maps Style Markers

**Root Problem Identified:** The previous pulsating circle implementation (`unclustered-action-pulse` + `unclustered-action-point`, both `circle` type layers) had two compounding bugs:
1. **Violet Fallback:** When Spiderfy expanded an Action cluster, the `spider-points-layer` fell through to `icon-default` — which is rendered as a violet circle in the canvas generator. This was the mystery "violet blob" bug.
2. **Aesthetic Mismatch:** Animated CSS circles look amateurish next to the crisp WebGL symbol icons used for Trees, Toilets, and all other data types.

**Fix Applied (3 files):**
- `ISSUE_CONFIG` in `App.js`: Added `'Action': { icon: CheckCircle2, color: '#10b981' }` — now registered in the texture atlas system.
- `unclustered-action-pulse` + `unclustered-action-point` → **deleted**. Replaced with a single `unclustered-action-symbol` (`symbol` type, `icon-image: 'icon-Action'`).
- `spider-points-layer` `icon-image`: Changed from a simple `coalesce` to a `case` expression that intercepts `type === 'Action'` first and forces `icon-Action`.
- All changes applied to **both Map 1 and Map 2** (Map B uses `unclustered-action-symbol-2` suffix).

### 15.4 Backend: Rich Action Parsing in `/api/point/:dp_id`

Previously, the endpoint's `else` branch treated Actions as generic facilities, building headings like "Investigation & Audit Facility" and returning `date: null`.

A dedicated `else if (row.type === 'Action')` block was added to `server.js`:

```js
} else if (row.type === 'Action') {
    const llm = d1.llm_enriched || {};
    heading = llm.headline || d1.subcategory || 'Civic Action';
    description = d1.description || row.dataset_description || '';
    // Excel serial date (days since 1900-01-01) → locale string
    if (d1.action_added_on) {
        const excelDate = parseFloat(d1.action_added_on);
        date = new Date(Math.round((excelDate - 25569) * 86400 * 1000))
                   .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    threatLevel = 'Action'; // Frontend discriminator — NOT a severity level
    location = { City: d1.user_city || 'Bengaluru', Lat: lat.toFixed(5), Lng: lng.toFixed(5) };
    metadata = {
        'Citizen Name': d1.full_name !== '#REF!' ? d1.full_name : 'Anonymous',
        'Organization': d1.org_id !== '#REF!' ? d1.org_id : 'Independent',
        'Hours Invested': d1.hours_invested || 0,
        'Sentiment': llm.sentiment || 'Positive',
        'Primary Intent': llm.actionIntent || d1.subcategory || 'General',
        'Gender': d1.gender || 'Not Specified'
    };
}
```

**Key design decisions:**
- `threatLevel: 'Action'` is a **type discriminator**, not a severity. The frontend uses it to branch into a different UI path.
- `mobile_no` is NEVER exposed to the frontend (privacy).
- `#REF!` strings from Excel formula errors are sanitized to human-readable fallbacks.
- Excel serial dates (stored as floating-point numbers of days since Jan 1, 1900) are correctly converted using the `(excelDate - 25569) * 86400 * 1000` formula.

### 15.5 Frontend: Conditional Action Intelligence Panel (`ActionEngine.js`)

When `selectedIssue.type === 'Action'`, the component now renders a distinct "Civic Action Intelligence" panel **instead** of the gamified effort levers ("How much time can you spare?").

**What is shown for Actions:**

| Section | Content |
|---|---|
| **AI Sentiment** | Color-coded block: Emerald (Positive), Red (Negative/Urgent), Blue (Neutral) — driven by `meta.Sentiment` from LLM |
| **Primary Intent** | Indigo block showing `meta['Primary Intent']` (e.g., "Awareness", "Resolution") |
| **Execution Details** | Clean table: Citizen / Organization / Gender / Hours Invested |
| **CTA** | "Endorse & Validate Action" — Emerald solid button, awards +25 XP |

**What is shown for Facilities/Issues (unchanged):**
- "How much time can you spare?" effort levers (10 Seconds / 2 Minutes / Heavy Lifter)
- Facility Attributes pill grid
- Gamified resolution pipeline

**Status label fix:**
- `threatLevel: 'Action'` → displays **"Verified Action"** in emerald
- `threatLevel: 'Low'` → displays **"Active Facility"** in emerald (unchanged)
- `threatLevel: 'Critical'/'High'/'Moderate'` → unchanged red/orange/yellow

### 15.6 Key Files Modified (This Session)

| File | Change |
|---|---|
| `server.js` | Added `else if (row.type === 'Action')` block. Excel date conversion. Rich metadata normalization. `threatLevel: 'Action'` discriminator. |
| `App.js` | `ISSUE_CONFIG` gains `'Action': { icon: CheckCircle2, color: '#10b981' }`. Replaced `unclustered-action-pulse` + `unclustered-action-point` with `unclustered-action-symbol`. Spiderfy `spider-points-layer` gets `case` expression for Action icons. All changes mirrored to Map B. |
| `ActionEngine.js` | Conditional render: `selectedIssue.type === 'Action'` → Civic Action Intelligence panel. All other types → original gamified levers. Status color/label updated for `'Action'` threatLevel. |
| `read_excel.js` | **[NEW — temp diagnostic]** Reads `Bengaluru-actionsv3.xlsx`, prints sheet names, column schemas, and 3 sample rows. Can be deleted. |

### 15.7 Next Agent Priorities

1. ~~**Smoke test Action clicks**~~ — ✅ Confirmed working (marker renders, Civic Intelligence panel opens with real data).
2. ~~**Subcategory filters in Impact Feed**~~ — **DONE. See §16 below.**
3. **Comparison Matrix Data Cards:** Populate Region A/B stat cards in Compare Mode with live data from `/api/tiles/bounds`.
4. **Railway Deploy:** Push updated `server.js`, `tileEngine.js`, `App.js`, `AreaIntelligence.js` to `samaajdata-backend` GitHub repo for production deploy.
5. **Mobile Stress Test:** Profile dual GL contexts on mid-range Android hardware.

---

## 16. Action Filtering: Full-Stack Sync Engine *(Session: May 17, 2026 — Afternoon)*

### 16.1 What Was Wrong (Brutally Honest)

Two production-blocking bugs in the filter system were shipped:

| Bug | Root Cause | Symptom |
|---|---|---|
| **Filters were decorative** | `impactFilter` / `actionTypeFilter` state lived inside `AreaIntelligence.js` — isolated from the tile engine in `App.js`. Clicking "CIVIC & INFRASTRUCTURE" updated a local state variable that was never passed to the Mapbox tile URL. Map didn't react. | Filter tabs appeared to work but the list below didn't change. |
| **Zoom-out erased filters** | `/api/tiles/bounds` payload hard cap was 15 actions. Filter pill list was built from `actions[]`, not a comprehensive viewport scan. Any viewport with >1 category would show only the categories represented in the first 15 returned rows. | Zooming out caused filter tabs to collapse to 1 or disappear entirely. |

### 16.2 Backend Changes: `tileEngine.js`

**A. `/bounds` — Full Viewport Filter Manifest**

Raised action payload from 15 → 100. Added a second pass over ALL viewport actions using `Set` objects to collect every unique `category` and `subcategory` regardless of payload cap:

```js
res.json({ total, counts, actions, filters: {
    categories: Array.from(availableCategories),  // All unique categories in viewport
    actionTypes: Array.from(availableActionTypes)  // All unique subcategories in viewport
}});
```

Filter tabs now always show the complete taxonomy in view, even if the feed only loads 100 items.

**B. `getTargetIndex()` — Subcategory-Aware Dynamic Indexing**

Signature upgraded from `(categoryParam, isAction)` → `(categoryParam, isAction, actionCat, actionType)`.

When `actionCat` or `actionType` is not default, the function filters `actionGlobalFeatures` before building a temporary Supercluster sub-index. The cache key includes the filter params: `${cacheKey}_action_${actionCat}_${actionType}`.

All three tile route handlers (`/:z/:x/:y`, `/cluster/:id/expansionZoom`, `/cluster/:id/leaves`) upgraded to extract and forward `actionCat`/`actionType` query params.

### 16.3 Frontend Changes: `App.js`

**A. State Promoted to Global Scope**
```js
const [activeAreaActionFilter, setActiveAreaActionFilter]     = useState('All Categories');
const [activeAreaActionTypeFilter, setActiveAreaActionTypeFilter] = useState('All Types');
const [activeActionFiltersList, setActiveActionFiltersList]   = useState({ categories: [], actionTypes: [] });
```

`activeActionFiltersList` is populated from `data.filters` in the bounds response on every `moveend` / `idle`.

**B. Tile URL Reflects Active Filters**
```js
if (activeAreaActionFilter !== 'All Categories') newTilesUrl += `&actionCat=${encodeURIComponent(activeAreaActionFilter)}`;
if (activeAreaActionTypeFilter !== 'All Types')  newTilesUrl += `&actionType=${encodeURIComponent(activeAreaActionTypeFilter)}`;
```
useEffect dep array updated to include both new state variables → map re-renders instantly on filter change.

**C. Spiderfy Sync**

Both cluster click handlers read active filter params from the live tile source URL before calling `/expansionZoom` and `/leaves`, ensuring the spiderfy explosion only shows leaves that match the active subcategory filter.

### 16.4 Frontend Changes: `AreaIntelligence.js`

- **Removed local state** — `impactFilter` and `actionTypeFilter` are now received as props from `App.js`.
- **Filter tabs** source from `activeActionFiltersList.categories` (backend manifest), NOT from `activeAreaActions`. These are two different things. The manifest is comprehensive; the actions array is a capped subset.
- **Case-insensitive matching** (`.toLowerCase()`) added to the filter predicate for robustness.
- **Feed capped at `.slice(0, 20)`** for 60fps scroll performance.
- **Spacing tightened:** `mt-4 mb-0` on pill row, `mt-0` on timeline — ~12px of dead space removed.

### 16.5 Architecture Rationale

Filter state that affects both the **sidebar feed** AND the **map tile layer** MUST live in `App.js`. `AreaIntelligence.js` owns the sidebar UI, but not the map. Lifting state to `App.js` and passing setters as props is the correct React architecture — not a workaround.

### 16.6 Key Files Modified

| File | Change |
|---|---|
| `tileEngine.js` | `/bounds` → payload 15→100, `filters` manifest added. `getTargetIndex` → `actionCat`/`actionType` params. All 3 route handlers updated. **Requires server restart.** |
| `App.js` | 3 new state variables. Tile URL appends filter params. `useEffect` dep array updated. `<AreaIntelligence>` gets 4 new props. Cluster click handlers forward filter params. |
| `AreaIntelligence.js` | Local filter state removed. Filter tabs use backend manifest. Case-insensitive matching. Feed sliced at 20. Spacing tightened. |

### 16.7 Next Agent Priorities

1. **Smoke test the end-to-end filter loop** — Click "Water & Sanitation" in the sidebar. Confirm the feed list AND the map cluster counts change simultaneously.
2. **Wire the Actions map filter button** — `PRIMARY_FILTERS` in `App.js` includes `'Actions'`. `ISSUE_CONFIG` has the entry. The map header toggle button must be wired so clicking "Actions" sets `activeFilters: ['Actions']` and triggers the tile refresh.
3. **Comparison Matrix Data Cards** — Populate Region A / Region B stat cards with live `/api/tiles/bounds` data per viewport.
4. **Railway Deploy** — Push `tileEngine.js`, `App.js`, `AreaIntelligence.js` to `samaajdata-backend` repo.
5. **Mobile Stress Test** — Profile two WebGL contexts on mid-range Android hardware.

---

## 17. High-Fidelity Data Refinement & Searchable Topic Ingestion *(Session: May 17, 2026 — Afternoon/Evening Session)*

### 17.1 Session Goals & Outcomes
This session surgically addressed three high-priority requests to refine the civic action ingestion pipeline, sanitize frontend metadata display, and introduce searchable granular topic filtering for high-density action records (e.g. "Street Lights").

### 17.2 Real-time Searchable Topic Filtering System
- **Topic Extraction (`tileEngine.js`):** Extracted `topic` from `actionData.headline` (e.g. `"Street Lights"`, `"Urban Flooding"`) at system load. Cached on `properties.topic` of every action feature in the in-memory array.
- **Dynamic Indexing & Filtering (`tileEngine.js`):** Upgraded `getTargetIndex` and all vector tile routes (`/:z/:x/:y`, `/expansionZoom`, `/leaves`) with the new `topic` parameter. A dynamic temporary Supercluster is created and cached in `actionFilterIndexes` when a topic filter is selected.
- **Live Viewport Collection (`tileEngine.js`):** Updated the `/bounds` endpoint to aggregate and return `filters.topics` (a sorted list of all unique topics currently present in the active map bounding box) with zero DB overhead.
- **Frontend Integration (`App.js`):** Added global `activeAreaTopicFilter` state. Appended `&topic=` to the vector tile URL generated on the Mapbox source layer.
- **Live Search & Dropdown UI (`App.js`):** Implemented an elegant "Action Topics in view" section in the main "More" filters dropdown. Sourced dynamically from the backend viewport manifest, fully searchable (with fuzzy text matching), and supporting single-select with single-click instant tile refresh and map updates.

### 17.3 Detail Panel Sanitization & LLM Injected Noise Purging
- **Pure Source Data (`ActionEngine.js`):** Replaced the generic placeholders/AI-sentiment/Organization/Gender panels with a high-fidelity civic detail grid:
  - **Classification Badge:** Solid color-coded badge dynamically calculated using pure source fields: `ASSET` (emerald), `MOMENTUM` (blue), `CHALLENGE` (amber). No glowing shadows or transparent layers.
  - **Action Type:** Visualized the authentic subcategory (e.g. `"Hands-on Action"`).
  - **Civic Domain:** Visualized the authentic category mapping.
  - **Hours Invested:** Clean time tracking (e.g. `"3 hrs"`).
- **Sanitized Headers (`ActionEngine.js`):** Discarded LLM-generated summaries and placed the authentic raw `details_1.subcategory` as the primary topic heading, accompanied by the raw `details_1.description` and date info.
- **Stray Visuals Removed:** Eliminated all lingering personal identity containers, empty boxes, and LLM-sentiment gauges.

### 17.4 Key Files Modified
| File | Changes Made |
|---|---|
| `tileEngine.js` | Mapped `properties.topic` from `headline`. Upgraded `getTargetIndex` to filter features by topic. Upgraded vector tile routes. Collected and returned unique `topics` inside `/bounds`. |
| `App.js` | Added `activeAreaTopicFilter` state. Appended `topic` to tile PBF requests. Added searchable, single-select "Action Topics in view" section to More dropdown, with clear all/badge indicators. |
| `ActionEngine.js` | Purged LLM sentiment/intent, citizen name, organization, and gender fields. Added clean data details grid (Classification, Civic Domain, Action Type, Hours). |

### 17.5 Next Agent Priorities
1. **Push to Railway:** Push the updated `tileEngine.js`, `server.js`, `App.js`, and `ActionEngine.js` to the `samaajdata-backend` production repo.
2. **Rankings Integration:** Connect region comparison cards with the city ranking telemetry so users see comparative leaderboard rankings live.

---

## 18. Purging Mock Data Protocols & System Stability *(Session: May 17, 2026 — Late Evening Session)*

### 18.1 Session Goals & Outcomes
This session successfully executed a comprehensive, surgical removal of all synthetic, hardcoded mock data across the SamaajData stack (database, backend tile engine, and frontend UI), transitioning the platform to rely 100% on live production telemetry. We also resolved critical UI runtime crashes and build compilation errors.

### 18.2 Complete Mock Data Decommissioning
- **Database Sanitization:** Purged 77 synthetic mock issues and the `Mock Issues` dataset (ID 4) completely from the PostGIS database.
- **Backend Refactoring:**
  - **`server.js`:** Removed the dedicated `Mock Issues` branch in the `/api/point/:dp_id` endpoint.
  - **`tileEngine.js`:** Stripped the R-Tree initialization logic of any `Mock Issues` filter Category overrides, ensuring the engine exclusively loads real civic data (Facility/Action).
- **Frontend Purge (`App.js` & Components):**
  - **`App.js`:** Completely decommissioned `generateMockIssues()`, the `ISSUES` constant, and the `NINJAS` hardcoded mock array.
  - **`NinjaTaskforce.js`:** Removed the mock `COMMUNITIES` section and image-based avatars.
  - **`AreaIntelligence.js`:** Removed the `MOCK_LEADERBOARDS` static data and implemented an "In Development" UI placeholder for the rankings view, keeping the component structure intact for future real-time telemetry.
  - **Legacy Filters:** Removed hardcoded categories (e.g., "Air," "Stubble Burning") from `SECONDARY_FILTERS` in `App.js` that had no corresponding data points in the production database.

### 18.3 High-Fidelity Roster & Deterministic Avatars
- **Live Roster Bindings:** Replaced the hardcoded Ninja roster with dynamic, live viewport-based retrieval using `queryRenderedFeatures` from the active MapLibre instance to retrieve real-time Ninjas currently within the user's viewport.
- **Deterministic Initial-Letter Avatars:** Converted mock user avatars to a deterministic, initial-letter-based system (consistent with the `NinjaAvatar` palette in `App.js`) to provide premium visual uniformity and eliminate dependency on external placeholder images.

### 18.4 Defensive Stability & Build Fixes
- **Null-Safe Fallbacks (`AreaIntelligence.js`):** Patched the sorted challenges and assets mapping loops to use a guaranteed-safe terminal fallback `{ icon: Target, color: '#71717a' }` for unknown database types. This permanently prevents UI crashes due to missing keys in `ISSUE_CONFIG` (such as the deleted `'Incidents'` key).
- **JSX Structural Nesting (`NinjaTaskforce.js`):** Corrected an unbalanced `AnimatePresence` nesting structure (where a trailing modal escaped its container div, causing Babel parser errors) ensuring the project compiles cleanly under `npm start`.

### 18.5 Key Files Modified
| File | Changes Made |
|---|---|
| `Rama Sir backend/server.js` | Removed `/api/point/:dp_id` mock issues branch. |
| `Rama Sir backend/tileEngine.js` | Removed mock category mapping override in R-Tree initialization. |
| `src/App.js` | Purged `generateMockIssues()`, `NINJAS` array, `ISSUES` constant. Switched ninja viewport filtering to `unclustered-point` layer query. Synchronized `NinjaAvatar` palette with deterministic roster colors. |
| `src/components/AreaIntelligence.js` | Purged `MOCK_LEADERBOARDS`, added rankings "In Development" pulse view, added null-safe fallback icons to challenges & assets. |
| `src/components/NinjaTaskforce.js` | Removed `COMMUNITIES`, refactored roster cards to use deterministic initials, cleaned up unused imports, and corrected nested JSX elements. |

### 18.6 Next Agent Priorities
1. **Push to Railway:** Push the updated `server.js`, `tileEngine.js`, `App.js`, `AreaIntelligence.js`, and `NinjaTaskforce.js` to the `samaajdata-backend` production repository.
2. **Telemetry Calibration:** Replace the rankings "In Development" view in `AreaIntelligence.js` with dynamic queries to a leaderboard/rankings endpoint once a real-time calibration engine is built.

---

## 19. Semantic Action Classification, Unified Map Clusters & Premium Filter Overhaul *(Session: May 17, 2026 — Night Session)*

### 19.1 Session Goals & Outcomes
This session delivered on highly detailed, enterprise-grade refinements to the civic actions reporting panel, resolved visual overlapping issues between floating map filters and the chatbot panel, corrected critical map cluster disappearance bugs, and integrated customized visual marker iconography.

### 19.2 Civic Action Classification & Granular Breakdown
- **Action Decoupling:** Replaced the generic "Field Work" and "Field Audits" grouped classifications in `AreaIntelligence.js` with a high-fidelity granular breakdown. Dynamic viewport actions are now extrapolated and shown individually by their precise database types (e.g. `"Hands-on Action"`, `"Solutions & Prototypes"`, `"Investigation & Audit"`, `"Reporting & Mapping"`).
- **MOMENTUM Metric:** Formally renamed "ACTIONS" to **"MOMENTUM"**, powered strictly by community-centric engagement categories, styled with a high-contrast purple pulse `⚡` to indicate active community motion.
- **Smart Formatting:** Integrated `formatMetric()` into all high-level widgets (abbreviating counts like `858K`, `1.1M` at wide zoom, whilst keeping exact counts visible via desktop tooltips (`title` attribute) and rendering precise, raw counts for numbers `< 10k`), effectively eliminating layout flex drift.
- **Ninja Leak Resolution:** Resolved the bug where "Solve Ninjas" items leaked into Active Challenges. Switched the filter to a case-insensitive substring predicate check (`.toLowerCase().includes('ninja')`), successfully matching and excluding all database ninja tasks (`'Solve Ninjas'`) from challenges.

### 19.3 Visual Stack and Layering Optimization
- **Z-Index Layering:** Raised the "More" filters dropdown container to `z-[600]` and lowered the `OmniSearch` chatbot entry bar container to `z-[400]`. This guarantees that the filters dropdown always renders cleanly on top of the chatbot panel, fully eliminating overlap conflicts.
- **Map Filter Dropdown Redesign:** Overhauled the filters dropdown panel (increased to a wider, premium 300px layout) into two distinct segments:
  - **Civic Domains:** A multi-select checklist of active municipal domains mapped with custom high-fidelity icons and count indicators.
  - **Action Topics in view:** A single-select searchable topic manifest fetched live from the backend database's viewport bounding box.

### 19.4 Routing Isolation & Unified Cluster Engine
- **Independent Query Parameters:** Fixed a major bug where secondary filters caused map points to completely vanish upon zoom-out. Separated filter query structures: primary facility types populate the `category` endpoint parameter, and secondary action domains populate `actionCat`.
- **Unified Dark Clusters:** Restored action cluster visual layers (`action-clusters`, `action-cluster-count`, `action-clusters-shadow`) and mapped them to the same dark, low-contrast premium visual palette as facility clusters. Fully preserved separate action spiderfy branches, click ease animations, and cursor pointer events.
- **Custom Iconography:** Registered five subcategory-specific marker icons to dynamically replace the default green dots on the map and during spiderfy branches:
  - **Hands-on Action:** 🔧 Wrench (Emerald)
  - **Solutions & Prototypes:** 💡 Lightbulb (Cyan)
  - **Community & Engagement:** 👥 Users (Purple)
  - **Investigation & Audit:** 🔍 ScanSearch (Amber)
  - **Reporting & Mapping:** 🧭 Navigation (Red)

### 19.5 Key Files Modified
| File | Changes Made |
|---|---|
| `src/components/AreaIntelligence.js` | Upgraded classification engine to output granular individual action types instead of grouped labels. Implemented case-insensitive Ninja exclusion substring check. Configured `formatMetric()` text scaling with exact count title hovers. |
| `src/App.js` | Segregated primary and secondary filter URL generation. Restored action cluster layers with unified dark styling. Registered 5 custom action subcategory marker styles. Integrated wider 300px two-section filters dropdown. |
| `src/components/OmniSearch.js` | Lowered chatbot z-index to `z-[400]` to avoid filter dropdown overlaps. |

### 19.6 Next Agent Priorities
1. **Calibration of Real-Time Metrics:** Replace the local extrapolation logic with native DB count sums once aggregated classification endpoints are introduced to the telemetry backend.
2. **Leaderboard telemetry mapping:** Unify comparing charts with actual historical records from Indiranagar/Koramangala databases.

---

## 20. R-Tree Supercluster Unification, Absolute Z-Index Resolution, and Granular Multi-Filter Matrix Sync *(Session: May 18, 2026)*

### 20.1 Session Goals & Outcomes
This session resolved major geospatial pipeline consistency bugs, completed the backend unification of all geospatial indices into a single high-performance R-Tree supercluster pool, fixed visual filter leakage (where selecting an action filter failed to isolate the map data), and permanently resolved the visual overlap bug between the overlay filter dropdown and the OmniSearch chat widget.

### 20.2 Complete R-Tree Supercluster Unification (One Clustered Map)
- **Unified Backend R-Tree:** Replaced the legacy dual-index system (`clusterIndex` and `actionClusterIndex`) with a single global in-memory Supercluster index (`clusterIndex`) inside `tileEngine.js` containing both facility and action features. All tile requests are served through the unified `samaaj_points` PBF layer.
- **Unified Frontend Styling:** Purged all remaining emerald action-cluster layers (`action-clusters`, `action-clusters-shadow`, `action-cluster-count`) from Map 1 and Map 2. Both facility and action data now cluster dynamically inside a single dark gray (`#121212`) visual cluster pool (`clusters` and `clusters-2`).
- **Dynamic Icon Routing:** Map 2’s unclustered action markers were synchronized with Map 1, utilizing subcategory-aware WebGL icon expression routing (`coalesce` and subcategory check blocks) so custom marker styles (Wrench, Lightbulb, etc.) render properly on Map 2 and during Spiderfy expansions.
- **High-Performance Bounds API:** Purged the redundant `/expansionZoom` and `/leaves` `isAction` parameters. The `/bounds` spatial viewport query now runs in a single O(N) scan, evaluating action classifications in-memory on the fly.

### 20.3 Multi-Filter Matrix Sync & 'None' Sentinel
- **The Filter Leakage Bug:** Previously, selecting an action category filter (e.g. Waste Management) updated `actionCat` in the tile URL but left `category=all`. The backend loaded the full facility list alongside the filtered actions, rendering unrelated green points on the map.
- **The 'None' Sentinel solution:**
  - Implemented an `isActionOnlyView` evaluation in `App.js` for both viewports.
  - When only action-related filters (domain, type, or topic) are active without any primary facility filters (Trees, Toilets, Health, Water), the map tile URL passes `category=none`.
  - The backend `getTargetIndex` and vector tile routes evaluate this sentinel parameter to completely exclude all facility features (`return false`), resulting in a 100% accurate, isolated map view of the chosen action points.
  - Cleanly resolves all 8 filter matrices (facility-only, action-only, topic-only, mixed, and clear-all).

### 20.4 Filter Dropdown Layout & Topics Truncation Fixes
- **Layout Crash Fixed:** The Civic Domains list had no fixed height, squashing the Action Topics list out of the container when the screen height was short.
- **Advanced Scrollable Dropdown:** Upgraded the filters dropdown panel in `App.js` to a flex layout with a taller `max-h-[560px]` height. Mapped a scrollable `max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden` wrapper to the Civic Domains checklist section, ensuring both municipal domains and Action Topics remain scrollable and perfectly visible.

### 20.5 Absolute Z-Index Resolution (OmniSearch Stacking Fix)
- **Stacking Context Conflict:** Both the Map Filters Overlay and the OmniSearch chatbot widget resided inside the WebGL map container as siblings at `z-[400]`, causing the chat widget to overflow on top of the active dropdown menu.
- **The Solution:**
  - Raised the Map Filters Overlay container to `z-[600]` and its dropdown panel to `z-[700]`.
  - Lowered the OmniSearch chat container to `z-[300]`.
  - Engineered an elegant visual sync: OmniSearch is completely hidden (`!dropdownOpen`) when the filter dropdown is active, returning with a smooth Framer Motion entrance once the dropdown is closed, eliminating all overlap conflicts.

### 20.6 Key Files Modified
| File | Changes Made |
|---|---|
| `Rama Sir backend/tileEngine.js` | Merged datasets into a single in-memory `clusterIndex`. Added `'none'` sentinel parameter handling inside `getTargetIndex` to cleanly exclude facilities during action-only views. Purged redundant duplicate routes and parameters. |
| `src/App.js` | Purged all emerald action cluster layers. Mirrored subcategory-aware marker icons to Map 2. Upgraded filter sync logic to output `category=none` during action-only views (including topics and types). Overhauled More dropdown styles (scrollable flex sections, max heights). Configured OmniSearch toggle visibility during active dropdown states. |
| `src/components/OmniSearch.js` | Lowered component container z-index to `z-[300]`. |

### 20.7 Next Agent Priorities
1. **Calibration of Region Comparison telemetries:** Connect Region A and Region B data cards in the left panel to populate live, real-time comparisons (Ninja count, challenges count, and computed area health scores) using dynamic `/bounds` queries for each map's active viewport bounding boxes.
2. **Leaderboard Integration:** Calibrate the Rankings leaderboard engine to fetch authentic relative rankings based on municipal datasets.




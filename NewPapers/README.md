# New Papers — browser extension (Chrome, Edge, Firefox)

New Papers shows newly published papers that match your saved search topics each time the browser starts. It searches preprints (bioRxiv, medRxiv, Research Square… through Europe PMC), PubMed, OpenAlex and, optionally, arXiv q-bio. Results are grouped by topic, de-duplicated across sources and runs, and nothing you dismiss comes back.

One code base (Manifest V3) is built into separate packages for Chrome, Edge and Firefox.

## Install

Pre-built packages are committed in `dist/packages/`: `new-papers-chrome-1.0.0.zip`, `new-papers-edge-1.0.0.zip`, `new-papers-firefox-1.0.0.xpi` and `new-papers-source-1.0.0.zip` (source for store review). Unzip the Chrome or Edge package to load it unpacked. To rebuild them, or to get the unpacked folders `dist/chrome/`, `dist/edge/` and `dist/firefox/`, run `npm run package` (see below).

### Chrome
1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the `dist/chrome` folder.
4. Optional: pin **New Papers** from the puzzle-piece menu so the unread badge stays visible.

### Microsoft Edge
1. Open `edge://extensions`.
2. Turn on **Developer mode** (left sidebar).
3. Click **Load unpacked** and select the `dist/edge` folder.

### Firefox
- **Temporary (any Firefox edition, removed on restart):** open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on…** and select `dist/firefox/manifest.json` or `dist/packages/new-papers-firefox-1.0.0.xpi`.
- **Permanent:** regular Firefox only installs signed add-ons. Either submit the `.xpi` to addons.mozilla.org for signing (it can be signed as "unlisted"), or, in Firefox ESR, Developer Edition or Nightly, set `xpinstall.signatures.required` to `false` in `about:config` and open the `.xpi` file.
- Firefox may ask you to allow access to the API sites. If the options page shows **Grant access**, click it.

Requires Chrome or Edge 116+ and Firefox 140+ (Firefox for Android 142+).

## Use
1. Open the options (toolbar icon → gear) and **Add topic**. Give it a name and a query, e.g.
   `GPR182 OR ACKR5 OR "G protein-coupled receptor 182"`.
   The query syntax is: words, `"quoted phrases"`, `AND`, `OR`, `NOT` (uppercase) and parentheses. Words next to each other are combined with AND.
2. A new topic first searches the **last 2 months**.
3. On **every browser start** the extension:
   - fetches what is new since each source's last successful check, with a 3-day overlap to catch late-indexed papers;
   - merges the results with the entries you haven't dismissed;
   - opens a small results window and updates the badge.
4. Each entry has a dismiss button (✕), and each topic has **Dismiss all**. Dismissed papers never reappear, including other versions of them (for example the journal version of a dismissed preprint).
5. **Refresh now** in the popup checks again on demand. The header shows when the last check ran.
6. If a source fails or you're offline, the list is kept, a small warning appears, and the source is retried on the next start from its last successful date.
7. **History** (next to Refresh now) lists the last 10 checks with date and time, what started each one, and how long it took. For each topic and source it shows whether the search worked, how many results it returned, the date window it searched and the error the API gave (for example `HTTP 503: Search service is temporarily unavailable`). Esc closes it.
8. **To read:** the bookmark button on a paper saves it to the **To read** tab, and the paper gets a small blue *To read* tag. Saved papers stay in To read even after you dismiss them from their topic, or delete the topic. Click the bookmark again, or ✕ in the To read tab, to remove a paper from the list.
9. **Select** (in the bar above the list) shows a checkbox on each paper, so you can pick several and **Dismiss** them or add them **To read** in one go. In the To read tab the same mode removes several papers. **All** selects the whole list. Esc or **Done** leaves selection mode.

### Options
- **Topics:** add, edit, rename, delete, and reorder (drag or arrow buttons). Each topic can turn individual sources on or off.
- **Sources:**
  - global on/off switches (arXiv is off by default)
  - Europe PMC scope: preprints only, or preprints plus PubMed records
  - contact email: sent as `mailto` to OpenAlex and as `email` to NCBI and Europe PMC
  - optional NCBI API key (raises the PubMed limit from 3 to 10 requests/s)
  - optional OpenAlex API key (see the OpenAlex note under Data sources)
- **Startup:** open the window every time, only when there are new papers, or never (badge only).
- **Links:** by default a paper opens in a **background tab**, so the popup or results window stays open and you can open several papers in a row. Opened entries are marked "✓ Opened". Alternatively, choose to switch to the new tab (the toolbar popup then closes, as browsers close popups when they lose focus).
- **Appearance:** 8 themes (Claude Light, Slate, Forest, High Contrast Light, Claude Dark, Ocean, Dusk, High Contrast Dark), or **Auto**, which follows the system using a light/dark pair you choose.
- **Data:** export or import topics, the To read list and settings as JSON. API keys are left out of exports unless you tick the box.

## Data sources
Each source is an adapter in `src/lib/sources/` with the interface `search(query, fromDate, toDate, ctx) → normalized records[]`. To add a source, write an adapter and list it in `src/lib/sources/index.js`.

| Source | Endpoint | Query and date filter | Limits |
|---|---|---|---|
| Europe PMC | `ebi.ac.uk/europepmc/webservices/rest/search` | `(<query>) AND SRC:PPR AND FIRST_PDATE:[from TO to]`, `resultType=core`, cursor paging | ~5 req/s used |
| PubMed | E-utilities `esearch` → `esummary` → `efetch` (abstracts) | `datetype=edat`, `mindate`/`maxdate` | 3 req/s, or 10 req/s with an API key (enforced) |
| OpenAlex | `api.openalex.org/works` | `filter=title_and_abstract.search:<query>,from_publication_date:…,to_publication_date:…,type:article\|preprint\|review\|letter` | Without a key: a small free daily budget shared per IP |
| arXiv | `export.arxiv.org/api/query` | fully parenthesized `all:` terms, `ANDNOT`, q-bio categories, `submittedDate:[…]` | 1 request per 3 s (3.5 s used) |

Notes from checking the APIs (October 2026):
- The bioRxiv API has no keyword search, so preprints come from Europe PMC.
- bioRxiv DOIs now also use the `10.64898` prefix.
- OpenAlex `from_created_date` needs a paid plan, so publication dates plus the overlap window are used. Crossref is not used.
- arXiv groups unparenthesized operators to the right, so the adapter always adds parentheses.

## How it works
- **Storage (`storage.local`):**
  - `topics`
  - `lastChecked` (per topic, per source, plus the query it applies to: editing a query restarts the 2-month window)
  - `entries` (per topic)
  - `dismissed` (per topic: identity key → timestamp)
  - `settings`
  - `meta` (last run, errors)
- **Storage limits:** entries are capped at 300 per topic, and dismissed keys older than one year are pruned.
- **Deduplication:** each record gets identity keys: normalized DOI, PMID, arXiv id, and normalized title + first author's last name. Records sharing any key merge into one entry. Europe PMC "Preprint of" links (PMID) and OpenAlex alternate-location DOIs also join a preprint with its published version. That entry shows both a **Preprint** and a **Journal** link.
- **Dismissal:** stores every key of the entry, and keys learned later (for example the journal DOI) are added, so the paper stays hidden whichever version or source returns it.
- **Background:**
  - Chrome/Edge use a service worker; Firefox uses `background.scripts` (an event page).
  - The background script is the only writer of entries and dismissals; the UI sends messages.
  - Checks requested while one is running are queued, not dropped.
- **Startup window:** `windows.create({type: "popup"})` is used instead of `action.openPopup()`, which needs a user gesture. Clicking the toolbar icon shows the same UI as a normal popup.
- **What counts as a "start":** `runtime.onStartup` alone is not enough in Edge.
  - With **Startup boost**, Edge starts in the background at login, without a window. The results window then opens together with the first browser window.
  - With **"Continue running background extensions and apps when Microsoft Edge is closed"**, the browser never really quits. Opening the first window after all were closed is treated as a new start: the extension checks again and opens the window.
  - At a normal start the window opens about 1.5 s after the first browser window and takes focus, so tab restore doesn't cover it.
- **Permissions:** `storage` plus the four API hosts. No remote code is loaded; everything is bundled with esbuild (readable, not minified). `webextension-polyfill` provides `browser.*`.

## Develop
```bash
# Node.js 20+ on PATH
npm install
npm run build            # dist/chrome, dist/edge, dist/firefox
npm run package          # + dist/packages/*.zip / *.xpi and a source zip
npm test                 # unit tests (recorded API fixtures)
npm run lint:firefox     # web-ext lint
npm run run:firefox      # web-ext run in Firefox
npm run test:e2e:chrome  # live E2E in Chrome for Testing (EXT=edge to load the Edge build)
npm run test:e2e:firefox # live E2E in Firefox over WebDriver BiDi (needs npm run package)
npm run fixtures         # re-record API fixtures from the live APIs
node scripts/make-icons.mjs  # re-render PNG icons from src/icons/icon.svg
```
The Chrome tests use Chrome for Testing because branded Chrome 137+ ignores `--load-extension`. It is found in a `Tools/chrome-for-testing/current/chrome-linux64/` folder beside any parent folder of the project. Override the path with `CHROME_PATH`, or the Firefox path with `FIREFOX_PATH`.

`design-proposals.html` is the approved design: all 8 themes with sample data.

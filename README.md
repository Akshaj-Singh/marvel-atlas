# MARVEL ATLAS V4 — The screen Marvel connection explorer

**A complete, deployable build of this curated corpus.** This is a substantial screen-Marvel learning graph, **not a claim to have collected every Marvel fact or independently verified all internet observations**. The user-provided archive is intact, and all indexed projects have named contextual threads. This is a fan-created educational resource, not affiliated with Marvel or Disney.

## Run it immediately

1. For the fastest trial, open the separately provided **`Marvel_Atlas_v4_Standalone.html`**: the complete website and all of its data are embedded in one file. Alternatively, extract **Marvel_Atlas_v4.zip** for editable code.
2. In the editable version, keep `index.html` and every `.js`/`.css` file in the same folder.
3. Double-click `index.html` in a modern desktop browser (Chrome, Firefox, Edge or Safari). The site has no external runtime dependencies, API keys, database, login or server. It can also be hosted statically.
4. For the whole spoiler-rich experience click **Reveal the complete graph** on the left. To avoid plot revelations, leave the default **New fan** setting instead.
5. Enter **Age of Ultron**, **Infinity War**, **Endgame**, **WandaVision**, **Agatha All Along**, **VisionQuest**, **Ten Rings**, **Human Torch** or **Doomsday** in search.
6. Click a project **→ Story threads** for sequential explanations, callbacks, visual parallels, post-credit scenes, Easter eggs and music; click a specific relationship to open its explanation. **All links** exposes *every* edge, including character/performer connections.

## What V4 actually contains

The results of `node tests/validate_v4.js` (see `tests/coverage.json`) measure the exact included corpus:

| Item | Included |
|---|---:|
| Indexed films, shows, specials and shorts | 118 |
| All graph entities, including films, characters, actors, discoveries, props, events and music | 793 |
| Typed explanatory relationships | 3,083 |
| Explicitly titled story / production threads (`thread-*` nodes) | 145 |
| Supplied callback comparison cards | 50, all retained |
| Cross-project callback comparisons | 45 |
| Within-a-single-project callback comparisons | 5 |
| Supplied original CSV observations | 1,380, all retained |
| Exact named cross-reference discoveries extracted from the CSV | 121 |
| Additional specific post-credit, Easter egg and music cards (`detail-*` nodes) | 57 |
| Individual edges labeled Marvel official with an official URL in the dataset | 145 |

**What counts mean:** A relationship can be character-to-project, cast-to-character, story-to-project, direct project-to-project, cross-reference, or collection membership. **3,083 is not the number of independently confirmed Easter eggs, and 118 is not every Marvel film or series ever made.** A single story thread may have multiple edges so it is usable both as a node and as a direct film-to-film line. Verified-data counts do not imply that other edges are necessarily false; they mean that they were not independently fact-checked for this publication.

### Core storylines

- **Iron Man → The Avengers → Age of Ultron → Civil War → Infinity War → Endgame**: the suit, the Ten Rings organization, the initiative, Tony's and Steve's conflict, the Infinity Stones, the Sokovia Accords, Wanda, Ultron, the Snap, the Time Heist and character payoffs.
- **Age of Ultron → Infinity War → WandaVision → Agatha All Along → VisionQuest**: Vision's creation, Mind Stone, Wanda's grief, Westview, the Witches' Road, White Vision and returning Ultron. **VisionQuest story predictions are not included as facts.** Official Marvel announcement: https://www.marvel.com/articles/tv-shows/marvel-television-visionquest-release-date
- **The Incredible Hulk / Black Widow / Hawkeye / Thunderbolts and Daredevil-related TV**: relevant supporting characters and consequences.
- **Thor, Loki, Guardians and Captain Marvel**: Stone locations, TVA variants, cosmic story, Guardians songs and their musical callbacks.
- **Fox Fantastic Four → 2005 Johnny Storm → Deadpool & Wolverine**: Chris Evans's Johnny Storm is not conflated with Steve Rogers or Joseph Quinn's 2025 Johnny Storm.
- **Iron Man (2008) → Ten Rings organization → Trevor Slattery / All Hail the King → Wenwu → mystical Ten Rings → Shang-Chi**: the real criminal network is distinct from its mystical weapons.
- **Doomsday**: announced performers and their characters, separately labeled unconfirmed fan-wiki credits, and links back to prior released films. Do not interpret a casting connection as proof of an upcoming scene, death or shared continuity.
- **Older Fox films / Netflix / 1990s animated X-Men / live-action Sony / Spider-Verse**: connected as adaptation, production and alternate universe relationships *without silently merging continuities*.

### The callbacks originally supplied

All 50 user-supplied write-ups are present in `data.js`, with **their original text preserved**. In `narrative.js`, each has a separate corrected editorial summary and an explicit array of actual film or series endpoints; 45 have at least two distinct project endpoints and five genuinely belong to a single production. A few source notes incorrectly suggest exact repeated wording, so the editorial layer uses *dialogue callback*, *visual parallel*, *thematic reading*, or *same-film repeat* as appropriate. These observations **are not all sourced verbatim** against scripts or interviews. Consult the original observations from the card's **Discoveries** tab before repeating one as a historical claim.

### Importing the 1,380 original facts

`data.js` retains the entire CSV corpus and all 50 supplied notes. Use the project dossier's **Discoveries** tab to browse all 1,380 original CSV observations without truncating the archive. Full-text search also indexes their words (subject to current spoiler settings). The optional reproducible `build_fact_bridges.py` extracts a strict subset of **121 notes that explicitly name a different indexed Marvel production** and writes first-class discoveries to `fact_bridges.js`; `bridge_runtime.js` adds their direct explanatory links. This conservative extraction avoids fabricating inter-project links from ungrounded assumptions. Unqualified facts are still visible as imported notes, not falsely elevated to canon.

### New investigation layer

`narrative.js` is the main set of **145 hand-edited events, story threads and corrected callback relationships**. `extras.js` adds **57 distinct cards** about Easter eggs, post-credit scenes and musical cues. The movie-to-movie and note-to-movie edges are deliberately redundant so a click on a **line** is as useful as a click on the note itself. Source URLs are attached selectively to individual relationships. Check them before citing.

## Interaction guide

- **Drag** the backdrop to pan. **Scroll / pinch** to zoom. **Click a node or line** for its dossier.
- **Global / Focus / Timeline** in the sidebar. Focus shows the strongest 55 direct neighbors initially for busy movies such as Endgame. This is a **display cap only**, not a data deletion: every indexed connection remains in **All links** and the connection finder.
- **Story threads** groups actual narrative links: continuations, callbacks, visual parallels, crossovers, **post-credit scenes, Easter eggs**, artifacts and musical connections.
- **All links** indexes the complete typed edge collection with each relationship opening its own detailed, provenance-labeled dossier.
- **Spoiler protection** defaults to level 0. Full spoilers require a deliberate opt-in; hidden edges are excluded from the newcomer map and pathfinder.
- **Connection finder**: open the first entity, click **Find path from here**, then search/select a second entity to view the shortest *recorded* route. The route avoids catalogue-only links and blocks unrevealed spoilers. A missing path is not proof that two projects are canonically unrelated.
- **Continuity filters** mean studio/adaptation collections, not declarations of shared universe. **Share link** copies a `#node-id` link, useful on GitHub Pages.

## Files

| File | Purpose |
|---|---|
| `index.html` | Complete site markup and script load order |
| `style.css` | Responsive dark cosmic UI |
| `app.js` | Canvas drawing, search, click and line hit-testing, dossier tabs, pathfinder, filters, safety controls |
| `data.js` | Indexed production registry, original facts and supplied callback notes |
| `curated.js` | Prior curated relationships |
| `lore.js` | Expanded people, Doomsday casting, Ten Rings, multiverse and studio-context layer |
| `narrative.js` | New cross-film story-beat events and corrected 50-card callback mapping |
| `fact_bridges.js` | Parsed exact cross-title user-archive discoveries |
| `bridge_runtime.js` | Converts source→reference→destination observations into clickable graph nodes/edges |
| `extras.js` | Post-credits, scene echoes, Easter eggs and songs |
| `sources/` | The **exact supplied original** research files and research notes |
| `tests/validate_v4.js` | Schema, duplicate-ID, linked-endpoint and coverage tests |
| `tests/browser_v4.py` | Desktop and mobile headless Chromium tests |
| `tests/coverage.json` | Generated corpus metrics |
| `build_data.py` | Optional base import (do **not** rerun casually; regenerates `data.js`) |
| `build_fact_bridges.py` | Optional controlled regeneration of the exact-title CSV link layer |

### Extending the archive

The newest human-readable layer is `extras.js`. Use its `note()` helper for a specific event or music discovery, with a precise explanation, relevant project ids, spoiler setting, and source URL when a source truly supports the claim. Use `narrative.js`'s `story()` helper for a sustained, named plot connection across multiple projects. Add source/target nodes first if a new production or character is missing. Run the validator after each substantial batch. **Never give two concepts the same node id**. Never use `catalogue` relationships as evidence of canon.

## Deploy to GitHub Pages

1. Make a public GitHub repository, e.g. `marvel-atlas`.
2. Upload the **contents of the extracted folder**, not the ZIP and not an outer folder. `index.html` must appear in the repository root next to all the `.js` and `.css` files.
3. Open **Settings → Pages → Build and deployment → Deploy from a branch**. Select **main** and **/(root)** and save.
4. Wait for Pages to report your `https://<username>.github.io/<repository>/` address. Visiting that URL loads the app and its relative data scripts.
5. To update, replace and commit the edited source files; no build pipeline is needed. No website runtime contacts Fandom, Marvel, or Reddit.

## Testing

Execute locally from the extracted folder:

```bash
node tests/validate_v4.js
python tests/browser_v4.py
python tests/validate_static.py
```

The first command requires Node.js for **testing only**; visitors don't need it. The second additionally requires the Python `playwright` package and a Chromium executable (the bundled script currently uses `/usr/bin/chromium`; adjust this path for your machine). Website deployment requires **neither Node nor Python**.

## Research provenance and limits

- Official Marvel announcements, where relevant, are linked individually (see `sources/RESEARCH_V4.md`). Marvel confirmed that VisionQuest is the final installment of the television trilogy and returns James Spader as Ultron; **as of this October 2, 2026 archive**, the series has not premiered.
- A URL to a fan-maintained Marvel Wiki page is **community documentation**, not an official Marvel statement. Future casting and unverified fan-wiki listings remain separate from announced performers.
- Reader-supplied annotations, unreferenced dialogue wording, unverified behind-the-scenes legends, and themes are marked **EDITORIAL / SUPPLIED**. Do not use them as verified dialogue transcripts.
- Some source notes are interpretative parallels, not intentional creator callbacks. The atlas explicitly distinguishes *similarity*, *story continuation*, *recorded cameo* and *same fictional timeline*.
- This is a finite, documented corpus, **not an exhaustive catalogue of every animated short, Easter egg, character variant, source interview or future film**. Treat “complete” as a coherent, working and validated edition of this dataset, not an impossible guarantee of all Marvel information ever published.

All project descriptions and dialogue snippets are short, paraphrased observations, not reproductions of complete copyrighted scripts.



TODO
wikiracer kinda seprate option 
 C&D has no connection with Luke Cage. O'Reilly and Misty reference each other and Cloak reads a newsp...

 

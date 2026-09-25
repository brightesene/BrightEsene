# Studio Esene — App Design System

This document covers the visual identity of the Studio Esene internal
application, the proposed employee and admin interfaces, and the reusable
components that every module (Time, Planning, Materials, QR, Photos, Tasks,
Documents, Expenses, Inventory, …) must use.

Live reference: run the app and open **`/design`**.

---

## 1. Website analysis

> **Status: not verified against the live site.**
> `studio-esene.be` could not be reached from the build environment (the
> network policy blocked the host). The identity below comes from what is
> publicly known about the studio: an Antwerp studio for *timeless,
> luxurious interior design and painting*. Every value that must be checked
> against the website is marked `[VERIFY]` in
> `src/core/design-system/tokens.css`. Checking it takes one pass through
> that file.

### Visual language assumed

| Aspect | Assumption for an architectural interior studio | Token(s) |
|---|---|---|
| Typography | An editorial serif for names and titles, with a geometric sans for UI, labels and figures | `--se-font-display`, `--se-font-sans` |
| Weights | Light for large display text and numerals; regular for body; medium only for tiny uppercase labels | `--se-weight-*` |
| Heading hierarchy | A small uppercase tracked eyebrow, then a large light serif title | `.se-eyebrow`, `.se-title` |
| Colours | Warm plaster/limewash neutrals with near-black ink and one muted bronze/oak accent. No saturated colours | `--se-color-*` |
| Buttons | Square, thin ink outline or solid ink, uppercase, wide letter-spacing | `.se-button` |
| Borders | 1px hairlines in warm stone; no heavy boxes | `--se-border-*` |
| Radius | None (architectural). 2px exists but isn't used by default | `--se-radius-*` |
| Shadows | None, except one soft shadow under overlays | `--se-shadow-*` |
| Whitespace | Generous: sections separated by 48–64px and a hairline | `--se-space-*` |
| Imagery | Photography should run full-bleed and square-cornered, without filters or overlays (future Photos module) | — |

### Verification checklist (when the site is reachable)

1. Get the font families from the site's CSS or Google Fonts link and set `--se-font-display` / `--se-font-sans`, plus the `<link>` in `index.html`.
2. Sample the page background, text and accent colours. Update `--se-color-paper`, `--se-color-ink` and `--se-color-accent`.
3. Compare button shape, letter-spacing and case. Adjust `--se-radius-*`, `--se-tracking-label` and `.se-button`.
4. Compare the wordmark treatment with `.se-wordmark`, or swap in an SVG logo in `StudioEseneWordmark`.
5. Check heading sizes against `--se-text-*`.

No screen code needs to change for any of these.

---

## 2. Design system

### Principles

- **Typography, spacing, scale and alignment make the hierarchy**, not boxes, icons or colour.
- **Hairlines instead of cards.** A section is a 1px rule plus an uppercase label (`StudioEseneSection`). Use `StudioEseneCard` only for one focal object on a screen.
- **Large light numerals** carry dashboards (`StudioEseneFigure`). No decorative charts.
- **Status colour is quiet**: a 6px dot and a small uppercase label in desaturated sage, ochre or terracotta.
- **One dominant action per screen.**
- **No icons** in navigation; words are clearer and fit the brand.

### Tokens — `src/core/design-system/tokens.css`

| Group | Tokens |
|---|---|
| Colour | `paper`, `paper-raised`, `plaster`, `stone`, `stone-strong`, `taupe`, `ink-soft`, `ink`, `accent`, plus semantic aliases (`bg`, `surface`, `text`, `text-strong`, `text-muted`, `border`, …) |
| Status | `ok` (sage), `warning` (ochre), `danger` (terracotta), `neutral` (taupe), each with a `-bg` tint |
| Typography | `font-display`, `font-sans`, weights, scale `2xs → 4xl`, leading, tracking |
| Spacing | `space-1 … space-9` (4px base), `gutter`, `content-max`, `content-narrow` |
| Radius | `none`, `sm`, `pill` (status dots only) |
| Borders | `border-hairline`, `border-strong`, `border-ink` |
| Shadows | `shadow-none`, `shadow-overlay` |
| Controls | `control-height` (48), `control-height-sm` (36), `control-height-hero` (72) |
| Motion / layers | `ease`, `duration`, `z-nav`, `z-modal` |

Styles load in the order `tokens.css → base.css → components.css` (via
`styles.css`). Component CSS reads tokens only, and screens contain no styling.

---

## 3. Employee interface (mobile-first)

Used one-handed on a site, understood in about two seconds.

**Navigation:** a fixed bottom tab bar with three text items (TODAY · HOURS · PROFILE) at thumb reach. The wordmark sits alone at the top.

**TODAY (default)** has three states, and the primary button is always the dominant element:

```
STUDIO ESENE                         STUDIO ESENE

Good morning,                        ● YOU ARE WORKING
Maksym
                                     08:02
TODAY
24 SEPTEMBER 2026                    APARTMENT LEUVEN
─────────────────                    Naamsesteenweg 112, 3000 Leuven
Apartment Leuven                     ─────────────────
Naamsesteenweg 112                   STARTED   TODAY     LOCATION
3000 Leuven                          08:02     3h 42m    ● VERIFIED

43 m from project                    ┌───────────────────────┐
● LOCATION VERIFIED                  │       CHECK OUT       │
┌───────────────────────┐            └───────────────────────┘
│       CHECK IN        │
└───────────────────────┘
TODAY    HOURS    PROFILE            TODAY    HOURS    PROFILE
```

After checking out, the screen shows the registered times and a *Check in again* action.
When the employee is outside the GPS radius they can still check in. The
screen says *Outside project area — will be reviewed* and the admin receives
an exception, so the employee is never blocked on site.

**HOURS** shows this week and this month as two figures, then the last four weeks. Each week has a hairline, a total, and one row per day (project, in → out, total, status).

**PROFILE** shows the name, employee number, email, phone, language (NL / EN / FR / UK) and sign out. It has no admin settings.

---

## 4. Admin interface (desktop-first, responsive)

**Navigation:** the wordmark on the left and text links on the right (OVERVIEW · TIME · PROJECTS · EMPLOYEES · REPORTS · EXCEPTIONS · SETTINGS). An ochre count marks open exceptions. Below 1024px the links move beneath the wordmark into a single scrolling row, so it still works on an iPhone.

| Screen | Content |
|---|---|
| **Overview** | A weekday eyebrow and "Good morning, Bright". **Today** shows Working / Finished / Not started / Registered today as large numerals. **Currently working** lists name, project, `08:02 → now`, the running total and location status. **Attention** shows counts per exception type and a Review link. Then the *Finished* and *Not started* lists. Answers: who, where, since when, is anything wrong. |
| **Time** | Period control (Today · This week · This month · Custom, with dates), plus Employee / Project / Status filters. Summary figures, then a table: DATE · EMPLOYEE · PROJECT · ARRIVAL · DEPARTURE · BREAK · TOTAL · LOCATION · STATUS. Export button. On phones the table becomes compact two-column label/value blocks. |
| **Projects** | A table with project, city, status, budget, registered, and a thin progress rule with the % used. |
| **Project detail** | Project information (address, start date, team). **Time** shows Budget / Registered / Remaining and a 2px progress rule ("72.9% used"), which turns ochre above 90% and terracotta above 100%. **Today** lists each person with in → out and a total. |
| **Employees** | Name, role, today's state, current project, and hours this week and month. A row opens their time. |
| **Exceptions** | One calm row per issue: the name in serif, the type as a coloured label, key facts as a data list, and one action (VIEW for a GPS deviation, RESOLVE for a missing checkout). The modal approves or rejects, or sets the checkout time. Resolved items stay listed below, muted. |
| **Reports** | The latest monthly report as the one focal card ("August 2026 · Generated automatically 01 September 2026 · DOWNLOAD EXCEL"), then previous reports and a simple custom-report form. |
| **Settings** | Company name, GPS radius, automatic break rule, monthly report day. |

---

## 5. Components — `src/core/design-system`

| Component | Purpose |
|---|---|
| `StudioEseneAppShell` | Page frame: header, main area, optional tab bar |
| `StudioEseneNavigation` | `top` (wordmark and text links, collapses on phones) or `bottom` (three-item tab bar) |
| `StudioEsenePageHeader` | Eyebrow, serif title, meta, actions |
| `StudioEseneSection` | Hairline, uppercase label, optional aside. Replaces cards |
| `StudioEseneButton` | `primary` / `secondary` / `ghost`; sizes `sm` / `md` / `hero`; `block` |
| `StudioEseneInput`, `StudioEseneSelect` | Labelled fields with hint and error; 16px text (no iOS zoom) |
| `StudioEseneSegmented` | A choice among a few peer options (periods) |
| `StudioEseneCard` | A single focal surface. Never tiled |
| `StudioEseneTable` | Column config, row click, empty state. Stacks on phones; `hideOnMobile` per column |
| `StudioEseneStatus` | Dot and label; tones `ok` / `warning` / `danger` / `neutral`; `live`, `badge`, `plain` |
| `StudioEseneModal` | Bottom sheet on phones, centred panel on desktop; Esc and backdrop close it |
| `StudioEseneFigure` | Large light numeral with a label (`md` / `lg` / `xl`) |
| `StudioEseneProgress` | 2px architectural progress rule |
| `StudioEseneDataList` | Label/value pairs, optionally in columns |
| `StudioEseneList`, `StudioEseneListItem` | Hairline-separated rows: title and meta on the left, figures and status on the right |
| `StudioEseneStack`, `Row`, `Grid`, `Container`, `Divider` | Layout primitives driven by spacing tokens |
| `StudioEseneWordmark`, `Eyebrow`, `Title`, `Caps`, `Text` | Typography |

---

## 6. Rules for future modules

1. Put new modules in `src/modules/<name>/`. Import UI only from `@core/design-system`.
2. No module CSS files and no inline visual styles. If a pattern is missing, add it to the core system (tokens, then `components.css`, then a component) so every module gets it.
3. Each screen starts with `StudioEsenePageHeader` and groups content in `StudioEseneSection`s.
4. Employee-facing screens use `StudioEseneContainer narrow` and at most one `hero` button.
5. Status colour appears only through `StudioEseneStatus` and `StudioEseneProgress`.

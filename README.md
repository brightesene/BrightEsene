# Studio Esene — internal app

Employee time registration and the owner dashboard, built on the shared Studio Esene design system.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
```

| Route | What |
|---|---|
| `/` | Prototype sign-in (choose the employee or the owner) |
| `/employee` | Employee app: Today · Hours · Profile (mobile-first) |
| `/admin` | Admin: Overview · Time · Projects · Employees · Reports · Exceptions · Settings |
| `/design` | Live design-system reference |

## Structure

```
src/
  core/
    design-system/     tokens.css, base.css, components.css, React components (CORE, shared by all modules)
    lib/               formatting, clock hook, spreadsheet download
  modules/
    time/              time-tracking module: data (types, seed, store) + employee/ + admin/ screens
docs/DESIGN.md         website analysis, design system, interface proposals, component catalogue
```

## Prototype notes

- Data is seeded demo data kept in `localStorage`. It re-seeds daily and syncs between tabs, so an employee tab and an admin tab update each other. *Settings → Reset demo data* restores it.
- GPS is mocked (`locateNearProject` in `src/modules/time/data/store.tsx`). Replace it with `navigator.geolocation` and project coordinates.
- Excel downloads are UTF-8 CSV files with semicolon separators, which Excel for Belgium opens directly. Replace with server-generated `.xlsx` when the backend exists.
- Brand values still need checking against studio-esene.be; see `docs/DESIGN.md` §1.

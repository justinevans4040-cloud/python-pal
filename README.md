# Python Pal

**Live:** https://python-pal-mobile.justin-evans4040.chatgpt.site/  
**Stack:** React 18 · Vite 5 · Pyodide (Python in-browser) · Electron · Capacitor · localStorage · PWA

A bilingual (English/Spanish) beginner Python learning app. 19 progressive lessons, live code execution, rule-based offline tutor, XP tracking, streak calendar, and portfolio project briefs.

---

## Platforms

| Platform | Command | Output |
|----------|---------|--------|
| **Web (dev)** | `npm run dev` | http://localhost:5173 |
| **Web (production)** | `npm run build` → deploy `dist/` | Static host |
| **PC (dev)** | `npm run electron:dev` | Electron window |
| **PC (installer)** | `npm run electron:build` | `release/` → `.exe` / `.dmg` / `.AppImage` |
| **Android** | `npm run cap:android` | Opens Android Studio |
| **iOS** | `npm run cap:ios` | Opens Xcode (Mac required) |

---

## Quick Start

```bash
npm install
npm run dev          # web dev server
npm run electron:dev # desktop app (requires dev server running)
```

## PC Desktop Build (Windows `.exe`)

```bash
npm run build         # builds the Vite app first
npm run electron:build
# installer → release/Python Pal Setup 1.0.0.exe
```

> **Icon note:** Add `public/icon.ico` (256×256 min) before building the Windows installer.

## Android Build

**Requirements:** Android Studio, Java 17+, Android SDK 34

```bash
npm run build            # build web assets
npx cap add android      # first time only
npm run cap:android      # syncs + opens Android Studio
# In Android Studio: Build → Generate Signed Bundle/APK
```

## iOS Build

**Requirements:** macOS, Xcode 15+

```bash
npm run build
npx cap add ios          # first time only
npm run cap:ios          # syncs + opens Xcode
# In Xcode: Product → Archive
```

---

## Project Structure

```
electron/
  main.js              # Electron main process

public/
  python-worker.js     # Pyodide sandbox worker
  sw.js                # Service worker / offline cache
  icon.svg             # App icon (replace with .ico / .icns for builds)
  manifest.webmanifest # PWA manifest

src/
  data/
    lessons.js         # All 19 lessons, validators, badges, projects
  utils/
    storage.js         # localStorage + smart private-mode detection
  App.jsx              # Full app (responsive: mobile / desktop)
  index.css            # CSS — mobile-first + desktop sidebar layout
  main.jsx

capacitor.config.json  # Android + iOS config
```

---

## Layout

| Viewport | Navigation | Layout |
|----------|-----------|--------|
| < 1000px | Bottom bar | Mobile column |
| ≥ 1000px (desktop/Electron) | Left sidebar | Two-column, wider editor |

---

## Bug Fixes Applied (vs original deployment)

| # | Bug | Fix |
|---|-----|-----|
| 1 | Lesson 7 starter: expected "blue" but `colors[0]` prints "red" | Starter has `["red","blue"]` — student changes index only |
| 2 | Lesson 9 starter: `print(0)` can never produce `100` | Starter is `data = {"score":100}; print(data[""])` |
| 3 | localStorage corruption silently wiped all progress | Toast: "Your saved progress could not be read. Starting fresh." |
| 4 | Persist warning fired on dev/localhost (false positive) | Warning only fires when `localStorage` is genuinely blocked |
| 5 | Badges fully decorative (no unlock logic) | Real unlock conditions wired up in `lessons.js` |
| 6 | Portfolio project cards had no click handler | Cards open Capstone lesson in the code editor |
| 7 | Avatar hardcoded `JP` for every user | Initials derived from name collected at onboarding |
| 8 | AI Tutor implied a model loads | Replaced with guided rule-based tutor; clarified in UI |

---

## License

Private — © 2026 Justin Evans

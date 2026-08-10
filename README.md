# PYTHON PAL

**ForgeFront Systems — Bilingual Python Learning**

Python Pal is an interactive learning application for people beginning with Python. It combines English and Spanish learning modes, 19 progressive lessons, runnable Python exercises, a guided offline tutor, progress tracking, achievements, streaks, and portfolio project briefs in one focused learning workspace.

No account is required. Learner progress is stored locally on the device.

## Product platforms

| Platform | Implementation | Release path |
|---|---|---|
| Web / PWA | React + Vite | GitHub Pages workflow |
| Windows | Electron | NSIS desktop build and Microsoft Store APPX |
| Android | Capacitor | Release APK workflow |
| iOS | Capacitor | Xcode archive path |

## Core capabilities

- 19 progressive Python lessons
- English and Spanish learning modes
- Runnable Python exercises powered by Pyodide
- Guided lesson-aware tutor
- Browser-based Python playground
- XP, streaks, badges, and progress tracking
- Portfolio project briefs
- Responsive mobile and desktop layouts
- Local learner-state persistence
- Installable PWA support

## Repository map

```text
.
├── src/                         # Application UI, curriculum, and local-state logic
├── public/                      # PWA assets, service worker, Python worker, icons
├── electron/                    # Desktop shell and Windows Store build resources
├── store-submission/            # Microsoft Store listing copy and submission artwork
├── deployment/                  # Release identities, status, and platform records
├── .github/workflows/           # Web, desktop, Store, and Android automation
├── capacitor.config.json        # Android / iOS application configuration
├── CANONICAL.md                 # Source-of-truth and release rules
├── package.json                 # Application version and build configuration
└── vite.config.js               # Web build configuration
```

## Development

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Production web build:

```bash
npm run build
```

## Windows builds

Standard Windows installer:

```bash
npm run electron:build
```

Microsoft Store APPX:

```bash
npm run dist:appx
```

The Microsoft Store package identity and release record are maintained under `deployment/microsoft-store/`.

## Android

```bash
npm run build
npx cap sync android
```

The GitHub Actions Android workflow produces an **unsigned release APK** for build verification. Distribution signing material is intentionally not stored in the repository; a store-distribution APK must be signed with the protected Python Pal release key before publication.

## Release automation

- `deploy-web.yml` — builds and deploys the web application from `master`.
- `build-desktop.yml` — builds standard desktop installers for versioned releases.
- `build-microsoft-store.yml` — builds the Windows APPX package.
- `build-android.yml` — builds the unsigned Android release artifact for verification and downstream signing.

## Source policy

`master` is the authoritative Python Pal branch. Production application code, release configuration, store material, and deployment records belong in this repository. A release is not considered complete until its build path and platform identity are traceable from the repository.

## License

Proprietary software. Copyright © 2026 ForgeFront Systems.

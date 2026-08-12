# Python Pal

**ForgeFront Systems — Bilingual Python Learning**

Python Pal is a bilingual English/Spanish Python-learning application. The current canonical source contains 19 progressive lessons and 6 portfolio project briefs. The expanded curriculum requested later is **not present in this release**.

No account is required. Learner progress is stored locally on the device.

## Current repository state

- Canonical branch: `master`
- Canonical release commit: `995ecd116ef28d799fb95fecdff7b186a9289588`
- Application source version: `1.1.1`
- Microsoft Store replacement version: `1.1.1.0`
- Microsoft Store identity: `ForgeFrontSystems.PythonPal`
- Microsoft publisher: `CN=8E906094-1F36-496B-A889-858E25A1FCB3`

The 1.1.1 Store change fixes the desktop content-width cap that left large areas of wide screens empty. It preserves the black-and-gold Python Pal Store artwork and raises the package version above the withdrawn 1.1.0 package so it can replace it.

## Permanent binary release

The APK and APPX are stored as permanent assets in the GitHub release:

- [Python Pal v1.1.1 release](https://github.com/justinevans4040-cloud/python-pal/releases/tag/v1.1.1)
- [Android APK](https://github.com/justinevans4040-cloud/python-pal/releases/download/v1.1.1/Python-Pal-1.1.0-Correct-Store-Icon.apk)
- [Microsoft Store APPX](https://github.com/justinevans4040-cloud/python-pal/releases/download/v1.1.1/Python-Pal-Microsoft-Store-1.1.1.appx)
- [Release README](https://github.com/justinevans4040-cloud/python-pal/releases/download/v1.1.1/Python-Pal-v1.1.1-README.md)
- [SHA-256 checksums](https://github.com/justinevans4040-cloud/python-pal/releases/download/v1.1.1/SHA256SUMS.txt)

## Exact artifacts

### Android friend APK

- File: `Python-Pal-1.1.0-Correct-Store-Icon.apk`
- Package: `com.justindevstudio.pythonpal`
- Version: `1.1.0`
- Version code: `110`
- Source branch: `android-friend-release`
- Source commit: `bb1b09200cf29215ed0d670c7eb0e7e86cf143c9`
- SHA-256: `4b136d37fa593e0010c48e82ab626f86e664a63085cc4440cf454d342c86e74b`
- Status: signed universal release APK; signature, zip alignment, package badging, size, and checksum records are included in the release.

The signing key is not committed to the repository. The APK is the already-built signed friend-distribution artifact; rebuilding it will produce a different certificate unless the protected release key is supplied.

### Microsoft Store APPX

- File: `Python-Pal-Microsoft-Store-1.1.1.appx`
- Version: `1.1.1.0`
- Identity: `ForgeFrontSystems.PythonPal`
- Publisher: `CN=8E906094-1F36-496B-A889-858E25A1FCB3`
- Application ID: `PythonPal`
- Source fix branch: `microsoft-store-1.1.1-fix`
- Pre-merge build commit: `b88bdad75225a1f57b35453c77549d48dcdac5e4`
- SHA-256: `f7e85ce712f3e03cf568363e82256c2dd5c31e25ea9231b72171c886f72f493f`
- Status: APPX identity, publisher, version, package integrity, and four packaged icon references were verified.
- Store signing/approval: Microsoft Partner Center still performs the final Store ingestion/signing/approval step. This release asset is not evidence that Microsoft has approved it.

The four verified Store icon assets are `Square150x150Logo.png`, `Square44x44Logo.png`, `StoreLogo.png`, and `Wide310x150Logo.png`. They are the black-and-gold Python Pal artwork, not the blue P icon.

## What is and is not in this release

Included:

- 19 Python foundation lessons
- 6 portfolio project briefs
- English and Spanish modes
- Pyodide-based runnable exercises
- Guided tutor and browser playground
- XP, streaks, badges, and local progress
- Corrected black-and-gold icon pack
- Full-width desktop layout correction
- Signed Android friend APK
- Verified Microsoft Store APPX
- Build and checksum verification records

Not included:

- The expanded curriculum that was expected during review
- Microsoft Partner Center approval
- A private Android signing key in the repository
- A Microsoft Store certificate in the repository

## Repository map

```text
.
├── src/                         # Application UI, lessons, and local-state logic
├── public/                      # PWA assets, workers, and icons
├── electron/                    # Desktop shell and Store build resources
├── store-submission/            # Microsoft Store listing copy and artwork
├── deployment/                  # Release identities and platform records
├── .github/workflows/           # Web, desktop, Store, Android, and binary-release automation
├── CANONICAL.md                 # Source-of-truth and release rules
├── package.json                 # Application version and packaging configuration
└── vite.config.js               # Web build configuration
```

## Build paths

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
npm run build
npm run dist:appx
```

The normal `build-android.yml` workflow is an unsigned build-verification path. The signed friend APK in the v1.1.1 release was produced by the separate `android-friend-release` workflow and is already signed.

## Release automation

- `deploy-web.yml` — deploys the web application from `master`.
- `build-desktop.yml` — builds standard desktop installers.
- `build-microsoft-store.yml` — builds and verifies the Windows APPX.
- `build-android.yml` — builds the unsigned Android verification artifact.
- `publish-python-pal-release.yml` — archives the exact signed APK, verified APPX, and verification records into the permanent v1.1.1 GitHub release.

## Source policy

`master` is the authoritative Python Pal branch. Production code, release configuration, Store assets, deployment records, and binary-release documentation belong in this repository.

Proprietary software. Copyright © 2026 ForgeFront Systems.

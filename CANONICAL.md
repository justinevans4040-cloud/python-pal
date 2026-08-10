# Python Pal — Canonical Repository

This repository is the single source of truth for Python Pal.

## Production baseline

| Path | Role |
|---|---|
| `src/` | Application interface, lessons, progress, and learning logic |
| `public/` | PWA shell, service worker, Python worker, and application assets |
| `electron/` | Desktop application shell and Microsoft Store build resources |
| `capacitor.config.json` | Mobile application identity and Capacitor configuration |
| `package.json` | Application version, scripts, and desktop packaging configuration |

## Release tracks

| Platform | Canonical repository location |
|---|---|
| Web / PWA | `.github/workflows/deploy-web.yml` |
| Standard desktop | `.github/workflows/build-desktop.yml` |
| Microsoft Store | `deployment/microsoft-store/` and `.github/workflows/build-microsoft-store.yml` |
| Android | `.github/workflows/build-android.yml` and `capacitor.config.json` |
| Store artwork and listing copy | `store-submission/` |

## Repository rules

1. `master` is the authoritative production branch.
2. Product code, build configuration, release automation, store assets, and deployment records belong in this repository.
3. A production change must not exist only on a secondary branch.
4. Store identities are recorded exactly as assigned by the distribution platform; unverified values are not added.
5. Release records include version, package identity, artifact type, and publication status when available.
6. Secrets, signing keys, passwords, tokens, certificates, and private credentials are never committed.
7. `.env`, `.env.*`, and `*.local` files remain excluded from version control.
8. Store artwork and listing copy are maintained under `store-submission/` rather than duplicated across unrelated locations.
9. Build workflows must identify whether an artifact is unsigned, signed, development-only, or store-ready.
10. Historical material may be preserved, but it must not be presented as the current production baseline.

## Current application version

The production package version is defined in `package.json`. Platform releases must be generated from the same canonical source revision.

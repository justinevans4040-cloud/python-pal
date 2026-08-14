# Python Pal - Microsoft Partner Center Checklist

## Product record

| Field | Value |
|---|---|
| Product name | `Python Pal` |
| Product ID | `9PM5HBZQVRKW` |
| Package version | `1.1.1.0` |
| Package identity | `ForgeFrontSystems.PythonPal` |
| Publisher | `CN=8E906094-1F36-496B-A889-858E25A1FCB3` |
| Publisher display name | `ForgeFront Systems` |
| Application ID | `PythonPal` |
| Capability | `runFullTrust` |

Microsoft Partner Center reported the prior submission as successfully processed on **2026-08-08**. Use this checklist for the corrected `1.1.1` update package.

## Package

Build with:

```bash
npm ci
npm run dist:appx
```

Release workflow alignment:

| Item | Value |
|---|---|
| Source package version | `1.1.1` |
| APPX identity version | `1.1.1.0` |
| Store build workflow | `.github/workflows/build-microsoft-store.yml` |
| Store build branch | `microsoft-store-1.1.1-fix` |
| Uploaded workflow artifact | `Python-Pal-Microsoft-Store-1.1.1-Corrected` |
| Published release tag | `v1.1.1` |
| Published Store package asset | `Python-Pal-Microsoft-Store-1.1.1.appx` |
| Verification assets | `Store-verification.txt`, `AppxManifest.verified.xml` |

Verify the package identity, publisher, and `1.1.1.0` APPX version against Partner Center before submitting the update. Do not reuse the old `1.1.0` APPX package for this submission.

## Listing copy

Use `copy/listing-en-US.md` for the English (United States) listing.

## Screenshots

Upload from `images/screenshots/`:

1. `01-home-1920x1080.png`
2. `02-lesson-1920x1080.png`
3. `03-playground-1920x1080.png`
4. `04-tutor-1920x1080.png`

## Store artwork

Upload from `images/logos/` as required by Partner Center:

- `01-app-tile-300x300.png`
- `02-box-art-1x1-1080.png` or `03-box-art-1x1-2160.png`
- `04-poster-2x3-720x1080.png` or `05-poster-2x3-1440x2160.png`

Branding source artwork is preserved under `images/branding/`.

## Commerce

Pricing and market availability are controlled in Partner Center. Verify the existing configured values before any future submission; repository documentation does not override Partner Center commerce settings.

## Content rating

IARC Global Rating ID: `83996d1e-7b47-88d8-8180-3f738d12dff1`.

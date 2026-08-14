# Microsoft Store Release Record

## Product identity

| Field | Value |
|---|---|
| Product | `Python Pal` |
| Microsoft Store Product ID | `9PM5HBZQVRKW` |
| Package/Identity/Name | `ForgeFrontSystems.PythonPal` |
| Package/Identity/Publisher | `CN=8E906094-1F36-496B-A889-858E25A1FCB3` |
| Publisher display name | `ForgeFront Systems` |
| Application ID | `PythonPal` |
| Source package version | `1.1.1` |
| APPX identity version | `1.1.1.0` |

The package identity above is the identity used by the Windows APPX build configuration in `package.json`.

## Store status

Microsoft Partner Center reported the previous Python Pal submission as successfully processed on **2026-08-08**. The corrected Microsoft Store update package for this release is `1.1.1.0`.

A public Microsoft Store URL should be added here only after the listing URL has been independently verified.

## Content rating

| Field | Value |
|---|---|
| IARC Global Rating ID | `83996d1e-7b47-88d8-8180-3f738d12dff1` |
| Product title | `Python Pal` |
| Company | `ForgeFront Systems` |
| Rating date | `2026-08-06` |
| Storefront | `Microsoft` |

The IARC identifier applies to Python Pal and may be reused only where permitted by IARC and the participating storefront.

## Packaging

Generate the Microsoft Store package with:

```bash
npm ci
npm run dist:appx
```

Release workflow alignment:

| Item | Value |
|---|---|
| Store build workflow | `.github/workflows/build-microsoft-store.yml` |
| Store build branch | `microsoft-store-1.1.1-fix` |
| Workflow artifact name | `Python-Pal-Microsoft-Store-1.1.1-Corrected` |
| Published release workflow | `.github/workflows/publish-python-pal-release.yml` |
| Published release tag | `v1.1.1` |
| Published APPX asset | `Python-Pal-Microsoft-Store-1.1.1.appx` |
| Verification assets | `Store-verification.txt`, `AppxManifest.verified.xml` |
| Verified package SHA-256 | `f7e85ce712f3e03cf568363e82256c2dd5c31e25ea9231b72171c886f72f493f` |

The build workflow verifies `package.json` version `1.1.1`, APPX identity `ForgeFrontSystems.PythonPal`, publisher `CN=8E906094-1F36-496B-A889-858E25A1FCB3`, APPX version `1.1.1.0`, package integrity, and packaged icon references before uploading the Store artifact.

Before a future submission, verify the package version and Partner Center identity against the current product record. Do not change the Store identity to create an update package, and do not submit the old `1.1.0` APPX for the corrected `1.1.1` release.

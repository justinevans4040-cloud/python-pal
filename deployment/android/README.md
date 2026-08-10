# Android Release Record

## Application identity

| Field | Value |
|---|---|
| Product | `Python Pal` |
| Capacitor application ID | `com.justindevstudio.pythonpal` |
| Application name | `Python Pal` |
| Web directory | `dist` |

The Android application ID is defined in `capacitor.config.json` and must remain stable for updates to an existing store listing.

## Build path

The repository workflow `.github/workflows/build-android.yml` builds the Capacitor application as a release APK and uploads it as a GitHub Actions artifact.

The current workflow artifact is intentionally labeled **unsigned**. Release signing credentials and keystores are not stored in the repository.

A distribution package must be signed with the protected Python Pal release key before publication. Record the final signed artifact SHA-256, versionCode, versionName, signing-certificate fingerprint, store, and publication URL here when available.

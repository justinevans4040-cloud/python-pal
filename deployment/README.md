# Python Pal Deployment Index

This directory contains platform identity and release records for Python Pal.

- `microsoft-store/` — Microsoft Partner Center identity, IARC record, packaging, and publication status.
- `android/` — Android application identity, release-build status, and signing requirements.
- Web deployment automation is maintained in `.github/workflows/deploy-web.yml`.
- Standard desktop release automation is maintained in `.github/workflows/build-desktop.yml`.

Release records should preserve the application version, platform identifier, artifact type, exact package hash when available, publication date, and public listing URL when verified.

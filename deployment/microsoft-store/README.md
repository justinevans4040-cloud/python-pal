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
| Package version | `1.1.0` |

The package identity above is the identity used by the Windows APPX build configuration in `package.json`.

## Store status

Microsoft Partner Center reported the Python Pal submission as successfully processed on **2026-08-08**.

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

Expected artifact type: `.appx`.

Before a future submission, verify the package version and Partner Center identity against the current product record. Do not change the Store identity to create an update package.

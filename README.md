# Kamak Web

Angular 19 site and admin panel for Kamak Desarrollos.

## Setup

```bash
npm ci
npm start
```

Open `http://localhost:4200/`.

On Windows PowerShell, if script execution blocks `npm`, use `npm.cmd`:

```bash
npm.cmd ci
npm.cmd start
```

## Scripts

```bash
npm run build
npm run build:staging
npm test -- --watch=false --browsers=ChromeHeadless
npm run e2e
npm run e2e:ui
npm run optimize:images
```

## Runtime Config

Google Maps is loaded dynamically. Do not commit real API keys.

For local development, create `src/assets/config.local.json`:

```json
{
  "googleMapsApiKey": "your-restricted-browser-key"
}
```

For GitHub Pages, set the repository secret `GOOGLE_MAPS_API_KEY`; the deploy workflow writes `src/assets/config.js` during the build.

The key must be restricted in Google Cloud by domain and API.

## Verification

Before shipping changes, run:

```bash
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
npm run e2e
```
